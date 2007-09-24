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


//Checking basic initialization
if (!defined('_CALEM_DIR_')) die("Access denied at ".__FILE__);

require_once _CALEM_DIR_ . 'server/include/log4php/LoggerManager.php';

//Use the database connection class
require_once _CALEM_DIR_ . 'server/include/core/database/CalemPdo.php';
require_once _CALEM_DIR_ . 'server/include/core/database/CalemDbHandler.php';
require_once _CALEM_DIR_ . 'server/include/core/database/CalemDbHandlerInterface.php';
require_once _CALEM_DIR_ . 'server/modules/database/CalemDataBoException.php';

/**
 * This is the database handler for a database. It provides the following:
 * <ul>
 * <li>Database connection</li>
 * <li>Data type mapping</li>
 * <li>DDL formatting</li>
 * <li>Special query construction</li>
 * </ul>
 */
 
final class MysqlHandler extends CalemDbHandler implements CalemDbHandlerInterface {
	//This is the singleton class
	private static $instance;
	//Database connections
	protected $calemConnection;
	protected $databaseAdminConnection;
	//logger instance
	protected $logger;
	
	//Data types mapping
	private $calem_db_types=array(
			'guid'=>array(
				'type'=>'varchar',
				'length'=>36
			),
			'boolean'=>array(
				'type'=>'tinyint',
				'length'=>1
			),
			'integer'=>array(
			   'type'=>'int',
				'length'=>10
			),
			'double'=>array(
			   'type'=>'double',
				'length'=>15,
				'native_type'=>'double'
			),
			'sys_currency'=>array(
				'type'=>'double',
				'length'=>15,
				'native_type'=>'double'
			),	
			'currency'=>array(
				'type'=>'double',
				'length'=>15,
				'native_type'=>'double'
			),
			'percent'=>array(
				'type'=>'percent',
				'native_type'=>'double'
			)		
		);
	
	/**
	 * Private constructor to prevent direct creation of this class
	 */
   private function __construct() {
   	$this->logger=&LoggerManager::getLogger("MysqlHandler");
   	$this->inTransaction=false;
   }
	
	/**
	 * Singleton method - for the underlying database.
	 */	
	public static function getInstance() {
       if (!isset(self::$instance)) {
           $c = __CLASS__;
           self::$instance = new $c;
       }
       return self::$instance;
   }
   
   /**
	 * Database specific types
	 */
	public function getFieldLength($type) {
		if (isset($this->calem_db_types[$type]) && isset($this->calem_db_types[$type]['length'])) {
			$len=$this->calem_db_types[$type]['length'];
		}
		//@todo to add Calem length config if needed.
		return $len;
	}
   
   //Get connection string for MySql
	private function getCalemConnectionString() {
		global $_CALEM_conf;
		$host=$_CALEM_conf['calem_db_host'];
		$db_name=$_CALEM_conf['calem_db_name'];
		return 'mysql:'.'host='.$host.';dbname='.$db_name;
	}
	
	//Get persistent configuration
	private function getPersistent() {
		global $_CALEM_conf;
		return array(PDO::ATTR_PERSISTENT =>$_CALEM_conf['persistent_db_connection']);
	}
	
	/**
	 * Calem connection is the application connection and is managed.
	 * @return CalemPdo connection or an exception is thrown if connection cannot
	 * be made.
	 */
	public function getCalemConnection() {			
		if (!isset($this->calemConnection)) {
			global $_CALEM_conf;
			$user=$_CALEM_conf['calem_db_user'];
			$password=$_CALEM_conf['calem_db_password'];
			if ($this->logger->isInfoEnabled()) {
				$this->logger->info("calem db connection: user=$user, password=***, ".
					", connection=". $this->getCalemConnectionString()
					.", persistent connection=". $this->getPersistent());
			}
       	$this->calemConnection=new CalemPdo(
       			$this->getCalemConnectionString(), $user, $password,
       			$this->getPersistent());
       	$this->calemConnection->setAttribute(
       				PDO::ATTR_ERRMODE,
       				CALEM_DB_ERR_HANDLING);
		}
   	return $this->calemConnection;
	}
	/**
	 * Release the calem connection
	 */
	public function releaseCalemConnection() {
		if (isset($this->calemConnection)) {
			$this->calemConnection=null;
		}
	}
	
