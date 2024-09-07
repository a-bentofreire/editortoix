'use strict';

// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// ------------------------------------------------------------------------

import { um } from './utilitymanager';
import { ep } from './expressionprocessor';

export namespace lineutilities {

  function getLinesKeyPairs(up): [number, string][] {
    const keylines: [number, string][] = up.inlines.map((line => {
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
        const keylines = getLinesKeyPairs(up);
        keylines.sort((a, b) => a[0] - b[0]);
        return keylines.map(keypair => keypair[1]);
      });
  }

  // ------------------------------------------------------------------------
  // $utility: sortNumericallyDescending
  //
  // $keywords: sort
  // $eg: 10. red||2. green||->||10. red||2. green
  // $desc: For each line uses the first number as sort key
  // ------------------------------------------------------------------------

  export function sortNumericallyDescending(): void {
    um.utilityManager({
      utilType: um.TIXUtilityType.utLinesUtility,
    },
      (up): string[] => {
        const keylines = getLinesKeyPairs(up);
        keylines.sort((a, b) => b[0] - a[0]);
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
        up.intext.substring(1) : up.intext);
  }

  // ------------------------------------------------------------------------
  // $utility: breakLineAt
  //
  // $keywords: break lines
  // $eg: __NONE__
  // $desc: Break lines at a certain position
  // $eg: Too long line ->  too long||line
  // ------------------------------------------------------------------------

  function execBreakLineAt(line: string, maxChars: number,
    toBreakWords: boolean): string {

    let start = 0;
    let at: number;
    let stest: string;

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

  export function breakLineAt(): void {
    um.utilityManagerWithUserInputs({
      utilType: um.TIXUtilityType.utLinesUtility,
      sp: um.TIXSelPolicy.All,
    },
      [
        { prompt: 'Max number of Chars(add / at the end to allow word break)' },
      ],

      (up): string[] => {
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
        let resLines: string[] = [];
        up.inlines.forEach((line) => {
          resLines = resLines.concat(execBreakLineAt(line, maxChars, toBreakWords));
        });
        return resLines;
      });
  }

  // ------------------------------------------------------------------------
  // $utility: replaceRecipes
  //
  // $keywords: replace text
  // $desc: replaces text from a list of pre-defined recipes (read Replace Recipes section)
  // ------------------------------------------------------------------------

  interface TRecipe {
    name: string;
    pattern: string;
    replaceWith: string;
    isRegExp: boolean;
    isExpression: boolean;
    ignoreCase: boolean;
  }

  export function replaceRecipes(): void {

    const recipes = um.getConfig('replaceRecipes') as TRecipe[];
    const recipeNames = recipes.map((item: object, index: number) => `${index + 1}. ${item['name']}`);
    um.utilityManagerWithUserInputs({
      utilType: um.TIXUtilityType.utLinesUtility,
    },
      [{
        prompt: "Type the recipe number or name",
        items: recipeNames
      }],
      (up): string[] => {
        if (up.userinputs[0] != '') {
          const recipes = um.getConfig('replaceRecipes') as TRecipe[];
          const recipe = recipes[parseInt(up.userinputs[0].replace(/^(\d+)\..*$/, "$1"), 10) - 1];
          const isExpression = recipe.isExpression !== false;
          const regPattern = recipe.isRegExp !== false ?
            new RegExp(recipe.pattern, recipe.ignoreCase === true ? 'i' : undefined) : recipe.pattern;
          const replaceWith = recipe.replaceWith;
          const resLines = [];
          up.inlines.forEach((line: string, index: number) => {
            const replaceResult = line.replace(regPattern, replaceWith);
            resLines.push(isExpression ? ep.processExpression(replaceResult, index, line)
              : replaceResult);
          });
          return resLines;
        } else {
          return up.inlines;
        }
      });
  }
}

declare const module;
module.exports = { lineutilities };
