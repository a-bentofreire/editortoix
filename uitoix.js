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

/*jslint vars: true, plusplus: true, devel: true, white: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, brackets, $, escape, document */

define(function() {
  "use strict";
  // ------------------------------------------------------------------------
  //                               Closure
  // ------------------------------------------------------------------------
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
      RGB.forEach(function(v, i) {
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

  function _getFieldLabel(i18n, field, fieldname, suffix) {
    return field.label || i18n('FLD_' + (field.samelabelas || fieldname) + (suffix ? '_' : '') + suffix + '_label', '');
  }

  function _getFieldHint(i18n, field, fieldname, suffix) {
    return field.hint || i18n('FLD_' + (field.samehintas || fieldname) + (suffix ? '_' : '') + '_hint', '');
  }
  // ------------------------------------------------------------------------
  //                               Exported
  // ------------------------------------------------------------------------
  return {
    htmlencode: function(text) {
      return _htmlencode(text);
    },

    ask: function(title, storeid, fieldnames, callback, opts, allfields, saveextprefs, historysize, i18n, brk) {
      var PREFIX = 'toix',
          DEFSIZE = 25,
          BRACKETSTOIX_DIALOG_ID = "bracketstoix-dialog";

      var dlg, $dlg, firstfieldid,
          groupmode = false,
          groupcols, groupcolindex,
          eventQueue = [];

      function suffixSize(value, suffix) {
        return value + (value.match(/[^\d]/) ? '' : suffix);
      }

      // ------------------------------------------------------------------------
      //                               buildFieldTag
      // ------------------------------------------------------------------------
      function buildFieldTag(field, id, fieldname, suffix) {
        var out, inptype, inpelement, hint, fieldhtml;

        hint = _getFieldHint(i18n, field, fieldname, suffix) + (field.history ? i18n("HISTORY_HINT") : '');
        fieldhtml = ' ' + (field.htmltext || ''); // must be added just be the html '>'
        inptype = 'text';
        inpelement = 'input';
        switch (field.type) {
          case 'spacetext':
            hint += i18n("SPACETEXT_HINT");
            break;
          case 'regex':
            hint += ' regular expression';
            break;
          case 'number':
            inptype = 'number';
            break;
          case 'boolean':
            inptype = 'checkbox';
            break;
          case 'list':
          case 'dropdown':
            inpelement = 'select';
            break;
        }

        out = '<' + inpelement + ' id=' + id +
          (field.rows ? ' size=' + field.rows : '') +
          (field.max ? ' max=' + field.max : '') +
          ' title="' + _htmlencode(hint) + '"' +
          ' value="' + _htmlencode(field.value) + '"' +
          (inptype === 'text' ? ' style="width:' + suffixSize((field.size || DEFSIZE) + '', 'em') + '"' : '') +
          (inptype === 'checkbox' && field.value ? ' checked' : '') +
          (!field.canempty ? ' required' : '') +
          ' ' + (field.attributes || '');

        switch (inpelement) {
          case 'input':
            out += ' type=' + inptype;
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
              out += ' data-history="' + fieldname + '" ' + fieldhtml + '>';

            } else {
              out += fieldhtml + '>';
            }
            break;

          case 'select':
            out += fieldhtml + '>';
            field.values.forEach(function(v, index) {
              out += '<option value="' + _htmlencode(v) + '"' +
                // the autofocus only works if one item is selected. Required for Recent Files command
                (!index ? " selected" : "") +
                '>' + _htmlencode(v) + '</option>';
            });
            out += '</select>';
            break;
        }
        return out;
      }
      // ------------------------------------------------------------------------
      //                               buildField
      // ------------------------------------------------------------------------
      // Builds the Visual Field
      function buildField(html, field, fieldname, suffix, templ) {
        // Creates visual field values based on prefs
        var i, inptype, hint, inpelement, id, label;

        id = PREFIX + fieldname + suffix;
        if (field.events) {
          eventQueue.push({id: id, events: field.events});
        }

        firstfieldid = firstfieldid || id;

        if (templ) {
          templ.field[id] = buildFieldTag(field, id, fieldname, suffix);

        } else {
          label = _getFieldLabel(i18n, field, fieldname, suffix);
          if (label && !groupmode) {
            html += '<td style="padding-right:5px"><label for="' + id + '">' + i18n(label) + ':</label></td>';
          }
          html += '<td align=' + (field.align || 'left') + '>';
          html += buildFieldTag(field, id, fieldname, suffix);
        }

        if (field.buttons) {
          field.buttons.forEach(function(button, index) {
            html += '<button class="field-button" data-info="' + id + ',' + fieldname + ',' + index + '">' +
              _htmlencode(_getFieldLabel(i18n, button, fieldname, suffix + button.id)) + '</button>';
          });
        }

        if (label && groupmode) {
          html += '<label for="' + id + '" style="display:inline-block; padding-right:10px; padding-left: 5px">' +
            i18n(label) + '</label>';
        }

        html += '</td>';
        // Subfields
        if (field.fields) {
          Object.keys(field.fields).forEach(function(key) {
            html = buildField(html, field.fields[key], fieldname, key, templ);
          });
        }
        return html;
      }

      // ------------------------------------------------------------------------
      //                               buildHtml
      // ------------------------------------------------------------------------
      function buildHtml() {
        var templ,
            html = '<style>table.toix { width: 100%; box-sizing: border-box; padding-right: 20px;} ' +
            ' table.toix td { vertical-align: middle }</style>';
        /*html += '<input name="frameworks" list="frameworks" type="text" /><datalist id="frameworks">	<option value="MooTools"><option value="jQuery">	<option value="YUI"></datalist>';*/ // datalist test
        html += '<input id=dlgtransparency title="Transparency" type=range min=20 max=100 value=100 ' +
          'style="position:absolute;right:+10px;top:0px;border:dotted #8c8c8c 1px"><div style="margin-bottom:5px">&nbsp;</div>';

        if (opts && opts.msg) {
          html += '<div style="margin-bottom:5px">' + opts.msg + '</div>';
        }

        if (opts /*&& opts.handler*/ && opts.dlgtemplate) {
          templ = {field: {}, html: html, str: brk.Strings, corestr: brk.CoreStrings};
        }

        html += '<table class=toix>';

        if (opts && opts.header) {
          html += '<tr>';
          opts.header.forEach(function(field) {
            html += '<th>' + _htmlencode(i18n('HDR_' + storeid + '_' + field + '_label')) + '</th>';
          });
          html += '</tr>';
        }

        fieldnames.forEach(function(prefname) {
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
          html = buildField(html, field, prefname, '', templ);
          html += groupmode && (groupcolindex % groupcols !== (groupcols - 1)) ? '' : '</tr>';
          groupcolindex++;
        });
        html += '</table>';

        return templ ? (templ.html + Mustache.render(opts.dlgtemplate, templ)) : html;
      }



      // Since Brack Brackets doesn't preventDefault on enter key, nor supports datalist,
      // I created this Brackets bug workaround. If in the future Brackets has this fixed, this code should be removed and
      // replaced with datalists. NOTE: Also includes escape key and close dialog if ENTER on input:focus, select:focus
      // This code is based on /widgets/Dialogs

      function keyboardWorkaround($dlg) {
        var _keyhook = function(event) {

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

          if (which === brk.KeyEvent.DOM_VK_RETURN) {
            $primaryBtn = $dlg.find(".primary");
            if (($primaryBtn.length > 0) && ($dlg.find("input:focus, select:focus, .dialog-button:focus, a:focus").length > 0)) {
              event.preventDefault();
              event.stopPropagation();
              $primaryBtn.click();
              return true;
            }
          }


          if (which === brk.KeyEvent.DOM_VK_ESCAPE) {
            event.preventDefault();
            event.stopPropagation();
            dlg.close();
            return true;
          }

          if ((event.ctrlKey) && ((which === brk.KeyEvent.DOM_VK_UP) || (which === brk.KeyEvent.DOM_VK_DOWN))) {
            if (handleHistory(which === brk.KeyEvent.DOM_VK_UP ? -1 : 1)) {
              event.preventDefault();
              event.stopPropagation();
              return true;
            }
          }

          return false;
        };

        $dlg.one("hidden", function() {
          brk.KeyBindingManager.removeGlobalKeydownHook(_keyhook);
        });
        // This code is executed after Dialog show event, so I can't use one("show", ....
        brk.KeyBindingManager.addGlobalKeydownHook(_keyhook);
      }

      // ------------------------------------------------------------------------
      //                               handleQueueEvents
      // ------------------------------------------------------------------------
      function handleQueueEvents($dlg) {
        eventQueue.forEach(function (item) {
          var $fld = $dlg.find('#' + item.id);

          item.events.forEach(function (event) {
            $fld.bind(event.name, function () {
              var inf = { $dlg: $dlg, name: event.name, fldid: item.id };

              inf.closedlg = function (accept) {
                $dlg.find('[data-button-id="' + (accept ? 'ok' : 'cancel') + '"]').click();
              };
              event.f(inf);
            });
          });
        });
      }
      // ------------------------------------------------------------------------
      //                               Main code
      // ------------------------------------------------------------------------
      dlg = brk.Dialogs.showModalDialog(
        BRACKETSTOIX_DIALOG_ID,
        title,
        buildHtml(), [{
          className: brk.Dialogs.DIALOG_BTN_CLASS_PRIMARY,
          id: brk.Dialogs.DIALOG_BTN_OK,
          text: brk.CoreStrings.OK
        }, {
          className: brk.Dialogs.DIALOG_BTN_CLASS_NORMAL,
          id: brk.Dialogs.DIALOG_BTN_CANCEL,
          text: brk.CoreStrings.CANCEL
        }], false);

      $dlg = dlg.getElement();
      if (opts && opts.handler) {
        opts.handler.afterBuild($dlg);
      }
      // By default, Brackets will focus the primary button, this code will override that action
      if (firstfieldid) {
        $dlg.find('#' + firstfieldid).focus();
      }

      keyboardWorkaround($dlg);
      handleQueueEvents($dlg);

      // Transparency support

      $dlg.find("#dlgtransparency").change(function(e) {
        var qMBody = $dlg.find('.modal-body'),
            val = $(this).val() / 100;

        _retransparency($dlg, 0);
        ['.modal-header', '.modal-body', '.modal-footer'].forEach(function(tag) {
          _retransparency($dlg.find(tag), val);
        });
      });

      // Field buttons. ex: Regnize

      $dlg.find(".field-button").click(function(e) {
        var qfld, fld,
            info, idx, id;

        info = $(this).attr('data-info').split(',');
        id = info[0];
        fld = info[1];
        idx = info[2];
        qfld = $dlg.find('#' + id);
        qfld.val(allfields[fld].buttons[idx].f(qfld.val()));
      });


      // Cancel and OK button

      $dlg.one("click", ".dialog-button", function(e) {

        function storeField(field, fieldname, suffix) {
          var msg, res, index,
              qfld = $dlg.find('#' + PREFIX + fieldname + suffix),
              v = field.type !== 'boolean' ? qfld.val() : qfld.get(0).checked;

          // Check canempty
          if (!v && !field.canempty) {
            // @TODO: Needs to port to the new system
            alert('Field ' + _getFieldLabel(i18n, field, fieldname, suffix) + ' can\'t be empty');
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

          switch (field.type) {
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
            $.each(Object.keys(field.fields), function(index, key) {
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
          if (opts && opts.handler && opts.handler.onSave) {
            opts.handler.onSave();
          }
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