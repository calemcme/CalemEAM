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

require_once _CALEM_DIR_ . 'server/modules/dashboard/dashlet/wo_orig_day/CalemDashWoOrigDayBo.php';

/**
 * dash_wo_orig_day service class
 */
class CalemDashWoOrigMdBo extends CalemDashWoOrigDayBo {
	
	public function __construct() {
		parent::__construct();
		$this->dbo=CalemFactory::getDbo('dash_wo_orig_md');
 	}
 	
 	public function getSqlCheck() {
 	 	return 'select count(*) from dash_wo_orig_md where modified_time > ?';
 	}
 	
	/**
	 * Update local data file - data collection for the report.
	 */
	public function generateChartData() {
		$conf=$this->conf['dash_wo_orig_md'];
		//First of all, let's get data out.
		$rtn=null;
		try {
			$rtn=$this->dbo->fetchBySql('select * from dash_wo_orig_md order by id');
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
		$thisMd=gmdate('Y-m-01');
		$startMd=null;
		for ($idx=0; $rtn && $idx < count($rtn); $idx++) {
			$dbMd=$rtn[$idx]['id'];
			if (!$startMd) {
				$startMd=$dbMd;	
				$startTime=CalemText::parseServerDate($startMd);
			} else {
				while ($startMd < $dbMd) {
					list($series, $graph, $startMd, $startTime, $xid)=$this->unserializeOneDay($startMd, $startTime, $xid, null, $series, $graph);
				}
			}
			list($series, $graph, $startMd, $startTime, $xid)=$this->unserializeOneDay($startMd, $startTime, $xid, $rtn[$idx]['counts'], $series, $graph);
		} 
		//Let's make sure we're done here
		if (!$startMd) {//No data points
			list($series, $graph, $startMd, $startTime, $xid)=$this->unserializeOneDay($thisMd, null, $xid, null, $series, $graph);
		} else {
			while ($startMd <= $thisMd) {
				list($series, $graph, $startMd, $startTime, $xid)=$this->unserializeOneDay($startMd, $startTime, $xid, null, $series, $graph);
			}
		}
			
		//Now assemble the info together.
		$rtn='<chart>' . $series . '</xaxis> <graphs> ';
		foreach ($graph as $key=>$val) {
			$rtn .= $val . '</graph>' . "\n";	
		}
		$rtn .= '</graphs></chart>';
		file_put_contents($this->dataFile, $rtn);
	}
	
	public function unserializeOneDay($startMd, $startTime, $xid, $counts, $series, $graph) {
		$data= $counts ? unserialize($counts) : array();
		$series .= '<value xid="' . $xid . '">' . $startMd . '</value>' . "\n";
		foreach ($graph as $key=>$val) {
			$graph[$key] .= '<value xid="' . $xid . '">' . ($data[$key] ? $data[$key] : 0) . '</value>' . "\n";	
		}
		$xid++;
		if ($startTime!=null) {
			$startTime=strtotime("1 month", $startTime);
			$startMd=gmdate('Y-m-01', $startTime);
		}
		return array($series, $graph, $startMd, $startTime, $xid);
	}
	
	public function getMdByServerDatetime($dt) {
		$dt=CalemText::parseServerDatetime($dt);
		return gmdate('Y-m-01', $dt);	
	}
	
	//Data change listeners
	public function onDataInserted_CalemWoDbo($dataPkt) {
		$id=$this->getMdByServerDatetime($dataPkt['baseData']['orig_time']);
		$orig=$dataPkt['baseData']['origin_id'];
		$this->incCount($id, $orig);
	}
	
	//Updated listener
	public function onDataUpdated_CalemWoDbo($dataPkt) {
		$old_id=$this->getMdByServerDatetime($dataPkt['baseCurrent']['orig_time']);
		$old_orig=$dataPkt['baseCurrent']['origin_id'];
		$new_id=$this->getMdByServerDatetime($dataPkt['baseUpdate']['orig_time'] ? $dataPkt['baseUpdate']['orig_time'] : $dataPkt['baseCurrent']['orig_time']);
		$new_orig=$dataPkt['baseUpdate']['origin_id'] ? $dataPkt['baseUpdate']['origin_id'] : $dataPkt['baseCurrent']['origin_id'];
		if ($old_id==$new_id && $old_orig==$new_orig) return; //No operation needed.
		if ($old_id && $old_orig) $this->decCount($old_id, $old_orig);
		if ($new_id && $new_orig) $this->incCount($new_id, $new_orig);
	}
	
	//Deleted listener
	public function onDataDeleted_CalemWoDbo($dataPkt) {
		$id=$this->getMdByServerDatetime($dataPkt['baseData']['orig_time']);
		$orig=$dataPkt['baseData']['origin_id'];
		if ($id && $orig) $this->decCount($id, $orig);
	}
}
?>
