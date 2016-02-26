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
 * CalemSearchSaveRender  
 */
function CalemSearchSaveRender(parent, id, info, controller) {
	if (arguments.length==0) return;
	CalemUiRender.call(this, parent, id, info, controller);
	this._vcCallback=new AjxCallback(this, this.onValidationCallback);
	this._parentVcCallback=this._controller.getValidationCallback();
}

CalemSearchSaveRender.eventMap = [CalemEvent.SEARCH_NAME_NOT_VALID];

CalemSearchSaveRender.prototype=new CalemUiRender;
CalemSearchSaveRender.prototype.constructor=CalemSearchSaveRender;

CalemSearchSaveRender.prototype.toString = function() { return "CalemSearchSaveRender"; }

CalemSearchSaveRender.prototype.render =
function(parentEl, yOff) {
	this._el=parentEl;
	var search=this._controller.getSearch();
	this._control = new CalemSearchSave(this._parent, search);
	this._control.reparentHtmlElement(this._el);
	//set up to report the event.
	this._controller.setSearchSave(this);
	this._controller.getModelItem().publishEvents(CalemSearchSaveRender.eventMap, this);
	//Also prompt form to check for validation
	this._control.setValidationCallback(this._vcCallback);
	this._control.setFieldInfo({fld: this.getId()}); //use its id as the field. (starts with _ as none-table control)
}

//Default implementation for all the read renders.
CalemSearchSaveRender.prototype.isValid =
function() {
	var val=this._control.getSaveValue();
	if (!val._name) {
		var evt=new CalemSearchEditEvent(CalemEvent.SEARCH_NAME_NOT_VALID);
		this.notifyListeners(CalemEvent.SEARCH_NAME_NOT_VALID, evt);
		val=null;	
	}
	return val;
}

//Default implementation for all the read renders.
CalemSearchSaveRender.prototype.getSaveValue =
function() {
	return this._control.getSaveValue();
}

//Validation callback
CalemSearchSaveRender.prototype.onValidationCallback =
function(field, valid, value) {
	if (this.isValid()) { //Parent validation can see if all is valid.
		this._parentVcCallback.run(field, valid, value);
	}
}

/**
 * shutdown
 */
CalemSearchSaveRender.prototype._shutdown =
function() {
	this._controller.getModelItem().unpublishEvents(CalemSearchSaveRender.eventMap, this);	
} 

//resumeView
CalemSearchSaveRender.prototype.resumeView =
function() {
	this._control.setupSearch(this._controller.getSearch());
}
