#!/bin/bash
# If you are running Windows, install GitHub for Windows, add it to the search path, and install a zip.exe for windows 

size=$((`find dist/bracketstoix.zip -printf %s`/1024))
rm -f -r dist/
mkdir dist
cat README-dev.md | sed 's/$/  /' > README.md
find -type d -maxdepth 1 | perl -n -e 'if(!/\.git/ && !/dist/ && !/icomoon/ && !/tests/ && !/compressors/ && !/.sass-cache/) { s/^\.(.+)/cp -r .\1 dist\1/; print;}' | bash
find -type f -maxdepth 1 | perl -n -e 'if(!/\.git/ && !/\.sh/ && !/-dev/) { s/^\.(.+)/cp -r .\1 dist\1/; print;}' | bash

#Brackets doesn't recognizes after names are renamed. So I use only --compilation_level WHITESPACE_ONLY
find *.js -maxdepth 1 | perl -p -e 's/^(.+)/java -jar compressors\/compiler.jar --compilation_level WHITESPACE_ONLY --language_in=ECMASCRIPT5 --js_output_file dist\/\1 --js \1/;' | bash 

cat package.json | perl -p -e "s/__size__/only $((size))kb/;" > dist/package.json
cd dist
zip -o -r -x tests/* -x *.zip -x .git/* -x *.sh -9 bracketstoix.zip *
cd ..
echo $'\nRun this script twice to list the correct zip size\n'

