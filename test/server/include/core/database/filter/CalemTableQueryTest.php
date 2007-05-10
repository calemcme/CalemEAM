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
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';
require_once _CALEM_DIR_ . 'server/include/core/database/query/CalemTableQuery.php';

/**
 * This test verifies DBO Filter class functions.
 */
class CalemTableQueryTest extends PHPUnit2_Framework_TestCase {	

	public function testSelect() {
		$se=new CalemSelectField('workorder');
		$sql=$se->getSql();
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "selectFieldSql: " . $sql . "<br>";
		}
		$this->assertTrue($sql=='workorder.*');
		
		$select=new CalemQuerySelect();
		$select->add($se);
		
		$sql=$select->getSql();
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "selectSql: " . $sql . "<br>";
		}
		$this->assertTrue($sql=='SELECT workorder.*');
		
		$se=new CalemSelectField('workorder', 'asset_id');
		$select->add($se);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "two selects: " . $select->getSql() . "<br>";
		}
		$this->assertTrue($select->getSql() == 'SELECT workorder.* , workorder.asset_id');
	}
	
	public function testWhere() {
		$fld=new CalemDbField('workorder', 'asset_id');
		$val=new CalemDbString('101-200');
		$expr=new CalemDbExpr($fld, CalemDbExpr::EXPR_EQ, $val);
		
		$where=new CalemQueryWhere();
		$where->set('workorder', $expr);
		
		//Add another expr
		$fld=new CalemDbField('workorder', 'pm_id');
		$expr2=new CalemDbExpr($fld, CalemDbExpr::EXPR_NEQ, $val);
		$where->addWhereExpr('workorder', null, $expr2);
		
		$sql=$where->getSql();
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "where sql: " . $sql . "<br>";
		}
		$this->assertTrue(strpos($sql, "workorder.asset_id = '101-200'")>0
                       && strpos($sql, "workorder.pm_id <> '101-200'"));
	}
	
	public function testSimpleQuery() {
		$tblQuery=new CalemTableQuery('workorder');
		$se=new CalemSelectField('workorder');
		$tblQuery->addSelect($se);
		$sql=$tblQuery->getSql();
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "wo simple: " . $sql . "<br>";
		}
		$this->assertTrue(strpos($sql, 'workorder.*')>0
		                && strpos($sql, 'SELECT ')!==false
		                && strpos($sql, ' FROM ')>0);
	}
	
	public function testSimpleWhereQuery() {
		$tblQuery=new CalemTableQuery('workorder');
		$se=new CalemSelectField('workorder');
		$tblQuery->addSelect($se);
		
		$fld=new CalemDbField('workorder', 'asset_id');
		$val=new CalemDbString('101-200');
		$expr=new CalemDbExpr($fld, CalemDbExpr::EXPR_EQ, $val);
		
		$tblQuery->setWhere('workorder', $expr);
		$sql=$tblQuery->getSql();
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "wo simple where: " . $sql . "<br>";
		}
		$this->assertTrue(strpos($sql, 'workorder.*')>0
		                && strpos($sql, 'SELECT ')!==false
		                && strpos($sql, ' FROM ')>0
		                && strpos($sql, ' WHERE ')>0
		                && strpos($sql, "workorder.asset_id = '101-200'")>0);
	}
	
	public function testSimpleJoinQuery() {
		$tblQuery=new CalemTableQuery('workorder');
		
		$se=new CalemSelectField('workorder');
		$tblQuery->addSelect($se);
		//add a join
		$join=new CalemTableJoin(CalemTableJoin::LEFT, 'workorder', 'pm_id', 'pm', 'pm_no', 'wo1');
		$se=new CalemSelectField('pm', 'pm_no', 'workorder_pm_id__pm_no');
		$tblQuery->addSelect($se);
		
		$tblQuery->setWhere('workorder', null, $join);
		
		$fld=new CalemDbField('workorder', 'asset_id');
		$val=new CalemDbString('101-200');
		$expr=new CalemDbExpr($fld, CalemDbExpr::EXPR_EQ, $val);
		
		$tblQuery->addWhere('workorder', null, $expr);
		$sql=$tblQuery->getSql();
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "wo simple join: " . $sql . "<br>";
		}
		$this->assertTrue(strpos($sql, 'workorder.*')>0
		                && strpos($sql, 'SELECT ')!==false
		                && strpos($sql, ' FROM ')>0
		                && strpos($sql, ' WHERE ')>0
		                && strpos($sql, "workorder.asset_id = '101-200'")>0
		                && strpos($sql, 'workorder LEFT JOIN pm')>0);
	}

}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$dbf=new CalemTableQueryTest();
	$dbf->testSelect();
	$dbf->testWhere();
	$dbf->testSimpleQuery();
	$dbf->testSimpleWhereQuery();
	$dbf->testSimpleJoinQuery();
}
?>
