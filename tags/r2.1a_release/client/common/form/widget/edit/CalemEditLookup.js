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
 * CalemEditLookup
 * This is the general edit lookup field.
 * Use <id, value, valid> tuple to keep track of validity so that 
 * a real validation is performed only when the value is changed.
 */
function CalemEditLookup(param) {
	if (arguments.length==0) return;
	DwtComposite.call(this, param.parent, param.className, param.posStyle);
	this._createControl(param);
	//callback from validation
	this._validatorCallback = new AjxCallback(this, this.onValidatorCallback);
	this._validity=new CalemValueValidity(null, null, true);
	this._errorMsg=CalemMsg.getMsg("lookup_invalid");
} 

CalemEditLookup.prototype = new DwtComposite;
CalemEditLookup.prototype.constructor = CalemEditLookup;

CalemEditLookup.prototype.toString = function() { return "CalemEditLookup"; }

CalemEditLookup.prototype._createControl  =
function(param) {
	var el=this.getHtmlElement();
	var editFieldId = Dwt.getNextId();
	var editLookupId = Dwt.getNextId();
	el.innerHTML=["<table cellspacing='0' cellpadding='0'><tr>",
	              "<td id=", editFieldId, "></td>",
	              "<td id=", editLookupId, " class=CalemEditLookupTd> </td>",
	              "</tr></table>"].join('');
	//Get the elements
	this._editFieldEl=document.getElementById(editFieldId);
	this._editLookupEl=document.getElementById(editLookupId);	              
	//Two components for 	              
	this._editField=this._createInputField(param);
	this._editField.setValidatorFunction(this, this.onValidator);
	//Lookup
	this._editLookup=new CalemEditLookupButton(param.parent);
	this._editLookup.setEditControl(this);
	//Link fields to the control
	this._editField.reparentHtmlElement(this._editFieldEl);
	this._editLookup.reparentHtmlElement(this._editLookupEl);	
}

CalemEditLookup.prototype._createInputField =
function(param) {
	return new CalemInputField(param);
}

CalemEditLookup.prototype.getEditField =
function() {
	return this._editField;
}

//Some initialization
CalemEditLookup.prototype.setValidStringLengths =
function(min, max) {
	this._editField.setValidStringLengths(min, max);
}

CalemEditLookup.prototype.setValue =
function(id, val, noValidate) {
	this._editField.setValue(val, noValidate);
	if (noValidate) {//guard against required.
		if (!id && this._editField._required) {
			this._validity.set(id, val,false);
		} else {
			this._validity.set(id, val,true);
		}
	}
}

CalemEditLookup.prototype.setValueByLkup =
function(id, val) {
	this._validity.set(id, val, true);
	this._editField.setValue(val, true);
	//Also notify controller
	if (this._vcCallback) this._vcCallback.run(this._editField, true, val);
	//clear errors if any.
	this._editField._clearFieldError();
}

/**
 * Required must be set prior to editing.
 */
CalemEditLookup.prototype.setRequired =
function() {
	this._editField.setRequired(true);
	this._validity.set(null, null, false);
}

CalemEditLookup.prototype.setLookupForm =
function(fmId) {
	this._editLookup.setLookupForm(fmId);
}

CalemEditLookup.prototype.setController =
function(controller) {
	this._controller=controller;
	this._editLookup.setController(controller);
}

//Setup AC
CalemEditLookup.prototype.setupAc =
function(fld, lkupFld, lkupDd) {
	if (this._controller.getInputAcEnabled(fld)) {
		if (lkupDd.isMemoryCached()) {
			this._ac=new CalemAcCached(fld, lkupFld, lkupDd, this._controller, this);
		} else {
			this._ac=new CalemAcDb(fld, lkupFld, lkupDd, this._controller, this);
		}
	}
}

CalemEditLookup.prototype.focus =
function() {
	this._editField.focus();
}

CalemEditLookup.prototype.clearErrorFlag =
function() {
	if (this._editField._hasFieldError()) {
		this.setValue(null, '', true);
		this._editField._clearFieldError();
	}
}

/**
 * Intercept validator call to optimize validation since lookup validation could be 
 * a soap call to be backend. 
 */
//For simplicity, it's required that both obj and func be valid. 
CalemEditLookup.prototype.setValidator =
function(obj, func) {
	this._validator = {obj: obj, func: func};
	this._editField.setValidatorFunction(this, this.onValidator);
} 

//Validator call
CalemEditLookup.prototype.onValidator =
function(value) {
	//Check for null case.
	if (!value) {
		if (this._editField._required) {
			this._validity.set(null, null, false);
			throw AjxMsg.valueIsRequired;
		} else {
			this._validity.set(null, null, true);
			//return null to parent control to clear error if any.
			return null;
			/** seems for null value exception is not necessary
			this._editField._clearFieldError();
			throw new Object(); //for DwtInputField not to change validity.
			*/
		}
	}
	//Check for changes
	if (value!=this._validity._value) {
		//Otherwise might be an expensive call - need to bring back the id value.
		this._validator.func.call(this._validator.obj, value, this._validatorCallback);
	}
	//Throw an exception to break DwtInput's loop to avoid race condition.
	throw new Object();
}

