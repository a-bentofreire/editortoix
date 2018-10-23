define(["require", "exports", "./utilitymanager"], function (require, exports, utilitymanager_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var transformutilities;
    (function (transformutilities) {
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
        function upperCase() {
            utilitymanager_1.um.utilityManager({
                utilType: utilitymanager_1.um.TIXUtilityType.utTransform,
                sp: utilitymanager_1.um.TIXSelPolicy.Word,
            }, function (up) { return up.intext.toUpperCase(); });
        }
        transformutilities.upperCase = upperCase;
        // ------------------------------------------------------------------------
        // $utility: lowerCase
        //
        // $keywords: uppercase
        // $eg: classNameFunc  ->  classnamefunc
        // ------------------------------------------------------------------------
        function lowerCase() {
            utilitymanager_1.um.utilityManager({
                utilType: utilitymanager_1.um.TIXUtilityType.utTransform,
                sp: utilitymanager_1.um.TIXSelPolicy.Word,
            }, function (up) { return up.intext.toLowerCase(); });
        }
        transformutilities.lowerCase = lowerCase;
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
        // $utility: htmlEncode
        //
        // $keywords: encode, htmlEncode
        // $eg: <h1>Title</h1>  ->  &lt;h1&gt;Title&lt;/h1&gt;
        // ------------------------------------------------------------------------
        function htmlEncode() {
            utilitymanager_1.um.utilityManager({
                utilType: utilitymanager_1.um.TIXUtilityType.utTransform,
                sp: utilitymanager_1.um.TIXSelPolicy.Line,
            }, function (up) {
                var d = document.createElement('div');
                d.textContent = up.intext;
                return d.innerHTML;
            });
        }
        transformutilities.htmlEncode = htmlEncode;
        // ------------------------------------------------------------------------
        // $utility: htmlDecode
        //
        // $keywords: encode, htmlDecode
        // $eg: &lt;h1&gt;Title&lt;/h1&gt;  ->  <h1>Title</h1>
        // ------------------------------------------------------------------------
        function htmlDecode() {
            utilitymanager_1.um.utilityManager({
                utilType: utilitymanager_1.um.TIXUtilityType.utTransform,
                sp: utilitymanager_1.um.TIXSelPolicy.Line,
            }, function (up) {
                var d = document.createElement('div');
                d.innerHTML = up.intext;
                return d.textContent;
            });
        }
        transformutilities.htmlDecode = htmlDecode;
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
        // $utility: joinText
        //
        // $keywords: join
        // ------------------------------------------------------------------------
        function joinText() {
            utilitymanager_1.um.utilityManager({
                utilType: utilitymanager_1.um.TIXUtilityType.utInTransform,
                sp: utilitymanager_1.um.TIXSelPolicy.All,
                pat: /\n/g,
                repl: '',
            });
        }
        transformutilities.joinText = joinText;
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
    })(transformutilities = exports.transformutilities || (exports.transformutilities = {}));
});
//# sourceMappingURL=transformutilities.js.map