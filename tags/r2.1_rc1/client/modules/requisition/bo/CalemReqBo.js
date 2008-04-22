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
 * CalemReqBo - business logic
 */
function CalemReqBo() {
}

CalemReqBo._details = ['req_item'];

CalemReqBo.getInstance =
function() {
	if (!CalemReqBo.singleton) {
		CalemReqBo.singleton = new CalemReqBo();
	}
	return CalemReqBo.singleton;
}

//Asset deletion check
CalemReqBo.prototype.canDelete =
function(rec, callback) {
	if (!this.canModify(rec)) {
		callback.run(false);
		return;
	}
	
	var boUtil=CalemBoUtil.getInstance();
	boUtil.canDeleteByLookup(CalemReqBo._details, 'req_id', rec.id, callback);
}

CalemReqBo.prototype.canModify =
function(recReq) {
	var rtn=(recReq.getField('state_id').getRawValue()!='req_state_closed');
	if (!rtn) {
		CalemInfoDialog.showIt(CalemMsg.getMsg('form_req_edit'),CalemMsg.getMsg('req_closed_no_edit'));
	}
	return rtn;
}

//check state compatiability
CalemReqBo.prototype.canSave =
function(baseRow) {
	var rtn=true;
	var stat=baseRow.update['status_id'];
	if (stat=='req_status_voided') {
		var reqPo=baseRow.current['req_on_po_id'];
		if (reqPo && reqPo!='req_on_po_none') {
			rtn=false;
			CalemInfoDialog.showIt(CalemMsg.getMsg('form_req_edit'),CalemMsg.getMsg('req_on_po_no_void'));
		}
	}
	return rtn;
}
