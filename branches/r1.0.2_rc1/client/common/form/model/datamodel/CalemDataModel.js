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
 * Constructor
 */
function CalemDataModel(id, controller, data) {
	if (arguments.length==0) return;
	//Prepare cache and registry
	this._reg=CalemContext.getInstance().getRegistry();
	this._cache=this._reg.getCache();
	//Initialize
	this._id=id;
	this._controller=controller;
	this._init(data);
}

CalemDataModel.prototype.toString = 
function() {
	return "CalemDataModel";
}

/**
 * Each model is represented by one model item.
 */
CalemDataModel.prototype._init =
function(data) {
	if (data) {
		if (data.modelItem) { //To share data model
			this._modelItem=data.modelItem;
			this._modelItem.addRefCount(); //add a ref count.
		} else {//Should fake a model item.
			this._modelItem=this._createModelItem(this._id);
		}
		this._modelItem.initCurrentRecord(data.item);
		//This is the case that data has been loaded
		this._controller.setDataLoaded(true);
	} else {
		this._modelItem=this._createModelItem(this._id);
	}
}

//Return cache reference
CalemDataModel.prototype.getCache =
function() {
	return this._cache;
}

CalemDataModel.prototype.getId =
function() {
	return this._id;
}

CalemDataModel.prototype.getController =
function() {
	return this._controller;
}

/**
 * Creating a model item based on cache policy
 */
CalemDataModel.prototype._createModelItem =
function(id) {
	var mi;
	if (this._reg.getTableDd(id).isCached()) {
		mi=new CalemDataModelItemCached(id, this);
	} else {
		mi=new CalemDataModelItemDb(id, this);
	}
	return mi;
}

//public APIs
CalemDataModel.prototype.getRegistry =
function() {
	return this._reg;
}

/**
 * Initial data loading
 */
CalemDataModel.prototype.load =
function(callback, forceReload) {
	var dbQuery=new CalemDbQuery();
	dbQuery.add(this._modelItem.getTableQuery());
	//Define a callback
	var loadCallback=new AjxCallback(this, this.onDataLoadResponse, {callback: callback});
	this._cache.bulkLoad(dbQuery, loadCallback, forceReload);
}

/**
 * Data loading response. 
 */
CalemDataModel.prototype.onDataLoadResponse =
function(param, resultList) {
	this._modelItem.onLoadResult(resultList[this._modelItem.getTableName()]);
	if (param.callback) param.callback.run();
	//add cache change listener
	this._modelItem.addCacheListener();
} 

/**
 * Loading by a layer above
 */
CalemDataModel.prototype.onLoadResult =
function(result) {
	this._modelItem.onLoadResult(result);
} 

CalemDataModel.prototype.getModelItem =
function() {
	return this._modelItem;
}

/**
 * Creating empty records
 */
CalemDataModel.prototype.createNewRecord =
function() {
	this._modelItem.createNewRecord();
} 

/**
 * Form level handling
 */
CalemDataModel.prototype.setFormLink =
function(link) {
	this._formLink = link;
}

CalemDataModel.prototype.getFormLink =
function(link) {
	return this._formLink;
}

/**
 * Parent rec handling
 */
CalemDataModel.prototype.setParentRec =
function(rec) {
	this._parentRec=rec;
} 

CalemDataModel.prototype.getParentRec =
function() {
	return this._parentRec;
} 

CalemDataModel.prototype.addParentRecId =
function(row) {
	if (this._formLink && this._parentRec) {
		row[this._formLink.getFld()]=this._parentRec.id;
	}
}
/**
 * Creating quer based on master rec
 */
CalemDataModel.prototype.getTableQueryByParentRec =
function() {
	var tq=this._modelItem.getTableQuery();
	//Add where clause for primary key.
	if (this._parentRec && this._formLink) {
		//Support link that's not id.
		var id=this._parentRec.getField(this._formLink.getParentFld()).getRawValue();
		var val=new CalemDbLookup(id);
		var fld=new CalemDbField(this._id, this._formLink.getFld())	;
		var dbExpr=new CalemDbExpr(fld, CalemDbExpr.EQ, val);
		tq.setWhere(this._id, dbExpr);
	}
	if (CalemDebug.isDebug()) CalemDebug.debug("table query for "+this._id+"="+tq.getSql());
	return tq;
}

/**
 * getCurrentRecord
 */
CalemDataModel.prototype.getCurrentRecord =
function() {
	return this._modelItem.getCurrentRecord();
} 

CalemDataModel.prototype.setCurrentRecord =
function(rec) {
	return this._modelItem.setCurrentRecord(rec);
} 

/**
 * shutdown the model item.
 */
CalemDataModel.prototype._shutdown =
function() {
	this._modelItem._shutdown();
} 