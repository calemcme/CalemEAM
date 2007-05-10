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

require_once _CALEM_DIR_ . 'server/include/core/database/CalemDbo.php';

/**
 * This is the base class for database handler for a database. It provides the
 * the common functionality shared by different database types.
 */
 
class CalemDbHandler {
	
	/**
	 * Shared DDL functions
	 */
	//DDL statement
	public function getCreateDatabase() {
		global $_CALEM_conf;
		$db_name=$_CALEM_conf['calem_db_name'];
		$dbConf=$_CALEM_conf['calem_db_config'];
		return $this->getCreateDatabaseMore($db_name, $dbConf);
	}
	
	//DDL create user for the database
	public function getCreateUser() {
		global $_CALEM_conf;
		$user=$_CALEM_conf['calem_db_user'];
		$password=$_CALEM_conf['calem_db_password'];
		$db_name=$_CALEM_conf['calem_db_name'];
		$app_host=$_CALEM_conf['calem_application_host'];
		return $this->getCreateUserMore($user, $password, $db_name, $app_host);
	}
	
	//DDL grant access privileges
	public function getCreateGrantPrivileges() {
		global $_CALEM_conf;
		$privileges=$_CALEM_conf['calem_db_privileges'];
		$user=$_CALEM_conf['calem_db_user'];
		$password=$_CALEM_conf['calem_db_password'];
		$db_name=$_CALEM_conf['calem_db_name'];
		$app_host=$_CALEM_conf['calem_application_host'];
		return $this->getCreateGrantPrivilegesMore($privileges, $user, $password, $db_name, $app_host);
	}

	//DDL primary key
	public function getCreatePrimaryKey($table, $pk_name, array $fields) {
		return 'ALTER TABLE ' . $table . ' ADD PRIMARY KEY ('  
				 . implode(', ', $fields) . ')';	
	}
		
	//DDL unique index
	public function getCreateUniqueIndex($table, $index_name, array $fields) {
		return 'CREATE UNIQUE INDEX ' . $index_name . ' ON ' . $table
				. ' (' . implode(', ', $fields) . ')';	
	}
	
	//DDL index
	public function getCreateIndex($table_name, $index_name, array $fields) {
		return 'CREATE INDEX ' . $index_name . ' ON ' . $table_name
				. ' (' . implode(', ', $fields) . ')';	
	}
	
	/**
	 * Get field list of a table without relationship lookups
	 * Used for DDL stmt and transaction processing.
	 */
	public function getTableFieldList(array $table_data) {
		$fields=$table_data['fields'];
		$rtn='';
		$is_first=true;
		foreach ($fields as $key => $types) {
			//Ensure that a comma is added when there are more fields
			if ($is_first) { //Not necessary the first round.
				$is_first=false;
			} else {
				$rtn .=", \n";
			}
			$rtn .= $key . ' ';
			$rtn .= $this->getNativeFieldType($types);;
			//Checking for not null
			if (isset($types['notNull'])) {
				$rtn .= $types['notNull'] . ' ';
			}
			//Checking for default from $fields array
			if (isset($types['default'])) {
				$rtn .= 'default \'' . $types['default'] . '\' ';
			} //done with a field construction, add a comma here
		}//Done with field loop
		if (isset($table_data['db_engine'])) { //Database engine definition
			$rtn .= 'ENGINE='.$table_data['db_engine'];
		} else if (isset($_CALEM_conf['db_engine'])){
			$rtn .= 'ENGINE'.$_CALEM_conf['db_engine'];
		}
		return $rtn;
	}
	
	/**
	 * DDL create table
	 */
	public function getCreateTable(array $table_data) {
		//Invoke sub class to construct the fields definition list
		return 'CREATE TABLE ' . $table_data['table_name'] . ' ('
				. $this->getTableFieldList($table_data) . ')';
	}
	/**
	 * Custom field
	 */
	public function addField($fieldRequst) {
		$dbo=new CalemDbo();
		if ($this->tableExists($dbo, $fieldRequst['tableId'])) {//add field
			$this->_addField($dbo, $fieldRequst);
		} else {//create table with this field.
			$this->_createTable($dbo, $fieldRequst);	
		}
	}
	
	public function modifyFieldName($fieldRequst) {
		$dbo=new CalemDbo();
		$this->_modifyFieldName($dbo, $fieldRequst);
	}
	
	public function modifyFieldType($fieldRequst) {
		$dbo=new CalemDbo();
		$this->_modifyFieldType($dbo, $fieldRequst);
	}
	
	public function deleteField($fieldRequst) {
		$dbo=new CalemDbo();
		$this->_deleteField($dbo, $fieldRequst);
	}
	
	/**
	 * Shared DML functions
	 */
}	
?>
