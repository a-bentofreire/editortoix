'use strict';
// uuid: 293309ca-80b4-465a-8afe-358dec410e86
/*
 * @preserve Copyright (c) 2016-2019 Alexandre Bento Freire. All rights reserved.
 * @author Alexandre Bento Freire
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */
(function () {
    // ------------------------------------------------------------------------
    //                               Node Requires
    // ------------------------------------------------------------------------
    var nodeExec = require('child_process').exec, fs = require('fs'), DOMAINNAME = 'IXDomains';
    // ------------------------------------------------------------------------
    //                               Commands
    // ------------------------------------------------------------------------
    function cmdExec(cmdline, cwd, callback) {
        var opts = { cwd: cwd };
        nodeExec(cmdline, opts, function (error, stdout, stderr) {
            if (callback) {
                stderr = stderr || '';
                stdout = stdout || '';
                // All the output is packed into a single string separated by \n
                // Attempted to send the multiple parameters in separate but it failed to work
                callback('', [error === null ? '' : ('' + error.code),
                    '' + stdout.split('\n').length,
                    stdout,
                    stderr].join('\n'));
            }
        });
    }
    // ------------------------------------------------------------------------
    //                               Init
    // ------------------------------------------------------------------------
    function init(DomainManager) {
        var i, cmd, cmds = [
            { name: 'exec', f: cmdExec, desc: 'Executes as a child process',
                params: [{ name: 'cmdline', type: 'string', description: 'node command' },
                    { name: 'cwd', type: 'string', description: 'path' }],
                returns: [{ name: 'out', type: 'string' }] }
        ];
        if (!DomainManager.hasDomain(DOMAINNAME)) {
            DomainManager.registerDomain(DOMAINNAME, { major: 0, minor: 1 });
        }
        for (i = 0; i < cmds.length; i++) {
            cmd = cmds[i];
            DomainManager.registerCommand(DOMAINNAME, // domain name
            cmd.name, // command name
            cmd.f, // command handler function
            true, // synchronous
            cmd.desc, cmd.params, cmd.returns || []);
        }
    }
    exports.init = init;
}());
//# sourceMappingURL=IXDomains.js.map