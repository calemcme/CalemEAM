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
 * CalemReqItemOnPoNoChangeException
 */
function CalemReqItemOnPoNoChangeException(table, errorInfo) {
	if (arguments.length==0) return;
	CalemErrorInfo.call(this, table, errorInfo);
}

CalemReqItemOnPoNoChangeException.prototype = new CalemErrorInfo;
CalemReqItemOnPoNoChangeException.prototype.constructor=CalemReqItemOnPoNoChangeException;

CalemReqItemOnPoNoChangeException.prototype.toString = function() {return "CalemReqItemOnPoNoChangeException";}

CalemReqItemOnPoNoChangeException.prototype.getMessage = 
function() {
	return CalemMsg.getMsg('req_item_on_po_no_change');
}

/**
 * CalemReqStatusChangeNotAllowedException
 */
function CalemReqStatusChangeNotAllowedException(table, errorInfo) {
	if (arguments.length==0) return;
	CalemErrorInfo.call(this, table, errorInfo);
}

CalemReqStatusChangeNotAllowedException.prototype = new CalemErrorInfo;
CalemReqStatusChangeNotAllowedException.prototype.constructor=CalemReqStatusChangeNotAllowedException;

CalemReqStatusChangeNotAllowedException.prototype.toString = function() {return "CalemReqStatusChangeNotAllowedException";}

CalemReqStatusChangeNotAllowedException.prototype.getMessage = 
function() {
	return CalemMsg.getMsg('req_status_change_not_allowed');
}


/**
 * CalemReqNoApprovalLevelException
 */
function CalemReqNoApprovalLevelException(table, errorInfo) {
	if (arguments.length==0) return;
	CalemErrorInfo.call(this, table, errorInfo);
}

CalemReqNoApprovalLevelException.prototype = new CalemErrorInfo;
CalemReqNoApprovalLevelException.prototype.constructor=CalemReqNoApprovalLevelException;

CalemReqNoApprovalLevelException.prototype.toString = function() {return "CalemReqNoApprovalLevelException";}

CalemReqNoApprovalLevelException.prototype.getMessage = 
function() {
	return CalemMsg.getMsg('req_approval_level_not_sufficient');
}
