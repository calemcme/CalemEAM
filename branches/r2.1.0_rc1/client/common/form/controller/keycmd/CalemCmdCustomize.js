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
 

//Customize command: a) verify access rights; b) forward to forms
function CalemCmdCustomize() {
}

CalemCmdCustomize.prototype.toString = function() {return "CalemCmdCustomize";}

CalemCmdCustomize.prototype.execute =
function(target, currForm, desktop) {
	if (!currForm) return false; //Customize current form
	if (!currForm.allowCustomize()) return false; //In case it's not allowed
	if (CalemBoUtil.isUserInAdminGroup()) {
		currForm.onCustomize();
		return true;
	} else {
		if (currForm.isTbAvailable(CalemConst.TB_CUSTOMIZE)) {
			currForm.onCustomize();
			return true;
		}
	}
	return false;	
}
