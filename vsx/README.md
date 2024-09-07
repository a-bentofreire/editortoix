# Code Editor Utility Belt

[EditorToIX](https://www.devtoix.com/en/projects/editortoix) is an open source extension for multiple code editors.

This project was previously named as:

- **VscToIX** on *Visual Studio Code*.
- **XedToIX** on *Linux Mint Xed*.

It has been renamed to **EditorToIX** and it will be merged with other
extensions with the same utilities on different code editors into a single github repository.

If you find this project useful, please, read the [Support this Project](#support-this-project) on how to contribute.  

## Availability

This extension is also available for:

- **vsx**: Visual Studio Code, Cursor AI, Google Project IDX, open-vsx.org (**EditorToIX**).
- **xed**: Linux Mint Xed Editor ([EditorToIX](https://www.devtoix.com/en/projects/editortoix))
- **phoenix**: Brackets and Phoenix Code ([BracketsToIX](https://www.devtoix.com/en/projects/editortoix))
- **atom**: Atom ([AtomToIX](https://www.devtoix.com/en/projects/editortoix)).  

## Demos
  
- `IX: Cycle Case`: Add a shortcut and cycle between different case modes in a breeze.  
  
![Cycle Case](https://github.com/a-bentofreire/editortoix/raw/master/vsx/assets/demo/cycle-case.gif)
  
- `IX: Extract Text` : Copy text patterns from a document to clipboard.  
  
![Extract Text](https://github.com/a-bentofreire/editortoix/raw/master/vsx/assets/demo/extract-text.gif)
  
- `IX: Indent One Space`, `IX: Outdent One Space`: Insert or remove one space only at the start of every line regardless of indention mode.  
  
![Indent/Outdent](https://github.com/a-bentofreire/editortoix/raw/master/vsx/assets/demo/indent-outdent-lines.gif)
  
- `IX: Insert Text At Start`: Insert text with macros at the start of every line.  
  
![Insert Text at Start](https://github.com/a-bentofreire/editortoix/raw/master/vsx/assets/demo/insert-text-at-start.gif)
  
- `IX: Insert Text At End`: Insert text with macros at the end of every line.  
  
![Insert Text at End](https://github.com/a-bentofreire/editortoix/raw/master/vsx/assets/demo/insert-text-at-end.gif)
  
- `IX: Join Lines`: Join text with macros.  
  
![Join Lines](https://github.com/a-bentofreire/editortoix/raw/master/vsx/assets/demo/join-lines.gif)
  
- `IX: Break Line At`: Splits each line in order to be no longer than `Max number of Chars`.
  The words aren't broken unless it's added `/` at the end the user input. (e.g. `40/`).
  
![Break Line At](https://github.com/a-bentofreire/editortoix/raw/master/vsx/assets/demo/break-line-at.gif)
  
## Utilities

| Utility  | Example |
| ------------- | ------------- |
|Capitalize|**before**: `classNameFunc`<br>**after**: `ClassNameFunc`|
|Camel Case|**before**: `ClassNameFunc`<br>**after**: `classNameFunc`|
|Dash Case|**before**: `ClassNameFunc`<br>**after**: `class-name-func`|
|Cycle Case|**before**: `_ClassNameFunc`<br>**after**: `_classNameFunc -> _CLASS_NAME_FUNC -> _class_name_func -> _class-name-func -> _class name func ->_ClassNameFunc`|
|Add Space before Uppercase<br>**Useful to transform functions names into documentation**|**before**: `doActionBefore`<br>**after**: `do Action Before`|
|Url Encode|**before**: `https://github.com`<br>**after**: `https%3A%2F%2Fgithub.com`|
|Url Decode|**before**: `https%3A%2F%2Fgithub.com`<br>**after**: `https://github.com`|
|Reverse Assignment<br>**Reverses the terms of assignments or equal/different comparisons**|**before**: `x == y[x] + 5`<br>**after**: `y[x] + 5 == x`|
|Unix To Win Slash<br>**Converts slashes to backslashes**|**before**: `chocolate/candy`<br>**after**: `chocolate\candy`|
|Win To Unix Slash<br>**Converts backslashes to slashes**|**before**: `chocolate\candy`<br>**after**: `chocolate/candy`|
|Single To Double Slash|**before**: `find\nagain`<br>**after**: `find\\\nagain`|
|Double To Single Slash|**before**: `find\\\nagain`<br>**after**: `find\nagain`|
|Dash To Underscore|**before**: `find-deep-first`<br>**after**: `find_deep_first`|
|Underscore To Dash|**before**: `find_deep_first`<br>**after**: `find-deep-first`|
|Regnize<br>**Adds slash to regular expression metachars**|**before**: `(\w+)[A-Z]a*b+text`<br>**after**: `\(\\w\+\)\[A-Z\]a\*b\+text`|
|Header To Bookmark<br>**Converts markdown header text to Html Bookmark**|**before**: `Is this the header 你好?`<br>**after**: `is-this-the-header-你好`|
|Mixer<br>**Mixes lines of different sections.**|**before**:<br>`// section`<br>`abc`<br>`cde`<br>`// end-section`<br>`// section`<br>`123`<br>`345`<br>`// section`<br>**after**:<br>`abc`<br>`123`<br>`cde`<br>`345`|
|Remove Duplicated Lines<br>**Removes consecutive duplicated lines**|**before**:<br>`first`<br>`second`<br>`second`<br><br>**after**:<br><br>`first`<br>`second`|
|Remove Empty Lines|**before**:<br>`first`<br><br>`second`<br><br>**after**:<br><br>`first`<br>`second`|
|Join Lines<br>**Joins lines adding the computed expression at the end of every line**|**before**:<br>`red`<br>`green`<br><br>**after**:<br>`expr:(x\c{X0A}),`<br>`red(x0A),green(x0B)`|
|Split Lines<br>**Split lines by an expression. Dynamic values aren't supported**|**before**:<br>`red,green`<br><br>**after**:<br>`expr: = \c{1}`<br>`red = 1`<br>`green = 2`|
|Sort Numerically Ascending<br>**For each line uses the first number as sort key**|**before**:<br>`10. red`<br>`2. green`<br><br>**after**:<br><br>`2. green`<br>`10. red`|
|Sort Numerically Descending<br>**For each line uses the first number as sort key**|**before**:<br>`10. red`<br>`2. green`<br><br>**after**:<br><br>`10. red`<br>`2. green`|
|Indent One Space<br>**Adds one space to the beginning of each line**||
|Outdent One Space<br>**Removes one space to the beginning of each line**||
|Break Line At<br>**Break lines at a certain position**|**before**:<br>`Too long line`<br>**after**:<br>`too long`<br>`line`|
|Replace Recipes<br>**replaces text from a list of pre-defined recipes (read Replace Recipes section)**|`replace text`|
|Insert ISO Date|`2018-02-08`|
|Insert ISO TimeDate|`2018-02-08 10:12:15`|
|Insert UUID|`7fff60f8-91e8-40ba-9053-56b0f3a487f0`|
|Insert Text At End|**before**:<br>`red`<br>`green`<br><br>**after**:<br>`expr: = \c{1}`<br>`red = 1`<br>`green = 2`|
|Insert Text At Start|**before**:<br>`red`<br>`green`<br><br>**after**:<br>`expr: const \e{upper} =`<br>`const RED = red`<br>`const GREEN = green`|
|Extract Text<br>**Copies to the clipboard the captured group of a regular expression. Each capture is separated by tabs**|`(\w+) = (\w+)`|

## Selection Policies

### [vsx](#availability)

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

## Expressions [vsx](#availability)

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

## Replace Recipes [vsx](#availability)

Replace Recipes must be added manually to the `settings.json`.  
This tool is still in beta phase.  

| Field  | Type | Description |
| ------------- | ------------- | ------------- |
|name|string| Recipe name |
|pattern|string| Find Expression (RegExp or String) |
|replaceWith|string| Replace Text |
|isRegExp|boolean| if `false` then pattern is a static string |
|isExpression|boolean| if `false` then result doesn't exec the expression engine |
|ignoreCase|boolean| if `true` and `isRegExp` uses `ignore case` option |

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

   Note: This project will be merged into a single repository, which is now [BracketsToIX](https://github.com/a-bentofreire/editortoix), but it will be renamed into EditorToIX.

- Spread the word
- Follow me:
  - [Github](https://github.com/a-bentofreire)
  - [LinkedIn](https://www.linkedin.com/in/abentofreire)
  - [Twitter/X](https://x.com/devtoix)

## License

MIT License

## Copyrights  
  
© 2022-2024 [Alexandre Bento Freire](https://www.a-bentofreire.com)  