	/**
	 * This is a special connection used for initial database setup only.
	 * @return CalemPdo or an exception is thrown
	 */
	public function getDatabaseAdminConnection($useCalem=false) {
		if (!isset($this->databaseAdminConnection)) {
			//Will not log into any db, just get a connection so we can create the DB
			global $_CALEM_conf;
			$host=$_CALEM_conf['calem_db_host'];
			$dsn=$useCalem ? $this->getCalemConnectionString() : $dsn='mysql:'.'host='.$host;
		   $user=$_CALEM_conf['db_admin_user'];
		   $password=$_CALEM_conf['db_admin_password'];
		   if ($this->logger->isInfoEnabled()) {
				 $this->logger->info("db admin connection: user=$user, password=***, ".
					", connection=".$dsn);
			}
	     	$this->databaseAdminConnection=new CalemPdo($dsn, $user, $password);
	     	$this->databaseAdminConnection->setAttribute(
	     				PDO::ATTR_ERRMODE,
	     				CALEM_DB_ERR_HANDLING);
   	}
   	return $this->databaseAdminConnection;
	}
	/**
	 * Release database admin connection
	 */
	public function releaseDatabaseAdminConnection() {
		if (isset($this->databaseAdminConnection)) {
			$this->databaseAdminConnection=null;
		}
	}
	
	/**
	 * Check if the given database exists
	 * @param database name
	 * @param PDO connection
	 * @return boolean true|false
	 */
	public function dbExist($db_name, PDO $conn) {
		$exist=false;
		foreach ($conn->query('show databases', PDO::FETCH_ASSOC) as $row) {
			if ($this->logger->isDebugEnabled()) $this->logger->debug('database: ' . var_export($row, true));
			if ($row['Database']==$db_name) {
				$exist=true;
				break;	
			}
		}
		return $exist;
	}
	/**
	 * Get all the tables in the database
	 * @return array of table names
	 */
	public function getDbTables() {
		$conn=$this->getCalemConnection();
		foreach ($conn->query('show tables', PDO::FETCH_ASSOC) as $row) {
			foreach($row as $key=>$value) {
				$tables[]=$value;
				break;
			}
		}
		return $tables;
	}
	
	//DDL statement
	public function getCreateDatabaseMore($db_name, array $dbConf) {
		return 'CREATE DATABASE ' . $dbConf['if_not_exists'] . ' ' . $db_name 
					. ' CHARACTER SET ' . $dbConf['character_set']
					. ' COLLATE ' . $dbConf['collation'];
	}
	
	//DDL create user for the database
	public function getCreateUserMore($user, $password, $db_name, $app_host) {
		return 'CREATE USER \''. $user . '\'@' . '\'' . $app_host . '\' ' 
				 . 'IDENTIFIED BY \''. $password . '\'';
	}
	//DDL grant access privileges
	public function getCreateGrantPrivilegesMore($privileges, $user, $password, $db_name, $host) {
		return 'GRANT ' . implode(', ', $privileges) . ' ON `' . $db_name . '`.* TO \'' 
				. $user . '\'@\'' . $host . '\''; 
	}

	//DDL primary key - shared	
	//DDL unique index - in base class
	//DDL index - in base class
	//DDL create table - in base class
	public function getNativeFieldType(array $field_def) {
		$type=$field_def['type'];
		$rtn=$type . ' ' . ($type==FIELD_VARCHAR ? (' ('. $field_def['length'] . ') ') : '');
		//First do we have a native type defined?
		if (isset($this->calem_db_types[$type])) {
			$native_def=$this->calem_db_types[$type];
			if (isset($native_def['native_type'])) {
				$rtn=$native_def['native_type'];
			} else {
				$rtn=$native_def['type'] . ' (' . $native_def['length'] . ')';
			}	
		}
		return $rtn;
	}
	
	//DML stmt specific to this type of DB
	
