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
 * CalemSearchBooleanRender
 * Render boolean Search field.
 *  
 */
function CalemSearchBooleanRender(parent, id, fldInfo, controller) {
	if (arguments.length==0) return;
	CalemSearchFieldRender.call(this, parent, id, fldInfo, controller);
	this._changeListener=new AjxListener(this, this.onChange);
	this._parentVdCallback=this._controller.getValidationCallback();
}

CalemSearchBooleanRender.prototype=new CalemSearchFieldRender;
CalemSearchBooleanRender.prototype.constructor=CalemSearchBooleanRender;

CalemSearchBooleanRender.prototype.toString = function() { return "CalemSearchBooleanRender"; }

CalemSearchBooleanRender.prototype._createControl =
function(parentEl) {
	this._control=new DwtSelect(this._parent);
	this._control.reparentHtmlElement(parentEl);
	//set up other stuff here.
	this._options=CalemViewUtil.getBooleanSearchOptions();
	for (var i in this._options) {
		this._control.addOption(this._options[i]);
	}
	this._control.addChangeListener(this._changeListener);  
	this.resumeView();       
}

CalemSearchBooleanRender.prototype._getFieldOps =
function() {
	return this._ops['boolean'];
}

CalemSearchBooleanRender.prototype.verifyInput =
function() {
	return true;
} 

CalemSearchBooleanRender.prototype.getFieldDbValue =
function() {
	var opt=this._control.getSelectedOption();
	if (opt._value==CalemConst._EMPTY) return null;
	var rtn= (opt._value==CalemConst._TRUE) ? 1 : 0;
	return new CalemDbBoolean(rtn);
}

//Don't worry about validation for this type
//validation
CalemSearchBooleanRender.prototype.setupValidation =
function() {
	//no function.
} 

//Handle validation for search
CalemSearchBooleanRender.prototype.onChange =
function() {
	this._parentVdCallback.run(this, true); //To activate empty check.
}

//resumeView
CalemSearchBooleanRender.prototype.resumeView =
function() {
	var val= this._getSearchValue();
	var idx= val ? CalemConst._TRUE : (typeof(val)=='number' ? CalemConst._FALSE : CalemConst._EMPTY);
	this._control.setSelectedOption(this._options[idx]); 
}
