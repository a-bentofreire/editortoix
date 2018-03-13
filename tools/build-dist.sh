#!/usr/bin/env bash
# If you are running Windows, install GitHub for Windows, add it to the search path, and install a zip.exe for windows

cd `dirname $0`/..
size=$((`find dist/bracketstoix.zip -printf %s`/1024))
rm -f -r dist/
mkdir dist
cat README-dev.md | sed 's/$/  /' > README.md
find -type d -maxdepth 1 | perl -n -e 'if(!/\.git/ && !/dist/ && !/icomoon/ && !/tests/ && !/compressors/ && !/.sass-cache/ && !/tools/ && !/private/ && !/node_modules/ && !/\.vscode/) { s/^\.(.+)/cp -r .\1 dist\1/; print;}' | bash -
find -type f -maxdepth 1 | perl -n -e 'if(!/\.git/ && !/\.sh/ && !/-dev/ && !/\.ts$/ && !/\.js.map$/) { s/^\.(.+)/cp -r .\1 dist\1/; print;}' | bash -
find dist -iname '*.ts' -exec sh -c 'rm "$0"' {} \;
find dist -iname '*.js.map' -exec sh -c 'rm "$0"' {} \;

# Brackets doesn't recognizes after names are renamed. So I use only --compilation_level WHITESPACE_ONLY
find *.js -maxdepth 1 | perl -p -e 's/^(.+)/java -jar compressors\/compiler.jar --compilation_level WHITESPACE_ONLY --language_in=ECMASCRIPT5 --js_output_file dist\/\1 --js \1/;' | bash

cat package.json | perl -p -e "s/__size__/only $((size))kb/;" > dist/package.json
cd dist
zip -o -r -9 bracketstoix.zip * -x tests/* -x *.zip -x .git/* -x *.sh
cd ..
echo $'\nRun this script twice to list the correct zip size\n'
