# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [3.7.1]
### Changed
- Fix $.getJSON.error bug.
- Disable require.config.


## [3.7.0]
### Added
- Add utility: `cycleCase`.

## [3.6.1]
### Added
- Add support php variables in reverseAssignment utility.

## [3.6.0]
### Changed
- (DEV) Move the common code with atomtoxi to folder `common`.
> This is a major port, where the moved code was ported to typescript namespaces  
> and the way it was executed had to be ported to be as similar as possible as atomtoix.
### Added
- Add indentOneSpace, outdentOneSpace utilities.


## [3.5.0] - 2018-08-27.
### Added
- Add DashCase utility.
### Fixed
- Partial CHANGELOG cleanup.
### Changed
- Update social links and copyrights.


## [3.4.2] - 2018-07-27.
### Added
- Add badges to README.
- Add UrlDecode to README.

### Changed
- (DEV) Clean and modernize the code and add typescript types.

### Fixed
- Fix the unnecessary requirement of non-empty stepValue in ReplacetoIX.


## [3.4.0] - 2018-02-13.
### Changed
- Changed the copyright owner to a-bentofreire.
- Github moved to https://github.com/a-bentofreire/bracketstoix.
- License changed to MIT+uuid https://github.com/a-bentofreire/uuid-licenses/blob/master/MIT-uuid-license.md.
- Simplified the License lines on the source code.
- Cleaned README.md.
- Code ported to Typescript.
- Version Info moved to CHANGELOG.md.
- Change Log adheres [Keep a Changelog](http://keepachangelog.com/en/1.0.0/).

### Fixed
- Fix the PanelManager which caused the plugin to stop working due Brackets API deprecated the PanelManager.
- Fix the OK button on the dialogs.
- Fix the dialog transparency.
- Fix the about dialog.

### Deprecated
- Social Media icons.


## [3.3.0]
### Added
- Add UrlDecode.
- Add Traditional and Simplified Chinese.

### Changed
- Updated icon.
- Updated links.


## [3.2.0]
### Added
- Add Project Tab on Options Dialog.

### Fixed
- Fix button action on Options Dialog.


## [3.1.0]
### Added
- Add After Save Events.

### Fixed
- Compile on Save Fix for Save All.

### Changed
- Translations moved to a single file: nls/i18n-dev.tsv. Use node tools/txt2nls.js to build nls/[lang]/strings.js.


## [3.0.0]
### Added
- Add Execute command.
- Add Tools tab to te Options dialog.
- IX Menu supports execution of external Tools.

### Changed
- Dialogs' header includes social icons.
- Internal improvements.


## [2.2.0]
### Fixed
- Fix a critical bug in version 2.11, where .txt files became uppercase on save.


## [2.1.0]
### Added
- Add Before Save events.

### Changed
- UI of Options dialog revamped.

### Fixed
- Fix Portuguese translation of Trim Leading/Trailing.
- Fix header of Command Mapper.


## [2.0.0]
- Tag command supports multiple classes. ex: d#idvalue.class1.class2.
- Compiler command supports .js minification. Must install uglify-js. Configurable using the IX  Options dialog.
- Several internal changes.


## [2.9.0]
### Added
- Improve ExtractortoIX  with multiple parameter matching, and split marker.
- Improve Split function with support for \t and \n.

### Fixed
- Fix Tag bug.

## [2.8.0]
### Changed
- Update Logo update.

#### Added
- Improve ReplacetoIX support for enumerated lists: #{d}#, #{nd}#, #{0nd}#, #{X}#.

## [2.7.0]
#### Added
- Add Paste to the Editor Context Menu.
- Improve Declare JSLint Global support for global statement across multiple lines.

## [2.6.0]
#### Added
- Add Cut/Copy to the Editor Context Menu (it can be disactivated on IX->Options).
- Improve German translation: Contribution of Christian Knappke [https://github.com/k5e].

## [2.5.0]
### Added
- Add German translation: Contribution of Christian Knappke [https://github.com/k5e].

## [2.4.0]
### Fixed
- Fix bug running on Ubuntu.

## [2.3.0]
- Recent Files: It no longer adds _brackets_* files.
- Recent Files: Double Click selects the file and closes dialog.
- Recent Files: Supports Horizontal/Vertical View Splits.
- Supports localization.
- Add Portuguese translations.
- Internal improvements.

## [2.2.0]
### Fixed
- Fix Recent Files, and improved UI.
- Fix hotkeys in case of lowercase metachars.

### Changed
- Win to Unix renamed as Win to Unix Slash.
- Unix to Win renamed as Unix to Win Slash.

## [2.1.0]
- Add Recent Files.
- Improved Declare JSLint Global, and Fix when it contains vars with one character length.
- Fix selection policy which affected ToggleQuotes.
- Fix Split command bug.
- Fix ReplacetoIX numbering when Start Value = 0.

## [2.0.0]
- Menu redesigned.
- Add Break Line At, Lorem Ipsum.
- Fix save of context menu commands.
- Improved reverse.
- Fix function selection policy that affected commands such Reverse.

## [1.8.0]
- Add Declare JSLint Global.

## [1.7.0]
- Add Reverse, Browse File commands.
- ReplacetoIX supports numbering.
- Fix regnize.

## [1.6.0]
- Add Single Quote To Double, Double To Single Quote, Toggle Quote commands.
- Add Tag, Untag command.
- Github moved to https://github.com/apptoix/bracketstoix.
- Add About dialog.
- Supports Compass compiler.
- External commands support  {{in}}, {{inpath}}, {{infile}}, {{inrelfile}}, {{out}}, {{outpath}}, {{outfile}}, {{outrelfile}} macros.
- JSDoc command also supports function defined as prototype, variable, and property.
- Dialogs' Labels are clickable.
- Fix word selection policy.
- Fix ReplacetoIX for * char when Regular Expression isn't selected.
- Remove external dependencies.

## [1.5.0]
- Add Html Report, Function JSDoc commands.
- ReplacetoIX: Supports multiline.
- ExtractortoIX, ReplacetoIX: Visual improvements in the Dialog Box.

## [1.4.0]
- Extension description displays the correct .zip size.
- Implements a workaround for the ENTER key.
- Editor focused after a dialog box.
- Dialogs support history.
- When there is no text selected, and after a command execution, the cursor is set to its previous position.
- Command Mapper also supports Context Menus.


## [1.3.0]
- Add rgb-hex, Markdown Trim Trailing commands.
- Deactivated: 'current editor is re-activated after a dialog box'. Due a brackets bug that doesn't preventDefault on ENTER key.
- ReplacetoIX: Uses the selected line as Find. Always empties replace. Supports Only Selection.


## [1.2.3]
- Dialogs: Supports transparency slider.


## [1.2.2]
- Add Regnize to ExtractortoIX and ReplacetoIX dialogs.
- The current editor is re-activated after a dialog.


## [1.2.1]
- Fix Documentation errors.


## [1.2.0]
- Add Commands Regnize, ExtractortoIX, ReplacetoIX.
- Add Intelligent usage.
- Dialogs support ESC char, and auto-focus 1st field.
- Commands dialog shows sorted list of commands.
- Fix Command command.
- Root scripts are whitespace compressed with Google Closure.


## [1.1.0]
- Add Commands Eliminate Empty lines, HtmlDecode.
- Fix Documentation errors.
