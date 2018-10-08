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
        // $utility: capitalize
        //
        // $keywords: capitalize
        // $eg: classNameFunc  ->  ClassNameFunc
        // ------------------------------------------------------------------------
        function capitalize() {
            utilitymanager_1.um.utilityManager({
                utilType: utilitymanager_1.um.TIXUtilityType.utInTransform,
                sp: utilitymanager_1.um.SP_WORD,
                pat: /\b(_*\w)/g, repl: function (match, p1) { return p1.toUpperCase(); },
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
                sp: utilitymanager_1.um.SP_WORD,
                pat: /\b(_*\w)/g, repl: function (match, p1) { return p1.toLowerCase(); },
            });
        }
        transformutilities.camelCase = camelCase;
        function dashCase() {
            utilitymanager_1.um.utilityManager({
                utilType: utilitymanager_1.um.TIXUtilityType.utInTransform,
                sp: utilitymanager_1.um.SP_WORD,
                pat: /\b(\w+)\b/g,
                repl: function (_match, p1) { return p1
                    .replace(/([a-z])([A-Z])/g, '$1-$2')
                    .toLowerCase()
                    .replace(/_/g, '-'); },
            });
        }
        transformutilities.dashCase = dashCase;
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
                sp: utilitymanager_1.um.SP_SENTENCE,
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
                sp: utilitymanager_1.um.SP_LINE,
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
        function winToUnix() {
            utilitymanager_1.um.utilityManager({
                utilType: utilitymanager_1.um.TIXUtilityType.utInTransform,
                sp: utilitymanager_1.um.SP_LINE,
                pat: /\\/g, repl: '/',
            });
        }
        transformutilities.winToUnix = winToUnix;
        // ------------------------------------------------------------------------
        // $utility: singleToDoubleSlash
        //
        // $keywords: slash, single slash, double slash
        // $eg: find\nagain  ->  find\\\nagain
        // ------------------------------------------------------------------------
        function singleToDoubleSlash() {
            utilitymanager_1.um.utilityManager({
                utilType: utilitymanager_1.um.TIXUtilityType.utInTransform,
                sp: utilitymanager_1.um.SP_LINE,
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
                sp: utilitymanager_1.um.SP_LINE,
                pat: /\\\\/g, repl: '\\',
            });
        }
        transformutilities.doubleToSingleSlash = doubleToSingleSlash;
        // ------------------------------------------------------------------------
        // $utility: urlEncode
        //
        // $keywords: encode, urldecode
        // $eg: https://github.com  ->  https%3A%2F%2Fgithub.com
        // ------------------------------------------------------------------------
        function urlEncode() {
            utilitymanager_1.um.utilityManager({
                utilType: utilitymanager_1.um.TIXUtilityType.utTransform,
                sp: utilitymanager_1.um.SP_LINE,
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
                sp: utilitymanager_1.um.SP_LINE,
            }, function (up) { return decodeURIComponent(up.intext); });
        }
        transformutilities.urlDecode = urlDecode;
    })(transformutilities = exports.transformutilities || (exports.transformutilities = {}));
});
//# sourceMappingURL=transformutilities.js.map