"use strict";
// uuid: 3ea0fe12-a11b-4fde-9d68-ccd7a3ee7208
Object.defineProperty(exports, "__esModule", { value: true });
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
var transformutilities_1 = require("./transformutilities");
var insertutilities_1 = require("./insertutilities");
var lineutilities_1 = require("./lineutilities");
module.exports = utilityList;
function utilityList() {
    return {
        'IX:capitalize': function () { return transformutilities_1.transformutilities.capitalize(); },
        'IX:camelCase': function () { return transformutilities_1.transformutilities.camelCase(); },
        'IX:dashCase': function () { return transformutilities_1.transformutilities.dashCase(); },
        'IX:spaceByUpper': function () { return transformutilities_1.transformutilities.spaceByUpper(); },
        'IX:urlEncode': function () { return transformutilities_1.transformutilities.urlEncode(); },
        'IX:urlDecode': function () { return transformutilities_1.transformutilities.urlDecode(); },
        'IX:reverseAssignment': function () { return transformutilities_1.transformutilities.reverseAssignment(); },
        'IX:unixToWinSlash': function () { return transformutilities_1.transformutilities.unixToWinSlash(); },
        'IX:winToUnixSlash': function () { return transformutilities_1.transformutilities.winToUnixSlash(); },
        'IX:singleToDoubleSlash': function () { return transformutilities_1.transformutilities.singleToDoubleSlash(); },
        'IX:doubleToSingleSlash': function () { return transformutilities_1.transformutilities.doubleToSingleSlash(); },
        'IX:regnize': function () { return transformutilities_1.transformutilities.regnize(); },
        'IX:headerToBookmark': function () { return transformutilities_1.transformutilities.headerToBookmark(); },
        'IX:mixer': function () { return transformutilities_1.transformutilities.mixer(); },
        'IX:removeDuplicatedLines': function () { return lineutilities_1.lineutilities.removeDuplicatedLines(); },
        'IX:removeEmptyLines': function () { return lineutilities_1.lineutilities.removeEmptyLines(); },
        'IX:joinLines': function () { return lineutilities_1.lineutilities.joinLines(); },
        'IX:splitLines': function () { return lineutilities_1.lineutilities.splitLines(); },
        'IX:sortNumericallyAscending': function () { return lineutilities_1.lineutilities.sortNumericallyAscending(); },
        'IX:indentOneSpace': function () { return lineutilities_1.lineutilities.indentOneSpace(); },
        'IX:outdentOneSpace': function () { return lineutilities_1.lineutilities.outdentOneSpace(); },
        'IX:insertISODate': function () { return insertutilities_1.insertutilities.insertISODate(); },
        'IX:insertISOTimeDate': function () { return insertutilities_1.insertutilities.insertISOTimeDate(); },
        'IX:insertUUID': function () { return insertutilities_1.insertutilities.insertUUID(); },
        'IX:insertTextAtEnd': function () { return insertutilities_1.insertutilities.insertTextAtEnd(); },
        'IX:insertTextAtStart': function () { return insertutilities_1.insertutilities.insertTextAtStart(); }
    };
}
//# sourceMappingURL=utility-list.js.map