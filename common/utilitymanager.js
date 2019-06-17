define(["require", "exports"], function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    // uuid: 6f9a7dc4-34ed-4001-88c6-4c7bd7f9ab31
    // ------------------------------------------------------------------------
    // Copyright (c) 2016-2019 Alexandre Bento Freire. All rights reserved.
    // Licensed under the MIT License+uuid License. See License.txt for details
    // ------------------------------------------------------------------------
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
    })(um = exports.um || (exports.um = {}));
});
//# sourceMappingURL=utilitymanager.js.map