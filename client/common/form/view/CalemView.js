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
 * CalemView
 * This is the base view for use to render a form.
 */
function CalemView(parent, controller, className, posStyle) {
	if (arguments.length==0) return;
	className = className || "CalemView";
	DwtComposite.call(this, parent, className, posStyle);
	this._parent=parent;
	this._controller=controller;
}

CalemView.prototype = new DwtComposite;
CalemView.prototype.constructor = CalemView;

CalemView.prototype.toString = function() { return "CalemView"; }

CalemView.prototype._initViewInfo =
function() {
	this._id=this._controller.getViewId();
	this._viewInfo=CalemJson.setJson(CalemViewDef[this._id]);
}

CalemView.prototype.getViewInfo =
function() {
	return this._viewInfo;
}

//Public APIs
CalemView.prototype.render =
function() {
	this._initViewInfo();
	this._renderView();
}

CalemView.prototype.onLayoutChange =
function() {
	this._render.onLayoutChange();
}

CalemView.prototype.resumeView =
function() {
	this._render.resumeView();
}

CalemView.prototype.reRenderView =
function() {
	this._render.reRenderView();
}

CalemView.prototype.setFieldReadOnly =
function(id) {
	this._render.setFieldReadOnly(id);
}

CalemView.prototype.setFocus =
function(id) {
	this._render.setFocus(id);
}

/**
 * Rendering the view.
 */
CalemView.prototype._renderView =
function() {
	var impl= this._controller.getRender(this._viewInfo);
	this._render=eval(['new ', impl, '(this, this._id, this._viewInfo, this._controller)'].join(''));
	this._height=this._render.render(this.getHtmlElement(), this._viewInfo.getLayout());
	//Set focus after rendering
	this._render.setFocus();
	//adjust size if necessary.
	this._adjustHeightByRender();
	return this._height;
} 

/**
 * Adjust height
 */
CalemView.prototype._adjustHeightByRender =
function() {
	var sz=this.getSize();
	if (sz.y ==0 ) {
		this.setSize(Dwt.DEFAULT, this._height);
		//Adjust view holder's size as well - view's size has been fit to the holder before rendering.
		this._parent.setSize(Dwt.DEFAULT, this._height);
	}
	if (CalemDebug.isDebug()) CalemDebug.debug("CalemView's height before="+sz.y+", after="+this.getSize().y);
} 

/**
 * Validation methods
 */
CalemView.prototype.verifyViewInput =
function(fld, isValid) {
	return this._render.verifyViewInput(fld, isValid);
}  

/**
 * Field value in native type (such as date)
 */
CalemView.prototype.getFieldValue =
function(id) {
	return this._render.getFieldValue(id);
} 

/**
 * Field value for use in server
 * (most values are the same as <code>getFieldValue</code> excepting date/time/datetime
 * 
 */
CalemView.prototype.getEditFieldServerValue =
function(id) {
	return this._render.getEditFieldServerValue(id);
} 

/**
 * Collect field value at insertion.
 */
CalemView.prototype.getInsertFieldServerValue =
function(id) {
	return this._render.getInsertFieldServerValue(id);
} 

CalemView.prototype.setFieldError =
function(id, errMsg) {
	this._render.setFieldError(id, errMsg);
} 

/**
 * shutdown
 */
CalemView.prototype._shutdown =
function() {
	this._render._shutdown();
	//Dispose the view now.
	if (CalemDebug.isInfo()) CalemDebug.info("<font style='color:purple'>Shutting down view for controller: "+this._controller.getId()+"</font>");
	this.dispose();
} 

/**
 * Visibility
 */
CalemView.prototype.getElVisible =
function() {
	if (!this.getVisible()) return false;
	else return this._parent.getElVisible();
}

/**
 * check for record change
 */
CalemView.prototype.getFieldChanged =
function(fld) {
	return this._render.getFieldChanged(fld);
} 

//Valid range
CalemView.prototype.setValidRange =
function(fld, min, max) {
	if (!this._render) return;
	this._render.setValidRange(fld, min, max);	
}

//Valid range
CalemView.prototype.setFieldValue =
function(fld, fv) {
	this._render.setFieldValue(fld, fv);	
}

CalemView.prototype.hasRender =
function(fld) {
	return this._render.hasRender(fld);	
}

/**
 * getFieldSearch
 */
CalemView.prototype.getFieldSearch =
function(fld) {
	return this._render.getFieldSearch(fld);
} 

/**
 * Get customized view from design
 */
CalemView.prototype.getCustomizedView =
function() {
	return this._render.getCustomizedView();
} 

/**
 * Embed controller
 */
CalemView.prototype.embedController =
function(controller) {
	this.parent.embedController(controller);
} 


