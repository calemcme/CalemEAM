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
 * CalemToolBarRender
 *  
 */
function CalemToolBarRender(parent, id, tbInfo, controller) {
	if (arguments.length==0) return;
	CalemUiRender.call(this, parent, id, tbInfo, controller);
}

CalemToolBarRender.prototype=new CalemUiRender;
CalemToolBarRender.prototype.constructor=CalemToolBarRender;

CalemToolBarRender.prototype.toString = function() { return "CalemToolBarRender"; }

CalemToolBarRender.prototype.render =
function(parentEl, yOff) {
	this._tb=new CalemToolBar(this._parent, {parentEl: parentEl});
	this._customInfo=this._parentRender.getCustomInfo();
	this._tb.createToolBar(this._info, this._controller.getListenerFactory(), this._controller, this._customInfo);
	this._tb.zShow(true);
}

/**
 * shutdown - to remove all the listeners
 */
CalemToolBarRender.prototype._shutdown =
function() {
	//remove listener for events.
	this._tb._shutdown();
}  
