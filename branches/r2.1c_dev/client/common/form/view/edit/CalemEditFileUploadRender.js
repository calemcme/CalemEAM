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
 * CalemEditFileUploadRender
 *  
 */
function CalemEditFileUploadRender(parent, id, fldInfo, controller) {
	if (arguments.length==0) return;
	CalemEditStringRender.call(this, parent, id, fldInfo, controller);
}

CalemEditFileUploadRender.prototype=new CalemEditStringRender;
CalemEditFileUploadRender.prototype.constructor=CalemEditFileUploadRender;

CalemEditFileUploadRender.prototype.toString = function() { return "CalemEditFileUploadRender"; }

CalemEditFileUploadRender.prototype.render =
function(parentEl, yOff) {
	var readId=Dwt.getNextId();
	var editId=Dwt.getNextId();
	var html=["<table cellspacing='0' cellpadding='0'><tr><td id='", readId, "'></td></tr><tr><td id='", editId, "'></td></tr></table>"].join('');
	var div = document.createElement('DIV');
	parentEl.appendChild(div);
	div.innerHTML=html;
	this._readEl=document.getElementById(readId);
	this._editEl=document.getElementById(editId);
	var len=this._tableDd.getTextInputLength(this._field);
	
	this._readFld=new CalemReadFileUploadEdit({parent: this._parent});
	this._readFld.reparentHtmlElement(this._readEl); 
	
	this._editFld=new CalemEditFileUpload({parent: this._parent, type: DwtInputField.STRING, 
	              size: len,
	              controller: this._controller,
	              errorIconStyle: CalemConf['view_engine']['field']['inputErrorIcon']});
	this._editFld.reparentHtmlElement(this._editEl);
	this.resumeView();       
	//Need to set up validation here.
	this.setupValidation();   
}

CalemEditFileUploadRender.prototype.resumeView =
function() {
	//Configure read value only.
	var val= this._getFieldValueByRec();
	var id=this._getRecId();
	this._readFld.setFileUpload(id, val); 
}

//validation
CalemEditFileUploadRender.prototype.setupValidation =
function() {
	this._editFld.setValidationCallback(this._controller.getValidationCallback());
	this._editFld.setFieldInfo(this.getFieldInfo());
}

//Default implementation
CalemEditFileUploadRender.prototype.setFocus =
function() {
	this._editFld.focus();
}

//Verify input
CalemEditFileUploadRender.prototype.verifyInput =
function(fld, isValid) {
	return true;
} 

//A special field change handler
CalemEditFileUploadRender.prototype.getFieldChanged =
function() {
	return (this.getFieldValue() ? true : false);
}

//fieldValue
CalemEditFileUploadRender.prototype.getFieldValue =
function() {
	return this._editFld.getValue();
}

//Considering going back to null (as in null replacement)
CalemEditFileUploadRender.prototype._getCtrlValue =
function() {
	var val=this.getFieldValue();
	if (val==this.getNullReplacement()) val=null; //Get rid of null replacement.
	return val;
}

//Value for server (such as string for date)
CalemEditFileUploadRender.prototype.getEditFieldServerValue =
function() {
	return this.getFieldValue();
} 

//set field error
CalemEditFileUploadRender.prototype.setFieldError =
function(errMsg) {
	this._editFld.setFieldError(errMsg);
} 

CalemEditFileUploadRender.prototype.setFieldReadOnly =
function() {
	this._editFld.disable();
}
