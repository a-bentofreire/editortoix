'use strict';
// --------------------------------------------------------------------
// Copyright (c) 2016-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License
// --------------------------------------------------------------------

/*
    Preferences tools
*/

define(() => {

  // ------------------------------------------------------------------------
  //                               UI
  // ------------------------------------------------------------------------

  function selectAndClose(inf) {
    inf.closedlg(true);
  }

  // ------------------------------------------------------------------------
  //                               Closure
  // ------------------------------------------------------------------------
  const PREFKEY = 'prefs';

  function _checkForHttp(text) {
    return (text.indexOf('http://') === 0) || (text.indexOf('https://') === 0);
  }

  // Copies from prefs to prefsio, and vice-versa. Used for load & save
  function _buildIo(prefs, prefsio,
    isPrefToIo: boolean): void {

    Object.keys(prefs).forEach((key) => {
      const pref = prefs[key];
      const storeProp = pref.storeprop || 'value';
      let prefIo;

      if (pref[storeProp] !== undefined) {
        prefIo = prefsio[key];
        if (prefIo === undefined) {
          prefsio[key] = {};
          prefIo = prefsio[key];
        }

        if (isPrefToIo) {
          prefIo[storeProp] = pref[storeProp];
          if (pref.history) {
            prefIo.history = pref.history;
          }
        } else {
          if (prefIo !== undefined && prefIo[storeProp] !== undefined) {
            pref[storeProp] = prefIo[storeProp];
            if (pref.history && prefIo.history) {
              pref.history = prefIo.history;
            }
          }
        }
        if (pref.fields) {
          if (!prefIo.fields) {
            prefIo.fields = {};
          }
          _buildIo(pref.fields, prefIo.fields, isPrefToIo);
        }
      }
    });
    return prefsio;
  }

  return {
    // ------------------------------------------------------------------------
    //                               Functions
    // ------------------------------------------------------------------------

    checkForHttp: (text) => _checkForHttp(text),

    load: (prefs, extprefs) => {
      extprefs.definePreference(PREFKEY, 'object', _buildIo(prefs, {}, true));
      _buildIo(prefs, extprefs.get(PREFKEY), false);
    },

    save: (prefs, extprefs) => {
      extprefs.set(PREFKEY, _buildIo(prefs, {}, true));
      extprefs.save();
    },

    // ------------------------------------------------------------------------
    //                               Fields
    // ------------------------------------------------------------------------

    OPTIONFIELDS: ['tabSize', 'historySize', 'recentSize', 'showcxtedit',
      'webSearch', /*'grunt',*/ 'js6', 'scss', 'js'],

    version: {
      value: '',
    },

    // commands options (showinmenu, showinctxmenu, hotkey)
    commands: {
      value: {
        showinmenu: [],
        showinctxmenu: [],
        hotkeys: {},
      },
    },

    // splitText command options
    splitMarker: {
      value: ',',
    },

    splitMarkerExtr: {
      value: '\\t',
      samelabelas: 'splitMarker',
      samehintas: 'splitMarker',
    },
    // Used in dialogs
    historySize: {
      value: 20,
      type: 'number',
    },
    recentSize: {
      value: 20,
      type: 'number',
    },
    showcxtedit: {
      value: true,
      type: 'boolean',
      canempty: true,
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
        f: selectAndClose,
      }],
    },

    // numberText command options
    startNum: {
      value: 1,
      type: 'number',
    },
    numSep: {
      value: ".\\$",
      history: [],
      canempty: true,
      type: 'spacetext',
    },
    // Tab To Space, Space To Tab command options
    tabSize: {
      value: 2,
      type: 'number',
    },
    // extractortoix command options
    findre: {
      value: '',
      samelabelas: 'find',
      history: [],
      buttons: [{
        label: 'Regnize',
      }],
    },
    findlabel: 'Find',

    // replacetoix command options
    find: {
      value: '',
      history: [],
      buttons: [{
        label: 'Regnize',
      }],
    },
    replace: {
      value: '',
      history: [],
      canempty: true,
    },
    startValue: {
      value: '',
      history: [],
      canempty: true,
    },

    stepValue: {
      value: '',
      history: [],
      canempty: true,
    },
    iswordsonly: {
      value: false,
      type: 'boolean',
      canempty: true,
      groupcols: 3,
    },
    isregexpr: {
      value: true,
      type: 'boolean',
      canempty: true,
    },
    isignorecase: {
      value: false,
      type: 'boolean',
      canempty: true,
      groupcols: 1,
    },
    isimultiline: {
      value: false,
      type: 'boolean',
      canempty: true,
    },
    isall: {
      value: true,
      type: 'boolean',
      canempty: true,
    },
    isselonly: {
      value: true,
      type: 'boolean',
      canempty: true,
    },

    // webSearch command options
    webSearch: {
      value: 'https://www.google.com/search?q=',
      checkfunc(text: string): string {
        return _checkForHttp(text) ? '' : 'It must start with http(s)://';
      },
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
          canempty: true,
        },
      },
    },

    // scss command options
    scss: {
      value: 'sass --sourcemap "{{in}}" "{{out}}"',
      fields: {
        autosave: {
          value: false,
          type: 'boolean',
          align: 'center',
          canempty: true,
        },
      },
      buttons: [{
        id: 'compass',
        setvalue: 'compass compile "{{inrelfile}}"',
      }, {
        id: 'sass',
        setvalue: 'sass --sourcemap "{{in}}" "{{out}}"',
      }],
    },

    // js command options
    js: {
      value: 'uglifyjs "{{in}}" -o "{{out}}"',
    },
    // Lorem Ipsum
    linrparagraphs: {
      value: '1',
    },
    limaxcharsperline: {
      value: '0',
    },

    lihtmlparawrap: {
      value: '',
      canempty: true,
    },

    maxcharsperline: {
      value: '80',

    },
    tobreakwords: {
      value: false,
      type: 'boolean',
      canempty: true,
    },

    beforesave: {
      value: [],
    },

    aftersave: {
      value: [],
    },

    tools: {
      value: [],
    },
  };
});
