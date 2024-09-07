'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.um = void 0;
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// ------------------------------------------------------------------------
const vscode = require("vscode");
const vscode_1 = require("vscode");
var um;
(function (um) {
    // ------------------------------------------------------------------------
    //                               Types
    // ------------------------------------------------------------------------
    let TIXUtilityType;
    (function (TIXUtilityType) {
        /// preforms inline transforms replacing pat with repl. doesn't calls ActionFunc
        TIXUtilityType[TIXUtilityType["utInTransform"] = 0] = "utInTransform";
        /// passes intext and replaces the selection with the return text
        TIXUtilityType[TIXUtilityType["utTransform"] = 1] = "utTransform";
        /// calls line by line and replaces each line with the returning result
        TIXUtilityType[TIXUtilityType["utLineUtility"] = 2] = "utLineUtility";
        /// passes inlines and replaces the selection with return lines
        TIXUtilityType[TIXUtilityType["utLinesUtility"] = 3] = "utLinesUtility";
        /// passes inlines but doesn't do any changes
        TIXUtilityType[TIXUtilityType["utImmutableLinesUtility"] = 4] = "utImmutableLinesUtility";
        /// inserts text at the start of the selection or at cursor point if no text is selected
        TIXUtilityType[TIXUtilityType["utInsertAtStartUtility"] = 5] = "utInsertAtStartUtility";
        /// inserts text at the end of the selection or at cursor point if no text is selected
        TIXUtilityType[TIXUtilityType["utInsertAtEndUtility"] = 6] = "utInsertAtEndUtility";
    })(TIXUtilityType = um.TIXUtilityType || (um.TIXUtilityType = {}));
    let TIXSelPolicy;
    (function (TIXSelPolicy) {
        // FORCE policy must be the negative of the regular policy
        TIXSelPolicy[TIXSelPolicy["ForceAll"] = -1] = "ForceAll";
        TIXSelPolicy[TIXSelPolicy["All"] = 1] = "All";
        TIXSelPolicy[TIXSelPolicy["Word"] = 2] = "Word";
        TIXSelPolicy[TIXSelPolicy["Sentence"] = 3] = "Sentence";
        TIXSelPolicy[TIXSelPolicy["Line"] = 4] = "Line";
        TIXSelPolicy[TIXSelPolicy["None"] = 5] = "None";
        TIXSelPolicy[TIXSelPolicy["__Func"] = 6] = "__Func";
        TIXSelPolicy[TIXSelPolicy["ForceLine"] = -4] = "ForceLine";
    })(TIXSelPolicy = um.TIXSelPolicy || (um.TIXSelPolicy = {}));
    let TIXAddLineStage;
    (function (TIXAddLineStage) {
        TIXAddLineStage[TIXAddLineStage["firstLine"] = 0] = "firstLine";
        TIXAddLineStage[TIXAddLineStage["middleLine"] = 1] = "middleLine";
        TIXAddLineStage[TIXAddLineStage["lastLine"] = 2] = "lastLine";
    })(TIXAddLineStage || (TIXAddLineStage = {}));
    // ------------------------------------------------------------------------
    //                               addInputLine
    // ------------------------------------------------------------------------
    function addInputLine(up, text, stage) {
        if (stage !== TIXAddLineStage.firstLine) {
            up.intext += '\n' + text;
        }
        else {
            up.intext = text;
        }
    }
    // ------------------------------------------------------------------------
    //                               utilityManager
    // ------------------------------------------------------------------------
    function utilityManagerWithUserInputs(utilDef, IXUserInputReqs, utilFunc) {
        return __awaiter(this, void 0, void 0, function* () {
            if (IXUserInputReqs.length) {
                const reqCount = IXUserInputReqs.length;
                const userinputs = [];
                for (let i = 0; i < reqCount; i++) {
                    const inputReq = IXUserInputReqs[i];
                    const userinput = inputReq.items
                        ? yield vscode_1.window.showQuickPick(inputReq.items, { placeHolder: inputReq.placeHolder })
                        : yield vscode_1.window.showInputBox(inputReq);
                    if (userinput === undefined) {
                        return;
                    }
                    userinputs.push(userinput);
                }
                _utilityManager(utilDef, utilFunc, { userinputs });
            }
        });
    }
    um.utilityManagerWithUserInputs = utilityManagerWithUserInputs;
    function utilityManager(utilDef, utilFunc) {
        _utilityManager(utilDef, utilFunc, { userinputs: [] });
    }
    um.utilityManager = utilityManager;
    function _utilityManager(utilDef, utilFunc, up) {
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
                        insertText = utilFunc(up);
                        if (insertText) {
                            up.changes.push({
                                location: new vscode.Position(up.sel.start.line, up.sel.start.character),
                                value: insertText,
                            });
                        }
                    }
                    else {
                        // this code is only when there is a non-empty selection
                        const lineInsMin = up.sel.start.line;
                        const lineInsMax = up.sel.end.line;
                        let xMin;
                        let xMax;
                        for (let lineI = lineInsMin; lineI <= lineInsMax; lineI++) {
                            xMin = (lineI === lineInsMin) ? up.sel.start.character : 0;
                            xMax = (lineI === lineInsMax) ? up.sel.end.character : up.doc.lineAt(lineI).text.length;
                            const minPos = new vscode.Position(lineI, xMin);
                            const maxPos = new vscode.Position(lineI, xMax);
                            up.intext = up.doc.getText(new vscode.Range(minPos, maxPos)) || '';
                            const insertTextStr = utilFunc(up);
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
                                const outLine = utilFunc(up);
                                if (line !== outLine) {
                                    up.changes.push({
                                        location: new vscode.Range(new vscode.Position(lineI, 0), new vscode.Position(lineI, line.length)), value: outLine,
                                    });
                                }
                                break;
                        }
                    }
                    // run after all the selected lines
                    if (utilDef.utilType === TIXUtilityType.utImmutableLinesUtility) {
                        utilFunc(up);
                    }
                    else if (utilDef.utilType === TIXUtilityType.utLinesUtility) {
                        const outLines = utilFunc(up);
                        const outRg = new vscode.Range(new vscode.Position(lineMin, 0), new vscode.Position(lineMax, up.doc.lineAt(lineMax).text.length));
                        up.changes.push({ location: outRg, value: outLines.join('\n') });
                    }
                    break;
                case TIXUtilityType.utInTransform:
                case TIXUtilityType.utTransform:
                    let outSel;
                    // when there is no selection it processes the whole code
                    if (hasNoSels) {
                        up.intext = up.doc.getText();
                        outSel = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(up.doc.lineCount, 0));
                        // processes when there is one or more selections
                    }
                    else {
                        outSel = up.sel;
                        if (sel.isEmpty) {
                            // transformations only happen if there is selected text
                            // in case of multiple selections some might be empty
                            break;
                        }
                        // processes the first line of a selection
                        addInputLine(up, up.doc.lineAt(sel.start.line).text.substring(sel.start.character), TIXAddLineStage.firstLine);
                        // processes the middle lines of a selection
                        if (sel.start.line !== sel.end.line) {
                            for (let i = sel.start.line + 1; i < sel.end.line; i++) {
                                addInputLine(up, up.doc.lineAt(i).text, TIXAddLineStage.middleLine);
                            }
                            // processes the last line of a selection
                            addInputLine(up, up.doc.lineAt(sel.end.line).text.substring(0, sel.end.character), TIXAddLineStage.lastLine);
                        }
                        else {
                            // processes a single line selection
                            addInputLine(up, up.intext.substring(0, sel.end.character - sel.start.character), TIXAddLineStage.firstLine);
                        }
                    }
                    // calls the utilities function transforming up.intext into outSelText
                    let outSelText;
                    if (utilDef.utilType === TIXUtilityType.utInTransform) {
                        outSelText = up.intext.replace(utilDef.pat, utilDef.repl);
                    }
                    else {
                        outSelText = utilFunc(up);
                    }
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
    function getConfig(itemName) {
        const vscConfig = vscode.workspace.getConfiguration("vsctoix");
        return vscConfig.get(itemName);
    }
    um.getConfig = getConfig;
})(um || (exports.um = um = {}));
module.exports = { um };
//# sourceMappingURL=utilitymanager.js.map