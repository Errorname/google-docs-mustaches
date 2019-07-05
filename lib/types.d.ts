export declare type ID = string;
export declare type AccessToken = string;
export interface ConstructorOptions {
    token: () => AccessToken;
}
export interface InterpolationOptions {
    source: ID;
    destination?: ID;
    name?: string;
    data: Object;
    resolver?: Function;
    formatters?: Formatters;
    export?: MimeType;
}
export interface Formatters {
    [name: string]: Formatter;
}
export declare type Formatter = (value: any) => string;
export declare enum MimeType {
    pdf = "application/pdf",
    text = "plain/text"
}
