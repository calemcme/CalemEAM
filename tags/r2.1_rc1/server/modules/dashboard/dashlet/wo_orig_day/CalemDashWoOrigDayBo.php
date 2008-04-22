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

if (!defined('_CALEM_DIR_')) die("Access denied at ".__FILE__);

require_once _CALEM_DIR_ . 'server/modules/dashboard/CalemDashBo.php';

/**
 * dash_wo_orig_day service class
 */
class CalemDashWoOrigDayBo extends CalemDashBo {
	protected $dbo;
	protected $ddDbo;
	
	public function __construct() {
		parent::__construct();
		$this->dbo=CalemFactory::getDbo('dash_wo_orig_day');
		$this->ddDbo=CalemFactory::getDropdown('wo_origin');
 	}
 	
 	//Check for data changes
 	public function getDataChanged() {
 		$mt=filemtime($this->dataFile);
 		if (mktime() - $mt <= $this->conf['ttl']) return false;
 		$rtn=false;
 		try {
 			$stime=CalemText::getServerDateTime($mt);
 			$cnt=$this->dbo->getCountBySqlParam($this->getSqlCheck(), array($stime));
 			$rtn = ($cnt > 0);
 		} catch (CalemDboDataNotFoundException $e) {
 		}
 		return $rtn;
 	}
 	
 	public function getSqlCheck() {
 	 	return 'select count(*) from dash_wo_orig_day where modified_time > ?';
 	}
 	
	/**
	 * Update local data file - data collection for the report.
	 */
	public function generateChartData() {
		$conf=$this->conf['dash_wo_orig_day'];
		$limit=$conf['limit'];
		$startTime=strtotime($limit . " day ago"); //That's the info we need from there
		$startDate=CalemText::getServerDate($startTime);
		//First of all, let's get data out.
		$rtn=null;
		try {
			$rtn=$this->dbo->fetchBySqlParam('select * from dash_wo_orig_day where id >= ? order by id', array($startDate));
		} catch (CalemDboDataNotFoundException $e) {	
		}
		//Next let's prepare data for the charts
		$series="<xaxis>";
		$ddData=$this->ddDbo->getData();
		$graph=array();
		$grp=1;
		$xid=0;
		foreach ($ddData as $key=>$val) {
			$graph[$key]='<graph gid="' . $grp++ .'" ';
			if (isset($conf['graph_attrs'][$key])) {
				$graph[$key] .= $conf['graph_attrs'][$key];
			} else {
				$graph[$key] .= $conf['graph_attrs_default']; 
			}
			$graph[$key] .= ' title="' . KEY_PREFIX . $key . '" >';
		} 
		//Now walk through the data in steps.		
		$today=CalemText::getServerDate();
		for ($idx=0; $rtn && $idx < count($rtn); $idx++) {
			$dbDate=$rtn[$idx]['id'];
			while ($startDate < $dbDate) {
				list($series, $graph, $startDate, $startTime, $xid)=$this->unserializeOneDay($startDate, $startTime, $xid, null, $series, $graph);
			}
			list($series, $graph, $startDate, $startTime, $xid)=$this->unserializeOneDay($startDate, $startTime, $xid, $rtn[$idx]['counts'], $series, $graph);
		} 
		//Let's make sure we're done here
		while ($startDate <= $today) {
			list($series, $graph, $startDate, $startTime, $xid)=$this->unserializeOneDay($startDate, $startTime, $xid, null, $series, $graph);
		}
		//Now assemble the info together.
		$rtn='<chart>' . $series . '</xaxis> <graphs> ';
		foreach ($graph as $key=>$val) {
			$rtn .= $val . '</graph>' . "\n";	
		}
		$rtn .= '</graphs></chart>';
		file_put_contents($this->dataFile, $rtn);
	}
	
	public function unserializeOneDay($startDate, $startTime, $xid, $counts, $series, $graph) {
		$data= $counts ? unserialize($counts) : array();
		$series .= '<value xid="' . $xid . '">' . $startDate . '</value>' . "\n";
		foreach ($graph as $key=>$val) {
			$graph[$key] .= '<value xid="' . $xid . '">' . ($data[$key] ? $data[$key] : 0) . '</value>' . "\n";	
		}
		$xid++;
		$startTime=strtotime("+1 day", $startTime);
		$startDate=CalemText::getServerDate($startTime);
		return array($series, $graph, $startDate, $startTime, $xid);
	}
	
	public function getChartDataByLocale() {
		$cnts=file_get_contents($this->dataFile);
		$ddData=$this->ddDbo->getData();
		foreach ($ddData as $key=>$value) {
			$cnts=str_replace(KEY_PREFIX . $key, CalemMsg::getMsg($key), $cnts);
		}
		return $cnts;
	}
	
	//Data change listeners
	public function onDataInserted_CalemWoDbo($dataPkt) {
		$id=CalemText::datetimeToDate($dataPkt['baseData']['orig_time']);
		$orig=$dataPkt['baseData']['origin_id'];
		$this->incCount($id, $orig);
	}
	
	//Updated listener
	public function onDataUpdated_CalemWoDbo($dataPkt) {
		$old_id=CalemText::datetimeToDate($dataPkt['baseCurrent']['orig_time']);
		$old_orig=$dataPkt['baseCurrent']['origin_id'];
		$new_id=CalemText::datetimeToDate($dataPkt['baseUpdate']['orig_time'] ? $dataPkt['baseUpdate']['orig_time'] : $dataPkt['baseCurrent']['orig_time']);
		$new_orig=$dataPkt['baseUpdate']['origin_id'] ? $dataPkt['baseUpdate']['origin_id'] : $dataPkt['baseCurrent']['origin_id'];
		if ($old_id==$new_id && $old_orig==$new_orig) return; //No operation needed.
		if ($old_id && $old_orig) $this->decCount($old_id, $old_orig);
		if ($new_id && $new_orig) $this->incCount($new_id, $new_orig);
	}
	
	//Deleted listener
	public function onDataDeleted_CalemWoDbo($dataPkt) {
		$id=CalemText::datetimeToDate($dataPkt['baseData']['orig_time']);
		$orig=$dataPkt['baseData']['origin_id'];
		if ($id && $orig) $this->decCount($id, $orig);
	}
	
	//Utilities function
	// -add count
	// -dec count
	public function incCount($id, $orig) {
		$this->modifyCount($id, $orig, 1);
	}
	
	public function decCount($id, $orig) {
		$this->modifyCount($id, $orig, -1);
	}
	
	public function modifyCount($id, $orig, $count) {
		try {
			$row=$this->dbo->fetchById($id);
			if ($row['counts']) {
				$counts=unserialize($row['counts']);
				if (is_array($counts)) {
					$counts[$orig]=$counts[$orig]+$count;	
				} else {
					$counts[$orig]=$count;
				}
			} else {
				$counts[$orig]=$count;	
			}
			$counts[$orig]=max($counts[$orig],0);
			$this->dbo->setValue('counts', serialize($counts));
			$this->dbo->setIdForUpdate($id);
			$this->dbo->update();
		} catch (CalemDboDataNotFoundException $e) {
			$cnt=max($count, 0);
			$counts=array($orig=>$cnt);
			$this->dbo->setChangeBulk(array('id'=>$id, 'counts'=>serialize($counts)));
			$this->dbo->insert();
		}	
	}
}
?>
