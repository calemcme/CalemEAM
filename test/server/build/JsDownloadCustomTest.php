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
require_once _CALEM_DIR_ . 'server/include/util/CalemGzip.php';
require_once _CALEM_DIR_ . 'server/include/core/session/CalemSession.php';

class JsDownloadCustomTest extends PHPUnit2_Framework_TestCase {
	
	/**
	 * This is a pure http post request. 
	 * This test is to show the real SOAP return to be sure.
	 */
	public function post($host, $port, $query=null, $others=''){
		$path=explode('/',$host);
		$host=$path[0];
		unset($path[0]);
		$path='/'.(implode('/',$path));
		$post="POST $path HTTP/1.1\r\nHost: $host\r\nContent-type: text/xml; charset: utf-8\r\nAccept-Encoding: gzip, deflate\r\n${others}User-Agent: Mozilla 4.0\r\nContent-length: ".strlen($query)."\r\nConnection: close\r\n\r\n$query";
		$h=fsockopen($host,$port);
		fwrite($h,$post);
		for($a=0,$r='';!$a;){
			$b=fread($h,1024);
			$r.=$b;
			$a=(($b=='')?1:0);
		}
		fclose($h);
		
		//Verify that the result status is correct.
		$idx=strpos($r, "\n");
		$status=substr($r, 0, $idx);
		$ar=explode(" ", $status);
		if ($ar[1] != '200') { //It's not OK from the server.
		   echo "response is not OK: response=" . $r . "\n<br>";
			$this->assertTrue(1!=1);
		} else {
			if (!isset($_ENV['CALEM_BATCH_TEST'])) {
				//echo "response=".$r;
			}
		}
		return $r;
	}
	
	public function loadJs($sid, $name, $mode, $store=false) {
		global $_CALEM_conf;
		$endpoint = 'localhost' . $_CALEM_conf['calem_root_uri'] . '/client/JsPkgCustom.php?sessionId=' . $sid . '&loadmode='.$mode;
		$response=$this->post($endpoint, 80);
		//if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo $mode." file length=".strlen($response) . "<br>\n";
		//}
		if ($store) {
			$fh=fopen(_CALEM_DIR_ . $name.".".$mode, "w");
			fwrite($fh, $response);
			fclose($fh);
		}
		return strlen($response);
	}
	
	public function testCustomLoading() {
		//Prepare a session first.
		$ses=new CalemSession();
		$user=array('id'=>'1000000', 'acl_group_id'=>'CUSTOM_SYSTEM');
		$ses->set('user', $user);
		$ses->save();
		$sid=$ses->getSid();
		$aggrSize=$this->loadJs($sid, 'custom', 'aggr');
		$minSize=$this->loadJs($sid, 'custom', 'min');
		$zipSize=$this->loadJs($sid, 'custom', 'gzip');

		$this->assertTrue($aggrSize > $minSize && $minSize>$zipSize);
		//Remove session
		$ses->remove();
	}
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new JsDownloadCustomTest();
	$res->testCustomLoading();
}
?>
