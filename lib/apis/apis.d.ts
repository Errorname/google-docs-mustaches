declare const apis: (token: Function) => {
    drive: {
        create: (...args: any[]) => Promise<Response>;
        get: (id: string, ...args: any[]) => Promise<Response>;
        copy: (id: string, ...args: any[]) => Promise<Response>;
        export: (id: string, ...args: any[]) => Promise<Response>;
        ids: (count: number, ...args: any[]) => Promise<Response>;
    };
    docs: {
        get: (id: string, ...args: any[]) => Promise<Response>;
        update: (id: string, ...args: any[]) => Promise<Response>;
        export: (id: string, ...args: any[]) => Promise<Response>;
    };
};
export default apis;
