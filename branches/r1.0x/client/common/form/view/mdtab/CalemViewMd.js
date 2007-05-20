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
 * CalemViewMd
 * This is the master detail view.
 */
function CalemViewMd(parent, controller, className, posStyle) {
	if (arguments.length==0) return;
	className = className || "CalemViewMd";
	CalemView.call(this, parent, controller, className, posStyle);
}

CalemViewMd.prototype = new CalemView;
CalemViewMd.prototype.constructor = CalemViewMd;

CalemViewMd.prototype.toString = function() { return "CalemViewMd"; }

//Public APIs
CalemViewMd.prototype.render =
function() {
	this._formInfo=this._controller.getFormInfo();
	this._renderView();
}

CalemViewMd.prototype.onLayoutChange =
function() {
	this._render.onLayoutChange();
}

CalemViewMd.prototype.resumeView =
function() {
	this._render.resumeView();
}

/**
 * Rendering the view.
 */
CalemViewMd.prototype._renderView =
function() {
	var impl= this._controller.getRender(this);
	var id=this._controller.getId();
	var customInfo=this._controller.getCustomInfo();
	this._render=eval(['new ', impl, '(this, id, this._formInfo, this._controller, customInfo)'].join(''));
	this._render.render(this.getHtmlElement());
	//Set focus after rendering
	this._render.setFocus();
}  

//For ViewMdTab use.
CalemViewMd.prototype.closeAndResumeParentController =
function(action) {
	this.parent.closeAndResumeParentController(action);
} 