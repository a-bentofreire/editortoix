'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// ------------------------------------------------------------------------
const vscode = require("vscode");
const utilityList = require("./common/utility-list");
// ------------------------------------------------------------------------
//                               Startup Code
// ------------------------------------------------------------------------
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    for (const action of utilityList.utilityList) {
        const disposable = vscode.commands.registerCommand(action.id, action.f);
        context.subscriptions.push(disposable);
    }
}
exports.activate = activate;
// ------------------------------------------------------------------------
//                               Cleanup Code
// ------------------------------------------------------------------------
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map