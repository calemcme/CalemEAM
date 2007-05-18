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

//Base CalemDao
require_once _CALEM_DIR_ . 'server/include/core/database/CalemDbo.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';

class CalemMeterTransactionDbo extends CalemDbo {	
	//Business logic when data insertion is done.	
	public function onDataInserted($id, $baseTable, $baseData, $customTable, $customData) {
		//Get asset meter's DBO
		$meterDbo=CalemFactory::getDbo('asset_meter');
		//Get meter rec.
		$mtRec=$meterDbo->fetchById($baseData['meter_id']);
		if ($baseData['time_taken'] > $mtRec['time_taken']) {
			$ar=array();
			$ar['time_taken']=$baseData['time_taken'];
			$ar['reading']=$baseData['reading'];
			$ar['is_rollover']=$baseData['is_rollover'];
			if ($baseData['is_rollover']) $ar['rollover_count'] = $mtRec['rollover_count']+1;
			$meterDbo->setChangeBulk($ar);
			$meterDbo->setIdForUpdate($baseData['meter_id']);
			$meterDbo->update();	
		}
	}
	
	//Overwrite deletion to collect meter_id info.
	public function beforeDelete() {
		$this->loadRecord();
	}
	
	//Business logic when data deletion is done.	
	public function onDataDeleted($table, $id) {
		//Get the latest reading
		$clear=false;
		try {
			$sql="select * from meter_transaction where meter_id= ? order by time_taken DESC";
			$mrs=$this->fetchBySqlParam($sql, $this->row['meter_id'], true);
			$mrRec=$mrs[0];
		} catch (CalemDboDataNotFoundException $nd) {
			$clear=true;
			if ($this->logger->isDebugEnabled()) $this->logger->info("No meter reading for $table and meter: " . $this->row['meter_id'] . ", to clear reading");	
		}
		
		//Get asset meter's DBO
		$meterDbo=CalemFactory::getDbo('asset_meter');
		//Get meter rec.
		$mtRec=$meterDbo->fetchById($this->row['meter_id']);
		$ar=array();
		if ($mtRec['is_rollover']) $ar['rollover_count']=max(0, $ar['rollover_count']-1);
		if ($clear) {
			$ar['time_taken']=null;
			$ar['reading']=null;
			$ar['is_rollover']=null;
		} else {
			$ar['time_taken']=$mrRec['time_taken'];
			$ar['reading']=$mrRec['reading'];
			$ar['is_rollover'] = $mrRec['is_rollover'];	
		}
		$meterDbo->setChangeBulk($ar);
		$meterDbo->setIdForUpdate($this->row['meter_id']);
		$meterDbo->update();
	}
}
