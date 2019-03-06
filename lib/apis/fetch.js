"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const cross_fetch_1 = require("cross-fetch");
const Blob_1 = require("../polyfills/Blob");
exports.fetch = (token) => (url, body = null, options = {}) => {
    const { method, headers, raw } = options, rest = __rest(options, ["method", "headers", "raw"]);
    if (body && !(body instanceof Blob_1.default)) {
        body = JSON.stringify(body);
    }
    return cross_fetch_1.default(url, Object.assign({ method: method || body ? 'POST' : 'GET', body, headers: Object.assign({ authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' }, headers) }, rest)).then(r => (raw ? r : r.json()));
};
exports.multipart = (parts, boundary) => {
    const body = [];
    parts.map(part => {
        const { data } = part, headers = __rest(part, ["data"]);
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
