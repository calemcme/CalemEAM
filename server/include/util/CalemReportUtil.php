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

require_once _CALEM_DIR_ . 'server/include/util/CalemJson.php';

class CalemReportUtil {
	
	public static function getUid() {
		return $GLOBALS['calem_ses_data']['id'];
	}
	
	public static function getGid() {
		return $GLOBALS['calem_ses_data']['acl_group_id'];
	}
	
	public static function getCustomReportById($id, $oid, $isUser) {
		$path=_CALEM_DIR_ . 'custom/' . ($isUser? 'user' : 'group') . '/' . $oid . '/converted/' . $id . '.phpo';
		if (!file_exists($path)) {
			$rtn=null;
		} else {
			$f=file_get_contents($path);
			$php=unserialize($f);
			$rtn=CalemJson::setJson($php);	
		}			
		return $rtn;
	}
	
	public static function getReportById($id, $mod) {
		$path=_CALEM_DIR_ . 'client/modules/' . $mod . '/form/report/converted/' . $id . '.phpo';
		return CalemReportUtil::getReportByPath($path);
	}
	
	public static function getReportDefById($id, $mod) {
		$path=_CALEM_DIR_ . 'client/modules/' . $mod . '/form/report/converted/' . $id . 'Def.phpo';
		return CalemReportUtil::getReportByPath($path);
	}
	
	public static function getReportByPath($path) {
		if (!file_exists($path)) {
			$rtn=null;
		} else {
			$f=file_get_contents($path);
			$php=unserialize($f);
			$rtn=CalemJson::setJson($php);	
		}			
		return $rtn;
	}
	
	//Width allocation based on total width
	public static function getColWidth($total, $width) {
		global $_CALEM_conf;
		$conf=$_CALEM_conf['report_conf']['report_size'];
		$pw=$conf['width']-$conf['x_margin'];
		$w= ceil($pw * $width/$total);
		return $w . $conf['unit'];	
	}
	
	/**
	 * Field label
	 */
	const FLD_LABEL='flb_' ;
	
	public static function getFieldLabel($fld) {
		return CalemViewUtil::FLD_LABEL . fld;
	}
	
	public static function isFieldLabel($lb) {
		return (strpos($lb, CalemReportUtil::FLD_LABEL)==0);
	}
	
	public static function getFieldFromLabel($lb) {
		return substr($lb, strlen(CalemReportUtil::FLD_LABEL));
	}
	
	public static function getItemInfo($id, $viewInfo, $tableDd) {
		$item=$viewInfo->getItem($id);
		if (!$item) {
			if ($tableDd->isField($id)) $item=$tableDd->getFieldInfo($id);
			else if (CalemReportUtil::isFieldLabel($id)) {
				$item=$tableDd->getFieldLabelInfo(CalemReportUtil::getFieldFromLabel($id));
			}
		}
		return $item;
	}
	
	public function getRenderInstance($renderAr) {
		require_once _CALEM_DIR_ . $renderAr['path'] . $renderAr['class'] . '.php';
		return new $renderAr['class'];	
	}
}
?>
