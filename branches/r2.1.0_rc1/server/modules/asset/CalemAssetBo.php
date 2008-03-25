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
require_once _CALEM_DIR_ . 'server/include/core/database/CalemDbo.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemBo.php';

class CalemAssetBo extends CalemBo {
	protected $conf;
	
	public function __construct() {	
 		parent::__construct();
 		global $_CALEM_conf;
 		$this->conf=$_CALEM_conf['asset_conf'];
 	}
 	
 	public function getNextAssetNo() {
		$dbHdlr=CalemFactory::getDbHandler();
		$seq=$dbHdlr->getNextSeq('asset_seq');
		return sprintf($this->conf['asset_no']['format'], $seq);
	}
 	
 	
 	public function updateLaborCost($id, $hours, $cost) {
 		$assetDbo=CalemFactory::getDbo('asset');
 		$row=$assetDbo->fetchById($id);
 		$ar=array();
 		$ar['maint_labor_hours']=$row['maint_labor_hours']+$hours;
 		$ar['maint_labor_cost']=$row['maint_labor_cost']+$cost;
 		$ar['maint_cost']=$row['maint_material_cost']+$ar['maint_labor_cost'];
 		$assetDbo->setChangeBulk($ar);
 		$assetDbo->setIdForUpdate($id);
 		$assetDbo->update();
 	} 		
}
