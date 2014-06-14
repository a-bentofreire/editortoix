# BracketstoIX extension  
  
This extension adds a bundle of features to Adobe Brackets.  
  
## Interface  
  
BracketstoIX adds an top-menu called 'IX'.    
To prevent from cluttering the menu with all the commands, only a few commands were added to the menu.    
Use Command mapper to add which ones you prefer, and setup the shortcuts.    
No default shortcuts were define to prevent collision with other plugins.    
  
## Intelligent Usage  
  
Most of the commands operate on selected text.  
If no text is selected, a command will:  
[word] - Use the nearest word (before and after the cursor)  
[sentence] - All the nearest text until a whitespace or newline  
[line] - Uses all the text where is cursor is located  
[all] - Use all the editor text  
  
## Text Transformations  
  
The list of commands are:    
1. Case Change[word]: **UpperCase**, **LowerCase**[word], **Capitalize**, **CamelCase**  
2. Encoders/Decoders[line]: **HtmlEncode**, **HtmlDecode**, **UrlEncode**  
3. Slash Change [line]: **Unix To Win**, **Win To Unix**, **Single Slash To Double**, **Double To Single Slash**    
4. Spacing[all]: **Tab To Space**, **Space To Tab**  -   Space to Tab only works with leading spaces    
5. Line Commands[all]:    
  
  * **Join**, **Split**  
  * **Number** - this commands add a number prefix to every selected line  
  * **Trim Leading**, **Trim Trailing**    
  * **Sort Ascending**, **Sort Descending**, **Eliminate Empty lines**   
  * **Remove Duplicates** - only works with already sorted lines    
  
## Clipboard Commands    
  
**Copy Filename**, **Copy Fullname** - will copy the filename of the active file to the clipboard    
**Regnize**[sentence] - Copies to clipboard the text with all the regular expression special characters slashed.    
  This command simplifies the usage of on find/replace dialogs.  
**ExtractortoIX**[all] - Copies to clipboard all the text matches. One per line.  
  
##  ReplacetoIX Command  
  
This command provides a replace dialog with the following options:    
* Ignore Case  
* Word Only  
* Replace All  
  
Just like all the other commands only operates on the selected text, if not text is selected it uses all the text  
  
## Internet Search Commands    
  
**Open Url**[sentence], **Web Search**[word] will open an external web browser with selected text either an url(**Open Url**) or text(**Web Search**)    
  
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
  
* 1.1   
    New Commands: Eliminate Empty lines, HtmlDecode.   
    Fixes: Documentation errors  
      
* 1.2  
    New Commands: Regnize, ExtractortoIX, ReplacetoIX  
    New Intelligent usage  
    Dialogs support ESC char, and auto-focus 1st field  
    Commands dialog shows sorted list of commands  
    Fixes: Command command  
    Root scripts are whitespace compressed with Google Closure   
* 1.2.1  
    Fixes: Documentation errors  
* 1.2.2  
    Adds Regnize to ExtractortoIX and ReplacetoIX dialogs  
    The current editor is re-activated after a dialog.  
  
## Roadmap  
  
These are the plans for next versions implementations:    
  
* Dialogs: Select the active editor after closing a dialog.  
* Dialogs: Support transparency  
* Go back to the previous edit cursor positions  
* Text transforms: **Num To Hex**, **Hex To Num**    
* Trim Trailing on save    
* Display the compilation error on a bottom panel    
* File Extension mapper. Ex: inc->php    
* Code snippets   
* Run grunt    
* Run node scripts    
* Run python scripts    
  
## Feedback  
  
This extension was created and tested on Windows 8.1,  
feedback of bugs on this and other platforms are welcome.  
  
## License   
  
MIT license  
  
