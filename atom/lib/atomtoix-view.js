'use babel';

// uuid: 3c1f8a9f-1ea8-4130-8f04-326026d2238e

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

export default class AtomtoixView {

  inputContainer = null;
  def = null;
  modalPanel = null;

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('atomtoix');

    // Create message element
    this.inputContainer = document.createElement('div');
    this.inputContainer.classList.add('input-container');
    this.element.appendChild(this.inputContainer);

    // buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');
    this.element.appendChild(buttonContainer);

    const okButton = document.createElement('button');
    okButton.textContent = 'Ok';
    okButton.addEventListener("click", () => {
      this.modalPanel.hide();
      this.go();
    });
    buttonContainer.appendChild(okButton);

    const cancelButton = document.createElement('button');
    cancelButton.addEventListener("click", () => {
      this.modalPanel.hide();
    });
    cancelButton.textContent = 'cancel';
    buttonContainer.appendChild(cancelButton);
  }

  go() {
    const inputFields = this.inputContainer.getElementsByTagName('input');
    const inputFieldsLen = inputFields.length;
    this.def.userinputs = [];
    for (let i = 0; i < inputFieldsLen; i++) {
      this.def.userinputs.push(inputFields[i].value);
    }
    this.def.caller(this.def);
  }

  populate(def, modalPanel_) {
    modalPanel = modalPanel_;
    this.def = def;
    this.inputContainer.innerHTML =
      def.inputs.map(inpLabel =>
        `<div>${inpLabel.prompt}</div>` +
        `<input type=text></input>`
      ).join('\n');
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

}