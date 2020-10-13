"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../errors");
exports.default = (path, data) => {
    const iterative = [];
    path.split('.').map(subPath => {
        const selector = subPath.match(/\[.*\]/);
        if (selector) {
            if (!subPath.endsWith(selector[0])) {
                throw new SyntaxError(`Couldn't parse ${path}`);
            }
            subPath = subPath.replace(selector[0], '');
            if (subPath) {
                iterative.push(subPath);
            }
            iterative.push(selector[0].slice(1, -1));
        }
        else {
            iterative.push(subPath);
        }
    });
    let prop = data;
    for (let accessor of iterative) {
        if (prop[accessor] === undefined) {
            throw new errors_1.UndefinedVariableError(`${accessor} is undefined.`);
        }
        prop = prop[accessor];
    }
    return prop;
};
