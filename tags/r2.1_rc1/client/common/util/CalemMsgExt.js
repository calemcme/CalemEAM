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
 * This is service function for CalemMsg
 */
 
/**
 * Message helper function.
 */
CalemMsg.getMsg =
function(key, nocheck) {
	var rtn=CalemMsg[key];
	if (!rtn) {
		if (CalemDebug.isWarn())
			DBG.println(AjxDebug.DBG1, "Cannot find text definition for key="+key);
		return null; //return its key as value.
	}
	/** take out this function - reduce coupling.
	//Check if resource is a reference -- too bad this is cost for each msg.
	if (!nocheck && rtn.indexOf('$!')==0) {
		key=rtn.substring(2, rtn.length - 2);
		return CalemMsg.getMsg(key);
	}
	*/
	return rtn;
}

CalemMsg._addCustomMsg =
function(id, msg) {
	CalemMsg[id]=msg;
}
