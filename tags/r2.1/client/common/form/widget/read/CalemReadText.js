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
 * CalemReadText
 * This is the edit text adapted from DwtInput's text area implementation so the cols can be set and alignment with other
 * input fields are kept.
 */
function CalemReadText(params) {
	if (arguments.length==0) return;
	var clsName = params.className ? params.className : "CalemReadText";
	DwtControl.call(this, params.parent, clsName, params.posStyle);
	var fldId = Dwt.getNextId();
	var htmlEl = this.getHtmlElement();
	htmlEl.innerHTML=["<textarea id='", fldId, "' rows=", params.rows, " cols=", params.size, " readonly=true></textarea>"].join('');
   this._readField = document.getElementById(fldId);
	Dwt.associateElementWithObject(this._readField, this);	           
	
} 

CalemReadText.prototype = new DwtControl;
CalemReadText.prototype.constructor = CalemReadText;

CalemReadText.prototype.toString = function() { return "CalemReadText"; }

CalemReadText.prototype.setValue =
function(value) {
	this._readField.value = value;
}
