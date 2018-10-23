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
                sp: utilitymanager_1.um.TIXSelPolicy.All,
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
                sp: utilitymanager_1.um.TIXSelPolicy.All,
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
        // ------------------------------------------------------------------------
        // $utility: indentOneSpace
        //
        // $keywords: indent
        // $eg: __NONE__
        // $desc: Adds one space to the beginning of each line
        // ------------------------------------------------------------------------
        function indentOneSpace() {
            utilitymanager_1.um.utilityManager({
                utilType: utilitymanager_1.um.TIXUtilityType.utLineUtility,
                sp: utilitymanager_1.um.TIXSelPolicy.All,
            }, function (up) { return ' ' + up.intext; });
        }
        lineutilities.indentOneSpace = indentOneSpace;
        // ------------------------------------------------------------------------
        // $utility: outdentOneSpace
        //
        // $keywords: indent
        // $eg: __NONE__
        // $desc: Removes one space to the beginning of each line
        // ------------------------------------------------------------------------
        function outdentOneSpace() {
            utilitymanager_1.um.utilityManager({
                utilType: utilitymanager_1.um.TIXUtilityType.utLineUtility,
                sp: utilitymanager_1.um.TIXSelPolicy.All,
            }, function (up) { return up.intext !== '' && up.intext[0] === ' ' ?
                up.intext.substr(1) : up.intext; });
        }
        lineutilities.outdentOneSpace = outdentOneSpace;
    })(lineutilities = exports.lineutilities || (exports.lineutilities = {}));
});
//# sourceMappingURL=lineutilities.js.map