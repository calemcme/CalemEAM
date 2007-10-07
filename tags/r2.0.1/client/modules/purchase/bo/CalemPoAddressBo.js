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
 * CalemPoAddressBo - business logic
 */
function CalemPoAddressBo() {
}

CalemPoAddressBo._details = [{table: 'po', fld: 'shipping_addr_id'}, {table: 'po', fld: 'billing_addr_id'}];

CalemPoAddressBo.getInstance =
function() {
	if (!CalemPoAddressBo.singleton) {
		CalemPoAddressBo.singleton = new CalemPoAddressBo();
	}
	return CalemPoAddressBo.singleton;
}

//Asset deletion check
CalemPoAddressBo.prototype.canDelete =
function(rec, callback) {
	var boUtil=CalemBoUtil.getInstance();
	boUtil.canDeleteByLookup(CalemPoAddressBo._details, 'addr_id', rec.id, callback);
}