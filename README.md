![Logo](bracketstoix.png)  
  
# BracketstoIX extension  
  
This extension adds a bundle of features to Adobe Brackets.  
  
## Interface  
  
BracketstoIX adds a top-menu called 'IX'.  
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
  
##  Dialogs  
  
Input fields on the dialogs support history (CTRL+UP/DOWN).  
  
## Text Transformations  
  
The list of commands are:  
1. Case Change[word]: **UpperCase**, **LowerCase**, **Capitalize**, **CamelCase**  
2. Encoders/Decoders[line]: **HtmlEncode**, **HtmlDecode**, **UrlEncode**  
3. Slash Change [line]: **Unix To Win**, **Win To Unix**, **Single Slash To Double**, **Double To Single Slash**  
4. Spacing[all]: **Tab To Space**, **Space To Tab**  -   Space to Tab only works with leading spaces  
5. **rgb-hex**[sentence] - Converts from #HHHHHH to rgb(dec, dec, dec) and vice-versa. It supports multiple conversions   
  
6. Line Commands[all]:  
  
  * **Join**, **Split**  
  * **Number** - It adds a number prefix to every selected line  
  * **Trim Leading**, **Trim Trailing**  
  * **Sort Ascending**, **Sort Descending**, **Eliminate Empty lines**  
  * **Remove Duplicates** - Only works with already sorted lines  
  * **Markdown Trim Trailing** - Trims trailing spaces and adds 2 trailing spaces  
  
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
  
Just like all the other commands, it only operates on the selected text(only selection mode), if no text is selected it uses all the text.  
  
##  Html Report Command  
  
This command will copy to clipboard a list of all the id's, classes and stylesheets used in the current html file [all].  
  
## Internet Search Commands  
  
**Open Url**[sentence], **Web Search**[word] will open an external web browser with selected text either an url(**Open Url**) or text(**Web Search**)  
  
## Function JSDoc Command  
  
This command will create a JSDoc function skeleton of the function where the cursor is located.  
Ex:  
`function foo(param1, param2) { }`  
  
Will become:  
```/*** foo
* @param {} param1
* @param {} param2
* @return {}
*/
function foo(param1, param2) { }
```
  
Also supports privates methods:  
`function _foo() { }`  
  
Will become:  
```/**
* @private
* foo
* @return {}
*/
function _foo() { }
```

## Compiler  
  
**Compiler** command with execute an external compiler. Supported file formats:  
  
* .js6 Compiles a ECMAScript 6 into a .js file using traceur compiler.  
* .scss Compiles a .scss into a .css file using sass compiler.  
  
To prevent from creating an oversized plug-in, the compilers must be installed manually:  
  
* To install sass compiler, follow the instructions on this link: [sass compiler][1]  
* To install traceur, first install [nodejs][2], and then from the shell, execute "npm install -g traceur"  
  
By default, the compile on save is not active. You can use the **Options** to activate it  
  
[1]: http://sass-lang.com/  
[2]: http://nodejs.org/  
  
## Dialog Commands  
  
  * **Commands** - Displays a dialog box with the list of the commands to be executed.  
  * **Commands Mapper** - Allows to define which commands are on the menu, and associate shortcuts.  
  * **Options** - Configuration dialog  
  
## Version History  
* 1.5 - Summer break Edition  
    Adds: Html Report, Function JSDoc   
    ReplacetoIX: Supports multiline  
    ExtractortoIX, ReplacetoIX: Visual improvements in the Dialog Box  
      
* 1.4  
    Extension description displays the correct .zip size  
    Implements a workaround for the ENTER key.  
    Editor focused after a dialog box  
    Dialogs support history  
    When there is no text selected, and after a command execution, the cursor is set to his previous position  
    Command Mapper also supports Context Menus   
      
* 1.3  
    Adds: rgb-hex, Markdown Trim Trailing  
    Disactivated: 'current editor is re-activated after a dialog box'. Due a brackets bug that doesn't preventDefault on ENTER key  
    ReplacetoIX: Uses the selected line as Find. Always empties replace. Supports Only Selection  
      
* 1.2.3  
    Dialogs: Supports transparency slider  
  
* 1.2.2  
    Adds Regnize to ExtractortoIX and ReplacetoIX dialogs  
    The current editor is re-activated after a dialog.  
  
* 1.2.1  
    Fixes: Documentation errors  
  
* 1.2  
    New Commands: Regnize, ExtractortoIX, ReplacetoIX  
    New Intelligent usage  
    Dialogs support ESC char, and auto-focus 1st field  
    Commands dialog shows sorted list of commands  
    Fixes: Command command  
    Root scripts are whitespace compressed with Google Closure  
  
* 1.1  
    New Commands: Eliminate Empty lines, HtmlDecode.  
    Fixes: Documentation errors  
  
## Roadmap  
  
These are the plans for the next versions:  
  
* Go back to the previous edit cursor positions  
* Text transforms: **Num To Hex**, **Hex To Num**  
* Trim Trailing on save  
* Display the compilation error on a bottom panel  
* File Extension mapper. Ex: inc->php  
* Code snippets  
* Run grunt  
* Run node scripts  
* Run python scripts  
* Support localization  
* Clean up the code  
* Improve the User Interface  
* Improve the code documentation  
  
## Feedback  
  
This extension was created and tested on Windows 8.1,  
feedback of bugs on this and other platforms are welcome.  
  
## License  
  
MIT license  
