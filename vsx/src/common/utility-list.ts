'use strict';

// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// ------------------------------------------------------------------------

import { transformutilities } from './transformutilities';
import { lineutilities } from './lineutilities';
import { insertutilities } from './insertutilities';
import { clipboardutilities } from './clipboardutilities';

export interface TUtilityDef {
  f: () => void;
  id: string;
}

export const utilityList: TUtilityDef[] = [
  { f: transformutilities.capitalize, id: 'editor.capitalize' },
  { f: transformutilities.camelCase, id: 'editor.camelCase' },
  { f: transformutilities.dashCase, id: 'editor.dashCase' },
  { f: transformutilities.cycleCase, id: 'editor.cycleCase' },
  { f: transformutilities.spaceByUpper, id: 'editor.spaceByUpper' },
  { f: transformutilities.urlEncode, id: 'editor.urlEncode' },
  { f: transformutilities.urlDecode, id: 'editor.urlDecode' },
  { f: transformutilities.reverseAssignment, id: 'editor.reverseAssignment' },
  { f: transformutilities.unixToWinSlash, id: 'editor.unixToWinSlash' },
  { f: transformutilities.winToUnixSlash, id: 'editor.winToUnixSlash' },
  { f: transformutilities.singleToDoubleSlash, id: 'editor.singleToDoubleSlash' },
  { f: transformutilities.doubleToSingleSlash, id: 'editor.doubleToSingleSlash' },
  { f: transformutilities.dashToUnderscore, id: 'editor.dashToUnderscore' },
  { f: transformutilities.underscoreToDash, id: 'editor.underscoreToDash' },
  { f: transformutilities.regnize, id: 'editor.regnize' },
  { f: transformutilities.headerToBookmark, id: 'editor.headerToBookmark' },
  { f: transformutilities.mixer, id: 'editor.mixer' },
  { f: lineutilities.removeDuplicatedLines, id: 'editor.removeDuplicatedLines' },
  { f: lineutilities.removeEmptyLines, id: 'editor.removeEmptyLines' },
  { f: lineutilities.joinLines, id: 'editor.joinLines' },
  { f: lineutilities.splitLines, id: 'editor.splitLines' },
  { f: lineutilities.sortNumericallyAscending, id: 'editor.sortNumericallyAscending' },
  { f: lineutilities.sortNumericallyDescending, id: 'editor.sortNumericallyDescending' },
  { f: lineutilities.indentOneSpace, id: 'editor.indentOneSpace' },
  { f: lineutilities.outdentOneSpace, id: 'editor.outdentOneSpace' },
  { f: lineutilities.breakLineAt, id: 'editor.breakLineAt' },
  { f: lineutilities.replaceRecipes, id: 'editor.replaceRecipes' },
  { f: insertutilities.insertISODate, id: 'editor.insertISODate' },
  { f: insertutilities.insertISOTimeDate, id: 'editor.insertISOTimeDate' },
  { f: insertutilities.insertUUID, id: 'editor.insertUUID' },
  { f: insertutilities.insertTextAtEnd, id: 'editor.insertTextAtEnd' },
  { f: insertutilities.insertTextAtStart, id: 'editor.insertTextAtStart' },
  { f: clipboardutilities.extractText, id: 'editor.extractText' }
];
