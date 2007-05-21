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
 * CalemFormListDet
 * This is the listView form for detail data.
 * 
 */
function CalemFormListDet(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormList.call(this, parent, formId, data);
}

CalemFormListDet.prototype = new CalemFormList;
CalemFormListDet.prototype.constructor = CalemFormListDet;

CalemFormListDet.prototype.toString = function() { return "CalemFormListDet"; }

CalemFormListDet.prototype._onNew =
function(evt) {
	if (!this._checkParentRec()) return;
	if (!this.canCreate()) return;
	
	var ebInfo=new CalemEmbedNewDetInfo(this._parent, this._getFormNewId(), this._dataModel.getParentRec(), this._dataModel.getFormLink());
	this._embedForm(ebInfo);
} 

//Default is to open a read form
CalemFormListDet.prototype._onOpen =
function(evt) {	
	if (!this._checkParentRec()) return;
	
	//Get the selection event
	var item=CalemEvent.getItem(evt);
	//Prepare data for master detail view.
	var data = {modelItem: this._modelItem, item: item};
	//embed read form here.
   var ebInfo=new CalemEmbedReadDetInfo(this._parent, this._getFormReadId(), data, this._dataModel.getParentRec(), this._dataModel.getFormLink());
   this._embedForm(ebInfo);
} 
