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
 * CalemReqItemBo - business logic
 */
function CalemReqItemBo() {
}

CalemReqItemBo.getInstance =
function() {
	if (!CalemReqItemBo.singleton) {
		CalemReqItemBo.singleton = new CalemReqItemBo();
	}
	return CalemReqItemBo.singleton;
}

CalemReqItemBo.prototype.canDelete =
function(rec) {
	var rtn=(rec.getField('po_id').getRawValue() ? false : true);
	if (!rtn) {
		CalemInfoDialog.showIt(CalemMsg.getMsg('form_req_edit'),CalemMsg.getMsg('req_item_on_po_no_deletion'));
	}
	return rtn;
}
