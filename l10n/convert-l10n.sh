#!/usr/bin/env bash
# --------------------------------------------------------------------
# Copyright (c) 2024 Alexandre Bento Freire. All rights reserved.
# Licensed under the GPL-2.0 license
# --------------------------------------------------------------------

# ------------------------------------------------------------------------
# Compile Translations
# ------------------------------------------------------------------------

SCRIPT_PATH="$(dirname $(realpath "$0"))"
python $SCRIPT_PATH/convert-l10n.py || exit 1
cd "$SCRIPT_PATH/../xed/usr/lib/x86_64-linux-gnu/xed/plugins/toix_proxy/locale"
find . -iname "*.po" -exec bash -c 'FILE="{}"; echo Compile $FILE; msgfmt -o "${FILE%.*}.mo" "$FILE";' \;
