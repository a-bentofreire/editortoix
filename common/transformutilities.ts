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
  // $utility: upperCase
  //
  // $keywords: uppercase
  // $eg: classNameFunc  ->  CLASSNAMEFUNC
  // ------------------------------------------------------------------------

  export function upperCase(): void {

    um.utilityManager({
      utilType: um.TIXUtilityType.utTransform,
      sp: um.TIXSelPolicy.Word,
    }, (up): string => up.intext.toUpperCase());
  }

  // ------------------------------------------------------------------------
  // $utility: lowerCase
  //
  // $keywords: uppercase
  // $eg: classNameFunc  ->  classnamefunc
  // ------------------------------------------------------------------------

  export function lowerCase(): void {

    um.utilityManager({
      utilType: um.TIXUtilityType.utTransform,
      sp: um.TIXSelPolicy.Word,
    }, (up): string => up.intext.toLowerCase());
  }

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
  // $utility: htmlEncode
  //
  // $keywords: encode, htmlEncode
  // $eg: <h1>Title</h1>  ->  &lt;h1&gt;Title&lt;/h1&gt;
  // ------------------------------------------------------------------------

  export function htmlEncode(): void {
    um.utilityManager({
      utilType: um.TIXUtilityType.utTransform,
      sp: um.TIXSelPolicy.Line,
    }, (up): string => {
      const d = document.createElement('div');
      d.textContent = up.intext;
      return d.innerHTML;
    });
  }

  // ------------------------------------------------------------------------
  // $utility: htmlDecode
  //
  // $keywords: encode, htmlDecode
  // $eg: &lt;h1&gt;Title&lt;/h1&gt;  ->  <h1>Title</h1>
  // ------------------------------------------------------------------------

  export function htmlDecode(): void {
    um.utilityManager({
      utilType: um.TIXUtilityType.utTransform,
      sp: um.TIXSelPolicy.Line,
    }, (up): string => {
      const d = document.createElement('div');
      d.innerHTML = up.intext;
      return d.textContent;
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
  // $utility: joinText
  //
  // $keywords: join
  // ------------------------------------------------------------------------

  export function joinText(): void {
    um.utilityManager({
      utilType: um.TIXUtilityType.utInTransform,
      sp: um.TIXSelPolicy.All,
      pat: /\n/g,
      repl: '',
    });
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

}
