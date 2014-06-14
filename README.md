# BracketstoIX extension  g
  g
This extension adds a bundle of features to Adobe Brackets.  g
  g
## Interface  g
  g
BracketstoIX adds an top-menu called 'IX'.    g
To prevent from cluttering the menu with all the commands, only a few commands were added to the menu.    g
Use Command mapper to add which ones you prefer, and setup the shortcuts.    g
No default shortcuts were define to prevent collision with other plugins.    g
  g
## Intelligent Usage  g
  g
Most of the commands operate on selected text.  g
If no text is selected, a command will:  g
[word] - Use the nearest word (before and after the cursor)  g
[sentence] - All the nearest text until a whitespace or newline  g
[all] - Use all the editor text  g
  g
## Text Transformations  g
  g
The list of commands are:    g
1. Case Change[word]: **UpperCase**, **LowerCase**[word], **Capitalize**, **CamelCase**  g
2. Encoders/Decoders[line]: **HtmlEncode**, **HtmlDecode**, **UrlEncode**  g
3. Slash Change [line]: **Unix To Win**, **Win To Unix**, **Single Slash To Double**, **Double To Single Slash**    g
4. Spacing[all]: **Tab To Space**, **Space To Tab**  -   Space to Tab only works with leading spaces    g
5. Line Commands[all]:    g
  g
  * **Join**, **Split**  g
  * **Number** - this commands add a number prefix to every selected line  g
  * **Trim Leading**, **Trim Trailing**    g
  * **Sort Ascending**, **Sort Descending**, **Eliminate Empty lines**   g
  * **Remove Duplicates** - only works with already sorted lines    g
  g
## Clipboard Commands    g
  g
**Copy Filename**, **Copy Fullname** - will copy the filename of the active file to the clipboard    g
**Regnize**[sentence] - Copies to clipboard the text with all the regular expression special characters slashed.    g
  This command simplifies the usage of on find/replace dialogs.  g
**ExtractortoIX**[all] - Copies to clipboard all the text matches. One per line.  g
  g
##  ReplacetoIX Command  g
  g
This command provides a replace dialog with the following options:    g
* Ignore Case  g
* Word Only  g
* Replace All  g
  g
Just like all the other commands only operates on the selected text, if not text is selected it uses all the text  g
  g
## Internet Search Commands    g
  g
**Open Url**[sentence], **Web Search**[word] will open an external web browser with selected text either an url(**Open Url**) or text(**Web Search**)    g
  g
## Compiler  g
  g
**Compiler** command with execute an external compiler. Supported file formats:    g
  g
* .js6 Compiles a ECMAScript 6 into a .js file using traceur compiler.    g
* .scss Compiles a .scss into a .css file using sass compiler.  g
   g
To prevent from creating an oversized plug-in, the compilers must be installed manually:    g
  g
* To install sass compiler, follow the instructions on this link: [sass compiler][1]  g
* To install traceur, first install [nodejs][2], and then from the shell, execute "npm install -g traceur"  g
   g
By default, the compile on save is not active. You can use the **Options** to activate it  g
  g
[1]: http://sass-lang.com/  g
[2]: http://nodejs.org/  g
  g
## Dialog Commands  g
  g
  * **Commands** - Displays a dialog box with the list of the commands to be executed.  g
  * **Commands Mapper** - Allows to define which commands are on the menu, and associate shortcuts.  g
  * **Options** - Configuration dialog  g
  g
## Version History  g
  g
* 1.1   g
    New Commands: Eliminate Empty lines, HtmlDecode.   g
    Fixes: Documentation errors  g
      g
* 1.2  g
    New Commands: Regnize, ExtractortoIX, ReplacetoIX  g
    New Intelligent usage  g
    Dialogs support ESC char, and auto-focus 1st field  g
    Commands dialog shows sorted list of commands  g
    Fixes: Command command  g
    Root scripts are whitespace compressed with Google Closure   g
  g
  g
## Roadmap  g
  g
These are the plans for next versions implementations:    g
  g
* Dialogs: Select the active editor after closing a dialog.  g
* Dialogs: Support transparency  g
* Go back to the previous edit cursor positions  g
* Text transforms: **Num To Hex**, **Hex To Num**    g
* Trim Trailing on save    g
* Display the compilation error on a bottom panel    g
* File Extension mapper. Ex: inc->php    g
* Code snippets   g
* Run grunt    g
* Run node scripts    g
* Run python scripts    g
  g
## Feedback  g
  g
This extension was created and tested on Windows 8.1,  g
feedback of bugs on this and other platforms are welcome.  g
  g
## License ##  g
  g
MIT license  g
  g
