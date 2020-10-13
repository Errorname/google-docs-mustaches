"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defaultFormatters = {
    lowercase: (s) => (s || '').toLowerCase(),
    uppercase: (s) => (s || '').toUpperCase(),
    capitalize: (s) => s
        ? s
            .split(' ')
            .map(([head, ...tail]) => head.toUpperCase() + tail.join('').toLowerCase())
            .join(' ')
        : '',
    money: (s, locale, currencyISO, fractionDigits = 0) => {
        const options = currencyISO ? { style: 'currency', currency: currencyISO } : {};
        return Number(s || '').toLocaleString(locale || 'en', {
            ...options,
            minimumFractionDigits: fractionDigits
        });
    },
    image: (url, width, height) => ({
        url,
        width,
        height
    })
};
exports.default = defaultFormatters;
