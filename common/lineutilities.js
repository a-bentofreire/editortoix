define(["require", "exports", "./utilitymanager"], function (require, exports, utilitymanager_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var lineutilities;
    (function (lineutilities) {
        // ------------------------------------------------------------------------
        //                               Line Utilities
        //
        // $cattitle: Line Utilities
        // ------------------------------------------------------------------------
        // ------------------------------------------------------------------------
        // $utility: removeDuplicatedLines
        //
        // $keywords: remove, duplicates
        // $eg: first||second||second||->||first||second
        // $desc: Removes consecutive duplicated lines
        // ------------------------------------------------------------------------
        function removeDuplicatedLines() {
            utilitymanager_1.um.utilityManager({
                utilType: utilitymanager_1.um.TIXUtilityType.utLinesUtility,
                sp: utilitymanager_1.um.SP_ALL,
            }, function (up) {
                var arr = up.inlines;
                for (var i = arr.length - 1; i >= 0; i--) {
                    if (arr[i + 1] === arr[i]) {
                        arr.splice(i + 1, 1);
                    }
                }
                return arr;
            });
        }
        lineutilities.removeDuplicatedLines = removeDuplicatedLines;
        // ------------------------------------------------------------------------
        // $utility: removeEmptyLines
        //
        // $keywords: remove, empty
        // $eg: first||||second||->||first||second
        // ------------------------------------------------------------------------
        function removeEmptyLines() {
            utilitymanager_1.um.utilityManager({
                utilType: utilitymanager_1.um.TIXUtilityType.utLinesUtility,
                sp: utilitymanager_1.um.SP_ALL,
            }, function (up) {
                var arr = up.inlines;
                for (var i = arr.length - 1; i >= 0; i--) {
                    if (!arr[i].trim()) {
                        arr.splice(i, 1);
                    }
                }
                return arr;
            });
        }
        lineutilities.removeEmptyLines = removeEmptyLines;
    })(lineutilities = exports.lineutilities || (exports.lineutilities = {}));
});
//# sourceMappingURL=lineutilities.js.map