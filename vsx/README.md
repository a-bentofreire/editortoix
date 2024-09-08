# Code Editor Utility Belt

[EditorToIX](https://www.devtoix.com/en/projects/editortoix) are open-source utilities available for multiple code editors in form of extension or plugins.

If you find this project useful, please, read the [Support this Project](#support-this-project) on how to contribute.  

## Availability

| Id  | Old Name | Code Editor |
| ------------- | ------------- | ------------- |
| **vsx** |  VscToIX | [Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=a-bentofreire.vsctoix)<br>Cursor AI<br>[Google Project IDX](https://idx.dev/)<br>[open-vsx.org](https://open-vsx.org/extension/a-bentofreire/vsctoix) |
| **xed** | XedToIX | [Linux Mint Xed Editor](https://launchpad.net/~a-bentofreire/+archive/ubuntu/toix) (as plugins) |
| **phoenix** | BracketsToIX | Phoenix Code |

## Utilities

| General  | Selection Policy | Code Editor |
| ------------- | ------------- | ------------- |
| Extract Text | Document | vsx, phoenix |
| Header To Bookmark | Document | vsx, phoenix |
| Mixer | Document | vsx, phoenix |
| Regnize | Document | vsx, phoenix |
| Replace Recipes | Document | vsx |
| Reverse Assignment | Document | vsx, phoenix |

| Change Case | Selection Policy | Code Editor |
| ------------- | ------------- | ------------- |
| Add Space before Uppercase | Word | vsx, phoenix |
| Camel Case | Word | vsx, phoenix |
| Capitalize | Word | vsx, phoenix |
| Cycle Case | Word | vsx, xed, phoenix |
| Dash Case | Word | vsx, phoenix |
| Dash To Underscore | Word | vsx, phoenix |
| LowerCase | Word | phoenix |
| Underscore To Dash | Word | vsx, phoenix |
| UpperCase | Word | phoenix |

| Encoders/Decoders | Selection Policy | Code Editor |
| ------------- | ------------- | ------------- |
| Html Decode | Line | phoenix |
| Html Encode | Line | phoenix |
| Url Decode | Line | vsx, phoenix |
| Url Encode | Line | vsx, phoenix |

| Change Slash | Selection Policy | Code Editor |
| ------------- | ------------- | ------------- |
| Double To Single Slash| Line | vsx, phoenix |
| Single To Double Slash | Line | vsx, phoenix |
| Unix To Win Slash | Line | vsx, phoenix |
| Win To Unix Slash | Line | vsx, phoenix |

| Line | Selection Policy | Code Editor |
| ------------- | ------------- | ------------- |
| Break Line At | Document | vsx, phoenix |
| Indent One Space | Document | vsx, xed, phoenix |
| Join Lines | Document | vsx, phoenix |
| Outdent One Space | Document | vsx, xed, phoenix |
| Remove Duplicated Lines | Document | vsx, xed, phoenix |
| Remove Empty Lines | Document | vsx, xed, phoenix |
| Sort Numerically Ascending | Document | vsx, xed, phoenix |
| Sort Numerically Descending | Document | vsx, xed, phoenix |
| Split Lines | Document | vsx, phoenix |
| Trim Trailing | Document | xed, phoenix |

| Insert | Selection Policy | Code Editor |
| ------------- | ------------- | ------------- |
| Insert ISO Date | Document | vsx, phoenix |
| Insert ISO TimeDate | Document | vsx, phoenix |
| Insert UUID | Document | vsx, phoenix |
| Insert Text At End| Document | vsx, phoenix |
| Insert Text At Start | Document | vsx, phoenix |

| Change Quote | Selection Policy | Code Editor |
| ------------- | ------------- | ------------- |
| Double To Single Quote| Line | phoenix |
| Single To Double Quote | Line | phoenix |
| Toggle Quote | Line | phoenix |

| Spacing  | Selection Policy | Code Editor |
| ------------- | ------------- | ------------- |
| Tab To Space | Document | phoenix |
| Space To Tab | Document | phoenix |

## Project Status

This is a **stable project** with utilities being available on brackets code editor since 2016, however, since more editors have been supported, there is still work in progress to support the same extensions and policies across all code editors.
Linux Mint Xed Editor has the smaller subset of extensions.

## Demos - All Editors
  
- `IX: Cycle Case`: Add a shortcut and cycle between different case modes in a breeze.  
  
![Cycle Case](https://github.com/a-bentofreire/editortoix/raw/master/vsx/assets/demo/cycle-case.gif)
  
- `IX: Indent One Space`, `IX: Outdent One Space`: Insert or remove one space only at the start of every line regardless of indention mode.  
  
![Indent/Outdent](https://github.com/a-bentofreire/editortoix/raw/master/vsx/assets/demo/indent-outdent-lines.gif)

## Demos - [vsx and phoenix Editors](#availability)

- `IX: Extract Text` : Copy text patterns from a document to clipboard.  

![Extract Text](https://github.com/a-bentofreire/editortoix/raw/master/vsx/assets/demo/extract-text.gif)

- `IX: Insert Text At Start`: Insert text with macros at the start of every line.  
  
![Insert Text at Start](https://github.com/a-bentofreire/editortoix/raw/master/vsx/assets/demo/insert-text-at-start.gif)
  
- `IX: Insert Text At End`: Insert text with macros at the end of every line.  
  
![Insert Text at End](https://github.com/a-bentofreire/editortoix/raw/master/vsx/assets/demo/insert-text-at-end.gif)
  
- `IX: Join Lines`: Join text with macros.  
  
![Join Lines](https://github.com/a-bentofreire/editortoix/raw/master/vsx/assets/demo/join-lines.gif)
  
- `IX: Break Line At`: Splits each line in order to be no longer than `Max number of Chars`.
  The words aren't broken unless it's added `/` at the end the user input. (e.g. `40/`).
  
![Break Line At](https://github.com/a-bentofreire/editortoix/raw/master/vsx/assets/demo/break-line-at.gif)

## Installation - [Linux Mint Xed Editor](#availability)

If you have previously installed `xedtoix`, you should uninstall first:

```bash
sudo apt uninstall xedtoix
```

```bash
sudo add-apt-repository ppa:a-bentofreire/editortoix
sudo apt-get update
sudo apt install editortoix
```

## Interface - [phoenix Editor](#availability)
  
EditorToIX adds a top-menu called `IX`.
To prevent from cluttering the menu with all the commands, only a few commands were added to the menu.  
Use Command mapper to add which ones you prefer, and setup the shortcuts.  
No default shortcuts were define to prevent collision with other plugins.  

## Utility Description

| Utility | Description | Example |
| ------------- | ------------- | ------------- |
| Add Space before Uppercase | Useful to transform functions names into documentation |**before**: `doActionBefore`<br>**after**: `do Action Before`|
| Break Line At | Break lines at a certain position |**before**:<br>`Too long line`<br>**after**:<br>`too long`<br>`line`|
| Camel Case| | **before**: `ClassNameFunc`<br>**after**: `classNameFunc`|
| Capitalize | | **before**: `classNameFunc`<br>**after**: `ClassNameFunc`|
| Cycle Case| Loops between differet case types | **before**: `_ClassNameFunc`<br>**after**: `_classNameFunc -> _CLASS_NAME_FUNC -> _class_name_func -> _class-name-func -> _class name func ->_ClassNameFunc`|
| Dash Case| | **before**: `ClassNameFunc`<br>**after**: `class-name-func`|
| Dash To Underscore| | **before**: `find-deep-first`<br>**after**: `find_deep_first`|
| Double To Single Slash | | **before**: `find\\\nagain`<br>**after**: `find\nagain`|
| Extract Text | Copies to the clipboard the captured group of a regular expression.<br>Each capture is separated by tabs |`(\w+) = (\w+)`|
| Header To Bookmark | Converts markdown header text to Html Bookmark |**before**: `Is this the header 你好?`<br>**after**: `is-this-the-header-你好`|
| Indent One Space | Adds one space to the beginning of each line | |
| Insert ISO Date| | `2018-02-08`|
| Insert ISO TimeDate| | `2018-02-08 10:12:15`|
| Insert Text At End| | **before**:<br>`red`<br>`green`<br><br>**after**:<br>`expr: = \c{1}`<br>`red = 1`<br>`green = 2`|
| Insert Text At Start | | **before**:<br>`red`<br>`green`<br><br>**after**:<br>`expr: const \e{upper} =`<br>`const RED = red`<br>`const GREEN = green`|
| Insert UUID| | `7fff60f8-91e8-40ba-9053-56b0f3a487f0`|
| Join Lines | Joins lines adding the computed expression at the end of every line |**before**:<br>`red`<br>`green`<br><br>**after**:<br>`expr:(x\c{X0A}),`<br>`red(x0A),green(x0B)`|
| LowerCase | | **before**:`classNameFunc`<br>**after**:`classnamefunc`|  
| Mixer | Mixes lines of different sections. | **before**:<br>`// section`<br>`abc`<br>`cde`<br>`// end-section`<br>`// section`<br>`123`<br>`345`<br>`// section`<br>**after**:<br>`abc`<br>`123`<br>`cde`<br>`345` |
| Outdent One Space | Removes one space to the beginning of each line | |
| Regnize | Adds slash to regular expression metachars | **before**: `(\w+)[A-Z]a*b+text`<br>**after**: `\(\\w\+\)\[A-Z\]a\*b\+text`|
| Remove Duplicated Lines | Removes consecutive duplicated lines |**before**:<br>`first`<br>`second`<br>`second`<br><br>**after**:<br><br>`first`<br>`second`|
| Remove Empty Lines| Removes empty lines |**before**:<br>`first`<br><br>`second`<br><br>**after**:<br><br>`first`<br>`second`|
| Replace Recipes | Replaces text from a list of pre-defined recipes | |
| Reverse Assignment | Reverses the terms of assignments or equal/different comparisons |**before**: `x == y[x] + 5`<br>**after**: `y[x] + 5 == x`|
| Single To Double Slash | | **before**: `find\nagain`<br>**after**: `find\\\nagain`|
| Sort Numerically Ascending | For each line uses the first number as sort key |**before**:<br>`10. red`<br>`2. green`<br><br>**after**:<br><br>`2. green`<br>`10. red`|
| Sort Numerically Descending | For each line uses the first number as sort key |**before**:<br>`10. red`<br>`2. |
| Space To Tab | Space to Tab only works with leading spaces||
| Split Lines | Split lines by an expression. Dynamic values aren't supported |**before**:<br>`red,green`<br><br>**after**:<br>`expr: = \c{1}`<br>`red = 1`<br>`green = 2`|
| Tab To Space | Space to Tab only works with leading spaces||
| Trim Trailing | | Removes trailing spaces of each line |
| Underscore To Dash| | **before**: `find_deep_first`<br>**after**: `find-deep-first`|
| Unix To Win Slash | Converts slashes to backslashes | **before**: `chocolate/candy`<br>**after**: `chocolate\candy`|
| UpperCase | | **before**:`classNameFunc`<br>**after**:`CLASSNAMEFUNC`|  
| Url Decode| | **before**: `https%3A%2F%2Fgithub.com`<br>**after**: `https://github.com`|
| Url Encode| | **before**: `https://github.com`<br>**after**: `https%3A%2F%2Fgithub.com`|
| Win To Unix Slash | Converts backslashes to slashes | **before**: `chocolate\candy`<br>**after**: `chocolate/candy`|
|Double To Single Quote| |**before**:`find"again`<br>**after**:`find'again`|
|Html Decode||**before**:`&lt;h1&gt;Title&lt;/h1&gt`<br>**after**:`<h1>Title</h1>`|
|Html Encode||**before**:`<h1>Title</h1>`<br>**after**:`&lt;h1&gt;Title&lt;/h1&gt`|
|Single To Double Quote| |**before**:`find'again`<br>**after**:`find"again`|
|Toggle Quote| | **before**:`find"again'`<br>**after**:`find'again"`|

## Selection Policies

### [vsx Editors](#availability)

Every utility supports multiple cursors and multiple line selections.  
However, It differs in the way each utility category handles the selections.  
For every cursor, each line is process individually and the counter is increased per line.  

- Line Utilities:  
  - If no text is selected then all the document text is used.  
  - If part of the line is selected then all the line is used  
- Transform Text Utilities:  
  - If no text is selected then all the document text is used.  
- Insert Text Utilities:
  - If no text is selected then the cursor is the insertion point.  
  - If multiple lines are selected then is inserted at start/end of every line.

### [Phoenix Code](#availability)

Most of the commands operate on selected text.
If no text is selected, a command will use:
**word** - The nearest word (before and after the cursor)
**sentence** - The nearest text until a whitespace or newline
**line** - The text line where the cursor is **located**.
**document** - All the editor text
**function** - A function determines the text to use. Ex: Quote functions will use all the text between quotes that surrounds the cursor.

### [Linux Mint Xed Editor](#availability)

- Document Plugins:  
  - If no text is selected then all the document text is used.  
  - If part of the line is selected then all the line is used  
- Word plugins:  
  - If no text is selected then word surrounding cursor is used.  

## Expressions - [vsx](#availability)

Some of the utilities support expressions  
An expression is a text supporting the following metachars:  

- \n - newline
- \t - tab
- \c{start-value} - counter with optional start value  
  - \c  0,1,2,...  
  - \c{10} 10,11,12,...  
  - \c{x00a} x00a,x00b,x00c,...  
  - \c{XF} xF,x10,x11,...  

- \e{func} - transforms the selected text (line by line)  
    function list:  
  - upper - UpperCase  
  - lower - LowerCase  
  - length - Selected text length  
  - capitalize  
  - isodate  
  - isotimedate  
  - uuid  

## Replace Recipes - [vsx](#availability)

Replace Recipes must be added manually to the `settings.json`.  
This tool is still in beta phase.  

| Field  | Type | Description |
| ------------- | ------------- | ------------- |
| name|string| Recipe name |
| pattern|string| Find Expression (RegExp or String) |
| replaceWith|string| Replace Text |
| isRegExp|boolean| if `false` then pattern is a static string |
| isExpression|boolean| if `false` then result doesn't exec the expression engine |
| ignoreCase|boolean| if `true` and `isRegExp` uses `ignore case` option |

ex:

```json
"vsctoix.replaceRecipes": [
    {
      "name": "repl with let",
      "pattern": "\\b(var|const)\\b",
      "replaceWith": "let"
    },
    {
      "name": "Remove starting dash",
      "pattern": "^\\s*-",
      "replaceWith": ""
    },
  ],
```

## Support this Project

If you find this project useful, consider supporting it:

- Donate:  
[![Donate via PayPal](https://www.paypalobjects.com/webstatic/en_US/i/btn/png/blue-rect-paypal-34px.png)](https://www.paypal.com/donate/?business=MCZDHYSK6TCKJ&no_recurring=0&item_name=Support+Open+Source&currency_code=EUR)

- Visit the project [homepage](https://www.devtoix.com/en/projects/editortoix)
- Give the project a ⭐ on [Github](https://github.com/a-bentofreire/editortoix)

- Spread the word
- Follow me:
  - [Github](https://github.com/a-bentofreire)
  - [LinkedIn](https://www.linkedin.com/in/abentofreire)
  - [Twitter/X](https://x.com/devtoix)

## License

MIT License - [vsx and phoenix Editors](#availability)

GPLv2 License - [Linux Mint Xed Editor](#availability)

## Copyrights  
  
© 2016-2024 [Alexandre Bento Freire](https://www.a-bentofreire.com)  
