/*
 * The contents of this file are subject to the CalemEAM Public License Version
 * 1.0 ("License"); You may not use this file except in compliance with the
 * License. You may obtain a copy of the License at http://www.calemeam.com/license
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied.  See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is: CalemEAM Open Source
 *
 * The Initial Developer of the Original Code is CalemEAM Inc.
 * Portions created by CalemEAM are Copyright (C) 2007 CalemEAM Inc.;
 * All Rights Reserved.
 
 * Contributor(s): 
 */
 

/**
 * CalemQuestionDialog
 * This dialog will prompt a question with Yes/No answers.
 */
function CalemQuestionDialog(dummy) {
	if (arguments.length==0) return;
	var shell=CalemContext.getInstance().getShell();
	DwtDialog.call(this, shell, null, null, [DwtDialog.YES_BUTTON, DwtDialog.NO_BUTTON], DwtDialog.NO_BUTTONS, null, DwtDialog.MODAL);
	this.registerCallback(DwtDialog.YES_BUTTON, this._onYes, this);
	this.registerCallback(DwtDialog.NO_BUTTON, this._onNo, this);
} 

/**
 * Use a single instance of the dialog.
 */
CalemQuestionDialog.showIt =
function(title, prompt, callback, noWrap) {
	if (arguments.length==0) return;
	if (!this._promptDialog) {
		this._promptDialog=new CalemQuestionDialog(true);
	}
	if (!noWrap) prompt= CalemTextUtil.wrapText(prompt);
	this._promptDialog.popupPrompt(title, prompt, callback);
} 

CalemQuestionDialog.prototype = new DwtDialog;
CalemQuestionDialog.prototype.constructor = CalemQuestionDialog;

CalemQuestionDialog.prototype.toString =  function() { return "CalemQuestionDialog"; }

//Listeners
CalemQuestionDialog.prototype._onYes =
function() {
	this.popdown();
	this._callback.run(true);
}

CalemQuestionDialog.prototype._onNo =
function() {
	this.popdown();
	this._callback.run(false);
}

//Public APIs
CalemQuestionDialog.prototype.popupPrompt =
function(title, prompt, callback) {
	this.setTitle(title);
	this.setContent(prompt);
	this._callback=callback;
	this.popup();
}

