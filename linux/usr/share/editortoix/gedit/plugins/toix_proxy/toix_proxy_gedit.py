# --------------------------------------------------------------------
# Copyright (c) 2024 Alexandre Bento Freire. All rights reserved.
# Licensed under the GPL-2.0 license
# --------------------------------------------------------------------

from gi.repository import Gio
from toix_proxy import ToIXProxy


class ToIXProxyGedit(ToIXProxy):

    def __init__(self, plugin):
        super().__init__(plugin)
        self.menu_item = None

    def editorId(self):
        return "Gedit"

    def get_window(self):
        return self.plugin.app.get_active_window()

    def do_update_state(self):
        pass

    def _insert_menu(self):
        info = self.plugin.info()
        id = info["Id"]

        self.action = Gio.SimpleAction(name=id)
        self.action.connect("activate", lambda a, b: self.exec_action())
        self.plugin.app.add_action(self.action)

        self.menu_ext = self.plugin.extend_menu("tools-section-1")
        self.menu_item = Gio.MenuItem.new("IX: " + self._(info["Caption"]), f"app.{id}")
        self.menu_ext.append_menu_item(self.menu_item)

    def _remove_menu(self):
        self.plugin.app.remove_action(self.plugin.info()["Id"])
        self.menu_item = None
        self.menu_ext = None
