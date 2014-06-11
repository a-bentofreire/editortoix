rm *.zip
zip -o -r -x tests/* -x *.zip -x .git/* -x *.sh -9 bracketstoix.zip *
