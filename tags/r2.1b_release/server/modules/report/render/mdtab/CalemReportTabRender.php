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

/**
 * CalemViewMdRender
 *  
 * This is the master detail view render.
 */
class CalemReportTabRender extends CalemUiRender {
	private $customInfo;
	private $layout;
	private $tabId;
	private $mRec; 
	
	public function CalemReportTabRender($id, $fmInfo, $controller, $customInfo, $layout, $tabId, $mRec) {
		parent::init($id, $fmInfo, $controller);
		$this->customInfo=$customInfo;
		$this->layout=$layout;
		$this->tabId=$tabId;
		$this->mRec=$mRec;
		
	}
	
	public function render() {
		$doc='';
		$fmList=$this->layout->getTabItem($this->tabId)->getLayout();
		foreach ($fmList as $fmId) {
			if (!$this->customInfo->checkFormAcl($fmId)) continue;
			//Now find out the layout by fmId
			$fm=$this->info->getItem($fmId);
			//Now load data and decide what to do.
			$doc .= $this->controller->getFormModel()->render($fmId, $this->mRec, $fm->getMinRow());
		}
		return $doc;
	}
}
?>