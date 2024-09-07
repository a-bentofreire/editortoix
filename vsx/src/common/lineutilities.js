'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.lineutilities = void 0;
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// ------------------------------------------------------------------------
const utilitymanager_1 = require("./utilitymanager");
const expressionprocessor_1 = require("./expressionprocessor");
var lineutilities;
(function (lineutilities) {
    function getLinesKeyPairs(up) {
        const keylines = up.inlines.map((line => {
            const match = line.match(/(\d+)/);
            const key = match ? parseInt(match[0]) : 0;
            return [key, line];
        }));
        return keylines;
    }
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
        }, (up) => {
            const arr = up.inlines;
            for (let i = arr.length - 1; i >= 0; i--) {
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
        }, (up) => {
            const arr = up.inlines;
            for (let i = arr.length - 1; i >= 0; i--) {
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
        }, [{ prompt: 'Expression' }], (up) => {
            let userInput = up.userinputs[0];
            // when the userInput doesn't have dynamic values
            // is much faster to bypass processing line by line
            if (expressionprocessor_1.ep.hasDynamicValues(userInput)) {
                up.inlines.forEach((line, index) => {
                    up.inlines[index] += expressionprocessor_1.ep.processExpression(userInput, up.selNr + index, line);
                });
                userInput = '';
            }
            else {
                userInput = expressionprocessor_1.ep.processExpression(userInput, up.selNr, up.intext);
            }
            const joinedLines = up.inlines.join(userInput);
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
        }, [{ prompt: 'Expression' }], (up) => {
            const userInput = expressionprocessor_1.ep.processExpression(up.userinputs[0], up.selNr, up.intext);
            let resLines = [];
            up.inlines.forEach((line) => {
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
        }, (up) => {
            const keylines = getLinesKeyPairs(up);
            keylines.sort((a, b) => a[0] - b[0]);
            return keylines.map(keypair => keypair[1]);
        });
    }
    lineutilities.sortNumericallyAscending = sortNumericallyAscending;
    // ------------------------------------------------------------------------
    // $utility: sortNumericallyDescending
    //
    // $keywords: sort
    // $eg: 10. red||2. green||->||10. red||2. green
    // $desc: For each line uses the first number as sort key
    // ------------------------------------------------------------------------
    function sortNumericallyDescending() {
        utilitymanager_1.um.utilityManager({
            utilType: utilitymanager_1.um.TIXUtilityType.utLinesUtility,
        }, (up) => {
            const keylines = getLinesKeyPairs(up);
            keylines.sort((a, b) => b[0] - a[0]);
            return keylines.map(keypair => keypair[1]);
        });
    }
    lineutilities.sortNumericallyDescending = sortNumericallyDescending;
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
        }, (up) => ' ' + up.intext);
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
        }, (up) => up.intext !== '' && up.intext[0] === ' ' ?
            up.intext.substring(1) : up.intext);
    }
    lineutilities.outdentOneSpace = outdentOneSpace;
    // ------------------------------------------------------------------------
    // $utility: breakLineAt
    //
    // $keywords: break lines
    // $eg: __NONE__
    // $desc: Break lines at a certain position
    // $eg: Too long line ->  too long||line
    // ------------------------------------------------------------------------
    function execBreakLineAt(line, maxChars, toBreakWords) {
        let start = 0;
        let at;
        let stest;
        while (start + maxChars < line.length) {
            at = start + maxChars;
            if (!toBreakWords) {
                stest = line.substring(start, at).replace(/[\w_]/g, '0');
                for (at -= start; at > 0 && stest[at - 1] === '0'; at--) { }
                if ((!at) && (stest[0] === '0')) {
                    at = maxChars;
                }
                at += start;
            }
            line = line.substring(0, at) + '\n' + line.substring(at);
            start = at + 1;
        }
        return line;
    }
    function breakLineAt() {
        utilitymanager_1.um.utilityManagerWithUserInputs({
            utilType: utilitymanager_1.um.TIXUtilityType.utLinesUtility,
            sp: utilitymanager_1.um.TIXSelPolicy.All,
        }, [
            { prompt: 'Max number of Chars(add / at the end to allow word break)' },
        ], (up) => {
            const userInput = up.userinputs[0];
            if (!userInput) {
                return up.inlines;
            }
            const toBreakWords = userInput[userInput.length - 1] === '/';
            const sMaxChars = userInput.substring(0, userInput.length - (toBreakWords ? 1 : 0));
            const maxChars = parseInt(sMaxChars);
            if (maxChars === 0) {
                return up.inlines;
            }
            let resLines = [];
            up.inlines.forEach((line) => {
                resLines = resLines.concat(execBreakLineAt(line, maxChars, toBreakWords));
            });
            return resLines;
        });
    }
    lineutilities.breakLineAt = breakLineAt;
    function replaceRecipes() {
        const recipes = utilitymanager_1.um.getConfig('replaceRecipes');
        const recipeNames = recipes.map((item, index) => `${index + 1}. ${item['name']}`);
        utilitymanager_1.um.utilityManagerWithUserInputs({
            utilType: utilitymanager_1.um.TIXUtilityType.utLinesUtility,
        }, [{
                prompt: "Type the recipe number or name",
                items: recipeNames
            }], (up) => {
            if (up.userinputs[0] != '') {
                const recipes = utilitymanager_1.um.getConfig('replaceRecipes');
                const recipe = recipes[parseInt(up.userinputs[0].replace(/^(\d+)\..*$/, "$1"), 10) - 1];
                const isExpression = recipe.isExpression !== false;
                const regPattern = recipe.isRegExp !== false ?
                    new RegExp(recipe.pattern, recipe.ignoreCase === true ? 'i' : undefined) : recipe.pattern;
                const replaceWith = recipe.replaceWith;
                const resLines = [];
                up.inlines.forEach((line, index) => {
                    const replaceResult = line.replace(regPattern, replaceWith);
                    resLines.push(isExpression ? expressionprocessor_1.ep.processExpression(replaceResult, index, line)
                        : replaceResult);
                });
                return resLines;
            }
            else {
                return up.inlines;
            }
        });
    }
    lineutilities.replaceRecipes = replaceRecipes;
})(lineutilities || (exports.lineutilities = lineutilities = {}));
module.exports = { lineutilities };
//# sourceMappingURL=lineutilities.js.map