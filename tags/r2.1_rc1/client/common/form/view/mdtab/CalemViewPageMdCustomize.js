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
 * CalemViewPageMdCustomize
 * This is the page that host a view page.
 */
function CalemViewPageMdCustomize(parent, className, positionStyle, controller, fmInfo, customInfo, tabId) {
	if (arguments.length==0) return;
	CalemViewPageMd.call(this, parent, className, positionStyle, controller, fmInfo, customInfo, tabId);
	this._startDelay=CalemConf['view_engine']['viewMdTabDesign'].startDelay;
	this._customizeAction=new AjxTimedAction(this, this.onCustomize);
}

CalemViewPageMdCustomize.prototype = new CalemViewPageMd;
CalemViewPageMdCustomize.prototype.constructor = CalemViewPageMdCustomize;

CalemViewPageMdCustomize.prototype.toString = function() { return "CalemViewPageMdCustomize"; }


CalemViewPageMdCustomize.prototype._createRender =
function() {
	//No need for a render here.
}

CalemViewPageMdCustomize.prototype.isCustomTab =
function() {
	return true;
}

CalemViewPageMdCustomize.prototype.handleCustomize =
function() {
	AjxTimedAction.scheduleAction(this._customizeAction, this._startDelay);
}

CalemViewPageMdCustomize.prototype.onCustomize =
function() {
	this._controller.onCustomize();
}
