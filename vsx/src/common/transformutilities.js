'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformutilities = void 0;
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// ------------------------------------------------------------------------
const utilitymanager_1 = require("./utilitymanager");
const expressionprocessor_1 = require("./expressionprocessor");
var transformutilities;
(function (transformutilities) {
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
    function capitalize() {
        utilitymanager_1.um.utilityManager({
            utilType: utilitymanager_1.um.TIXUtilityType.utInTransform,
            sp: utilitymanager_1.um.TIXSelPolicy.Word,
            pat: /\b(_*\w)/g, repl: (_match, p1) => p1.toUpperCase(),
        });
    }
    transformutilities.capitalize = capitalize;
    // ------------------------------------------------------------------------
    // $utility: camelCase
    //
    // $keywords: camel, camelcase
    // $eg: ClassNameFunc  ->  classNameFunc
    // ------------------------------------------------------------------------
    function camelCase() {
        utilitymanager_1.um.utilityManager({
            utilType: utilitymanager_1.um.TIXUtilityType.utInTransform,
            sp: utilitymanager_1.um.TIXSelPolicy.Word,
            pat: /\b(_*\w)/g, repl: (_match, p1) => p1.toLowerCase(),
        });
    }
    transformutilities.camelCase = camelCase;
    // ------------------------------------------------------------------------
    // $utility: dashCase
    //
    // $keywords: dash, dashCase
    // $eg: ClassNameFunc  ->  class-name-func
    // ------------------------------------------------------------------------
    function dashCase() {
        utilitymanager_1.um.utilityManager({
            utilType: utilitymanager_1.um.TIXUtilityType.utInTransform,
            sp: utilitymanager_1.um.TIXSelPolicy.Word,
            pat: /\b(\w+)\b/g,
            repl: (_match, p1) => p1
                .replace(/([a-z])([A-Z])/g, '$1-$2')
                .toLowerCase()
                .replace(/_/g, '-'),
        });
    }
    transformutilities.dashCase = dashCase;
    // ------------------------------------------------------------------------
    // $utility: cycleCase
    //
    // $title: Cycle Case
    // $keywords: case
    // $eg: _ClassNameFunc  ->  _classNameFunc -> _CLASS_NAME_FUNC -> _class_name_func -> _class-name-func -> _class name func ->_ClassNameFunc
    // ------------------------------------------------------------------------
    function cycleCase() {
        utilitymanager_1.um.utilityManager({
            utilType: utilitymanager_1.um.TIXUtilityType.utInTransform,
            sp: utilitymanager_1.um.TIXSelPolicy.Word,
            pat: /\b([\w\- ]+)\b/g,
            repl: (_match, p1) => {
                if (p1 === '') {
                    return '';
                }
                // test for space case
                // space testing should be the fist test
                const m6 = p1.match(/^(_*)([^ ])(.* .*)$/);
                if (m6 !== null) {
                    // => cycle to capitalize
                    return m6[1] + m6[2].toUpperCase() + m6[3].toLowerCase().replace(/ +([a-z])/g, (_match, p2) => p2.toUpperCase());
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
                    return m2[1] + m2[2].replace(/([A-Z]+)/g, (_match, p2) => '_' + p2).toUpperCase();
                }
                return p1;
            },
        });
    }
    transformutilities.cycleCase = cycleCase;
    // ------------------------------------------------------------------------
    // $utility: spaceByUpper
    //
    // $title: Add Space before Uppercase
    // $keywords: space, assignment
    // $eg: doActionBefore  ->  do Action Before
    // $desc: Useful to transform functions names into documentation
    // ------------------------------------------------------------------------
    function spaceByUpper() {
        utilitymanager_1.um.utilityManager({
            utilType: utilitymanager_1.um.TIXUtilityType.utInTransform,
            sp: utilitymanager_1.um.TIXSelPolicy.Word,
            pat: /([A-Z])/g, repl: (_match, p1) => ' ' + p1,
        });
    }
    transformutilities.spaceByUpper = spaceByUpper;
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
    function urlEncode() {
        utilitymanager_1.um.utilityManager({
            utilType: utilitymanager_1.um.TIXUtilityType.utTransform,
            sp: utilitymanager_1.um.TIXSelPolicy.Line,
        }, (up) => encodeURIComponent(up.intext));
    }
    transformutilities.urlEncode = urlEncode;
    // ------------------------------------------------------------------------
    // $utility: urlDecode
    //
    // $keywords: decode, urldecode
    // $eg: https%3A%2F%2Fgithub.com  ->  https://github.com
    // ------------------------------------------------------------------------
    function urlDecode() {
        utilitymanager_1.um.utilityManager({
            utilType: utilitymanager_1.um.TIXUtilityType.utTransform,
            sp: utilitymanager_1.um.TIXSelPolicy.Line,
        }, (up) => decodeURIComponent(up.intext));
    }
    transformutilities.urlDecode = urlDecode;
    // ------------------------------------------------------------------------
    // $utility: reverseAssignment
    //
    // $keywords: reverse, assignment
    // $eg: x == y[x] + 5  ->  y[x] + 5 == x
    // $desc: Reverses the terms of assignments or equal/different comparisons
    // ------------------------------------------------------------------------
    function reverseAssignment() {
        utilitymanager_1.um.utilityManager({
            utilType: utilitymanager_1.um.TIXUtilityType.utInTransform,
            sp: utilitymanager_1.um.TIXSelPolicy.Sentence,
            pat: /(\${0,1})\b(.+)(\s+)([=<>]=*|[!:]=+)(\s+)([^;]+)/,
            repl: "$6$3$4$5$1$2",
        });
    }
    transformutilities.reverseAssignment = reverseAssignment;
    // ------------------------------------------------------------------------
    // $utility: unixToWinSlash
    //
    // $keywords: slash, windows, unix
    // $eg: chocolate/candy  ->  chocolate\candy
    // $desc: Converts slashes to backslashes
    // ------------------------------------------------------------------------
    function unixToWinSlash() {
        utilitymanager_1.um.utilityManager({
            utilType: utilitymanager_1.um.TIXUtilityType.utInTransform,
            sp: utilitymanager_1.um.TIXSelPolicy.Line,
            pat: /\//g, repl: '\\',
        });
    }
    transformutilities.unixToWinSlash = unixToWinSlash;
    // ------------------------------------------------------------------------
    // $utility: winToUnixSlash
    //
    // $keywords: slash, windows, unix
    // $eg: chocolate\candy  ->  chocolate/candy
    // $desc: Converts backslashes to slashes
    // ------------------------------------------------------------------------
    function winToUnixSlash() {
        utilitymanager_1.um.utilityManager({
            utilType: utilitymanager_1.um.TIXUtilityType.utInTransform,
            sp: utilitymanager_1.um.TIXSelPolicy.Line,
            pat: /\\/g, repl: '/',
        });
    }
    transformutilities.winToUnixSlash = winToUnixSlash;
    // ------------------------------------------------------------------------
    // $utility: singleToDoubleSlash
    //
    // $keywords: slash, single slash, double slash
    // $eg: find\nagain  ->  find\\\nagain
    // ------------------------------------------------------------------------
    function singleToDoubleSlash() {
        utilitymanager_1.um.utilityManager({
            utilType: utilitymanager_1.um.TIXUtilityType.utInTransform,
            sp: utilitymanager_1.um.TIXSelPolicy.Line,
            pat: /\\/g, repl: '\\\\',
        });
    }
    transformutilities.singleToDoubleSlash = singleToDoubleSlash;
    // ------------------------------------------------------------------------
    // $utility: doubleToSingleSlash
    //
    // $keywords: slash, single slash, double slash
    // $eg: find\\\nagain -> find\nagain
    // ------------------------------------------------------------------------
    function doubleToSingleSlash() {
        utilitymanager_1.um.utilityManager({
            utilType: utilitymanager_1.um.TIXUtilityType.utInTransform,
            sp: utilitymanager_1.um.TIXSelPolicy.Line,
            pat: /\\\\/g, repl: '\\',
        });
    }
    transformutilities.doubleToSingleSlash = doubleToSingleSlash;
    // ------------------------------------------------------------------------
    // $utility: dashToUnderscore
    //
    // $keywords: dash, underscore
    // $eg: find-deep-first  ->  find_deep_first
    // ------------------------------------------------------------------------
    function dashToUnderscore() {
        utilitymanager_1.um.utilityManager({
            utilType: utilitymanager_1.um.TIXUtilityType.utInTransform,
            sp: utilitymanager_1.um.TIXSelPolicy.Line,
            pat: /-/g, repl: '_',
        });
    }
    transformutilities.dashToUnderscore = dashToUnderscore;
    // ------------------------------------------------------------------------
    // $utility: underscoreToDash
    //
    // $keywords: dash, underscore
    // $eg: find_deep_first -> find-deep-first
    // ------------------------------------------------------------------------
    function underscoreToDash() {
        utilitymanager_1.um.utilityManager({
            utilType: utilitymanager_1.um.TIXUtilityType.utInTransform,
            sp: utilitymanager_1.um.TIXSelPolicy.Line,
            pat: /_/g, repl: '-',
        });
    }
    transformutilities.underscoreToDash = underscoreToDash;
    // ------------------------------------------------------------------------
    // $utility: regnize
    //
    // $desc: Adds slash to regular expression metachars
    // $keywords: regular expressions
    // $eg: (\w+)[A-Z]a*b+text  ->  \(\\w\+\)\[A-Z\]a\*b\+text
    // ------------------------------------------------------------------------
    function regnize() {
        utilitymanager_1.um.utilityManager({
            utilType: utilitymanager_1.um.TIXUtilityType.utTransform,
        }, (up) => expressionprocessor_1.ep.regnize(up.intext, true));
    }
    transformutilities.regnize = regnize;
    // ------------------------------------------------------------------------
    // $utility: headerToBookmark
    //
    // $desc: Converts markdown header text to Html Bookmark
    // $keywords: markdown html bookmark
    // $eg: Is this the header 你好?  ->  is-this-the-header-你好
    // ------------------------------------------------------------------------
    function headerToBookmark() {
        utilitymanager_1.um.utilityManager({
            utilType: utilitymanager_1.um.TIXUtilityType.utTransform,
        }, (up) => up.intext.trim().toLowerCase()
            .replace(/[^\w\- \u0080-\uFFFFF]+/ug, ' ')
            .replace(/\s+/g, '-').replace(/-+$/, ''));
    }
    transformutilities.headerToBookmark = headerToBookmark;
    // ------------------------------------------------------------------------
    // $utility: mixer
    //
    // $desc: Mixes lines of different sections.
    // $keywords: mix
    // $eg: // section||abc||cde||// end-section|| // section||123||345|| // section -> abc||123||cde||345
    // ------------------------------------------------------------------------
    function mixer() {
        utilitymanager_1.um.utilityManagerWithUserInputs({
            utilType: utilitymanager_1.um.TIXUtilityType.utTransform,
        }, [
            { prompt: 'Start Section Line Pattern' },
            { prompt: 'End Section Line Pattern' },
            { prompt: 'Mixer' },
        ], (up) => {
            const startSection = up.userinputs[0];
            const endSection = up.userinputs[1];
            const mixerInput = up.userinputs[2];
            if (!startSection || !endSection || !mixerInput) {
                return up.intext;
            }
            const sections = [];
            const regStartSection = new RegExp(startSection);
            const regEndSection = new RegExp(endSection);
            let section;
            const lines = up.intext.split(/\n/);
            const outLines = [];
            let insertAtLine;
            lines.forEach((line, lineNr) => {
                if (!section) {
                    // scans for the section start
                    if (regStartSection.test(line)) {
                        section = [];
                        insertAtLine = insertAtLine || lineNr;
                    }
                    else {
                        outLines.push(line);
                    }
                }
                else {
                    // scans for the section end
                    if (regEndSection.test(line)) {
                        sections.push(section);
                        section = undefined;
                    }
                    else {
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
                .replace(/\\n/g, '\n'));
            outLines.splice(insertAtLine, 0, insData.join('\n'));
            return outLines.join('\n');
        });
    }
    transformutilities.mixer = mixer;
})(transformutilities || (exports.transformutilities = transformutilities = {}));
module.exports = { transformutilities };
//# sourceMappingURL=transformutilities.js.map