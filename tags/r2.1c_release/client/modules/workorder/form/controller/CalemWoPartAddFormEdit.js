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
 * CalemWoPartAddFormEdit
 */
function CalemWoPartAddFormEdit(parent, formId, data) {
	if (arguments.length==0) return;
	CalemWoPartCheckoutFormEdit.call(this, parent, formId, data);
}

CalemWoPartAddFormEdit.prototype = new CalemWoPartCheckoutFormEdit;
CalemWoPartAddFormEdit.prototype.constructor = CalemWoPartAddFormEdit;

CalemWoPartAddFormEdit.prototype.toString = function() { return "CalemWoPartAddFormEdit";}

CalemWoPartAddFormEdit.prototype._initData =
function(data, rec) {
	CalemWoPartCheckoutFormEdit.prototype._initData.call(this, data, rec);
	this._wopRec=data.wopRec;
	rec.getField('in_id').setRawValue(this._wopRec.getField('in_id').getRawValue());
}

CalemWoPartAddFormEdit.prototype._initReadOnly =
function() {
	this._setFieldsReadOnly(['in_id']);
}




