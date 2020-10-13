"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetch_1 = require("./fetch");
const DRIVE_URL = 'https://www.googleapis.com/drive/v3/files';
const DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files';
const DOCS_URL = 'https://docs.googleapis.com/v1/documents';
const apis = (token) => {
    const f = fetch_1.fetch(token);
    return {
        drive: {
            create: (...args) => f(`${DRIVE_UPLOAD_URL}?uploadType=multipart&alt=json`, ...args),
            get: (id, ...args) => f(`${DRIVE_URL}/${id}?fields=parents`, ...args),
            copy: (id, ...args) => f(`${DRIVE_URL}/${id}/copy`, ...args),
            export: (id, mimeType, ...args) => f(`${DRIVE_URL}/${id}/export?mimeType=${mimeType}`, ...args)
        },
        docs: {
            get: (id, ...args) => f(`${DOCS_URL}/${id}`, ...args),
            update: (id, ...args) => f(`${DOCS_URL}/${id}:batchUpdate`, ...args)
        }
    };
};
exports.default = apis;
