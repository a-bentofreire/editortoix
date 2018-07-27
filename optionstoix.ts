'use strict';
// uuid: f6c0f838-6bd3-4f79-a5a9-301a48684af7

// --------------------------------------------------------------------
// Copyright (c) 2016-2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// --------------------------------------------------------------------

define(() => {
  let $dlg;
  let $curCat;
  let $curTab;
  let curTabName;
  let usableCmds;
  let usableTools;
  const storeIdMap = {};
  let projSettings;
  const projCompilersFlds = ['js6', 'scss', 'js'];
  const projSetsFlds = ['spaceUnits'].concat(projCompilersFlds);
  let prefs;
  let ix;
  let tools;
  const bs = {}; // beforesave
  const as = {}; // aftersave
  const ts = {} as any; // beforesave

  const buildOptionHtml = (val, text) => '<option value="' + val + '">' + tools.htmlEscape(text) + '</option>';

  function _fillEventSaveTargetExts(rec): void {
    let html = '';
    rec.value.forEach((st, index) => {
      html += buildOptionHtml(index, st.exts);
    });
    rec.$targetexts.html(html);
  }

  function _fillEventSaveTargetCmds(rec): void {
    let html = '';
    if (rec.curextidx >= 0) {
      rec.value[rec.curextidx].cmds.forEach((storeid) => {
        html += buildOptionHtml(storeid, storeIdMap[storeid].label);
      });
    }
    rec.$targetcmds.html(html);
  }

  function _fillTools(): void {
    let html = '';
    ts.value.forEach((tool, index) => {
      html += buildOptionHtml(index, tool.name);
    });
    ts.$toollist.html(html);
  }

  function _listOp(delta, index, array, fillfunc, $list, rec?): void {
    let svitem;
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

  function _eventSaveTargetCmdsListOp(delta: number, rec): void {
    if (rec.curextidx >= 0) {
      _listOp(delta, rec.curcmdidx, rec.value[rec.curextidx].cmds,
        _fillEventSaveTargetCmds, rec.$targetcmds, rec);
    }
  }

  function _toolsListOp(delta: number): void {
    _listOp(delta, ts.curidx, ts.value, _fillTools, ts.$toollist);
  }

  function toolUItoValue() {
    const name = ts.$toolname.val().trim();
    const cmdline = ts.$toolcmdline.val().trim();
    const idx = ts.value.length;
    const showonmenu = ts.$toolshowonmenu.get(0).checked;
    const showoutput = ts.$toolshowoutput.get(0).checked;

    if (name && cmdline) {
      return { idx, tool: { name, cmdline, showonmenu, showoutput } };
    } else {
      return null;
    }
  }

  function toolValtoUI(tool): void {
    ts.$toolname.val(tool ? tool.name : '');
    ts.$toolcmdline.val(tool ? tool.cmdline : '');
    ts.$toolshowonmenu.get(0).checked = tool.showonmenu;
    ts.$toolshowoutput.get(0).checked = tool.showoutput;
  }

  function _buildEventSave(rec, htmlprefix, fillHandler, usableList): void {
    let html = '';
    rec.$exts = $dlg.find(htmlprefix + 'saveexts');
    rec.$targetexts = $dlg.find(htmlprefix + 'savetargetexts');
    rec.$cmds = $dlg.find(htmlprefix + 'savecmds');
    rec.$targetcmds = $dlg.find(htmlprefix + 'savetargetcmds');
    rec.curextidx = -1;
    rec.curcmdidx = -1;

    fillHandler(rec);
    usableList.forEach((cmd) => {
      html += buildOptionHtml(cmd.storeid, cmd.label);
    });
    rec.$cmds.html(html);

    $(htmlprefix + 'saveextadd').click(() => {
      const exts = rec.$exts.val().trim();
      const idx = rec.value.length;

      if (exts.length) {
        rec.value.push({ exts, cmds: [] });
        rec.$targetexts.append(buildOptionHtml(idx, exts));
      }
    });

    $(htmlprefix + 'saveextremove').click(() => {
      _listOp(0, rec.curextidx, rec.value, fillHandler, rec.$targetexts, rec);
    });

    $(htmlprefix + 'saveextup').click(() => {
      _listOp(-1, rec.curextidx, rec.value, fillHandler, rec.$targetexts, rec);
    });

    $(htmlprefix + 'saveextdown').click(() => {
      _listOp(1, rec.curextidx, rec.value, fillHandler, rec.$targetexts, rec);
    });

    $(htmlprefix + 'saveextupdate').click(() => {
      const exts = rec.$exts.val().trim();
      if (exts.length && rec.curextidx >= 0) {
        rec.value[rec.curextidx].exts = exts;
        rec.$targetexts[0][rec.curextidx].label = exts;
      }
    });


    $(htmlprefix + 'savecmdadd').click(() => {
      const storeid = rec.$cmds.val();
      if (rec.curextidx < 0) {
        return;
      }
      rec.value[rec.curextidx].cmds.push(storeid);
      rec.$targetcmds.append(buildOptionHtml(storeid, storeIdMap[storeid].label));
    });

    $(htmlprefix + 'savecmdremove').click(() => {
      _eventSaveTargetCmdsListOp(0, rec);
    });

    $(htmlprefix + 'savecmdup').click(() => {
      _eventSaveTargetCmdsListOp(-1, rec);
    });

    $(htmlprefix + 'savecmddown').click(() => {
      _eventSaveTargetCmdsListOp(1, rec);
    });

    rec.$targetexts.click(() => {
      rec.curextidx = rec.$targetexts[0].selectedIndex >> 0;
      _fillEventSaveTargetCmds(rec);
      rec.curcmdidx = -1;
      if (rec.curextidx >= 0) {
        rec.$exts.val(rec.value[rec.curextidx].exts);
      } else {
        rec.$exts.val('');
      }
    });

    rec.$targetcmds.click(() => {
      rec.curcmdidx = rec.$targetcmds[0].selectedIndex >> 0;
    });

    if (rec.value.length) {
      rec.$targetexts[0].selectedIndex = 0;
      rec.$targetexts.click();
    }
  }

  return {
    dlgtemplate: 'options.html',

    // ------------------------------------------------------------------------
    //                               prepare
    // ------------------------------------------------------------------------

    prepare: (aprefs, cmdlist, aix, atools, aprojSettings): void => {

      function eventPrepare(prefvar, rec) {
        rec.value = [];
        prefvar.value.forEach((st, index) => {
          rec.value.push({ exts: st.exts.join(';'), cmds: st.cmds });
        });
      }

      prefs = aprefs;
      tools = atools;
      projSettings = aprojSettings;
      eventPrepare(prefs.beforesave, bs);
      eventPrepare(prefs.aftersave, as);

      if (!usableCmds) {
        usableCmds = [];
        cmdlist.forEach((cmd) => {
          if (cmd.canonsave) {
            usableCmds.push(cmd);
            storeIdMap[cmd.storeid] = cmd;
          }
        });
      }
      usableTools = [];
      prefs.tools.value.forEach((tool) => {
        const tag = tool.name;
        const cmd = { storeid: '@' + tag, label: tag };
        usableTools.push(cmd);
        storeIdMap['@' + tag] = cmd;
      });

      ts.value = [];
      prefs.tools.value.forEach((tool) => {
        ts.value.push(tool);
      });

      ix = aix;
    },

    // ------------------------------------------------------------------------
    //                               ProjSettings
    // ------------------------------------------------------------------------

    _buildProjSettings: () => {
      projSetsFlds.forEach((field): void => {
        if (projSettings.data[field]) {
          ($('#proj' + field).get(0) as HTMLInputElement).checked = true;
        }
      });
    },

    setPrefsFromProject: (aPrefs, aProjSettings): void => {
      projCompilersFlds.forEach((field) => {
        if (aProjSettings.data[field]) {
          aPrefs[field].value = aProjSettings.data[field];
        }
      });
    },

    _saveProjSettings: (dlgopts): void => {
      const projSetsData = projSettings.data;
      const isPrevNotEmpty = Object.keys(projSetsData).length;

      projSetsFlds.forEach((field) => {
        const isSpaceUnits = field === 'spaceUnits';
        if (($('#proj' + field).get(0) as HTMLInputElement).checked) {
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

    afterBuild: (self: any, $adlg: JQuery): void => {
      $dlg = $adlg;
      $curCat = null;
      $curTab = null;
      curTabName = '';

      $dlg.find('#toixcats li').click((ev: Event) => {
        const $newcat = $(ev.target);
        if ($curCat) {
          if ($newcat.get(0).id === curTabName) {
            return;
          }
          $curCat.removeClass('toixselcat');
          $curTab.removeClass('toixseltab');
        }

        $curCat = $newcat;
        curTabName = $newcat.get(0).id;
        $curTab = $dlg.find('#toix' + curTabName);

        $curCat.addClass('toixselcat');
        $curTab.addClass('toixseltab');
      });

      $dlg.find('#general').click();
      _buildEventSave(bs, '#before', _fillEventSaveTargetExts, usableCmds);
      _buildEventSave(as, '#after', _fillEventSaveTargetExts, usableTools);
      self._buildTools();
      self._buildProjSettings();
    },

    // ------------------------------------------------------------------------
    //                               Tools
    // ------------------------------------------------------------------------

    _buildTools: (): void => {
      let html = '';
      ts.$toollist = $dlg.find('#toollist');
      ts.$toolname = $dlg.find('#toolname');
      ts.$toolcmdline = $dlg.find('#toolcmdline');
      ts.$toolshowonmenu = $dlg.find('#toolshowonmenu');
      ts.$toolshowoutput = $dlg.find('#toolshowoutput');

      ts.$pdtools = $dlg.find('#pdtools');
      ts.curidx = -1;
      _fillTools();

      $('#toolsadd').click(() => {
        const val = toolUItoValue();
        if (val) {
          ts.value.push(val.tool);
          ts.$toollist.append(buildOptionHtml(val.idx, val.tool.name));
        }
      });

      $("#toolsupdate").click(() => {
        const val = toolUItoValue();
        if (val && ts.curidx >= 0) {
          ts.value[ts.curidx] = val.tool;
          ts.$toollist[0][ts.curidx].label = val.tool.name;
        }
      });
      $("#toolsremove").click(() => {
        _toolsListOp(0);
      });

      $("#toolsup").click(() => {
        _toolsListOp(-1);
      });

      $("#toolsdown").click(() => {
        _toolsListOp(1);
      });

      ts.$toollist.click(() => {
        ts.curidx = ts.$toollist[0].selectedIndex >> 0;
        toolValtoUI(ts.curidx >= 0 ? ts.value[ts.curidx] : null);
      });

      if (ts.value.length) {
        ts.$toollist[0].selectedIndex = 0;
        ts.$toollist.click();
      }

      html = '';
      ix.pdtools.forEach((tool, index) => {
        html += buildOptionHtml(index, tool.name);
      });
      ts.$pdtools.html(html);

      $("#pdtoolsadd").click(() => {
        const idx = ts.$pdtools[0].selectedIndex >> 0;
        toolValtoUI(ix.pdtools[idx]);
        $("#toolsadd").click();
      });

    },
    // ------------------------------------------------------------------------
    //                               On Save
    // ------------------------------------------------------------------------

    onSave(self: any, dlgopts): void {
      function eventSave(prefvar, rec) {
        prefvar.value = rec.value.map((st, index) => ({ exts: st.exts.split(/;/), cmds: st.cmds }));
      }
      eventSave(prefs.beforesave, bs);
      eventSave(prefs.aftersave, as);

      prefs.tools.value = ts.value.map(tool => tool);

      self._saveProjSettings(dlgopts);
    },
  };
});
