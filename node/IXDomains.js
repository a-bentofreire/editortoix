/*
 * @preserve Copyright (c) 2015 ApptoIX Limited. All rights reserved.
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


/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global require, exports, console */
(function () {
    'use strict';
/** ------------------------------------------------------------------------
 *                               Node Requires
 ** ------------------------------------------------------------------------ */
    var nodeExec = require('child_process').exec,
        fs = require('fs');
/** ------------------------------------------------------------------------
 *                               Commands
 ** ------------------------------------------------------------------------ */   
    function cmdExec(cmdline, cwd, callback, param) {
        var opts = {cwd: cwd};
        nodeExec(cmdline, opts, function (error, stdout, stderr) {
            console.log('Executed:'  + cmdline);
            if (stderr) {
                console.log('StdErr: ' + stderr);
            }
            if (callback) {
                callback(error, stdout, stderr, param);                
            }
        });
    }
/** ------------------------------------------------------------------------
 *                               Init
 ** ------------------------------------------------------------------------ */
    function init(DomainManager) {
        var i, cmd,
          cmds = [
          {name: 'exec', f: cmdExec, desc: 'Executes as a child process', 
                params: [{name: 'cmdline', type: 'string', description: 'cmdline'},
                         {name: 'cwd', type: 'string', description: 'curpath'}/*, //@TODO Implement a callback system to print the stderr and stdout
                         {name: 'callback', type: 'function', description: 'callback'},
                         {name: 'param', type: 'boolean', description: 'param'}*/]}
        ];

        if (!DomainManager.hasDomain('IXDomains')) {
            DomainManager.registerDomain('IXDomains', {major: 0, minor: 1});
        }

        for (i = 0; i < cmds.length; i++) {
            cmd = cmds[i];
            DomainManager.registerCommand(
              'IXDomains',  // domain name
              cmd.name, // command name
              cmd.f, // command handler function
              false, // this command is not synchronous
              cmd.desc,
              cmd.params,
              cmd.returns || []
            );
        }
    }  
  exports.init = init;
  
}());