/**
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

/*
    Preferences
*/


/*jslint vars: true, plusplus: true, devel: true, white: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, brackets, $ */

define(function() {
  "use strict";
  // ------------------------------------------------------------------------
  //                               UI
  // ------------------------------------------------------------------------ 
  function selectAndClose(inf) {
    inf.closedlg(true);
  }
  // ------------------------------------------------------------------------
  //                               Closure
  // ------------------------------------------------------------------------
  var PREFKEY = 'prefs';

  function _checkForHttp(text) {
    return (text.indexOf('http://') === 0) || (text.indexOf('https://') === 0);
  }

  // Copies from prefs to prefsio, and vice-versa. Used for load & save
  function _buildIo(prefs, prefsio, preftoio) {
    Object.keys(prefs).forEach(function(key) {
      var pref = prefs[key],
          storeprop = pref.storeprop || 'value',
          prefio;

      if (pref[storeprop] !== undefined) {
        prefio = prefsio[key];
        if (prefio === undefined) {
          prefsio[key] = {};
          prefio = prefsio[key];
        }

        if (preftoio) {
          prefio[storeprop] = pref[storeprop];
          if (pref.history) {
            prefio.history = pref.history;
          }
        } else {
          if (prefio !== undefined && prefio[storeprop] !== undefined) {
            pref[storeprop] = prefio[storeprop];
            if (pref.history && prefio.history) {
              pref.history = prefio.history;
            }
          }
        }
        if (pref.fields) {
          if (!prefio.fields) {
            prefio.fields = {};
          }
          _buildIo(pref.fields, prefio.fields, preftoio);
        }
      }
    });
    return prefsio;
  }

  return {
    // ------------------------------------------------------------------------
    //                               Functions
    // ------------------------------------------------------------------------ 
    checkForHttp: function(text) {
      return _checkForHttp(text);
    },

    load: function(prefs, extprefs) {
      extprefs.definePreference(PREFKEY, 'object', _buildIo(prefs, {}, true));
      _buildIo(prefs, extprefs.get(PREFKEY), false);
    },

    save: function(prefs, extprefs) {
      extprefs.set(PREFKEY, _buildIo(prefs, {}, true));
      extprefs.save();
    },
    // ------------------------------------------------------------------------
    //                               Fields
    // ------------------------------------------------------------------------ 
    OPTIONFIELDS: ['tabSize', 'historySize', 'recentSize', 'showcxtedit', 'webSearch', /*'grunt',*/ 'js6', 'scss', 'js'],

    version: {
      value: ''
    },

    // commands options (showinmenu, showinctxmenu, hotkey)
    commands: {
      value: {
        showinmenu: [],
        showinctxmenu: [],
        hotkeys: {}
      }
    },

    // splitText command options
    splitMarker: {
      value: ','
    },

    splitMarkerExtr: {
      value: '\\t',
      samelabelas: 'splitMarker',
      samehintas: 'splitMarker'
    },
    // Used in dialogs
    historySize: {
      value: 20,
      type: 'number'
    },
    recentSize: {
      value: 20,
      type: 'number'
    },
    showcxtedit: {
      value: true,
      type: 'boolean',
      canempty: true
    },
    // recentFiles command options
    recentFiles: {
      value: '',
      rows: 14,
      size: '100%',
      type: 'list',
      storeprop: 'files',
      files: [],
      values: [],
      events: [{
        name: 'dblclick',
        f: selectAndClose
      }]
    },

    // numberText command options
    startNum: {
      value: 1,
      type: 'number'
    },
    numSep: {
      value: ".\\$",
      history: [],
      canempty: true,
      type: 'spacetext'
    },
    // Tab To Space, Space To Tab command options
    tabSize: {
      value: 2,
      type: 'number'
    },
    // extractortoix command options
    findre: {
      value: '',
      samelabelas: 'find',
      history: [],
      buttons: [{
        label: 'Regnize'
      }]
    },
    findlabel: 'Find',

    // replacetoix command options
    find: {
      value: '',
      history: [],
      buttons: [{
        label: 'Regnize'
      }]
    },
    replace: {
      value: '',
      history: [],
      canempty: true
    },
    startValue: {
      value: '',
      historty: [],
      canempty: true
    },

    stepValue: {
      value: '',
      historty: []
    },
    iswordsonly: {
      value: false,
      type: 'boolean',
      canempty: true,
      groupcols: 3
    },
    isregexpr: {
      value: true,
      type: 'boolean',
      canempty: true
    },
    isignorecase: {
      value: false,
      type: 'boolean',
      canempty: true,
      groupcols: 1
    },
    isimultiline: {
      value: false,
      type: 'boolean',
      canempty: true
    },
    isall: {
      value: true,
      type: 'boolean',
      canempty: true
    },
    isselonly: {
      value: true,
      type: 'boolean',
      canempty: true
    },

    // webSearch command options
    webSearch: {
      value: 'https://www.google.com/search?q=',
      checkfunc: function(text) {
        return _checkForHttp(text) ? '' : 'It must start with http(s)://';
      }
    },
    // Run grunt command options
    /* //TODO: Implement grunt
    grunt: {
        value: 'grunt',
        label: 'Grunt',
        hint: 'You must install grunt',
    },*/
    // js6 command options
    js6: {
      value: 'traceur --out "{{out}}" --script "{{in}}"',
      fields: {
        autosave: {
          value: false,
          type: 'boolean',
          align: 'center',
          canempty: true
        }
      }
    },

    // scss command options
    scss: {
      value: 'sass --sourcemap "{{in}}" "{{out}}"',
      fields: {
        autosave: {
          value: false,
          type: 'boolean',
          align: 'center',
          canempty: true
        }
      },
      buttons: [{
        id: 'compass',
        setvalue: 'compass compile "{{inrelfile}}"'
      }, {
        id: 'sass',
        setvalue: 'sass --sourcemap "{{in}}" "{{out}}"'
      }]
    },

    // js command options
    js: {
      value: 'uglifyjs "{{in}}" -o "{{out}}"',
    },
    // Lorem Ipsum
    linrparagraphs: {
      value: '1'
    },
    limaxcharsperline: {
      value: '0'
    },

    lihtmlparawrap: {
      value: '',
      canempty: true
    },

    maxcharsperline: {
      value: '80'

    },
    tobreakwords: {
      value: false,
      type: 'boolean',
      canempty: true
    },
    
    beforesave: {
      value: []
    }    
  };
});