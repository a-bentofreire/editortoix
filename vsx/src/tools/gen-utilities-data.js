'use strict';
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// ------------------------------------------------------------------------
/*
  This script scans typescripts for utilities,
  and transforms the output file templates by inserting the list of utilities
*/
const fs = require('fs');
let cfg = null;
const AUTO_GEN_WARN = 'This file is generated automatically by npm run gen-utilities-data';
// ------------------------------------------------------------------------
//                               from systoix.js
// ------------------------------------------------------------------------
function loadText(filename, encoding) {
    return fs.readFileSync(filename, { encoding: encoding || 'utf-8' });
}
function saveText(filename, data) {
    return fs.writeFileSync(filename, data);
}
// ------------------------------------------------------------------------
//                               getTitleFromName
// ------------------------------------------------------------------------
function getTitleFromName(name) {
    return name[0].toUpperCase() + name.substring(1).replace(/([A-Z])/g, ' $1');
}
function processMacro(utility, macroText) {
    return macroText
        .replace(/\$\{funcstr\}/g, utility.funcstr)
        .replace(/\$\{name\}/g, utility.name)
        .replace(/\$\{title\}/g, utility.title);
}
function buildMacros(utilities) {
    const macros = [
        { key: '__AUTO_GEN_WARN__', value: `${AUTO_GEN_WARN}` },
    ];
    const actionDefs = [];
    const commands = [];
    const activationEvents = [];
    utilities.forEach(utility => {
        actionDefs.push(processMacro(utility, cfg['action']));
        commands.push(processMacro(utility, cfg['command']));
        activationEvents.push(processMacro(utility, cfg['event']));
    });
    macros.push({ key: '/* __UTILITYDEFS__ */', value: actionDefs.join(',\n') });
    macros.push({ key: '"__COMMANDS__"', value: commands.join(',\n') });
    macros.push({ key: '"__ACTIVATION_EVENTS__"', value: activationEvents.join(',\n') });
    return macros;
}
// ------------------------------------------------------------------------
//                               run
// ------------------------------------------------------------------------
// WARN: Don't name it as 'run' since it conflicts with mocha/index.d.ts
function runGenerator() {
    console.log('  >> Started <<');
    cfg = JSON.parse(loadText('./config.json'));
    const utilities = [];
    const keywords = [];
    const utilityTable = {};
    const catTitles = {};
    cfg['utilityFiles'].forEach((utilityFile) => {
        const utilityCat = utilityTable[utilityFile] = [];
        const temText = loadText(`${cfg['rootFolder']}/common/${utilityFile}.ts`);
        temText.replace(/\$cattitle\s*:\s*([^\n]+)\s*/, (_match, catTitle) => {
            catTitles[utilityFile] = catTitle;
            return '';
        });
        temText.replace(/\/\/\s*\$utility:\s*(\w+)((?:.|\n|\r)*?)\s*\/\/\s+-{15,}/g, (_match, name, paramData) => {
            const utility = {
                name,
                title: getTitleFromName(name),
                funcstr: `${utilityFile}.${name}`,
                eg: '',
                desc: '',
            };
            paramData.replace(/\/\/\s*\$(\w+)\s*:\s*([^\n]*)\s*/g, (_match1, key, value) => {
                console.log(`    ${key}:${value}`);
                switch (key) {
                    case 'title':
                        utility.title = value;
                        break;
                    case 'keywords':
                        value.split(',').forEach(valueKeyword => {
                            valueKeyword = '"' + valueKeyword.trim() + '"';
                            if (keywords.indexOf(valueKeyword) === -1) {
                                keywords.push(valueKeyword);
                            }
                        });
                        break;
                    case 'eg':
                        utility.eg = value;
                        break;
                    case 'desc':
                        utility.desc = value;
                        break;
                }
            });
            utilityCat.push(utility);
            console.log(`${utility.name} -> "${utility.title}"\n`);
            utilities.push(utility);
            return '';
        });
    });
    const macros = buildMacros(utilities);
    macros.push({ key: '"__KEYWORDS__"', value: keywords.join(',\n') });
    macros.push({ key: '__UTILITYCOUNT__', value: utilities.length.toString() });
    macros.push({
        key: '__UTILITY_LIST_TABLE__', value: Object.keys(utilityTable).map(utilityCat => {
            return /* `\n* ${catTitles[utilityCat]}\n` */ '' +
                utilityTable[utilityCat].map(utility => {
                    let eg = utility.eg;
                    if (eg === '__NONE__') {
                        eg = '';
                    }
                    if (eg) {
                        if (eg.indexOf('||') === -1) {
                            if (eg.indexOf('->') !== -1) {
                                // transform example
                                eg = `**before**: \`${eg.replace(/\s*->\s*/, '`<br>**after**: `')}\``;
                            }
                            else {
                                // insert example
                                eg = `\`${eg}\``;
                            }
                        }
                        else {
                            // multiple line example
                            eg = ('**before**:<br>`' + eg.replace(/\|\|/g, '`<br>`')
                                .replace(/\s*->\s*/, '`<br>**after**:<br>`') + '`')
                                .replace(/``/g, '');
                        }
                    }
                    let title = utility.title;
                    if (utility.desc) {
                        title += `<br>**${utility.desc}**`;
                    }
                    return `|${title}|${eg}|`;
                }).join('\n');
        }).join('\n'),
    });
    const macroSections = cfg['macroSections'];
    cfg['targetFiles'].forEach((targetFile) => {
        const templateFile = targetFile /* .replace(/(\.\w+)$/, '_.in$1') */;
        let temText = loadText(`${cfg['rootFolder']}/${templateFile}`);
        const fileMacroSections = macroSections[targetFile];
        fileMacroSections.forEach(section => {
            temText = temText.replace(new RegExp(section['find'], "m"), section['replace']);
        });
        macros.forEach(macro => { temText = temText.replace(macro.key, macro.value); });
        saveText(`${cfg['rootFolder']}/${targetFile}`, temText);
    });
    console.log('  >> Done <<');
}
runGenerator();
//# sourceMappingURL=gen-utilities-data.js.map