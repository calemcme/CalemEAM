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
 * CalemSearchSave
 * This is search save control.
 */
function CalemSearchSave(parent, search) {
	if (arguments.length==0) return;
	DwtComposite.call(this, parent, 'CalemSearchSave');
	this._selectListener=new AjxListener(this, this.onSelect);
	this._vdCallback=new AjxCallback(this, this.onVdCallback);
	this._createControl(parent);
	this.setupSearch(search);
} 

CalemSearchSave.prototype = new DwtComposite;
CalemSearchSave.prototype.constructor = CalemSearchSave;

CalemSearchSave.prototype.toString = function() { return "CalemSearchSave"; }

CalemSearchSave.prototype._createControl  =
function(parent) {
	var el=this.getHtmlElement();
	var editId=Dwt.getNextId();
	var selectId=Dwt.getNextId();
	el.innerHTML=["<table class=CalemSearchSaveTable><tr>",
	              "<td id=", editId, " class=CalemSearchSaveEditTd></td>",
	              "<td class=CalemSearchSaveAsTd>", CalemMsg.getMsg("search_as"), "</td>",
	              "<td id=", selectId, " class=CalemSearchSaveSelectTd> </td>",
	              "</tr></table>"].join('');
	//Getting the elements
	var editEl=document.getElementById(editId);
	var selectEl=document.getElementById(selectId);	                            
	//Creating the elements
	this._edit = new CalemInputField({parent: parent, type: DwtInputField.STRING, 
	              	size: CalemConf['view_engine']['searchSave']['display'],
	              	errorIconStyle: CalemConf['view_engine']['field']['inputErrorIcon']});
	this._edit.setValidStringLengths(null, CalemConf['view_engine']['searchSave']['max']);
	this._edit.setValidationCallback(this._vdCallback);
	this._edit.reparentHtmlElement(editEl);
	//Deciding the value to display on select
	this._select=new DwtSelect(this.parent);
	this._select.addChangeListener(this._selectListener);
	this._select.reparentHtmlElement(selectEl);
	//Data initialization
	this._initControl();
}

//Some initialization
CalemSearchSave.prototype._initControl =
function() {
	//Set up options to save.
	var userInfo=CalemContext.getInstance().getUserInfo();
	this._searchOptions=new Object();
	this._searchOptions[userInfo.uid]={shared: false, value: CalemMsg.getMsg('search_mine')};
	if (CalemDropdownUtil.isAdmin(userInfo.admin_type_id)) {
		this._searchOptions[userInfo.gid]={shared: true, value: CalemMsg.getMsg('search_group')};
		this._searchOptions[CalemConst.CUSTOM_SYSTEM]={shared: true, value: CalemMsg.getMsg('search_system')};
	} else if (CalemDropdownUtil.isAdminGroup(userInfo.gid)) {
		this._searchOptions[userInfo.gid]={shared: true, value: CalemMsg.getMsg('search_group')};
	}
	//Init selection
	//Add stuff to the select dropdown.
	for (var i in this._searchOptions) {
		var option=new DwtSelectOption(i, this._searchOptions[i].selected, this._searchOptions[i].value);
		this._select.addOption(option);
	}
	//Init edit result
	this._saveValue=new Object();
}

//setup search
CalemSearchSave.prototype.setupSearch =
function(search) {
	this._search=search;
	//Set edit to the existing name of the search.
	var val=this._search ? this._search.getName() : '';
	this._saveValue._name=val;
	this._edit.setValue(val, true);
	//Init selection
	var opVal;
	if (this._search) {
		opVal=this._search.getAxoId();
		this._saveValue._shared=this._searchOptions[this._search.getAxoId()].shared;
		this._saveValue._axoId=this._search.getAxoId();
	} else { //Default to personal if there're no search at all.
		var userInfo=CalemContext.getInstance().getUserInfo();
	   opVal=userInfo.uid;
		this._saveValue._shared=false;
		this._saveValue._axoId=userInfo.uid;
	}
	//Option
	this._select.setSelectedValue(opVal);
}

CalemSearchSave.prototype.onSelect =
function(ev) {
	this._saveValue._axoId=ev._args.newValue;
	this._saveValue._shared=this._searchOptions[this._saveValue._axoId].shared;
}

CalemSearchSave.prototype.setFocus =
function() {
	//Not supported.
}

CalemSearchSave.prototype.getSaveValue =
function() {
	return this._saveValue;
}

//Validation callback here
CalemSearchSave.prototype.setValidationCallback =
function(vcCallback) {
	this._parentVdCallback=vcCallback;
}

CalemSearchSave.prototype.onVdCallback =
function(field, isValid, value) {
	if (isValid) this._saveValue._name=value;
	this._parentVdCallback.run(field, isValid, value);
}

//Set field info
CalemSearchSave.prototype.setFieldInfo =
function(field) {
	this._edit.setFieldInfo(field);
}
