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
 * CalemEditRender
 * This is the real render class for each control.
 *  
 */
function CalemEditRender(parent, id, fldInfo, controller) {
	if (arguments.length==0) return;
	CalemFieldRender.call(this, parent, id, fldInfo, controller);
}

CalemEditRender.prototype=new CalemFieldRender;
CalemEditRender.prototype.constructor=CalemEditRender;

CalemEditRender.prototype.toString = function() { return "CalemEditRender"; }

/**
 * CalemEditRender interfaces
 */
//CalemEditRender.prototype.render - is implementedby every derived render.

//validation
CalemEditRender.prototype.setupValidation =
function() {
	this._control.setValidationCallback(this._controller.getValidationCallback());
	this._control.setFieldInfo(this.getFieldInfo());
	this.setupValidRangeByDd();
} 

CalemEditRender.prototype.setupValidRangeByDd =
function() {
	this._minNumVal= this._tableDd.getMinValue(this._field);
	this._maxNumVal= this._tableDd.getMaxValue(this._field);
}

CalemEditRender.prototype.setValidRange =
function(min, max) {
	this._minNumVal= min;
	this._maxNumVal= max;
}

/**
 * Value is already validated as numerical type.
 */
CalemEditRender.prototype._validateRange =
function(value) {
	if (this._minNumVal && value < this._minNumVal)
		throw AjxMessageFormat.format(AjxMsg.numberLessThanMin, this._minNumVal);
	if (this._maxNumVal && value > this._maxNumVal)
		throw AjxMessageFormat.format(AjxMsg.numberMoreThanMax, this._maxNumVal);
}

//Default implementation
CalemEditRender.prototype.setFocus =
function() {
	this._control.focus();
}

//Verify input is exception based.
CalemEditRender.prototype.verifyInput =
function() {
	return this._control.isValid();
} 

//fieldValue
CalemEditRender.prototype.getFieldValue =
function() {
	return this._control.getFieldValue();
}

//Value for server (such as string for date)
CalemEditRender.prototype.getEditFieldServerValue =
function() {
	return this._control.getEditFieldServerValue();
} 

//Default implementation is the same as getEditFieldServerValue.
CalemEditRender.prototype.getInsertFieldServerValue =
function() {
	return this._control.getEditFieldServerValue();
} 

//set field error
CalemEditRender.prototype.setFieldError =
function(errMsg) {
	this._control.setFieldError(errMsg);
} 

//shutdown
CalemEditRender.prototype._shutdown =
function() {
	//Overwrite
} 

//field changed
CalemEditRender.prototype.getFieldChanged =
function() {
	var rec=this._modelItem.getCurrentRecord();
	var changed=false;
	var ctrlVal=this._getCtrlValue();
	if ( (rec.id && !rec.getField(this._field).valueEquals(ctrlVal) ) //edit mode
    	    || (rec.id==null && this._tableDd.getDefaultValue(this._field) != ctrlVal) ) { //insertion mode.
		changed=true;			
	}	
	//@cl-del keep for first pass
	if (CalemDebug.isDebug() && changed) {
		CalemDebug.debug("<font style='color:purple;'>Changed fld="+this._field+", fldValue="+rec.getField(this._field).getRawValue()+", formValue="+ctrlVal+", default="+this._tableDd.getDefaultValue(this._field)+"</font>");		   
	}
	return changed;
} 

//Default implementation for all the read renders.
CalemEditRender.prototype.resumeView =
function() {
	var val= this._getFieldEditValueByRec();
	this._control.setValue(val, true); 
}

CalemEditRender.prototype._getDefaultValue =
function(rec) {
	//Assume each rec has an Id for editing (as a rule of thumb)
	return (rec.id) ? null : this._tableDd.getDefaultValue(this._field);
}

//Considering going back to null (as in null replacement)
CalemEditRender.prototype._getCtrlValue =
function() {
	var val=this._control.getFieldValue();
	if (val==this.getNullReplacement()) val=null; //Get rid of null replacement.
	return val;
}

CalemEditRender.prototype.setFieldReadOnly =
function() {
	this._control.setReadOnly();
}

CalemEditRender.prototype.setFieldValue =
function(fv) {
	this._control.setValue(fv, true);
}
