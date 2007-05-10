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
		chdir('../../../../../..');
		define('_CALEM_DIR_', getcwd() . '/');
	} else {
		define('_CALEM_DIR_', $_ENV['CALEM_DIR']);
	} 
	define('LOG4PHP_CONFIGURATION', _CALEM_DIR_ . 'log4php.properties');
}

require_once _CALEM_DIR_ . 'server/conf/calem.php';
require_once _CALEM_DIR_ . 'server/include/core/database/query/CalemDbExpr.php';

/**
 * This test verifies DBO Filter class functions.
 */
class CalemDbExprTest extends PHPUnit2_Framework_TestCase {	

	public function testDbValue() {
		$val=new CalemDbString('wo_001');
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "val= " . $val->getSql('=') . "<br>";
		}
		$this->assertTrue($val->getSql('=')=="'wo_001'");
		
		$val=new CalemDbNumber(23456);
		$this->assertTrue($val->getSql('=') == 23456);
		
		$val=new CalemDbDate('2007/12/30');
		$this->assertTrue($val->getSql('=')=="'2007/12/30'");
		
		$val=new CalemDbTime('15:00:00');
		$this->assertTrue($val->getSql('=')=="'15:00:00'");
		
		$val=new CalemDbDateTime('2007/12/30 15:00:00');
		$this->assertTrue($val->getSql('=')=="'2007/12/30 15:00:00'");
	}
	
	public function testDbField() {
		$fld=new CalemDbField('workorder', 'priority_id');
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "fld= " . $fld->getSql() . "<br>";
		}
		$this->assertTrue($fld->getSql() == "workorder.priority_id");	
	}
	
	public function testDbExpr() {
		$fld=new CalemDbField('workorder', 'priority_id');
		$val=new CalemDbString('wos_urgent');
		$dbExpr=new CalemDbExpr($fld, CalemDbExpr::EXPR_EQ, $val);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "expr SQL: " . $dbExpr->getSql() . "<br>";
		}
		$this->assertTrue($dbExpr->getSql() == "workorder.priority_id = 'wos_urgent'");
	}
	
	public function testDbExprAnd() {
		$and=new CalemExprAnd();
		
		$fld=new CalemDbField('workorder', 'priority_id');
		$val=new CalemDbString('wos_urgent');
		$dbExpr=new CalemDbExpr($fld, CalemDbExpr::EXPR_EQ, $val);
		
		$val2=new CalemDbString('wos_not_urgent');
		$dbExpr2=new CalemDbExpr($fld, CalemDbExpr::EXPR_NEQ, $val2);
		$and->add($dbExpr);
		$and->add($dbExpr2);
		
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "andExpr SQL: " . $and->getSql() . "<br>";
		}
		$this->assertTrue(strpos($and->getSql(), "workorder.priority_id = 'wos_urgent'")!==false
		                  && strpos($and->getSql(), ' AND ')!==false
		                  && strpos($and->getSql(), "workorder.priority_id <> 'wos_not_urgent'")>0);
	}
	
	public function testDbExprOr() {
		$and=new CalemExprOr();
		
		$fld=new CalemDbField('workorder', 'priority_id');
		$val=new CalemDbString('wos_urgent');
		$dbExpr=new CalemDbExpr($fld, CalemDbExpr::EXPR_EQ, $val);
		
		$val2=new CalemDbString('wos_not_urgent');
		$dbExpr2=new CalemDbExpr($fld, CalemDbExpr::EXPR_NEQ, $val2);
		$and->add($dbExpr);
		$and->add($dbExpr2);
		
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "andExpr SQL: " . $and->getSql() . "<br>";
		}
		$this->assertTrue(strpos($and->getSql(), "workorder.priority_id = 'wos_urgent'")!==false
		                  && strpos($and->getSql(), ' OR ')!==false
		                  && strpos($and->getSql(), "workorder.priority_id <> 'wos_not_urgent'")>0);
	}
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$dbf=new CalemDbExprTest();
	$dbf->testDbValue();
	$dbf->testDbField();
	$dbf->testDbExpr();
	$dbf->testDbExprAnd();
	$dbf->testDbExprOr();
}
?>
