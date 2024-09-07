'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// uuid: d477c481-d965-4afa-baac-56343a395d74
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
var utilitymanager_1 = require("./utilitymanager");
var expressionprocessor_1 = require("./expressionprocessor");
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
    // $utility: joinLines
    //
    // $keywords: join, lines
    // $eg: red||green||-> expr:(x\c{X0A}),||red(x0A),green(x0B)
    // $desc: Joins lines adding the computed expression at the end of every line
    // ------------------------------------------------------------------------
    function joinLines() {
        utilitymanager_1.um.utilityManagerWithUserInputs({
            utilType: utilitymanager_1.um.TIXUtilityType.utLinesUtility,
        }, [{ prompt: 'Expression' }], function (up) {
            var userInput = up.userinputs[0];
            // when the userInput doesn't have dynamic values
            // is much faster to bypass processing line by line
            if (expressionprocessor_1.ep.hasDynamicValues(userInput)) {
                up.inlines.forEach(function (line, index) {
                    up.inlines[index] += expressionprocessor_1.ep.processExpression(userInput, up.selNr + index, line);
                });
                userInput = '';
            }
            else {
                userInput = expressionprocessor_1.ep.processExpression(userInput, up.selNr, up.intext);
            }
            var joinedLines = up.inlines.join(userInput);
            return [joinedLines];
        });
    }
    lineutilities.joinLines = joinLines;
    // ------------------------------------------------------------------------
    // $utility: splitLines
    //
    // $keywords: split, lines
    // $eg: red,green||-> expr: = \c{1}||red = 1||green = 2
    // $desc: Split lines by an expression. Dynamic values aren't supported
    // ------------------------------------------------------------------------
    function splitLines() {
        utilitymanager_1.um.utilityManagerWithUserInputs({
            utilType: utilitymanager_1.um.TIXUtilityType.utLinesUtility,
        }, [{ prompt: 'Expression' }], function (up) {
            var userInput = expressionprocessor_1.ep.processExpression(up.userinputs[0], up.selNr, up.intext);
            var resLines = [];
            var index = 0;
            up.inlines.forEach(function (line) {
                resLines = resLines.concat(line.split(userInput));
            });
            return resLines;
        });
    }
    lineutilities.splitLines = splitLines;
    // ------------------------------------------------------------------------
    // $utility: sortNumericallyAscending
    //
    // $keywords: sort
    // $eg: 10. red||2. green||->||2. green||10. red
    // $desc: For each line uses the first number as sort key
    // ------------------------------------------------------------------------
    function sortNumericallyAscending() {
        utilitymanager_1.um.utilityManager({
            utilType: utilitymanager_1.um.TIXUtilityType.utLinesUtility,
        }, function (up) {
            var keylines = up.inlines.map((function (line) {
                var match = line.match(/(\d+)/);
                var key = match ? parseInt(match[0]) : 0;
                return [key, line];
            }));
            keylines.sort(function (a, b) { return a[0] - b[0]; });
            return keylines.map(function (keypair) { return keypair[1]; });
        });
    }
    lineutilities.sortNumericallyAscending = sortNumericallyAscending;
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
module.exports = { lineutilities: lineutilities };
//# sourceMappingURL=lineutilities.js.map