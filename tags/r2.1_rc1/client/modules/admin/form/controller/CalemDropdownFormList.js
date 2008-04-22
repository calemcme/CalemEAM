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
 * CalemTableFormList
 */
function CalemDropdownFormList(parent, formId, data) {
	if (arguments.length==0) return;
	CalemTableFormList.call(this, parent, formId, data);
	this._dropdownDesignListener=new AjxListener(this, this.onDropdownDesign);
}

CalemDropdownFormList.prototype = new CalemTableFormList;
CalemDropdownFormList.prototype.constructor = CalemDropdownFormList;

CalemDropdownFormList.prototype.toString = function() { return "CalemDropdownFormList";}

CalemDropdownFormList.prototype.getDropdownDesignListener =
function() {
	return this._dropdownDesignListener;
}

//Table design
CalemDropdownFormList.prototype.onDropdownDesign =
function(evt) {
	var item=CalemEvent.getItem(evt);
	var ebInfo=new CalemEmbedDesignInfo(this._parent, 'CalemDropdownFormDesign', this.getId(), {item: item}, this._getDataModel());
	this._embedForm(ebInfo);
}
