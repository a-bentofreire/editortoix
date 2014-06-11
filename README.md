# BracketstoIX extension

This extension adds a bundle of features to Adobe Brackets.

## Interface

BracketstoIX adds an top-menu called 'IX'.  
To prevent from cluttering the menu with all the commands, only a few commands were added to the menu.  
Use Command mapper to add which ones you prefer, and setup the shortcuts.  
No default shortcuts were define to prevent collision with other plugins.  

## Text Transformations

This commands will **only** operate the selected text.  
The list of commands are:  
1. Case Change: **UpperCase**, **LowerCase**, **Capitalize**, **CamelCase**  
2. Encoders: **HtmlEncode**, **UrlEncode**  
3. Slash Change: **Unix To Win**, **Win To Unix**, **Single Slash To Double**, **Double To Single Slash**  
4. Spacing: **Tab To Space**, **Space To Tab**  -   Space to Tab only works with leading spaces  
5. Line Commands:  

  * **Join**, **Split**
  * **Number** - this commands add a number prefix to every selected line
  * **Trim Leading**, **Trim Trailing**  
  * **Sort Ascending**, **Sort Descending** 
  * **Remove Duplicates**  - only works with already sorted lines  

## Clipboard Commands  

**Copy Filename**, **Copy Fullname** will copy the filename of the active file to the clipboard  

## Internet Search Commands  

**Open Url**, **Web Search** will open an external web browser with selected text either an url(**Open Url**) or text(**Web Search**)  

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

## Roadmap

These are the plans for next versions implementations:  

* Text transforms: **HtmlDecode**, **Num To Hex**, **Hex To Num **  
* Line Commands: **Eliminate Empty lines**  
* Trim Trailing on save  
* Display the compilation error on a bottom panel  
* File Extension mapper. Ex: inc->php  
* Code snippets 
* Run grunt  
* Run node scripts  
* Run python scripts  
* Add escape on the dialogs

## Feedback

This extension was created and tested on Windows 8.1,
feedback of bugs on this and other platforms are welcome.

## License ##

MIT license

