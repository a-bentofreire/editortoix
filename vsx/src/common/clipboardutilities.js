'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.clipboardutilities = void 0;
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// ------------------------------------------------------------------------
const utilitymanager_1 = require("./utilitymanager");
var clipboardutilities;
(function (clipboardutilities) {
    const copyPaste = require("copy-paste");
    // ------------------------------------------------------------------------
    //                               Clipboard Utilities
    //
    // $cattitle: Clipboard Utilities
    // ------------------------------------------------------------------------
    // ------------------------------------------------------------------------
    // $utility: extractText
    //
    // $keywords: clipboard, text
    // $desc: Copies to the clipboard the captured group of a regular expression. Each capture is separated by tabs
    // $eg: (\w+) = (\w+)
    // ------------------------------------------------------------------------
    function extractText() {
        utilitymanager_1.um.utilityManagerWithUserInputs({
            utilType: utilitymanager_1.um.TIXUtilityType.utImmutableLinesUtility,
        }, [{ prompt: 'Pattern' }], (up) => {
            const text = up.inlines.join('\n');
            const foundPatterns = [];
            text.replace(new RegExp(up.userinputs[0], 'g'), (all, ...p) => {
                const len = p.length - 2;
                const captures = [];
                for (let i = 0; i < len; i++) {
                    captures.push(p[i]);
                }
                foundPatterns.push(captures.join('\t'));
                return all;
            });
            copyPaste.copy(foundPatterns.join('\n'));
        });
    }
    clipboardutilities.extractText = extractText;
})(clipboardutilities || (exports.clipboardutilities = clipboardutilities = {}));
module.exports = { clipboardutilities };
//# sourceMappingURL=clipboardutilities.js.map