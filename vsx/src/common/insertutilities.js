'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertutilities = void 0;
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// ------------------------------------------------------------------------
const utilitymanager_1 = require("./utilitymanager");
const expressionprocessor_1 = require("./expressionprocessor");
var insertutilities;
(function (insertutilities) {
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
    function insertISODate() {
        utilitymanager_1.um.utilityManager({
            utilType: utilitymanager_1.um.TIXUtilityType.utInsertAtEndUtility,
        }, (_up) => expressionprocessor_1.ep.ISODate());
    }
    insertutilities.insertISODate = insertISODate;
    // ------------------------------------------------------------------------
    // $utility: insertISOTimeDate
    //
    // $title: Insert ISO TimeDate
    // $keywords: date
    // $eg: 2018-02-08 10:12:15
    // ------------------------------------------------------------------------
    function insertISOTimeDate() {
        utilitymanager_1.um.utilityManager({
            utilType: utilitymanager_1.um.TIXUtilityType.utInsertAtEndUtility,
        }, (_up) => expressionprocessor_1.ep.ISOTimeDate());
    }
    insertutilities.insertISOTimeDate = insertISOTimeDate;
    // ------------------------------------------------------------------------
    // $utility: insertUUID
    //
    // $title: Insert UUID
    // $keywords: uuid, guid
    // $eg: 7fff60f8-91e8-40ba-9053-56b0f3a487f0
    // ------------------------------------------------------------------------
    function insertUUID() {
        utilitymanager_1.um.utilityManager({
            utilType: utilitymanager_1.um.TIXUtilityType.utInsertAtEndUtility,
        }, (_up) => expressionprocessor_1.ep.uuidv4());
    }
    insertutilities.insertUUID = insertUUID;
    // ------------------------------------------------------------------------
    // $utility: insertTextAtEnd
    //
    // $keywords: insert, text
    // $eg: red||green||-> expr: = \c{1}||red = 1||green = 2
    // ------------------------------------------------------------------------
    function insertTextAtEnd() {
        utilitymanager_1.um.utilityManagerWithUserInputs({
            utilType: utilitymanager_1.um.TIXUtilityType.utInsertAtEndUtility,
        }, [{ prompt: 'Expression' }], (up) => {
            const userInput = expressionprocessor_1.ep.processExpression(up.userinputs[0], up.selNr, up.intext);
            return userInput;
        });
    }
    insertutilities.insertTextAtEnd = insertTextAtEnd;
    // ------------------------------------------------------------------------
    // $utility: insertTextAtStart
    //
    // $keywords: insert, text
    // $eg: red||green||->expr: const \e{upper} =||const RED = red||const GREEN = green
    // ------------------------------------------------------------------------
    function insertTextAtStart() {
        utilitymanager_1.um.utilityManagerWithUserInputs({
            utilType: utilitymanager_1.um.TIXUtilityType.utInsertAtStartUtility,
        }, [{ prompt: 'Expression' }], (up) => {
            const userInput = expressionprocessor_1.ep.processExpression(up.userinputs[0], up.selNr, up.intext);
            return userInput;
        });
    }
    insertutilities.insertTextAtStart = insertTextAtStart;
})(insertutilities || (exports.insertutilities = insertutilities = {}));
module.exports = { insertutilities };
//# sourceMappingURL=insertutilities.js.map