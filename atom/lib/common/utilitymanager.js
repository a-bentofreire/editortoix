'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var um;
(function (um) {
    // ------------------------------------------------------------------------
    //                               Types
    // ------------------------------------------------------------------------
    var TIXUtilityType;
    (function (TIXUtilityType) {
        /// preforms inline transforms replacing pat with repl. doesn't calls ActionFunc
        TIXUtilityType[TIXUtilityType["utInTransform"] = 0] = "utInTransform";
        /// passes intext and replaces the selection with the return text
        TIXUtilityType[TIXUtilityType["utTransform"] = 1] = "utTransform";
        /// calls line by line and replaces each line with the returning result
        TIXUtilityType[TIXUtilityType["utLineUtility"] = 2] = "utLineUtility";
        /// passes inlines and replaces the selection with return lines
        TIXUtilityType[TIXUtilityType["utLinesUtility"] = 3] = "utLinesUtility";
        /// inserts text at the start of the selection or at cursor point if no text is selected
        TIXUtilityType[TIXUtilityType["utInsertAtStartUtility"] = 4] = "utInsertAtStartUtility";
        /// inserts text at the end of the selection or at cursor point if no text is selected
        TIXUtilityType[TIXUtilityType["utInsertAtEndUtility"] = 5] = "utInsertAtEndUtility";
    })(TIXUtilityType = um.TIXUtilityType || (um.TIXUtilityType = {}));
    var TIXSelPolicy;
    (function (TIXSelPolicy) {
        // FORCE policy must be the negative of the regular policy
        TIXSelPolicy[TIXSelPolicy["ForceAll"] = -1] = "ForceAll";
        TIXSelPolicy[TIXSelPolicy["All"] = 1] = "All";
        TIXSelPolicy[TIXSelPolicy["Word"] = 2] = "Word";
        TIXSelPolicy[TIXSelPolicy["Sentence"] = 3] = "Sentence";
        TIXSelPolicy[TIXSelPolicy["Line"] = 4] = "Line";
        TIXSelPolicy[TIXSelPolicy["None"] = 5] = "None";
        TIXSelPolicy[TIXSelPolicy["__Func"] = 6] = "__Func";
        TIXSelPolicy[TIXSelPolicy["ForceLine"] = -4] = "ForceLine";
    })(TIXSelPolicy = um.TIXSelPolicy || (um.TIXSelPolicy = {}));
    function utilityManager(params, func, up) {
        up = up || {};
        var editor = atom.workspace.getActiveTextEditor();
        if (editor) {
            var selection = editor.getSelectedText();
            var outSelection = void 0;
            switch (params.utilType) {
                case TIXUtilityType.utInTransform:
                    if (selection) {
                        outSelection = selection.replace(params.pat, params.repl);
                        if (selection !== outSelection) {
                            editor.insertText(outSelection);
                        }
                    }
                    break;
                case TIXUtilityType.utTransform:
                    if (selection) {
                        up.intext = selection;
                        outSelection = func(up);
                        if (selection !== outSelection) {
                            editor.insertText(outSelection);
                        }
                    }
                    break;
                case TIXUtilityType.utLinesUtility:
                    if (selection) {
                        up.inlines = selection.split('\n');
                        outSelection = func(up).join('\n');
                        if (selection !== outSelection) {
                            editor.insertText(outSelection);
                        }
                    }
                    break;
                case TIXUtilityType.utLineUtility:
                    if (selection) {
                        var lines_1 = selection.split('\n');
                        lines_1.forEach(function (line, index) {
                            up.intext = line;
                            lines_1[index] = func(up);
                        });
                        outSelection = lines_1.join('\n');
                        if (selection !== outSelection) {
                            editor.insertText(outSelection);
                        }
                    }
                    break;
                case TIXUtilityType.utInsertAtEndUtility:
                    outSelection = func(selection);
                    editor.insertText(selection + outSelection);
                    break;
            }
        }
    }
    um.utilityManager = utilityManager;
})(um = exports.um || (exports.um = {}));
module.exports = { um: um };
//# sourceMappingURL=utilitymanager.js.map