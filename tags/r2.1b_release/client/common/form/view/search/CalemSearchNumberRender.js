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
 * CalemSearchNumberRender
 * Render integer edit field.
 *  
 */
function CalemSearchNumberRender(parent, id, fldInfo, controller) {
	if (arguments.length==0) return;
	CalemSearchFieldRender.call(this, parent, id, fldInfo, controller);
	this._formatter=CalemTextUtil.getFormatter(CalemTextUtil.NUMBER_FORMATTER);
}

CalemSearchNumberRender.prototype=new CalemSearchFieldRender;
CalemSearchNumberRender.prototype.constructor=CalemSearchNumberRender;

CalemSearchNumberRender.prototype.toString = function() { return "CalemSearchNumberRender"; }

CalemSearchNumberRender.prototype._createControl =
function(parentEl, yOff) {
	var len=this._tableDd.getTextInputLength(this._field);
	this._control=new CalemInputField({parent: this._parent, type: DwtInputField.STRING, 
	              size: len,
	              errorIconStyle: CalemConf['view_engine']['field']['inputErrorIcon']});
	this._control.setValidatorFunction(this, this.onValidator);
	this._control.reparentHtmlElement(parentEl);
	this.resumeView();           
}

CalemSearchNumberRender.prototype._getFieldOps =
function() {
	return this._ops['double'];
}


CalemSearchNumberRender.prototype.onValidator = 
function(value) {
	if (this._isOpNull()) return value;
	if (this._control._required && !value) throw AjxMsg.valueIsRequired;
	var val=CalemTextUtil.isNumberValid(value);
	return val ? this._formatter.format(val) : val;
}

//fieldValue
CalemSearchNumberRender.prototype.getFieldValue =
function() {
	var val= this._control.getValue();
	return CalemTextUtil.isNumberValid(val);
}

//Value for server (such as string for date)
CalemSearchNumberRender.prototype.getFieldDbValue =
function() {
	var val=this.getFieldValue();
	return  (val!=null) ? new CalemDbNumber(val) : null; //0 is also false.
} 

//Default implementation for all the read renders.
CalemSearchNumberRender.prototype.resumeView =
function() {
	//To convert server integer to local format.    
	var val= this._getSearchValue();
	if (val!=null) {
		val=this._formatter.format(val)
	} else {
		val=this.getNullReplacement();
	}
	this._control.setValue(val, true); 
}
