'use strict';

// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// ------------------------------------------------------------------------

import * as vscode from 'vscode';
import { window } from 'vscode';

export namespace um {

  // ------------------------------------------------------------------------
  //                               Types
  // ------------------------------------------------------------------------

  export enum TIXUtilityType {
    /// preforms inline transforms replacing pat with repl. doesn't calls ActionFunc
    utInTransform,
    /// passes intext and replaces the selection with the return text
    utTransform,
    /// calls line by line and replaces each line with the returning result
    utLineUtility,
    /// passes inlines and replaces the selection with return lines
    utLinesUtility,
    /// passes inlines but doesn't do any changes
    utImmutableLinesUtility,
    /// inserts text at the start of the selection or at cursor point if no text is selected
    utInsertAtStartUtility,
    /// inserts text at the end of the selection or at cursor point if no text is selected
    utInsertAtEndUtility,
  }

  export enum TIXSelPolicy {
    // FORCE policy must be the negative of the regular policy
    ForceAll = -1,
    All = 1,
    Word,
    Sentence,
    Line,
    None,
    __Func,
    ForceLine = -4,
  }

  export interface TIXUtilityParams {
    changes?: { location: vscode.Position | vscode.Range | vscode.Selection, value: string }[];
    userinputs: string[];
    intext?: string;
    inlines?: string[];
    selNr?: number;

    editor?: vscode.TextEditor;
    doc?: vscode.TextDocument;
    sel?: vscode.Selection;
  }

  export type TIXUtilityFunc = (up: TIXUtilityParams) => void | string | string[];

  export interface TIXUtilityDef {
    utilType: TIXUtilityType;
    sp?: TIXSelPolicy;
    pat?: string | RegExp;
    repl?: any;
  }

  export interface TIXUserInputReq {
    prompt?: string;
  }

  export interface TIXUserOptionsReq {
    placeHolder?: string;
    items?: string[];
  }

  enum TIXAddLineStage { firstLine, middleLine, lastLine }

  // ------------------------------------------------------------------------
  //                               addInputLine
  // ------------------------------------------------------------------------

  function addInputLine(up: TIXUtilityParams, text: string, stage: TIXAddLineStage): void {

    if (stage !== TIXAddLineStage.firstLine) {
      up.intext += '\n' + text;
    } else {
      up.intext = text;
    }
  }

  // ------------------------------------------------------------------------
  //                               utilityManager
  // ------------------------------------------------------------------------

  export async function utilityManagerWithUserInputs(utilDef: TIXUtilityDef,
    IXUserInputReqs: (TIXUserInputReq & TIXUserOptionsReq)[],
    utilFunc: TIXUtilityFunc) {

    if (IXUserInputReqs.length) {
      const reqCount = IXUserInputReqs.length;
      const userinputs = [];

      for (let i = 0; i < reqCount; i++) {
        const inputReq = IXUserInputReqs[i];
        const userinput = inputReq.items
          ? await window.showQuickPick(inputReq.items, { placeHolder: inputReq.placeHolder })
          : await window.showInputBox(inputReq);
        if (userinput === undefined) {
          return;
        }
        userinputs.push(userinput);
      }
      _utilityManager(utilDef, utilFunc, { userinputs });
    }
  }


  export function utilityManager(utilDef: TIXUtilityDef, utilFunc?: TIXUtilityFunc): void {
    _utilityManager(utilDef, utilFunc, { userinputs: [] });
  }

