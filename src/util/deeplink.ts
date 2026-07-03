import {listen} from "@tauri-apps/api/event";
import {router} from "@/router";
import {taskmateRouteFromUrl} from "@/util/deeplink-route";

export async function setupDeepLinks() {
    await listen<{ url?: string }>("authenticate", async (event) => {
        const url = event.payload.url;
        if (!url) return;
        const route = taskmateRouteFromUrl(url);
        if (route) await router.push(route);
    });
}
