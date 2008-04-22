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
function CalemTableFormList(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormList.call(this, parent, formId, data);
	this._tableDesignListener=new AjxListener(this, this.onTableDesign);
}

CalemTableFormList.prototype = new CalemFormList;
CalemTableFormList.prototype.constructor = CalemTableFormList;

CalemTableFormList.prototype.toString = function() { return "CalemTableFormList";}

//Load data only once.
CalemTableFormList.prototype._loadData = 
function() {
	CalemCachedTableListFactory.create(this._modelItem.getId()); //get table list loaded in cache.
	//continue data loading
	CalemFormList.prototype._loadData.call(this);
}

CalemTableFormList.prototype.getTableDesignListener =
function() {
	return this._tableDesignListener;
}

//Table design
CalemTableFormList.prototype.onTableDesign =
function(evt) {
	var item=CalemEvent.getItem(evt);
	var ebInfo=new CalemEmbedDesignInfo(this._parent, 'CalemTableFormDesign', this.getId(), {item: item}, this._getDataModel());
	this._embedForm(ebInfo);
}
