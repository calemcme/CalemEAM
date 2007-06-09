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
 * CalemCraftBo - business logic
 */
function CalemCraftBo() {
}

CalemCraftBo._details = ['pm_labor', 'wo_planned_labor', 'wo_labor'];

CalemCraftBo.getInstance =
function() {
	if (!CalemCraftBo.singleton) {
		CalemCraftBo.singleton = new CalemCraftBo();
	}
	return CalemCraftBo.singleton;
}

//Asset deletion check
CalemCraftBo.prototype.canDeleteCraft =
function(rec, callback) {
	var boUtil=CalemBoUtil.getInstance();
	boUtil.canDeleteByLookup(CalemCraftBo._details, 'craft_id', rec.id, callback);
}
