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
 * CalemFormNewCacheLoad
 * This is the new record form
 * 
 */
function CalemFormNewCacheLoad(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormNew.call(this, parent, formId, data);
	//Pre-load cached other items.
	this._cacheLoadedCb=new AjxCallback(this, this.onCacheLoaded);
	this._cache=CalemContext.getInstance().getRegistry().getCache();
}

CalemFormNewCacheLoad.prototype = new CalemFormNew;
CalemFormNewCacheLoad.prototype.constructor = CalemFormNewCacheLoad;

CalemFormNewCacheLoad.prototype.toString = function() { return "CalemFormNewCacheLoad"; }

CalemFormNewCacheLoad.prototype._loadData =
function() {//Record should have been set already.
	if (!this._dataModel.getCurrentRecord()) this._dataModel.createNewRecord();
	var rec=this._dataModel.getCurrentRecord();
	this._initNewRec(rec);
	this._cache.bulkLoadCacheForTable(this._modelItem.getId(), this._cacheLoadedCb);
} 

CalemFormNewCacheLoad.prototype.onCacheLoaded =
function() {
	this.onDataLoaded();
}  
