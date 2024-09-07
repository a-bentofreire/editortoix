'use strict';

// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// ------------------------------------------------------------------------

import { um } from './utilitymanager';
import { ep } from './expressionprocessor';

export namespace insertutilities {

  // ------------------------------------------------------------------------
  //                               Insert Utilities
  //
  // $cattitle: Insert Text Utilities
  // ------------------------------------------------------------------------

  // ------------------------------------------------------------------------
  // $utility: insertISODate
  //
  // $title: Insert ISO Date
  // $keywords: date
  // $eg: 2018-02-08
  // ------------------------------------------------------------------------

  export function insertISODate(): void {
    um.utilityManager({
      utilType: um.TIXUtilityType.utInsertAtEndUtility,
    }, (_up): string => ep.ISODate(),
    );
  }

  // ------------------------------------------------------------------------
  // $utility: insertISOTimeDate
  //
  // $title: Insert ISO TimeDate
  // $keywords: date
  // $eg: 2018-02-08 10:12:15
  // ------------------------------------------------------------------------

  export function insertISOTimeDate(): void {
    um.utilityManager({
      utilType: um.TIXUtilityType.utInsertAtEndUtility,
    }, (_up): string => ep.ISOTimeDate(),
    );
  }

  // ------------------------------------------------------------------------
  // $utility: insertUUID
  //
  // $title: Insert UUID
  // $keywords: uuid, guid
  // $eg: 7fff60f8-91e8-40ba-9053-56b0f3a487f0
  // ------------------------------------------------------------------------

  export function insertUUID(): void {
    um.utilityManager({
      utilType: um.TIXUtilityType.utInsertAtEndUtility,
    }, (_up): string => ep.uuidv4(),
    );
  }

  // ------------------------------------------------------------------------
  // $utility: insertTextAtEnd
  //
  // $keywords: insert, text
  // $eg: red||green||-> expr: = \c{1}||red = 1||green = 2
  // ------------------------------------------------------------------------

  export function insertTextAtEnd(): void {
    um.utilityManagerWithUserInputs({
      utilType: um.TIXUtilityType.utInsertAtEndUtility,
    },
      [{ prompt: 'Expression' }],

      (up): string => {
        const userInput = ep.processExpression(up.userinputs[0], up.selNr, up.intext);
        return userInput;
      });
  }

  // ------------------------------------------------------------------------
  // $utility: insertTextAtStart
  //
  // $keywords: insert, text
  // $eg: red||green||->expr: const \e{upper} =||const RED = red||const GREEN = green
  // ------------------------------------------------------------------------

  export function insertTextAtStart(): void {
    um.utilityManagerWithUserInputs({
      utilType: um.TIXUtilityType.utInsertAtStartUtility,
    },
      [{ prompt: 'Expression' }],

      (up): string => {
        const userInput = ep.processExpression(up.userinputs[0], up.selNr, up.intext);
        return userInput;
      });
  }

}

declare const module;
module.exports = { insertutilities };
