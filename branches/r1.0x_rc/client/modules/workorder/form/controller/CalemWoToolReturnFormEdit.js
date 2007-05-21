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
 * CalemWoToolReturnFormEdit
 */
function CalemWoToolReturnFormEdit(parent, formId, data) {
	if (arguments.length==0) return;
	CalemWoPartReturnFormEdit.call(this, parent, formId, data);
}

CalemWoToolReturnFormEdit.prototype = new CalemWoPartReturnFormEdit;
CalemWoToolReturnFormEdit.prototype.constructor = CalemWoToolReturnFormEdit;

CalemWoToolReturnFormEdit.prototype.toString = function() { return "CalemWoToolReturnFormEdit";}

CalemWoToolReturnFormEdit.prototype._onSave =
function(evt) {
	var row=this._setupInputRow(row);
	row['icg_id']='icg_tool';
	//Need to add two items from IN: rent_uom_id, rent_rate
	var cache=CalemContext.getInstance().getRegistry().getCache();
	var inRec=cache.findRecordById('inventory', row['in_id']);
	if (inRec) {
		row['rent_uom_id']=inRec.getField('rent_uom_id').getRawValue();
		row['rent_rate']=inRec.getField('rent_rate').getRawValue();
	}
	//Next figure out location to check out from.
	var ebInfo=new CalemEmbedInfo(this._parent, 'CalemInReturnFormList', {tranRow: row});
	this._embedForm(ebInfo);
}




