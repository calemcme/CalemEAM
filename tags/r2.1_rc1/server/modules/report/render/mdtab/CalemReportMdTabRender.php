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

require_once _CALEM_DIR_ . 'server/modules/report/render/CalemUiRender.php';
require_once _CALEM_DIR_ . 'server/modules/report/render/mdtab/CalemReportTabRender.php';

/**
 * CalemViewMdTabRender
 *  
 * This is the master detail tab view render.
 */
class CalemReportMdTabRender extends CalemUiRender {
	protected $customInfo;
	 
	function CalemReportMdTabRender($id, $fmInfo, $controller, $customInfo) {
		parent::init($id, $fmInfo, $controller);
		$this->customInfo=$customInfo;
	}
	
	/**
	 * Acl checking
	 */
	public function checkTabAcl($tabId) {
		return ($this->customInfo ? $this->customInfo->checkTabAcl($tabId) : true);
	} 
	
	/**
	 * MdTab views
	 */
	public function render($mRec) {
		$doc='';
		//Getting layout info
		$layout = ($this->customInfo && $this->customInfo->getLayout()) ? $this->customInfo->getLayout() : $this->info->getLayout();
		$tabList=$layout->getTabList();
		foreach ($tabList as $tabId) {
			if (!$this->checkTabAcl($tabId)) continue;
			if ($tabId==TAB_CUSTOMIZE) continue;
			
			$tabRender=new CalemReportTabRender($this->id, $this->info, $this->controller, $this->customInfo, $layout, $tabId, $mRec);
			$doc= $tabRender->render();
		}
		return $doc;
	}	
}
?>
