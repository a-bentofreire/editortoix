'use strict';
// uuid: d477c481-d965-4afa-baac-56343a395d74

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

import { um } from './utilitymanager';
import { ep } from './expressionprocessor';

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
  // $utility: joinLines
  //
  // $keywords: join, lines
  // $eg: red||green||-> expr:(x\c{X0A}),||red(x0A),green(x0B)
  // $desc: Joins lines adding the computed expression at the end of every line
  // ------------------------------------------------------------------------

  export function joinLines(): void {
    um.utilityManagerWithUserInputs({
      utilType: um.TIXUtilityType.utLinesUtility,
    },
      [{ prompt: 'Expression' }],
      (up): string[] => {
        let userInput = up.userinputs[0];

        // when the userInput doesn't have dynamic values
        // is much faster to bypass processing line by line
        if (ep.hasDynamicValues(userInput)) {
          up.inlines.forEach((line, index) => {
            up.inlines[index] += ep.processExpression(userInput, up.selNr + index, line);
          });
          userInput = '';
        } else {
          userInput = ep.processExpression(userInput, up.selNr, up.intext);
        }

        const joinedLines = up.inlines.join(userInput);
        return [joinedLines];
      });
  }

  // ------------------------------------------------------------------------
  // $utility: splitLines
  //
  // $keywords: split, lines
  // $eg: red,green||-> expr: = \c{1}||red = 1||green = 2
  // $desc: Split lines by an expression. Dynamic values aren't supported
  // ------------------------------------------------------------------------

  export function splitLines(): void {
    um.utilityManagerWithUserInputs({
      utilType: um.TIXUtilityType.utLinesUtility,
    },
      [{ prompt: 'Expression' }],
      (up): string[] => {
        const userInput = ep.processExpression(up.userinputs[0], up.selNr, up.intext);
        let resLines = [];
        const index = 0;
        up.inlines.forEach((line) => {
          resLines = resLines.concat(line.split(userInput));
        });
        return resLines;
      });
  }

  // ------------------------------------------------------------------------
  // $utility: sortNumericallyAscending
  //
  // $keywords: sort
  // $eg: 10. red||2. green||->||2. green||10. red
  // $desc: For each line uses the first number as sort key
  // ------------------------------------------------------------------------

  export function sortNumericallyAscending(): void {
    um.utilityManager({
      utilType: um.TIXUtilityType.utLinesUtility,
    },
      (up): string[] => {
        const keylines: any[][] = up.inlines.map((line => {
          const match = line.match(/(\d+)/);
          const key = match ? parseInt(match[0]) : 0;
          return [key, line];
        }));
        keylines.sort((a, b) => a[0] - b[0]);
        return keylines.map(keypair => keypair[1]);
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

declare var module;
module.exports = { lineutilities };
