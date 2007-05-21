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
 * Database backend interfaces.
 */
function CalemDb() {
}

CalemDb.prototype.toString = 
function() {
	return "CalemDb";
}

/**
 * Load count of the included tables
 * @CalemDbQuery - the list of queries to send to server.
 */
CalemDb.prototype.getCountBulk =
function(dbQuery, callback) {
	var soapDoc=CalemSoapClient.createSoapDoc("BulkFetch");
	soapDoc.set("bulkfetch", dbQuery.getSoapCount());
    var client=new CalemSoapClient(soapDoc, callback);
    return client.service(); 
}

/**
 * Load data for a data model
 * @CalemDbQuery - the list of queries to send to server.
 */
CalemDb.prototype.getDataBulk =
function(dbQuery, callback) {
	var soapDoc=CalemSoapClient.createSoapDoc("BulkFetch");
	soapDoc.set("bulkfetch", dbQuery.getSoap());
    var client=new CalemSoapClient(soapDoc, callback);
    return client.service(); 
}

