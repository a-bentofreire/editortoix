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

/*jslint vars: true, plusplus: true, devel: true, white: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, brackets, $, escape, document */

define(function () {
    "use strict";
/** ------------------------------------------------------------------------
 *                               Closure
 ** ------------------------------------------------------------------------ */
    function _htmlencode(text) {
        return escape(text).replace(/%(\w\w)/g, '&#x$1;');
    }
    
    // Recomputes the background-color of a jQuery obj for a different a transparency
    function _retransparency(qObj, transparency) {
        var RGB, color = qObj.css('background-color').trim();
        if (!color) {
            return false;
        } 
        if (color[1] === '#') {
            RGB = [1, 3, 5];
            RGB.forEach(function (v, i) {
                RGB[i] = parseInt(color.substr(v, v + 2), 16);
            });
        } else if (color.indexOf('rgb') > -1) {
            RGB = color.split('(')[1].split(')')[0].split(',');
        } else {
            return false;
        }
        qObj.css('background-color', 'rgba(' + RGB[0] + ',' + RGB[1] + ',' + RGB[2] + ',' + transparency + ')');                         
        return true;
    }
/** ------------------------------------------------------------------------
 *                               Exported
 ** ------------------------------------------------------------------------ */
    return {
        htmlencode : function (text) {
            return _htmlencode(text);
        },

        ask : function (title, fieldnames, callback, opts, allfields, i18n, Dialogs, saveextprefs, historysize, 
                         KeyBindingManager, KeyEvent) {
            var
                PREFIX = 'toix',
                DEFSIZE = 25,
                BRACKETSTOIX_DIALOG_ID = "bracketstoix-dialog";

            var dlg, $dlg, firstfieldid, 
                groupmode = false, groupcols, groupcolindex;


            // Builds the Visual Field
            function buildField(html, field, fieldname, suffix) {
                // Creates visual field values based on prefs
                var i, inptype, hint, inpelement, id, fieldhtml;
                
                hint = (field.hint || '') + (field.history ? ' Use Ctrl+UP/DOWN to fetch the history' : '');
                fieldhtml = ' ' + (field.htmltext || ''); // must be added just be the html '>'
                inptype = 'text';
                inpelement = 'input';
                switch(field.type) {
                    case 'spacetext' :
                        hint += " use \\$ for leading and trimming spaces";
                        break;
                    case 'regex' :
                        hint += ' regular expression';
                        break;
                    case 'number' :
                        inptype = 'number';
                        break;
                    case 'boolean' :
                        inptype = 'checkbox';
                        break;
                    case 'dropdown' :
                        inpelement = 'select';
                        break;
                }
                if (field.label && !groupmode) {
                    html += '<td style="padding-right:5px">' + i18n(field.label) + ':</td>';
                }
                id = PREFIX + fieldname + suffix;
                firstfieldid = firstfieldid || id;
                html += '<td align=' + (field.align || 'left') + '>';
                html += '<' + inpelement + ' id=' + id +
                    (field.max ? ' max=' + field.max : '') +
                    ' title="' + _htmlencode(hint) + '"' +
                    ' value="' + _htmlencode(field.value) + '"' +
                    (inptype === 'text' ? ' style="width:' + (field.size || DEFSIZE) + 'em"' : '') +
                    (inptype === 'checkbox' && field.value ? ' checked' : '') +
                    (!field.canempty ? ' required' : '');

                switch(inpelement) {
                    case 'input' : 
                        html += ' type=' + inptype;
                        if (field.history) {
                            field.historyindex = -1;
                            // Brackets has no support for datalist, so this code is disactivated until there is datalist support
                            // check keyboardWorkaround for keyboard implementation
                            /*
                            html += ' list="' + id + 'list" ' + fieldhtml + '><datalist id=" ' + id + 'list">';
                            var d = document.createElement('div');
                            field.history.forEach(function(item) {
                                d.textContent = item;
                                item = d.innerHTML;
                                html += '<option value="' + item + '">';// + item + '</option>'; 
                            });
                            html += '</datalist>';
                            */ 
                            // this code is an alternative and provides data for keyboardWorkaround
                            html += ' data-history="' + fieldname + '" ' + fieldhtml + '>';
                            
                        } else {
                            html += fieldhtml + '>';
                        }    
                        break;
                        
                    case 'select' :
                        html += fieldhtml + '>';
                        field.values.forEach(function (v) {
                            html += '<option value="' + _htmlencode(v) + '">' + _htmlencode(v) + '</option>';
                        });
                        html += '</select>';
                        break;
                } 
                if (field.buttons) {
                    field.buttons.forEach(function (button, index) {
                        html += '<button class="field-button" data-info="' + id + ',' + fieldname + ',' + index + '"' + 
                            '">' + _htmlencode(button.label) + '</button>';
                    });
                }

                if (field.label && groupmode) {
                    html += '<span style="padding-right:10px; padding-left: 5px">' + i18n(field.label) + '</span>';
                }
                
                html += '</td>';
                // Subfields
                if (field.fields) {
                    Object.keys(field.fields).forEach(function (key) {
                        html = buildField(html, field.fields[key], fieldname, key);
                    });
                }
                return html;
            }


            function buildHtml() {
                var html = '<style>table.toix td { vertical-align: middle }</style>';
            
                html += '<input id=dlgtransparency title="Transparency" type=range min=20 max=100 value=100 ' +
                    'style="position:absolute;right:+10px;top:0px;border:dotted #8c8c8c 1px"><div style="margin-bottom:5px">&nbsp;</div>';
                
                if(opts && opts.msg) {
                    html += '<div style="margin-bottom:5px">' + opts.msg + '</div>';
                }

                html += '<table class=toix>';

                if(opts && opts.header) {
                    html += '<tr>';
                    opts.header.forEach(function (field) {
                        html += '<th>' + _htmlencode(field) + '</th>';
                    });
                    html += '</tr>';
                }

                fieldnames.forEach(function (prefname) {
                    var field = allfields[prefname];
                    
                    // groupmode support
                    if (!groupmode && field.groupcols) {
                        groupmode = true;
                        html += '</table><table class=toix>';  
                        groupcols = field.groupcols;
                        groupcolindex = 0;
                    }
                    // if groupmode multiple fields will have the same table row
                    html += groupmode && (groupcolindex % groupcols) ? '' : '<tr>';
                    html = buildField(html, field, prefname, '');
                    html += groupmode && (groupcolindex % groupcols !== (groupcols - 1)) ? '' : '</tr>';
                    groupcolindex++;
                });
                html += '</table>';
                return html;
            }

            
            
            // Since Brack Brackets doesn't preventDefault on enter key, nor supports datalist, 
            // I created this Brackets bug workaround. If in the future Brackets has this fixed, this code should be removed and 
            // replaced with datalists. NOTE: Also includes escape key and close dialog if ENTER on input:focus, select:focus
            // This code is based on /widgets/Dialogs
            
            function keyboardWorkaround($dlg) {
                var _keyhook = function (event) {
                    
                    function handleHistory(delta) {
                        var datahistory, history, curindex, field,
                            $focusEl = $dlg.find("input:focus");

                        if (!$focusEl.length) {
                            return false;
                        }
                        
                        datahistory = $focusEl.attr('data-history');
                        if (!datahistory) {
                            return false;
                        }                   
                        
                        field = allfields[datahistory];
                        history = field.history;
                        curindex = field.historyindex + delta;
                        if ((curindex < 0) || (curindex >= history.length)) {
                            return false;
                        }
                        field.historyindex = curindex;
                        $focusEl.val(field.history[curindex]);
                        
                        return true;    
                    }
                    
                    
                    var $primaryBtn, 
                        which = event.which;
                    
                    if (which === KeyEvent.DOM_VK_RETURN) {
                        $primaryBtn = $dlg.find(".primary");
                        if (($primaryBtn.length > 0) && ($dlg.find("input:focus, select:focus, .dialog-button:focus, a:focus").length > 0)) { 
                            event.preventDefault();
                            event.stopPropagation();
                            $primaryBtn.click();
                            return true;
                        }
                    }                


                    if (which === KeyEvent.DOM_VK_ESCAPE) { 
                        event.preventDefault();
                        event.stopPropagation();
                        dlg.close();
                        return true;
                    }

                    if ((event.ctrlKey) && (which === KeyEvent.DOM_VK_UP) || (which === KeyEvent.DOM_VK_DOWN)) { 
                        if (handleHistory(which === KeyEvent.DOM_VK_UP ? -1 : 1)) {
                            event.preventDefault();
                            event.stopPropagation();
                            return true;
                        }
                    }

                    return false;
                };
                
                $dlg.one("hidden", function () {
                    KeyBindingManager.removeGlobalKeydownHook(_keyhook);
                });
                // This code is executed after Dialog show event, so I can't use one("show", ....
                KeyBindingManager.addGlobalKeydownHook(_keyhook);
            }
            
                        
/** ------------------------------------------------------------------------
 *                               Main code
 ** ------------------------------------------------------------------------ */
            dlg = Dialogs.showModalDialog(
                BRACKETSTOIX_DIALOG_ID,
                i18n(title),
                buildHtml(), [{className: Dialogs.DIALOG_BTN_CLASS_PRIMARY, id: Dialogs.DIALOG_BTN_OK, text: 'OK'},
                       {className: Dialogs.DIALOG_BTN_CLASS_NORMAL, id: Dialogs.DIALOG_BTN_CANCEL, text: 'Cancel'}], false);
            
            $dlg = dlg.getElement();
            // By default, Brackets will focus the primary button, this code will override that action
            if (firstfieldid) {
                $dlg.find('#' + firstfieldid).focus();
            }
                        
            keyboardWorkaround($dlg);                                           
            
            // Transparency support
            
            $dlg.find("#dlgtransparency").change(function (e) {
                var qMBody = $dlg.find('.modal-body');
                var val = $(this).val() / 100; 
                _retransparency($dlg, 0);
                ['.modal-header', '.modal-body', '.modal-footer'].forEach(function(tag) {
                    _retransparency($dlg.find(tag), val);
                });
            });                
            
            // Field buttons. ex: Regnize
            
            $dlg.find(".field-button").click(function (e) {
                var qfld, fld, info, idx, id;
                info = $(this).attr('data-info').split(','); 
                id = info[0];
                fld = info[1];
                idx = info[2];
                qfld = $dlg.find('#' + id);
                qfld.val(allfields[fld].buttons[idx].f(qfld.val()));            
            });    
            
            // Cancel and OK button
            
            $dlg.one("click", ".dialog-button", function (e) {

                function storeField(field, fieldname, suffix) {
                    var msg, res, index,
                        qfld = $dlg.find('#' + PREFIX + fieldname + suffix),
                        v = field.type !== 'boolean' ? qfld.val() : qfld.get(0).checked;
                    // Check canempty
                    if (!v && !field.canempty) {
                        alert('Field ' + i18n(field.label) + ' can\'t be empty');
                        return false;
                    }
                    // run checkfunc
                    if (field.checkfunc) {
                        msg = field.checkfunc(v);
                        if (msg) {
                            alert(msg);
                            return false;
                        }
                    }

                    switch(field.type) {
                        case 'number':
                            v = parseInt(v, 10);
                            break;
                    }                    
                    field.value = v;
                    if (field.history && historysize && v) {
                        index = field.history.indexOf(v);
                        if (index > -1) {
                            field.history.splice(index, 1);    
                        }
                        field.history.splice(0, 0, v);
                        if (field.history.length > historysize) { 
                            field.history.length = historysize;
                        }
                    }
                    
                    // Store subfields
                    if (field.fields) {
                        res = true;
                        $.each(Object.keys(field.fields), function (index, key) {
                            res = storeField(field.fields[key], fieldname, key);
                            return res;
                        });
                        if (!res) {
                            return false;
                        }
                    } 
                    return true;
                }

                // THE CODE STARTS HERE 
                var isOK = $(this).attr('data-button-id') === 'ok';
                if (isOK) {
                    $.each(fieldnames, function(index, fieldname) {
                        isOK = storeField(allfields[fieldname], fieldname, '');
                        return isOK;
                    });
                }
                dlg.close();

                if (isOK) {
                    if (saveextprefs) {
                        saveextprefs();
                    }
                    // Calls callback only after closing the dialog
                    if (callback) {
                        callback();
                    }
                }
            });
        }
    };
});