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
 * CalemEditPasswordRender
 * Render password edit field.
 *  
 */
function CalemEditPasswordRender(parent, id, fldInfo, controller) {
	if (arguments.length==0) return;
	CalemEditRender.call(this, parent, id, fldInfo, controller);
}

CalemEditPasswordRender.prototype=new CalemEditRender;
CalemEditPasswordRender.prototype.constructor=CalemEditPasswordRender;

CalemEditPasswordRender.prototype.toString = function() { return "CalemEditPasswordRender"; }

CalemEditPasswordRender.prototype.render =
function(parentEl, yOff) {
	var displayLength=this._tableDd.getTextEditDisplayLength(this._field);
	var len=this._tableDd.getTextInputLength(this._field);
	this._control=new CalemEditPassword({parent: this._parent, type: DwtInputField.PASSWORD, 
	              size: displayLength,
	              errorIconStyle: CalemConf['view_engine']['field']['inputErrorIcon']});
	this._control.setValidStringLengths(null, len)	              ;
	if (this._tableDd.isRequired(this._field)) {
		this._control.setRequired(true);
	}
	this._control.reparentHtmlElement(parentEl);
	var val= this._getFieldValueByRec();
   this._control.setValue(val, true);  //No validation           
}

//fieldValue
CalemEditPasswordRender.prototype.getFieldValue =
function() {
	var val=this._control.getFieldValue();
	val = val ? val.trim() : val;
	return val;
}

/**
 * When field is changed this is the interface to get the value for server.
 * getEditFieldServerValue for field change
 * getInsertFieldServerValue for insertion.
 */
CalemEditPasswordRender.prototype.getEditFieldServerValue =
function() {
	//Only send md5 password over when editing.
	var val= this.getFieldValue();
	val = val ? AjxMD5.hex_md5(val) : val;
	return val;
} 

//Default implementation is the same as getEditFieldServerValue.
CalemEditPasswordRender.prototype.getInsertFieldServerValue =
function() {
	return this.getEditFieldServerValue();
} 

