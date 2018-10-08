'use strict';
// uuid: 579dc6c1-b67f-425f-a60c-3b47455814ab

// --------------------------------------------------------------------
// Copyright (c) 2016-2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// --------------------------------------------------------------------

import { um } from './utilitymanager';

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

  export function capitalize() {
    um.utilityManager({
      utilType: um.TIXUtilityType.utInTransform,
      sp: um.SP_WORD,
      pat: /\b(_*\w)/g, repl: (match, p1) => p1.toUpperCase(),
    });
  }

  // ------------------------------------------------------------------------
  // $utility: camelCase
  //
  // $keywords: camel, camelcase
  // $eg: ClassNameFunc  ->  classNameFunc
  // ------------------------------------------------------------------------

  export function camelCase() {
    um.utilityManager({
      utilType: um.TIXUtilityType.utInTransform,
      sp: um.SP_WORD,
      pat: /\b(_*\w)/g, repl: (match, p1) => p1.toLowerCase(),
    });
  }

  export function dashCase() {
    um.utilityManager({
      utilType: um.TIXUtilityType.utInTransform,
      sp: um.SP_WORD,
      pat: /\b(\w+)\b/g,
      repl: (_match, p1) => p1
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .toLowerCase()
        .replace(/_/g, '-'),
    });
  }

  // ------------------------------------------------------------------------
  // $utility: reverseAssignment
  //
  // $keywords: reverse, assignment
  // $eg: x == y[x] + 5  ->  y[x] + 5 == x
  // $desc: Reverses the terms of assignments or equal/different comparisons
  // ------------------------------------------------------------------------

  export function reverseAssignment() {
    um.utilityManager({
      utilType: um.TIXUtilityType.utInTransform,
      sp: um.SP_SENTENCE,
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

  export function unixToWinSlash() {
    um.utilityManager({
      utilType: um.TIXUtilityType.utInTransform,
      sp: um.SP_LINE,
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

  export function winToUnix() {
    um.utilityManager({
      utilType: um.TIXUtilityType.utInTransform,
      sp: um.SP_LINE,
      pat: /\\/g, repl: '/',
    });
  }

  // ------------------------------------------------------------------------
  // $utility: singleToDoubleSlash
  //
  // $keywords: slash, single slash, double slash
  // $eg: find\nagain  ->  find\\\nagain
  // ------------------------------------------------------------------------

  export function singleToDoubleSlash() {
    um.utilityManager({
      utilType: um.TIXUtilityType.utInTransform,
      sp: um.SP_LINE,
      pat: /\\/g, repl: '\\\\',
    });
  }

  // ------------------------------------------------------------------------
  // $utility: doubleToSingleSlash
  //
  // $keywords: slash, single slash, double slash
  // $eg: find\\\nagain -> find\nagain
  // ------------------------------------------------------------------------

  export function doubleToSingleSlash() {
    um.utilityManager({
      utilType: um.TIXUtilityType.utInTransform,
      sp: um.SP_LINE,
      pat: /\\\\/g, repl: '\\',
    });
  }

  // ------------------------------------------------------------------------
  // $utility: urlEncode
  //
  // $keywords: encode, urldecode
  // $eg: https://github.com  ->  https%3A%2F%2Fgithub.com
  // ------------------------------------------------------------------------

  export function urlEncode(): void {

    um.utilityManager({
      utilType: um.TIXUtilityType.utTransform,
      sp: um.SP_LINE,
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
      sp: um.SP_LINE,
    }, (up): string => decodeURIComponent(up.intext));
  }
}
