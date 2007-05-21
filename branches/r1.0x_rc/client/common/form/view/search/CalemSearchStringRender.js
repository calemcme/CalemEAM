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
 * CalemSearchStringRender
 * Render string Search field.
 *  
 */
function CalemSearchStringRender(parent, id, fldInfo, controller) {
	if (arguments.length==0) return;
	CalemSearchFieldRender.call(this, parent, id, fldInfo, controller);
}

CalemSearchStringRender.prototype=new CalemSearchFieldRender;
CalemSearchStringRender.prototype.constructor=CalemSearchStringRender;

CalemSearchStringRender.prototype.toString = function() { return "CalemSearchStringRender"; }

CalemSearchStringRender.prototype._createControl =
function(parentEl) {
	var len=this._tableDd.getTextInputLength(this._field);
	this._control=new CalemInputField({parent: this._parent, type: DwtInputField.STRING, 
	              size: len,
	              errorIconStyle: CalemConf['view_engine']['field']['inputErrorIcon']});
	this._control.setValidStringLengths(null, len);
	this._control.reparentHtmlElement(parentEl);
	this.resumeView();
}

CalemSearchStringRender.prototype._getFieldOps =
function() {
	return this._ops['varchar'];
}

//fieldValue
CalemSearchStringRender.prototype.getFieldValue =
function() {
	var val= this._control.getFieldValue();
	val = val ? val.trim() : val;
	return val;
}

//Value for server (such as string for date)
CalemSearchStringRender.prototype.getFieldDbValue =
function() {
	var val=this.getFieldValue();
	val = val ? val.trim() : val;
	if (!val) return null;
	return new CalemDbString(val);
} 

//resumeView
CalemSearchStringRender.prototype.resumeView =
function() {
	var val= this._getSearchValue();
	val = val ? val : this.getNullReplacement();
   this._control.setValue(val, true);  //No validation
}
