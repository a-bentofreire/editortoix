'use strict';
require.config({
    paths: {
        text: "lib/text",
        i18n: "lib/i18n",
    },
    locale: brackets.getLocale(),
});
define(function (require, exports, module) {
    // ------------------------------------------------------------------------
    //                               i18n
    // ------------------------------------------------------------------------
    var VERSION = '3.6.1';
    var AUTHOR = 'Alexandre Bento Freire';
    var COPYRIGHTS = 'Alexandre Bento Freire';
    var IX_MENU = "IX";
    var IX_MENU_TT = "IX TT";
    var MODULE_NAME = 'bracketstoix';
    var HELP_LINK = ''; // deactivated for now until there is a new help page
    var EXPAND_TAGS = ';bu=button;d=div;sp=span;te=textarea;in=input';
    var PROJ_SETTINGS_FILE = '.projecttoix.json';
    // FORCE policy must be the negative of the regular policy
    var SP_FORCE_ALL = -1;
    var SP_ALL = 1;
    var SP_WORD = 2;
    var SP_SENTENCE = 3;
    var SP_LINE = 4;
    var SP_NONE = 5;
    var __SP_FUNC = 6;
    var SP_FORCE_LINE = -4;
    var SOCIAL = {
        home: HELP_LINK,
        // facebook: 'https://www.facebook.com/devtoix',
        twitter: 'https://twitter.com/devpieces',
        github: 'http://github.com/a-bentofreire/bracketstoix',
    };
    var brk = {};
    var ix = {};
    brk.Dialogs = brackets.getModule('widgets/Dialogs');
    brk.CommandManager = brackets.getModule('command/CommandManager');
    brk.Commands = brackets.getModule('command/Commands');
    brk.EditorManager = brackets.getModule('editor/EditorManager');
    brk.ProjectManager = brackets.getModule("project/ProjectManager");
    brk.DocumentManager = brackets.getModule("document/DocumentManager");
    brk.PreferencesManager = brackets.getModule('preferences/PreferencesManager');
    // @WARN: Brackets API deprecated view/PanelManager which resulted BracketstoIX failed to work
    // brk.PanelManager = brackets.getModule('view/PanelManager');
    brk.MainViewManager = brackets.getModule('view/MainViewManager');
    brk.LanguageManager = brackets.getModule('language/LanguageManager');
    brk.KeyBindingManager = brackets.getModule('command/KeyBindingManager');
    brk.CoreStrings = brackets.getModule('strings');
    brk.Strings = require("i18n!nls/strings");
    brk.ExtensionUtils = brackets.getModule('utils/ExtensionUtils');
    brk.StringUtils = brackets.getModule('utils/StringUtils');
    brk.KeyEvent = brackets.getModule('utils/KeyEvent');
    brk.NodeDomain = brackets.getModule('utils/NodeDomain');
    brk.FileUtils = brackets.getModule('file/FileUtils');
    brk.FileSystem = brackets.getModule('filesystem/FileSystem');
    //  brk.AppshellFileSystem = brackets.getModule('filesystem/impls/appshell/AppshellFileSystem');
    brk.WorkspaceManager = brackets.getModule('view/WorkspaceManager');
    brk.extprefs = brk.PreferencesManager.getExtensionPrefs(MODULE_NAME);
    brk.moduleroot = brk.FileUtils.getNativeModuleDirectoryPath(module) + '/';
    brk.Editor = brackets.getModule("editor/Editor").Editor;
    brk.Mustache = brackets.getModule("thirdparty/mustache/mustache");
    var ui = require('uitoix');
    var transformutilities = require('common/transformutilities').transformutilities;
    var lineutilities = require('common/lineutilities').lineutilities;
    var um = require('common/utilitymanager').um;
    um.utilityManager = utilityManager_;
    function utilityManager_(params, f) {
        switch (params.utilType) {
            case um.TIXUtilityType.utInTransform:
                changeSelectionRegEx(params.pat, params.repl, params.sp);
                break;
            case um.TIXUtilityType.utTransform:
                changeSelection(function (text) {
                    return f({ intext: text });
                }, params.sp);
                break;
            case um.TIXUtilityType.utLinesUtility:
                changeSelection(function (arr) {
                    return f({ inlines: arr });
                }, params.sp, true);
                break;
            case um.TIXUtilityType.utLineUtility:
                changeSelection(function (arr) {
                    arr.forEach(function (value, index) {
                        arr[index] = f({ intext: value });
                    });
                    return arr;
                }, params.sp, true);
                break;
        }
    }
    var optstoix = require('optionstoix');
    var optshtml = require('text!html/optionstoix.html');
    var prefs = require('prefstoix'); // WARNING: these field names are used in prefsinfo
    var ixDomains = new brk.NodeDomain('IXDomains', brk.ExtensionUtils.getModulePath(module, 'node/IXDomains'));
    // Snippets are only loaded after the 1st usage
    var namedcmdlist = [];
    var cmdlist; // list of commands;
    var storeidmap = {};
    var queueExternalSave = [];
    var externalQueueIsBusy = false;
    var projSettings = {
        data: {},
        applied: false,
    };
    var globalDoc = null; // this var is set to override the current document. If set the runCommand will stop working.
    // ------------------------------------------------------------------------
    //                               Tools
    // ------------------------------------------------------------------------
    var tools = {
        htmlEscape: function (str) {
            return String(str)
                .replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
                .replace(/</g, '&lt;').replace(/>/g, '&gt;');
        },
        processSplit: function (text) {
            return text.replace(/\\t/g, "\t").replace(/\\\t/g, "\\t").replace(/\\n/g, "\n").replace(/\\\n/g, "\\n");
        },
        strRepeat: function (ch, size) { return size > 0 ? new Array(size + 1).join(ch) : ''; },
        textToID: function (text) { return text.toLowerCase().replace(/\./g, '').replace(/ /g, ''); },
        getSpaceText: function (text) { return text.replace(/\\\$/g, ' '); },
    };
    function i18n(text, defText) {
        return brk.Strings[text] || (defText !== undefined ? defText : text);
    }
    function logErr(msg) {
        console.error('[' + MODULE_NAME + '] ' + msg);
    }
    function checkExt(file, ext) {
        return file.substr(file.length - ext.length) === ext;
    }
    var REGNIZE_FIND = /([\\.()\[\]*+\^$])/g;
    var REGNIZE_REPL = '\\$1';
    function getRegnize(text, isFind) {
        return text.replace(isFind ? REGNIZE_FIND : /(\$\d)/g, REGNIZE_REPL);
    }
    // ------------------------------------------------------------------------
    //                               ExtPrefs
    // ------------------------------------------------------------------------
    function loadExtPrefs() {
        prefs.load(prefs, brk.extprefs);
        // Simple workaround to support versions < 1.4. TODO: Support subfield copy on prefs.load
        prefs.commands.value.showinctxmenu = prefs.commands.value.showinctxmenu || [];
    }
    function saveExtPrefs() {
        prefs.save(prefs, brk.extprefs);
    }
    // ------------------------------------------------------------------------
    //                               Clipboard
    // ------------------------------------------------------------------------
    function clipbrdCopy(text) {
        /* Brackets has no support for: var copyEvent = new ClipboardEvent("copy",
        { dataType: "text/plain", data: "Data to be copied" } );
        */
        var d = document.createElement('textarea');
        d.contentEditable = true;
        document.body.appendChild(d);
        d.value = text;
        d.unselectable = 'off';
        d.style.position = 'absolute';
        d.focus();
        document.execCommand('SelectAll');
        document.execCommand('Copy', false, null);
        document.body.removeChild(d);
    }
    function clipbrdPaste() {
        var text;
        var d = document.createElement('textarea');
        d.contentEditable = true;
        document.body.appendChild(d);
        d.unselectable = 'off';
        d.style.position = 'absolute';
        d.focus();
        document.execCommand('Paste', false, null);
        document.execCommand('SelectAll');
        text = d.value;
        document.body.removeChild(d);
        return text;
    }
    function getSelObj(selPolicy) {
        var so;
        var len;
        var inf;
        if (globalDoc) {
            globalDoc._ensureMasterEditor();
            so = {
                cm: globalDoc._masterEditor._codeMirror,
                selfunc: selPolicy,
                selpolicy: SP_FORCE_ALL,
                start: {
                    ch: 0,
                    line: 0,
                },
                selected: false,
            };
            so.end = {
                ch: 0,
                line: so.cm.lineCount(),
            };
            so.cursor = so.cm.getCursor();
            so.cursel = so.cm.getRange(so.start, so.end);
            return so;
        }
        so = {
            cm: brk.EditorManager.getActiveEditor()._codeMirror,
            selfunc: selPolicy,
            selpolicy: typeof selPolicy !== 'function' ? selPolicy : __SP_FUNC,
        };
        so.cursor = so.cm.getCursor();
        so.selected = (so.selpolicy >= 0) && so.cm.somethingSelected();
        if (so.selected) {
            so.cursel = so.cm.getSelection();
        }
        else {
            so.cursel = '';
            switch (so.selpolicy) {
                case SP_FORCE_LINE:
                case SP_LINE:
                    so.cursel = so.cm.getLine(so.cursor.line);
                    so.start = {
                        ch: 0,
                        line: so.cursor.line,
                    };
                    so.end = {
                        ch: so.cursel.length,
                        line: so.cursor.line,
                    };
                    break;
                case SP_SENTENCE:
                case SP_WORD:
                    so.cursel = so.cm.getLine(so.cursor.line);
                    len = so.cursel.length;
                    if (selPolicy === SP_WORD) {
                        so.cursel = so.cursel.replace(/(\W)/g, ' ');
                    }
                    so.start = {
                        ch: so.cursor.ch,
                        line: so.cursor.line,
                    };
                    so.end = {
                        ch: so.cursor.ch,
                        line: so.cursor.line,
                    };
                    while ((so.start.ch > 0) && (so.cursel[so.start.ch - 1] !== ' ')) {
                        so.start.ch--;
                    }
                    while ((so.end.ch < len) && (so.cursel[so.end.ch] !== ' ')) {
                        so.end.ch++;
                    }
                    so.cursel = so.cursel.substring(so.start.ch, so.end.ch);
                    break;
                case SP_FORCE_ALL:
                case SP_ALL:
                    so.start = {
                        ch: 0,
                        line: 0,
                    };
                    so.end = {
                        ch: 0,
                        line: so.cm.lineCount(),
                    };
                    so.cursel = so.cm.getRange(so.start, so.end);
                    break;
                case SP_NONE:
                    so.start = {
                        ch: so.cursor.ch,
                        line: so.cursor.line,
                    };
                    so.end = {
                        ch: so.cursor.ch,
                        line: so.cursor.line,
                    };
                    break;
                case __SP_FUNC:
                    // TODO: Support multiple lines
                    // It executes a selfunc twice(left, right direction) for each caracter.
                    // It stops eating chars if it selfunc returns false
                    so.cursel = so.cm.getLine(so.cursor.line);
                    so.start = {
                        ch: so.cursor.ch,
                        line: so.cursor.line,
                    };
                    so.end = {
                        ch: so.cursor.ch + 1,
                        line: so.cursor.line,
                    };
                    inf = {
                        so: so,
                        dir: -1,
                    };
                    // the selfunc can reverse the direction to implement multiple passes,
                    // but careful since it cause an infinite loop
                    while (so.start.ch > 0) {
                        if (!so.selfunc(inf, so.cursel[so.start.ch])) {
                            so.start.ch -= inf.dir;
                            break;
                        }
                        so.start.ch += inf.dir;
                    }
                    inf.dir = 1;
                    // the selfunc can add text to the so.cursel, so it's better to not place
                    // the end test in a var such as len = so.cursel.length
                    while (so.end.ch < so.cursel.length) {
                        if (!so.selfunc(inf, so.cursel[so.end.ch - 1])) {
                            so.end.ch -= inf.dir;
                            break;
                        }
                        so.end.ch += inf.dir;
                    }
                    so.cursel = so.cursel.substring(so.start.ch, so.end.ch);
                    break;
            }
        }
        // Disactivated due a brackets bug, that doesn't preventsDefault on ENTER key
        so.cm.focus();
        return so;
    }
    function changeSelection(callback, selPolicy, hasArray, forceAll) {
        var so = getSelObj(selPolicy);
        var newSel;
        if (!so.cursel && selPolicy !== SP_NONE) {
            return;
        }
        if (!hasArray) {
            newSel = callback(so.cursel, so);
        }
        else {
            newSel = callback(so.cursel.split("\n"), so).join("\n");
        }
        if (so.cursel !== newSel) {
            if (so.selected) {
                so.cm.replaceSelection(newSel, so);
            }
            else {
                so.cm.replaceRange(newSel, so.start, so.end);
                if (so.cursor) {
                    so.cm.setCursor(so.cursor);
                }
            }
        }
    }
    function setSelection(so, newSel) {
        so.cm.replaceSelection(newSel, so);
    }
    function getSelection(callback, selPolicy) {
        var so = getSelObj(selPolicy);
        if (!so.cursel) {
            return;
        }
        callback(so.cursel, so);
    }
    function changeSelectionRegEx(regex, repl, selPolicy) {
        changeSelection(function (text) { return text.replace(regex, repl); }, selPolicy, false);
    }
    function sortSelection(sortFunc, selPolicy) {
        changeSelection(function (arr) {
            arr.sort(sortFunc);
            return arr;
        }, selPolicy, true);
    }
    function setRow(row, text, so) {
        so.cm.replaceRange(text + '\n', {
            ch: 0,
            line: row,
        }, {
            ch: 0,
            line: row + 1,
        });
    }
    function insertRow(row, text, so) {
        so.cm.replaceRange(text + '\n', {
            ch: 0,
            line: row,
        }, {
            ch: 0,
            line: row,
        });
    }
    /*function insertTextAtCursor(text) {
        so.cm.replaceRange(text + '\n', {ch: 0, line: row}, {ch: 0, line: row});
      }*/
    function getCurFileName() {
        var curFile = brk.ProjectManager.getSelectedItem();
        return curFile ? curFile._path || curFile.path : '';
    }
    function getProjectRoot() {
        var root = brk.ProjectManager.getProjectRoot();
        return root ? root._path : '';
    }
    function copyToClipboard(callback) {
        clipbrdCopy(callback(brk.ProjectManager.getSelectedItem()));
    }
    // ------------------------------------------------------------------------
    //                               BottomPanel
    // ------------------------------------------------------------------------
    function sendToBottomPanel(header, msgArray) {
        function getTableFromEvent(event) {
            var node = event.target;
            while (node.tagName.toUpperCase() !== 'TABLE') {
                node = node.parentElement;
            }
            return $(node);
        }
        var html = '';
        var ppanel;
        if (!ix.panel) {
            ix.panel = { headers: {}, lastid: 1 };
            ix.panel.panel = brk.WorkspaceManager.createBottomPanel('', $(ix.htmltempl.BOTTOMPANEL));
            ppanel = ix.panel.panel;
            ix.panel.$msg = ppanel.$panel.find('#msg');
            ppanel.$panel.find('.close').click(function () {
                ix.panel.panel.hide();
            });
            ppanel.$panel.find('#cleartoix').click(function () {
                ix.panel.$msg.html('');
                ix.panel.headers = {};
            });
        }
        // avoids duplicates, fundamental for compilation errors
        var headerId = ix.panel.headers[header];
        if (headerId) {
            ix.panel.$msg.find('#' + headerId).remove();
        }
        headerId = ix.panel.lastid;
        ix.panel.headers[header] = headerId;
        ix.panel.lastid++;
        html = brk.Mustache.render(ix.htmltempl.BOTTOMPANELITEMHEAD, { id: headerId, header: header });
        msgArray.forEach(function (msg) {
            html += '<tr><td>' + tools.htmlEscape(msg) + '</td></tr>';
        });
        html += '</table>';
        ix.panel.$msg.html(html + ix.panel.$msg.html());
        // add item events
        ix.panel.$msg.find('#cleartoix').click(function (event) {
            var $table = getTableFromEvent(event);
            $table.remove();
        });
        ix.panel.$msg.find('#copytoix').click(function (event) {
            var $table = getTableFromEvent(event);
            var output = [];
            $table.find('td').each(function (index, el) {
                output.push($(el).text());
            });
            clipbrdCopy(output.join(''));
        });
        if (!ix.panel.panel.isVisible()) {
            ix.panel.panel.show();
        }
    }
    // ------------------------------------------------------------------------
    //                               Node Commads
    // ------------------------------------------------------------------------
    function nodeOpenUrl(url) {
        appshell.app.openURLInDefaultBrowser(url);
    }
    function displayNodeResult(_callSuccess, out, name) {
        function send(tag_, start, end) {
            var arr = out.slice(start, end);
            // removes the last empty lines. also works for empty single lines results
            if (arr.length && !arr[arr.length - 1].trim()) {
                arr.splice(arr.length - 1, 1);
            }
            if (arr.length) {
                sendToBottomPanel(tag_ + name, arr);
            }
        }
        out = out.split(/\n/);
        var stdOutLen = out[1] >> 0;
        out.splice(0, 2);
        send('', 0, stdOutLen - 1);
        send('[stderr] ', stdOutLen, out.length);
    }
    function nodeExec(cmdLine, cwd, name, toShowOutput, toShowStdErr, fileParams) {
        var root;
        var replList = [];
        function addRepl(list, prefix, filename, root_) {
            var parts = filename.match(/^(.*)\/([^\/]*)$/);
            var relFile = filename.indexOf(root_) === 0 ? filename.substr(root_.length) : filename;
            list.push([prefix, filename]);
            list.push([prefix + 'file', parts ? parts[2] : '']);
            list.push([prefix + 'path', parts ? parts[1] : '']);
            list.push([prefix + 'relfile', relFile]);
        }
        if (fileParams) {
            root = getProjectRoot();
            Object.keys(fileParams).forEach(function (key) {
                addRepl(replList, key, fileParams[key], root);
            });
            replList.forEach(function (macro) {
                cmdLine = cmdLine.replace('{{' + macro[0] + '}}', macro[1]);
            });
        }
        ixDomains.exec('exec', cmdLine, cwd).fail(function (out) {
            if (toShowStdErr) {
                displayNodeResult(false, out, name);
            }
        }).done(function (out) {
            if (toShowOutput) {
                displayNodeResult(true, out, name);
            }
        });
    }
    // ------------------------------------------------------------------------
    //                               UI
    // ------------------------------------------------------------------------
    function buildDlgTitle(title) {
        return brk.Mustache.render(ix.htmltempl.DLGTITLE, {
            root: brk.moduleroot, title: title,
            social: brk.Mustache.render(ix.htmltempl.SOCIAL, SOCIAL),
        });
    }
    function handleSocial(_$dlg) {
    }
    function ask(title, cmd, fieldList, callback, opts, fields) {
        return ui.ask(buildDlgTitle(title || cmd.cleanlabel), cmd ? cmd.storeid : '', fieldList, callback, opts, fields || prefs, opts && opts.nosaveprefs ? undefined : saveExtPrefs, prefs.historySize.value, i18n, brk, handleSocial);
    }
    function showMessage(title, message) {
        brk.Dialogs.showModalDialog('bracketstoix-dialog', buildDlgTitle(i18n(title)), message, [{
                className: brk.Dialogs.DIALOG_BTN_CLASS_PRIMARY,
                id: brk.Dialogs.DIALOG_BTN_OK,
                text: brk.CoreStrings.CLOSE,
            }], true);
    }
    // ------------------------------------------------------------------------
    //                               Commands: Transforms
    // ------------------------------------------------------------------------
    function splitText(cmd) {
        ask('', cmd, ['splitMarker'], function () {
            changeSelectionRegEx(new RegExp(tools.processSplit(prefs.splitMarker.value), 'g'), '\n', SP_ALL);
        });
    }
    function numberText(cmd) {
        ask('', cmd, ['startNum', 'numSep'], function () {
            var num = prefs.startNum.value;
            var numSep = tools.getSpaceText(prefs.numSep.value);
            changeSelectionRegEx(/^(.*)$/gm, function (_match, p1) { return (num++) + numSep + p1; }, SP_ALL);
        });
    }
    function trimLeading() {
        changeSelectionRegEx(/^[ \t]+/gm, '', SP_ALL);
    }
    function trimTrailingex(selPolicy) {
        changeSelectionRegEx(/[ \t]+$/gm, '', selPolicy);
    }
    function trimTrailing() {
        trimTrailingex(SP_ALL);
    }
    function markdownTrimTrailing() {
        changeSelectionRegEx(/[ \t]+$/gm, '  ', SP_ALL);
    }
    function sortAscending() {
        sortSelection(function (a, b) { return a > b ? 1 : (a < b ? -1 : 0); }, SP_ALL);
    }
    function sortDescending() {
        sortSelection(function (a, b) { return a < b ? 1 : (a > b ? -1 : 0); }, SP_ALL);
    }
    function tabToSpace() {
        changeSelectionRegEx(/\t/gm, tools.strRepeat(' ', prefs.tabSize.value), SP_ALL);
    }
    function spaceToTab() {
        changeSelectionRegEx(/^(\s+)/gm, function (spaces) {
            var len = spaces.length;
            var tabs = Math.floor(len / prefs.tabSize.value);
            return !tabs ? spaces : tools.strRepeat("\t", tabs) +
                tools.strRepeat(' ', len - tabs * prefs.tabSize.value);
        }, SP_ALL);
    }
    function regnize() {
        getSelection(function (text) {
            clipbrdCopy(getRegnize(text, true));
        }, SP_SENTENCE);
    }
    function rgbHex() {
        changeSelectionRegEx(/(?:#([a-f0-9]{2,2})([a-f0-9]{2,2})([a-f0-9]{2,2}))|(?:rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\))/ig, function (text, h1, h2, h3, r1, r2, r3) {
            function toHex2(v) {
                var res = parseInt(v, 10).toString(16);
                return res.length < 2 ? '0' + res : res;
            }
            if (h1 === undefined) {
                return '#' + toHex2(r1) + toHex2(r2) + toHex2(r3);
            }
            else {
                return 'rgb(' + parseInt(h1, 16) + ', ' + parseInt(h2, 16) + ', ' + parseInt(h3, 16) + ')';
            }
        }, SP_SENTENCE);
    }
    function untag() {
        changeSelectionRegEx(/<(\w+)(?:.*?)>(.*?)<\/(\1)\s*>/, "$2", 
        // function policy.
        function (inf, ch) {
            if (inf.stop) {
                inf.stop = false;
                return false;
            }
            inf.stop = ch === (inf.dir === -1 ? '<' : '>');
            return true;
        });
    }
    function tag() {
        changeSelection(function (text, so) {
            var tagname;
            function getAttr(ch, prefix) {
                var attr = tagname.split(ch);
                if (attr.length > 1) {
                    tagname = attr[0];
                    attr.splice(0, 1);
                    attr = ' ' + prefix + '="' + attr.join(' ') + '"';
                }
                else {
                    attr = '';
                }
                return attr;
            }
            var id;
            var cls;
            var at;
            var base;
            var removelen;
            var tokens;
            tokens = text.match(/^(\s*)(\b.*\b)(\s*)$/);
            if (!tokens) {
                return;
            }
            tagname = tokens[2].split(' ', 1)[0];
            removelen = tagname.length + 1; // assumes a single space separator
            text = text.substr(removelen).trim();
            // TAG#ID.CLASS1.CLASS2  -> 1st retrieve the class, then the id
            cls = getAttr('.', 'class');
            id = getAttr('#', 'id');
            at = EXPAND_TAGS.indexOf(';' + tagname + '=');
            if (at !== -1) {
                tagname = EXPAND_TAGS.substr(at + tagname.length + 2).split(';', 1)[0];
            }
            base = '<' + tagname + id + cls + '>';
            // readjust cursor
            if (so.start) {
                so.cursor = {
                    ch: so.start.ch + base.length,
                    line: so.start.line,
                };
            }
            return tokens[1] + base + text + '</' + tagname + '>' + tokens[3];
        }, SP_SENTENCE);
    }
    // ------------------------------------------------------------------------
    //                               Command: declJSLintGlobal
    // ------------------------------------------------------------------------
    function declJSLintGlobal() {
        getSelection(function (ident, so) {
            var row = 0;
            var max = so.cm.lineCount();
            var line;
            var trimline;
            var tokens;
            var identlist;
            var trimidentlist;
            function coreProcess(regMatch) {
                line = so.cm.getLine(row);
                tokens = null;
                trimidentlist = null;
                trimline = line.trim();
                if (trimline) {
                    tokens = line.match(regMatch);
                    if (tokens) {
                        // found a global
                        if (tokens.length > 1) {
                            identlist = tokens[1];
                            if (identlist.replace(/ /g, '').split(',').indexOf(ident) > -1) {
                                // already exists
                                return null;
                            }
                            trimidentlist = identlist.trim();
                        }
                    }
                }
                return true;
            }
            ident = ident.trim();
            if (!ident) {
                return;
            }
            while (row < max) {
                line = so.cm.getLine(row);
                trimline = line.trim();
                if (!coreProcess(/^\s*\/\*\s*global\s*(.*?)\s*(\*\/){0,1}\s*$/)) {
                    return;
                }
                if (trimline) {
                    if (tokens) {
                        // found a global
                        if (tokens.length > 1) {
                            // handles global statements with multiple rows
                            while (trimidentlist[trimidentlist.length - 1] === ',') {
                                row++;
                                if (row === max || !coreProcess(/^\s*(.*?)\s*(\*\/){0,1}\s*$/) || !trimline || tokens.length <= 1) {
                                    return;
                                }
                            }
                            // adds a new ident to the row
                            setRow(row, line.replace(identlist, identlist + ', ' + ident), so);
                        }
                        else {
                            // empty global statement
                            setRow(row, line.replace('global', 'global ' + ident), so);
                        }
                        return;
                    }
                    else {
                        if (trimline[0] !== '/' && trimline[0] !== '*') {
                            insertRow(row, '/*global ' + ident + ' */', so);
                            break;
                        }
                    }
                }
                row++;
            }
        }, SP_WORD);
    }
    // ------------------------------------------------------------------------
    //                               Commands: Quotes
    // ------------------------------------------------------------------------
    var Q_SINGLE = 0;
    var Q_DOUBLE = 1;
    var Q_TOGGLE = 2;
    function quoteOp(op) {
        changeSelection(function (text) {
            var arr = text.split('');
            var isin = false;
            var i;
            var ch;
            for (i = 0; i <= arr.length; i++) {
                ch = arr[i];
                switch (ch) {
                    // TODO: Slash the quote if the reverse quote already exists. Support \" and \'
                    case "'":
                        if ((op === Q_SINGLE) || (op === Q_TOGGLE)) {
                            arr[i] = '"';
                            isin = !isin;
                        }
                        break;
                    case '"':
                        if ((op === Q_DOUBLE) || (op === Q_TOGGLE)) {
                            arr[i] = "'";
                            isin = !isin;
                        }
                        break;
                }
            }
            return arr.join('');
        }, 
        // function policy. it stops if the start(1st pass) and end(2nd pass) quote are the same.
        function (inf, ch) {
            if (inf.stop) {
                inf.stop = false;
                return false;
            }
            if ((ch === "'" || ch === '"') && (ch === inf.quote || !inf.quote)) {
                inf.stop = true;
                inf.quote = ch;
            }
            return true;
        });
    }
    function singleToDoubleQuote() {
        quoteOp(Q_SINGLE);
    }
    function doubleToSingleQuote() {
        quoteOp(Q_DOUBLE);
    }
    function toggleQuote() {
        quoteOp(Q_TOGGLE);
    }
    // ------------------------------------------------------------------------
    //                               Commands: External
    // ------------------------------------------------------------------------
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
    function browseFile() {
        nodeOpenUrl('file:///' + getCurFileName());
    }
    // ------------------------------------------------------------------------
    //                               Command: ExtractortoIX
    // ------------------------------------------------------------------------
    function extractortoix(cmd) {
        ask('', cmd, ['findre', 'splitMarkerExtr', 'isignorecase'], function () {
            getSelection(function (text) {
                var foundtext = [];
                var spliter = tools.processSplit(prefs.splitMarkerExtr.value);
                text.replace(new RegExp(prefs.findre.value, 'g' + (prefs.isignorecase.value ? 'i' : '')), function () {
                    var record = [];
                    var i = 1;
                    if (arguments && arguments.length) {
                        if (typeof arguments[1] === 'number') {
                            foundtext.push(arguments[0]);
                        }
                        else {
                            while (typeof arguments[i] !== 'number') {
                                record.push(arguments[i]);
                                i++;
                            }
                            foundtext.push(record.join(spliter));
                        }
                    }
                    return arguments ? arguments[0] : '';
                });
                if (foundtext.length) {
                    clipbrdCopy(foundtext.join('\n'));
                }
                else {
                    showMessage('', brk.CoreStrings.FIND_NO_RESULTS);
                }
            }, SP_ALL);
        }, {
            msg: i18n('EXTRACTOR_MSG'),
        });
    }
    // ------------------------------------------------------------------------
    //                               Command: ReplaceToIX
    // ------------------------------------------------------------------------
    function replacetoix(cmd) {
        var text = getSelObj(SP_LINE).cursel.split('\n');
        prefs.find.value = text.length > 0 ? text[0].trim() : '';
        prefs.replace.value = '';
        ask('', cmd, ['find', 'replace', 'startValue', 'stepValue',
            'iswordsonly', 'isregexpr', 'isignorecase', 'isimultiline', 'isall', 'isselonly',
        ], function () {
            var findtext = prefs.isregexpr.value ? prefs.find.value : getRegnize(prefs.find.value, true);
            var repltext = prefs.isregexpr.value ? prefs.replace.value : getRegnize(prefs.replace.value, false);
            var startValue = prefs.startValue.value ? parseInt(prefs.startValue.value, 10) : undefined;
            var stepValue = prefs.stepValue.value ? parseInt(prefs.stepValue.value, 10) : undefined;
            if (prefs.iswordsonly.value && !prefs.isregexpr.value) {
                findtext = '\\b' + findtext + '\\b';
            }
            changeSelectionRegEx(new RegExp(findtext, (prefs.isall.value ? 'g' : '') +
                (prefs.isignorecase.value ? 'i' : '') +
                (prefs.isimultiline.value ? 'm' : '')), (startValue !== undefined) && (stepValue !== undefined) ?
                // format mode	(Start, Step)
                function () {
                    var out = repltext;
                    for (var i = 1; i < arguments.length - 2; i++) {
                        out = out.replace(new RegExp('\\$' + i, 'g'), arguments[i]);
                    }
                    out = out.replace(/(\#\{(0*)(\d*)(\w+)\}\#)/, function (str, pall, pzero, pdigit, pmacro) {
                        function formatvalue(pzero_, pdigit_, value) {
                            var prefix = [];
                            value = value + '';
                            if (!pdigit_) {
                                return value;
                            }
                            pdigit_ = pdigit_ >> 0;
                            if (value.length > pdigit_) {
                                return value;
                            }
                            prefix.length = pdigit_ + 1 - value.length;
                            return prefix.join(pzero_ ? '0' : ' ') + value;
                        }
                        switch (pmacro) {
                            case 'd': return formatvalue(pzero, pdigit, startValue);
                            case 'X': return formatvalue(pzero, pdigit, startValue.toString(16).toUpperCase());
                            case 'x': return formatvalue(pzero, pdigit, startValue.toString(16));
                            default: return pall;
                        }
                    });
                    startValue += stepValue;
                    return out;
                } : repltext, prefs.isselonly.value ? SP_ALL : SP_FORCE_ALL);
        });
    }
    // ------------------------------------------------------------------------
    //                               Command: Function JSDoc
    // ------------------------------------------------------------------------
    function buildFuncJSDoc() {
        getSelection(function (text, so) {
            var match = text.match(/(?:(\w+)\s*[:=]\s*){0,1}function(?:\s+(\w+)){0,1}\s*\((.*?)\)/i);
            var func;
            var initialspace;
            if (match && match.length > 1) {
                func = match[1] || match[2];
                if (!func) {
                    return;
                }
                var vars = match[3];
                initialspace = text.match(/^\s*/i)[0];
                var jsdoc_1 = '|/**\n' + (func[0] === '_' ? '|* @private\n' : '') + '|* ' + func + '\n';
                if (vars) {
                    vars.split(',').forEach(function (v) {
                        jsdoc_1 += '|* @param {} ' + v.trim() + '\n';
                    });
                }
                jsdoc_1 += '|* @return {} \n';
                jsdoc_1 += '|*/\n';
                jsdoc_1 = jsdoc_1.replace(/\|/g, initialspace);
                so.cm.replaceRange(jsdoc_1, so.start, so.start);
            }
        }, SP_FORCE_LINE);
    }
    // ------------------------------------------------------------------------
    //                               Commands: LoremIpsum & BreakLineAt
    // ------------------------------------------------------------------------
    function execBreakLineAt(line, maxChars, toBreakWords) {
        var start = 0;
        var at;
        var stest;
        while (start + maxChars < line.length) {
            at = start + maxChars;
            if (!toBreakWords) {
                stest = line.substring(start, at).replace(/[\w_]/g, '0');
                for (at -= start; at > 0 && stest[at - 1] === '0'; at--) { }
                if ((!at) && (stest[0] === '0')) {
                    at = maxChars;
                }
                at += start;
            }
            line = line.substr(0, at) + '\n' + line.substr(at);
            start = at + 1;
        }
        return line;
    }
    function breakLineAt(cmd) {
        ask('', cmd, ['maxcharsperline', 'tobreakwords'], function () {
            var maxchars = Math.max(1, prefs.maxcharsperline.value.trim() >> 0);
            var toBreakWords = prefs.tobreakwords.value;
            changeSelection(function (array, so) {
                array.forEach(function (line, index) {
                    array[index] = execBreakLineAt(line, maxchars, toBreakWords);
                });
                return array;
            }, SP_LINE, true);
        });
    }
    function loremIpsum(cmd) {
        $.get(brk.moduleroot + 'lorem.txt', function (data) {
            ask('', cmd, ['linrparagraphs', 'limaxcharsperline', 'lihtmlparawrap'], function () {
                changeSelection(function (text, so) {
                    var lines = data.split('\n', Math.min(100, Math.max(prefs.linrparagraphs.value >> 0)));
                    var wrap = prefs.lihtmlparawrap.value.trim();
                    var wrapst = '<' + wrap + '>';
                    var wrapend = '</' + wrap.replace(/\s.+$/, '') + '>';
                    var maxchars = prefs.limaxcharsperline.value >> 0;
                    lines.forEach(function (line, index) {
                        if (maxchars) {
                            line = execBreakLineAt(line, maxchars, false);
                        }
                        if (wrap) {
                            line = wrapst + line + wrapend;
                        }
                        lines[index] = line;
                    });
                    return lines.join('\n');
                }, SP_NONE);
            });
        });
    }
    // ------------------------------------------------------------------------
    //                               Commands: Clipboard
    // ------------------------------------------------------------------------
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
    function buidHtmlReport() {
        getSelection(function (text) {
            var outp = [];
            [
                ['link rel="stylesheet" href', 'stylesheet', true],
                ['id'],
                ['class'],
            ].forEach(function (item) {
                var token = item[0];
                var list = [];
                var i;
                // although there is no text to replace, it's easier to use replace than using //.exec
                text.replace(new RegExp(token + '=(?:(\\w+)|(?:"(.+?)"))', 'gi'), function (data, p1, p2) {
                    list.push(p1 || p2);
                    return data;
                });
                if (!item[2]) {
                    list.sort();
                }
                // remove duplicates. this method is faster than use a indexOf during the push code
                for (i = list.length; i > 0; i--) {
                    if (list[i] === list[i - 1]) {
                        list.splice(i, 1);
                    }
                }
                outp.push('[' + (item[1] || token) + ']');
                outp = outp.concat(list);
                outp.push(''); // empty line
            });
            clipbrdCopy(outp.join('\n'));
        }, SP_ALL);
    }
    // ------------------------------------------------------------------------
    //                               Execute
    // ------------------------------------------------------------------------
    function runExecute(cmd) {
        var fields = {
            cmdline: {
                value: '',
                label: 'FLD_Cmdline_label',
            },
            tools: {
                value: '',
                canempty: true,
                type: 'dropdown',
                values: [''],
                label: 'CAT_Tools',
                events: [{
                        name: 'change',
                        f: function (inf) {
                            var idx;
                            var tool;
                            idx = (inf.$dlg.find('#toixtools')[0].selectedIndex >> 0) - 1;
                            if (idx >= 0) {
                                tool = prefs.tools.value[idx];
                                inf.$dlg.find('#toixcmdline').val(tool.cmdline);
                                inf.$dlg.find('#toixshowoutput').get(0).checked = tool.showoutput;
                            }
                        },
                    }],
            },
            path: {
                value: getProjectRoot(),
                label: 'FLD_Path_label',
            },
            showoutput: {
                value: true,
                type: 'boolean',
                label: 'FLD_ShowOutput_label',
                canempty: true,
            },
        };
        prefs.tools.value.forEach(function (tool) {
            fields.tools.values.push(tool.name);
        });
        ask('', cmd, ['cmdline', 'path', 'tools', 'showoutput'], function () {
            var cmdline = fields.cmdline.value;
            nodeExec(cmdline, getProjectRoot(), cmdline, fields.showoutput.value, true, { in: getCurFileName() });
        }, {
            nosaveprefs: true,
        }, fields);
    }
    // ------------------------------------------------------------------------
    //                               Compile
    // ------------------------------------------------------------------------
    /*function showResultsPanel(err, stdout, stderr, iscompiler) { // Compiler callback isn't working
          let text = '';
          if (iscompiler) {
              text = stderr;
          } else {
              text = stderr + '\n' + stdout;
          }
          text = text.trim();
              PanelManager.createBottomPanel(MODULENAME, text);
          }
      }*/
    function runCompilerEx(toAutoSave, filename) {
        var exts = [
            {
                inext: '.js6',
                outext: '.js',
            },
            {
                inext: '.scss',
                outext: '.css',
            },
            {
                inext: '.js',
                outext: '.min.js',
            }
        ];
        var infile = filename || getCurFileName();
        var outfile;
        var ext;
        var pref;
        for (var i = 0; i < exts.length; i++) {
            ext = exts[i];
            if (checkExt(infile, ext.inext)) {
                pref = prefs[ext.inext.substr(1)];
                if (pref.value && ((pref.fields && pref.fields.autosave && pref.fields.autosave.value) || !toAutoSave)) {
                    outfile = infile.substr(0, infile.length - ext.inext.length) + ext.outext;
                    nodeExec(pref.value, getProjectRoot(), 'Compile ' + infile, false, true, { in: infile, out: outfile });
                    break;
                }
            }
        }
    }
    function runCompiler() {
        runCompilerEx(false);
    }
    // ------------------------------------------------------------------------
    //                               Recent Files
    // ------------------------------------------------------------------------
    function handleDocumentChanged(event, doc) {
        var file;
        var idx;
        var recentFiles;
        applyEditorProjSettings(projSettings.data);
        if (doc && doc.file && doc.file._isFile) {
            file = doc.file._path;
            if (file.indexOf('/_brackets_') === -1) { // excludes new unsaved files
                recentFiles = prefs.recentFiles.files;
                idx = recentFiles.indexOf(file);
                if (idx === -1) {
                    recentFiles.splice(0, 0, file);
                    if (recentFiles.length > prefs.recentSize.value) {
                        recentFiles.length = prefs.recentSize.value;
                    }
                }
                else {
                    recentFiles.splice(idx, 1);
                    recentFiles.splice(0, 0, file);
                }
                saveExtPrefs();
            }
        }
    }
    function showRecentFiles(cmd) {
        var rf = prefs.recentFiles;
        var rlen;
        rf.value = '';
        // rf.rows = Math.min(prefs.recentSize.value, 20);
        rf.values = [];
        var root = getProjectRoot();
        rlen = root.length;
        rf.files.forEach(function (file) {
            if (file.substr(0, rlen) === root) {
                file = file.substr(rlen);
            }
            rf.values.push(file);
        });
        ask('', cmd, ['recentFiles'], function () {
            var rf_ = prefs.recentFiles;
            brk.CommandManager.execute(brk.Commands.CMD_ADD_TO_WORKINGSET_AND_OPEN, {
                fullPath: rf_.files[rf_.values.indexOf(rf_.value)],
                silent: true,
                options: {
                    paneId: brk.MainViewManager.ACTIVE_PANE,
                },
            });
        }, {
            nosaveprefs: true,
        });
    }
    // ------------------------------------------------------------------------
    //                               Snippets
    // ------------------------------------------------------------------------
    /* Initial implementation, not finished.
  
  function getSnippets(callback) {
      if(!snippets) {
          $.getJSON(brk.FileUtils.getNativeModuleDirectoryPath(module) + '/snippets.json', (data) => {
              snippets = data;
              callback();
          });
      } else {
          callback();
      }
  }
  
  function execSnippets() {
      getSnippets( () => {
          let so = getSelObj(SP_WORD);
          if (!so.cursel) {
              return;
          }
  
      });
  }
  */
    // ------------------------------------------------------------------------
    //                               showOptions
    // ------------------------------------------------------------------------
    function showHelp() {
        nodeOpenUrl(HELP_LINK);
    }
    function showAbout(cmd) {
        showMessage(cmd.cleanlabel, brk.Mustache.render(ix.htmltempl.ABOUTTEXT, {
            helplink: HELP_LINK,
            version: VERSION,
            devby: brk.StringUtils.format(brk.Strings.DEVBY_MSG, AUTHOR),
        }));
    }
    function showOptions(cmd) {
        optstoix.prepare(prefs, namedcmdlist, ix, tools, projSettings);
        ask('', cmd, prefs.OPTIONFIELDS, undefined, {
            dlgtemplate: optshtml,
            handler: optstoix,
            setSpaceUnits: function (aProjSetsData, enabled) {
                if (enabled) {
                    aProjSetsData.useTabChar = brk.Editor.getUseTabChar();
                    aProjSetsData.spaceUnits = brk.Editor.getSpaceUnits();
                    aProjSetsData.tabSize = brk.Editor.getTabSize();
                }
                else {
                    delete aProjSetsData['useTabChar'];
                    delete aProjSetsData['spaceUnits'];
                    delete aProjSetsData['tabSize'];
                }
            },
            saveProjSettings: function (aProjSetsData) {
                brk.FileUtils.writeText(brk.FileSystem.getFileForPath(getProjectRoot() + PROJ_SETTINGS_FILE), JSON.stringify(aProjSetsData, null, ' '));
            },
        });
    }
    function showCommands(cmd) {
        var fields = {
            cmd: {
                value: '',
                type: 'dropdown',
                values: namedcmdlist.map(function (cmd_) { return cmd_.cleanlabel; }),
            },
        };
        fields.cmd.values.sort();
        ask('', cmd, ['cmd'], function () {
            var selcmd = fields.cmd.value;
            namedcmdlist.every(function (cmd_) {
                if (selcmd === cmd_.cleanlabel) {
                    runCommand(cmd_);
                    return false;
                }
                return true;
            });
        }, {
            nosaveprefs: true,
        }, fields);
    }
    function showCommandMapper(cmd) {
        var fields = {};
        var fieldlist = [];
        var showinmenu = prefs.commands.value.showinmenu;
        var showinctxmenu = prefs.commands.value.showinctxmenu;
        var hotkeys = prefs.commands.value.hotkeys;
        namedcmdlist.forEach(function (cmd_) {
            var key = cmd_.storeid;
            fields[key] = {
                value: hotkeys[key] || '',
                label: cmd_.cleanlabel,
                size: 15,
                canempty: true,
                hint: i18n('SHORTCUT_HINT'),
                fields: {
                    showinmenu: {
                        value: showinmenu.indexOf(key) > -1,
                        type: 'boolean',
                        align: 'center',
                        canempty: true,
                    },
                    showinctxmenu: {
                        value: showinctxmenu.indexOf(key) > -1,
                        type: 'boolean',
                        align: 'center',
                        canempty: true,
                    },
                },
            };
            fieldlist.push(key);
        });
        ask('', cmd, fieldlist, function () {
            showinmenu = [];
            showinctxmenu = [];
            hotkeys = {};
            namedcmdlist.forEach(function (cmd_) {
                var key = cmd_.storeid;
                var field = fields[key];
                if (field.value) {
                    hotkeys[key] = field.value.replace(/\b(Cmd|Shift|Alt|Ctrl|\w)\b/gi, function (txt, p1) { return p1[0].toUpperCase() + p1.substr(1).toLowerCase(); }).replace(/\+/g, '-');
                }
                if (field.fields.showinmenu.value) {
                    showinmenu.push(key);
                }
                if (field.fields.showinctxmenu.value) {
                    showinctxmenu.push(key);
                }
            });
            prefs.commands.value.showinmenu = showinmenu;
            prefs.commands.value.showinctxmenu = showinctxmenu;
            prefs.commands.value.hotkeys = hotkeys;
            saveExtPrefs();
        }, {
            nosaveprefs: true,
            msg: i18n('NEED_RESTART_MSG'),
            header: ['Command', 'Hotkey', 'Show on Menu', 'Show on CtxMenu'],
        }, fields);
    }
    // ------------------------------------------------------------------------
    //                               runLanguageMapper
    // ------------------------------------------------------------------------
    function runLanguageMapper() {
        var lang = brk.LanguageManager.getLanguage('javascript');
        lang.addFileExtension('js6');
    }
    // ------------------------------------------------------------------------
    //                               buildCommands
    // ------------------------------------------------------------------------
    var SHOWONMENU = 1;
    function initCommandList() {
        cmdlist = [
            { name: 'UpperCase', f: transformutilities.upperCase, priority: SHOWONMENU, canonsave: true },
            { name: 'LowerCase', f: transformutilities.lowerCase, priority: SHOWONMENU, canonsave: true },
            { name: 'Capitalize', f: transformutilities.capitalize, priority: SHOWONMENU, canonsave: true },
            { name: 'CamelCase', f: transformutilities.camelCase, priority: SHOWONMENU },
            { name: 'DashCase', f: transformutilities.dashCase, priority: SHOWONMENU },
            { name: 'spaceByUpper', f: transformutilities.spaceByUpper },
            { name: 'HtmlEncode', f: transformutilities.htmlEncode, priority: SHOWONMENU },
            { name: 'HtmlDecode', f: transformutilities.htmlDecode, priority: SHOWONMENU },
            { name: 'UrlEncode', f: transformutilities.urlEncode, priority: SHOWONMENU },
            { name: 'UrlDecode', f: transformutilities.urlDecode, priority: SHOWONMENU },
            { name: 'Join', f: transformutilities.joinText, priority: SHOWONMENU },
            { name: 'Split...', f: splitText, priority: SHOWONMENU },
            { name: 'Number...', f: numberText, priority: SHOWONMENU },
            { name: 'Reverse', f: transformutilities.reverseAssignment, priority: SHOWONMENU },
            { name: 'Trim Leading', f: trimLeading, priority: SHOWONMENU, canonsave: true },
            { name: 'Trim Trailing', f: trimTrailing, priority: SHOWONMENU, canonsave: true },
            { name: 'Markdown Trim Trailing', f: markdownTrimTrailing, priority: SHOWONMENU, canonsave: true },
            { name: 'Sort Ascending', f: sortAscending, priority: SHOWONMENU, canonsave: true },
            { name: 'Sort Descending', f: sortDescending, priority: SHOWONMENU, canonsave: true },
            { name: 'Remove Duplicates', f: lineutilities.removeDuplicatedLines, priority: SHOWONMENU, canonsave: true },
            { name: 'Remove Empty Lines', f: lineutilities.removeEmptyLines, priority: SHOWONMENU, canonsave: true },
            { name: 'Indent One Space', f: lineutilities.indentOneSpace, canonsave: true },
            { name: 'Outdent One Space', f: lineutilities.outdentOneSpace, canonsave: true },
            {},
            { name: 'Unix To Win', f: transformutilities.unixToWinSlash, priority: SHOWONMENU, canonsave: true },
            { name: 'Win To Unix', f: transformutilities.winToUnixSlash, priority: SHOWONMENU, canonsave: true },
            { name: 'Single Slash To Double', f: transformutilities.singleToDoubleSlash, priority: SHOWONMENU },
            { name: 'Double To Single Slash', f: transformutilities.doubleToSingleSlash, priority: SHOWONMENU },
            { name: 'Single Quote To Double', f: singleToDoubleQuote, priority: SHOWONMENU },
            { name: 'Double To Single Quote', f: doubleToSingleQuote, priority: SHOWONMENU },
            { name: 'Toggle Quote', f: toggleQuote, priority: SHOWONMENU },
            { name: 'Tab To Space', f: tabToSpace, priority: SHOWONMENU, canonsave: true },
            { name: 'Space To Tab', f: spaceToTab, priority: SHOWONMENU, canonsave: true },
            { name: 'rgb-hex', f: rgbHex, priority: SHOWONMENU },
            { name: 'Untag', f: untag, priority: SHOWONMENU },
            { name: 'Tag', f: tag, priority: SHOWONMENU },
            { menu: 1 },
            { name: 'Break Line At...', f: breakLineAt, priority: SHOWONMENU },
            { name: 'Lorem ipsum...', f: loremIpsum, priority: SHOWONMENU },
            { name: 'Function JSDoc', f: buildFuncJSDoc, priority: SHOWONMENU },
            { name: 'Declare JSLint Global', f: declJSLintGlobal, priority: SHOWONMENU },
            {},
            { name: 'ExtractortoIX...', f: extractortoix, priority: SHOWONMENU },
            { name: 'ReplacetoIX...', f: replacetoix, priority: SHOWONMENU },
            {},
            { name: 'Open Url', f: openUrl, priority: SHOWONMENU },
            { name: 'Web Search', f: webSearch, priority: SHOWONMENU },
            { name: 'Browse File', f: browseFile, priority: SHOWONMENU },
            {},
            { name: 'Recent Files...', f: showRecentFiles, priority: SHOWONMENU },
            { name: 'Copy Filename', f: fileToClipboard, priority: SHOWONMENU },
            { name: 'Copy Fullname', f: fullnameToClipboard, priority: SHOWONMENU },
            { name: 'Regnize', f: regnize, priority: SHOWONMENU },
            { name: 'Html Report', f: buidHtmlReport, priority: SHOWONMENU },
            {},
            // {name: 'Regex Tester', f: regexTester},
            { name: 'Compiler', f: runCompiler, priority: SHOWONMENU },
            { name: 'Execute', f: runExecute, showalways: true, priority: SHOWONMENU, toolinsertpoint: true },
            // {name: 'Snippets', f: execSnippets, priority: SHOWONMENU},
            /*{name: 'Run grunt', f: runGrunt}, */
            {},
            { name: 'Commands...', f: showCommands, priority: SHOWONMENU },
            { name: 'Commands Mapper...', f: showCommandMapper, showalways: true, priority: SHOWONMENU },
            { name: 'Options...', f: showOptions, priority: SHOWONMENU },
            // deactivated for now
            // { name: 'Help', f: showHelp, corelabel: 'HELP_MENU', priority: SHOWONMENU },
            { name: 'About', f: showAbout, corelabel: 'ABOUT', showalways: true, priority: SHOWONMENU },
        ];
        cmdlist.forEach(function (cmd) {
            if (cmd.name) {
                namedcmdlist.push(cmd);
            }
        });
        namedcmdlist.forEach(function (cmd) {
            var txt = cmd.name;
            var fullen = txt.length;
            var len = fullen;
            var lab;
            if (cmd.corelabel) {
                lab = brk.CoreStrings[cmd.corelabel];
            }
            else {
                // remove the trailing dots for the locatization matching
                while (txt[len - 1] === '.') {
                    len--;
                }
                if (txt.substr(len - 4, 4) === 'toIX') {
                    len -= 4;
                }
                lab = brk.Strings[txt.substr(0, len)];
                if (lab) {
                    lab += txt.substr(len);
                }
            }
            cmd.label = lab || txt;
            cmd.cleanlabel = cmd.label.replace(/\./g, '');
            cmd.storeid = tools.textToID(cmd.name);
            storeidmap[cmd.storeid] = cmd;
        });
    }
    function runCommand(cmd, isglobal) {
        if ((isglobal !== undefined) === (globalDoc !== null)) {
            cmd.f(cmd);
        }
    }
    // This function must be a top level function to mimimize the closure
    function registerCommand(cmd, id) {
        brk.CommandManager.register(cmd.label, id, function () {
            runCommand(cmd);
        });
    }
    function registerToolCommand(tool, id) {
        brk.CommandManager.register(tool.name, id, function () {
            nodeExec(tool.cmdline, getProjectRoot(), tool.cmdline, tool.showoutput, true, { in: getCurFileName() });
        });
    }
    function runEditCmd(cmd) {
        var so = getSelObj(SP_NONE);
        if (cmd === 'CMD_PASTE') {
            setSelection(so, clipbrdPaste());
        }
        if (so.cursel) {
            clipbrdCopy(so.cursel);
            if (cmd === 'CMD_CUT') {
                setSelection(so, '');
            }
        }
    }
    function registerEditCtxCommand(cmd, label, id) {
        brk.CommandManager.register(label, id, function () {
            runEditCmd(cmd);
        });
    }
    function addEditCmdsToLocalMenu(ctxMenu) {
        var EDIT_CMDS = ['CMD_CUT', 'CMD_COPY', 'CMD_PASTE'];
        if (!prefs.showcxtedit.value) {
            return;
        }
        for (var i = 0; i < EDIT_CMDS.length; i++) {
            var cmd = EDIT_CMDS[i];
            var id = MODULE_NAME + "." + tools.textToID(cmd);
            registerEditCtxCommand(cmd, brk.CoreStrings[cmd], id);
            ctxMenu.addMenuItem(id, []);
        }
    }
    function addToolCommands(menu) {
        prefs.tools.value.forEach(function (tool, index) {
            var id;
            if (tool.showonmenu) {
                id = MODULE_NAME + ".TOOL." + index;
                registerToolCommand(tool, id);
                menu.addMenuItem(id, []);
            }
        });
    }
    function buildCommands() {
        function addToMenu(cmd_, menu, lastId, nm_, hotkeys_) {
            var opts;
            var hotkey;
            var id = MODULE_NAME + "." + cmd_.storeid;
            // Register Command
            if (id !== lastId) {
                registerCommand(cmd_, id);
            }
            // Register Menu Items
            opts = [];
            hotkey = hotkeys_[nm_];
            if (hotkey) {
                opts.push({
                    key: hotkey,
                    platform: brackets.platform,
                });
            }
            menu.addMenuItem(id, opts);
            return id;
        }
        // main body
        var menuidx = 0;
        var Menus = brackets.getModule('command/Menus');
        // menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU),
        // Since Brackets has no submenu support it"s better to create a top menu
        var menulist = [Menus.addMenu(IX_MENU_TT, tools.textToID(IX_MENU_TT)),
            Menus.addMenu(IX_MENU, tools.textToID(IX_MENU))];
        var ctxmenu = Menus.getContextMenu(Menus.ContextMenuIds.EDITOR_MENU);
        var i;
        var cmd;
        var nm;
        var lastid;
        var showinmenu = prefs.commands.value.showinmenu;
        var showinctxmenu = prefs.commands.value.showinctxmenu;
        var hotkeys = prefs.commands.value.hotkeys;
        var hasdiv = false;
        for (i = 0; i < cmdlist.length; i++) {
            cmd = cmdlist[i];
            if (!cmd.name) {
                if (cmd.menu) {
                    menuidx = cmd.menu;
                }
                else {
                    if (!hasdiv) {
                        menulist[menuidx].addMenuDivider();
                    }
                }
                hasdiv = true;
                continue;
            }
            nm = cmd.storeid;
            if (cmd.showalways || (showinmenu.indexOf(nm) > -1)) {
                hasdiv = false;
                lastid = addToMenu(cmd, menulist[menuidx], lastid, nm, hotkeys);
            }
            if (cmd.toolinsertpoint) {
                addToolCommands(menulist[menuidx]);
            }
            if (showinctxmenu.indexOf(nm) > -1) {
                lastid = addToMenu(cmd, ctxmenu, lastid, nm, hotkeys);
            }
        }
        addEditCmdsToLocalMenu(ctxmenu);
    }
    function fillShowonMenu() {
        cmdlist.forEach(function (cmd) {
            if (cmd.priority === SHOWONMENU) {
                prefs.commands.value.showinmenu.push(cmd.storeid);
            }
        });
    }
    function initPrefButtons() {
        prefs.find.buttons[0].f = function (text) { return getRegnize(text, true); };
        prefs.findre.buttons[0].f = prefs.find.buttons[0].f;
        prefs.scss.buttons[0].f = function () { return prefs.scss.buttons[0].setvalue; };
        prefs.scss.buttons[1].f = function () { return prefs.scss.buttons[1].setvalue; };
    }
    // ------------------------------------------------------------------------
    //                               checkForVersion2
    // ------------------------------------------------------------------------
    function _verReq(prevver, checkver, list) {
        if (prevver < checkver) {
            list.forEach(function (item) {
                if (prefs.commands.value.showinmenu.indexOf(item) === -1) {
                    prefs.commands.value.showinmenu.push(item);
                }
            });
        }
    }
    function versionCheck() {
        var prevver = prefs.version.value;
        if (prevver !== VERSION) {
            if (!prevver) {
                prevver = 0;
            }
            else {
                prevver = prevver.split('.');
                prevver = ((prevver[0] >> 0) * 1000) + (prevver[1] >> 0);
            }
            // Fixed bug in version 2.11. It be removed after a short period of time.
            if (prevver === 2011 && prefs.beforesave && prefs.beforesave.value && prefs.beforesave.value.length === 1 &&
                prefs.beforesave.value[0].name === 'def') {
                prefs.beforesave.value = [];
            }
            if (prevver < 2000) {
                prefs.commands.value.showinmenu = prefs.commands.svshowinmenu;
            }
            else {
                _verReq(prevver, 2001, ['recentfiles']);
            }
            if (prevver < 3002) {
                prefs.version.showwelcome = true;
            }
            prefs.version.value = VERSION;
            saveExtPrefs();
        }
    }
    function posVersionCheck() {
        // No longer shows a welcome message.
        /*if (prefs.version.showwelcome) {
          showMessage('Information', brk.Mustache.render(ix.htmltempl.WELLCOME, {version:VERSION}));
        }*/
    }
    // ------------------------------------------------------------------------
    //                               Before & After Save
    // ------------------------------------------------------------------------
    function execExternalQueue() {
        var tool;
        if (externalQueueIsBusy || !queueExternalSave.length) {
            return;
        }
        externalQueueIsBusy = true;
        // @TODO: Execute next node command only after it returned from the previous request
        while (queueExternalSave.length) {
            tool = queueExternalSave.shift();
            nodeExec(tool.cmdline, getProjectRoot(), tool.cmdline, false, false, { in: tool.infile, out: tool.outfile });
        }
        externalQueueIsBusy = false;
    }
    function runEventSaveCommands(doc, ext, prefvar) {
        var toolmap;
        prefvar.value.forEach(function (st) {
            if (st.exts.indexOf(ext) > -1) {
                st.cmds.forEach(function (storeid) {
                    var cmd;
                    if (storeid[0] === '@') {
                        // tool
                        if (!toolmap) {
                            toolmap = {};
                            prefs.tools.value.forEach(function (tool_) {
                                toolmap['@' + tool_.name] = tool_;
                            });
                        }
                        var tool = toolmap[storeid];
                        if (tool) {
                            queueExternalSave.push({ cmdline: tool.cmdline, infile: doc.file._path, outfile: '' });
                        }
                    }
                    else {
                        // cmd
                        cmd = storeidmap[storeid];
                        if (cmd) { // in case a command gets deprecated
                            globalDoc = doc;
                            try {
                                runCommand(cmd, true);
                            }
                            finally {
                                globalDoc = null;
                            }
                        }
                    }
                });
            }
        });
    }
    function runEventSave(isAll, execSaveCommand, prefvar) {
        function exec(doc) {
            if (doc && doc.isDirty && doc.file && doc.file.isFile && !doc.isUntitled()) {
                var ext = doc.file.name.replace(/^.*(\.[^\.]+)$/, '$1');
                if (ext.length) {
                    execSaveCommand(doc, ext, prefvar);
                }
            }
        }
        if (isAll) {
            brk.DocumentManager.getAllOpenDocuments().forEach(function (doc) {
                exec(doc);
            });
        }
        else {
            exec(brk.DocumentManager.getCurrentDocument());
        }
        execExternalQueue();
    }
    // ------------------------------------------------------------------------
    //                               Load project settings
    // ------------------------------------------------------------------------
    function applyEditorProjSettings(ps) {
        projSettings.applied = true;
        if (ps.spaceUnits) {
            if (brk.Editor.getUseTabChar() !== ps.useTabChar) {
                $('#indent-type').click();
                var value = ps.useTabChar ? ps.tabSize : ps.spaceUnits;
                $('#indent-width-label').text(value);
                $('#indent-width-input').val(value);
                brk.Editor.setSpaceUnits(ps.spaceUnits >> 0);
                brk.Editor.setTabSize(ps.tabSize >> 0);
            }
            else {
                projSettings.applied = false;
            }
        }
    }
    function applyProjSettings(ps) {
        applyEditorProjSettings(ps);
    }
    function handleAfterProjectOpen() {
        var projFile = getProjectRoot() + PROJ_SETTINGS_FILE;
        projSettings.applied = false;
        projSettings.data = {};
        $.getJSON(projFile, function (data) {
            applyProjSettings(data);
            projSettings.data = data;
            optstoix.setPrefsFromProject(prefs, projSettings);
        }).error(function () {
            if (projSettings.data) {
                applyProjSettings(projSettings.data);
            }
        });
    }
    // ------------------------------------------------------------------------
    //                               Save Commands
    // ------------------------------------------------------------------------
    function handleDocumentSaved(event, doc) {
        runEventSaveCommands(doc, doc.file.name.replace(/^.*(\.[^\.]+)$/, '$1'), prefs.aftersave);
        runCompilerEx(true, doc.file._path);
        execExternalQueue();
    }
    // ------------------------------------------------------------------------
    //                               Init
    // ------------------------------------------------------------------------
    function init() {
        brk.ExtensionUtils.loadStyleSheet(module, "styles/bracketstoix.css");
        initCommandList();
        fillShowonMenu(); // must be before loadextprefs
        initPrefButtons();
        prefs.commands.svshowinmenu = prefs.commands.value.showinmenu;
        loadExtPrefs();
        versionCheck();
        buildCommands();
        runLanguageMapper();
        initPrefButtons();
        posVersionCheck();
        // brk.DocumentManager.on('currentDocumentChange', handleDocumentChanged);
        brk.EditorManager.on('activeEditorChange', handleDocumentChanged);
        brk.DocumentManager.on('documentSaved', handleDocumentSaved);
        brk.ProjectManager.on('projectOpen', handleAfterProjectOpen);
        brk.CommandManager.on('beforeExecuteCommand', function (event, type) {
            if (type.indexOf("file.save") === 0) {
                runEventSave(type === "file.saveAll", runEventSaveCommands, prefs.beforesave);
            }
        });
    }
    $.getJSON(brk.moduleroot + 'html/htmltemplatestoix.json', function (data) {
        ix.htmltempl = data;
        $.getJSON(brk.moduleroot + 'pdtoolstoix.json', function (pdtools) {
            ix.pdtools = pdtools;
            init();
        });
    });
});
//# sourceMappingURL=main.js.map