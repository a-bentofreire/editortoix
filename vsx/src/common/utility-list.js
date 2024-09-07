'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.utilityList = void 0;
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// ------------------------------------------------------------------------
const transformutilities_1 = require("./transformutilities");
const lineutilities_1 = require("./lineutilities");
const insertutilities_1 = require("./insertutilities");
const clipboardutilities_1 = require("./clipboardutilities");
exports.utilityList = [
    { f: transformutilities_1.transformutilities.capitalize, id: 'editor.capitalize' },
    { f: transformutilities_1.transformutilities.camelCase, id: 'editor.camelCase' },
    { f: transformutilities_1.transformutilities.dashCase, id: 'editor.dashCase' },
    { f: transformutilities_1.transformutilities.cycleCase, id: 'editor.cycleCase' },
    { f: transformutilities_1.transformutilities.spaceByUpper, id: 'editor.spaceByUpper' },
    { f: transformutilities_1.transformutilities.urlEncode, id: 'editor.urlEncode' },
    { f: transformutilities_1.transformutilities.urlDecode, id: 'editor.urlDecode' },
    { f: transformutilities_1.transformutilities.reverseAssignment, id: 'editor.reverseAssignment' },
    { f: transformutilities_1.transformutilities.unixToWinSlash, id: 'editor.unixToWinSlash' },
    { f: transformutilities_1.transformutilities.winToUnixSlash, id: 'editor.winToUnixSlash' },
    { f: transformutilities_1.transformutilities.singleToDoubleSlash, id: 'editor.singleToDoubleSlash' },
    { f: transformutilities_1.transformutilities.doubleToSingleSlash, id: 'editor.doubleToSingleSlash' },
    { f: transformutilities_1.transformutilities.dashToUnderscore, id: 'editor.dashToUnderscore' },
    { f: transformutilities_1.transformutilities.underscoreToDash, id: 'editor.underscoreToDash' },
    { f: transformutilities_1.transformutilities.regnize, id: 'editor.regnize' },
    { f: transformutilities_1.transformutilities.headerToBookmark, id: 'editor.headerToBookmark' },
    { f: transformutilities_1.transformutilities.mixer, id: 'editor.mixer' },
    { f: lineutilities_1.lineutilities.removeDuplicatedLines, id: 'editor.removeDuplicatedLines' },
    { f: lineutilities_1.lineutilities.removeEmptyLines, id: 'editor.removeEmptyLines' },
    { f: lineutilities_1.lineutilities.joinLines, id: 'editor.joinLines' },
    { f: lineutilities_1.lineutilities.splitLines, id: 'editor.splitLines' },
    { f: lineutilities_1.lineutilities.sortNumericallyAscending, id: 'editor.sortNumericallyAscending' },
    { f: lineutilities_1.lineutilities.sortNumericallyDescending, id: 'editor.sortNumericallyDescending' },
    { f: lineutilities_1.lineutilities.indentOneSpace, id: 'editor.indentOneSpace' },
    { f: lineutilities_1.lineutilities.outdentOneSpace, id: 'editor.outdentOneSpace' },
    { f: lineutilities_1.lineutilities.breakLineAt, id: 'editor.breakLineAt' },
    { f: lineutilities_1.lineutilities.replaceRecipes, id: 'editor.replaceRecipes' },
    { f: insertutilities_1.insertutilities.insertISODate, id: 'editor.insertISODate' },
    { f: insertutilities_1.insertutilities.insertISOTimeDate, id: 'editor.insertISOTimeDate' },
    { f: insertutilities_1.insertutilities.insertUUID, id: 'editor.insertUUID' },
    { f: insertutilities_1.insertutilities.insertTextAtEnd, id: 'editor.insertTextAtEnd' },
    { f: insertutilities_1.insertutilities.insertTextAtStart, id: 'editor.insertTextAtStart' },
    { f: clipboardutilities_1.clipboardutilities.extractText, id: 'editor.extractText' }
];
//# sourceMappingURL=utility-list.js.map