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

//required classes
require_once _CALEM_DIR_ . 'server/include/core/database/CalemDbo.php';

/**
 * This is base database object (Dbo). Dbo services will provide:
 * <ul>
 * <li> DD information
 * <li> Database operations
 * </ul>
 */
 class CalemRecycleBinDbo extends CalemDbo { 	
 	/**
 	 * Set deleted info - no parent detail relationship.
 	 */
 	public function setDeletedInfo($table, array $row, $idName) {
 		$this->setValue('table_name', $table);
 		$this->setRecId($row[$idName]);
 		$this->setValue('value_deleted', serialize($row));	
 	}
 	
 	/**
 	 * set description
 	 */
 	public function setDescription($desc) {
 		$this->setValue('description', $desc);	
 	} 
 	
 	/**
 	 * Set record id
 	 */
 	public function setRecId($id) {
 		$this->setValue('rec_id', $id);	
 	}
 	
 	public function getRecId($id) {
 		return $this->row['rec_id'];	
 	}
 	
 	/**
 	 * Fetch by record Id
 	 */
 	public function fetchByRecordId($id) {
 		$sql="select * from recycle_bin where table_name = ? and rec_id= ?";	
 		return $this->fetchBySqlParam($sql, array($this->tableName, $id));
 	}
 	
 	public function getCountByRecordId($id) {
 		$sql="select count(*) from recycle_bin where rec_id= ?";	
 		return $this->getCountBySqlParam($sql, $id);
 	}
 }

?>
