import {fetch, ResponseType} from '@tauri-apps/api/http';
import {Service} from "@/typing/system";

export function createRequest() {
    let cookie = ''
    let baseUrl = 'https://spaces.sustech.cloud/api'

    function setCookie(val: string): void {
        cookie = val
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
        const fullUrl = baseUrl + url;
        const timeout = param.timeout || 30;
        const type = param.responseType || ResponseType.JSON;
        return (await fetch<T>(fullUrl, {
            method: method,
            headers: {cookie, ...headers},
            body: body,
            query: query,
            timeout: timeout,
            responseType: type
        }));
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
        setCookie
    };
}