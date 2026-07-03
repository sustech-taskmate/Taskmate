import {emit, listen} from "@tauri-apps/api/event";
import {exchangeLmsAuthCode} from "@/composable/serverRequest";

const CLIENT_ID = "taskmate-desktop";
const REDIRECT_URI = "taskmate://auth";
const AUTH_BASE_URL = import.meta.env.VITE_LMS_AUTH_BASE_URL ?? "http://localhost:3000";

export async function loginAuth() {
    const codeVerifier = randomBase64Url(32);
    const state = randomBase64Url(16);
    const codeChallenge = await sha256Base64Url(codeVerifier);
    sessionStorage.setItem("taskmate_pkce_verifier", codeVerifier);
    sessionStorage.setItem("taskmate_pkce_state", state);

    await listen<{ code?: string; state?: string; token?: string; url?: string }>('authenticate', async (event) => {
        const token = event.payload.token || await tokenFromCode(event.payload);
        if (!token) return;
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = function (key: string, newValue: any): void {
            const setItemEvent: CustomEvent = new CustomEvent("setToken", {
                detail: {key: key, value: newValue}
            });
            window.dispatchEvent(setItemEvent);
            originalSetItem.apply(this, [key, newValue]);
        };
        localStorage.setItem("token", token);
        localStorage.setItem = originalSetItem;
    });

    await emit('authenticate', {url: authorizeUrl(codeChallenge, state)});
}

async function tokenFromCode(payload: { code?: string; state?: string }) {
    const codeVerifier = sessionStorage.getItem("taskmate_pkce_verifier");
    const state = sessionStorage.getItem("taskmate_pkce_state");
    if (!payload.code || !codeVerifier || payload.state !== state) return null;

    const token = await exchangeLmsAuthCode({
        code: payload.code,
        codeVerifier,
        redirectUri: REDIRECT_URI,
        clientId: CLIENT_ID,
    });
    if (token) {
        sessionStorage.removeItem("taskmate_pkce_verifier");
        sessionStorage.removeItem("taskmate_pkce_state");
    }
    return token;
}

function authorizeUrl(codeChallenge: string, state: string) {
    const url = new URL("/api/internal/app/oauth/authorize", AUTH_BASE_URL);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("client_id", CLIENT_ID);
    url.searchParams.set("redirect_uri", REDIRECT_URI);
    url.searchParams.set("code_challenge", codeChallenge);
    url.searchParams.set("code_challenge_method", "S256");
    url.searchParams.set("state", state);
    return url.toString();
}

function randomBase64Url(size: number) {
    const bytes = new Uint8Array(size);
    crypto.getRandomValues(bytes);
    return base64Url(bytes);
}

async function sha256Base64Url(value: string) {
    const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
    return base64Url(new Uint8Array(hash));
}

function base64Url(bytes: Uint8Array) {
    return btoa(String.fromCharCode(...bytes))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "");
}
