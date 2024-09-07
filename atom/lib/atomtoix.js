'use babel';
// uuid: 49c3856f-d65d-47ac-b7db-7f7d6dc0a1af

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

// ------------------------------------------------------------------------
//  This code is a port of [vsctoix](https://github.com/a-bentofreire/editortoix) 1.1
//  However some parts still need work:
//  1. It only supports one selection.
//  2. It only transforms text inside the selection.
//  4. Add Mocha Tests and travis support.
// ------------------------------------------------------------------------

import AtomtoixView from './atomtoix-view';
import { CompositeDisposable } from 'atom';
import utilityList from './common/utility-list';
import { um } from './common/utilitymanager';

let atomtoixView = null;

function receiveUserInputs(def) {
  utilityManager(def, def.f, def)
}

function utilityManagerWithUserInputs(def, inputs, f) {
  def.inputs = inputs;
  def.f = f;
  def.caller = receiveUserInputs;
  atomtoixView.populate(def);
  if (!atomtoixView.modalPanel.isVisible()) {
    atomtoixView.modalPanel.show();
  }
}

// ------------------------------------------------------------------------
//                               main class
// ------------------------------------------------------------------------

export default {

  subscriptions: null,

  activate(state) {
    um.utilityManagerWithUserInputs = utilityManagerWithUserInputs;
    atomtoixView = new AtomtoixView(state.atomtoixViewState);
    atomtoixView.modalPanel = atom.workspace.addModalPanel({
      item: atomtoixView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', utilityList()));
  },

  deactivate() {
    atomtoixView.modalPanel.destroy();
    this.subscriptions.dispose();
    atomtoixView.destroy();
  },

  serialize() {
    return {
      atomtoixViewState: atomtoixView.serialize()
    };
  }
};