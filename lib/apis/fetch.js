"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cross_fetch_1 = require("cross-fetch");
const Blob_1 = require("../polyfills/Blob");
class FetchError extends Error {
}
exports.FetchError = FetchError;
exports.fetch = (token) => async (url, body = null, options = {}) => {
    const { method, headers, raw, ...rest } = options;
    if (body && !(Blob_1.default && body instanceof Blob_1.default)) {
        body = JSON.stringify(body);
    }
    return cross_fetch_1.default(url, {
        method: method || (body ? 'POST' : 'GET'),
        body,
        headers: {
            authorization: `Bearer ${await token()}`,
            'Content-Type': 'application/json',
            ...headers
        },
        ...rest
    }).then(async (result) => {
        if (result.status !== 200) {
            const error = new FetchError(`Fetch Error: status ${result.status}`);
            error.error = await result.json();
            throw error;
        }
        return raw ? result : result.json();
    });
};
exports.multipart = (parts, boundary) => {
    const body = [];
    parts.map(part => {
        const { data, ...headers } = part;
        body.push([
            `--${boundary}`,
            ...Object.entries(headers).map(([key, value]) => `${key}: ${value}`),
            '\n'
        ].join('\n'));
        body.push(data);
        body.push('\n\n');
    });
    body.push(`--${boundary}--`);
    return new Blob_1.default(body);
};
