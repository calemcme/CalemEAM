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
 * CalemEditSysCurrencyRender
 * Render Number edit field.
 *  
 */
function CalemEditSysCurrencyRender(parent, id, fldInfo, controller) {
	if (arguments.length==0) return;
	CalemEditNumberRender.call(this, parent, id, fldInfo, controller);
	this._formatter=CalemTextUtil.getFormatter(CalemTextUtil.CURRENCY_EDIT_FORMATTER);
}

CalemEditSysCurrencyRender.prototype=new CalemEditNumberRender;
CalemEditSysCurrencyRender.prototype.constructor=CalemEditSysCurrencyRender;

CalemEditSysCurrencyRender.prototype.toString = function() { return "CalemEditSysCurrencyRender"; }

CalemEditSysCurrencyRender.prototype.onValidator = 
function(value) {
	if (this._control._required && !value) throw AjxMsg.valueIsRequired;
	var val=CalemTextUtil.isCurrencyValid(value);
	this._validateRange(val);
	return val ? this._formatter.format(val) : val;
}

CalemEditSysCurrencyRender.prototype.getRawValue =
function() {
	var val= this._control.getValue();
	return CalemTextUtil.isCurrencyValid(val);
} 

CalemEditSysCurrencyRender.prototype.getEditFieldServerValue =
function() {
	return this.getRawValue();
} 

