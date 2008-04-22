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
 * CalemEditDropdownJoinRender
 * Render dropdown edit field.
 *  
 */
function CalemEditDropdownJoinRender(parent, id, fldInfo, controller) {
	if (arguments.length==0) return;
	CalemEditRender.call(this, parent, id, fldInfo, controller);
	this._cache=CalemContext.getInstance().getRegistry().getCache();
}

CalemEditDropdownJoinRender.prototype=new CalemEditRender;
CalemEditDropdownJoinRender.prototype.constructor=CalemEditDropdownJoinRender;

CalemEditDropdownJoinRender.prototype.toString = function() { return "CalemEditDropdownJoinRender"; }

CalemEditDropdownJoinRender.prototype.render =
function(parentEl, yOff) {
	this._initFieldInfo();
	this._control=new CalemEditDropdown(this._parent, this._values);
	this._control.reparentHtmlElement(parentEl);
	//Now get both id and value here.
	this.resumeView();
}

CalemEditDropdownJoinRender.prototype._initFieldInfo =
function() {
	this._lkupDd=this._tableDd.getLookupTableDd(this._field);
	//Get data from cache and prepare the list.
	var recList=this._cache.getDropdown(this._lkupDd.getTableName()).getRecordList();
	this._values=[];
	for (var i=0; i< recList.getTotal(); i++) {
		var rec=recList.getRecord(i);
		var msg=CalemMsg.getMsg(rec.getField('id').getRawValue());
		this._values.push({id: rec.id, msg: msg})
	}
}

//Default implementation for all the read renders.
CalemEditDropdownJoinRender.prototype.resumeView =
function() {
	val= this._getFieldRawValueByRec();
   this._control.setValue(val, true);  //No validation  
}

//Insert the displayed drop down value
CalemEditDropdownJoinRender.prototype.getInsertFieldServerValue =
function() {
	var val=this._control.getFieldValue();
	val= val ? val : this._values[0].id;
	return val;
} 

CalemEditDropdownJoinRender.prototype.setFieldReadOnly =
function() {
	this._control.setReadOnly();
}



