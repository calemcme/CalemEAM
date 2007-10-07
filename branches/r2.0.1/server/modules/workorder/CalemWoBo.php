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
require_once _CALEM_DIR_ . 'server/include/core/CalemUiException.php';
require_once _CALEM_DIR_ . 'server/include/core/database/CalemDbo.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemBo.php';

class CalemWoBo extends CalemBo {
	private $conf;
	private $lookupPmConf;
	
	public function __construct() {	
 		parent::__construct();
 		//Get configuration
		global $_CALEM_conf;
		$this->conf=$_CALEM_conf['wo_conf'];
		$this->lookupPmConf=$_CALEM_conf['pm_conf']['lookupWoNewFromPm'];	
 	}
 	
	public function getNextWoNo() {
		$dbHdlr=CalemFactory::getDbHandler();
		$seq=$dbHdlr->getNextSeq('wo_seq');
		return sprintf($this->conf['wo_no']['format'], $seq);
	}
	
	public function lookupWoNewByPm($tran) {
		$rtn=$tran;
		//Get Info from PM first
		$pmDbo=CalemFactory::getDbo('pm');
		$pmRow=$pmDbo->fetchById($tran['pm_id']);
		$pmFlds=$this->lookupPmConf['pm'];
		foreach ($pmFlds as $pmFld=>$woFld) {
			$rtn[$woFld]=$pmRow[$pmFld];
		}
		//Check for existence of pm/asset pair
		$pmAssetDbo=CalemFactory::getDbo('pm_asset');
		try {
			$rows=$pmAssetDbo->fetchBySqlParam('select * from pm_asset where pm_id=? and asset_id=?',
			                        array($tran['pm_id'], $tran['asset_id']));
			$row=$rows[0];
			$pmAssetFlds=$this->lookupPmConf['pm_asset'];
			foreach ($pmAssetFlds as $pmFld=>$woFld) {
				$rtn[$woFld]=$row[$pmFld];
			}						                        
		} catch (CalemDboDataNotFoundException $ex) {}
		return $rtn;
	}
	
	/**
	 * WO labor cost
	 */
	public function getWoLaborCost($startDate, $endDate) {
		$woLaborDbo=CalemFactory::getDbo('wo_labor');
		$lc=$woLaborDbo->getCountBySqlParam(
		      "select sum(w.line_cost) from wo_labor w where w.start_time >=? and w.start_time <=?",
		      array($startDate, $endDate));
		return $lc;	
	}
}
