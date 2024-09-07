'use strict';
// ------------------------------------------------------------------------
// Copyright (c) 2016-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License
// ------------------------------------------------------------------------

import { um } from './utilitymanager';
export namespace lineutilities {

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

  export function removeDuplicatedLines(): void {
    um.utilityManager({
      utilType: um.TIXUtilityType.utLinesUtility,
      sp: um.TIXSelPolicy.All,
    }, (up): string[] => {
      const arr = up.inlines;
      for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i + 1] === arr[i]) {
          arr.splice(i + 1, 1);
        }
      }
      return arr;
    });
  }

  // ------------------------------------------------------------------------
  // $utility: removeEmptyLines
  //
  // $keywords: remove, empty
  // $eg: first||||second||->||first||second
  // ------------------------------------------------------------------------

  export function removeEmptyLines(): void {
    um.utilityManager({
      utilType: um.TIXUtilityType.utLinesUtility,
      sp: um.TIXSelPolicy.All,
    }, (up): string[] => {
      const arr = up.inlines;
      for (let i = arr.length - 1; i >= 0; i--) {
        if (!arr[i].trim()) {
          arr.splice(i, 1);
        }
      }
      return arr;
    });
  }


  // ------------------------------------------------------------------------
  // $utility: indentOneSpace
  //
  // $keywords: indent
  // $eg: __NONE__
  // $desc: Adds one space to the beginning of each line
  // ------------------------------------------------------------------------

  export function indentOneSpace(): void {
    um.utilityManager({
      utilType: um.TIXUtilityType.utLineUtility,
      sp: um.TIXSelPolicy.All,
    },
      (up): string => ' ' + up.intext);
  }

  // ------------------------------------------------------------------------
  // $utility: outdentOneSpace
  //
  // $keywords: indent
  // $eg: __NONE__
  // $desc: Removes one space to the beginning of each line
  // ------------------------------------------------------------------------

  export function outdentOneSpace(): void {
    um.utilityManager({
      utilType: um.TIXUtilityType.utLineUtility,
      sp: um.TIXSelPolicy.All,
    },
      (up): string => up.intext !== '' && up.intext[0] === ' ' ?
        up.intext.substr(1) : up.intext);
  }
}
