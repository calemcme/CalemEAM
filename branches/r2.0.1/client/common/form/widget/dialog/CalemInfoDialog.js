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
 * CalemInfoDialog
 * This dialog will display a message with a close button.
 */
function CalemInfoDialog(dummy) {
	if (arguments.length==0) return;
	var closeButton = new DwtDialog_ButtonDescriptor(CalemInfoDialog.CLOSE_BUTTON, CalemMsg.getMsg('button_close'), DwtDialog.ALIGN_CENTER);
	var shell=CalemContext.getInstance().getShell();
	DwtDialog.call(this, shell, null, null, DwtDialog.NO_BUTTONS, [closeButton], null, DwtDialog.MODAL);
	this.registerCallback(CalemInfoDialog.CLOSE_BUTTON, this._onClose, this);
} 

CalemInfoDialog.CLOSE_BUTTON = -1;

/**
 * Use a single instance of the dialog.
 */
CalemInfoDialog.showIt =
function(title, prompt, callback, noWrap) {
	if (arguments.length==0) return;
	if (!this._promptDialog) {
		this._promptDialog=new CalemInfoDialog(true);
	}
	if (!noWrap) prompt= CalemTextUtil.wrapText(prompt);
	this._promptDialog.popupPrompt(title, prompt, callback)
} 

CalemInfoDialog.prototype = new DwtDialog;
CalemInfoDialog.prototype.constructor = CalemInfoDialog;

CalemInfoDialog.prototype.toString =  function() { return "CalemInfoDialog"; }

CalemInfoDialog.prototype._onClose =
function() {
	this.popdown();
	if (this._callback) this._callback.run();
}

//Public APIs
CalemInfoDialog.prototype.popupPrompt =
function(title, prompt, callback) {
	this.setTitle(title);
	this.setContent(prompt);
	this._callback=callback;
	this.popup();
}

