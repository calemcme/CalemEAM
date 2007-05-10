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
 * To run Calem test one must set up the following:
 * - _CALEM_DIR_
 * - _CALEM_DIR_ . 'config/calem.php' is included already.
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
require_once _CALEM_DIR_ . 'server/setup/CalemDataLoadConf.php';
require_once _CALEM_DIR_ . 'server/setup/CalemDataLoader.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';
require_once _CALEM_DIR_ . 'server/modules/admin/CalemUserDbo.php';

/**
 * This class tests DbSetup class by creating a test database and drop it after
 * creation.
 */
class CalemDataLoaderTest extends PHPUnit2_Framework_TestCase {
	private $row=array(
				'id'=>'999-test',
				'wo_no'=>'999-999-test',
				'description'=>'Test wo',
				'total_cost'=>2556.78	
			);
	private $dataLoader;
	private $resourceMgr;
	
	public function __construct() {
		$this->dataLoader=new CalemDataLoader();
		$this->resourceMgr=CalemFactory::getResourceManager();
	}
		
	private function deleteById($id) {
		try {
			$user=CalemUserDbo::findById($id);
			if (!isset($_ENV['CALEM_BATCH_TEST'])) {
				echo 'user id=' . $id . ' is found, deleting it. <br>';	
			}
			$user->deleteById($id);	
		} catch (Exception $e) {}
		try {
			$user=CalemUserDbo::findById($id);
			$this->assertTrue(1!=1);
		} catch (CalemDboDataNotFoundException $e) {}
	}
	
	public function testLoader() {
		//Needs to clean up the db so we can verify the result.
		$id='999999';
		$this->deleteById($id);
		//So this user does not exist in the test harness.
		global $_CALEM_conf;
		$conf=$_CALEM_conf['calem_data_load_sample'];
		$conf['dataset']=array('test/server/setup/testdata');
		$loadConf=new CalemDataLoadConf();
		$loadConf->init($conf);
		$loader=new CalemDataLoader();
		$loader->load($loadConf);
		$stat1=$loader->getStats();
		$this->assertTrue($stat1['users']['INSERTION']==1
		        && $stat1['users']['UPDATE']==0
		        && $stat1['users']['IGNORE']==0);
		//Verify that it's in DB
		$user=CalemUserDbo::findById($id);
		$this->assertTrue($user && !(strpos($id, $user->getId())===false));
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo 'first time loading: ';
			print_r($stat1);	
		}
		//Try an update case.
		$loader=new CalemDataLoader();
		$loader->load($loadConf);
		$stat1=$loader->getStats();
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo '2nd time loading with overwrite: ';
			print_r($stat1);	
		}
		$this->assertTrue($stat1['users']['INSERTION']==0
		        && $stat1['users']['UPDATE']==1
		        && $stat1['users']['IGNORE']==0);
		//Try an ignore case.
		$conf['conflictResolution']='ignore';
		$loadConf=new CalemDataLoadConf();
		$loadConf->init($conf);
		$loader=new CalemDataLoader();
		$loader->load($loadConf);
		$stat1=$loader->getStats();
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo '2nd time loading with overwrite: ';
			print_r($stat1);	
		}
		$this->assertTrue($stat1['users']['INSERTION']==0
		        && $stat1['users']['UPDATE']==0
		        && $stat1['users']['IGNORE']==1);
		//Remove the data entry 
		$this->deleteById($id);
		
	}
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new CalemDataLoaderTest();
	$res->testLoader();
}

?>
