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
/*global define, brackets, $, escape */

define(function () {
    "use strict";
/** ------------------------------------------------------------------------
 *                               Closure
 ** ------------------------------------------------------------------------ */
    function _htmlencode(text) {
        return escape(text).replace(/%(\w\w)/g, '&#x$1;');
    }
/** ------------------------------------------------------------------------
 *                               Exported
 ** ------------------------------------------------------------------------ */
    return {
        htmlencode : function (text) {
            return _htmlencode(text);
        },

        ask : function (title, fieldnames, callback, opts, allfields, i18n, Dialogs, saveextprefs) {
            var
                PREFIX = 'toix',
                DEFSIZE = 25,
                BRACKETSTOIX_DIALOG_ID = "bracketstoix-dialog";

            var dlg, qdlg, firstfieldid;


            // Builds Field
            function buildField(html, field, fieldname, suffix) {
                // Creates visual field values based on prefs
                var i, inptype, hint, inpelement, id;

                hint = field.hint || '';
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
                if (field.label) {
                    html += '<td>' + i18n(field.label) + ':</td>';
                }
                id = PREFIX + fieldname + suffix;
                firstfieldid = firstfieldid || id;
                html += '<td align=' + (field.align || 'left') + '><' + inpelement + ' id=' + id +
                    (field.max ? ' max=' + field.max : '') +
                    ' title="' + _htmlencode(hint) + '"' +
                    ' value="' + _htmlencode(field.value) + '"' +
                    (inptype === 'text' ? ' style="width:' + (field.size || DEFSIZE) + 'em"' : '') +
                    (inptype === 'checkbox' && field.value ? ' checked' : '') +
                    (!field.canempty ? ' required' : '');

                switch(inpelement) {
                    case 'input' : 
                        html += ' type=' + inptype + '>';
                        break;
                        
                    case 'select' :
                        html += '>';
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
                var html = '';

                if(opts && opts.msg) {
                    html += '<div>' + opts.msg + '</div>';
                }

                html += '<table>';

                if(opts && opts.header) {
                    html += '<tr>';
                    opts.header.forEach(function (field) {
                        html += '<th>' + _htmlencode(field) + '</th>';
                    });
                    html += '</tr>';
                }

                fieldnames.forEach(function (prefname) {
                    html = buildField(html + '<tr>', allfields[prefname], prefname, '') + '</tr>';
                });
                html += '</table>';
                return html;
            }

            dlg = Dialogs.showModalDialog(
                BRACKETSTOIX_DIALOG_ID,
                i18n(title),
                buildHtml(), [{className: Dialogs.DIALOG_BTN_CLASS_PRIMARY, id: Dialogs.DIALOG_BTN_OK, text: 'OK'},
                       {className: Dialogs.DIALOG_BTN_CLASS_NORMAL, id: Dialogs.DIALOG_BTN_CANCEL, text: 'Cancel'}], false);
            
            qdlg = dlg.getElement();
            if (firstfieldid) {
                qdlg.find('#' + firstfieldid).focus();
            }
            qdlg.keydown(function(event) {
                if (event.which === 27) { // escape
                    event.preventDefault();
                    dlg.close();
                }
            });
            qdlg.find(".field-button").click(function (e) {
                var qfld, fld, info, idx, id;
                info = $(this).attr('data-info').split(','); 
                id = info[0];
                fld = info[1];
                idx = info[2];
                qfld = qdlg.find('#' + id);
                qfld.val(allfields[fld].buttons[idx].f(qfld.val()));            
            });    
            
            qdlg.one("click", ".dialog-button", function (e) {

                function storeField(field, fieldname, suffix) {
                    var msg, res,
                        qfld = qdlg.find('#' + PREFIX + fieldname + suffix),
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