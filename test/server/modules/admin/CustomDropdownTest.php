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

require_once _CALEM_DIR_ . 'server/conf/calem.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';
require_once _CALEM_DIR_ . 'server/include/core/database/CalemDbo.php';	
require_once _CALEM_DIR_ . 'server/modules/admin/soap/CalemCustomDropdownSo.php';	

/**
 * This class tests UserDao class.
 */
class CustomDropdownTest extends PHPUnit2_Framework_TestCase {

	public function testCustomDropdown() {
		$tb='job_role';
		$recId='eam_1';
		$label='Eam 1';
		$fldReq=array('id'=>$recId, 'fixed'=>true,
                    'tableId'=>$tb, 'label'=>$label, 'locale'=>'');
		
		//Also check meta files
		$pathDn=_CALEM_DIR_ . 'custom/global/dropdown/';
		$dn= $tb . '.dropdown';
		$fullDn= $pathDn . $dn;
		if (is_file($fullDn)) {
			unlink($fullDn);
		}
		//Check for resource files
		$pathMs=_CALEM_DIR_ . 'custom/global/message/';
		$cm='custom.message';
		$fullMs=$pathMs . $cm;
		if (is_file($fullMs)) {
			if (!is_file($fullMs . '.backup')) {
				copy($fullMs, $fullMs . ".backup");
			}
			unlink($fullMs);
		} 
		/**
		 * Adding fields.
		 */      
		//Get an instance of soap object
		$so=new CalemCustomDropdownSo();            
		//Now creating the table
		$so->addDropdownEntry($fldReq);
		$so->updateMessage($fldReq); 
		//verify metadata
		$this->assertTrue(is_file($fullDn));
		$mdt=file_get_contents($fullDn);
		$md=unserialize($mdt);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "dropdown after 1st field: " . var_export($md, true) . '<br>';
		}
		$this->assertTrue(isset($md[$recId]));
		$this->assertTrue(is_file($fullMs));
		$mst=file_get_contents($fullMs);
		$ms=unserialize($mst);
		$this->assertTrue(isset($ms[$recId]));
		
		//Now adding 2nd entry
		$recId2='eam_2';
		$label2='EAM 2';
		$fldReq['id']=$recId2;
		$fldReq['label']=$label2;
		$so->addDropdownEntry($fldReq);
		$so->updateMessage($fldReq); 
		
		//verify metadata
		$this->assertTrue(is_file($fullDn));
		$mdt=file_get_contents($fullDn);
		$md=unserialize($mdt);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "dropdown after 2nd add: " . var_export($md, true) . '<br>';
		}
		$this->assertTrue(isset($md[$recId]) && isset($md[$recId2]) );	
		$this->assertTrue($md[$recId]['fixed'] && $md[$recId2]['fixed']);
		//verify message
		$this->assertTrue(is_file($fullMs));
		$mst=file_get_contents($fullMs);
		$ms=unserialize($mst);
		$this->assertTrue(isset($ms[$recId]) && isset($ms[$recId2]));
		
		/**
		 * Edit entry
		 */
		$fldReq['oldId']=$fldReq['id'];
		$fldReq['fixed']=false;
		$so->modifyDropdownEntry($fldReq);
		$mdt=file_get_contents($fullDn);
		$md=unserialize($mdt);
		$this->assertTrue($md[$fldReq['id']]['fixed']==false);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo $fldReq['id'] . ": " . var_export($md[$fldReq['id']], true) . '<br>';
		}
		
		//Now try swapping
		$so->swapDropdownEntry(array('id'=>$recId, 'swapId'=>$recId2, 'tableId'=>$tb));
		$mdt=file_get_contents($fullDn);
		$md=unserialize($mdt);
		$i=0;
		foreach ($md as $key => $val) {
			if ($key==$recId) $recNo=$i;
			else if ($key == $recId2) $recNo2=$i;
			$i++;	
		}
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "recNo: " . $recNo . ", recNo2: " . $recNo2 . ', full=' . var_export($md, true) . '<br>';
		}
		$this->assertTrue($recNo2 < $recNo);
		/**
		 * Field deletion
		 */		
		$so->deleteDropdownEntry($fldReq);
		$mdt=file_get_contents($fullDn);
		$md=unserialize($mdt);
		$this->assertTrue(!isset($md[$fldReq['id']]));
		 
		/**
		 * Clean up db and restore files
		 */		
		unlink($fullDn);
		unlink($fullMs);
		if (is_file($pathMs . $cm . '.backup')) {
			copy($pathMs . $cm . ".backup", $pathMs . $cm);
			unlink($pathMs . $cm . ".backup");
		}
		
	}
	
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new CustomDropdownTest();
	$res->testCustomDropdown();
}
?>
