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
 * CalemUserFormReadMine
 */
function CalemUserFormReadMine(parent, formId, data) {
	if (arguments.length==0) return;
	CalemUserFormRead.call(this, parent, formId, data);
}

CalemUserFormReadMine.prototype = new CalemUserFormRead;
CalemUserFormReadMine.prototype.constructor = CalemUserFormReadMine;

CalemUserFormReadMine.prototype.toString = function() { return "CalemUserFormReadMine";}

/**
 * Monitor some events
 */
CalemUserFormReadMine.prototype._createDataModel =
function(data) {
	CalemUserFormRead.prototype._createDataModel.call(this);
	//Creating a special query for the model item.
	var userInfo=CalemContext.getInstance().getUserInfo();
	var tq=this._modelItem.getTableQuery();
	//Add where clause for primary key.
	var val=new CalemDbString(userInfo.uid);
	var fld=new CalemDbField(this._modelItem.getId(), 'id')	;
	var dbExpr=new CalemDbExpr(fld, CalemDbExpr.EQ, val);
	tq.setWhere(this._modelItem.getId(), dbExpr);
	this._modelItem.setTableQuery(tq);
}

CalemUserFormReadMine.prototype._onEdit =
function(evt) {
	//Get the selection event
	var item=CalemEvent.getItem(evt);
	//Prepare data for master detail view.
	var data = {item: item};
    //To embed new form.
    var ebInfo=new CalemEmbedEditInfo(this._parent, 'CalemUserFormEditMine', data);
	this._embedForm(ebInfo);
} 

