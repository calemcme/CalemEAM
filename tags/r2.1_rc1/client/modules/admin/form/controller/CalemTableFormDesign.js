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
 * CalemTableFormDesign
 * This is the table design controller.
 * 
 */
function CalemTableFormDesign(parent, formId, data, designId, dataModel) {
	if (arguments.length==0) return;
	CalemFormDesign.call(this, parent, formId, data, designId, dataModel);
	//Operations to handle
	this._fieldAddListener=new AjxListener(this, this.onFieldAdd);
	this._fieldDeleteListener=new AjxListener(this, this.onFieldDelete);
	this._fieldNameChangeListener=new AjxListener(this, this.onFieldNameChange);
	this._fieldTypeChangeListener=new AjxListener(this, this.onFieldTypeChange);
}

CalemTableFormDesign.prototype = new CalemFormDesign;
CalemTableFormDesign.prototype.constructor = CalemTableFormDesign;

CalemTableFormDesign.prototype.toString = 
function() {
	return "CalemTableFormDesign";
}

/** Record which module we're dealing with. */
CalemTableFormDesign.prototype._createDataModel =
function(data) {
	CalemFormDesign.prototype._createDataModel.call(this);	//no need for the info.
	this._tableId=data.item.id;
	this._tableDd=CalemContext.getInstance().getRegistry().getTableDd(this._tableId);
}

CalemTableFormDesign.prototype.getTableId =
function() {
	return this._tableId;
}

/**
 * Render factory
 */
CalemTableFormDesign.prototype.getRender =
function(info) {
	var render= CalemConf['view_engine']['tableViewDesign'][info.getClassName()];
	if (!render) {
		render=CalemFormDesign.prototype.getRender.call(this, info);
	}
	return render;
}

//Do not cache this form since each time it might be for a different group.
CalemTableFormDesign.prototype.getCacheEmbedOnClose =
function() {
	return false; //close down upon close.
}

/** Operations to handle */
CalemTableFormDesign.prototype.getFieldAddListener = 
function() {
	return this._fieldAddListener;
}

CalemTableFormDesign.prototype.getFieldDeleteListener =
function(evt) {
	return this._fieldDeleteListener;
}

CalemTableFormDesign.prototype.getFieldNameChangeListener =
function(evt) {
	return this._fieldNameChangeListener;
}

CalemTableFormDesign.prototype.getFieldTypeChangeListener =
function(evt) {
	return this._fieldTypeChangeListener;
}

CalemTableFormDesign.prototype.onFieldAdd =
function(evt) {
	var ebInfo=new CalemEmbedInfo(this._parent, 'CalemFieldFormNew', {tableId: this._tableId});
	this._embedForm(ebInfo);
}

CalemTableFormDesign.prototype.onFieldDelete =
function(evt) {
	var id=evt.item.getData(CalemContext.DATA);
	//Note - dialog's event will change the underlying item of evt, so must get data out now.
	var callback=new AjxCallback(this, this.onDeletePromptCallback, id);
	CalemQuestionDialog.showIt(CalemMsg.getMsg('field_delete_title'), CalemMsg.getMsg('field_delete_prompt'), callback);
}

CalemTableFormDesign.prototype.onDeletePromptCallback =
function(id, cont) {
	if (!cont) return;
	var col={col_0 : {id: id, 
							tableId: this._tableDd.getCustomTableName()}};
	CalemSoapUtil._onSoapCall('DeleteField', col, new AjxCallback(this, this._onSoapDeleteFieldResponse, id));
}

//Process response from server.
CalemTableFormDesign.prototype._onSoapDeleteFieldResponse =
function(id, resp) {
	//This is single record so let's process it.
	var rowResp=resp[0];
	if (rowResp.status == CalemForm.SOAP_SUCC) {
		//Modify local DD and refresh the view.
		this._tableDd._deleteCustomField(id);
		this.reRenderView();
	} else { //Need to display error.
		this._onSoapResponseException(rowResp);
	}
}

CalemTableFormDesign.prototype.onFieldNameChange =
function(evt) {
	var id=evt.item.getData(CalemContext.DATA);
	var rec = this._createVtFieldRec(id);
	var ebInfo=new CalemEmbedInfo(this._parent, 'CalemFieldNameFormEdit', {tableId: this._tableId, rec: rec});
	this._embedForm(ebInfo);
}

CalemTableFormDesign.prototype.onFieldTypeChange =
function(evt) {
	var id=evt.item.getData(CalemContext.DATA);
	var rec = this._createVtFieldRec(id);
	var ebInfo=new CalemEmbedInfo(this._parent, 'CalemFieldTypeFormEdit', {tableId: this._tableId, rec: rec});
	this._embedForm(ebInfo);
}

//Only the custom fields need to be repainted.
CalemTableFormDesign.prototype.reRenderView =
function() {
	this._view.reRenderView();
}

CalemTableFormDesign.prototype._createVtFieldRec =
function(id) {
	var field=this._tableDd.getCustomFields()[id];
	//Creating a record: id, type, reqd, length, label, lookup
	var type=CalemViewUtil.getIdByVtFieldType(field['type']); 
	var recVal=[id, type, field['required'], field['length'], this._tableDd.getFieldLabel(id), field['lookup']];
	var reg=CalemContext.getInstance().getRegistry();
	var ci=new CalemLocalCachedItem(reg.getCache(), 'vt_field', [recVal]);
	var rec=ci.getRecordList().getRecord(0);
	return rec;	
}
