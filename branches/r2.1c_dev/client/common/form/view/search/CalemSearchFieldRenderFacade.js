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
 * CalemSearchFieldRenderFacade
 * This facade plays the role of a factory at creation and facade after 
 * a specific render is created. 
 *  
 */
function CalemSearchFieldRenderFacade(parent, id, fldInfo, controller) {
	if (arguments.length==0) return;
	CalemFieldRender.call(this, parent, id, fldInfo, controller);
}

CalemSearchFieldRenderFacade.prototype=new CalemFieldRender;
CalemSearchFieldRenderFacade.prototype.constructor=CalemSearchFieldRenderFacade;

CalemSearchFieldRenderFacade.prototype.toString = function() { return "CalemSearchFieldRenderFacade"; }

/**
 * CalemSearchFieldRenderFacade interfaces
 */
CalemSearchFieldRenderFacade.prototype.render =
function(parentEl, yOff) {
	this._renderField(parentEl, yOff);
	this._render.setupValidation();
}

//Focus
CalemSearchFieldRenderFacade.prototype.setFocus =
function() {
	this._render.setFocus();
}

//VerifyInput
CalemSearchFieldRenderFacade.prototype.verifyInput =
function(fld, isValid) {
    if (this._field==fld) return isValid;
	return this._render.verifyInput(fld);
} 

//fieldValue - rawValue
CalemSearchFieldRenderFacade.prototype.getFieldValue =
function() {
	return this._render.getFieldValue();
} 

//Server value such as date in string format.
CalemSearchFieldRenderFacade.prototype.getEditFieldServerValue =
function() {
	return this._render.getEditFieldServerValue();
} 

//set field error
CalemSearchFieldRenderFacade.prototype.setFieldError =
function(errMsg) {
	this._render.setFieldError(errMsg);
} 

//Shutdown
CalemSearchFieldRenderFacade.prototype._shutdown =
function() {
	this._render._shutdown();
} 

CalemSearchFieldRenderFacade.prototype.getFieldChanged =
function() {
	return this._render.getFieldChanged();
} 

//Resume view assuming a change is made.
CalemSearchFieldRenderFacade.prototype.resumeView = 
function() {
	this._render.resumeView();
}

/**
 * Get field search
 */
CalemSearchFieldRenderFacade.prototype.getFieldSearch =
function(id) {
	return this._render.getFieldSearch();
} 