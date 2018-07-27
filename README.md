[![Downloads](https://badges.ml/bracketstoix/total.svg)](https://brackets-extension-badges.github.io#bracketstoix)  [![Downloads](https://badges.ml/bracketstoix/last-version.svg)](https://brackets-extension-badges.github.io#bracketstoix)  [![Downloads](https://badges.ml/bracketstoix/week.svg)](https://brackets-extension-badges.github.io#bracketstoix)  [![Downloads](https://badges.ml/bracketstoix/day.svg)](https://brackets-extension-badges.github.io#bracketstoix)  [![Version](https://badges.ml/bracketstoix/version.svg)](https://brackets-extension-badges.github.io#bracketstoix)  
  
  
  
![Logo](assets/bracketstoix64x64.png)  
  
# BracketstoIX extension  
  
This extension adds a bundle of features to Adobe Brackets.  
  
## Interface  
  
BracketstoIX adds a top-menu called `IX`.    
To prevent from cluttering the menu with all the commands, only a few commands were added to the menu.  
Use Command mapper to add which ones you prefer, and setup the shortcuts.  
No default shortcuts were define to prevent collision with other plugins.  
  
## Intelligent Usage  
  
Most of the commands operate on selected text.  
If no text is selected, a command will use:  
[word] - The nearest word (before and after the cursor)  
[sentence] - The nearest text until a whitespace or newline  
[line] - The text line where the cursor is located  
[all] - All the editor text  
[function] - A function determines the text to use. Ex: Quote functions will use all the text between quotes that surrounds the cursor.  
  
##  Dialogs  
  
Input fields on the dialogs support history (CTRL+UP/DOWN).  
  
## Text Transformations  
  
The list of commands are:  
1. Case Change[word]: **UpperCase**, **LowerCase**, **Capitalize**, **CamelCase**  
2. Encoders/Decoders[line]: **HtmlEncode**, **HtmlDecode**, **UrlEncode**  
3. Quote Change [function]: **Single Quote To Double**, **Double To Single Quote**, **Toggle Quote**  
4. Slash Change [line]: **Unix To Win**, **Win To Unix**, **Single Slash To Double**, **Double To Single Slash**  
5. Spacing[all]: **Tab To Space**, **Space To Tab**  -   Space to Tab only works with leading spaces  
6. **rgb-hex**[sentence] - Converts from #HHHHHH to rgb(dec, dec, dec) and vice-versa. It supports multiple conversions  
7. **tag**[sentence] - Uses the 1st word of the selected text as html tag, and surrounds the remaining the text with nearest text.  
The most common tags have shortcuts: bu=button  d=div   sp=span  te=textarea   in=input  
```  
Ex: d -> <div></div>       h3#hello.active.other text -> <h3 id="hello" class="active other">text</h3>  
```  
  
8. **untag**[function] - Removes the nearest tag  
9. **Reverse**[function] - Reverses the terms in a assignment or comparison.  
10. **Declare JSLint Global**[word] - Adds the selected id to the /*global ... */ list  
  
11. Line Commands[all]:  
  
  * **Join**, **Split**  
  * **Number** - It adds a number prefix to every selected line  
  * **Trim Leading**, **Trim Trailing**  
  * **Sort Ascending**, **Sort Descending**, **Eliminate Empty lines**  
  * **Remove Duplicates** - Only works with already sorted lines  
  * **Markdown Trim Trailing** - Trims trailing spaces and adds 2 trailing spaces  
  * **Break line at** - Breaks lines to have a maximum of N chars, with word break option  
  
  
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
  
##  Recent Files Command  
  
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
  
  
## Roadmap  
  
These are the plans for the next versions:  
* Default shortcuts  
* Go back to the previous edit cursor positions  
* Display the compilation error on a bottom panel  
* File Extension mapper. Ex: inc->php  
* Code snippets  
* Run grunt  
* Run node scripts  
* Run python scripts  
* Clean up the code  
* Improve the User Interface  
* Improve the code documentation  
  
## Feedback  
  
This extension was created and tested on Windows 10, Mac OS, Linux Mint,  
feedback of bugs on this and other platforms are welcome  
but don't forget the golden rule: Be Polite!  
  
## Copyrights  
  
(c) 2016-2018 Alexandre Bento Freire  
  
  
## License  
  
[MIT License+uuid License](https://github.com/a-bentofreire/uuid-licenses/blob/master/MIT-uuid-license.md)  
