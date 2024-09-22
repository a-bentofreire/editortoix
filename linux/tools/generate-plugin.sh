#!/usr/bin/env bash
# --------------------------------------------------------------------
# Copyright (c) 2024 Alexandre Bento Freire. All rights reserved.
# Licensed under the GPL-2.0 license
# --------------------------------------------------------------------

# ------------------------------------------------------------------------
# Creates a plugin from a template. Expects [Caption and Plugin]
# ------------------------------------------------------------------------

[[ -z $1 || -z $2 ]] && printf >&2 "Requires the plugin 'caption' and 'hint' as parameters\n" && exit 1

SCRIPT_PATH="$(dirname $(realpath "$0"))"
cd "$SCRIPT_PATH"
SUB_PATH=/usr/share/editortoix/xed/plugins
TARGET=$(realpath ..$SUB_PATH)
[[ ! -d $TARGET ]] && printf >&2 "$TARGET doesn't exists\n" && exit 1

CAPTION="$1"
HINT="$2"
ID="${CAPTION// /}"
LOW_ID="${ID,,}"
TOIX_LOW_ID="toix_$LOW_ID"
printf "Caption: $CAPTION\nId: $ID\nLow Id: $LOW_ID\n\n"
[[ -d $TARGET/$TOIX_LOW_ID ]] && printf >&2 "Plugin Already Exists\n" && error 1
mkdir $TARGET/$TOIX_LOW_ID

function cp_and_rename() {
    EXT=$1
    cp toix_template/toix_template.$EXT $TARGET/$TOIX_LOW_ID/$TOIX_LOW_ID.$EXT
    sed -i "s/template/$LOW_ID/g;s/TemplateCaption/$CAPTION/g;s/TemplateHint/$HINT/g;s/Template/$ID/g;" $TARGET/$TOIX_LOW_ID/$TOIX_LOW_ID.$EXT
}

cp_and_rename plugin
cp_and_rename py
