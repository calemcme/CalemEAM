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
 * CalemPoItemFormList
 */
function CalemPoItemFormList(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormListDet.call(this, parent, formId, data);
	this._poAddItem = new AjxListener(this, this.onPoAddItem);
	this._poAddItemCb=new AjxCallback(this, this.onPoAddItemCb);
	
	this._poRemoveItem = new AjxListener(this, this.onPoRemoveItem);
}

CalemPoItemFormList.prototype = new CalemFormListDet;
CalemPoItemFormList.prototype.constructor = CalemPoItemFormList;

CalemPoItemFormList.prototype.toString = function() { return "CalemPoItemFormList";}

/**
 * Business APIs
 */
CalemPoItemFormList.prototype._getFormNewId =
function(evt) {
    return 'CalemPoItemFormNew';
} 

/**
 * Open a master detailed view with recordlist and current record position.
 */
CalemPoItemFormList.prototype._getFormReadId =
function(evt) {
	return 'CalemPoItemFormRead';
} 

CalemPoItemFormList.prototype.canCreate =
function() {
	return this._canModify();
} 

CalemPoItemFormList.prototype.canDelete =
function(evt) {
	return this._canModify();
}

CalemPoItemFormList.prototype._canModify =
function() {
	var rec=this._dataModel.getParentRec();
	return CalemPoBo.getInstance().canModify(rec);
}

//Add item
CalemPoItemFormList.prototype.getPoAddItem =
function() {
	return this._poAddItem;
}

CalemPoItemFormList.prototype.onPoAddItem =
function() {
	if (!this._canModify()) return;
	
	var pRec=this._dataModel.getParentRec();
	this._openPoTranForm('CalemPoItemAddFormLookup', {poRec: pRec});
}

CalemPoItemFormList.prototype._openPoTranForm =
function(fmId, data) {
	var ebInfo=new CalemEmbedInfo(this._parent, fmId, data);
	this._embedForm(ebInfo);
} 

//Req items selected
CalemPoItemFormList.prototype.onPoItemAddAction =
function(tableId, poRec, items) {
	var rows=this._preparePoItemAddRows(poRec, items);
	CalemSoapUtil._onSoapCall('AddPoItemFromReq', rows, this._poAddItemCb);
}

CalemPoItemFormList.prototype._preparePoItemAddRows =
function(poRec, items) {
	var st='[';
	for (var i=0; i< items.size(); i++) {
		var rec=items.get(i);
		if (i!=0) st= st + ', ';
		st = st + "'" + rec.id +"'";
	}
	st += "]";
	var sb=Base64.encode(st);
	//Now let's make a soap call with busy signal
	var rows={row_0: { po_id: poRec.id, req_item: sb}};
	return rows;	                   
} 

/**
 * Process soap response from server
 */
CalemPoItemFormList.prototype.onPoAddItemCb =
function(resp) {
	//This is single record so let's process it.
	var rowResp=resp[0];
	if (rowResp.status == CalemForm.SOAP_SUCC) {
		//Items added properly so let's refresh data
		this._onDataRefresh();		
	} else { //Need to display error.
		this._onSoapResponseException(rowResp);
	}
}

//Remove item
CalemPoItemFormList.prototype.getPoRemoveItem =
function() {
	return this._poRemoveItem;
}

CalemPoItemFormList.prototype.onPoRemoveItem =
function(evt) {
	var rec=CalemEvent.getItem(evt);
	if (!this._canModify()) return;
	
	var pRec=this._dataModel.getParentRec();
	this._openPoTranForm('CalemPoItemRemoveFormLookup', {poRec: pRec, poItemRec: rec});
}

//Req items selected
CalemPoItemFormList.prototype.onPoItemRemoveAction =
function(tableId, poRec, items) {
	var rows=this._preparePoItemAddRows(poRec, items);
	CalemSoapUtil._onSoapCall('RemovePoItemFromReq', rows, this._poAddItemCb);
}
