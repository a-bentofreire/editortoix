'use strict';
// ------------------------------------------------------------------------
// Copyright (c) 2016-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License
// ------------------------------------------------------------------------
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

  export let utilityManager;
}
