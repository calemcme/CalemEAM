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
 * CalemCacheChangeEvent
 * It includes three detailed events: deleted, updated and inserted.
 * 
 */
function CalemCacheChangeEvent(id) {
	if (arguments.length == 0) return;
	this._id=id;
	this._deleted=new CalemEvent(CalemEvent.CACHE_CHANGE);
	this._updated=new CalemEvent(CalemEvent.CACHE_CHANGE);
	this._inserted=new CalemEvent(CalemEvent.CACHE_CHANGE);
}

CalemCacheChangeEvent.prototype = new CalemEvent;
CalemCacheChangeEvent.prototype.constructor=CalemCacheChangeEvent;

CalemCacheChangeEvent.prototype.toString = 
function() {
	return "CalemCacheChangeEvent";
} 

CalemCacheChangeEvent.prototype.getId =
function() {
	return this._id;
}

CalemCacheChangeEvent.prototype.addDeleted =
function(id) {
	this._deleted.add(id);
}

CalemCacheChangeEvent.prototype.addUpdated =
function(rec) {
	this._updated.add(rec);
}

CalemCacheChangeEvent.prototype.addInserted =
function(rec) {
	this._inserted.add(rec);
}

CalemCacheChangeEvent.prototype.getDeleted =
function() {
	return this._deleted.getItems();
}

CalemCacheChangeEvent.prototype.getUpdated =
function() {
	return this._updated.getItems();
}

CalemCacheChangeEvent.prototype.getInserted =
function() {
	return this._inserted.getItems();
}

CalemCacheChangeEvent.prototype.size =
function() {
	return (this.getUpdated().size()+this.getDeleted().size()+this.getInserted().size());
}

CalemCacheChangeEvent.prototype.setTotal =
function(total) {
	this._total=total;
}

CalemCacheChangeEvent.prototype.getTotal =
function() {
	return this._total;
}

