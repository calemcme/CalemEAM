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
 * CalemReadScheduleTimeRender
 * Render string edit field.
 *  
 */
function CalemReadScheduleTimeRender(parent, id, fldInfo, controller) {
	if (arguments.length==0) return;
	CalemFieldReadRender.call(this, parent, id, fldInfo, controller);
	this._render=this;
}

CalemReadScheduleTimeRender.prototype=new CalemFieldReadRender;
CalemReadScheduleTimeRender.prototype.constructor=CalemReadScheduleTimeRender;

CalemReadScheduleTimeRender.prototype.toString = function() { return "CalemReadScheduleTimeRender"; }

CalemReadScheduleTimeRender.prototype.render =
function(parentEl, yOff) {
	this._control=new CalemReadDefault({parent: this._parent, type: DwtInputField.STRING, 
	              size: CalemConf['edit_schedule']['defaultReadSize']});
	this._control.reparentHtmlElement(parentEl);
	this._refreshField();            
}

//Default implementation for all the read renders.
CalemReadScheduleTimeRender.prototype._refreshField =
function() {
	var val= this._getFieldRawValue();
	var schedule=CalemScheduleTimeInfo._decode(val);
	this._control.setValue(schedule.getText());
}
