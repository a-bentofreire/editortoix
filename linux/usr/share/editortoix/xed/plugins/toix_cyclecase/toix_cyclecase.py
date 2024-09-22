# --------------------------------------------------------------------
# Copyright (c) 2024 Alexandre Bento Freire. All rights reserved.
# Licensed under the GPL-2.0 license
# --------------------------------------------------------------------

from gi.repository import GObject, Xed
import sys
import os
import re

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'toix_proxy')))
from toix_proxy_xed import ToIXProxyXed  # noqa


class CycleCasePlugin(GObject.Object, Xed.WindowActivatable):
    __gtype_name__ = "CycleCasePlugin"

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
            "Id": "CycleCase",
            "Caption": "Cycle Case",
            "ShortCut": "<Alt>apostrophe",
            "Hint": "Cycles Case",
            "Policy": "Text",
            "SelectPolicy": "Word"
            }

    def transform_text(self, text):
        if text == '':
            return ''

        # test for space case
        # space testing should be the first test
        m6 = re.match(r'^(_*)([^ ])(.* .*)$', text)
        if m6 is not None:
            # => cycle to capitalize
            return m6.group(1) + m6.group(2).upper() + re.sub(r' +([a-z])', lambda m: m.group(1).upper(), m6.group(3).lower())

        # test for uppercase case
        if re.match(r'^_*[A-Z].*_', text) is not None:
            # => cycle to underscore
            return text.lower()

        # test for underscore case
        m4 = re.match(r'^(_*)([^_]+_.*)$', text)
        if m4 is not None:
            # => cycle to dash
            return m4.group(1) + m4.group(2).replace('_', '-')

        # test for dash case
        m5 = re.match(r'^(_*)([^-].*-.*)$', text)
        if m5 is not None:
            # => cycle to space case
            return m5.group(1) + m5.group(2).replace('-', ' ')

        # test for capitalize (should be after symbol cases)
        m1 = re.match(r'^(_*)([A-Z])([^A-Z].*)$', text)
        if m1 is not None:
            # => cycle to camel
            return m1.group(1) + m1.group(2).lower() + m1.group(3)

        # test for camel case (should be after symbol cases)
        m2 = re.match(r'^(_*)([^A-Z_]+[A-Z].*)$', text)
        if m2 is not None:
            # => cycle to uppercase
            return m2.group(1) + re.sub(r'([A-Z]+)', lambda m: '_' + m.group(1), m2.group(2)).upper()

        return text