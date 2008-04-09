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
 * CalemReadBoolean
 * This is the Boolean control.
 */
function CalemReadBoolean(parent) {
	if (arguments.length==0) return;
	DwtControl.call(this, parent);
	//Prepare the values from the value
	this._initControl();
}

CalemReadBoolean.prototype = new DwtControl;
CalemReadBoolean.prototype.constructor = CalemReadBoolean;

CalemReadBoolean.prototype.toString = function() {return "CalemReadBoolean";}

//Relayout so it's aligned and error flag.
CalemReadBoolean.prototype._initControl =
function() {
	var el=this.getHtmlElement();
	var trueId=Dwt.getNextId();
	var falseId=Dwt.getNextId();
	el.innerHTML=['<div id=', trueId,"><input type='checkbox' onclick='this.checked=true' checked>",'</div>',
	              '<div id=', falseId,"><input type='checkbox' onclick='this.checked=false'></div>"].join('');
	this._trueField=document.getElementById(trueId);
	this._falseField=document.getElementById(falseId);
}

CalemReadBoolean.prototype.setValue =
function(value) {
	if (value) {
		Dwt.setDisplay(this._trueField, Dwt.DISPLAY_BLOCK);		              ;
		Dwt.setDisplay(this._falseField, Dwt.DISPLAY_NONE);
	} else {
		Dwt.setDisplay(this._falseField, Dwt.DISPLAY_BLOCK);		              ;
		Dwt.setDisplay(this._trueField, Dwt.DISPLAY_NONE);
	}
}

