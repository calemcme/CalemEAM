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
		chdir('../../../../..');
		define('_CALEM_DIR_', getcwd() . '/');
	} else {
		define('_CALEM_DIR_', $_ENV['CALEM_DIR']);
	}   
	define('LOG4PHP_CONFIGURATION', _CALEM_DIR_ . 'log4php.properties');
}

//Must have a full path for this test to work.
define('TEST_CACHE_DIR', _CALEM_DIR_ . '/server/cache/session/');

require_once _CALEM_DIR_ . 'server/conf/calem.php';
//set path before test
global $_CALEM_conf;
$_CALEM_conf['calem_session_config']['cacheDir']=TEST_CACHE_DIR;
$_CALEM_conf['calem_session_config']['lifeTime']=5; //5 seconds.

require_once _CALEM_DIR_ . 'server/include/core/session/CalemSession.php';	

class CalemSessionTest extends PHPUnit2_Framework_TestCase {
	
	//Session does not exist
	public function testNoSession() {
		$ses=CalemSession::load('12345');
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo 'session loaded: '.$ses.'<br>';
		}
		$this->assertTrue(!$ses);
	}
		
	//Session exists
	public function testSessionReload() {		
		$ses=new CalemSession;
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo 'session created: '.var_export($ses, true).'<br>';
			//echo 'sid=' . $ses->getSid() ."<br>";
		}
		$ses->save(); //Store off the session.
		//Now try a session reload
		$sesReload=CalemSession::load($ses->getSid());
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo 'session reloaded: '.var_export($sesReload, true).'<br>';
		}
		$this->assertTrue($ses->get()===$sesReload->get());
	}
	
	//Session removed
	public function testSessionRemoved() {		
		$ses=new CalemSession;
		$ses->save(); //Store off the session.
		//Now try a session reload
		$sesReload=CalemSession::load($ses->getSid());
		$this->assertTrue($ses->get()===$sesReload->get());
		$sesReload->remove();
		$sesReload=CalemSession::load($ses->getSid());
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo 'session reloaded after remove: '.$sesReload.'<br>';
		}
		$this->assertTrue(!$sesReload);		
	}
	
	//Session removed
	public function testSessionExpired() {	
		global $_CALEM_conf;
		$exp=$_CALEM_conf['calem_session_config']['lifeTime'];
		$ses=new CalemSession;
		$ses->save(); //Store off the session.
		//If we wait for the total timeout minus 1 sec...we can get the session
		$wait=$exp+1;
		sleep($wait);
		/**
		 * Must recreate cache so that refreshtime is reset for this test to pass.
		 */
		$cache=CalemSession::getSessionManager();
		$cache->_createCache();
		$sesReload=CalemSession::load($ses->getSid());
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "session expiration=$exp, reloaded after : ".$wait.", type=". gettype($sesReload) .", reloaded session=". var_export($sesReload, true) . '<br>';
		}
		$this->assertTrue(!$sesReload);
	}
	
	//Session renew
	public function testSessionRenew() {	
		global $_CALEM_conf;
		$exp=$_CALEM_conf['calem_session_config']['lifeTime'];
		$ses=new CalemSession();
		$ses->save(); //Store off the session.
		//If we wait for the total timeout minus 1 sec...we can get the session
		$wait=$exp/2 + 1;
		sleep($wait);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "session expiration=$exp, wait= ".$wait . '<br>';
		}
		//Now renew session
		$ses->renew();
		sleep($wait);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "session expiration=$exp, renewed and wait = ".$wait . '<br>';
		}
		/**
		 * Must recreate cache so that refreshtime is reset for this test to pass.
		 */
		$cache=CalemSession::getSessionManager();
		$cache->_createCache();
		$sesReload=CalemSession::load($ses->getSid());
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "session expiration=$exp, reloaded after : ".$wait.", type=". gettype($sesReload) .", reloaded session=". var_export($sesReload, true) . '<br>';
		}
		$this->assertTrue(isset($sesReload) && $sesReload!=null);
	}
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new CalemSessionTest();
	$res->testNoSession();
	$res->testSessionReload();
	$res->testSessionRemoved();
	$res->testSessionExpired();
	$res->testSessionRenew();
}
?>