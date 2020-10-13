"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const findPlaceholders_1 = require("./findPlaceholders");
exports.findPlaceholders = findPlaceholders_1.default;
const resolvePlaceholders_1 = require("./resolvePlaceholders");
exports.resolvePlaceholders = resolvePlaceholders_1.default;
const buildUpdates_1 = require("./buildUpdates");
exports.buildUpdates = buildUpdates_1.default;
const processPlaceholders = (doc, data, formatters, strict) => {
    const placeholders = findPlaceholders_1.default(doc);
    return resolvePlaceholders_1.default(placeholders, data, { formatters, strict });
};
exports.default = processPlaceholders;
