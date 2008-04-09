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
 * CalemFormListDetNoMd
 * This is the listView form for detail data.
 * 
 */
function CalemFormListDetNoMd(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormListDet.call(this, parent, formId, data);
}

CalemFormListDetNoMd.prototype = new CalemFormListDet;
CalemFormListDetNoMd.prototype.constructor = CalemFormListDetNoMd;

CalemFormListDetNoMd.prototype.toString = function() { return "CalemFormListDetNoMd"; }

/**
 * Setting up master detail relation ship.
 */
CalemFormListDetNoMd.prototype._createDataModel =
function(data) {
	CalemFormList.prototype._createDataModel.call(this);
	this._instantiate(data);
}

CalemFormListDetNoMd.prototype._instantiate =
function(data) {
	//Reset parent info.
	this.setParentRec(data.parentRec);
	this.setFormLink(data.link);
	//Also set up query for fetching details only.
	this._modelItem.setTableQuery(this._dataModel.getTableQueryByParentRec());
}
