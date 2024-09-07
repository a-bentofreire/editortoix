// --------------------------------------------------------------------
// Copyright (c) 2016-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License
// --------------------------------------------------------------------

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