# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [3.4.1] - 2018-07-27
### Added
- Add badges to README
- Add UrlDecode to README
### Changed
- (DEV) Clean and modernize the code and add typescript types

## [3.4.0] - 2018-02-13
### Changed
- Changed the copyright owner to a-bentofreire
- Github moved to https://github.com/a-bentofreire/bracketstoix
- License changed to MIT+uuid https://github.com/a-bentofreire/uuid-licenses/blob/master/MIT-uuid-license.md
- Simplified the License lines on the source code
- Cleaned README.md
- Code ported to Typescript
- Version Info moved to CHANGELOG.md
- Change Log adheres [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
### Fixed
- Fixed the PanelManager which caused the plugin to stop working due Brackets API deprecated the PanelManager
- Fixed the OK button on the dialogs
- Fixed the dialog transparency
- Fixed the about dialog
### Deprecated
- Social Media icons


## [3.3.0]
### Added
- Added UrlDecode
- Added Traditional and Simplified Chinese
### Changed
- Updated icon
- Updated links

## [3.2.0]
### Added
- Added Project Tab on Options Dialog
### Fixed
- Fixed button action on Options Dialog

## [3.1.0]
### Added
- Added After Save Events
### Fixed
- Compile on Save fixed for Save All
### Changed
- Translations moved to a single file: nls/i18n-dev.tsv. Use node tools/txt2nls.js to build nls/[lang]/strings.js

## [3.0.0]
### Added
- Added Execute command
- Added Tools tab to te Options dialog
- IX Menu supports execution of external Tools
### Changed
- Dialogs' header includes social icons
- Internal improvements

## [2.2.0]
### Fixed
- Fixed a critical bug in version 2.11, where .txt files became uppercase on save.

## [2.1.0]
### Added
- Added Before Save events
### Changed
- UI of Options dialog revamped
### Fixed
- Fixed Portuguese translation of Trim Leading/Trailing
- Fixed header of Command Mapper

## [2.0.0]
- Tag command supports multiple classes. ex: d#idvalue.class1.class2
- Compiler command supports .js minification. Must install uglify-js. Configurable using the IX  Options dialog
- Several internal changes

## [2.9.0]
- ExtractortoIX improved with multiple parameter matching, and split marker
- Split function improved with support for \t and \n
- Tag bug fixed

## [2.8.0]
- ReplacetoIX improved support for enumerated lists: #{d}#, #{nd}#, #{0nd}#, #{X}#
- Logo updated

## [2.7.0]
- Added Paste to the Editor Context Menu
- Declare JSLint Global has improved support for global statement across multiple lines

## [2.6.0]
- Added Cut/Copy to the Editor Context Menu (it can be disactivated on IX->Options)
- German translation improved: Contribution of Christian Knappke [https://github.com/k5e]

## [2.5.0]
- Added German translation: Contribution of Christian Knappke [https://github.com/k5e]

## [2.4.0]
- Fixed bug running on Ubuntu

## [2.3.0]
- Recent Files: It no longer adds _brackets_* files
- Recent Files: Double Click selects the file and closes dialog
- Recent Files: Supports Horizontal/Vertical View Splits
- Supports localization
- Added Portuguese translations
- Internal improvements

## [2.2.0]
- Fixed Recent Files, and improved UI
- Win to Unix renamed as Win to Unix Slash. Unix to Win renamed as Unix to Win Slash.
- Fixed hotkeys in case of lowercase metachars

## [2.1.0]
- Added Recent Files
- Improved Declare JSLint Global, and fixed when it contains vars with one character length
- Fixed selection policy which affected ToggleQuotes
- Fixed Split command bug
- Fixed ReplacetoIX numbering when Start Value = 0

## [2.0.0]
- Menu redesigned
- Added Break Line At, Lorem Ipsum
- Fixed save of context menu commands
- Improved reverse
- Fixed function selection policy that affected commands such Reverse

## [1.8.0]
- Added Declare JSLint Global

## [1.7.0]
- Added Reverse, Browse File commands
- ReplacetoIX supports numbering
- Fixed regnize

## [1.6.0]
- Added Single Quote To Double, Double To Single Quote, Toggle Quote commands
- Added Tag, Untag command
- Github moved to https://github.com/apptoix/bracketstoix
- Added About dialog
- Supports Compass compiler
- External commands support  {{in}}, {{inpath}}, {{infile}}, {{inrelfile}}, {{out}}, {{outpath}}, {{outfile}}, {{outrelfile}} macros
- JSDoc command also supports function defined as prototype, variable, and property
- Dialogs' Labels are clickable
- Fixed word selection policy
- Fixed ReplacetoIX for * char when Regular Expression isn't selected
- Removed external dependencies

## [1.5.0]
- Added Html Report, Function JSDoc commands
- ReplacetoIX: Supports multiline
- ExtractortoIX, ReplacetoIX: Visual improvements in the Dialog Box

## [1.4.0]
- Extension description displays the correct .zip size
- Implements a workaround for the ENTER key.
- Editor focused after a dialog box
- Dialogs support history
- When there is no text selected, and after a command execution, the cursor is set to its previous position
- Command Mapper also supports Context Menus

## [1.3.0]
- Added rgb-hex, Markdown Trim Trailing commands
- Deactivated: 'current editor is re-activated after a dialog box'. Due a brackets bug that doesn't preventDefault on ENTER key
- ReplacetoIX: Uses the selected line as Find. Always empties replace. Supports Only Selection

## [1.2.3]
- Dialogs: Supports transparency slider

## [1.2.2]
- Added Regnize to ExtractortoIX and ReplacetoIX dialogs
- The current editor is re-activated after a dialog.

## [1.2.1]
- Fixed Documentation errors

## [1.2.0]
- Added Commands Regnize, ExtractortoIX, ReplacetoIX
- Added Intelligent usage
- Dialogs support ESC char, and auto-focus 1st field
- Commands dialog shows sorted list of commands
- Fixed Command command
- Root scripts are whitespace compressed with Google Closure

## [1.1.0]
- Added Commands Eliminate Empty lines, HtmlDecode.
- Fixed Documentation errors