CalemEditLookup.prototype.getValidatorCallback =
function() {
	return this._validatorCallback;
}

//Validator callback
CalemEditLookup.prototype.onValidatorCallback =
function(id, value, valid) {
	var origValid=this._validity._valid;
	this._validity.set(id, value, valid); //Cache the result here.
	if (CalemDebug.isDebug()) CalemDebug.debug("after onValidator call, validity="+this._validity);
	//Now let's set error indicators properly based on the new value.
	if (valid) {
		this._editField._clearFieldError();
	} else {
		this._editField.setFieldError(this._errorMsg);
	}
	//Invoking validation callback
	this._vcCallback.run(this._editField, valid, value);
}

/**
 * ValidationCall back is also intercepted for optimization.
 */
CalemEditLookup.prototype.setValidationCallback =
function(callback) {
	this._vcCallback=callback;
} 

CalemEditLookup.prototype.setFieldInfo =
function(info) {
	this._editField.setFieldInfo(info);
	this._editLookup.setFieldInfo(info);
} 

/**
 * Overwrite isValid to use only cached result.
 */
CalemEditLookup.prototype.isValid =
function() {
	if (!this._validity._valid) throw (this._errorMsg+", id="+this._validity._id+", value="+this._validity._value);
	return true;
}

//This is native type
CalemEditLookup.prototype.getFieldValue =
function() {
	return this._validity._id;
} 

//This is server type.
CalemEditLookup.prototype.getEditFieldServerValue =
function() {
	return this.getFieldValue();
} 

CalemEditLookup.prototype.setFieldError =
function(errMsg) {
	this._editField.setFieldError(errMsg);
} 

CalemEditLookup.prototype.getValidity =
function() {
	return this._validity;
}

/**
 * Enable/disable
 */
CalemEditLookup.prototype.enable =
function() {
	this._editField.enable();
	this._editLookup.setEnabled(true);
}

CalemEditLookup.prototype.disable =
function() {
	this._editField.disable();
	this._editLookup.setEnabled(false);
}

CalemEditLookup.prototype.setReadOnly =
function() {
	this.disable();
}

/**
 * Validity object storing id, value and valid.
 */
function CalemValueValidity(id, value, valid) {
	if (arguments.length==0) return;
	this.set(id, value, valid);
} 

CalemValueValidity.prototype.set = 
function(id, value, valid) {
	this._id=id;
	this._value=value;
	this._valid=valid;
}

CalemValueValidity.prototype.sameValue = 
function(value, isValid) {
	return (this._value==value && this._valid==isValid);
}

CalemValueValidity.prototype.toString =
function() {
	return ["{id=", this._id, ", value=", this._value, ", valid="+this._valid, "}"].join('');
}

/**
 * Edit lookup text
 */
function CalemEditTextLookup(param) {
	if (arguments.length==0) return;
	CalemEditLookup.call(this, param);
} 

CalemEditTextLookup.prototype = new CalemEditLookup;
CalemEditTextLookup.prototype.constructor = CalemEditTextLookup;
 
CalemEditTextLookup.prototype._createInputField =
function(param) {
	return new CalemEditText(param);
} 

/**
 * CalemEditLookupButton
 * This is the lookup button for edit field.
 */
function CalemEditLookupButton(parent, style, className, posStyle) {
	if (arguments.length==0) return; 
	className= className || 'TBButton';
	DwtButton.call(this, parent, style, className, posStyle);
	//init the control
	this._initControl();
} 

CalemEditLookupButton.prototype = new DwtButton;
CalemEditLookupButton.prototype.constructor = CalemEditLookupButton;

CalemEditLookupButton.prototype.toString = function() { return "CalemEditLookupButton"; }

CalemEditLookupButton.prototype._initControl  =
function(param) {
	//Creating a callback for lookup form to set up value.
	this._lkupCallback = new AjxCallback(this, this._onLkupCallback);
	//Creating a listener for the button
	this._clickListener = new AjxListener(this, this.onButtonClick);
	this.addSelectionListener(this._clickListener);
	//Set up the text here.
	this.setImage('CalemLookup');
} 

CalemEditLookupButton.prototype.setLookupForm =
function(fmId) {
	this._fmId=fmId;
}

CalemEditLookupButton.prototype.setController =
function(controller) {
	this._controller=controller;
}

CalemEditLookupButton.prototype.setEditControl =
function(editCtrl) {
	this._editCtrl = editCtrl;
}

CalemEditLookupButton.prototype.setFieldInfo =
function(fldInfo) {
	this._fldInfo = fldInfo;
}

//Pop up
CalemEditLookupButton.prototype.onButtonClick =
function(ev) {
	//To embed form
	var id=this._editCtrl.getFieldValue();
   this._controller.onLookup(this._fmId, this._lkupCallback, id, this._fldInfo.fld);
}

//Lookup callback
CalemEditLookupButton.prototype._onLkupCallback =
function(rec) {
	this._editCtrl.setValueByLkup(rec.id, rec.getField(this._fldInfo.lkupFld).getRawValue());
	this._controller.onLookupSelect(this._fldInfo.fld, rec);
}
