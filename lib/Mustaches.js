"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const documentProcessing_1 = require("./documentProcessing");
const apis_1 = require("./apis");
class Mustaches {
    constructor(options) {
        this.apis = apis_1.default(options.token);
    }
    async interpolate({ source, destination, name, data, formatters = {}, strict }) {
        destination = destination || (await this.getParent(source));
        let copyOptions = name ? { name } : {};
        const copiedFile = await this.copyFile(source, destination, copyOptions);
        const placeholders = await this.discover({ source: copiedFile, data, formatters, strict });
        const updates = documentProcessing_1.buildUpdates(placeholders);
        updates.sort((a, b) => {
            if (a.insertInlineImage && b.insertInlineImage) {
                return b.insertInlineImage.location.index - a.insertInlineImage.location.index;
            }
            else if (a.insertInlineImage) {
                return -1;
            }
            else {
                return 1;
            }
        });
        await this.updateDoc(copiedFile, updates);
        return copiedFile;
    }
    async discover({ source, data = {}, formatters = {}, strict }) {
        const doc = await this.readDoc(source);
        return documentProcessing_1.default(doc, data, formatters, strict);
    }
    async export({ file, mimeType, name, destination }) {
        destination = destination || (await this.getParent(file));
        const exported = await this.apis.drive
            .export(file, mimeType, null, { raw: true })
            .then((r) => r.blob());
        return this.upload(name || 'Export', destination, mimeType, exported);
    }
    async readDoc(file) {
        return this.apis.docs.get(file);
    }
    getParent(fileId) {
        return this.apis.drive.get(fileId).then(({ parents }) => parents[0]);
    }
    copyFile(source, destination, options) {
        return this.apis.drive
            .copy(source, { parents: [destination], ...options })
            .then(({ id }) => id);
    }
    updateDoc(file, updates) {
        return this.apis.docs.update(file, {
            documentId: file,
            requests: updates
        });
    }
    async upload(name, destination, mimeType, body) {
        const metadata = { name, parents: [destination] };
        const data = await body.arrayBuffer();
        return this.apis.drive
            .create(apis_1.multipart([
            { 'Content-Type': 'application/json; charset=UTF-8', data: JSON.stringify(metadata) },
            { 'Content-Type': mimeType, 'Content-Encoding': 'base64', data }
        ], '--BOUNDARY'), {
            headers: {
                ['Content-Type']: 'multipart/related; boundary=--BOUNDARY',
                Accept: 'application/json'
            }
        })
            .then(({ id }) => id);
    }
}
exports.default = Mustaches;
