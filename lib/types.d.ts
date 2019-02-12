export declare type ID = string;
export declare type AccessToken = string;
export interface GoogleDocToPdfOptions {
    token: () => AccessToken;
}
export interface ToPdfOptions {
    name?: string;
    data?: Object;
    formatters?: Formatters;
}
export interface Formatters {
    [name: string]: Formatter;
}
export declare type Formatter = (value: any) => string;
