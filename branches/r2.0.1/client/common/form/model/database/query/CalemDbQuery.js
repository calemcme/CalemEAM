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
 * CalemDbQuery - bulk query list to send to server.
 */
function CalemDbQuery() {
	this._map=new Object();
}

CalemDbQuery.prototype.toString =
function() {
	return 'CalemDbQuery';
}

CalemDbQuery.prototype.add =
function(tblQuery) {
	this._map[tblQuery.getFullTableId()]	=tblQuery;
}

CalemDbQuery.prototype.remove =
function(table) {
	delete this._map[table];
}

CalemDbQuery.prototype.getQuery =
function(id) {
	return this._map[id];
}

CalemDbQuery.prototype.size =
function() {
	var count=0;
	for (var i in this._map) {
		count++;
	}
	return count;
}

CalemDbQuery.prototype.getQueryMap =
function() {
	return this._map;
}

/**
 * This function construct sql for use with the soap API.
 * {CalemDbQuery: [
 * 	{CalemTableQuery: {table: 'table', type: 'type', sql: 'sql'}}
 *    ....
 * ]}
 * 
 */
CalemDbQuery.prototype.getSoap =
function() {
	//Prepare local timestamp for cache stale calculation.
	var formatter=CalemTextUtil.getFormatter(CalemTextUtil.DATETIME_SERVER_FORMATTER);
	var localTime=formatter.format(new Date());
	var obj=new Object();
	for (var i in this._map) {
		var qry=this._map[i];
		var soap=qry.getSoap(); 
		soap.localTime=localTime; //Add localTime.
		obj[qry.getFullTableId()]=soap;
	}
	return obj;
}

/**
 * Get count only so it's simplified not include times.
 */
CalemDbQuery.prototype.getSoapCount =
function() {
	var obj=new Object();
	for (var i in this._map) {
		var qry=this._map[i];
		var soap=qry.getSoapCount(); 
		obj[qry.getFullTableId()]=soap;
	}
	return obj;
}