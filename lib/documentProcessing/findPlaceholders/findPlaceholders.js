"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const findPlaceholders = (doc) => {
    const placeholders = [];
    findInContent(placeholders, doc.body.content);
    return placeholders;
};
const findInContent = (placeholders, content) => {
    content.map(c => {
        if (c.paragraph) {
            c.paragraph.elements.map(e => {
                if (e.textRun) {
                    let textRun = e.textRun.content;
                    const matches = textRun.match(/{{([^}]*)}}/gi) || [];
                    for (let match of matches) {
                        const start = e.startIndex + textRun.indexOf(match);
                        textRun = textRun.replace(match, ''.padStart(match.length));
                        placeholders.push({
                            raw: match,
                            position: {
                                start,
                                end: start + match.length
                            }
                        });
                    }
                }
            });
        }
        else if (c.table) {
            c.table.tableRows.forEach(r => {
                r.tableCells.forEach(c => {
                    findInContent(placeholders, c.content);
                });
            });
        }
    });
};
exports.default = findPlaceholders;
