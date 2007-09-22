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

/**
 * This is the interface for a database handler. A database handler will process
 * the following info:
 * <ul>
 * <li> Database connection
 * <li> Database specific DDL and DML handling
 * <li> Database transaction management
 * </ul>
 */
 
interface CalemDbHandlerInterface {
	/**
	 * Database specific types
	 */
	public function getFieldLength($type);
	
	/**
	 * Database connection management
	 */
	public function getCalemConnection(); 
	public function releaseCalemConnection();
	public function getDatabaseAdminConnection();
	public function releaseDatabaseAdminConnection(); 
	public function dbExist($db_name, PDO $conn);
	//Query tables in the database
	public function getDbTables();
	
	/**
	 * Database DDL construction
	 */
	public function getCreateDatabase();
	public function getCreateUser();
	public function getCreateGrantPrivileges(); 
	public function getCreatePrimaryKey($table_name, $pk_name, array $fields); 
	public function getCreateIndex($table_name, $index_name, array $fields); 
	public function getCreateTable(array $table_data);
	public function getNativeFieldType(array $field_def);
	 
	/**
	 * Database DML construction
	 */
	 
	/**
	 * Transactions management
	 */
	/**
	 * DB specific error handling
	 */
	//Primary or unique index violation will get the same error.
	public function isKeyViolation($errorCode);
	
	/**
	 * Build join info based on source table and lookup table
	 * @param array of base table ('table'=>'table_name', 'field'=>'field_name')
	 * @param array of lookup table ('table'=>'table_name', 'field'=>'field_name', 'lkupField'=>'lkupField_name')
	 * @return array('select'=>'select stmt', 'join'=>'join stmt')
	 */
	public function getJoinInfo($joinFldName, $base, $lkup);
	
	/**
	 * DB server id
	 */
	public function getDbTypeId();
	
}	
?>
