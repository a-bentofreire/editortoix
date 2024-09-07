'use strict';

// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
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
  // $utility: cycleCase
  //
  // $title: Cycle Case
  // $keywords: case
  // $eg: _ClassNameFunc  ->  _classNameFunc -> _CLASS_NAME_FUNC -> _class_name_func -> _class-name-func -> _class name func ->_ClassNameFunc
  // ------------------------------------------------------------------------

  export function cycleCase() {
    um.utilityManager({
      utilType: um.TIXUtilityType.utInTransform,
      sp: um.TIXSelPolicy.Word,
      pat: /\b([\w\- ]+)\b/g,
      repl: (_match: string, p1: string) => {
        if (p1 === '') {
          return '';
        }

        // test for space case
        // space testing should be the fist test
        const m6 = p1.match(/^(_*)([^ ])(.* .*)$/);
        if (m6 !== null) {
          // => cycle to capitalize
          return m6[1] + m6[2].toUpperCase() + m6[3].toLowerCase().replace(/ +([a-z])/g,
            (_match: string, p2: string) => p2.toUpperCase());
        }


        // test for uppercase case
        if (p1.match(/^_*[A-Z].*_/) !== null) {
          // => cycle to underscore
          return p1.toLowerCase();
        }

        // test for underscore case
        const m4 = p1.match(/^(_*)([^_]+_.*)$/);
        if (m4 !== null) {
          // => cycle to dash
          return m4[1] + m4[2].replace(/_/g, '-');
        }

        // test for dash case
        const m5 = p1.match(/^(_*)([^-].*-.*)$/);
        if (m5 !== null) {
          // => cycle to space case
          return m5[1] + m5[2].replace(/-/g, ' ');
        }

        // test for capitalize (should be after symbol cases)
        const m1 = p1.match(/^(_*)([A-Z])([^A-Z].*)$/);
        if (m1 !== null) {
          // => cycle to camel
          return m1[1] + m1[2].toLowerCase() + m1[3];
        }

        // test for camel case (should be after symbol cases)
        const m2 = p1.match(/^(_*)([^A-Z_]+[A-Z].*)$/);
        if (m2 !== null) {
          // => cycle to uppercase
          return m2[1] + m2[2].replace(/([A-Z]+)/g,
            (_match: string, p2: string) => '_' + p2).toUpperCase();
        }

        return p1;
      },
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
      pat: /(\${0,1})\b(.+)(\s+)([=<>]=*|[!:]=+)(\s+)([^;]+)/,
      repl: "$6$3$4$5$1$2",
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
  // $utility: dashToUnderscore
  //
  // $keywords: dash, underscore
  // $eg: find-deep-first  ->  find_deep_first
  // ------------------------------------------------------------------------

  export function dashToUnderscore(): void {
    um.utilityManager({
      utilType: um.TIXUtilityType.utInTransform,
      sp: um.TIXSelPolicy.Line,
      pat: /-/g, repl: '_',
    });
  }

  // ------------------------------------------------------------------------
  // $utility: underscoreToDash
  //
  // $keywords: dash, underscore
  // $eg: find_deep_first -> find-deep-first
  // ------------------------------------------------------------------------

  export function underscoreToDash(): void {
    um.utilityManager({
      utilType: um.TIXUtilityType.utInTransform,
      sp: um.TIXSelPolicy.Line,
      pat: /_/g, repl: '-',
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
      .replace(/\s+/g, '-').replace(/-+$/, ''));
  }

  // ------------------------------------------------------------------------
  // $utility: mixer
  //
  // $desc: Mixes lines of different sections.
  // $keywords: mix
  // $eg: // section||abc||cde||// end-section|| // section||123||345|| // section -> abc||123||cde||345
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

declare const module;
module.exports = { transformutilities };
