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
require_once _CALEM_DIR_ . 'server/include/core/database/CalemDboDuplicateKeyException.php';
require_once _CALEM_DIR_ . 'server/modules/database/CalemDataBoException.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemUiException.php';


class DataBoExceptionTest extends PHPUnit2_Framework_TestCase {
	//Bulk fetch test
	public function testDataBoException() {
		$boException=new CalemDataBoException('budget', new CalemDboDuplicateKeyException("test"), null);
		$error=$boException->getErrorInfo()->getData();
		$this->assertTrue($error['id']=='CalemDboDuplicateKeyException');                               		              
	}
	
	public function testCalemUiException() {
		$boException=new CalemDataBoException('budget', new CalemUiException("CalemInStockQtyNotZeroException"), null);
		$error=$boException->getErrorInfo()->getData();
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "error=". var_export($error, true) . "<br>";
		}
		$this->assertTrue($error['id']=='CalemInStockQtyNotZeroException');                               		              
	}
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new DataBoExceptionTest();
	$res->testDataBoException();
	$res->testCalemUiException();
}
?>
