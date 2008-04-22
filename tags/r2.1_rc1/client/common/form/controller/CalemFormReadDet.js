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
 * CalemFormReadDet
 * This is the read only view.
 * 
 */
function CalemFormReadDet(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormRead.call(this, parent, formId, data);
}

CalemFormReadDet.prototype = new CalemFormRead;
CalemFormReadDet.prototype.constructor = CalemFormReadDet;

CalemFormReadDet.prototype.toString = function() { return "CalemFormReadDet"; }

CalemFormReadDet.prototype.onNew =
function(evt) {
	if (!this._checkParentRec()) return;
	if (!this.canCreate()) return;
	
	var ebInfo=new CalemEmbedNewDetInfo(this._parent, this._getFormNewId(), this._dataModel.getParentRec(), this._dataModel.getFormLink());
	this._embedForm(ebInfo);
} 

CalemFormReadDet.prototype._onEdit =
function(evt) {
	//Get the selection event
	var item=CalemEvent.getItem(evt);
	//Prepare data for master detail view.
	var data = {modelItem: this._modelItem, item: item};
   //To embed new form.
   var ebInfo=new CalemEmbedEditDetInfo(this._parent, this._getFormEditId(), data, this._dataModel.getParentRec(), this._dataModel.getFormLink());
	this._embedForm(ebInfo);
} 
