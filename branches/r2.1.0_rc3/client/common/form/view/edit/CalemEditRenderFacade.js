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
 * CalemEditRenderFacade
 * This facade plays the role of a factory at creation and facade after 
 * a specific render is created. 
 *  
 */
function CalemEditRenderFacade(parent, id, fldInfo, controller) {
	if (arguments.length==0) return;
	CalemFieldRender.call(this, parent, id, fldInfo, controller);
}

CalemEditRenderFacade.prototype=new CalemFieldRender;
CalemEditRenderFacade.prototype.constructor=CalemEditRenderFacade;

CalemEditRenderFacade.prototype.toString = function() { return "CalemEditRenderFacade"; }

/**
 * CalemEditRenderFacade interfaces
 */
CalemEditRenderFacade.prototype.render =
function(parentEl, yOff) {
	this._renderField(parentEl, yOff);
	this._render.setupValidation();
}

//Focus
CalemEditRenderFacade.prototype.setFocus =
function() {
	this._render.setFocus();
}

//VerifyInput
CalemEditRenderFacade.prototype.verifyInput =
function(fld, isValid) {
   if (this._field==fld) return isValid;
	this._render.verifyInput(fld);
	return true; //No exception so it's good.
} 

//fieldValue - rawValue
CalemEditRenderFacade.prototype.getFieldValue =
function() {
	return this._render.getFieldValue();
} 

//Server value such as date in string format.
CalemEditRenderFacade.prototype.getEditFieldServerValue =
function() {
	return this._render.getEditFieldServerValue();
} 

//Server value such as date in string format.
CalemEditRenderFacade.prototype.getInsertFieldServerValue =
function() {
	return this._render.getInsertFieldServerValue();
}

//set field error
CalemEditRenderFacade.prototype.setFieldError =
function(errMsg) {
	this._render.setFieldError(errMsg);
} 

//Shutdown
CalemEditRenderFacade.prototype._shutdown =
function() {
	this._render._shutdown();
} 

CalemEditRenderFacade.prototype.getFieldChanged =
function() {
	return this._render.getFieldChanged();
} 

//Resume view assuming a change is made.
CalemEditRenderFacade.prototype.resumeView = 
function() {
	this._render.resumeView();
}

CalemEditRenderFacade.prototype.setFieldReadOnly =
function() {
	this._render.setFieldReadOnly();
}

//Set valid range
CalemEditRenderFacade.prototype.setValidRange =
function(min, max) {
	this._render.setValidRange(min, max);
} 

//field value
CalemEditRenderFacade.prototype.setFieldValue =
function(fv) {
	this._render.setFieldValue(fv);
}