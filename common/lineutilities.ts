'use strict';
// uuid: d477c481-d965-4afa-baac-56343a395d74

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
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
      sp: um.SP_ALL,
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
      sp: um.SP_ALL,
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


}
