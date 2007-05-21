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
 * CalemFormErrorRender
 *  
 */
function CalemFormErrorRender(parent, id, lbInfo, controller) {
	if (arguments.length==0) return;
	CalemUiRender.call(this, parent, id, lbInfo, controller);
}

CalemFormErrorRender.prototype=new CalemUiRender;
CalemFormErrorRender.prototype.constructor=CalemFormErrorRender;

CalemFormErrorRender.prototype.toString = function() { return "CalemFormErrorRender"; }

CalemFormErrorRender.prototype.render =
function(parentEl, yOff, clsName) {
	var errorId=Dwt.getNextId();
	var errorTextId=Dwt.getNextId();
	//By default - it's hidden
	parentEl.innerHTML = ["<div id=", errorId, " style='display:none'><table class=FormErrorTable><tr><td><div class=FormEditError></td>",
	           "<td id=", errorTextId, " class=FormErrorText></td></tr></table></div>"].join('');
	this._errorEl=document.getElementById(errorId);
	this._errorTextEl=document.getElementById(errorTextId);
	this.setText(CalemMsg.getMsg(this._info.getId()));
	//Register with controller.
	this._controller.setFormErrorRender(this);
}

//APIs
CalemFormErrorRender.prototype.setText =
function(text) {
	this._errorTextEl.innerHTML=text;
}

CalemFormErrorRender.prototype._setVisible =
function(bl) {
	this._errorEl.style.display = bl ? Dwt.DISPLAY_BLOCK : Dwt.DISPLAY_NONE;
}

CalemFormErrorRender.prototype.show =
function() {
	this._setVisible(true);
}

CalemFormErrorRender.prototype.hide =
function() {
	this._setVisible(false);
}

CalemFormErrorRender.prototype.setErrorMsg =
function(errMsg) {
	this.setText(errMsg);
	this._setVisible(true);
}

