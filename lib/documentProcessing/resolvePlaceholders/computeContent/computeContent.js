"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dot_1 = require("./dot");
const pipe_1 = require("./pipe");
const DEFAULT_FALLBACK = '';
exports.default = (placeholder, data, options) => {
    const rawWithoutBrackets = placeholder.raw.slice(2, -2).trim();
    const [inputRaw, ...transformations] = rawWithoutBrackets.split('|').map(s => s.trim());
    const input = evaluateInput(inputRaw, data, options);
    const pipes = [];
    let transformedValue = input.value;
    for (let transformation of transformations) {
        const pipe = transformValue(transformedValue, transformation, data, options);
        pipes.push(pipe);
        transformedValue = pipe.output;
    }
    const output = pipes.length == 0 ? input.value : pipes[pipes.length - 1].output;
    return {
        ...placeholder,
        type: 'content',
        input,
        pipes,
        output
    };
};
const evaluateInput = (raw, data, options) => {
    try {
        return { raw, value: dot_1.default(raw, data) };
    }
    catch (error) {
        if (options && options.strict) {
            throw error;
        }
        if ((options && options.fallback) === undefined) {
            return { raw, error, value: DEFAULT_FALLBACK };
        }
        else {
            return { raw, error, value: options && options.fallback };
        }
    }
};
const transformValue = (value, transformation, data, options) => {
    try {
        return {
            raw: transformation,
            output: pipe_1.default(value, transformation, data, options)
        };
    }
    catch (error) {
        if (options && options.strict) {
            throw error;
        }
        return { raw: transformation, error, output: value };
    }
};
