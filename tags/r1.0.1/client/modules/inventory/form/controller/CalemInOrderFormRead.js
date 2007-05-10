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
 * CalemInOrderFormRead
 */
function CalemInOrderFormRead(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormRead.call(this, parent, formId, data);
	this._inGenOrderReq = new AjxListener(this, this.onInGenOrderReq);
	this._onInGenOrderInfoCb=new AjxCallback(this, this.onInGenOrderInfoCb);
}

CalemInOrderFormRead.prototype = new CalemFormRead;
CalemInOrderFormRead.prototype.constructor = CalemInOrderFormRead;

CalemInOrderFormRead.prototype.toString = function() { return "CalemInOrderFormRead";}

/**
 * Business APIs
 */
CalemInOrderFormRead.prototype.getInGenOrderReq =
function(evt) {
	return this._inGenOrderReq;
}

//get a change note
CalemInOrderFormRead.prototype.onInGenOrderReq =
function(evt) {
	var rec=CalemEvent.getItem(evt);
	var row=new Object();
	row['in_id']=rec.id;
	this._openEmbedForm('CalemInGenOrderFormNew', {row: row});
} 

CalemInOrderFormRead.prototype.onInGenOrderReqInfoCollected =
function(table, reqRow, inRow) {
	var rows={row_0: {in_id: inRow['in_id'],
	                  reqRow: reqRow}};
	CalemSoapUtil._onSoapCall('GenInOrderRequest', rows, this._onInGenOrderInfoCb);
} 

CalemInOrderFormRead.prototype.onInGenOrderInfoCb =
function(resp) {
	var rowResp=resp[0];
	if (rowResp.status == CalemForm.SOAP_SUCC) {
		this._reLoadData(true);		
	} else { //Need to display error.
		this._onSoapResponseException(rowResp);
	}
}

CalemInOrderFormRead.prototype.getReportId =
function() {
	return 'CalemInOrderReportList';
} 


