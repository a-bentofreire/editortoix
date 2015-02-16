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
  var $dlg,
      $curcat,
      $curtab,
      curtabname,
      usablecmds,
      storeidmap = {},
      prefs,
      bs = {}; // beforesave

  function _fillBeforeSaveTargetExts() {
    var html = '';
    bs.value.forEach(function (st, index) {
      html += '<option value="' + index + '">' + st.exts + '</option>';
    });
    bs.$targetexts.html(html);
  }


  function _fillBeforeSaveTargetCmds() {
    var html = '';
    if (bs.curextidx >= 0) {
      bs.value[bs.curextidx].cmds.forEach(function(storeid) {
        html += '<option value="' + storeid + '">' + storeidmap[storeid].label + '</option>';
      });
    }
    bs.$targetcmds.html(html);
  }

  function _listOp(delta, index, array, fillfunc, $list) {
    var svitem;
    if ((index + delta) >= 0 && (index + delta) < array.length) {
      svitem = array[index];
      array.splice(index, 1);
      if (delta) {
        array.splice(index + delta, 0, svitem);
      }
      fillfunc();
      if (delta) {
        $list[0].selectedIndex = index + delta;
      }
      $list.click();
      $list.focus();
    }
  }

  function _BeforeSaveTargetCmdsListOp(delta) {
    if (bs.curextidx >= 0) {
      _listOp(delta, bs.curcmdidx, bs.value[bs.curextidx].cmds, _fillBeforeSaveTargetCmds, bs.$targetcmds);
    }
  }


  return {
    dlgtemplate: 'options.html',
    // ------------------------------------------------------------------------
    //                               prepare
    // ------------------------------------------------------------------------
    prepare: function (aprefs, cmdlist) {
      prefs = aprefs;
      bs.value = [];
      prefs.beforesave.value.forEach(function (st, index) {
        bs.value.push({exts: st.exts.join(';'), cmds: st.cmds});
      });
      if (!usablecmds) {
        usablecmds = [];
        cmdlist.forEach(function (cmd) {
          if (cmd.canonsave) {
            usablecmds.push(cmd);
            storeidmap[cmd.storeid] = cmd;
          }
        });
      }
    },
    // ------------------------------------------------------------------------
    //                               buildBeforeSave
    // ------------------------------------------------------------------------
    buildBeforeSave: function () {
      var html = '';
      bs.$exts = $dlg.find('#beforesaveexts');
      bs.$targetexts = $dlg.find('#beforesavetargetexts');
      bs.$cmds = $dlg.find('#beforesavecmds');
      bs.$targetcmds = $dlg.find('#beforesavetargetcmds');
      bs.curextidx = -1;
      bs.curcmdidx = -1;

      _fillBeforeSaveTargetExts();
      usablecmds.forEach(function(cmd) {
        html += '<option value="' + cmd.storeid + '">' + cmd.label + '</option>';
      });
      bs.$cmds.html(html);


      $("#beforesaveextadd").click(function () {
        var exts = bs.$exts.val().trim(),
            idx = bs.value.length;

        if(exts.length) {
          bs.value.push({exts: exts, cmds: []});
          bs.$targetexts.append('<option value=' + idx + '>' + exts + '</option>');
        }
      });

      $("#beforesaveextremove").click(function () {
        _listOp(0, bs.curextidx, bs.value, _fillBeforeSaveTargetExts, bs.$targetexts);
      });

      $("#beforesaveextup").click(function () {
        _listOp(-1, bs.curextidx, bs.value, _fillBeforeSaveTargetExts, bs.$targetexts);
      });

      $("#beforesaveextdown").click(function () {
        _listOp(1, bs.curextidx, bs.value, _fillBeforeSaveTargetExts, bs.$targetexts);
      });

      $("#beforesaveextupdate").click(function () {
        var exts = bs.$exts.val().trim();
        if (exts.length && bs.curextidx >= 0) {
          bs.value[bs.curextidx].exts = exts;
          bs.$targetexts[0][bs.curextidx].label = exts;
        }
      });


      $("#beforesavecmdadd").click(function () {
        var storeid = bs.$cmds.val();
        if (bs.curextidx < 0) {
          return;
        }
        bs.value[bs.curextidx].cmds.push(storeid);
        bs.$targetcmds.append('<option value=' + storeid+ '>' + storeidmap[storeid].label + '</option>');
      });

      $("#beforesavecmdremove").click(function () {
        _BeforeSaveTargetCmdsListOp(0);
      });

      $("#beforesavecmdup").click(function () {
        _BeforeSaveTargetCmdsListOp(-1);
      });

      $("#beforesavecmddown").click(function () {
        _BeforeSaveTargetCmdsListOp(1);
      });

      bs.$targetexts.click(function () {
        bs.curextidx = bs.$targetexts[0].selectedIndex >> 0;
        _fillBeforeSaveTargetCmds();
        bs.curcmdidx = -1;
        if (bs.curextidx >= 0) {
          bs.$exts.val(bs.value[bs.curextidx].exts);
        } else {
          bs.$exts.val('');
        }
      });

      bs.$targetcmds.click(function () {
        var html = '';
        bs.curcmdidx = bs.$targetcmds[0].selectedIndex >> 0;
      });

      if(bs.value.length) {
        bs.$targetexts[0].selectedIndex = 0;
        bs.$targetexts.click();
      }

    },
    // ------------------------------------------------------------------------
    //                               afterBuild
    // ------------------------------------------------------------------------
    afterBuild: function ($adlg) {
      $dlg = $adlg;
      $curcat = null;
      $curtab = null;
      curtabname = '';

      $dlg.find('#toixcats li').click(function(e) {
        var $newcat = $(this);
        if ($curcat) {
          if ($newcat.get(0).id === curtabname) {
            return;
          }
          $curcat.removeClass('toixselcat');
          $curtab.removeClass('toixseltab');
        }

        $curcat = $newcat;
        curtabname = $newcat.get(0).id;
        $curtab = $dlg.find('#toix' + curtabname);

        $curcat.addClass('toixselcat');
        $curtab.addClass('toixseltab');
      });

      $dlg.find('#general').click();
      this.buildBeforeSave();
    },
    // ------------------------------------------------------------------------
    //                               afterBuild
    // ------------------------------------------------------------------------
    onSave: function () {
      prefs.beforesave.value = [];
      bs.value.forEach(function (st, index) {
        prefs.beforesave.value.push({exts: st.exts.split(/;/), cmds: st.cmds});
      });

    }
  };
});