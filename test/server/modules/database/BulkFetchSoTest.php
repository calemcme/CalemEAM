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
require_once _CALEM_DIR_ . 'server/include/core/database/CalemDbo.php';
require_once _CALEM_DIR_ . 'server/modules/database/soap/CalemBulkFetchSo.php';		

/**
 * Helper classes for BulkFetchSoTest
 */

class Query {
	public $table;
	public $type;
	public $sql;
	public $countSql;
	public $localTime;
	
	public function __construct($table, $type, $sql, $countSql, $localTime) {
		$this->table=$table;
		$this->type=$type;
		$this->sql=$sql;
		$this->countSql=$countSql;	
		$this->localTime=$localTime;
	}	
}
 
class BulkFetchSoTest extends PHPUnit2_Framework_TestCase {
	//Bulk fetch test
	public function testBulkFetchSoUpdated() {
		global $_CALEM_conf;
		$serverTime=gmdate($_CALEM_conf['calem_server_time_format']);
		$bulkFetchSo=new CalemBulkFetchSo();
		$query=new Query('budget', 'GET', "SELECT budget.* FROM budget WHERE budget.budget LIKE '%Q2%27s%'", 
                                        "SELECT count(*) FROM budget WHERE budget.budget LIKE '%Q2%27s%'", $serverTime);
		$resp=$bulkFetchSo->handle_GET($query, $serverTime);		
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo 'handle_GET:  '. var_export($resp, true) . '<br>';
		}
		$this->assertTrue($resp['table']=='budget' && $resp['type']=='GET'
		              && $resp['count']==0
		              && $resp['serverTime']==$serverTime
		              && $resp['localTime']==$serverTime);
		              
		//Try a not 0 case
		$query=new Query('budget', 'GET', "SELECT budget.* FROM budget", 
                                        "SELECT count(*) FROM budget", $serverTime);
		$resp=$bulkFetchSo->handle_GET($query, $serverTime);		
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo 'handle_GET:  count='. $resp['count'] . '<br>';
			echo 'handle_GET:  fields=' . var_export($resp['fields'], true) . '<br>';
			echo 'data count=' . count($resp['data']) . "<br>";
			foreach ($resp['data'] as $key=>$row) {
			  echo "data " . $key . "=". var_export($row, true)."<br>";	
			}
		}
		$this->assertTrue($resp['table']=='budget' && $resp['type']=='GET'
		              && $resp['count']>0 && count($resp['fields'])>0 && count($resp['data'])>0
		              && $resp['serverTime']==$serverTime && $resp['localTime']==$serverTime);                                        
				              
	}
	
	//Deleted
	public function testBulkFetchSoDeleted() {
		global $_CALEM_conf;
		$serverTime=gmdate($_CALEM_conf['calem_server_time_format']);
		$bulkFetchSo=new CalemBulkFetchSo();
		$query=new Query('budget', 'DELETED', "SELECT recycle_bin.rec_id FROM recycle_bin WHERE "
                    . "(recycle_bin.created_time >= '2004-10-24 12:30:30' AND recycle_bin.table_name='budget')", null, $serverTime);
      try {
			$resp=$bulkFetchSo->handle_DELETED($query, $serverTime); //No data found.
			$this->assertTrue($resp['table']=='budget' && $resp['type']=='DELETED'&& $resp['serverTime']==$serverTime && $resp['localTime']==$serverTime);
      } catch (CalemDboDataNotFoundException $e) {
      }
             
		//Try a not 0 case
		$dbo=new CalemDbo();
		$sql="insert into recycle_bin (id, parent_id, description, table_name, rec_id, value_deleted, created_time, created_id)"
		     . " values('1', '2', 'test', 'budget', '123', 'budgetInfo', '2005-10-27 10:23:33', '123')";
		$dbo->insertBySql($sql);
		$sql="insert into recycle_bin (id, parent_id, description, table_name, rec_id, value_deleted, created_time, created_id)"
		     . " values('2', '2', 'test', 'budget', '123', 'budgetInfo', '2005-10-27 10:23:33', '123')";
      $dbo->insertBySql($sql);
      		     
		$resp=$bulkFetchSo->handle_DELETED($query, $serverTime);		
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo 'handle_DELETED:  count='. $resp['count'] . '<br>';
			echo 'handle_DELETED:  fields=' . var_export($resp['fields'], true) . '<br>';
			echo 'data count=' . count($resp['data']) . "<br>";
			foreach ($resp['data'] as $key=>$row) {
			  echo "data " . $key . "=". var_export($row, true)."<br>";	
			}
		}
		$this->assertTrue($resp['table']=='budget' && $resp['type']=='DELETED'
		              && count($resp['fields'])>0 && count($resp['data'])>0&& $resp['serverTime']==$serverTime); 
		//Delete the record placed for testing
		$dbo->deleteBySql("delete from recycle_bin where id='1'");
		$dbo->deleteBySql("delete from recycle_bin where id='2'");		                                                     		              
	}
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new BulkFetchSoTest();
	$res->testBulkFetchSoUpdated();
	$res->testBulkFetchSoDeleted();
}
?>
