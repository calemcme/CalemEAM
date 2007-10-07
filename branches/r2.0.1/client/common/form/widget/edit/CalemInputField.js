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
 * CalemInputField
 * Fix the DwtInputField not checking for required first.
 */
function CalemInputField(param) {
	if (arguments.length==0) return;
	DwtInputField.call(this, param);
}

CalemInputField.prototype = new DwtInputField;
CalemInputField.prototype.constructor = CalemInputField;

CalemInputField.prototype.toString = function() {return "CalemInputField";}

/**
 * Overwrite this function not to throw exception.
 */
CalemInputField.prototype._validateInput =
function(value) {
	var rtn;
	try {
		rtn=DwtInputField.prototype._validateInput.call(this, value);
	} catch (ex) {
		if (CalemDebug.isInfo()) CalemDebug.info("Caught exception in CalemInputField _validateInput="+ex+", fld="+this._fieldInfo.fld);
	}
	return rtn;
} 

//Rewrite to be exception based.
CalemInputField.prototype.isValid =
function() {
	if ( this._required && !this._inputField.value) throw AjxMsg.valueIsRequired;
	try {
		if (typeof this._validator == "function") {
			var rtn= this._validatorObj
				? this._validator.call(this._validatorObj, this._inputField.value)
				: this._validator(this._inputField.value);
		} else {
			if (!this._validator.test(this._inputField.value)) {
				throw CalemMsg.getMsg('field_invalid');
			}
		}
	} catch(ex) {
		throw ex;
	}
	this._clearFieldError();
	return true;
}

CalemInputField.prototype.setFieldInfo =
function(info) {
	this._fieldInfo=info;
}

CalemInputField.prototype.getFieldInfo =
function() {
	return this._fieldInfo;
}

//Only string type
CalemInputField.prototype.getFieldValue =
function() {
	return this.getValue(); //This is only for string type.
} 

//Only string type
CalemInputField.prototype.getEditFieldServerValue =
function() {
	return this.getValue(); //This is only for string type.
} 


CalemInputField.prototype.setFieldError =
function(errMsg) {
	this.getHtmlElement().className = this._errorClassName;
	if (this._errorIconTd)
		this._errorIconTd.innerHTML = DwtInputField._ERROR_ICON_HTML;
	this.setToolTipContent(errMsg);
} 

CalemInputField.prototype._clearFieldError =
function() {
  if (this.getHtmlElement().className == this._errorClassName) {
  	 	this.getHtmlElement().className = this._origClassName;
		if (this._errorIconTd)
			this._errorIconTd.innerHTML = DwtInputField._NOERROR_ICON_HTML;
		this.setToolTipContent(null);
  }
}

CalemInputField.prototype._hasFieldError =
function() {
	return (this.getHtmlElement().className == this._errorClassName);
}

//IE readonly workaround
CalemInputField.prototype._setReadOnly =
function(bl) {
	DwtInputField.prototype.setReadOnly.call(this, bl);
  	this._inputField.setAttribute("disabled", bl); //set disabled for it to flip back and forth.
}

CalemInputField.prototype.setReadOnly =
function(bl) {
	this._setReadOnly(true);
}

//IE readonly workaround
CalemInputField.prototype.disable =
function() {
	this._inputField.disabled=true;
}

CalemInputField.prototype.enable =
function() {
	this._inputField.disabled=false;
}

//Clear error when needed
CalemInputField.prototype.setValue =
function(value, noValidate) {
	DwtInputField.prototype.setValue.call(this, value, noValidate);
	if (noValidate) {
		this._clearFieldError();
	}
}
