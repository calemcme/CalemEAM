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
 * CalemDropdownFormDesign
 * This is the table design controller.
 * 
 */
function CalemDropdownFormDesign(parent, formId, data, designId, dataModel) {
	if (arguments.length==0) return;
	CalemFormDesign.call(this, parent, formId, data, designId, dataModel);
	//Operations to handle
	this._dropdownAddListener=new AjxListener(this, this.onDropdownAdd);
	this._dropdownDeleteListener=new AjxListener(this, this.onDropdownDelete);
	this._dropdownEditListener=new AjxListener(this, this.onDropdownEdit);
}

CalemDropdownFormDesign.prototype = new CalemFormDesign;
CalemDropdownFormDesign.prototype.constructor = CalemDropdownFormDesign;

CalemDropdownFormDesign.prototype.toString = 
function() {
	return "CalemDropdownFormDesign";
}

/** Record which module we're dealing with. */
CalemDropdownFormDesign.prototype._createDataModel =
function(data) {
	CalemFormDesign.prototype._createDataModel.call(this);	//no need for the info.
	this._tableId=data.item.id;
	this._tableDd=CalemContext.getInstance().getRegistry().getTableDd(this._tableId);
}

CalemDropdownFormDesign.prototype.getTableId =
function() {
	return this._tableId;
}

/**
 * Render factory
 */
CalemDropdownFormDesign.prototype.getRender =
function(info) {
	var render= CalemConf['view_engine']['dropdownViewDesign'][info.getClassName()];
	if (!render) {
		render=CalemFormDesign.prototype.getRender.call(this, info);
	}
	return render;
}

//Do not cache this form since each time it might be for a different group.
CalemDropdownFormDesign.prototype.getCacheEmbedOnClose =
function() {
	return false; //close down upon close.
}

/** Operations to handle */
CalemDropdownFormDesign.prototype.getDropdownAddListener = 
function() {
	return this._dropdownAddListener;
}

CalemDropdownFormDesign.prototype.getDropdownDeleteListener =
function() {
	return this._dropdownDeleteListener;
}

CalemDropdownFormDesign.prototype.getDropdownEditListener =
function(evt) {
	return this._dropdownEditListener;
}

CalemDropdownFormDesign.prototype.onDropdownAdd =
function(evt) {
	var ebInfo=new CalemEmbedInfo(this._parent, 'CalemDropdownFormNew', {tableId: this._tableId});
	this._embedForm(ebInfo);
}

/**
 * Add from Dnd
 */
CalemDropdownFormDesign.prototype.addDropdown =
function(id) {
	//Init DD first, then, prepare a row, do a soap call, then refresh the screen.
	this._tableDd.createVtDropdownDd(CalemConst._VT_DROPDOWN_USE);
	var dm= this._tableDd.getOobDropdownMap();
	var row={};
	row['id']=id;
	for (var i in dm[id]) {
		row[i]=dm[id][i];
	}
	row['tableId']=this._tableId;
	row['label']=CalemMsg.getMsg(id);
	row['locale']=CalemContext.getInstance().getUserInfo().locale;

	var entry={entry_0 : row};
	CalemSoapUtil._onSoapCall('AddDropdown', entry, new AjxCallback(this, this._onSoapAddResponse, row));
}

//Process response from server.
CalemDropdownFormDesign.prototype._onSoapAddResponse =
function(row, resp) {
	//This is single record so let's process it.
	var rowResp=resp[0];
	if (rowResp.status == CalemForm.SOAP_SUCC) {
		this._tableDd.addDropdown(row);
		this.reRenderView();
	} else { //Need to display error.
		this._onSoapResponseException(rowResp);
	}
}

/**
 * Swap from Dnd
 */
CalemDropdownFormDesign.prototype.swapDropdown =
function(srcId, dstId) {
	var row={};
	row['id']=srcId;
	row['swapId']=dstId;
	row['tableId']=this._tableId;
	
	var entry={entry_0 : row};
	CalemSoapUtil._onSoapCall('SwapDropdown', entry, new AjxCallback(this, this._onSoapSwapResponse, row));
}

//Process response from server.
CalemDropdownFormDesign.prototype._onSoapSwapResponse =
function(row, resp) {
	//This is single record so let's process it.
	var rowResp=resp[0];
	if (rowResp.status == CalemForm.SOAP_SUCC) {
		this._tableDd.swapDropdown(row['id'], row['swapId'], row['tableId']);
		this.reRenderView();
	} else { //Need to display error.
		this._onSoapResponseException(rowResp);
	}
}

CalemDropdownFormDesign.prototype.onDropdownDelete =
function(evt) {
	var id=evt.item.getData(CalemContext.DATA);
	//Note - dialog's event will change the underlying item of evt, so must get data out now.
	var callback=new AjxCallback(this, this.onDeletePromptCallback, id);
	CalemQuestionDialog.showIt(CalemMsg.getMsg('dropdown_delete_title'), CalemMsg.getMsg('dropdown_delete_prompt'), callback);
}

CalemDropdownFormDesign.prototype.onDeletePromptCallback =
function(id, cont) {
	if (!cont) return;
	var col={col_0 : {id: id, 
							tableId: this._tableId}};
	CalemSoapUtil._onSoapCall('DeleteDropdown', col, new AjxCallback(this, this._onSoapDeleteEntryResponse, id));
}

//Process response from server.
CalemDropdownFormDesign.prototype._onSoapDeleteEntryResponse =
function(id, resp) {
	//This is single record so let's process it.
	var rowResp=resp[0];
	if (rowResp.status == CalemForm.SOAP_SUCC) {
		//Modify local DD and refresh the view.
		this._tableDd.deleteDropdown(id);
		this.reRenderView();
	} else { //Need to display error.
		this._onSoapResponseException(rowResp);
	}
}

CalemDropdownFormDesign.prototype.onDropdownEdit =
function(evt) {
	var id=evt.item.getData(CalemContext.DATA);
	var ebInfo=new CalemEmbedInfo(this._parent, 'CalemDropdownFormEdit', {tableId: this._tableId, id: id});
	this._embedForm(ebInfo);
}

//Only the custom fields need to be repainted.
CalemDropdownFormDesign.prototype.reRenderView =
function() {
	this._view.reRenderView();
}
 