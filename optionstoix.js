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

/*jslint vars: true, plusplus: true, devel: true, white: true, nomen: true, bitwise: true, indent: 4, maxerr: 50 */
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
      ix,
      tools,
      bs = {},
      ts = {}; // beforesave


  function buildOptionHtml(val, text) {
    return '<option value="' + val + '">' + tools.htmlEscape(text) + '</option>';
  }

  function _fillBeforeSaveTargetExts() {
    var html = '';
    bs.value.forEach(function (st, index) {
      html += buildOptionHtml(index, st.exts);
    });
    bs.$targetexts.html(html);
  }


  function _fillBeforeSaveTargetCmds() {
    var html = '';
    if (bs.curextidx >= 0) {
      bs.value[bs.curextidx].cmds.forEach(function(storeid) {
        html += buildOptionHtml(storeid, storeidmap[storeid].label);
      });
    }
    bs.$targetcmds.html(html);
  }

  function _fillTools() {
    var html = '';
    ts.value.forEach(function(tool, index) {
      html += buildOptionHtml(index, tool.name);
    });
    ts.$toollist.html(html);
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

  function _beforeSaveTargetCmdsListOp(delta) {
    if (bs.curextidx >= 0) {
      _listOp(delta, bs.curcmdidx, bs.value[bs.curextidx].cmds, _fillBeforeSaveTargetCmds, bs.$targetcmds);
    }
  }

  function _toolsListOp(delta) {
    _listOp(delta, ts.curidx, ts.value, _fillTools, ts.$toollist);
  } 

  function toolUItoValue() {
    var name = ts.$toolname.val().trim(),
        cmdline = ts.$toolcmdline.val().trim(),
        idx = ts.value.length,
        showonmenu = ts.$toolshowonmenu.get(0).checked,
        showoutput = ts.$toolshowoutput.get(0).checked;

    if(name && cmdline) {
      return {idx: idx, tool: {name: name, cmdline: cmdline, showonmenu: showonmenu, showoutput: showoutput}};
    } else {
      return null;
    }
  }

  function toolValtoUI(tool) {
    ts.$toolname.val(tool ? tool.name : '');
    ts.$toolcmdline.val(tool ? tool.cmdline : '');
    ts.$toolshowonmenu.get(0).checked = tool.showonmenu;
    ts.$toolshowoutput.get(0).checked = tool.showoutput;
  }

  return {
    dlgtemplate: 'options.html',
    // ------------------------------------------------------------------------
    //                               prepare
    // ------------------------------------------------------------------------
    prepare: function (aprefs, cmdlist, aix, atools) {
      var html;
      prefs = aprefs;
      tools = atools;
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

      ts.value = [];
      prefs.tools.value.forEach(function (tool) {
        ts.value.push(tool);
      });

      ix = aix;
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
        html += buildOptionHtml(cmd.storeid, cmd.label);
      });
      bs.$cmds.html(html);


      $("#beforesaveextadd").click(function () {
        var exts = bs.$exts.val().trim(),
            idx = bs.value.length;

        if(exts.length) {
          bs.value.push({exts: exts, cmds: []});
          bs.$targetexts.append(buildOptionHtml(idx, exts));
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
        bs.$targetcmds.append(buildOptionHtml(storeid, storeidmap[storeid].label));
      });

      $("#beforesavecmdremove").click(function () {
        _beforeSaveTargetCmdsListOp(0);
      });

      $("#beforesavecmdup").click(function () {
        _beforeSaveTargetCmdsListOp(-1);
      });

      $("#beforesavecmddown").click(function () {
        _beforeSaveTargetCmdsListOp(1);
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
      this.buildTools();
    },

    // ------------------------------------------------------------------------
    //                               buildtools
    // ------------------------------------------------------------------------
    buildTools: function () {
      var html = '';
      ts.$toollist = $dlg.find('#toollist');
      ts.$toolname = $dlg.find('#toolname');
      ts.$toolcmdline = $dlg.find('#toolcmdline');
      ts.$toolshowonmenu = $dlg.find('#toolshowonmenu');
      ts.$toolshowoutput = $dlg.find('#toolshowoutput');

      ts.$pdtools = $dlg.find('#pdtools');
      ts.curidx = -1;
      _fillTools();

      $("#toolsadd").click(function () {
        var val = toolUItoValue();
        if(val) {
          ts.value.push(val.tool);
          ts.$toollist.append(buildOptionHtml(val.idx, val.tool.name));
        }
      });

      $("#toolsupdate").click(function () {
        var val = toolUItoValue();
        if (val && ts.curidx >= 0) {
          ts.value[ts.curidx] = val.tool;
          ts.$toollist[0][ts.curidx].label = val.tool.name;
        }
      });
      $("#toolsremove").click(function () {
        _toolsListOp(0);
      });

      $("#toolsup").click(function () {
        _toolsListOp(-1);
      });

      $("#toolsdown").click(function () {
        _toolsListOp(1);
      });

      ts.$toollist.click(function () {
        var tool;
        ts.curidx = ts.$toollist[0].selectedIndex >> 0;
        toolValtoUI(ts.curidx >= 0 ? ts.value[ts.curidx] : null);
      });

      if(ts.value.length) {
        ts.$toollist[0].selectedIndex = 0;
        ts.$toollist.click();
      }

      html = '';
      ix.pdtools.forEach(function(tool, index) {
        html += buildOptionHtml(index, tool.name);
      });
      ts.$pdtools.html(html);

      $("#pdtoolsadd").click(function () {
        var idx = ts.$pdtools[0].selectedIndex >> 0;
        toolValtoUI(ix.pdtools[idx]);
        $("#toolsadd").click();
      });

    },
    // ------------------------------------------------------------------------
    //                               afterBuild
    // ------------------------------------------------------------------------
    onSave: function () {
      prefs.beforesave.value = [];
      bs.value.forEach(function (st, index) {
        prefs.beforesave.value.push({exts: st.exts.split(/;/), cmds: st.cmds});
      });

      prefs.tools.value = [];
      ts.value.forEach(function (tool, index) {
        prefs.tools.value.push(tool);
      });
    }
  };
});