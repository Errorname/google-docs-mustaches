export declare class FetchError extends Error {
    error: JSON;
}
export declare const fetch: (token: Function) => Function;
export declare const multipart: (parts: {
    [propName: string]: string;
    data: string;
}[], boundary: string) => Blob;
