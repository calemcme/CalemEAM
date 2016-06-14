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

require_once 'CalemInstModel.php';
/**
 * Language model
 */
class CalemInstSyscheckModel extends CalemInstModel {
	protected $syscheck=array();
	protected $passed=false;
	
	public function checkSystem() {
		$c1=$this->checkPhp();
		$c2=$this->checkDb();
		$c3=$this->checkPdo();
		$c4=$this->checkConfFile();
		$c5=$this->checkFileAccess();
		$c6=$this->checkAmCharts();
		$this->passed= ($c1&&$c2&&$c3&&$c4&&$c5);
		return $this->getCheckInfo();
	}
	
	public function getCheckInfo() {
		return array('passed'=>$this->passed, 'syscheck'=>$this->syscheck);	
	}
	
	public function checkPhp() {
		$cv=phpversion();
		$req='5.0';
		$bl= ($cv >= $req);
		$this->syscheck['check_php_version']=array(
			'syscheck_current'=>$cv,
			'syscheck_required'=>'5.0',
			'syscheck_passed'=> ($bl ? 'yes' : 'no')
		);	
		return $bl;
	}
	
	public function checkDb() {
		$cv=$this->getLabel('text_unknown');
		$this->syscheck['check_db']=array(
			'syscheck_current'=>$cv,
			'syscheck_required'=>'MySQL 5.0',
			'syscheck_passed'=> 'unknown'
		);	
		return true;
	}
	
	public function checkPdo() {
		$rtn=true;
		$bl=extension_loaded('PDO');
		$this->syscheck['check_pdo']=array(
			'syscheck_current'=> ($bl ? 'PDO' : ''),
			'syscheck_required'=>'PDO',
			'syscheck_passed'=> ($bl ? 'yes' : 'no'),
		);	
		$rtn = ($rtn && $bl);
		
		$bl= extension_loaded('pdo_mysql');
		$this->syscheck['check_pdo_mysql']=array(
			'syscheck_current'=> ($bl ? 'pdo_mysql' : ''),
			'syscheck_required'=>'pdo_mysql',
			'syscheck_passed'=> ($bl ? 'yes' : 'no')
		);	
		
		return ($rtn && $bl);
	}
	
	public function checkConfFile() {
		$rtn=false;
		$d=_CALEM_DIR_ . 'server/conf';
		$fn= $d . '/calem.install.php';
		if (is_file($fn)) {
			$rtn=is_writable($fn);	
		} else {
			$rtn=is_writable($d);	
		}
		$this->syscheck['check_conf_writable']=array(
			'syscheck_current'=>'server/conf/calem.install.php',
			'syscheck_required'=>'Writable',
			'syscheck_passed'=>($rtn?'yes':'no')
		);
		return $rtn;
	}
	
	public function checkAmCharts() {
		$cv=$this->getLabel('not_found');
		$rtn=true;
		$d=_CALEM_DIR_ . 'server/include/charts/';
		$ar=array('amcolumn/amcolumn', 'amline/amline', 'ampie/ampie');
		foreach ($ar as $p) {
			if (!is_dir($d . $p)) {
				$rtn=false;
				break;	
			}	
		}
		$this->syscheck['check_amcharts']=array(
			'syscheck_current'=>($rtn ? 'amCharts' : '(Not Found)'),
			'syscheck_required'=>'amCharts',
			'syscheck_passed'=>($rtn?'yes':'no')
		);
		return $rtn;
	}
	
	public function checkFileAccess() {
		$cv=$this->getLabel('text_unknown');
		$this->syscheck['check_file_access']=array(
			'syscheck_current'=>$this->getLabel('text_unknown'),
			'syscheck_required'=>$this->getLabel('fil_access_required'),
			'syscheck_passed'=>'unknown'
		);	
		return true;
	}
}	 	
?>
