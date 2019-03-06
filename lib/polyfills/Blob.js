"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
const realBlob = typeof window !== 'undefined' ? window.Blob : node_fetch_1.Blob;
exports.default = realBlob;
