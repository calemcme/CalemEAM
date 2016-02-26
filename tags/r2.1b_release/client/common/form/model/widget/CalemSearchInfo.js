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
 * A few info classes for search
 * <ul>
 * <li> CalemMySearchSelectInfo - the control for selecting my search
 * <li> CalemSharedSearchSelectInfo - the control for selecting shared search
 * <li> CalemSearchInfo - This is the info that stores a search (query) and other stuff
 * </ul>
 */
 
/**
 * CalemMySearchSelectInfo
 */
function CalemMySearchSelectInfo() {
}

CalemMySearchSelectInfo.prototype.toString = function() {return "CalemMySearchSelectInfo";}
CalemMySearchSelectInfo.prototype.getClassName = function() {return "CalemMySearchSelectInfo";}

//Deserialize the object
CalemMySearchSelectInfo.prototype.setJson =
function(obj) {
   this._size=obj.size;
}

//Serialization
CalemMySearchSelectInfo.prototype.getJson =
function() {
	return ["{CalemMySearchSelectInfo: {size: ", this._size, "}}"].join('');
}

CalemMySearchSelectInfo.prototype.getSize =
function() {
	return this._size;
}

/**
 * CalemSharedSearchSelectInfo
 */
function CalemSharedSearchSelectInfo() {
}

CalemSharedSearchSelectInfo.prototype.toString = function() {return "CalemSharedSearchSelectInfo";}
CalemSharedSearchSelectInfo.prototype.getClassName = function() {return "CalemSharedSearchSelectInfo";}

//Deserialize the object
CalemSharedSearchSelectInfo.prototype.setJson =
function(obj) {
   this._size=obj.size;
}

//Serialization
CalemSharedSearchSelectInfo.prototype.getJson =
function() {
	return ["{CalemSharedSearchSelectInfo: {size: ", this._size, "}}"].join('');
}

CalemSharedSearchSelectInfo.prototype.getSize =
function() {
	return this._size;
}

/**
 * CalemSearchInfo
 * {id: searchId (auto-gen), name: 'user_typed', table: 'my_table', shared: 0, group: groupId, user: userId,
 *  search: {
 * 	table_id: {CalemTableSearch: {
 * 					 table: 'table',
 *                 search: {
 * 							fld: {CalemDbExpr: {...}}
 * 						... 
 * 			}
 * }
 */
function CalemSearchInfo(id, name, table, shared, axoId, search) {
	if (arguments.length==0) return;
	this._id=id;
	this._name=name;
	this._table=table;
	this._shared= (shared ? 1 : 0);
	this._axoId=axoId;
	this._search=search;
}

CalemSearchInfo.prototype.toString = function() {return "CalemSearchInfo";}
CalemSearchInfo.prototype.getClassName = function() {return "CalemSearchInfo";}

//Deserialize the object
CalemSearchInfo.prototype.setJson =
function(obj) {
   this._id=obj.id; //auto-gen id.
   this._name=obj.name;
   this._table=obj.table;
   this._shared=obj.shared ? 1 : 0;
   this._axoId=obj.axoId; //user/group id.
   this._search=CalemJson.setJsonByMap(obj.search);
}

//Serialization
CalemSearchInfo.prototype.getJson =
function() {
	return ["{CalemSearchInfo: {id: '", this._id, "', name: '", this._name, "', table: '",
	         this._table, "', shared: ", this._shared, ", axoId: '", this._axoId, "', search: ", 
	         CalemJson.mapToJson(this._search), "}}"].join('');
}

CalemSearchInfo.prototype.getId =
function() {
	return this._id;
}

CalemSearchInfo.prototype.getName =
function() {
	return this._name;
}

CalemSearchInfo.prototype.getTable =
function() {
	return this._table;
}

CalemSearchInfo.prototype.getShared =
function() {
	return this._shared;
}

CalemSearchInfo.prototype.getAxoId =
function() {
	return this._axoId;
}

CalemSearchInfo.prototype.getSearch =
function() {
	return this._search;
}

CalemSearchInfo.prototype.getTableSearch =
function(table) {
	table = table || this._table; //by default it's the master table.
	return (this._search ? this._search[table] : null);
}

CalemSearchInfo.prototype.getTableQuery =
function(tbl) {
	var rtn=this.getTableSearch(tbl);
	return rtn ? rtn.getTableQuery() : null;
}

//Do master table for now (multi-table query to come later)
CalemSearchInfo.prototype.getSql =
function() {
	return this._search[this._table].getSql();
}

/**
 * CalemTableSearchInfo
 */
function CalemTableSearchInfo(table, search) {
	if (arguments.length==0) return;
	this._table=table;
	this._search=search;
}

CalemTableSearchInfo.prototype.toString = function() {return "CalemTableSearchInfo";}
CalemTableSearchInfo.prototype.getClassName = function() {return "CalemTableSearchInfo";}

//Deserialize the object
CalemTableSearchInfo.prototype.setJson =
function(obj) {
   this._table=obj.table;
   this._search=CalemJson.setJsonByMap(obj.search);
}

//Serialization
CalemTableSearchInfo.prototype.getJson =
function() {
	return ["{CalemTableSearchInfo: {table: '", this._table, "', search: ", CalemJson.mapToJson(this._search), "}}"].join('');
}

CalemTableSearchInfo.prototype.getTable =
function() {
	return this._table;
}

CalemTableSearchInfo.prototype.getField =
function(fld) {
	return this._search ? this._search[fld] : null;
}

CalemTableSearchInfo.prototype.getTableQuery =
function() {
	//It's an AND here
	var andExpr=new CalemExprAnd();
	var tableDd=CalemContext.getInstance().getRegistry().getTableDd(this._table);
	var tableQuery=tableDd.buildGetAllQuery();
	for (var i in this._search) {
		//Checking for field lookup type.
		var expr=this._search[i];
		var lkupDd=tableDd.getLookupTableDd(i);
		if (lkupDd && !lkupDd.isCached() && lkupDd.getTableName() != this._table) {
			andExpr.add(expr);
		} else {
			andExpr.add(expr);
		}
	}
	//Adding where here.
	tableQuery.setWhere(this._table, andExpr);
	return tableQuery;
}

CalemTableSearchInfo.prototype.getSql =
function() {
	return this.getTableQuery().getSql();
}

/**
 * CalemSearchSaveInfo
 */
function CalemSearchSaveInfo() {
}

CalemSearchSaveInfo.prototype.toString = function() {return "CalemSearchSaveInfo";}
CalemSearchSaveInfo.prototype.getClassName = function() {return "CalemSearchSaveInfo";}

//Deserialize the object
CalemSearchSaveInfo.prototype.setJson =
function(obj) {
   this._size=obj.size;
}

//Serialization
CalemSearchSaveInfo.prototype.getJson =
function() {
	return ["{CalemSearchSaveInfo: {size: ", this._size, "}}"].join('');
}

