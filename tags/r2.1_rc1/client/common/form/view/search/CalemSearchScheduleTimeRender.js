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
 * CalemSearchScheduleTimeRender
 * Render Schedule Search field.
 *  
 */
function CalemSearchScheduleTimeRender(parent, id, fldInfo, controller) {
	if (arguments.length==0) return;
	CalemSearchFieldRender.call(this, parent, id, fldInfo, controller);
}

CalemSearchScheduleTimeRender.prototype=new CalemSearchFieldRender;
CalemSearchScheduleTimeRender.prototype.constructor=CalemSearchScheduleTimeRender;

CalemSearchScheduleTimeRender.prototype.toString = function() { return "CalemSearchScheduleTimeRender"; }

CalemSearchScheduleTimeRender.prototype._createControl =
function(parentEl) {
	this._control=new CalemEditSchedule({parent: this._parent});
	this._control.reparentHtmlElement(parentEl);
	//Do the work that facade is doing
	this._render=this;
	this.setupValidation();
	
	this.resumeView();
}

CalemSearchScheduleTimeRender.prototype._getFieldOps =
function() {
	return this._ops['schedule'];
}

//fieldValue
CalemSearchScheduleTimeRender.prototype.getFieldValue =
function() {
	return this._control.getFieldValue();
}

//Value for server (such as Schedule for date)
CalemSearchScheduleTimeRender.prototype.getFieldDbValue =
function() {
	var val=this.getFieldValue();
	return new CalemDbString(val);
} 

//resumeView
CalemSearchScheduleTimeRender.prototype.resumeView =
function() {
	var val= this._getSearchValue();
   this._control.setValue(val, true);  //No validation
}
