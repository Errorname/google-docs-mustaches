"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gdocTypes_1 = require("../gdocTypes");
const buildUpdates = (placeholders) => {
    const updates = [];
    for (let placeholder of placeholders) {
        if (placeholder.type == 'content') {
            const contentPlaceholder = placeholder;
            if (contentPlaceholder.output && contentPlaceholder.output.url) {
                const output = contentPlaceholder.output;
                updates.push({
                    insertInlineImage: {
                        uri: output.url,
                        objectSize: {
                            width: output.width ? { magnitude: output.width, unit: gdocTypes_1.Unit.PT } : undefined,
                            height: output.height ? { magnitude: output.height, unit: gdocTypes_1.Unit.PT } : undefined
                        },
                        location: {
                            segmentId: '',
                            index: placeholder.position.start
                        }
                    }
                });
                updates.push({
                    replaceAllText: {
                        replaceText: '',
                        containsText: {
                            text: placeholder.raw,
                            matchCase: true
                        }
                    }
                });
            }
            if (contentPlaceholder.output === `${contentPlaceholder.output}` ||
                !isNaN(contentPlaceholder.output)) {
                updates.push({
                    replaceAllText: {
                        replaceText: `${contentPlaceholder.output}`,
                        containsText: {
                            text: placeholder.raw,
                            matchCase: true
                        }
                    }
                });
            }
        }
        else if (placeholder.type == 'comment') {
            updates.push({
                replaceAllText: {
                    replaceText: '',
                    containsText: {
                        text: placeholder.raw,
                        matchCase: true
                    }
                }
            });
        }
    }
    updates.sort((a, b) => {
        if (a.insertInlineImage && !b.insertInlineImage)
            return -1;
        if (!a.insertInlineImage && b.insertInlineImage)
            return 1;
        return 0;
    });
    return updates;
};
exports.default = buildUpdates;
