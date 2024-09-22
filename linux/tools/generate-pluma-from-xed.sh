#!/usr/bin/env bash
# --------------------------------------------------------------------
# Copyright (c) 2024 Alexandre Bento Freire. All rights reserved.
# Licensed under the GPL-2.0 license
# --------------------------------------------------------------------

# ------------------------------------------------------------------------
# Creates a plugin from a template. Expects [Caption and Plugin]
# ------------------------------------------------------------------------

SCRIPT_PATH="$(dirname $(realpath "$0"))"
cd "$SCRIPT_PATH/../usr/share/editortoix"
rm -rf pluma
cp -ar xed pluma
cd pluma/plugins
rm toix_proxy/toix_proxy_xed.py
find . -iname '*.py' -exec sed -i 's/GObject, Xed/GObject, Pluma/;s/toix_proxy_xed/toix_proxy_pluma/;s/ToIXProxyXed/ToIXProxyPluma/;s/Xed.Window/Pluma.Window/' "{}" \;
echo "Generated Pluma Plugins from Xed"