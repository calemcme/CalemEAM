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
 * CalemEditNumberRender
 * Render Number edit field.
 *  
 */
function CalemEditNumberRender(parent, id, fldInfo, controller) {
	if (arguments.length==0) return;
	CalemEditRender.call(this, parent, id, fldInfo, controller);
	this._formatter=CalemTextUtil.getFormatter(CalemTextUtil.NUMBER_FORMATTER);
}

CalemEditNumberRender.prototype=new CalemEditRender;
CalemEditNumberRender.prototype.constructor=CalemEditNumberRender;

CalemEditNumberRender.prototype.toString = function() { return "CalemEditNumberRender"; }

CalemEditNumberRender.prototype.render =
function(parentEl, yOff) {
	var len=this._tableDd.getTextInputLength(this._field);
	this._control=new CalemInputField({parent: this._parent, type: DwtInputField.STRING, 
	              size: len,
	              errorIconStyle: CalemConf['view_engine']['field']['inputErrorIcon']});
	//No length validation.
	if (this._tableDd.isRequired(this._field)) {
		this._control.setRequired(true);
	}
	this._control.setValidatorFunction(this, this.onValidator);
	this._control.reparentHtmlElement(parentEl);
	var val= this._getFieldEditValueByRec();
	this._control.setValue(val, true);           
}

CalemEditNumberRender.prototype.onValidator = 
function(value) {
	if (this._control._required && !value) throw AjxMsg.valueIsRequired;
	var val=CalemTextUtil.isNumberValid(value);	
	this._validateRange(val);
	return val ? this._formatter.format(val) : val;
}

CalemEditNumberRender.prototype.getFieldValue =
function() {
	var val= this._control.getValue();
	return CalemTextUtil.isNumberValid(val);
} 

//Value for server (such as string for date)
CalemEditNumberRender.prototype.getEditFieldServerValue =
function() {
	var rtn=null;
	var val=this.getFieldValue();
	if (val) {
		rtn=CalemTextUtil.formatServerNumber(val);
	}
	return rtn;
} 

CalemEditNumberRender.prototype.getInsertFieldServerValue =
function() {
	return this.getEditFieldServerValue();
} 

//Compare results.
CalemEditNumberRender.prototype.getFieldChanged =
function() {
	var rec=this._modelItem.getCurrentRecord();
	return !rec.getField(this._field).valueEquals(this.getFieldValue());
} 

