# --------------------------------------------------------------------
# Copyright (c) 2024 Alexandre Bento Freire. All rights reserved.
# Licensed under the GPL-2.0 license
# --------------------------------------------------------------------

from toix_proxy_pluma import ToIXProxyPluma


class ToIXProxyXed(ToIXProxyPluma):

    def editorId(self):
        return "Xed"