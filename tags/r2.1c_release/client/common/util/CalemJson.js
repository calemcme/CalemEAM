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
 * This is shared functions of Json persistence function.
 */
function CalemJson() {
} 

/*
 * Helper function for serialization to Json for persistence.
 */
CalemJson.arrayToJson =
function(ar) {
	var rtn='[';
	var first=true;
	for (var i in ar) {
		if (!first) rtn=[rtn, ", "].join('');
		else first=false;
		if (typeof ar[i]=='string') {
			rtn=[rtn, "'", ar[i], "'"].join('');
		} else {
			rtn=[rtn, ar[i].getJson()].join('');
		}
	}
	return [rtn, "]"].join('');
}

/**
 * Helper function for building sql
 */
CalemJson.arrayToSql =
function(ar, sep) {
	if (sep) {
		sep=[' ', sep, ' '].join('');
	} else {
		sep=", ";
	}
	var rtn='';
	var first=true;
	for (var i in ar) {
		if (!first) rtn=[rtn, sep].join('');
		else first=false;
		if (typeof(ar[i])=='string') {
			rtn=[rtn, "'", ar[i], "'"].join('');
		} else {
			rtn=[rtn, ar[i].getSql()].join('');
		}
	}
	return rtn;
}

//Deserialize
CalemJson.setJson =
function(obj) {
	if (!obj) return null;
	for (var i in obj) {
		var o = eval(['new ', i, '(0)'].join('')); //Adding 0 to make it pass in case a param is required.
		o.setJson(obj[i]);
		return o;
	}	
}

//deserialize array - thisObj must support add function.
CalemJson.setJsonByArray =
function(ar, thisObj) {
	if (!ar) return;
	for (var i=0; i< ar.length; i++) {
		var val=CalemJson.setJson(ar[i]);
		thisObj.add(val);
	}
}

//deserialize array - thisObj must support add function.
CalemJson.setJsonAsArray =
function(ar) {
	if (!ar) return null;
	var newAr=new Array();
	for (var i=0; i< ar.length; i++) {
		var val= (typeof(ar[i])=='object') ? CalemJson.setJson(ar[i]) : ar[i];
		newAr.push(val);
	}
	return newAr;
}

//Deserialize a map
CalemJson.setJsonByMap =
function(map) {
	if (!map) return;
	var rtn=new Object();
	for (var i in map) {
		var val=CalemJson.setJson(map[i]);
		rtn[i]=val;
	}
	return rtn;
}

//Serialize a map
CalemJson.mapToJson =
function(map) {
	if (!map) return;
	var rtn='{';
	var first=true;
	for (var i in map) {
		if (first) first=false;
		else {
			rtn=[rtn, ","].join('');
		}
		var val;
		if (typeof(map[i])=='object') {
			val=map[i].getJson();
		} else if (typeof(map[i])=='number' || typeof(map[i])=='boolean') {
			val=map[i];
		} else if (typeof(map[i])=='string') {
			val="'"+map[i]+"'";
		}
		rtn=[rtn, i, ": ", val].join('');
	}
	return [rtn, '}'].join('');
}

CalemJson.getValue =
function(val) {
	if (!val) return 'null';
	if (typeof(val)=='string') val=["'", val, "'"].join('');
	return val;
}	
