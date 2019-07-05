"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interpolation_1 = require("./interpolation");
const apis_1 = require("./apis");
class Mustaches {
    constructor(options) {
        this.apis = apis_1.default(options.token);
    }
    async interpolate({ source, destination, name, data, resolver, formatters = {}, export: exportType }) {
        destination = destination || (await this.getParent(source));
        let copyOptions = name ? { name } : {};
        const copiedFile = await this.copyFile(source, destination, copyOptions);
        const doc = await this.readDoc(copiedFile);
        const updates = await interpolation_1.default(doc, data, formatters, resolver);
        await this.updateDoc(copiedFile, updates);
        if (exportType) {
            const exported = await this.export(copiedFile, exportType);
            return this.upload(name || 'Export', destination, exportType, exported);
        }
        return copiedFile;
    }
    copyFile(source, destination, options) {
        return this.apis.drive
            .copy(source, Object.assign({ parents: [destination] }, options))
            .then(({ id }) => id);
    }
    getParent(fileId) {
        return this.apis.drive.get(fileId).then(({ parents }) => parents[0]);
    }
    export(source, mimeType) {
        return this.apis.drive
            .export(source, mimeType, null, { raw: true })
            .then((r) => r.blob());
    }
    upload(name, destination, mimeType, body) {
        const metadata = { name, parents: [destination] };
        return this.apis.drive
            .create(apis_1.multipart([
            { 'Content-Type': 'application/json; charset=UTF-8', data: JSON.stringify(metadata) },
            { 'Content-Type': mimeType, 'Content-Encoding': 'base64', data: body }
        ], '--BOUNDARY'), {
            headers: {
                ['Content-Type']: 'multipart/related; boundary=--BOUNDARY',
                Accept: 'application/json'
            }
        })
            .then(({ id }) => id);
    }
    readDoc(file) {
        return this.apis.docs.get(file);
    }
    updateDoc(file, updates) {
        return this.apis.docs.update(file, {
            documentId: file,
            requests: updates
        });
    }
}
exports.default = Mustaches;
