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
 * CalemWoDowntimeFormNew
 */
function CalemWoDowntimeFormNew(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormNew.call(this, parent, formId, data);
}

CalemWoDowntimeFormNew.prototype = new CalemFormNew;
CalemWoDowntimeFormNew.prototype.constructor = CalemWoDowntimeFormNew;

CalemWoDowntimeFormNew.prototype.toString = function() { return "CalemWoDowntimeFormNew";}

CalemWoDowntimeFormNew.prototype._getInputDataRow =
function() {
	//Add asset_id in
	var row=CalemFormNew.prototype._getInputDataRow.call(this);
	var pRec=this._dataModel.getParentRec();
	row['asset_id']=pRec.getField('asset_id').getRawValue();
	return row;
}
 