  function _utilityManager(utilDef: TIXUtilityDef, utilFunc: TIXUtilityFunc, up: TIXUtilityParams): void {

    up.changes = [];
    up.editor = vscode.window.activeTextEditor;
    up.doc = up.editor.document;
    up.selNr = 0;

    const sels = up.editor.selections;
    // WARN: assumes the VSC API will give one selection and is empty when no text is selected
    const hasNoSels = (sels.length === 1) && (sels[0].isEmpty);
    for (const sel of sels) {
      up.sel = sel;
      up.inlines = [];
      switch (utilDef.utilType) {
        case TIXUtilityType.utInsertAtStartUtility:
        case TIXUtilityType.utInsertAtEndUtility:

          let insertText = '';

          if (hasNoSels) {
            up.intext = '';
            insertText = utilFunc(up) as string;
            if (insertText) {
              up.changes.push({
                location: new vscode.Position(up.sel.start.line, up.sel.start.character),
                value: insertText,
              });
            }

          } else {
            // this code is only when there is a non-empty selection
            const lineInsMin = up.sel.start.line;
            const lineInsMax = up.sel.end.line;
            let xMin: number;
            let xMax: number;

            for (let lineI = lineInsMin; lineI <= lineInsMax; lineI++) {

              xMin = (lineI === lineInsMin) ? up.sel.start.character : 0;
              xMax = (lineI === lineInsMax) ? up.sel.end.character : up.doc.lineAt(lineI).text.length;
              const minPos = new vscode.Position(lineI, xMin);
              const maxPos = new vscode.Position(lineI, xMax);

              up.intext = up.doc.getText(new vscode.Range(minPos, maxPos)) || '';

              const insertTextStr = utilFunc(up) as string;

              if (insertTextStr) {
                up.changes.push({
                  location: utilDef.utilType === TIXUtilityType.utInsertAtStartUtility ?
                    minPos : maxPos, value: insertTextStr,
                });
              }

              up.selNr++;
            }
            // the last line can't add the selNr otherwise
            // selNr will have +2 for the next cursor selection, instead +1
            up.selNr--;
          }

          break;


        case TIXUtilityType.utImmutableLinesUtility:
        case TIXUtilityType.utLinesUtility:
        case TIXUtilityType.utLineUtility:

            const lineMin = hasNoSels ? 0 : sel.start.line;
            const lineMax = hasNoSels ? up.doc.lineCount - 1 : sel.end.line;

            for (let lineI = lineMin; lineI <= lineMax; lineI++) {
              const line = up.doc.lineAt(lineI).text;

              switch (utilDef.utilType) {
                case TIXUtilityType.utImmutableLinesUtility:
                case TIXUtilityType.utLinesUtility:
                  up.inlines.push(line);
                  break;

                case TIXUtilityType.utLineUtility:
                  up.intext = line;
                  const outLine = utilFunc(up) as string;
                  if (line !== outLine) {
                    up.changes.push({
                      location: new vscode.Range(new vscode.Position(lineI, 0),
                        new vscode.Position(lineI, line.length)), value: outLine,
                    });
                  }
                  break;
              }
            }
            // run after all the selected lines
            if (utilDef.utilType === TIXUtilityType.utImmutableLinesUtility) {
              utilFunc(up);

            } else if (utilDef.utilType === TIXUtilityType.utLinesUtility) {
              const outLines = utilFunc(up) as string[];
              const outRg = new vscode.Range(new vscode.Position(lineMin, 0),
                new vscode.Position(lineMax, up.doc.lineAt(lineMax).text.length));
              up.changes.push({ location: outRg, value: outLines.join('\n') });
          }

          break;



        case TIXUtilityType.utInTransform:
        case TIXUtilityType.utTransform:

          let outSel: vscode.Range | vscode.Selection;

          // when there is no selection it processes the whole code
          if (hasNoSels) {
            up.intext = up.doc.getText();

            outSel = new vscode.Range(new vscode.Position(0, 0),
              new vscode.Position(up.doc.lineCount, 0));

            // processes when there is one or more selections
          } else {
            outSel = up.sel;
            if (sel.isEmpty) {
              // transformations only happen if there is selected text
              // in case of multiple selections some might be empty
              break;
            }
            // processes the first line of a selection
            addInputLine(up, up.doc.lineAt(sel.start.line).text.substring(sel.start.character),
              TIXAddLineStage.firstLine);

            // processes the middle lines of a selection
            if (sel.start.line !== sel.end.line) {
              for (let i = sel.start.line + 1; i < sel.end.line; i++) {
                addInputLine(up, up.doc.lineAt(i).text,
                  TIXAddLineStage.middleLine);
              }

              // processes the last line of a selection
              addInputLine(up, up.doc.lineAt(sel.end.line).text.substring(0, sel.end.character),
                TIXAddLineStage.lastLine);
            } else {
              // processes a single line selection
              addInputLine(up, up.intext.substring(0, sel.end.character - sel.start.character),
                TIXAddLineStage.firstLine);
            }
          }

          // calls the utilities function transforming up.intext into outSelText
          let outSelText: string;
          if (utilDef.utilType === TIXUtilityType.utInTransform) {
            outSelText = up.intext.replace(utilDef.pat, utilDef.repl);
          } else { outSelText = utilFunc(up) as string; }

          if (up.intext !== outSelText) {
            up.changes.push({ location: outSel, value: outSelText });
          }

          break;

      }
      up.selNr++;
    }

    // executed after all the selections or the full text is processed
    if (up.changes.length) {
      up.editor.edit((edit) => {
        for (const change of up.changes) {
          edit.replace(change.location, change.value);
        }
      });

    }
  }

  // ------------------------------------------------------------------------
  //                               getConfig
  // ------------------------------------------------------------------------

  export function getConfig(itemName: string) {
    const vscConfig = vscode.workspace.getConfiguration("vsctoix");
    return vscConfig.get(itemName);
  }
}

declare const module;
module.exports = { um };
