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
 * This is shared context storing common information
 * for dynamic classes to use.
 */
 
/**
 * Constructor
 */
function CalemDebug() {} 

CalemDebug.showBz =
function(elName) {
	if (DBG.getDebugLevel() == AjxDebug.DBG3) {
		var el=document.getElementById(elName);
		var bz=Dwt.getBounds(el);
		DBG.println(AjxDebug.DBG3, "bounds of "+elName+"={"+bz.x+", "+bz.y+", "+bz.width+", "+bz.height+"}");
	}
}

CalemDebug.getBzText =
function(bz) {
	return [' bounds: {', bz.x, ', ', bz.y, ', ', bz.width, ', ', bz.height, '}'].join('');
}

CalemDebug.initDebug =
function(location) {
	//Init not to have debugger
	DBG = new AjxDebug(AjxDebug.NONE, null, false);
	//Figure out the debug setting.
	var level, perf;
	if (location.search) {
		perf= (location.search.indexOf("perf=1")!=-1) ? true : false;
		if (location.search.indexOf("debug=")!=-1) {
			var m=location.search.match(/debug=(\d+)/);
			if (m.length) {
				var num=parseInt(m[1]);
				level=AjxDebug.DBG[num];	
			}	
		}	
	}
	if (level) DBG.setDebugLevel(level);
	if (perf) DBG.showTiming(perf);
}

/**
 * Utility functions
 */
CalemDebug.isDebug =
function() {
	return (AjxDebug.GBD[DBG.getDebugLevel()] >= 3);
}

CalemDebug.debug =
function(stmt) {
	DBG.println(AjxDebug.DBG3, stmt);
}

CalemDebug.isInfo =
function() {
	return (AjxDebug.GBD[DBG.getDebugLevel()] >= 2);
}

CalemDebug.isWarn =
function() {
	return (AjxDebug.GBD[DBG.getDebugLevel()] >= 1);
}

CalemDebug.isPerf =
function() {
	return DBG.isShowTiming();
}

CalemDebug.info =
function(stmt) {
	DBG.println(AjxDebug.DBG2, stmt);
}

CalemDebug.perf =
function(name) {
	DBG.timePt(AjxDebug.PERF, name);
}

CalemDebug.error =
function(stmt) {
	DBG.println(AjxDebug.DBG1, stmt);
}

CalemDebug.printBoundsById =
function(text, id) {
	if (!id) id=text;
	var el=document.getElementById(id);
	if (!el) { DBG.println(AjxDebug.DBG3, "Invalid element for id="+id); return;}
	CalemDebug.printBoundsByEl(text, el);
}

CalemDebug.printBoundsByEl =
function(text, el) {
	if (!el) { DBG.println(AjxDebug.DBG3, "Invalid element to get bounds"); return;}
	var bz=Dwt.getBounds(el);
	if (!bz) { DBG.println(AjxDebug.DBG3, "Element bounds not available: id="+id); return;}
	CalemDebug.printBounds(text, bz);
}

CalemDebug.printBounds =
function(text, bz) {
	DBG.println(AjxDebug.DBG3, [text, " bounds={",bz.x,', ', bz.y, ', ', bz.width,', ', bz.height,'}'].join(''));
}

CalemDebug.printObj =
function(obj, recursive) {
	if (!obj || !(obj instanceof Object) ) {
		DBG.println(AjxDebug.DBG3, "  leaf="+obj);
		return;
	}
	for (var i in obj) {
		DBG.println(AjxDebug.DBG3, i+"="+obj[i]);
		if (recursive && obj[i] instanceof Object) CalemDebug.printObj(obj[i], recursive);
	}
}

