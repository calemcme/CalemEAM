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
 * CalemInTranBo - business logic
 */
function CalemInTranBo() {
}

CalemInTranBo.getInstance =
function() {
	if (!CalemInTranBo.singleton) {
		CalemInTranBo.singleton = new CalemInTranBo();
	}
	return CalemInTranBo.singleton;
}

CalemInTranBo.prototype.canCheckout =
function(qty) {
	if (qty<=0 && !CalemConf['in_tran_conf']['checkout']['allowNegativeStock']) {
		CalemInfoDialog.showIt(CalemMsg.getMsg('in_tb_checkout'),CalemMsg.getMsg('in_no_stock_no_checkout'));
		return false;
	}
	return true;
}

CalemInTranBo.prototype.canMove =
function(qty) {
	if (qty<=0) {
		CalemInfoDialog.showIt(CalemMsg.getMsg('in_vt_move'),CalemMsg.getMsg('in_no_stock_to_move'));
		return false;
	}
	return true;
}
