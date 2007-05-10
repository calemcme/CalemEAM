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

 
/** 
 * Must define _CALEM_DIR_ and _LOG4PHP_CONFIGURATION
 * 
 */ 

//Note that PHPUnit2 must be on the include path for it to work.
require_once 'PHPUnit2/Framework/TestCase.php';

if (!defined('_CALEM_DIR_')) {
	if (!isset($_ENV['CALEM_DIR'])) {
		chdir('../../../..');
		define('_CALEM_DIR_', getcwd() . '/');
	} else {
		define('_CALEM_DIR_', $_ENV['CALEM_DIR']);
	}  
	define('LOG4PHP_CONFIGURATION', _CALEM_DIR_ . 'log4php.properties');
}

require_once _CALEM_DIR_ . 'server/modules/pm/CalemPmDependencyBo.php';

class PmDependencyMapTest extends PHPUnit2_Framework_TestCase {
	private $pmDepRows;
	
	public function storeOffPmDependency() {
		$dbo=CalemFactory::getDbo('pm_dependency');
		try {
			$this->pmDepRows=$dbo->fetchBySql('select * from pm_dependency');
			$dbo->executeBySql('delete from pm_dependency');			
		} catch (CalemDboDataNotFoundException $ex) {}
		$cnt=$dbo->getCountBySql('select count(*) from pm_dependency');
		$this->assertTrue($cnt==0);
	}
	
	public function restorePmDependency() {
		if (!$this->pmDepRows || count($this->pmDepRows)==0) return;
		$dbo = CalemFactory::getDbo('pm_dependency');
		foreach ($this->pmDepRows as $row) {
			$dbo->setChangeBulk($row);
			$dbo->insert();
			$dbo->unsetId();				
		}	
	}
	
	public function addPdmSimple() {
		$dbo=CalemFactory::getDbo('pm_dependency');
		$row=array('pm_id'=>'pm001', 'child_pm_id'=>'pm002');
		$dbo->setChangeBulk($row);
		$dbo->insert();
		$cnt=$dbo->getCountBySql('select count(*) from pm_dependency');
		$this->assertTrue($cnt==1);	
	}
	public function rmPdmSimple() {
		$dbo=CalemFactory::getDbo('pm_dependency');
		$dbo->executeBySql("delete from pm_dependency");
		$cnt=$dbo->getCountBySql('select count(*) from pm_dependency');
		$this->assertTrue($cnt==0);
	}
	
	public function addPdmMultiple() {
		$dbo=CalemFactory::getDbo('pm_dependency');
		$row=array('pm_id'=>'pm001', 'child_pm_id'=>'pm005');
		$dbo->setChangeBulk($row);
		$dbo->insert();
		$dbo->unsetId();
		
		$row=array('pm_id'=>'pm001', 'child_pm_id'=>'pm004');
		$dbo->setChangeBulk($row);
		$dbo->insert();
		$dbo->unsetId();
		
		$row=array('pm_id'=>'pm002', 'child_pm_id'=>'pm006');
		$dbo->setChangeBulk($row);
		$dbo->insert();
		$dbo->unsetId();
		
		$row=array('pm_id'=>'pm003', 'child_pm_id'=>'pm004');
		$dbo->setChangeBulk($row);
		$dbo->insert();
		$dbo->unsetId();
		
		$row=array('pm_id'=>'pm004', 'child_pm_id'=>'pm005');
		$dbo->setChangeBulk($row);
		$dbo->insert();
		$dbo->unsetId();
		
		$row=array('pm_id'=>'pm006', 'child_pm_id'=>'pm005');
		$dbo->setChangeBulk($row);
		$dbo->insert();
		$dbo->unsetId();
		
		$cnt=$dbo->getCountBySql('select count(*) from pm_dependency');
		$this->assertTrue($cnt==6);	
	}
	
	public function testPmDependencyEmpty() {
		$this->storeOffPmDependency();
		$pmDepBo=new CalemPmDependencyBo();
		$pdm=$pmDepBo->getPdm();
		$this->restorePmDependency();
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "pdm= ". var_export($pdm, true) . "<br>"; 
		}
		$this->assertTrue(count($pdm)==0);
	}	
	
	public function testPmDependencySimple() {
		$this->storeOffPmDependency();
		$this->addPdmSimple();
		$pmDepBo=new CalemPmDependencyBo();
		$pdm=$pmDepBo->getPdm();
		$this->rmPdmSimple();
		$this->restorePmDependency();
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "pdm= ". var_export($pdm, true) . "<br>"; 
		}
		$this->assertTrue($pdm['map']['pm001'] && $pdm['sort']);
		$this->assertTrue(count($pdm['map'])==1 && count($pdm['sort']==2));
		//Check the order
		$keys=array_keys($pdm['sort']);
		$this->assertTrue($keys[0]=='pm001' && $keys[1]=='pm002');
	}	
	
	public function testPmDependencyMultiple() {
		$this->storeOffPmDependency();
		$this->addPdmMultiple();
		$pmDepBo=new CalemPmDependencyBo();
		$pdm=$pmDepBo->getPdm();
		$this->rmPdmSimple();
		$this->restorePmDependency();
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "pdm= ". var_export($pdm, true) . "<br>"; 
		}
		$this->assertTrue($pdm['map']['pm001'] && $pdm['sort']);
		$this->assertTrue(count($pdm['map'])==5 && count($pdm['sort']==6));
		//Check the order
		$keys=array_keys($pdm['sort']);
		$this->assertTrue($keys[5]=='pm005');
		$this->assertTrue(count($pdm['map']['pm001'])==2 && count($pdm['map']['pm002'])==1
		               && count($pdm['map']['pm005'])==0);
	}	
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$jt=new PmDependencyMapTest();
	$jt->testPmDependencyEmpty();
	$jt->testPmDependencySimple();
	$jt->testPmDependencyMultiple();
}
?>
