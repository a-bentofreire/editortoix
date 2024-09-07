// credits from https://github.com/brackets-userland/brackets-typescript/blob/master/src/typings/brackets.d.ts
declare var define: any;
declare var brackets: any;

interface CodeInspectionPosition {
  line: number;
  ch: number;
}

interface CodeInspectionError {
  type: string;
  message: string;
  pos: CodeInspectionPosition;
}

interface CodeInspectionReport {
  errors: CodeInspectionError[];
}

interface CodeHintsReport {
  hints: string[];
  match: string;
  selectInitial: boolean;
  handleWideResults: boolean;
}

interface FileChangeNotification {
  type: string;
  fullPath: string;
  isFile: boolean;
  isDirectory: boolean;
}