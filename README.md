![Logo](assets/bracketstoix64x64.png)  
  
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
  
8. ** untag**[function] - Removes the nearest tag  
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
  
* .js6 Compiles a ECMAScript 6 into a .js file using traceur compiler.  
* .scss Compiles a .scss into a .css file using sass compiler.  
* .js Minifies a .js file into a .min.js file using minifier  
  
To prevent from creating an oversize plug-in, the compilers must be installed manually:  
  
* To install sass compiler, follow the instructions on this link: [sass compiler][1]  
* To install traceur, first install [nodejs][2], and then from the shell, execute "npm install -g traceur"  
* To install traceur, first install [nodejs][2], and then from the shell, execute "npm install -g uglify-js"  
  
By default, the compile on save is not active. You can use the **Options** to activate it  
  
[1]: http://sass-lang.com/  
[2]: http://nodejs.org/  
  
## Lorem Ipsum  
  
Inserts the classical lorem ipsum with options on the number of paragraphs, wrap, and max characters per line.  
  
## Dialog Commands  
  
  * **Commands** - Displays a dialog box with the list of the commands to be executed.   
Use {{in}}, {{inpath}}, {{infile}}, {{out}}, {{outpath}}, {{outfile}} macros  
  
  * **Commands Mapper** - Allows you to define which commands are on the menu, and its associate shortcuts.  
  * **Options** - Configuration dialog  
  
## Version History  
* 3.2     [http://www.apptoix.com/blog/?p=141]   
    Added Project Tab on Options Dialog  
    Fixed button action on Options Dialog  
  
* 3.1     [http://www.apptoix.com/blog/?p=138]   
    Added After Save Events  
    Compile on Save fixed for Save All  
    Translations moved to a single file: nls/i18n-dev.tsv. Use node tools/txt2nls.js to build nls/[lang]/strings.js  
      
* 3.0     [http://www.apptoix.com/blog/?p=132]   
    Added Execute command  
    IX Menu supports execution of external Tools  
    Added Tools tab to te Options dialog   
    Dialogs' header include social icons  
    Internal improvements  
      
* 2.12    [http://www.apptoix.com/blog/?p=126]  
    Fixed a critical bug in version 2.11, where .txt files became uppercase on save.  
      
* 2.11    [http://www.apptoix.com/blog/?p=120]  
    Added Before Save events  
    UI of Options dialog revamped       
    Fixed Portuguese translation of Trim Leading/Trailing  
    Fixed header of Command Mapper      
      
* 2.10      [http://www.apptoix.com/blog/?p=113]  
    Tag command supports multiple classes. ex: d#idvalue.class1.class2  
    Compiler command supports .js minification. Must install uglify-js. Configurable using the IX  Options dialog  
    Several internal changes  
  
* 2.9       [http://www.apptoix.com/blog/?p=91]  
    ExtractortoIX improved with multiple parameter matching, and split marker  
    Split function improved with support for \t and \n  
	Tag bug fixed  
  
* 2.8       [http://www.apptoix.com/blog/?p=82]  
	Logo updated  
	ReplacetoIX improved support for enumerated lists: #{d}#, #{nd}#, #{0nd}#, #{X}#  
  
* 2.7       [http://www.apptoix.com/blog/?p=51]  
    Added Paste to the Editor Context Menu      
    Declare JSLint Global has improved support for global statement across multiple lines  
      
* 2.6       [http://www.apptoix.com/blog/?p=37]  
    Added Cut/Copy to the Editor Context Menu (it can be disactivated on IX->Options)  
    German translation improved: Contribution of Christian Knappke [https://github.com/k5e]   
      
* 2.5       [http://www.apptoix.com/blog/?p=28]  
    Add German translation: Contribution of Christian Knappke [https://github.com/k5e]   
      
* 2.4     [http://www.apptoix.com/blog/?p=26]  
    Fixed bug running on Ubuntu  
      
* 2.3     [http://www.apptoix.com/blog/?p=22]  
    Recent Files: It no longer adds _brackets_* files  
    Recent Files: Double Click selects the file and closes dialog  
    Recent Files: Supports Horizontal/Vertical View Splits  
    Supports localization  
    Added Portuguese translations  
    Internal improvements  
      
      
* 2.2     [http://www.apptoix.com/blog/?p=13]  
    Fixed Recent Files, and improved UI  
    Win to Unix renamed as Win to Unix Slash. Unix to Win renamed as Unix to Win Slash.      
    Fixed hotkeys in case of lowercase metachars        
  
* 2.1  
    Adds: Recent Files  
    Improved Declare JSLint Global, and fixed when it contains vars with one character length  
    Fixed selection policy which affected ToggleQuotes  
    Fixed Split command bug  
    Fixed ReplacetoIX numbering when Start Value = 0     
  
* 2.0  
    Menu redesigned  
    Adds: Break Line At, Lorem Ipsum  
    Fixed save of context menu commands  
    Improved reverse  
    Fixed function selection policy that affected commands such Reverse  
      
* 1.8  
    Adds: Declare JSLint Global  
  
* 1.7   
    Adds: Reverse, Browse File commands  
    ReplacetoIX supports numbering  
    Fixes regnize  
      
* 1.6  
    Adds: Single Quote To Double, Double To Single Quote, Toggle Quote commands  
    Adds: Tag, Untag command  
  
    Github moved to https://github.com/apptoix/bracketstoix  
    Adds: About dialog  
    Supports Compass compiler  
    External commands support  {{in}}, {{inpath}}, {{infile}}, {{inrelfile}}, {{out}}, {{outpath}}, {{outfile}}, {{outrelfile}} macros  
    JSDoc command also supports function defined as prototype, variable, and property   
    Dialogs' Labels are clickable  
    Fixes: word selection policy  
    Fixes: ReplacetoIX for * char when Regular Expression isn't selected  
    Removed external dependencies  
  
* 1.5 - Summer break Edition  
    Adds: Html Report, Function JSDoc commands  
  
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
    Adds: rgb-hex, Markdown Trim Trailing commands  
      
    Disactivated: 'current editor is re-activated after a dialog box'. Due a brackets bug that doesn't preventDefault on ENTER key  
    ReplacetoIX: Uses the selected line as Find. Always empties replace. Supports Only Selection  
      
* 1.2.3  
    Dialogs: Supports transparency slider  
  
* 1.2.2  
    Adds: Regnize to ExtractortoIX and ReplacetoIX dialogs      
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
  
This extension was created and tested on Windows 8.1,  
feedback of bugs on this and other platforms are welcome.  
  
## Copyrights  
  
Copyright (c) 2015 ApptoIX Limited  
Author Alexandre Bento Freire  
  
## License  
  
MIT license  
