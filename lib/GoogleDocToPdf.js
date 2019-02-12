"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interpolation_1 = require("./interpolation");
const apis_1 = require("./apis");
class GoogleDocToPdf {
    constructor(options) {
        this.apis = apis_1.default(options.token);
    }
    async toPdf(source, optDestination, options) {
        let destination = optDestination || (await this.getParent(source));
        const { name = null, data = null, formatters = {} } = options || {};
        if (data) {
            let copyOptions = name ? { name } : {};
            source = await this.copyFile(source, destination, copyOptions);
            const doc = await this.readDoc(source);
            const updates = interpolation_1.default(doc, data, formatters);
            await this.updateDoc(source, updates);
        }
        const pdf = await this.exportPdf(source);
        const id = await this.uploadPdf(name || 'Export PDF', destination, pdf);
        return id;
    }
    copyFile(source, destination, options) {
        return this.apis.drive
            .copy(source, Object.assign({ parents: [destination] }, options))
            .then(({ id }) => id);
    }
    getParent(fileId) {
        return this.apis.drive.get(fileId).then(({ parents }) => parents[0]);
    }
    exportPdf(source) {
        return this.apis.drive.export(source, null, { raw: true }).then((r) => r.blob());
    }
    uploadPdf(name, destination, body) {
        const metadata = { name, parents: [destination] };
        return this.apis.drive
            .create(apis_1.multipart([
            { 'Content-Type': 'application/json; charset=UTF-8', data: JSON.stringify(metadata) },
            { 'Content-Type': 'application/pdf', 'Content-Encoding': 'base64', data: body }
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
exports.default = GoogleDocToPdf;
