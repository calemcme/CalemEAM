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
 * CalemSearch definition 
 */
function CalemSearchDef() {}
CalemSearchDef.addSearch =
function(table, axoId, id, def) {
	if (!CalemSearchDef[table]) {
		CalemSearchDef[table]=new Object();
	}
	if (!CalemSearchDef[table][axoId]) {
		CalemSearchDef[table][axoId]=new Object();
	}
	CalemSearchDef[table][axoId][id]=def;
}

CalemSearchDef.getSearchByTable =
function(table) {
	if (!CalemSearchDef[table]) {
		CalemSearchDef[table]=new Object();
	}
	return CalemSearchDef[table];
}


/**
 * CalemMetadata
 */
function CalemMetadata() {}
function CalemMetadataCustom() {}

/**
 * Dropdown
 */
function CalemDropdown() {}
function CalemDropdownCustom() {}

CalemDropdown.get =
function(id) {
	return CalemDropdownCustom[id] ? CalemDropdownCustom[id] : CalemDropdown[id];
}

CalemDropdown.getNoCustom =
function(id) {
	return CalemDropdown[id];
}

CalemDropdown._setCustomDropdown =
function(id) {
	if (!CalemDropdownCustom[id]) {
		var ar=[];
		var src=CalemDropdown[id];
		for (var i=0; i< src.length; i++) {
			ar.push(src[i]);
		}
		CalemDropdownCustom[id] = ar;
	}
}

CalemDropdown.addEntry =
function(list, id) {
	this._setCustomDropdown(id);
	CalemDropdownCustom[id].push(list);
}

CalemDropdown.modifyEntry =
function(list, id) {
	this._setCustomDropdown(id);
	var ar=CalemDropdownCustom[id];
	for (var i=0; i< ar.length; i++) {
		if (ar[i][0]==list[0]) {
			ar.splice(i, 1, list);
			break;
		}
	}
}

CalemDropdown.deleteEntry =
function(eId, id) {
	this._setCustomDropdown(id);
	var ar=CalemDropdownCustom[id];
	for (var i=0; i< ar.length; i++) {
		if (ar[i][0]==eId) {
			ar.splice(i, 1);
			break;
		}
	}
}

CalemDropdown.swapEntry =
function(srcId, dstId, id) {
	this._setCustomDropdown(id);
	var ar=CalemDropdownCustom[id];
	var srcNo;
	var dstNo;
	for (var i=0; i< ar.length; i++) {
		var cId=ar[i][0];
		if (cId==srcId) srcNo=i;
		else if (cId==dstId) dstNo=i;
	}
	var tmp=ar[srcNo];
	ar[srcNo]=ar[dstNo];
	ar[dstNo]=tmp;
}

/**
 * Data preloaded
 */
function CalemData() {} 

CalemData.get =
function(id) {
	return CalemData[id];
}
