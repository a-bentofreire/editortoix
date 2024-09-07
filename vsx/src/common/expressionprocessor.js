'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ep = void 0;
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// ------------------------------------------------------------------------
var ep;
(function (ep) {
    // ------------------------------------------------------------------------
    //                               utilities
    // ------------------------------------------------------------------------
    // this function is credited to @broofa
    // https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            // tslint:disable-next-line:no-bitwise
            const r = Math.random() * 16 | 0;
            // tslint:disable-next-line:no-bitwise
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    ep.uuidv4 = uuidv4;
    // this function is credited to @Flygenring
    // https://stackoverflow.com/questions/10830357/javascript-toisostring-ignores-timezone-offset
    function getLocalISOTimeDate() {
        const tzoffset = (new Date()).getTimezoneOffset() * 60000; // offset in milliseconds
        return (new Date(Date.now() - tzoffset)).toISOString().substring(0, 19).replace('T', ' ');
    }
    ep.getLocalISOTimeDate = getLocalISOTimeDate;
    function ISODate() {
        return getLocalISOTimeDate().substring(0, 10);
    }
    ep.ISODate = ISODate;
    function ISOTimeDate() {
        return getLocalISOTimeDate();
    }
    ep.ISOTimeDate = ISOTimeDate;
    function regnize(text, isFind) {
        const REGNIZEFIND = /([\\.()[\]*+^$])/g;
        const REGNIZEREPL = '\\$1';
        return text.replace(isFind ? REGNIZEFIND : /(\$\d)/g, REGNIZEREPL);
    }
    ep.regnize = regnize;
    // ------------------------------------------------------------------------
    //                               processMacro
    // ------------------------------------------------------------------------
    function processMacro(macro, inpText) {
        switch (macro) {
            case 'upper': return inpText.toUpperCase();
            case 'lower': return inpText.toLowerCase();
            case 'capitalize': return inpText[0].toUpperCase() + inpText.substring(1);
            case 'length': return inpText.length.toString();
            case 'regnize': return regnize(inpText, true);
            case 'isodate': return ISODate();
            case 'isotimedate': return ISOTimeDate();
            case 'uuid': return uuidv4();
        }
        return inpText;
    }
    // ------------------------------------------------------------------------
    //                               processExpression
    // ------------------------------------------------------------------------
    /**
     * Tests if the expression has macros that dynamic
     */
    function hasDynamicValues(expression) {
        return /\\(c|e)/.test(expression);
    }
    ep.hasDynamicValues = hasDynamicValues;
    /**
     * Splits the selected text into lines, and process line by line.
     * This way a selection of multiple lines can have macros with different values
     */
    /* unused code
    export function processExpressionLines(expression: string,
      selNr?: number, selText?: string): string {
  
      let lines = selText.split(/\n/);
      lines.forEach((line, index) => {
        lines[index] = processExpression(expression, selNr, selText);
        selNr++;
      });
  
      return lines.join('\n');
    }*/
    /**
     * Replaces macros with its text
     * Each macro starts with a slash (\), and can have dynamic values
     */
    // Special Characters: \t \n
    // Macros:
    //  \c | \c{start} - Replaces with value with a counter starting from 'start'
    //                   e.g. \c   \c{5}   \c{x00ff} \c{X0A}
    //  \e{function} - Replaces the selected text transformed by the function
    //                   e.g. \e{upper}   \e{lower}
    function processExpression(expression, selNr, selText) {
        return expression.replace(/\\(n|t|(?:c|e)(?:\{(\w+)\}){0,1})/g, (match, tag, valueParam) => {
            switch (tag.substring(0, 1)) {
                case 'n': return '\n';
                case 't': return '\t';
                case '\\': return '\\';
                case 'c':
                    let value = selNr++;
                    if (valueParam) {
                        const firstChar = valueParam[0];
                        // handles hex numbers
                        if (firstChar === 'x' || firstChar === 'X') {
                            value += parseInt(valueParam.substring(1), 16);
                            let eres = Number(value).toString(16);
                            // makes sure that the output has the same case as the input
                            eres = firstChar === 'x' ? eres.toLowerCase() : eres.toUpperCase();
                            // makes sure that the output has the same length or greater as the input
                            const outLen = valueParam.length - 1;
                            if (eres.length < outLen) {
                                eres = Array(outLen - eres.length + 1).join('0') + eres;
                            }
                            return eres;
                        }
                        else {
                            value += parseInt(valueParam);
                        }
                    }
                    return Number(value).toString();
                case 'e': return processMacro(valueParam, selText);
            }
            return match;
        });
    }
    ep.processExpression = processExpression;
})(ep || (exports.ep = ep = {}));
module.exports = { ep };
//# sourceMappingURL=expressionprocessor.js.map