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
 * CalemSearchFieldRender
 * This is the real render class for each control.
 *  
 */
function CalemSearchFieldRender(parent, id, fldInfo, controller) {
	if (arguments.length==0) return;
	CalemFieldRender.call(this, parent, id, fldInfo, controller);
	this._ops=controller.getSearchOps();
}

CalemSearchFieldRender.prototype=new CalemFieldRender;
CalemSearchFieldRender.prototype.constructor=CalemSearchFieldRender;

CalemSearchFieldRender.prototype.toString = function() { return "CalemSearchFieldRender"; }

/**
 * Get original search value
 */
CalemSearchFieldRender.prototype._getFieldSearch =
function() {
	var tableSearch = this._controller.getTableSearch();
	return tableSearch ? tableSearch.getField(this._field) : null;
}

CalemSearchFieldRender.prototype._getSearchValue =
function() {
	var fs=this._getFieldSearch();
	var val=fs ? fs.getValue() : null;
	if (val) val=val.getValue();
	return val;
}

/**
 * CalemSearchFieldRender - generic field search render.
 */
CalemSearchFieldRender.prototype.render =
function(parentEl, yOff) {
	this._divEl=document.createElement('div');
	parentEl.appendChild(this._divEl);
	var opId=Dwt.getNextId();
	var fldId=Dwt.getNextId();
	this._divEl.innerHTML=["<table cellspacing='0' cellpadding='0' class=CalemSearchFieldTable><tr>",
			"<td id=", opId, " class=CalemSearchFieldOpTd></td>",
			"<td id=", fldId, " class=CalemSearchFieldTd></td>",
			"</tr></table>"].join('');
	var opEl=document.getElementById(opId);
	var fldEl=document.getElementById(fldId);
	this._createOpControl(opEl);
	this._createControl(fldEl);
	this._otherInit();           
}

/**
 * Search op is shared by all controls
 */
CalemSearchFieldRender.prototype._createOpControl =
function(parentEl) {
	var ops=this._getFieldOps();
	var defaultOp= this._fieldSearch ? this._fieldSearch.getOp() : ops[0];
	this._opControl= new DwtSelect(this._parent, ops);
	this._opControl.setSelectedValue(defaultOp);
	this._opControl.reparentHtmlElement(parentEl);
	//Add a change listener
	this._addOpChangeListener();
}

CalemSearchFieldRender.prototype._addOpChangeListener =
function() {
	this._opControl.addChangeListener(new AjxListener(this, this.onOpChangeField));
}

CalemSearchFieldRender.prototype.onOpChangeField =
function() {//To initiate a validation process.
	this._controller.getValidationCallback().run(CalemConst._DUMMY_FLD, true, null);
}

CalemSearchFieldRender.prototype._isOpNull =
function() {
	return (this._getOp() == CalemConst.DbExpr_IS_NULL || this._getOp() == CalemConst.DbExpr_IS_NOT_NULL);
}

CalemSearchFieldRender.prototype._isOpLike =
function() {
	return (this._getOp() == CalemConst.DbExpr_LIKE);
}

//validation
CalemSearchFieldRender.prototype.setupValidation =
function() {
	this._control.setValidationCallback(this._controller.getValidationCallback());
	this._control.setFieldInfo(this.getFieldInfo());
} 

CalemSearchFieldRender.prototype._otherInit =
function() {
	//Overwrite.
}

//Default implementation
CalemSearchFieldRender.prototype.setFocus =
function() {
	this._control.focus();
}

//Verify input
CalemSearchFieldRender.prototype.verifyInput =
function() {
	if (this._isOpNull()) return true;
	return this._control.isValid();
} 

//fieldValue
CalemSearchFieldRender.prototype.getFieldValue =
function() {
	return this._control.getFieldValue();
}

//set field error
CalemSearchFieldRender.prototype.setFieldError =
function(errMsg) {
	this._control.setFieldError(errMsg);
} 

//shutdown
CalemSearchFieldRender.prototype._shutdown =
function() {
	//Overwrite
} 

//Default implementation
CalemSearchFieldRender.prototype.resumeView =
function() {
	//overwrite 
}

/**
 * Get Op
 */
CalemSearchFieldRender.prototype._getOp =
function() {
	return this._opControl.getValue();
} 

/**
 * Get field object.
 */
CalemSearchFieldRender.prototype._getDbField =
function() {
	return new CalemDbField(this._tableDd.getTableName(), this._field);
} 

/**
 * Get field search
 * If op is unary op (is null, is not null, then it's valid, otherwise it's both op and value).
 */
CalemSearchFieldRender.prototype.getFieldSearch =
function() {
	var rtn=null;
	if (this._isOpNull()) {
		rtn= new CalemDbExpr(this._getDbField(), this._getOp());
	} else {
		var value=this.getFieldDbValue(); //CalemDbValue.
		if (value) {
			rtn=new CalemDbExpr(this._getDbField(), this._getOp(), value);
		}
	}
	return rtn;
}