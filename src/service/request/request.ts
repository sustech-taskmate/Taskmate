import {fetch as tauriFetch} from "@tauri-apps/plugin-http";
import {Service} from "@/typing/system";

export function createRequest() {
    let cookie = ''
    let authToken = ''
    const baseUrl = import.meta.env.VITE_LMS_API_BASE_URL ?? 'http://localhost:3000/api/internal/app'

    function setCookie(val: string): void {
        cookie = val
    }

    function setAuthToken(val: string): void {
        authToken = val
    }

    function clearCookie(): void {
        cookie = ''
    }

    /**
     * 异步promise请求
     * @param param - 请求参数
     * - url: 请求地址
     * - method: 请求方法
     * - headers: 请求头
     * - body: 请求数据
     * - query: 请求参数
     * - timeout: 请求超时限制
     * - responseType: 返回类型
     */
    async function asyncRequest<T>(param: Service.HttpOption): Promise<Service.Response<T>> {
        const {url, method, body, query, headers} = param;
        const fullUrl = new URL(baseUrl + url);
        Object.entries(query ?? {}).forEach(([key, value]) => fullUrl.searchParams.set(key, String(value)));
        const requestHeaders = new Headers(headers);
        if (cookie) requestHeaders.set("cookie", cookie);
        if (authToken) requestHeaders.set("authorization", `Bearer ${authToken}`);
        const fetchImpl = isTauriRuntime() ? tauriFetch : globalThis.fetch;
        const response = await fetchImpl(fullUrl.toString(), {
            method,
            headers: requestHeaders,
            body,
        });
        const responseHeaders: Record<string, string> = {};
        response.headers.forEach((value, key) => {
            responseHeaders[key] = value;
        });

        return {
            ok: response.ok,
            status: response.status,
            headers: responseHeaders,
            data: await response.json().catch(() => null) as T,
        };
    }

    /**
     * get请求
     * @param url - 请求地址
     * @param opt - 额外选项
     */
    function get<T>(url: string, opt?: Service.RequestOption) {
        return asyncRequest<T>({
            url: url,
            method: 'GET',
            ...opt
        });
    }

    /**
     * post请求
     * @param url - 请求地址
     * @param opt - 额外选项
     */
    function post<T>(url: string, opt?: Service.RequestOption) {
        return asyncRequest<T>({
            url: url,
            method: 'POST',
            ...opt
        });
    }

    /**
     * put请求
     * @param url - 请求地址
     * @param opt - 额外选项
     */
    function put<T>(url: string, opt?: Service.RequestOption) {
        return asyncRequest<T>({
            url: url,
            method: 'PUT',
            ...opt
        });
    }

    /**
     * delete请求
     * @param url - 请求地址
     * @param opt - 额外选项
     */
    function handleDelete<T>(url: string, opt?: Service.RequestOption) {
        return asyncRequest<T>({
            url: url,
            method: 'DELETE',
            ...opt
        });
    }

    /**
     * patch请求
     * @param url - 请求地址
     * @param opt - 额外选项
     */
    function patch<T>(url: string, opt?: Service.RequestOption) {
        return asyncRequest<T>({
            url: url,
            method: 'PATCH',
            ...opt
        });
    }

    return {
        get,
        post,
        put,
        delete: handleDelete,
        patch,
        setCookie,
        clearCookie,
        setAuthToken,
    };
}

function isTauriRuntime() {
    return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}
