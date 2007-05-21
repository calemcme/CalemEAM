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
 * CalemSearchLookupRender
 * Render lookup Search field.
 *  
 */
function CalemSearchLookupRender(parent, id, fldInfo, controller) {
	if (arguments.length==0) return;
	CalemSearchFieldRender.call(this, parent, id, fldInfo, controller);
}

CalemSearchLookupRender.prototype=new CalemSearchFieldRender;
CalemSearchLookupRender.prototype.constructor=CalemSearchLookupRender;

CalemSearchLookupRender.prototype.toString = function() { return "CalemSearchLookupRender"; }

CalemSearchLookupRender.prototype._createControl =
function(parentEl) {
	this._initFieldInfo();
	var len=this._lkupDd.getTextInputLength(this._lkupFld); //This is the lookup info.
	var doAc=false; //Auto-completion.
	if (this._lkupDd.isTextField(this._lkupFld)) {
		this._control=new CalemEditTextLookup({parent: this._parent, type: DwtInputField.STRING, 
	              size: this._lkupDd.getTextDisplayLength(this._lkupFld),
	              rows: this._lkupDd.getTextDisplayRows(this._lkupFld),
	              //Note: must have error icon set so DwtInputField will render it as a string first.
	              errorIconStyle: CalemConf['view_engine']['field']['inputErrorIcon']});
	} else {
		doAc=true; //Do AC for normal edit only.
		this._control=new CalemEditLookup({parent: this._parent, type: DwtInputField.STRING, 
	              size: len, errorIconStyle: CalemConf['view_engine']['field']['inputErrorIcon']});
	}
	this._control.setValidStringLengths(null, len);
	this._control.reparentHtmlElement(parentEl);
	//set up other stuff here.
	var lkupFm=CalemFormDef._getLookupForm(this._lkupDd.getTableName(), this._field, this._controller);
	this._control.setLookupForm(lkupFm);
	this._control.setController(this._controller);
	//set up validator here
	this._control.setValidator(this, this._onValidator);
	this.resumeView();	
	//Init AC
	if (doAc) {
		this._control.setupAc(this._field, this._lkupFld, this._lkupDd);
        }
}

CalemSearchLookupRender.prototype._getFieldOps =
function() {
	return this._ops['join'];
}

/**
 * Also monitor <code>this._opControl</code>
 */
CalemSearchLookupRender.prototype._otherInit =
function() {
	this._opControl.addChangeListener(new AjxListener(this, this.onOpChange));
	this._vdCallback=this._control.getValidatorCallback();
} 

CalemSearchLookupRender.prototype._addOpChangeListener =
function() {
	//Do not register here...
}

CalemSearchLookupRender.prototype._initFieldInfo =
function() {
	this._lkupDd=this._tableDd.getLookupTableDd(this._field);
	var map=lkupDd.getLookupMapping();
	this._lkupFld=this._lkupDd.getPrimaryLookup();
}

CalemSearchLookupRender.prototype.getFieldInfo =
function() {
	return {fld: this._field, lkupFld: this._lkupFld};
}

/**
 * Validate only when EQ is used.
 */
CalemSearchLookupRender.prototype._onValidator =
function(value, callback) {//Use cache util for this purpose.
	if (this._isOpNull() || this._isOpLike()) {
		callback.run(null, value, true);
	} else {
		value= value ? value.trim() : null;
		if (!value) {
			callback.run(null, value, true);
		} else {
			//This could require a callback situation when validation is done from database...
			this._validateLookup(value, callback);	
		}	
	}
}

/**
 * Validation handling
 */
CalemSearchLookupRender.prototype.onOpChange =
function(evt) {
	var validity=this._control.getValidity();
	if (this._isOpNull() || this._isOpLike()) {
		this._vdCallback.run(null, validity._value, true); //set Id to null and make it valid.
	} else {
		//To revalidate lookup value.
		if (validity._value) {//id is not valid so we need to do a validation.
			this._validateLookup(validity._value, this._vdCallback);
			return;
		} else {
			this._vdCallback.run(null, null, true);
		}
	}	
}

//Just get the validity result should be fine.
CalemSearchLookupRender.prototype._validateLookup =
function(value, callback) {
	this._controller.validateLookup(this._lkupDd.getTableName(), this._lkupFld, this._field, value, callback);
} 

//Just get the validity result should be fine.
CalemSearchLookupRender.prototype.verifyInput =
function() {
	return this._control.getValidity()._valid;
} 

//Value for server (such as string for date)
CalemSearchLookupRender.prototype.getFieldDbValue =
function() {
	var validity=this._control.getValidity();
	if (!validity._value) return null; //no value so be done with it.
	return new CalemDbLookup(validity._id, validity._value);
} 

//resumeView
CalemSearchLookupRender.prototype.resumeView =
function() {
	var val= this._getSearchValue();
	if (val) { //This is a special lookup value (with id and value)
		this._control.setValue(val.getId(), val.getValue(), true);
	} else {
		this._control.setValue(null, this.getNullReplacement(), true);
	}
}
