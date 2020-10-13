declare const apis: (token: Function) => {
    [api: string]: {
        [method: string]: Function;
    };
};
export default apis;
