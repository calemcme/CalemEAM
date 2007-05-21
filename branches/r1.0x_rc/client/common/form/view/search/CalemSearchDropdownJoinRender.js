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
 * CalemSearchDropdownJoinRender
 * Render dropdown Search field.
 *  
 */
function CalemSearchDropdownJoinRender(parent, id, fldInfo, controller) {
	if (arguments.length==0) return;
	CalemSearchFieldRender.call(this, parent, id, fldInfo, controller);
	this._cache=CalemContext.getInstance().getRegistry().getCache();
	this._rows=CalemConf['view_engine']['viewSearchEditRender'].dropdownRows;
	this._changeCallback=new AjxCallback(this, this.onChange);
	this._parentVdCallback=this._controller.getValidationCallback();
}

CalemSearchDropdownJoinRender.prototype=new CalemSearchFieldRender;
CalemSearchDropdownJoinRender.prototype.constructor=CalemSearchDropdownJoinRender;

CalemSearchDropdownJoinRender.prototype.toString = function() { return "CalemSearchDropdownJoinRender"; }

CalemSearchDropdownJoinRender.prototype._createControl =
function(parentEl) {
	this._initFieldInfo();
	this._control=new CalemEditMultiSelect({parent: this._parent, size: this._rows, items: this._items});
	this._control.reparentHtmlElement(parentEl);
	this.resumeView();
	//link up a callback here - to avoid firing the selection event at initiation.
	this._control.setChangeCallback(this._changeCallback);
}

CalemSearchDropdownJoinRender.prototype.onChange =
function(sel) {
	if (this._parentVdCallback) this._parentVdCallback.run(this._control, true, sel);
}

CalemSearchDropdownJoinRender.prototype._getFieldOps =
function() {
	return this._ops['dropdown_join'];
}

CalemSearchDropdownJoinRender.prototype._initFieldInfo =
function() {
	this._lkupDd=this._tableDd.getLookupTableDd(this._field);
	//Get data from cache and prepare the list.
	var recList=this._cache.get(this._lkupDd.getTableName()).getRecordList();
	this._items=new Object();
	this._items[CalemConst._EMPTY]=CalemMsg.getMsg('no_selection');
	for (var i=0; i< recList.getTotal(); i++) {
		var rec=recList.getRecord(i);
		var msg=CalemMsg.getMsg(rec.getField('id').getRawValue());
		this._items[rec.id]=msg;
	}
}

//Always valid.
CalemSearchDropdownJoinRender.prototype.verifyInput =
function() {
	return true;
} 

//Value for server (such as string for date)
CalemSearchDropdownJoinRender.prototype.getFieldDbValue =
function() {
	var options=this._control._getSelected();	
	if (options.length==0 || (options.length==1 && options[0]==CalemConst._EMPTY)) return null;
	for (var i=0; i< options.length; i++) {
		if (options[i]==CalemConst._EMPTY) {
			options.splice(i, 1);
			break;
		}
	}
	return new CalemDbDropdown(options);
} 

//resumeView
CalemSearchDropdownJoinRender.prototype.resumeView =
function() {
	//Init selected.
	var val= this._getSearchValue();
	if (val && val.length > 0) {
		this._control.setSelected(val);
	} else {
		this._control.setSelected([]);
	} 
}
