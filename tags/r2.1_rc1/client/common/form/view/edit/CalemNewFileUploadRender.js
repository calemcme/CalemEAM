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
 * CalemNewFileUploadRender
 *  
 */
function CalemNewFileUploadRender(parent, id, fldInfo, controller) {
	if (arguments.length==0) return;
	CalemEditStringRender.call(this, parent, id, fldInfo, controller);
}

CalemNewFileUploadRender.prototype=new CalemEditStringRender;
CalemNewFileUploadRender.prototype.constructor=CalemNewFileUploadRender;

CalemNewFileUploadRender.prototype.toString = function() { return "CalemNewFileUploadRender"; }

CalemNewFileUploadRender.prototype.render =
function(parentEl, yOff) {
	var len=this._tableDd.getTextInputLength(this._field);
	this._control=new CalemEditFileUpload({parent: this._parent, type: DwtInputField.STRING, 
	              size: len,
	              controller: this._controller,
	              errorIconStyle: CalemConf['view_engine']['field']['inputErrorIcon']});
	if (this._tableDd.isRequired(this._field)) {
		this._control.setRequired(true);
	}	              
	this._control.reparentHtmlElement(parentEl);
	this.resumeView();       
	//Need to set up validation here.
	this.setupValidation();   
}

CalemNewFileUploadRender.prototype.resumeView =
function() {
}

//validation
CalemNewFileUploadRender.prototype.setupValidation =
function() {
	this._control.setValidationCallback(this._controller.getValidationCallback());
	this._control.setFieldInfo(this.getFieldInfo());
}

//Default implementation
CalemNewFileUploadRender.prototype.setFocus =
function() {
	this._control.focus();
}

//Verify input
CalemNewFileUploadRender.prototype.verifyInput =
function(fld, isValid) {
	return true;
} 

//A special field change handler
CalemNewFileUploadRender.prototype.getFieldChanged =
function() {
	return (this.getFieldValue() ? true : false);
}

//fieldValue
CalemNewFileUploadRender.prototype.getFieldValue =
function() {
	return this._control.getValue();
}

//Considering going back to null (as in null replacement)
CalemNewFileUploadRender.prototype._getCtrlValue =
function() {
	var val=this.getFieldValue();
	if (val==this.getNullReplacement()) val=null; //Get rid of null replacement.
	return val;
}

//Value for server (such as string for date)
CalemNewFileUploadRender.prototype.getEditFieldServerValue =
function() {
	return this.getFieldValue();
} 

//set field error
CalemNewFileUploadRender.prototype.setFieldError =
function(errMsg) {
	this._control.setFieldError(errMsg);
} 

CalemNewFileUploadRender.prototype.setFieldReadOnly =
function() {
	this._control.disable();
}
