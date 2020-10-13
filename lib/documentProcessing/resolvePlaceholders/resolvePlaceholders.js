"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const computeContent_1 = require("./computeContent");
const resolvePlaceholders = (placeholders, data, options) => {
    return placeholders.map(placeholder => {
        const rawWithoutBrackets = placeholder.raw.slice(2, -2).trim();
        if (rawWithoutBrackets.startsWith('#')) {
            return {
                ...placeholder,
                type: 'comment',
                value: rawWithoutBrackets.slice(1).trim()
            };
        }
        if (['%', '@'].includes(rawWithoutBrackets[0])) {
            return placeholder;
        }
        return computeContent_1.default(placeholder, data, options);
    });
};
exports.default = resolvePlaceholders;
