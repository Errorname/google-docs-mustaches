export declare const fetch: (token: Function) => (url: string, body?: any, options?: {
    method?: string | undefined;
    headers?: any;
    raw?: boolean | undefined;
}) => Promise<Response>;
export declare const multipart: (parts: {
    [propName: string]: string;
    data: string;
}[], boundary: string) => Blob;
