'use strict';
// uuid: 3ea0fe12-a11b-4fde-9d68-ccd7a3ee7208

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

import { um } from './utilitymanager';
import { ep } from './expressionprocessor';

export namespace transformutilities {

  // ------------------------------------------------------------------------
  //                               In Transform Utilities
  //
  // $cattitle: Transform Text Utilities
  // ------------------------------------------------------------------------

  // ------------------------------------------------------------------------
  // $utility: capitalize
  //
  // $keywords: capitalize
  // $eg: classNameFunc  ->  ClassNameFunc
  // ------------------------------------------------------------------------

  export function capitalize(): void {
    um.utilityManager({
      utilType: um.TIXUtilityType.utInTransform,
      sp: um.TIXSelPolicy.Word,
      pat: /\b(_*\w)/g, repl: (_match, p1: string) => p1.toUpperCase(),
    });
  }

  // ------------------------------------------------------------------------
  // $utility: camelCase
  //
  // $keywords: camel, camelcase
  // $eg: ClassNameFunc  ->  classNameFunc
  // ------------------------------------------------------------------------

  export function camelCase(): void {
    um.utilityManager({
      utilType: um.TIXUtilityType.utInTransform,
      sp: um.TIXSelPolicy.Word,
      pat: /\b(_*\w)/g, repl: (_match, p1: string) => p1.toLowerCase(),
    });
  }

  // ------------------------------------------------------------------------
  // $utility: dashCase
  //
  // $keywords: dash, dashCase
  // $eg: ClassNameFunc  ->  class-name-func
  // ------------------------------------------------------------------------

  export function dashCase() {
    um.utilityManager({
      utilType: um.TIXUtilityType.utInTransform,
      sp: um.TIXSelPolicy.Word,
      pat: /\b(\w+)\b/g,
      repl: (_match, p1) => p1
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .toLowerCase()
        .replace(/_/g, '-'),
    });
  }

  // ------------------------------------------------------------------------
  // $utility: spaceByUpper
  //
  // $title: Add Space before Uppercase
  // $keywords: space, assignment
  // $eg: doActionBefore  ->  do Action Before
  // $desc: Useful to transform functions names into documentation
  // ------------------------------------------------------------------------

  export function spaceByUpper(): void {
    um.utilityManager({
      utilType: um.TIXUtilityType.utInTransform,
      sp: um.TIXSelPolicy.Word,
      pat: /([A-Z])/g, repl: (_match, p1: string) => ' ' + p1,
    });
  }

  // ------------------------------------------------------------------------
  // $--utility: htmlEncode (DISABLED)
  //
  // $keywords: encode, htmlEncode
  // $eg: <h1>Title</h1>  ->  &lt;h1&gt;Title&lt;/h1&gt;
  // ------------------------------------------------------------------------

/*   export function htmlEncode(): void {
    um.utilityManager({
      utilType: um.TIXUtilityType.utTransform,
      sp: um.TIXSelPolicy.Line,
    }, (up): string => {
      const d = document.createElement('div');
      d.textContent = up.intext;
      return d.innerHTML;
    });
  }
 */
  // ------------------------------------------------------------------------
  // $--utility: htmlDecode (DISABLED)
  //
  // $keywords: encode, htmlDecode
  // $eg: &lt;h1&gt;Title&lt;/h1&gt;  ->  <h1>Title</h1>
  // ------------------------------------------------------------------------

/*   export function htmlDecode(): void {
    um.utilityManager({
      utilType: um.TIXUtilityType.utTransform,
      sp: um.TIXSelPolicy.Line,
    }, (up): string => {
      const d = document.createElement('div');
      d.innerHTML = up.intext;
      return d.textContent;
    });
  }
 */
  // ------------------------------------------------------------------------
  // $utility: urlEncode
  //
  // $keywords: encode, urldecode
  // $eg: https://github.com  ->  https%3A%2F%2Fgithub.com
  // ------------------------------------------------------------------------

  export function urlEncode(): void {

    um.utilityManager({
      utilType: um.TIXUtilityType.utTransform,
      sp: um.TIXSelPolicy.Line,
    }, (up): string => encodeURIComponent(up.intext));
  }

  // ------------------------------------------------------------------------
  // $utility: urlDecode
  //
  // $keywords: decode, urldecode
  // $eg: https%3A%2F%2Fgithub.com  ->  https://github.com
  // ------------------------------------------------------------------------

  export function urlDecode(): void {

    um.utilityManager({
      utilType: um.TIXUtilityType.utTransform,
      sp: um.TIXSelPolicy.Line,
    }, (up): string => decodeURIComponent(up.intext));
  }

  // ------------------------------------------------------------------------
  // $utility: reverseAssignment
  //
  // $keywords: reverse, assignment
  // $eg: x == y[x] + 5  ->  y[x] + 5 == x
  // $desc: Reverses the terms of assignments or equal/different comparisons
  // ------------------------------------------------------------------------

  export function reverseAssignment(): void {
    um.utilityManager({
      utilType: um.TIXUtilityType.utInTransform,
      sp: um.TIXSelPolicy.Sentence,
      pat: /\b(.+)(\s+)([=<>]=*|[!:]=+)(\s+)([^;]+)/,
      repl: "$5$2$3$4$1",
    });
  }

