'use strict';
// uuid: 579dc6c1-b67f-425f-a60c-3b47455814ab
// ------------------------------------------------------------------------
// Copyright (c) 2016-2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
/*
    Functions that have no external dependecies
*/
// @TODO: Move the isolated functions from main.js to this file
define(function () {
    /** ------------------------------------------------------------------------
     *                               Functions
     ** ------------------------------------------------------------------------ */
    return {
        capitalizeText: {
            pat: /\b(_*\w)/g,
            repl: function (match, p1, offset, string) { return p1.toUpperCase(); }
        },
        camelCaseText: {
            pat: /\b(_*\w)/g,
            repl: function (match, p1, offset, string) { return p1.toLowerCase(); }
        },
        reverse: {
            pat: /\b(.+)(\s+)([=<>]=*|[!:]=+)(\s+)([^;]+)/,
            repl: "$5$2$3$4$1"
        },
        /** ------------------------------------------------------------------------
         *                               Commands: Slash
         ** ------------------------------------------------------------------------ */
        unixToWin: {
            pat: /\//g, repl: '\\'
        },
        winToUnix: {
            pat: /\\/g, repl: '/'
        },
        singleToDoubleSlash: {
            pat: /\\/g, repl: '\\\\'
        },
        doubleToSingleSlash: {
            pat: /\\\\/g, repl: '\\'
        }
    };
});
//# sourceMappingURL=texttransformstoix.js.map