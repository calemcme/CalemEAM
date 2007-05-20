<?php
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


//Checking basic initialization
if (!defined('_CALEM_DIR_')) die("Access denied at ".__FILE__);

//Base CalemDao
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';
require_once _CALEM_DIR_ . 'server/modules/inventory/CalemInTranNotifierNone.php';

class CalemInTranNotifyOtherFactory {
	public function getNotifier($it) {
		global $_CALEM_conf;
		$conf=$_CALEM_conf['in_conf']['tran_notifier_map'];
		if (isset($it['checkout_type_id']) && $it['checkout_type_id']) {
			$notifier=CalemFactory::createInstance($conf[$it['checkout_type_id']]);				
		} else {
			$notifier=new CalemInTranNotifierNone();
		}
		return $notifier;
	}
	
}
