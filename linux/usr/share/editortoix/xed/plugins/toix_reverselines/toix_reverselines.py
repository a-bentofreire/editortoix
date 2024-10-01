# --------------------------------------------------------------------
# Copyright (c) 2024 Alexandre Bento Freire. All rights reserved.
# Licensed under the GPL-2.0 license
# --------------------------------------------------------------------

from gi.repository import GObject, Xed
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'toix_proxy')))
from toix_proxy_xed import ToIXProxyXed  # noqa


class ReverseLinesPlugin(GObject.Object, Xed.WindowActivatable):
    __gtype_name__ = "ReverseLinesPlugin"

    window = GObject.property(type=Xed.Window)

    def __init__(self):
        self.toix_proxy = ToIXProxyXed(self)
        GObject.Object.__init__(self)

    def do_activate(self):
        self.toix_proxy.do_activate()

    def do_update_state(self):
        self.toix_proxy.do_update_state()

    def do_deactivate(self):
        self.toix_proxy.do_deactivate()

    def info(self):
        return {
            "Id": "ReverseLines",
            "Caption": "Reverse Lines",
            "Hint": "Reverses Lines",
            "Policy": "LineList"
        }

    def transform_lines(self, lines):
        return list(reversed(lines))
