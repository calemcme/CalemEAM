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

//logger class
require_once _CALEM_DIR_ . 'server/include/log4php/LoggerManager.php';

/**
 * This is the PDO Statement class used by Calem. The purpose is to provide
 * instrumentation of stmt execution time.
 */
 class CalemPDOStatement {
 	//SQL stmt to execute
 	private $sql;
 	private $pdoStmt;
 	private $driver_options;
 	//Value arrays for queries
 	private $params;
 	//Global configuration
 	private static $monitor_query;
 	private static $warning_time;
 	private static $precision;
 	private static $logger;
 	//fetch style
 	private static $fetch_style;
 	private static $fetch_all_style;
 	
 	/**
 	 * Constructor to take in all three parameters
 	 */
 	public function __construct($sql, PDOStatement $pdoStmt, array $driver_options=NULL) {
 		$this->sql=$sql;
 		$this->pdoStmt=$pdoStmt;
 		$this->driver_options=$driver_options;
 		if (!isset(self::$monitor_query)) {
			global $_CALEM_conf;
			self::$monitor_query=$_CALEM_conf['monitor_db_queries'];
			self::$warning_time=$_CALEM_conf['warning_db_query_time'];
			self::$precision=$_CALEM_conf['db_time_precision'];	
			self::$fetch_style=$_CALEM_conf['db_fetch_style'];	
			self::$fetch_all_style=$_CALEM_conf['db_fetch_all_style'];
 		}
 		if (!isset(self::$logger)) {
 			self::$logger=&LoggerManager::getLogger('CalemPDOStatement');
 		}
 	}
 	/**
 	 * All the PDO methods are facaded b/c the instrumentation purpose.
 	 * bindColumn - binds a PHP variable to an output column in a result set 
	 * bindParam - binds a PHP variable to a parameter in the prepared statement 
	 * bindValue - binds a value to a parameter in the prepared statement
	 * closeCursor - closes the cursor, allowing the statement to be executed again 
	 * columnCount - returns the number of columns in the result set
	 * errorCode - retrieves an error code, if any, from the statement 
	 * errorInfo - retrieves an array of error information, if any, from thestatement
	 * execute - executes a prepared statement
	 * fetch - fetches a row from a result set
	 * fetchAll - fetches an array containing all of the rows from a result set
	 * fetchColumn - returns the data from a single column in a result set
	 * getAttribute - retrieves a PDOStatement attribute
	 * getColumnMeta - retrieves metadata for a column in the result set
	 * nextRowset - retrieves the next rowset (result set)
	 * rowCount - returns the number of rows that were affected by the execution
	 * of an SQL statement
	 * setAttribute - sets a PDOStatement attribute 
	 * setFetchMode - sets the fetch mode for a PDOStatement
 	 */
	/**
	 * bindColumn
	 * bool PDOStatement::bindColumn ( mixed column, mixed &param [, int type] )
	 */
 	public function bindColumn ( $column, &$param, $type=NULL) {
 		if (self::$monitor_query) {
 			$this->params[$column]=$param;
 		}
 		return $this->pdoStmt->bindColumn($column, $param, $type);
 	}
 	/**
 	 * bindParam
 	 * bool PDOStatement::bindParam ( mixed parameter, mixed &variable [, int
 	 * data_type [, int length [, mixed driver_options]]] )
 	 */
 	public function bindParam ($parameter, &$variable, $data_type=NULL, $length=NULL, $driver_options=NULL) {
 		if (self::$monitor_query) {
 			$this->params[$parameter]=$variable;
 		}
 		return $this->pdoStmt->bindParam($parameter, $variable, $data_type, $length, $driver_options);
 	}
 	/**
 	 * bindValue
 	 * bool PDOStatement::bindValue ( mixed parameter, mixed value [, int
 	 * data_type] )
 	 */
 	public function bindValue ($parameter, $value, $data_type=NULL){
 		if (self::$monitor_query) {
 			$this->params[$parameter]=$value;
 		}
 		return $this->pdoStmt->bindValue($parameter, $value, $data_type);
 	}
 	/**
 	 * closeCursor
 	 */
 	public function closeCursor() {
 		return $this->pdoStmt->closeCursor();
 	}
 	/**
 	 * int PDOStatement::columnCount ( )
 	 */
 	public function columnCount() {
 		return $this->pdoStmt->columnCount();
 	}
 	/**
 	 * string PDOStatement::errorCode ( )
	 */
	public function errorCode() {
		return $this->pdoStmt->errorCode();
	}
	/**
	 * array PDOStatement::errorInfo ( )
	 */
	public function errorInfo() {
		return $this->pdoStmt->errorInfo();
	}
	/**
	 * bool PDOStatement::execute ( [array input_parameters] )
	 */
	public function execute(array $input_params=NULL) {
		if (self::$monitor_query > 0) {
			$params=var_export($this->params, true);
			$this->params=array(); //Empty out the value array.
			$time_start=microtime(true);
		}
		$result=$this->pdoStmt->execute($input_params);
		if (self::$monitor_query>0) {
			$time_used=microtime(true) - $time_start;
			if ($time_used >= self::$warning_time) {
				self::$logger->warn("Query time:".round($time_used, self::$precision).', the query=' . $this->sql . ', params=' . $params);
			} else if (self::$monitor_query>1) {
				self::$logger->debug("Query time:".round($time_used, self::$precision).', the query=' . $this->sql . ', params=' . $params);
			}
		}
		return $result;
	}
	/**
	 * mixed PDOStatement::fetch ( [int fetch_style [, int cursor_orientation [,
	 * int cursor_offset]]] )
	 */
	public function fetch($fetch_style=NULL, $cursor_orientation=NULL, $cursor_offset=NULL) {
		if (!isset($fetch_style)) {
			$fetch_style=self::$fetch_style;
		}
		return $this->pdoStmt->fetch($fetch_style, $cursor_orientation, $cursor_offset);
	}
	/**
	 * Fetch column
	 * string PDOStatement::fetchColumn ( [int column_number] )
	 */
	public function fetchColumn($column_number=0) {
		return $this->pdoStmt->fetchColumn($column_number);
	}
	/**
	 * array PDOStatement::fetchAll ( [int fetch_style [, int column_index]] )
	 */
	public function fetchAll($fetch_style=NULL, $column_index=0) {
		if (!isset($fetch_style)) {
			$fetch_style=self::$fetch_all_style;
		}
		return $this->pdoStmt->fetch($fetch_style, $column_index);
	}
	/**
	 * mixed PDOStatement::getAttribute ( int attribute )
	 */
	public function getAttribute($attribute) {
		return $this->pdoStmt->getAttribute($attribute);
	}
	/**
	 * mixed PDOStatement::getColumnMeta ( int column )
	 */
	public function getColumnMeta($column) {
		return $this->pdoStmt->getColumnMeta($column);
	}
	/**
	 * bool PDOStatement::nextRowset ( )
	 */
	public function nextRowset() {
		return $this->pdoStmt->nextRowset();
	}
	/**
	 * int PDOStatement::rowCount ( )
	 */
	public function rowCount() {
		return $this->pdoStmt->rowCount();
	}
	/**
	 * bool PDOStatement::setAttribute ( int attribute, mixed value )
	 */
	public function setAttribute($attribute, $value) {
		return $this->pdoStmt->setAttribute($attribute, $value);
	}
	/**
	 * bool PDOStatement::setFetchMode ( int mode )
	 */
	public function setFetchMode($mode) {
		return $this->pdoStmt->setFetchMode($mode);
	}
 }
?>
