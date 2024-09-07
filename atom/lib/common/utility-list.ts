// uuid: 3ea0fe12-a11b-4fde-9d68-ccd7a3ee7208

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

import { transformutilities } from './transformutilities';
import { insertutilities } from './insertutilities';
import { lineutilities } from './lineutilities';

declare var module;
module.exports = utilityList;

function utilityList() {
  return {
    'IX:capitalize': () => transformutilities.capitalize(),
    'IX:camelCase': () => transformutilities.camelCase(),
    'IX:dashCase': () => transformutilities.dashCase(),
    'IX:spaceByUpper': () => transformutilities.spaceByUpper(),
    'IX:urlEncode': () => transformutilities.urlEncode(),
    'IX:urlDecode': () => transformutilities.urlDecode(),
    'IX:reverseAssignment': () => transformutilities.reverseAssignment(),
    'IX:unixToWinSlash': () => transformutilities.unixToWinSlash(),
    'IX:winToUnixSlash': () => transformutilities.winToUnixSlash(),
    'IX:singleToDoubleSlash': () => transformutilities.singleToDoubleSlash(),
    'IX:doubleToSingleSlash': () => transformutilities.doubleToSingleSlash(),
    'IX:regnize': () => transformutilities.regnize(),
    'IX:headerToBookmark': () => transformutilities.headerToBookmark(),
    'IX:mixer': () => transformutilities.mixer(),
    'IX:removeDuplicatedLines': () => lineutilities.removeDuplicatedLines(),
    'IX:removeEmptyLines': () => lineutilities.removeEmptyLines(),
    'IX:joinLines': () => lineutilities.joinLines(),
    'IX:splitLines': () => lineutilities.splitLines(),
    'IX:sortNumericallyAscending': () => lineutilities.sortNumericallyAscending(),
    'IX:indentOneSpace': () => lineutilities.indentOneSpace(),
    'IX:outdentOneSpace': () => lineutilities.outdentOneSpace(),
    'IX:insertISODate': () => insertutilities.insertISODate(),
    'IX:insertISOTimeDate': () => insertutilities.insertISOTimeDate(),
    'IX:insertUUID': () => insertutilities.insertUUID(),
    'IX:insertTextAtEnd': () => insertutilities.insertTextAtEnd(),
    'IX:insertTextAtStart': () => insertutilities.insertTextAtStart()
  };
}
