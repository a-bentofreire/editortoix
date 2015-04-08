/*
 * @preserve Copyright (c) 2015 ApptoIX Limited. All rights reserved.
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
    SRCFILE = '../nls/i18n-dev.tsv',
    TEMPLATEFILE = '../nls/root/strings.js',
    AUTOWARN = '// this is automatic generated file. Edit i18n-dev.tsv and run node txt2nls.js\n',
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
  function buildTemplate() {
    var templ = { pre: loadText(TEMPLATEFILE).split('ne(', 1)[0] + 'ne({',
                 post: '});'};
    templ.pre = AUTOWARN + templ.pre;
    return templ;
  }

  function run() {
    var template = buildTemplate(),
        inp = loadText(SRCFILE).split('\n'),
        langs = inp[0].trim().split('\t'),
        data = [];

    langs.forEach(function (lang) {
      data.push({lang: lang, translator: '', values: []});
    });

    inp.splice(0, 1);
    inp.forEach(function (line) {
      var fields, istrans, max, key,
          i, value;
      line.trim();
      if (line.length) {

        fields = line.split('\t');
        key = fields[0].trim();
        istrans = key === TRANSL;
        max = Math.min(langs.length, fields.length - 1);

        for (i = 0; i < max; i++) {
          value = fields[i + 1];
          if (value.trim().length) {
            if (istrans) {
              data[i].translator = value;
            } else {
              data[i].values.push([key, value]);
            }
          }
        }
      }
    });

    langs.forEach(function (lang, index) {
      console.log(lang);
      var out = [template.pre], last;
      if (data[index].translator.length) {
        out[0] = out[0].replace(/(@author [\w\s]+)\s*\n/, '$1\n * ' + TRANSL + ' ' + data[index].translator + '\n');
      }
      data[index].values.forEach(function (pair) {
        out.push("  '" + pair[0] + "': '" + pair[1] + "',");
      });

      last = out[out.length - 1];
      out[out.length - 1] = last.substr(0, last.length - 1); // remove the last comma
      out.push(template.post);
      saveText('../nls/' + lang + '/strings.js', out.join('\n'));
    });
  }

  run();
}());