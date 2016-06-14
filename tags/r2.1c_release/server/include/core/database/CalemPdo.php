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

//reference to CalemPDOStatement class
require_once _CALEM_DIR_ . 'server/include/core/database/CalemPDOStatement.php';
//debug util
require_once _CALEM_DIR_ . 'server/include/util/CalemDebug.php';

/**
 * This is the PDO class used by Calem. The purpose is to provide
 * instrumentation of database operation.
 */
 class CalemPdo extends PDO {
 	/**
 	 * Query monitoring
 	 */
 	private $monitor_query;
 	private $warning_time;
 	private $precision;
 	private $stmt_options;
 	/**
 	 * Transaction mgmt
 	 */
 	private $statck;
	//logger instance
	protected $logger;
 	
 	/**
	 * constructor
	 */
   public function __construct ($dsn, $username, $password, $driver_options=NULL) {
   	parent::__construct($dsn, $username, $password, $driver_options);
   	$this->logger=&LoggerManager::getLogger("CalemPdo");
   	$this->stack=array();
   	global $_CALEM_conf;
		$this->monitor_query=$_CALEM_conf['monitor_db_queries'];
		$this->warning_time=$_CALEM_conf['warning_db_query_time'];
		$this->precision=$_CALEM_conf['db_time_precision'];
		$this->stmt_options=$_CALEM_conf['db_stmt_driver_options'];
   }

 	/**
 	 * This function takes the same parameters as in PDO but returns a custom
 	 * statement object.
 	 * @param string sql
 	 * @param array driver_options
 	 * @return CalemPDOStatement
 	 * PDOStatement PDO::prepare(string statement [, array driver_options])
 	 */
 	public function prepare($sql, array $driver_options=NULL) {
 		if (!isset($driver_options)) {
 			$driver_options=$this->stmt_options;
 		}
 		$stmt=parent::prepare($sql, $driver_options);
 		$calemStmt=new CalemPDOStatement($sql, $stmt, $driver_options);
 		return $calemStmt;
 	} 	
 	/**
 	 * Query monitoring
 	 * PDOStatement PDO::query ( string statement )
 	 */
 	public function query($sql) {
 		if ($this->monitor_query > 0) {
			$time_start=microtime(true);
		}
		$result=parent::query($sql);
		if ($this->monitor_query >0) {
			$time_used=microtime(true) - $time_start;
			if ($time_used >= $this->warning_time) {
				$this->logger->warn("query() time:".round($time_used, $this->precision).', sql=' .$sql);
			} else if ($this->monitor_query >1) {
				$this->logger->debug("query() time:".round($time_used, $this->precision).', sql=' . $sql);
			}
		}
		return $result;
 	}
 	/**
 	 * Query monitoring
 	 * int PDO::exec ( string statement )
 	 */
 	public function exec($sql) {
 		if ($this->monitor_query > 0) {
			$time_start=microtime(true);
		}
		$result=parent::exec($sql);
		if ($this->monitor_query >0) {
			$time_used=microtime(true) - $time_start;
			if ($time_used >= $this->warning_time) {
				$this->logger->warn("exec() time:".round($time_used, $this->precision).', sql=' .$sql);
			} else if ($this->monitor_query >1) {
				$this->logger->debug("exec() time:".round($time_used, $this->precision).', sql=' . $sql);
			}
		}
		return $result;
 	}
 	/**
 	 * Transaction management
 	 */
 	/**
 	 * Start a transaction
 	 * The transaction chain is managed here so that the transaction will not be
 	 * restarted.
 	 */
 	public function beginTransaction() {
 		//Adding the method in.
 		if ($this->logger->isDebugEnabled()) {
 			$debug=debug_backtrace();
 			$caller=CalemDebug::getCaller($debug);
 			$callers=$callers=implode(',', $this->stack);
 		} else {
 			$caller='0';
 		}
 		array_push($this->stack,$caller);
 		if (count($this->stack)==1) {//Starting transaction
 			if ($this->logger->isDebugEnabled()) {
 				$this->logger->debug("Transaction started by " . $caller);
 			}
 			parent::beginTransaction();
 		} else {
 			if ($this->logger->isDebugEnabled()) {
 				$this->logger->debug("Transaction already started for ".$caller.' by '.$callers);
 			}
 		}
 	}	
 	
 	/**
 	 * Commit a transaction 
 	 * The transaction chain is managed here so that the transaction will not be
 	 * committed till the chain is backed up at the top. This allows transactions
 	 * to be chained together.
 	 */
 	public function commit() {
 		//Adding the method in.
 		if ($this->logger->isDebugEnabled()) {
 			$debug=debug_backtrace();
 			$caller=CalemDebug::getCaller($debug);
 		} else {
 			$caller='0';
 		}
 		//pop up a method
 		$lastCaller=array_pop($this->stack);
 		if (!isset($lastCaller)) {
 			$this->logger->error("Error in commit transaction: transaction stack is empty. Calling method=".$caller);
 			throw new TransactionSequenceException("CalemPDO - Commit error: transaction stack is empty.");
 		}
 		if (count($this->stack)==0) {//Commit the transaction now.
 			if ($this->logger->isDebugEnabled()) {
 				$this->logger->debug("Transaction committed by " . $caller);
 			}
 			parent::commit();
 		} else {
 			if ($this->logger->isDebugEnabled()) {
 				$callers=implode(',', $this->stack);
 				$this->logger->debug("Commit attempted by ".$caller.", remaining:" . $callers);
 			}
 		}
 	}	
 	
 	/**
 	 * Rollback a transaction 
 	 * The transaction chain is managed here so that rollback will clear the
 	 * transaction chain here.
 	 */
 	public function rollback() {
 		//Adding the method in.
 		if ($this->logger->isDebugEnabled()) {
 			$debug=debug_backtrace();
 			$caller=CalemDebug::getCaller($debug);
 		} else {
 			$caller='0';
 		}
 		//rollback will be performed anyway
 		if ($this->logger->isDebugEnabled()) {
			$callers=implode(',', $this->stack);
 			$this->logger->debug("Rollback called by ".$caller.", transaction stack=".$callers);
 		}
 		//Reset the transaction stack
 		$this->stack=array();
 		//Rollback
 		parent::rollback();
 	}	
 	
 	/**
 	 * Transaction detection
 	 */
 	public function inTransaction() {
 		return (count($this->stack)>0);
 	}
 }
?>
