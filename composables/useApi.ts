import { type LocationQueryRaw, stringifyQuery} from 'vue-router';
import { type BeforeFetchContext, createFetch, isObject, type MaybeRef, type UseFetchOptions, type UseFetchReturn } from '@vueuse/core';

interface ErrorDetails {
    errorCode: number;
    message: string;
    type: string;
    location?: Array<any>;
    extra?: string;
    raw?: any;
    timestamp?: any;
    endpoint?: any;
}

/**
 * ENV
 */
const env = import.meta.env;
// export const backendURL = 'http://127.0.0.1:8000/api';
export const backendURL = 'https://p01--elbunker--px8448vvktxh.code.run/api';

const messageResponse = (ctx: any) => {
    if (!ctx.response || !ctx.data) return;

    if (ctx.data && ctx.data.detail) {
        return ctx.data.detail?.[0]?.msg || ctx.data.detail.message || ctx.data.detail.msg || ctx.data.detail;
    }

    return ctx.data.message || ctx.data.msg || ctx.data;
};

const options: UseFetchOptions = {
    onFetchError(ctx: any) {
        // code 204 = no error
        if (ctx.response?.status === 204) {
            return ctx;
        }
        console.error('onFetchError data:::', ctx.data);
        console.error('onFetchError error:::', ctx.error);
        console.error('onFetchError response:::', ctx.response);

        // if no response at all, treat as 500 error
        if (!ctx.response) {
            ctx.error = {
                errorCode: 500,
                message: 'Failed to load response data | Unknown Error',
                type: 'unknown',
            } as ErrorDetails;

            return ctx;
        }

        // error 422 | 400 - Fastapi errors
        if (ctx.response.status === 422 || ctx.response.status === 400) {
            ctx.error = {
                message: messageResponse(ctx),
                type: 'fastapiError',
                location: ctx.data.detail?.[0]?.loc || null,
            } as ErrorDetails;
        }

        // error 404 - entity not found error
        else if (ctx.response.status === 404) {
            ctx.error = {
                message: messageResponse(ctx) || 'Entity Not Found',
                type: 'notFound',
                location: ctx.data?.detail?.id,
            } as ErrorDetails;
        }

        // error 502- Service Unavailable
        else if (ctx.response.status === 502) {
            ctx.error = {
                message: messageResponse(ctx) || 'Bad Gateway',
                type: 'serverError',
            } as ErrorDetails;
        }

        // error 503 - Service Unavailable
        else if (ctx.response.status === 503) {
            ctx.error = {
                message: messageResponse(ctx) || 'Service is not available right now.',
                type: 'serverError',
            } as ErrorDetails;
        }

        // error 504 - gateway timeout error
        else if (ctx.response.status === 504) {
            ctx.error = {
                message: messageResponse(ctx) || 'Gateway Timeout Error',
                type: 'serverError',
            } as ErrorDetails;
        }

        // error 500
        else if (ctx.response.status === 500) {
            ctx.error = {
                errorCode: 500,
                message: messageResponse(ctx) || 'Internal Server Error. The server unable to complete your request',
                type: 'serverError',
            } as ErrorDetails;
        }

        // fallback error to capture other errors
        else {
            ctx.error = {
                message: messageResponse(ctx) || 'Miscellaneous Error',
                type: 'others',
            } as ErrorDetails;
        }

        // insert error code to the error context
        ctx.error.errorCode = ctx.response.status;
        // insert raw error data
        ctx.error.raw = ctx.data;
        // insert other informations
        ctx.error.endpoint = ctx.response.url;

        return ctx;
    },
};

export enum requestMethods {
    POST = 'POST',
    post = 'post',
    PUT = 'PUT',
    put = 'put',
    PATCH = 'PATCH',
    patch = 'patch',
    DELETE = 'DELETE',
    delete = 'delete',
    GET = 'GET',
    get = 'get',
    HEAD = 'HEAD',
    head = 'head',
    CONNECT = 'CONNECT',
    connect = 'connect',
    OPTIONS = 'OPTIONS',
    options = 'options',
    TRACE = 'TRACE',
    trace = 'trace',
}


export const useRequest = createFetch({
    baseUrl: backendURL as string,
    options,
    fetchOptions: setFetchOptions(),
});

// use to fetch external api without the baseUrl
export const useRequestExternal = createFetch({
    options,
    fetchOptions: {
        headers: {
            'Content-Type': 'application/json',
        },
    },
});

/**
 * GET request
 * @param url
 * @param query
 */
export function useGet<T = unknown>(url: MaybeRef<string>, query?: MaybeRef<unknown>): UseFetchReturn<T> {
    const _url = computed(() => {
        const _url = unref(url);
        const _query = unref(query);
        const queryString = isObject(_query) ? stringifyQuery(_query as LocationQueryRaw) : _query || '';

        return `${_url}${queryString ? '?' : ''}${queryString}`;
    });

    return useRequest<T>(_url, {
        beforeFetch: ({ options }) => {
            options = setFetchOptions();
            return { options };
        },
    }).json();
}

/**
 * POST request
 * @param url
 * @param payload
 */
export function usePost<T = unknown>(url: MaybeRef<string>, payload?: MaybeRef<unknown>): UseFetchReturn<T> {
    return useRequest<T>(url, {
        beforeFetch: ({ options }) => {
            options = setFetchOptions();
            return { options };
        },
    })
        .post(payload)
        .json();
}

/**
 * POST request without any baseUrl. Useful to connect external api
 * @param url
 * @param payload
 */
export function usePostExternal<T = unknown>(url: MaybeRef<string>, payload?: MaybeRef<unknown>): UseFetchReturn<T> {
    return useRequestExternal<T>(url).post(payload).json();
}

export function useGetExternal<T = unknown>(url: MaybeRef<string>): UseFetchReturn<T> {
    return useRequestExternal<T>(url).get().json();
}

/**
 * PUT request
 * @param url
 * @param payload
 */
export function usePut<T = unknown>(url: MaybeRef<string>, payload?: MaybeRef<unknown>): UseFetchReturn<T> {
    return useRequest<T>(url, {
        beforeFetch: ({ options }) => {
            options = setFetchOptions();
            return { options };
        },
    })
        .put(payload)
        .json();
}

/**
 * PATCH request
 * @param url
 * @param payload
 */
export function usePatch<T = unknown>(url: MaybeRef<string>, payload?: MaybeRef<unknown>): UseFetchReturn<T> {
    return useRequest<T>(url, {
        beforeFetch: ({ options }) => {
            options = setFetchOptions();
            return { options };
        },
    })
        .patch(payload)
        .json();
}

/**
 * DELETE request
 * @param url
 * @param payload
 */
export function useDelete<T = unknown>(url: MaybeRef<string>, payload?: MaybeRef<unknown>): UseFetchReturn<T> {
    return useRequest<T>(url, {
        beforeFetch: ({ options }) => {
            options = setFetchOptions();
            return { options };
        },
    })
        .delete(payload)
        .json();
}

function setFetchOptions() {
    const user = typeof window !== 'undefined' ? localStorage.getItem('loggedUser') : null;
    let useRequestFetchOptions: any = {
        mode: 'cors',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: user ? `Token ${JSON.parse(user).token}` : '',
        },
    };
    return useRequestFetchOptions;
}
