/**
 * @preserve Copyright (c) 2014 Alexandre Bento Freire. All rights reserved.
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


/*jslint vars: true, plusplus: true, continue: true, devel: true, white: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, brackets, CodeMirror, $, document, window */

define(function (require, exports, module) {
    "use strict";
/** ------------------------------------------------------------------------
 *                               i18n
 ** ------------------------------------------------------------------------ */
    var /** @const */ IXMENU = "IX",
        /** @const */ MODULENAME = 'bracketstoix',
        /** @const */ HELPLINK = 'https://github.com/a-bentofreire/bracketstoix',

        /** @const */ SP_FORCEALL = -1,
        /** @const */ SP_ALL = 1,
        /** @const */ SP_WORD = 2,
        /** @const */ SP_SENTENCE = 3,
        /** @const */ SP_LINE = 4;

    var CommandManager = brackets.getModule("command/CommandManager"),
        EditorManager = brackets.getModule("editor/EditorManager"),
        ProjectManager = brackets.getModule('project/ProjectManager'),
        DocumentManager = brackets.getModule('document/DocumentManager'),
        NodeDomain = brackets.getModule("utils/NodeDomain"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        Dialogs = brackets.getModule("widgets/Dialogs"),
        PreferencesManager = brackets.getModule("preferences/PreferencesManager"),
        PanelManager = brackets.getModule('view/PanelManager'),
        LanguageManager = brackets.getModule("language/LanguageManager"),
        extprefs = PreferencesManager.getExtensionPrefs(MODULENAME),
        ui = require('uitoix'),

        ixDomains = new NodeDomain("IXDomains", ExtensionUtils.getModulePath(module, "node/IXDomains")),
        // WARNING: these field names are used in prefsinfo
        prefs = require('prefstoix');
/** ------------------------------------------------------------------------
 *                               Tools
 ** ------------------------------------------------------------------------ */
    function i18n(text) {
        //@TODO: Implement translations
        return text;
    }

    function logErr(msg) {
        console.error('[' + MODULENAME + ']' + msg);
    }

    function checkExt(file, ext) {
        return file.substr(file.length - ext.length) === ext;
    }

    function getspacetext(text) {
        return text.replace(/\\\$/g, ' ');
    }

    function strrepeat(ch, size) {
        var i = 0,
            res = new Array(size);
        for(; i < size; i++) { // Tip: forEach doesn't work with array of undefined
            res[i] = ch;
        }
        return res.join('');
    }

    function cmdToName(cmd) {
        return cmd.toLowerCase().replace(/\./g, '').replace(/ /g, '');
    }

    function cmdToLabel(cmd) {
        return cmd.replace(/\./g, '');
    }

    var
        REGNIZEFIND = /([\\.()[\]^$])/g,
        REGNIZEREPL = '\\$1';

    function getregnize(text, isfind) {
        return text.replace(isfind ? REGNIZEFIND : /(\$\d)/g, REGNIZEREPL);
    }
/** ------------------------------------------------------------------------
 *                               ExtPrefs
 ** ------------------------------------------------------------------------ */
    function loadextprefs() {
        prefs.load(prefs, extprefs);
    }

    function saveextprefs() {
        prefs.save(prefs, extprefs);
    }
/** ------------------------------------------------------------------------
 *                               Node Commads
 ** ------------------------------------------------------------------------ */
    function nodeOpenUrl(url) {
        ixDomains.exec("openUrl", url).fail(function (err) {
            logErr("failed to openUrl", err);
        });
    }

    function nodeExec(cmdline) {
        ixDomains.exec("exec", cmdline).fail(function (err) {
            logErr("failed to exec", err);
        });
    }

    function nodeClipbrdCopy(text) {
        ixDomains.exec("clipbrdCopy", text).fail(function (err) {
            logErr("failed to copy to clipboard", text);
        });
    }
/** ------------------------------------------------------------------------
 *                               UI
 ** ------------------------------------------------------------------------ */
    function ask(title, fieldlist, callback, opts, fields) {
        return ui.ask(title, fieldlist, callback, opts, fields || prefs, i18n, Dialogs,
            opts && opts.nosaveprefs ? undefined : saveextprefs);
    }
/** ------------------------------------------------------------------------
 *                               Controlers
 ** ------------------------------------------------------------------------ */
    function getSelObj(selpolicy) {
        var so = { cm: EditorManager.getActiveEditor()._codeMirror, selpolicy: selpolicy },
            len;
        so.cursor = so.cm.getCursor();
        so.selected = (selpolicy != SP_FORCEALL) && so.cm.somethingSelected();
        if (so.selected) {
            so.cursel = so.cm.getSelection();
        } else {
            so.cursel = '';

            switch(selpolicy) {
            case SP_LINE :
                so.cursel = so.cm.getLine(so.cursor.line);
                so.start = {ch: 0, line: so.cursor.line};
                so.end = {ch: so.cursel.length, line: so.cursor.line};
                break;
            case SP_SENTENCE :        
            case SP_WORD :
                so.cursel = so.cm.getLine(so.cursor.line);
                len = so.cursel.length;
                if (selpolicy === SP_WORD) {
                    so.cursel = so.cursel.replace(/(\W)/g, ' ');
                }
                so.start = {ch: so.cursor.ch, line: so.cursor.line};
                so.end = {ch: so.cursor.ch, line: so.cursor.line};
                while ((so.start.ch > 0) && (so.cursel[so.start.ch - 1] !== ' ')) {
                    so.start.ch--;
                }
                while ((so.end.ch < len - 1) && (so.cursel[so.end.ch + 1] !== ' ')) {
                    so.end.ch++;
                }
                so.cursel = so.cursel.substring(so.start.ch, so.end.ch);
                break;
            case SP_FORCEALL:
            case SP_ALL : 
                so.start = {ch:0, line: 0};
                so.end = {ch:0, line: so.cm.lineCount()};
                so.cursel = so.cm.getRange(so.start, so.end);    
            }
        }
        so.cm.focus();
        return so;
    }

    function changeSelection(callback, selpolicy, asarray, forceall) {
        var so = getSelObj(selpolicy),
            newsel;

        if(!so.cursel) {
            return;
        }
        if (!asarray) {
            newsel = callback(so.cursel);
        } else {
            newsel = callback(so.cursel.split("\n")).join("\n");
        }
        if (so.cursel !== newsel) {
            if (so.selected) {
                so.cm.replaceSelection(newsel, so);
            } else {
                so.cm.replaceRange(newsel, so.start, so.end);
            }            
        }
    }

    function getSelection(callback, selpolicy) {
        var so = getSelObj(selpolicy);
        if(!so.cursel) {
            return;
        }
        callback(so.cursel, so);
    }

    function replaceSelection(regex, repl, selpolicy) {
        changeSelection(function (text, so) {
            return text.replace(regex, repl);
        }, selpolicy, false);
    }

    function sortSelection(sortfunc, selpolicy) {
        changeSelection(function (arr) {
            arr.sort(sortfunc);
            return arr;
        }, selpolicy, true);
    }

    function getCurFileName() {
        var curfile = ProjectManager.getSelectedItem();
        return curfile._path || curfile.path;
    }

    function copyToClipboard(callback) {
        nodeClipbrdCopy(callback(ProjectManager.getSelectedItem()));
    }
/** ------------------------------------------------------------------------
 *                               Commands: Transforms
 ** ------------------------------------------------------------------------ */
    function upperCaseText() {
        changeSelection(function (text) {
            return text.toUpperCase();
        }, SP_WORD);
    }

    function lowerCaseText() {
        changeSelection(function (text) {
            return text.toLowerCase();
        }, SP_WORD);
    }

    function capitalizeText() {
        replaceSelection(/\b(_*\w)/g, function replacer(match, p1, offset, string) {
            return p1.toUpperCase();
        }, SP_WORD);
    }

    function camelCaseText() {
        replaceSelection(/\b(_*\w)/g, function replacer(match, p1, offset, string) {
            return p1.toLowerCase();
        }, SP_WORD);
    }

    function joinText() {
        replaceSelection(/\n/g, '', SP_ALL);
    }

    function splitText() {
        ask('Split Text', ['splitMarker'], function () {
            replaceSelection(new RegExp(prefs.splitMarker.value, 'g'), '\n');
        }, SP_ALL);
    }

    function numberText() {
        ask('Number Text', ['startNum', 'numSep'], function () {
           var num = prefs.startNum.value,
                numSep = getspacetext(prefs.numSep.value);
           replaceSelection(/^(.*)$/gm, function replacer(match, p1, offset, string) {
                return (num++) + numSep + p1;
            }, SP_ALL);
        });
    }

    function trimLeading() {
        replaceSelection(/^[ \t]+/gm, '', SP_ALL);
    }

    function trimTrailingex(selpolicy) {
        replaceSelection(/[ \t]+$/gm, '', selpolicy);
    }

    function trimTrailing(selpolicy) {
        trimTrailingex(SP_ALL);
    }

    function sortAscending() {
        sortSelection(function (a, b) {
            return a > b ? 1 : (a < b ? -1 : 0);
        }, SP_ALL);
    }

    function sortDescending() {
        sortSelection(function (a, b) {
            return a < b ? 1 : (a > b ? -1 : 0);
        }, SP_ALL);
    }

    function htmlEncode() {
        changeSelection(function (text) {
            var d = document.createElement('div');
            d.textContent = text;
            return d.innerHTML;
        }, SP_LINE);
    }

    function htmlDecode() {
        changeSelection(function (text) {
            var d = document.createElement('div');
            d.innerHTML = text;
            return d.textContent;
        }, SP_LINE);
    }

    function urlEncode() {
        changeSelection(function (text) {
            return window.encodeURIComponent(text);
        }, SP_LINE);
    }

    function removeDuplicates() {
        changeSelection(function (arr) {
            var i = arr.length - 1;
            for(;i >= 0; i--) {
                if(arr[i + 1] === arr[i]) {
                    arr.splice(i + 1, 1);
                }
            }
            return arr;
        }, SP_ALL, true);
    }

    function removeEmptyLines() {
        changeSelection(function (arr) {
            var i = arr.length - 1;
            for(;i >= 0; i--) {
                if(!arr[i].trim()) {
                    arr.splice(i, 1);
                }
            }
            return arr;
        }, SP_ALL, true);
    }


    function tabToSpace() {
        replaceSelection(/\t/gm, strrepeat(' ', prefs.tabSize.value), SP_ALL);
    }

    function spaceToTab() {
        replaceSelection(/^(\s+)/gm, function(spaces) {
            var len = spaces.length,
                tabs = Math.floor(len / prefs.tabSize.value);
            if (!tabs) {
                return spaces;
            } else {
                return strrepeat("\t", tabs) + strrepeat(' ', len - tabs * prefs.tabSize.value);
            }
        }, SP_ALL);
    }

    function regnize() {
        getSelection(function (text) {
            nodeClipbrdCopy(getregnize(text, true));
        }, SP_SENTENCE);
    }
/** ------------------------------------------------------------------------
 *                               Commands: Slash
 ** ------------------------------------------------------------------------ */
    function unixToWin() {
        replaceSelection(/\//g, '\\', SP_LINE);
    }

    function winToUnix() {
        replaceSelection(/\\/g, '/', SP_LINE);
    }

    function singleToDouble() {
        replaceSelection(/\\/g, '\\\\', SP_LINE);
    }

    function doubleToSingle() {
        replaceSelection(/\\\\/g, '\\', SP_LINE);
    }
/** ------------------------------------------------------------------------
 *                               Commands: External
 ** ------------------------------------------------------------------------ */
    function openUrl() {
        getSelection(function (text) {
            if (!prefs.checkForHttp(text)) {
                text = 'http://' + text;
            }
            nodeOpenUrl(text);
        }, SP_SENTENCE);
    }

    function webSearch() {
        getSelection(function (text) {
            nodeOpenUrl(prefs.webSearch.value + encodeURIComponent(text));
        }, SP_SENTENCE);
    }
/** ------------------------------------------------------------------------
 *                               Commands: Clipboard
 ** ------------------------------------------------------------------------ */
   function extractortoix() {
        ask('ExtractortoIX', ['findre', 'isignorecase'], function () {
            getSelection(function (text) {
                var foundtext = text.match(new RegExp(prefs.findre.value, 'g' + (prefs.isignorecase.value ? 'i' : '')));
                nodeClipbrdCopy(foundtext.join('\n'));
            }, SP_ALL);
        }, {msg: 'Write a regular expression<br>All matches will be copy to the clipboard<br>'});
    }

    function replacetoix() {
        ask('ReplacetoIX', ['find', 'replace', 'iswordsonly', 'isregexpr', 'isignorecase', 'isall'], function () {
            var findtext = prefs.isregexpr.value ? prefs.find.value : getregnize(prefs.find.value, true),
                repltext = prefs.isregexpr.value ? prefs.replace.value : getregnize(prefs.replace.value, false);
            if (prefs.iswordsonly.value && !prefs.isregexpr.value) {
                findtext = '\\b' + findtext + '\\b';
            }
            replaceSelection(new RegExp(findtext, (prefs.isall.value ? 'g' : '') + (prefs.isignorecase.value ? 'i' : '')),
                repltext, SP_ALL);
        });
    }
/** ------------------------------------------------------------------------
 *                               Commands: Clipboard
 ** ------------------------------------------------------------------------ */
    function fileToClipboard() {
        copyToClipboard(function (curfile) {
            return curfile._name || curfile.name;
        });
    }

    function fullnameToClipboard() {
        copyToClipboard(function (curfile) {
            var fullname = curfile._path || curfile.path;
            return brackets.platform === 'win' ? fullname.replace(/\//g, "\\") : fullname;
        });
    }
/** ------------------------------------------------------------------------
 *                               Js6
 ** ------------------------------------------------------------------------ */
    /*function showResultsPanel(err, stdout, stderr, iscompiler) { // Compiler callback isn't working
        var text = '';
        if (iscompiler) {
            text = stderr;
        } else {
            text = stderr + '\n' + stdout;
        }
        text = text.trim();
        if (text) {
            text = text.split('\n');
            text.forEach(function(line, index) {
                text[index] = '<p>' + htmlEncode(line) + '</p>';
            });
            text = text.join();
            PanelManager.createBottomPanel(MODULENAME, text);
        }
    }*/
    function runCompilerEx(autosave) {
        var exts = [
            {inext: '.js6', outext: '.js'},
            {inext: '.scss', outext: '.css'}
            ],

            infile = getCurFileName(),
            outfile, i, ext, cmdline, pref;
            for (i = 0; i < exts.length; i++) {
                ext = exts[i];
                if (checkExt(infile, ext.inext)) {
                    pref = prefs[ext.inext.substr(1)];
                    if (pref.fields.autosave.value || !autosave) {
                        outfile = infile.substr(0, infile.length - ext.inext.length) + ext.outext;
                        cmdline = pref.value;
                        nodeExec(cmdline.replace('{{out}}', outfile).replace('{{in}}', infile)/*, showResultsPanel, true*/);
                        break;
                    }
                }
            }
    }

    function runCompiler() {
        runCompilerEx(false);
    }

    /*function runGrunt() {
        nodeExec(prefs.grunt.value);
    }*/
/** ------------------------------------------------------------------------
 *                               showOptions
 ** ------------------------------------------------------------------------ */
    function showHelp() {
        nodeOpenUrl(HELPLINK);
    }

    function showOptions() {
        ask('Options', prefs.OPTIONFIELDS, undefined, {header: ['Field', 'Value', 'Exec On Save']});
    }

    function showCommands() {
        var cmds = getCommandList(),
            fields = {cmd: {value: '', type: 'dropdown', values: [] }};

        cmds.forEach(function(cmd) {
            if (cmd.name) {
                fields.cmd.values.push(cmdToLabel(cmd.name));
            }
        });
        fields.cmd.values.sort();

        ask('Commands', ['cmd'], function () {
            var selcmd = fields.cmd.value;
            cmds.every(function(cmd) {
                if (cmd.name && (selcmd === cmdToLabel(cmd.name))) {
                    cmd.f();
                    return false;
                }
                return true;
            });
        }, {nosaveprefs : true}, fields);
    }


    function showCommandMapper() {
        var cmds = getCommandList(),
            fields = {},
            fieldlist = [],
            showinmenu = prefs.commands.value.showinmenu,
            hotkeys = prefs.commands.value.hotkeys;

        cmds.forEach(function(cmd) {
            var key;
            if (cmd.name) {
                key = cmdToName(cmd.name);
                fields[key] = {value: hotkeys[key] || '', label: cmdToLabel(cmd.name), size: 15, canempty: true,
                               hint: 'Ex: Ctrl-Shift-U (win).  Cmd-Shift-U (mac)',
                    fields: {showinmenu: {value: showinmenu.indexOf(key) > -1, type: 'boolean', align: 'center', canempty: true}}};
                fieldlist.push(key);
            }
        });

        ask('Commands', fieldlist, function () {
            showinmenu = [];
            hotkeys = {};
            cmds.forEach(function(cmd) {
                var key, field;
                if (cmd.name) {
                    key = cmdToName(cmd.name);
                    field = fields[key];
                    if (field.value) {
                        hotkeys[key] = field.value.replace(/(Cmd|Shift|Alt|Ctrl)\+/g, '$1-');
                    }
                    if (field.fields.showinmenu.value) {
                      showinmenu.push(key);
                    }
                }
            });
            prefs.commands.value.showinmenu = showinmenu;
            prefs.commands.value.hotkeys = hotkeys;
            saveextprefs();

        }, {nosaveprefs : true, msg : 'Only takes effect after restart!', header: ['Command', 'Hotkey', 'Show on Menu']},
            fields);
    }
/** ------------------------------------------------------------------------
 *                               runLanguageMapper
 ** ------------------------------------------------------------------------ */
    function runLanguageMapper() {
        var lang = LanguageManager.getLanguage("javascript");
        lang.addFileExtension("js6");
    }
/** ------------------------------------------------------------------------
 *                               buildCommands
 ** ------------------------------------------------------------------------ */
    var SHOWONMENU = 1;

    function getCommandList() {
        return [
            {name: "UpperCase", f: upperCaseText, priority: SHOWONMENU},
            {name: "LowerCase", f: lowerCaseText, priority: SHOWONMENU},
            {name: "Capitalize", f: capitalizeText},
            {name: "CamelCase", f: camelCaseText},
            {name: "HtmlEncode", f: htmlEncode},
            {name: "HtmlDecode", f: htmlDecode},
            {name: "UrlEncode", f: urlEncode},
            {name: "Join", f: joinText},
            {name: "Split...", f: splitText},
            {name: "Number...", f: numberText},
            {name: "Trim Leading", f: trimLeading},
            {name: "Trim Trailing", f: trimTrailing},
            {name: "Sort Ascending", f: sortAscending},
            {name: "Sort Descending", f: sortDescending},
            {name: "Remove Duplicates", f: removeDuplicates},
            {name: "Remove Empty Lines", f: removeEmptyLines},
            {},
            {name: "Unix To Win", f: unixToWin},
            {name: "Win To Unix", f: winToUnix},
            {name: "Single Slash To Double", f: singleToDouble},
            {name: "Double To Single Slash", f: doubleToSingle},
            {name: "Tab To Space", f: tabToSpace},
            {name: "Space To Tab", f: spaceToTab},
            {},
            {name: "ExtractorToIX...", f: extractortoix, priority: SHOWONMENU},
            {name: "ReplaceToIX...", f: replacetoix, priority: SHOWONMENU},
            {},
            {name: "Open Url", f: openUrl},
            {name: "Web Search", f: webSearch},
            {},
            {name: "Copy Filename", f: fileToClipboard},
            {name: "Copy Fullname", f: fullnameToClipboard},
            {name: "Regnize", f: regnize},
            {},
            //{name: "Regex Tester", f: regexTester},
               {name: "Compiler", f: runCompiler, label: "Compile(js6, scss)", priority: SHOWONMENU}, //TODO: Implement "/Run(py, js)"
            /*{name: "Run grunt", f: runGrunt}, */
            {},
            {name: "Commands...", f: showCommands, priority: SHOWONMENU},
            {name: "Commands Mapper...", f: showCommandMapper, showalways: true, priority: SHOWONMENU},
            {name: "Options...", f: showOptions, priority: SHOWONMENU},
            {name: "Help", f: showHelp, priority: SHOWONMENU}
        ];
    }

    function buildCommands() {
        var cmdlist = getCommandList(),
            Menus = brackets.getModule("command/Menus"),
            //menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU),
            // Since Brackets has no submenu support it's better to create a top menu
            menu = Menus.addMenu(IXMENU, IXMENU),
            i, j, cmd, id, opts, platform, hotkey, nm,
            showinmenu = prefs.commands.value.showinmenu,
            hotkeys = prefs.commands.value.hotkeys,
            hasdiv = false;

        for (i = 0; i < cmdlist.length; i++) {
            cmd = cmdlist[i];
            if (!cmd.name) {
                if (!hasdiv) {
                    menu.addMenuDivider();
                }
                hasdiv = true;
                continue;
            }
            nm = cmdToName(cmd.name);
            if (cmd.showalways || (showinmenu.indexOf(nm) > -1)) {
                hasdiv = false;
                id = MODULENAME + "." + cmdToName(cmd.name);
                // Register Command
                CommandManager.register(cmd.label || cmd.name, id, cmd.f);
                // Register Menu Items
                opts = [];
                hotkey = hotkeys[nm];
                if (hotkey) {
                    opts.push({key: hotkey, platform: brackets.platform});
                }
                menu.addMenuItem(id, opts);
            }
        }
    }

    function fillshowonmenu() {
        getCommandList().forEach(function (cmd) {
            if (cmd.priority === SHOWONMENU) {
                prefs.commands.value.showinmenu.push(cmdToName(cmd.name));
            }
        });
    }
 
    function initprefbuttons() {
        prefs.find.buttons[0].f = function(text) { return getregnize(text, true); };
        prefs.findre.buttons[0].f = prefs.find.buttons[0].f;
    }
    
    fillshowonmenu(); // must be before loadextprefs
    initprefbuttons();
    loadextprefs();
    buildCommands();
    runLanguageMapper();
    initprefbuttons();
/** ------------------------------------------------------------------------
 *                               Save Commands
 ** ------------------------------------------------------------------------ */
    function runSaveCommands() {
        //trimTrailing(true);  //@TODO: Implement trim on save
        runCompilerEx(true);
    }

    $(DocumentManager).on("documentSaved", runSaveCommands);
});