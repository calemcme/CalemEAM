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
 * CalemPoBo - business logic
 */
function CalemPoBo() {
}

CalemPoBo._details = ['po_item'];

CalemPoBo.getInstance =
function() {
	if (!CalemPoBo.singleton) {
		CalemPoBo.singleton = new CalemPoBo();
	}
	return CalemPoBo.singleton;
}

//Asset deletion check
CalemPoBo.prototype.canDelete =
function(rec, callback) {
	if (!this.canModify(rec) || !this.canDeleteStatus(rec) ) {
		callback.run(false);
		return;
	}
	
	var boUtil=CalemBoUtil.getInstance();
	boUtil.canDeleteByLookup(CalemPoBo._details, 'po_id', rec.id, callback);
}

CalemPoBo.prototype.canDeleteStatus =
function(rec) {
	var rtn=true;
	var status=rec.getField('status_id').getRawValue();
	if (status=='po_status_submitted' || status=='po_status_acked') {
		CalemInfoDialog.showIt(CalemMsg.getMsg('form_po_delete'),CalemMsg.getMsg('po_submitted_no_deletion'));
		rtn=false;
	}
	return rtn;
}

CalemPoBo.prototype.canModify =
function(rec) {
	//Must not be closed
	var rtn=(rec.getField('state_id').getRawValue()!='po_state_closed');
	if (!rtn) {
		CalemInfoDialog.showIt(CalemMsg.getMsg('form_po_edit'),CalemMsg.getMsg('po_closed_no_edit'));
	}
	return rtn;
}

//check state compatiability
CalemPoBo.prototype.canSave =
function(baseRow) {
	var rtn=true;
	var stat=baseRow.update['status_id'];
	if (stat=='po_status_voided') {
		var old=baseRow.current['status_id'];
		if (old=='po_status_submitted' || old=='po_status_acked') {
			rtn=false;
			CalemInfoDialog.showIt(CalemMsg.getMsg('form_po_edit'),CalemMsg.getMsg('po_submitted_no_void'));
		}
	}
	return rtn;
}
