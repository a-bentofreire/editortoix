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
      usabletools,
      storeidmap = {},
      projSettings,
      projCompilersFlds = ['js6', 'scss', 'js'],
      projSetsFlds = ['spaceUnits'].concat(projCompilersFlds),
      prefs,
      ix,
      tools,
      bs = {}, // beforesave
      as = {}, // aftersave
      ts = {}; // beforesave


  function buildOptionHtml(val, text) {
    return '<option value="' + val + '">' + tools.htmlEscape(text) + '</option>';
  }

  function _fillEventSaveTargetExts(rec) {
    var html = '';
    rec.value.forEach(function (st, index) {
      html += buildOptionHtml(index, st.exts);
    });
    rec.$targetexts.html(html);
  }


  function _fillEventSaveTargetCmds(rec) {
    var html = '';
    if (rec.curextidx >= 0) {
      rec.value[rec.curextidx].cmds.forEach(function(storeid) {
        html += buildOptionHtml(storeid, storeidmap[storeid].label);
      });
    }
    rec.$targetcmds.html(html);
  }

  function _fillTools() {
    var html = '';
    ts.value.forEach(function(tool, index) {
      html += buildOptionHtml(index, tool.name);
    });
    ts.$toollist.html(html);
  }


  function _listOp(delta, index, array, fillfunc, $list, rec) {
    var svitem;
    if ((index + delta) >= 0 && (index + delta) < array.length) {
      svitem = array[index];
      array.splice(index, 1);
      if (delta) {
        array.splice(index + delta, 0, svitem);
      }
      fillfunc(rec);
      if (delta) {
        $list[0].selectedIndex = index + delta;
      }
      $list.click();
      $list.focus();
    }
  }

  function _eventSaveTargetCmdsListOp(delta, rec) {
    if (rec.curextidx >= 0) {
      _listOp(delta, rec.curcmdidx, rec.value[rec.curextidx].cmds, _fillEventSaveTargetCmds, rec.$targetcmds, rec);
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


  function _buildEventSave(rec, htmlprefix, fillHandler, usablelist) {
    var html = '';
    rec.$exts = $dlg.find(htmlprefix + 'saveexts');
    rec.$targetexts = $dlg.find(htmlprefix + 'savetargetexts');
    rec.$cmds = $dlg.find(htmlprefix + 'savecmds');
    rec.$targetcmds = $dlg.find(htmlprefix + 'savetargetcmds');
    rec.curextidx = -1;
    rec.curcmdidx = -1;

    fillHandler(rec);
    usablelist.forEach(function(cmd) {
      html += buildOptionHtml(cmd.storeid, cmd.label);
    });
    rec.$cmds.html(html);


    $(htmlprefix + "saveextadd").click(function () {
      var exts = rec.$exts.val().trim(),
          idx = rec.value.length;

      if(exts.length) {
        rec.value.push({exts: exts, cmds: []});
        rec.$targetexts.append(buildOptionHtml(idx, exts));
      }
    });

    $(htmlprefix + "saveextremove").click(function () {
      _listOp(0, rec.curextidx, rec.value, fillHandler, rec.$targetexts, rec);
    });

    $(htmlprefix + "saveextup").click(function () {
      _listOp(-1, rec.curextidx, rec.value, fillHandler, rec.$targetexts, rec);
    });

    $(htmlprefix + "saveextdown").click(function () {
      _listOp(1, rec.curextidx, rec.value, fillHandler, rec.$targetexts, rec);
    });

    $(htmlprefix + "saveextupdate").click(function () {
      var exts = rec.$exts.val().trim();
      if (exts.length && rec.curextidx >= 0) {
        rec.value[rec.curextidx].exts = exts;
        rec.$targetexts[0][rec.curextidx].label = exts;
      }
    });


    $(htmlprefix + "savecmdadd").click(function () {
      var storeid = rec.$cmds.val();
      if (rec.curextidx < 0) {
        return;
      }
      rec.value[rec.curextidx].cmds.push(storeid);
      rec.$targetcmds.append(buildOptionHtml(storeid, storeidmap[storeid].label));
    });

    $(htmlprefix + "savecmdremove").click(function () {
      _eventSaveTargetCmdsListOp(0, rec);
    });

    $(htmlprefix + "savecmdup").click(function () {
      _eventSaveTargetCmdsListOp(-1, rec);
    });

    $(htmlprefix + "savecmddown").click(function () {
      _eventSaveTargetCmdsListOp(1, rec);
    });

    rec.$targetexts.click(function () {
      rec.curextidx = rec.$targetexts[0].selectedIndex >> 0;
      _fillEventSaveTargetCmds(rec);
      rec.curcmdidx = -1;
      if (rec.curextidx >= 0) {
        rec.$exts.val(rec.value[rec.curextidx].exts);
      } else {
        rec.$exts.val('');
      }
    });

    rec.$targetcmds.click(function () {
      var html = '';
      rec.curcmdidx = rec.$targetcmds[0].selectedIndex >> 0;
    });

    if(rec.value.length) {
      rec.$targetexts[0].selectedIndex = 0;
      rec.$targetexts.click();
    }
  }

  return {
    dlgtemplate: 'options.html',
    // ------------------------------------------------------------------------
    //                               prepare
    // ------------------------------------------------------------------------
    prepare: function (aprefs, cmdlist, aix, atools, aprojSettings) {
      function eventPrepare(prefvar, rec) {
        rec.value = [];
        prefvar.value.forEach(function (st, index) {
          rec.value.push({exts: st.exts.join(';'), cmds: st.cmds});
        });
      }

      var html;
      prefs = aprefs;
      tools = atools;
      projSettings = aprojSettings;
      eventPrepare(prefs.beforesave, bs);
      eventPrepare(prefs.aftersave, as);

      if (!usablecmds) {
        usablecmds = [];
        cmdlist.forEach(function (cmd) {
          if (cmd.canonsave) {
            usablecmds.push(cmd);
            storeidmap[cmd.storeid] = cmd;
          }
        });
      }
      usabletools = [];
      prefs.tools.value.forEach(function (tool) {
        var tag = tool.name,
            cmd = {storeid: '@' + tag, label: tag};
        usabletools.push(cmd);
        storeidmap['@' + tag] = cmd;
      });

      ts.value = [];
      prefs.tools.value.forEach(function (tool) {
        ts.value.push(tool);
      });

      ix = aix;
    },
    // ------------------------------------------------------------------------
    //                               ProjSettings
    // ------------------------------------------------------------------------
    _buildProjSettings: function () {
      projSetsFlds.forEach(function (field) {
        if (projSettings.data[field]) {
          $("#proj" + field).get(0).checked = true;
        }
      });
    },

    setPrefsFromProject: function (aPrefs, aProjSettings) {
      projCompilersFlds.forEach(function (field) {
        if (aProjSettings.data[field]) {
          aPrefs[field].value = aProjSettings.data[field];
        }
      });
    },

    _saveProjSettings: function (dlgopts) {
      var projSetsData = projSettings.data,
          isPrevNotEmpty = Object.keys(projSetsData).length;

      projSetsFlds.forEach(function (field) {
        var isSpaceUnits = field === 'spaceUnits';
        if ($("#proj" + field).get(0).checked) {
          if (isSpaceUnits) {
            dlgopts.setSpaceUnits(projSetsData, true);
          } else {
            projSetsData[field] = prefs[field].value;
          }
        } else {
          delete projSetsData[field];
          if (isSpaceUnits) {
            dlgopts.setSpaceUnits(projSetsData, false);
          }
        }
      });

      // Save settings
      if (isPrevNotEmpty || Object.keys(projSetsData).length) {
        dlgopts.saveProjSettings(projSetsData);
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
      _buildEventSave(bs, '#before', _fillEventSaveTargetExts, usablecmds);
      _buildEventSave(as, '#after', _fillEventSaveTargetExts, usabletools);
      this._buildTools();
      this._buildProjSettings();
    },

    // ------------------------------------------------------------------------
    //                               Tools
    // ------------------------------------------------------------------------
    _buildTools: function () {
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
    //                               On Save
    // ------------------------------------------------------------------------
    onSave: function (dlgopts) {
      function eventSave(prefvar, rec) {
        prefvar.value = [];
        rec.value.forEach(function (st, index) {
          prefvar.value.push({exts: st.exts.split(/;/), cmds: st.cmds});
        });
      }
      eventSave(prefs.beforesave, bs);
      eventSave(prefs.aftersave, as);

      prefs.tools.value = [];
      ts.value.forEach(function (tool, index) {
        prefs.tools.value.push(tool);
      });
      this._saveProjSettings(dlgopts);
    }
  };
});