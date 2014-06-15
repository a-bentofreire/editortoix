#!/bin/bash
#If running Windows. Install GitHub for Windows. Add it to the search path. And install a zip.exe for windows 
rm -f -r dist/
mkdir dist
cat README-dev.md | sed 's/$/  /' > README.md
find -type d -maxdepth 1 | perl -n -e 'if(!/\.git/ && !/dist/ && !/tests/ && !/compressors/) { s/^\.(.+)/cp -r .\1 dist\1/; print;}' | bash
find -type f -maxdepth 1 | perl -n -e 'if(!/\.git/ && !/\.sh/ && !/-dev/) { s/^\.(.+)/cp -r .\1 dist\1/; print;}' | bash
#Brackets doesn't recognizes after names are renamed. So I use only --compilation_level WHITESPACE_ONLY
find *.js -maxdepth 1 | perl -p -e 's/^(.+)/java -jar compressors\/compiler.jar --compilation_level WHITESPACE_ONLY --language_in=ECMASCRIPT5 --js_output_file dist\/\1 --js \1/;' | bash 
cd dist
zip -o -r -x tests/* -x *.zip -x .git/* -x *.sh -9 bracketstoix.zip *
cd ..
read -p "Press ENTER to finish"

