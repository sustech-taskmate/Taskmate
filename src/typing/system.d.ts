export declare namespace Service {
    /**
     * 请求的错误类型：
     * - tauri: tauri错误：网络错误, 请求超时, 默认的兜底错误
     * - http: 请求成功，响应的http状态码非200的错误
     * - backend: 请求成功，响应的http状态码为200，由后端定义的业务错误
     */
    type RequestErrorType = 'tauri' | 'http' | 'backend';

    /** 请求错误 */
    interface RequestError {
        type: RequestErrorType;
        code: string | number;
        msg: string;
    }

    /** 自定义的请求失败结果 */
    interface FailedResult {
        /** 请求错误 */
        error: RequestError;
        /** 请求数据 */
        data: null;
    }

    type RequestOption = RequestInit & {
        query?: Record<string, string | number | boolean>;
        timeout?: number;
    }

    type HttpOption = RequestOption & {
        url: string;
        method: string;
    }

    interface Response<T> {
        ok: boolean;
        status: number;
        headers: Record<string, string>;
        data: T;
    }
}

export declare namespace App {
    interface AssignTabRoute
        extends Pick<import('vue-router').RouteLocationNormalizedLoaded, 'name' | 'fullPath' | 'meta'> {
        scrollPosition: {
            left: number
            top: number
        };
    }
}
