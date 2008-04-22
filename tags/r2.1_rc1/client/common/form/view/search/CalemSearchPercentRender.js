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
 * CalemSearchPercentRender
 * Render integer edit field.
 *  
 */
function CalemSearchPercentRender(parent, id, fldInfo, controller) {
	if (arguments.length==0) return;
	CalemSearchNumberRender.call(this, parent, id, fldInfo, controller);
	this._formatter=CalemTextUtil.getFormatter(CalemTextUtil.PERCENT_FORMATTER);
}

CalemSearchPercentRender.prototype=new CalemSearchNumberRender;
CalemSearchPercentRender.prototype.constructor=CalemSearchPercentRender;

CalemSearchPercentRender.prototype.toString = function() { return "CalemSearchPercentRender"; }

CalemSearchPercentRender.prototype._getFieldOps =
function() {
	return this._ops['percent'];
}


CalemSearchPercentRender.prototype.onValidator = 
function(value) {
	if (this._isOpNull()) return value;
	if (this._control._required && !value) throw AjxMsg.valueIsRequired;
	var val=CalemTextUtil.isPercentValid(value);
	return val ? this._formatter.format(val) : val;
}

//fieldValue
CalemSearchPercentRender.prototype.getFieldValue =
function() {
	var val= this._control.getValue();
	return CalemTextUtil.isPercentValid(val);
}

