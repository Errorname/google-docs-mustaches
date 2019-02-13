"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetch_1 = require("./fetch");
const DRIVE_URL = 'https://www.googleapis.com/drive/v3/files';
const DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files';
const DOCS_URL = 'https://docs.googleapis.com/v1/documents';
const DOCS_EXPORT_URL = 'https://docs.google.com/document';
const apis = (token) => {
    const f = fetch_1.fetch(token);
    return {
        drive: {
            create: (...args) => f(`${DRIVE_UPLOAD_URL}?uploadType=multipart&alt=json`, ...args),
            get: (id, ...args) => f(`${DRIVE_URL}/${id}?fields=parents`, ...args),
            copy: (id, ...args) => f(`${DRIVE_URL}/${id}/copy`, ...args),
            export: (id, mimeType, ...args) => f(`${DRIVE_URL}/${id}/export?mimeType=${mimeType}`, ...args),
            ids: (count, ...args) => f(`${DRIVE_URL}/generateIds?count=${count}`, ...args)
        },
        docs: {
            get: (id, ...args) => f(`${DOCS_URL}/${id}`, ...args),
            update: (id, ...args) => f(`${DOCS_URL}/${id}:batchUpdate`, ...args),
            export: (id, ...args) => f(`${DOCS_EXPORT_URL}/d/${id}/export?format=pdf`, ...args)
        }
    };
};
exports.default = apis;
