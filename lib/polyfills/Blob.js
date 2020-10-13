"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Blob = require('fetch-blob');
const realBlob = typeof window !== 'undefined' ? window.Blob : Blob;
exports.default = realBlob;
