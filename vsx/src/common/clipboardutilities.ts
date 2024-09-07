'use strict';

// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// ------------------------------------------------------------------------

import { um } from './utilitymanager';

export namespace clipboardutilities {

  const copyPaste = require("copy-paste");

  // ------------------------------------------------------------------------
  //                               Clipboard Utilities
  //
  // $cattitle: Clipboard Utilities
  // ------------------------------------------------------------------------

  // ------------------------------------------------------------------------
  // $utility: extractText
  //
  // $keywords: clipboard, text
  // $desc: Copies to the clipboard the captured group of a regular expression. Each capture is separated by tabs
  // $eg: (\w+) = (\w+)
  // ------------------------------------------------------------------------

  export function extractText(): void {
    um.utilityManagerWithUserInputs({
      utilType: um.TIXUtilityType.utImmutableLinesUtility,
    },
      [{ prompt: 'Pattern' }],

      (up): void => {
        const text = up.inlines.join('\n');
        const foundPatterns = [];
        text.replace(new RegExp(up.userinputs[0], 'g'), (all, ...p) => {
          const len = p.length - 2;
          const captures = [];
          for (let i = 0; i < len; i++) {
            captures.push(p[i]);
          }
          foundPatterns.push(captures.join('\t'));
          return all;
        });
        copyPaste.copy(foundPatterns.join('\n'));
      });
  }

}

declare const module;
module.exports = { clipboardutilities };
