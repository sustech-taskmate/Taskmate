import {emit, listen} from "@tauri-apps/api/event";

export async function loginAuth() {
    await emit('authenticate', {});

    await listen<{ token: string }>('authenticate', (event) => {
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = function (key: string, newValue: any): void {
            const setItemEvent: CustomEvent = new CustomEvent("setToken", {
                detail: {key: key, value: newValue}
            });
            window.dispatchEvent(setItemEvent);
            originalSetItem.apply(this, [key, newValue]);
        };
        localStorage.setItem("token", event.payload.token);
        localStorage.setItem = originalSetItem;
    });

}