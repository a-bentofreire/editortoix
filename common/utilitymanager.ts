export namespace um {

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

  export let utilityManager;

  // FORCE policy must be the negative of the regular policy
  export const SP_FORCE_ALL = -1;
  export const SP_ALL = 1;
  export const SP_WORD = 2;
  export const SP_SENTENCE = 3;
  export const SP_LINE = 4;
  export const SP_NONE = 5;
  export const __SP_FUNC = 6;
  export const SP_FORCE_LINE = -4;

}
