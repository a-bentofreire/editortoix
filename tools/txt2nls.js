'use strict';

// --------------------------------------------------------------------
// Copyright (c) 2016-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License
// --------------------------------------------------------------------

var LANGS = ['root', 'zh', 'zh-TW', 'pt', 'de'],
  SRC_FILE = '../nls/i18n-dev.tsv',
  TEMPLATE_FILE = '../nls/root/strings.js',
  AUTO_WARN = '// this is automatic generated file. Edit i18n-dev.tsv and run node txt2nls.js',
  TRANSL = '@translator';

(function () {
  var fs = require('fs');

  // ------------------------------------------------------------------------
  //                               from systoix.js
  // ------------------------------------------------------------------------
  function loadText(filename, encoding) {
    return fs.readFileSync(filename, {
      encoding: encoding || 'utf-8'
    });
  }

  function saveText(filename, data) {
    return fs.writeFileSync(filename, data);
  }
  // ------------------------------------------------------------------------
  //                               run
  // ------------------------------------------------------------------------
  function buildTemplate() {
    return {
      pre: loadText(TEMPLATE_FILE).split('ne(', 1)[0] + 'ne({',
      post: '});'
    };
  }

  function run() {
    var template = buildTemplate(),
      inp = loadText(SRC_FILE).split('\n'),
      langs = inp[0].trim().split('\t'),
      data = [];

    langs.forEach(function (lang) {
      data.push({
        lang: lang,
        translator: '',
        values: []
      });
    });

    inp.splice(0, 1);
    inp.forEach(function (line) {
      var fields, isTrans, max, key,
        i, value;
      line.trim();
      if (line.length) {

        fields = line.split('\t');
        key = fields[0].trim();
        isTrans = key === TRANSL;
        max = Math.min(langs.length, fields.length - 1);

        for (i = 0; i < max; i++) {
          value = fields[i + 1];
          if (value.trim().length) {
            if (isTrans) {
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
      var out = [template.pre],
        last;
      if (lang != 'root') out.splice(0, 0, AUTO_WARN);
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