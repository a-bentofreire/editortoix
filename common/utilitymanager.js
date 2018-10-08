define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var um;
    (function (um) {
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
        // FORCE policy must be the negative of the regular policy
        um.SP_FORCE_ALL = -1;
        um.SP_ALL = 1;
        um.SP_WORD = 2;
        um.SP_SENTENCE = 3;
        um.SP_LINE = 4;
        um.SP_NONE = 5;
        um.__SP_FUNC = 6;
        um.SP_FORCE_LINE = -4;
    })(um = exports.um || (exports.um = {}));
});
//# sourceMappingURL=utilitymanager.js.map