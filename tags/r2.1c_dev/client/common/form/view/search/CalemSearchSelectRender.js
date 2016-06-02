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
 * CalemSearchSelectRender  
 */
function CalemSearchSelectRender(parent, id, info, controller) {
	if (arguments.length==0) return;
	CalemUiRender.call(this, parent, id, info, controller);
}

CalemSearchSelectRender.prototype=new CalemUiRender;
CalemSearchSelectRender.prototype.constructor=CalemSearchSelectRender;

CalemSearchSelectRender.prototype.toString = function() { return "CalemSearchSelectRender"; }

CalemSearchSelectRender.prototype.render =
function(parentEl, yOff) {
	//overwrite.
}

CalemSearchSelectRender.prototype._render =
function(parentEl, yOff, type) {
	this._el=parentEl;
	this._table=this._controller.getModelItem().getTableDd().getTableName();
	this._control = new CalemSearchSelect(this._parent, this._table, type, this._controller);
	this._control.reparentHtmlElement(this._el);
}

//Resume view assuming a change is made.
CalemSearchSelectRender.prototype.resumeView = 
function() {
	this._control.resumeView();
}

//Default implementation for all the read renders.
CalemSearchSelectRender.prototype._refreshField =
function() {
	this.resumeView();
}

//Default implementation for all the read renders.
CalemSearchSelectRender.prototype.setFocus =
function() {
	this._control.setFocus();
}


/**
 * CalemMySearchSelectRender  
 */
function CalemMySearchSelectRender(parent, id, info, controller) {
	if (arguments.length==0) return;
	CalemSearchSelectRender.call(this, parent, id, info, controller);
}

CalemMySearchSelectRender.prototype=new CalemSearchSelectRender;
CalemMySearchSelectRender.prototype.constructor=CalemMySearchSelectRender;

CalemMySearchSelectRender.prototype.toString = function() { return "CalemMySearchSelectRender"; }

CalemMySearchSelectRender.prototype.render =
function(parentEl, yOff) {
	CalemSearchSelectRender.prototype._render.call(this, parentEl, yOff, CalemConst.MY_SEARCH);
}

/**
 * CalemSharedSearchSelectRender  
 */
function CalemSharedSearchSelectRender(parent, id, info, controller) {
	if (arguments.length==0) return;
	CalemSearchSelectRender.call(this, parent, id, info, controller);
}

CalemSharedSearchSelectRender.prototype=new CalemSearchSelectRender;
CalemSharedSearchSelectRender.prototype.constructor=CalemSharedSearchSelectRender;

CalemSharedSearchSelectRender.prototype.toString = function() { return "CalemSharedSearchSelectRender"; }

CalemSharedSearchSelectRender.prototype.render =
function(parentEl, yOff) {
	CalemSearchSelectRender.prototype._render.call(this, parentEl, yOff, CalemConst.SHARED_SEARCH);
}