  // ------------------------------------------------------------------------
  // $utility: unixToWinSlash
  //
  // $keywords: slash, windows, unix
  // $eg: chocolate/candy  ->  chocolate\candy
  // $desc: Converts slashes to backslashes
  // ------------------------------------------------------------------------

  export function unixToWinSlash(): void {
    um.utilityManager({
      utilType: um.TIXUtilityType.utInTransform,
      sp: um.TIXSelPolicy.Line,
      pat: /\//g, repl: '\\',
    });
  }

  // ------------------------------------------------------------------------
  // $utility: winToUnixSlash
  //
  // $keywords: slash, windows, unix
  // $eg: chocolate\candy  ->  chocolate/candy
  // $desc: Converts backslashes to slashes
  // ------------------------------------------------------------------------

  export function winToUnixSlash(): void {
    um.utilityManager({
      utilType: um.TIXUtilityType.utInTransform,
      sp: um.TIXSelPolicy.Line,
      pat: /\\/g, repl: '/',
    });
  }

  // ------------------------------------------------------------------------
  // $utility: singleToDoubleSlash
  //
  // $keywords: slash, single slash, double slash
  // $eg: find\nagain  ->  find\\\nagain
  // ------------------------------------------------------------------------

  export function singleToDoubleSlash(): void {
    um.utilityManager({
      utilType: um.TIXUtilityType.utInTransform,
      sp: um.TIXSelPolicy.Line,
      pat: /\\/g, repl: '\\\\',
    });
  }

  // ------------------------------------------------------------------------
  // $utility: doubleToSingleSlash
  //
  // $keywords: slash, single slash, double slash
  // $eg: find\\\nagain -> find\nagain
  // ------------------------------------------------------------------------

  export function doubleToSingleSlash(): void {
    um.utilityManager({
      utilType: um.TIXUtilityType.utInTransform,
      sp: um.TIXSelPolicy.Line,
      pat: /\\\\/g, repl: '\\',
    });
  }

  // ------------------------------------------------------------------------
  // $utility: regnize
  //
  // $desc: Adds slash to regular expression metachars
  // $keywords: regular expressions
  // $eg: (\w+)[A-Z]a*b+text  ->  \(\\w\+\)\[A-Z\]a\*b\+text
  // ------------------------------------------------------------------------

  export function regnize(): void {

    um.utilityManager({
      utilType: um.TIXUtilityType.utTransform,
    }, (up): string => ep.regnize(up.intext, true));
  }

  // ------------------------------------------------------------------------
  // $utility: headerToBookmark
  //
  // $desc: Converts markdown header text to Html Bookmark
  // $keywords: markdown html bookmark
  // $eg: Is this the header 你好?  ->  is-this-the-header-你好
  // ------------------------------------------------------------------------

  export function headerToBookmark(): void {

    um.utilityManager({
      utilType: um.TIXUtilityType.utTransform,
    }, (up): string => up.intext.trim().toLowerCase()
      .replace(/[^\w\- \u0080-\uFFFFF]+/ug, ' ')
      .replace(/\s+/g, '-').replace(/\-+$/, ''));
  }

  // ------------------------------------------------------------------------
  // $utility: mixer
  //
  // $desc: Mixes lines of different sections.
  // $keywords: mix
  // $eg: // section||abc||cde||// end-section|| // section||123||345 -> abc||123||cde||345
  // ------------------------------------------------------------------------

  export function mixer(): void {

    um.utilityManagerWithUserInputs({
      utilType: um.TIXUtilityType.utTransform,
    },
      [
        { prompt: 'Start Section Line Pattern' },
        { prompt: 'End Section Line Pattern' },
        { prompt: 'Mixer' },
      ],

      (up): string => {
        const startSection = up.userinputs[0];
        const endSection = up.userinputs[1];
        const mixerInput = up.userinputs[2];
        if (!startSection || !endSection || !mixerInput) {
          return up.intext;
        }

        const sections: string[][] = [];
        const regStartSection = new RegExp(startSection);
        const regEndSection = new RegExp(endSection);
        let section: string[];

        const lines = up.intext.split(/\n/);
        const outLines: string[] = [];
        let insertAtLine: number;

        lines.forEach((line, lineNr) => {
          if (!section) {
            // scans for the section start
            if (regStartSection.test(line)) {
              section = [];
              insertAtLine = insertAtLine || lineNr;
            } else {
              outLines.push(line);
            }

          } else {
            // scans for the section end
            if (regEndSection.test(line)) {
              sections.push(section);
              section = undefined;
            } else {
              section.push(line);
            }
          }
        });

        // needs at least 2 section to mix
        if (sections.length < 2) {
          return up.intext;
        }

        const insData = sections[0].map((_line, lineNr) => mixerInput
          .replace(/\$(\d+)/g, (_all, secNr) => sections[parseInt(secNr)][lineNr])
          .replace(/\\n/g, '\n'),
        );

        outLines.splice(insertAtLine, 0, insData.join('\n'));
        return outLines.join('\n');
      });
  }
}

declare var module;
module.exports = { transformutilities };
