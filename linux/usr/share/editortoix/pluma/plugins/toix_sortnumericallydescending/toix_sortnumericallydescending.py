# --------------------------------------------------------------------
# Copyright (c) 2024 Alexandre Bento Freire. All rights reserved.
# Licensed under the GPL-2.0 license
# --------------------------------------------------------------------

from gi.repository import GObject, Pluma
import sys
import os
import re

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'toix_proxy')))
from toix_proxy_pluma import ToIXProxyPluma  # noqa


def _key_func(line):
    match = re.match(r'(-?\d*)(.*)', line)
    return (int(match.group(1) or -sys.maxsize), match.group(2))


class SortNumericallyDescendingPlugin(GObject.Object, Pluma.WindowActivatable):
    __gtype_name__ = "SortNumericallyDescendingPlugin"

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
            "Id": "SortNumericallyDescending",
            "Caption": "Sort Numerically Descending",
            "Hint": "Sorts Numerically Descending",
            "Policy": "LineList"
        }

    def transform_lines(self, lines):
        return sorted(lines, key=_key_func, reverse=True)
