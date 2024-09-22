# --------------------------------------------------------------------
# Copyright (c) 2024 Alexandre Bento Freire. All rights reserved.
# Licensed under the GPL-2.0 license
# --------------------------------------------------------------------

from gi.repository import GObject, Pluma
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'toix_proxy')))
from toix_proxy_pluma import ToIXProxyPluma  # noqa


class OutdentOneSpacePlugin(GObject.Object, Pluma.WindowActivatable):
    __gtype_name__ = "OutdentOneSpacePlugin"

    window = GObject.property(type=Pluma.Window)

    def __init__(self):
        self.toix_proxy = ToIXProxyPluma(self)
        GObject.Object.__init__(self)

    def do_activate(self):
        self.toix_proxy.do_activate()

    def do_update_state(self):
        self.toix_proxy.do_update_state()

    def do_deactivate(self):
        self.toix_proxy.do_deactivate()

    def info(self):
        return {
            "Id": "OutdentOneSpace",
            "Caption": "Outdent One Space",
            "ShortCut": "<Alt>bracketleft",
            "Hint": "Outdent One Space in the selected lines",
            "Policy": "CompleteLines"
        }

    def transform_line(self, line, prev_line):
        return line[1:] if len(line) and line[0] == " " else line
