'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// uuid: 3ea0fe12-a11b-4fde-9d68-ccd7a3ee7208
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
var utilitymanager_1 = require("./utilitymanager");
var expressionprocessor_1 = require("./expressionprocessor");
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
            pat: /\b(_*\w)/g, repl: function (_match, p1) { return p1.toUpperCase(); },
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
            pat: /\b(_*\w)/g, repl: function (_match, p1) { return p1.toLowerCase(); },
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
            repl: function (_match, p1) { return p1
                .replace(/([a-z])([A-Z])/g, '$1-$2')
                .toLowerCase()
                .replace(/_/g, '-'); },
        });
    }
    transformutilities.dashCase = dashCase;
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
            pat: /([A-Z])/g, repl: function (_match, p1) { return ' ' + p1; },
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
        }, function (up) { return encodeURIComponent(up.intext); });
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
        }, function (up) { return decodeURIComponent(up.intext); });
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
            pat: /\b(.+)(\s+)([=<>]=*|[!:]=+)(\s+)([^;]+)/,
            repl: "$5$2$3$4$1",
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
    // $utility: regnize
    //
    // $desc: Adds slash to regular expression metachars
    // $keywords: regular expressions
    // $eg: (\w+)[A-Z]a*b+text  ->  \(\\w\+\)\[A-Z\]a\*b\+text
    // ------------------------------------------------------------------------
    function regnize() {
        utilitymanager_1.um.utilityManager({
            utilType: utilitymanager_1.um.TIXUtilityType.utTransform,
        }, function (up) { return expressionprocessor_1.ep.regnize(up.intext, true); });
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
        }, function (up) { return up.intext.trim().toLowerCase()
            .replace(/[^\w\- \u0080-\uFFFFF]+/ug, ' ')
            .replace(/\s+/g, '-').replace(/\-+$/, ''); });
    }
    transformutilities.headerToBookmark = headerToBookmark;
    // ------------------------------------------------------------------------
    // $utility: mixer
    //
    // $desc: Mixes lines of different sections.
    // $keywords: mix
    // $eg: // section||abc||cde||// end-section|| // section||123||345 -> abc||123||cde||345
    // ------------------------------------------------------------------------
    function mixer() {
        utilitymanager_1.um.utilityManagerWithUserInputs({
            utilType: utilitymanager_1.um.TIXUtilityType.utTransform,
        }, [
            { prompt: 'Start Section Line Pattern' },
            { prompt: 'End Section Line Pattern' },
            { prompt: 'Mixer' },
        ], function (up) {
            var startSection = up.userinputs[0];
            var endSection = up.userinputs[1];
            var mixerInput = up.userinputs[2];
            if (!startSection || !endSection || !mixerInput) {
                return up.intext;
            }
            var sections = [];
            var regStartSection = new RegExp(startSection);
            var regEndSection = new RegExp(endSection);
            var section;
            var lines = up.intext.split(/\n/);
            var outLines = [];
            var insertAtLine;
            lines.forEach(function (line, lineNr) {
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
            var insData = sections[0].map(function (_line, lineNr) { return mixerInput
                .replace(/\$(\d+)/g, function (_all, secNr) { return sections[parseInt(secNr)][lineNr]; })
                .replace(/\\n/g, '\n'); });
            outLines.splice(insertAtLine, 0, insData.join('\n'));
            return outLines.join('\n');
        });
    }
    transformutilities.mixer = mixer;
})(transformutilities = exports.transformutilities || (exports.transformutilities = {}));
module.exports = { transformutilities: transformutilities };
//# sourceMappingURL=transformutilities.js.map