	/**
	 * DB specific error handling
	 */
	//Primary or unique index violation will get the same error.
	public function isKeyViolation($errorCode) {
		return ($errorCode==23000);
	}
	
	/**
	 * Build join info based on source table and lookup table
	 * @param array of base table ('table'=>'table_name', 'field'=>'field_name')
	 * @param array of lookup table ('table'=>'table_name', 'field'=>'field_name', 'lkupField'=>'lkupField_name')
	 * @return array('select'=>'select stmt', 'join'=>'join stmt')
	 */
	public function getJoinInfo($joinFldName, $base, $lkup) {
		$select=$lkup['table'] . '.' . $lkup['lkupField'] . ' as ' . $joinFldName;
		$from = 'LEFT JOIN ' . $lkup['table'] . ' ON ' 
		         . $base['table'] . '.' . $base['field'] . '=' . $lkup['table'] . '.' . $lkup['field'];
		return array('select'=>$select, 'from'=>$from);
	}
	
	/**
	 * Custom field functions
	 */
	public function tableExists($dbo, $table) {
		try {
 			$count=$dbo->getCountBySql("SELECT count(table_name) FROM INFORMATION_SCHEMA.TABLES WHERE table_name = '" . $table . "'");
		} catch (Exception $ex) {
			$errorInfo=$dbo->getErrorInfo();	
 			throw new CalemDataBoException($table, $ex, $errorInfo);
		}	
		return ($count > 0);
	}
	
	//First field addition
	public function _createTable($dbo, $fldReq) {
		try {
			$sql='create table ' . $fldReq['tableId'] . ' ( ' . CUSTOM_FIELD_ID . ' varchar(36) primary key, ' . 
			         $fldReq['id'] . ' ' . $this->getNativeFieldType($fldReq) . ' )';
 			$dbo->executeDDL($sql);
		} catch (Exception $ex) {
			$errorInfo=$dbo->getErrorInfo();	
 			throw new CalemDataBoException($fldReq['tableId'], $ex, $errorInfo);
		}	
	}
	
	// subsequence field addition
	public function _addField($dbo, $fldReq) {
		try {
			$sql='alter table ' . $fldReq['tableId'] . ' add ' . 
			         $fldReq['id'] . ' ' . $this->getNativeFieldType($fldReq);
 			$dbo->executeDDL($sql);
		} catch (Exception $ex) {
			$errorInfo=$dbo->getErrorInfo();	
 			throw new CalemDataBoException($fldReq['tableId'], $ex, $errorInfo);
		}	
	}
	
	public function _modifyFieldName($dbo, $fldReq) {
		try {
			$sql='alter table ' . $fldReq['tableId'] . ' change  ' . 
			         $fldReq['oldId'] . ' ' . $fldReq['id'] . ' ' . $this->getNativeFieldType($fldReq);
 			$dbo->executeDDL($sql);
		} catch (Exception $ex) {
			$errorInfo=$dbo->getErrorInfo();	
 			throw new CalemDataBoException($fldReq['tableId'], $ex, $errorInfo);
		}	
	}
	
	public function _modifyFieldType($dbo, $fldReq) {
		try {
			$sql='alter table ' . $fldReq['tableId'] . ' modify  ' . 
			         $fldReq['id'] . ' ' . $this->getNativeFieldType($fldReq);
 			$dbo->executeDDL($sql);
		} catch (Exception $ex) {
			$errorInfo=$dbo->getErrorInfo();	
 			throw new CalemDataBoException($fldReq['tableId'], $ex, $errorInfo);
		}	
	}
	
	public function _deleteField($dbo, $fldReq) {
		try {
			$sql='alter table ' . $fldReq['tableId'] . ' drop  ' .  $fldReq['id'];
 			$dbo->executeDDL($sql);
		} catch (Exception $ex) {
			$errorInfo=$dbo->getErrorInfo();	
 			throw new CalemDataBoException($fldReq['tableId'], $ex, $errorInfo);
		}
	}
	
	public function getDbTypeId() {
		return 'mysql';
	}
}	

?>
