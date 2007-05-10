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
require_once _CALEM_DIR_ . 'server/modules/admin/soap/CalemCustomFieldSo.php';	

/**
 * This class tests UserDao class.
 */
class CustomFieldTest extends PHPUnit2_Framework_TestCase {

	public function testCustomField() {
		$dbHdlr=CalemFactory::getDbHandler();
		$tb='zc_acl_group_test';
		$fld1 = 'field_test_1'; $lb1='Field test 1';
		$fld2 = 'field_test_2'; $lb2='Field test 2';
		$fldReq=array('id'=>'field_test_1', 'type'=>'varchar', 'tableId'=>$tb,
                    'length'=>25, 'label'=>$lb1, 'required'=>1);
		$dbo=new CalemDbo();
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo $tb . " existing? " . $dbHdlr->tableExists($dbo, $tb) . '<br>';
		}
		//Make sure we don't have this table in the system
		if ($dbHdlr->tableExists($dbo, $tb)) {
			$this->dropTable($dbHdlr, $tb);
			if (!isset($_ENV['CALEM_BATCH_TEST'])) {
				echo "after removal existing? " . $dbHdlr->tableExists($dbo, $tb) . '<br>';
			}	
		}
		//Also check meta files
		$pathMd=_CALEM_DIR_ . 'custom/global/metadata/';
		$mf= $tb . '.metadata';
		if (is_file($pathMd . $mf)) {
			unlink($pathMd . $mf);
		}
		//Check for resource files
		$pathMs=_CALEM_DIR_ . 'custom/global/message/';
		$cm='custom.message';
		if (is_file($pathMs . $cm)) {
			if (!is_file($pathMs . $cm . '.backup')) {
				copy($pathMs . $cm, $pathMs . $cm . ".backup");
			}
			unlink($pathMs . $cm);
		} 
		/**
		 * Adding fields.
		 */      
		//Get an instance of soap object
		$so=new CalemCustomFieldSo();            
		//Now creating the table
		$dbHdlr->addField($fldReq);
		$so->updateMetadata($fldReq);
		$so->updateMessage($fldReq); 
		//Now verify that table exists
		$this->assertTrue($dbHdlr->tableExists($dbo, $tb));
		//verify metadata
		$this->assertTrue(is_file($pathMd . $mf));
		$mdt=file_get_contents($pathMd . $mf);
		$md=unserialize($mdt);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "metadata after 1st field: " . var_export($md, true) . '<br>';
		}
		$this->assertTrue(isset($md['fields'][$fld1]));
		$this->assertTrue(is_file($pathMs . $cm));
		$mst=file_get_contents($pathMs . $cm);
		$ms=unserialize($mst);
		$this->assertTrue(isset($ms[$fld1]));
		
		//Now adding 2nd field
		$fldReq['id']=$fld2;
		$fldReq['label']=$lb2;
		$dbHdlr->addField($fldReq);
		$so->updateMetadata($fldReq);
		$so->updateMessage($fldReq); 
		//Now verify that we have three fields in this table
		$cnt=$dbo->getCountBySql("select count(*) from INFORMATION_SCHEMA.columns where table_name= '" . $tb . "'");
		$this->assertTrue($cnt==3);
		
		//verify metadata
		$this->assertTrue(is_file($pathMd . $mf));
		$mdt=file_get_contents($pathMd . $mf);
		$md=unserialize($mdt);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "metadata: " . var_export($md, true) . '<br>';
		}
		$flds=$md['fields'];
		$this->assertTrue(isset($flds[$fld1]) && isset($flds[$fld2]) );	
		//verify message
		$this->assertTrue(is_file($pathMs . $cm));
		$mst=file_get_contents($pathMs . $cm);
		$ms=unserialize($mst);
		$this->assertTrue(isset($ms[$fld1]) && isset($ms[$fld2]));
		/**
		 * Changing field type
		 */
		$fldReq['type']='double';
		$dbHdlr->modifyFieldType($fldReq);
		$fldReq['oldId']=$fldReq['id'];
		$so->updateMetadataForFieldName($fldReq);
		$mdt=file_get_contents($pathMd . $mf);
		$md=unserialize($mdt);
		$this->assertTrue($md['fields'][$fldReq['id']]['type']=='double');
		$flds=$this->getFields($fldReq['tableId']); 
		$fld=$flds[$fldReq['id']];
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "fld " . $fldReq['id'] . ": " . var_export($fld, true) . '<br>';
		}
		$this->assertTrue($fld['DATA_TYPE']== 'double');
		
		/**
		 * Field name change
		 */
		$fldReq['oldId']=$fldReq['id'];
		$fldReq['id']='field_new';
		$fldReq['label']='Field new';
		
		$dbHdlr->modifyFieldName($fldReq);
		$so->updateMetadataForFieldName($fldReq);
		$so->updateMessage($fldReq);
		$mdt=file_get_contents($pathMd . $mf);
		$md=unserialize($mdt);
		$this->assertTrue(!isset($md['fields'][$fldReq['oldId']]) && isset($md['fields'][$fldReq['id']]));
		$flds=$this->getFields($fldReq['tableId']);
		$this->assertTrue(!isset($flds[$fldReq['oldId']]) && isset($flds[$fldReq['id']]));
		 
		//Try messages
		$mst=file_get_contents($pathMs . $cm);
		$ms=unserialize($mst);
		$this->assertTrue($ms[$fldReq['id']]=='Field new');
		
		/**
		 * Field deletion
		 */		
		$dbHdlr->DeleteField($fldReq);
		$so->deleteMetadata($fldReq);
		$mdt=file_get_contents($pathMd . $mf);
		$md=unserialize($mdt);
		$this->assertTrue(!isset($md['fields'][$fldReq['id']]));
		$flds=$this->getFields($fldReq['tableId']);
		$this->assertTrue(!isset($flds[$fldReq['id']]));
		 
		/**
		 * Clean up db and restore files
		 */		
		$this->dropTable($dbHdlr, $tb);
		$this->assertTrue(!$dbHdlr->tableExists($dbo, $tb));
		//remove/restore data
		unlink($pathMd . $mf);
		unlink($pathMs . $cm);
		if (is_file($pathMs . $cm . '.backup')) {
			copy($pathMs . $cm . ".backup", $pathMs . $cm);
			unlink($pathMs . $cm . ".backup");
		}
		
	}
	
	public function getFields($tb) {
		$dbo=new CalemDbo();
		$rows=$dbo->fetchBySql("select * FROM INFORMATION_SCHEMA.COLUMNS where table_name = '" . $tb . "'");
		foreach ($rows as $row) {
			$rtn[$row['COLUMN_NAME']]=$row;
		}
		return $rtn;	
	}
	
	public function dropTable($dbHdlr, $db) {
		$adminConn=$dbHdlr->getDatabaseAdminConnection();
		$adminConn->exec('drop table calemeam.' . $db);		
	}
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new CustomFieldTest();
	$res->testCustomField();
}
?>
