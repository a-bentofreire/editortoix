# Description

This is documentation specific to Phoenix Editor.

## Utilities

### Encoders/Decoders
  
| Line Utility  | Example |
| ------------- | ------------- |
|Html Encode|**before**:`<h1>Title</h1>`<br>**after**:`&lt;h1&gt;Title&lt;/h1&gt`|
|Html Decode|**before**:`&lt;h1&gt;Title&lt;/h1&gt`<br>**after**:`<h1>Title</h1>`|
  
### Quote Change
  
| Line Utility  | Example |
| ------------- | ------------- |
|Single To Double Quote|**before**:`find'again`<br>**after**:`find"again`|
|Double To Single Quote|**before**:`find"again`<br>**after**:`find'again`|
|Toggle Quote|**before**:`find"again'`<br>**after**:`find'again"`|

### Spacing
  
| Document Utility  | Example |
| ------------- | ------------- |
|Tab To Space<br>**Space to Tab only works with leading spaces**||
|Space To Tab<br>**Space to Tab only works with leading spaces**||
  
### Line Commands
  
| Document Utility  | Example |
| ------------- | ------------- |
|Number<br>**It adds a number prefix to every selected line**||
|Trim Leading||
|Trim Trailing||
|Sort Ascending||
|Sort Descending||
|Markdown Trim Trailing<br>**Trims trailing spaces and adds 2 trailing spaces**||
|Break line at<br>**Breaks lines to have a maximum of N chars, with word break option**||
  
## More Text Transformations
  
The list of commands are:
2. **rgb-hex**[sentence] - Converts from #HHHHHH to rgb(dec, dec, dec) and vice-versa. It supports multiple conversions
3. **tag**[sentence] - Uses the 1st word of the selected text as html tag, and surrounds the remaining the text with nearest text.
The most common tags have shortcuts: bu=button  d=div   sp=span  te=textarea   in=input
```
Ex: d -> <div></div>       h3#hello.active.other text -> <h3 id="hello" class="active other">text</h3>
```
4. **untag**[function] - Removes the nearest tag
5. **Reverse**[function] - Reverses the terms in a assignment or comparison.
6. **Declare JSLint Global**[word] - Adds the selected id to the /*global ... */ list
  
##  Dialogs
  
Input fields on the dialogs support history (CTRL+UP/DOWN).
  
## Clipboard Commands
  
**Copy Filename**, **Copy Fullname** - Copies the filename of the active file to the clipboard
**Regnize**[sentence] - Copies to clipboard the text with all the regular expression special characters slashed.
  This command simplifies the usage of on find/replace dialogs.
**ExtractortoIX**[all] - Copies to clipboard all the text matches. One per line.
  
##  ReplacetoIX Command
  
This command provides a replace dialog with the following options:
* Ignore Case
* Word Only
* Replace All
* Only Selection
* Multiline
* Start Value (use for numbering)
* Step Value  (use for numbering)
  
Just like all the other commands, it only operates on the selected text(only selection mode), if no text is selected it uses all the text.
  
##  Html Report Command
  
This command will copy to the clipboard a list of all the id's, classes and stylesheets used on the current html file [all].
  
## Internet Search Commands
  
**Open Url**[sentence], **Web Search**[word] will open an external web browser with selected text either an url(**Open Url**) or text(**Web Search**)
  
## Function JSDoc Command
  
This command will create a JSDoc function skeleton of the function where the cursor is located.
Ex:
```
function foo(param1, param2) { }
```
  
Will become:
```
/**
* foo
* @param {} param1
* @param {} param2
* @return {}
*/
function foo(param1, param2) { }
```
  
Also supports privates methods:
```
function _foo() { }
```
  
Will become:
```
/**
* @private
* _foo
* @return {}
*/
function _foo() { }
```
  
## Recent Files Command
  
Displays of the all recent opened files. This list is independent of the project.
  
## Compiler
  
**Compiler** command with execute an external compiler. Supported file formats:
  
* .js6 Compiles a ECMAScript 6 into a `.js` file using traceur compiler.    
* .scss Compiles a `.scss` into a `.css` file using sass compiler.    
* .js Minifies a `.js` file into a `.min.js` file using minifier    
  
To prevent from creating an oversize plug-in, the compilers must be installed manually:
  
* To install sass compiler, follow the instructions on this link: [sass compiler][1]
* To install traceur, first install [nodejs][2], and then from the shell, execute `npm install -g traceur`    
* To install traceur, first install [nodejs][2], and then from the shell, execute `npm install -g uglify-js`    
  
By default, the compile on save is not active. You can use the **Options** to activate it
  
[1]: https://sass-lang.com/
[2]: https://nodejs.org/
  
## Lorem Ipsum
  
Inserts the classical lorem ipsum with options on the number of paragraphs, wrap, and max characters per line.
  
## Dialog Commands
  
  * **Commands** - Displays a dialog box with the list of the commands to be executed.
Use `{{in}}, {{inpath}}, {{infile}}, {{out}}, {{outpath}}, {{outfile}}` macros
  
  * **Commands Mapper** - Allows you to define which commands are on the menu, and its associate shortcuts.
  * **Options** - Configuration dialog
  