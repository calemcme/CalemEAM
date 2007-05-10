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
		chdir('../../..');
		define('_CALEM_DIR_', getcwd() . '/');
	} else {
		define('_CALEM_DIR_', $_ENV['CALEM_DIR']);
	} 
	define('LOG4PHP_CONFIGURATION', _CALEM_DIR_ . 'log4php.properties');
}

require_once _CALEM_DIR_ . 'server/conf/calem.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';	
require_once _CALEM_DIR_ . 'server/include/log4php/LoggerManager.php';	
require_once _CALEM_DIR_ . 'server/metadata/CalemTableMap.php';

/**
 * Validating that each identifier is less than 25 chars and 
 * all lookups are good.
 */
class IdentifierTest extends PHPUnit2_Framework_TestCase {
	//Test table list
	public function testIdentifer() {
		$rm=CalemFactory::getResourceManager();
		$tblMap=new CalemTableMap();
		$map=$tblMap->getTableMap();
		$invalid=array();
		foreach ($map as $tbl) {
			$tblDd=$rm->getTableDd($tbl);
			$fields = $tblDd->getFields();
			foreach ($fields as $fld=>$fldInfo) {
				if (strlen($fld)> CALEM_ID_LENGTH) {
					$invalid[]=array('table'=>$tbl, 'field'=>$fld, 'length'=>strlen($fld), 'max'=>CALEM_ID_LENGTH, 'reason'=>'id');	
				}
				try {
					//Let's check look here.
					if ($lkupDd=$tblDd->getLookupTableDd($fld)) {
						if ($lkupDd->isCached()) continue;
						$lkup=$tblDd->getJoin($fld);
						if (strlen($lkup['lkupField'])+strlen($fld)+2 > CALEM_ID_LENGTH) {//Violation at this level.
							//Let's check for 'sn'
							$sn=$tblDd->getJoinFieldName($fld);
							if (strlen($sn) > CALEM_ID_MAX_LENGTH) {
								$invalid[]=array('table'=>$tbl, 'field'=>$fld, 'length'=>strlen($sn), 'lkupSn'=>$sn, 'reason'=>'lkup');
							}	
						}	
					}
				} catch (Exception $e) {
					echo 'error in processing table: '. $tbl . ', error=' . $e->getMessage() . "<br>";
				}
				
			}
		}
		if (count($invalid) > 0) {
			echo '---- Identifier violation found: <br> ' . var_export($invalid, true);	
		} else {
			if (!isset($_ENV['CALEM_BATCH_TEST'])) {
				echo 'No identifier violation found!';
			}
		}
		$this->assertTrue(count($invalid)==0);
	}
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new IdentifierTest();
	$res->testIdentifer();
}
?>
