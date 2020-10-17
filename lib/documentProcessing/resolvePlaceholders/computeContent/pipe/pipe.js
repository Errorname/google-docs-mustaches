"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../errors");
const defaultFormatters_1 = require("../defaultFormatters");
const dot_1 = require("../dot");
exports.default = (value, transformation, data, options) => {
    const formatters = { ...defaultFormatters_1.default, ...(options && options.formatters) };
    const matches = transformation.match(/^(?<formatter>[^\(]+)(\((?<params>.+)?\))?/);
    if (!matches || !matches.groups || !matches.groups.formatter) {
        throw new errors_1.UnvalidFormatterError(`${transformation} is not a valid formatter.`);
    }
    const formatterName = matches.groups.formatter;
    const formatter = formatters[formatterName];
    if (!formatter) {
        throw new errors_1.UnknownFormatterError(`${formatterName} is not defined.`);
    }
    let typedParams = [];
    if (matches.groups.params) {
        typedParams = normalizeParams(matches.groups.params.split(/,(?=(?:[^“”"']|[“"'][^“”"']*[”"'])*$)/), data, options);
    }
    return formatter(value, ...typedParams);
};
const normalizeParams = function (untypedParams, data, options) {
    return untypedParams
        .map(e => e.trim())
        .map(e => {
        if (/^(\“.*\”|\".*\"|\‘.*\’|\'.*\')$/.test(e)) {
            return e.slice(1, -1);
        }
        else if (/^[-+]?([0-9]+|[0-9]+\.[0-9]*|[0-9]*\.[0-9]+)$/.test(e)) {
            return Number(e);
        }
        else if (/^true|false$/.test(e)) {
            return Boolean(e);
        }
        else {
            try {
                return dot_1.default(e, data);
            }
            catch (err) {
                return undefined;
            }
        }
    });
};
