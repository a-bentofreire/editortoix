'use strict';
// uuid: 0b81be9e-516b-4ac3-966d-fbe8ffd7b629

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

declare var atom;

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

  interface UtilityManagerParams {
    utilType: TIXUtilityType;
    sp?: TIXSelPolicy;
    pat?;
    repl?;
  }

  export function utilityManager(params: UtilityManagerParams,
    func?, up?): void {

    up = up || {};
    const editor = atom.workspace.getActiveTextEditor();
    if (editor) {
      const selection = editor.getSelectedText();
      let outSelection;

      switch (params.utilType) {
        case TIXUtilityType.utInTransform:
          if (selection) {
            outSelection = selection.replace(params.pat, params.repl);
            if (selection !== outSelection) {
              editor.insertText(outSelection);
            }
          }
          break;

        case TIXUtilityType.utTransform:
          if (selection) {
            up.intext = selection;
            outSelection = func(up);
            if (selection !== outSelection) {
              editor.insertText(outSelection);
            }
          }
          break;

        case TIXUtilityType.utLinesUtility:
          if (selection) {
            up.inlines = selection.split('\n');
            outSelection = func(up).join('\n');
            if (selection !== outSelection) {
              editor.insertText(outSelection);
            }
          }
          break;

        case TIXUtilityType.utLineUtility:
          if (selection) {
            const lines = selection.split('\n');
            lines.forEach((line, index) => {
              up.intext = line;
              lines[index] = func(up);
            });
            outSelection = lines.join('\n');
            if (selection !== outSelection) {
              editor.insertText(outSelection);
            }
          }
          break;

        case TIXUtilityType.utInsertAtEndUtility:
          outSelection = func(selection);
          editor.insertText(selection + outSelection);
          break;
      }
    }
  }

  export let utilityManagerWithUserInputs;
}

declare var module;
module.exports = { um };
