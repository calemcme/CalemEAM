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
 * CalemViewPageMd
 * This is the page that host a view page.
 */
function CalemViewPageMd(parent, className, positionStyle, controller, fmInfo, customInfo, tabId) {
	if (arguments.length==0) return;
	
	className = className || "CalemViewPageMd";
	positionStyle = positionStyle || DwtControl.ABSOLUTE_STYLE;
	CalemViewPage.call(this, parent, className, positionStyle);
	this.setScrollStyle(Dwt.SCROLL); //Allow scroll here.
	//keep track of customInfo
	this._controller=controller;
	this._fmInfo=fmInfo;
	this._customInfo=customInfo;
	this._tabId=tabId;
	this._createRender();
}

CalemViewPageMd.prototype = new CalemViewPage;
CalemViewPageMd.prototype.constructor = CalemViewPageMd;

CalemViewPageMd.prototype.toString = function() { return "CalemViewPageMd"; }


CalemViewPageMd.prototype._createRender =
function() {
	var impl= this._controller.getRender(this);
	var id=this._controller.getId();
	this._render=eval(['new ', impl, '(this, id, this._fmInfo, this._controller, this._customInfo, this._tabId)'].join(''));	
}

CalemViewPageMd.prototype.isCustomTab =
function() {
	return false;
}

/**
 * Interfaces for subclass to overwrite.
 */
CalemViewPageMd.prototype.resumeHost =
function(action) { //action should be handled up above at embedding level.
	if (!this._displayed) {
		this._renderPageMd();
	} else {
		this._render.resumeView();
	}
}

//resumeView
CalemViewPageMd.prototype.resumeView =
function() {
	if (!this.getVisible()) return;
	this._render.resumeView();
}

CalemViewPageMd.prototype._renderPageMd =
function() {
	this._render.render();
	this._displayed=true;
	this._sz=this.getSize();
}

CalemViewPageMd.prototype.showForm =
function() {
	if (!this._displayed) {
		this._renderPageMd();
	} else {//Check for layout change.
		this._checkSizeChange();
	}
}

CalemViewPageMd.prototype._checkSizeChange =
function() {
	if (!this._sz) return; //Not rendered yet.
	var sz=this.getSize();
	if (sz.x != this._sz.x || sz.y != this._sz.y) {
		this._render.onLayoutChange();
	}
}
CalemViewPageMd.prototype.onLayoutChange =
function() {
	this._checkSizeChange();
} 

//Do not imbed at this level.
CalemViewPageMd.prototype.embedController =
function(ebInfo) {
	this.parent.embedController(ebInfo);
}

CalemViewPageMd.prototype.closeAndResumeParentController =
function(action) {
	this.parent.closeAndResumeParentController(action);
}  

/**
 * Close and shutdown handling
 */
CalemViewPageMd.prototype.canClose =
function(callback) { //Forward to the top controller to make a decision.
	this._render._canClose(callback);
}

CalemViewPageMd.prototype.shutdown =
function() {//each form must shutdown itself.
	this._render.shutdown();
}

/**
 * The buck stops here.
 */
CalemViewPageMd.prototype.getElVisible =
function() {
	if (!this.getVisible()) return false;
	else return this.parent.getElVisible();
}



