# --------------------------------------------------------------------
# Copyright (c) 2024 Alexandre Bento Freire. All rights reserved.
# Licensed under the GPL-2.0 license
# --------------------------------------------------------------------

import gettext
import os

localedir = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'locale')
lang = gettext.translation('editortoix', localedir, languages=['en', 'pt', 'de'], fallback=True)
lang.install()
_ = lang.gettext


class ToIXProxy:
    def __init__(self, plugin):
        self.plugin = plugin

    def do_activate(self):
        self._insert_menu()

    def do_deactivate(self):
        self._remove_menu()

    def _(self, text):
        return _(text)

    def get_window(self):
        return self.plugin.window

    def exec_action(self):
        doc = self.get_window().get_active_document()
        if doc is None:
            return

        doc.begin_user_action()
        insert_mark = doc.get_insert()
        try:
            select_policy = None
            start, end = doc.get_selection_bounds()
        except ValueError:
            select_policy = self.plugin.info().get("SelectPolicy") or "Document"
            if select_policy == "Word":
                start = doc.get_iter_at_mark(doc.get_insert())
                start.backward_word_start()
                end = start.copy()
                end.forward_visible_word_end()
            elif select_policy == "Document":
                start = doc.get_iter_at_line_offset(0, 0)
                end = start.copy()
                end.forward_to_end()

        policy = self.plugin.info()["Policy"]
        if policy == "CompleteLines":
            start.set_line_offset(0)
            if not select_policy and not end.ends_line():
                end.forward_to_line_end()

        text = doc.get_text(start, end, True)
        if policy == "Text":
            new_text = self.plugin.transform_text(text)
        else:
            lines = text.split("\n")
            prev_line = None
            if policy != "LineList":
                new_lines = []
                for line in lines:
                    cr_marker = "\r" if len(line) and line[-1] == "\r" else ""
                    line = line if cr_marker == "" else line[:-1]
                    new_line = self.plugin.transform_line(line, prev_line)
                    if new_line is not None:
                        new_lines.append(new_line + cr_marker)
                        prev_line = line
            else:
                new_lines = self.plugin.transform_lines(lines)
            new_text = "\n".join(new_lines)

        if new_text != text:
            start_line_number = start.get_line()
            start_column_number = start.get_line_offset()
            end_line_number = start_line_number
            end_column_number = start_column_number
            doc.delete(start, end)
            doc.insert(start, new_text)
            new_start = doc.get_iter_at_line_offset(start_line_number, start_column_number)
            if not select_policy or select_policy == "Word":
                new_lines = new_text.split("\n")
                if len(new_lines) == 1:
                    end_column_number += len(new_text)
                elif len(new_lines) > 1 and not select_policy:
                    end_line_number += len(new_lines) - 1
                    end_column_number = len(new_lines[-1])

            doc.select_range(new_start, doc.get_iter_at_line_offset(end_line_number, end_column_number))
            doc.move_mark(insert_mark, new_start)

        doc.end_user_action()
