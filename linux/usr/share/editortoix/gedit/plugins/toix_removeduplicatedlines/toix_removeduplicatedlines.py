# --------------------------------------------------------------------
# Copyright (c) 2024 Alexandre Bento Freire. All rights reserved.
# Licensed under the GPL-2.0 license
# Generated by a script
# --------------------------------------------------------------------

from gi.repository import GObject, Gedit
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'toix_proxy')))
from toix_proxy_gedit import ToIXProxyGedit  # noqa


class RemoveDuplicatedLinesPlugin(GObject.Object, Gedit.AppActivatable):
    __gtype_name__ = "RemoveDuplicatedLinesPlugin"

    app = GObject.property(type=Gedit.App)

    def __init__(self):
        self.toix_proxy = ToIXProxyGedit(self)
        GObject.Object.__init__(self)

    def do_activate(self):
        self.toix_proxy.do_activate()

    def do_update_state(self):
        self.toix_proxy.do_update_state()

    def do_deactivate(self):
        self.toix_proxy.do_deactivate()

    def info(self):
        return {
            "Id": "RemoveDuplicatedLines",
            "Caption": "Remove Duplicated Lines",
            "ShortCut": "",
            "Hint": "Removes Duplicated Lines",
            "Policy": "CompleteLines"
        }

    def transform_line(self, line, prev_line):
        return line if line != prev_line else None
