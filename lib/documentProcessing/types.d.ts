export interface Placeholder {
    type?: string;
    raw: string;
    position: {
        start: number;
        end: number;
    };
}
export interface ContentPlaceholder extends Placeholder {
    type: string;
    input: {
        raw: string;
        error?: Error;
        value: any;
    };
    pipes: {
        raw: string;
        error?: Error;
        output: any;
    }[];
    output: any;
}
export interface CommentPlaceholder extends Placeholder {
    type: string;
    value: string;
}
export interface Formatters {
    [name: string]: Formatter;
}
export declare type Formatter = (value: any, ...params: any[]) => any;
