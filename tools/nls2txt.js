/*
 * @preserve Copyright (c) 2016 ApptoIX Limited. All rights reserved.
 * @author Alexandre Bento Freire
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */


/*jslint vars: true, plusplus: true, devel: true, white: true, nomen: true, indent: 4, maxerr: 50 */
/*global require, exports, console */

var LANGS = ['root', 'pt', 'de'],
    TRANSL = '@translator';

(function () {
  'use strict';

  var fs = require('fs');

  // ------------------------------------------------------------------------
  //                               from systoix.js
  // ------------------------------------------------------------------------
  function loadText(filename, encoding) {
    return fs.readFileSync(filename, {encoding: encoding || 'utf-8'});
  }

  function saveText(filename, data) {
    return fs.writeFileSync(filename, data);
  }
  // ------------------------------------------------------------------------
  //                               run
  // ------------------------------------------------------------------------
  function run() {
    var map = {},
        out = ['\t' + LANGS.join('\t')];

    map[TRANSL] = {};

    // load files
    LANGS.forEach(function (lang) {
      loadText('../nls/' + lang + '/strings.js').split('\n').forEach(function (line) {
        var value,
            match = line.match(/^\s*'(.*)'\s*:\s*'(.*)'\s*(,){0,1}\s*$/);
        if (match && match.length) {
          value = map[match[1]] || {};
          value[lang] = match[2];
          map[match[1]] = value;
        } else {
          match = line.match(/\s*\*\s*@translator\s*(.*)\s*$/);
          if (match && match.length) {
            map[TRANSL][lang] = match[1];
          }
        }
      });
    });

    // build output
    Object.keys(map).forEach(function (key) {
      var line = [key],
          value = map[key];
      LANGS.forEach(function (lang) {
        line.push(value[lang] || '');
      });
      out.push(line.join('\t'));

      saveText('../nls/i18n-dev.tsv', out.join('\n'));
    });
  }

  run();
}());