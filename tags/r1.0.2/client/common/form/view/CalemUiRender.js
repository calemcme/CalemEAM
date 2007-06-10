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
 * CalemUiRender
 *  
 */
function CalemUiRender(parent, id, info, controller) {
	if (arguments.length==0) return;
	this._parent=parent;
	this._id=id;
	this._info=info;
	this._controller=controller;
	CalemModel.call(this, true); //So to have an event handling functions.
}

CalemUiRender.prototype=new CalemModel;
CalemUiRender.prototype.constructor=CalemUiRender;

/**
 * Drag and drop
 */
CalemUiRender.prototype.initDnd =
function(ds, dt) {
	this._dragSrc=ds;
	this._dropTarget=dt;
}

CalemUiRender.prototype.toString = function() { return "CalemUiRender"; }

CalemUiRender.prototype.render =
function(parentEl, yOff, clsName) {
	//Overwrite 	  
}

CalemUiRender.prototype._showData =
function() {
	//Overwrite
}

CalemUiRender.prototype.onLayoutChange =
function() {
	//Overwrite
}

CalemUiRender.prototype.resumeView =
function() {
	//Overwrite
}

CalemUiRender.prototype.reRenderView =
function() {
	//Overwrite
}

CalemUiRender.prototype.setFieldReadOnly =
function(id) {
	//overwrite.
}

CalemUiRender.prototype.getNullReplacement =
function() {
	return '';
}

CalemUiRender.prototype.setFocus =
function() {
	//Overwrite.
}

/**
 * shutdown
 */
CalemUiRender.prototype._shutdown =
function() {
	//Overwrite.	
} 

//Life cycle mgmt
CalemUiRender.prototype.getId = 
function() { 
	return this._id; 
}

CalemUiRender.prototype.getInfo = 
function() { 
	return this._info; 
}

//replace control with a design cell
CalemUiRender.prototype.replaceWithDesignCol =
function(ctrl) {
    var parentEl=ctrl.getHtmlElement().parentNode;
	 this.remove(ctrl);
	 if (this._parentRender) {
		this._parentRender._renderColDesign(parentEl); //Button/separator don't have parentRender...
	 }
}
//Remove control and its render.
CalemUiRender.prototype.remove =
function(ctrl) {
	ctrl.dispose();
	this.removeRender();
}

CalemUiRender.prototype.removeRender =
function() {
	this._parentRender._removeRender(this._id);
}

CalemUiRender.prototype._renderColDesign =
function(parentEl) {
	if (this._parentRender) this._parentRender._renderColDesign(parentEl);
}

/**
 * default field search is null
 */
CalemUiRender.prototype.getFieldSearch =
function() {
	return null;
}  