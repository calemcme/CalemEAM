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
 * CalemPoStatusChangeNotAllowedException
 */
function CalemPoStatusChangeNotAllowedException(table, errorInfo) {
	if (arguments.length==0) return;
	CalemErrorInfo.call(this, table, errorInfo);
}

CalemPoStatusChangeNotAllowedException.prototype = new CalemErrorInfo;
CalemPoStatusChangeNotAllowedException.prototype.constructor=CalemPoStatusChangeNotAllowedException;

CalemPoStatusChangeNotAllowedException.prototype.toString = function() {return "CalemPoStatusChangeNotAllowedException";}

CalemPoStatusChangeNotAllowedException.prototype.getMessage = 
function() {
	return CalemMsg.getMsg('po_status_change_not_allowed');
}


/**
 * CalemPoNoApprovalLevelException
 */
function CalemPoNoApprovalLevelException(table, errorInfo) {
	if (arguments.length==0) return;
	CalemErrorInfo.call(this, table, errorInfo);
}

CalemPoNoApprovalLevelException.prototype = new CalemErrorInfo;
CalemPoNoApprovalLevelException.prototype.constructor=CalemPoNoApprovalLevelException;

CalemPoNoApprovalLevelException.prototype.toString = function() {return "CalemPoNoApprovalLevelException";}

CalemPoNoApprovalLevelException.prototype.getMessage = 
function() {
	return CalemMsg.getMsg('po_approval_level_not_sufficient');
}