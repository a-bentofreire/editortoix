/*
 * Copyright (c) 2014 Alexandre Bento Freire. All rights reserved.
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
    var IXMENU = "IX",
        MODULENAME = 'bracketstoix',
        HELPLINK = 'https://github.com/a-bentofreire/bracketstoix',

        CommandManager = brackets.getModule("command/CommandManager"),
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

    function strrepeat(char, size) {
        var i = 0,
            res = new Array(size);
        for(; i < size; i++) { // Tip: forEach doesn't work with array of undefined
            res[i] = char;
        }
        return res.join('');
    }

    function cmdToName(cmd) {
        return cmd.toLowerCase().replace(/\./g, '').replace(/ /g, '');
    }

    function cmdToLabel(cmd) {
        return cmd.replace(/\./g, '');
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
    function changeSelection(callback, asarray, forceall) {
        var cm = EditorManager.getActiveEditor()._codeMirror,
        cursel = cm.getSelection(),
        newsel;

        if (!asarray) {
            newsel = callback(cursel);
        } else {
            newsel = callback(cursel.split("\n")).join("\n");
        }
        if (cursel !== newsel) {
            cm.replaceSelection(newsel);
        }
    }

    function getSelection(callback) {
        var cm = EditorManager.getActiveEditor()._codeMirror,
        cursel = cm.getSelection();
        callback(cursel);
    }

    function replaceSelection(regex, repl, forceall) {
        changeSelection(function (text) {
            return text.replace(regex, repl);
        }, false, forceall);
    }

    function sortSelection(sortfunc) {
        changeSelection(function (arr) {
            arr.sort(sortfunc);
            return arr;
        }, true);
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
        });
    }

    function lowerCaseText() {
        changeSelection(function (text) {
            return text.toLowerCase();
        });
    }

    function capitalizeText() {
        replaceSelection(/\b(_*\w)/g, function replacer(match, p1, offset, string) {
            return p1.toUpperCase();
        });
    }

    function camelCaseText() {
        replaceSelection(/\b(_*\w)/g, function replacer(match, p1, offset, string) {
            return p1.toLowerCase();
        });
    }

    function joinText() {
        replaceSelection(/\n/g, '');
    }

    function splitText() {
        ask('Split Text', ['splitMarker'], function () {
            replaceSelection(new RegExp(prefs.splitMarker.value, 'g'), '\n');
        });
    }

    function numberText() {
        ask('Number Text', ['startNum', 'numSep'], function () {
           var num = prefs.startNum.value,
                numSep = getspacetext(prefs.numSep.value);
           replaceSelection(/^(.*)$/gm, function replacer(match, p1, offset, string) {
                return (num++) + numSep + p1;
            });
        });
    }

    function trimLeading() {
        replaceSelection(/^[ \t]+/gm, '');
    }

    function trimTrailing(forceall) {
        replaceSelection(/[ \t]+$/gm, '', forceall);
    }

    function sortAscending() {
        sortSelection(function (a, b) {
            return a > b ? 1 : (a < b ? -1 : 0);
        });
    }

    function sortDescending() {
        sortSelection(function (a, b) {
            return a < b ? 1 : (a > b ? -1 : 0);
        });
    }

    function htmlEncode() {
        changeSelection(function (text) {
            var d = document.createElement('div');
            d.textContent = text;
            return d.innerHTML;
        });
    }

    function htmlDecode() {
        changeSelection(function (text) {
            var d = document.createElement('div');
            d.innerHTML = text;
            return d.textContent;
        });
    }

    function urlEncode() {
        changeSelection(function (text) {
            return window.encodeURIComponent(text);
        });
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
        }, true);
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
        }, true);
    }
    

    function tabToSpace() {
        replaceSelection(/\t/gm, strrepeat(' ', prefs.tabSize.value));
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
        });
    }
/** ------------------------------------------------------------------------
 *                               Commands: Slash
 ** ------------------------------------------------------------------------ */
    function unixToWin() {
        replaceSelection(/\//g, '\\');
    }

    function winToUnix() {
        replaceSelection(/\\/g, '/');
    }

    function singleToDouble() {
        replaceSelection(/\\/g, '\\\\');
    }

    function doubleToSingle() {
        replaceSelection(/\\\\/g, '\\');
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
        });
    }

    function webSearch() {
        getSelection(function (text) {
            nodeOpenUrl(prefs.webSearch.value + encodeURIComponent(text));
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

        ask('Commands', ['cmd'], function () {
            var selcmd = fields.cmd.value;
            $.each(cmds, function(index, cmd) {
                if (selcmd === cmdToLabel(cmd.name)) {
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

        }, {nosaveprefs : true, msg : 'Only takes effect after restart!', header: ['Command', 'Hotkey', 'Show in Menu']},
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
    function getCommandList() {
        return [
            {name: "UpperCase", f: upperCaseText},
            {name: "LowerCase", f: lowerCaseText},
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
            {name: "Open Url", f: openUrl},
            {name: "Web Search", f: webSearch},
            {},
            {name: "Copy Filename", f: fileToClipboard},
            {name: "Copy Fullname", f: fullnameToClipboard},
            {},
            {name: "Compiler", f: runCompiler, label: "Compile(js6, scss)"}, //TODO: Implement "/Run(py, js)"
            /*{name: "Run grunt", f: runGrunt}, */
            {},
            {name: "Commands...", f: showCommands},
            {name: "Commands Mapper...", f: showCommandMapper, showalways: true},
            {name: "Options...", f: showOptions},
            {name: "Help", f: showHelp}
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
    loadextprefs();
    buildCommands();
    runLanguageMapper();
/** ------------------------------------------------------------------------
 *                               Save Commands
 ** ------------------------------------------------------------------------ */
    function runSaveCommands() {
        //trimTrailing(true);  //@TODO: Implement trim on save
        runCompilerEx(true);
    }

    $(DocumentManager).on("documentSaved", runSaveCommands);
});