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

require_once _CALEM_DIR_ . 'server/include/log4php/LoggerManager.php';

class CalemReportRender {
	protected $doc;
	protected $logger;
	
	protected $id;
	protected $info;
	
	protected $layout;
	protected $customInfo;
	protected $controller;
	protected $tableDd;
	
	public function __construct($id, $rptInfo, $controller) {
		$this->id=$id;
		$this->info=$rptInfo;
		$this->layout=$rptInfo->getLayout();
		$this->controller=$controller;
		$this->logger=&LoggerManager::getLogger('CalemReportRender');
		$this->doc='';
	}
	
	/**
	 * A div around a report segment.
	 */
	public function startDiv() {
		return "<div class=" . $this->getDivCcs() . ">";
	}
	
	public function endDiv() {
		return '</div>';
	}
	
	public function startTable() {
		return "<table class=" . $this->getTableCcs() . ">";
	}
	
	public function endTable() {
		return '</table>';
	}
	
	public function startRow() {
		return '<tr>';
	}
	
	public function endRow() {
		return '</tr>';
	}
	
	public function startCol($colSpan=1, $class=null) {
		$class= $class ? $class : 'CalemReportCol';
		return '<td class=' . $class . ' ' . ($colSpan > 1 ? ' cosSpan=' . $colSpan : '') . ">";	
	}
	
	public function endCol() {
		return '</td>';	
	}
	
	public function getDivCcs() {
		return 'CalemReportDiv';	
	}
	
	public function getTableCcs() {
		return 'CalemReportTable';	
	}
	
	public function append($str) {
		$this->doc .= $str;	
	}
	
	/**
	 * Use custom rows if any
	 */
	public function getLayoutRows() {
		return ($this->customInfo && $this->customInfo->getLayout()) ? 
					$this->customInfo->getLayout()->getViewLayout() : $this->layout->getRows();
	}
	
	/**
	 * Rendering
	 */
	public function render($customInfo) {
		$this->customInfo=$customInfo;
		$this->tableDd=$this->controller->getModelItem()->getTableDd();
		
		$this->append($this->startDiv());
		$this->append($this->startTable());
		
		$this->colCount= $this->layout->getColLayout()->getColCount();
		//Consider customization
		$rows=$this->getLayoutRows();
		foreach ($rows as $row) {
			if ($this->rowToSkip($row)) continue; //toolbar, errorInfo, etc. not to render for report.
			
			$this->append($this->startRow());			
			$cols = $row->getCols();
			//Re-arrange cols so colspan is used
			$rvs=array_reverse($cols);
			$ar=array();
			$span=0;
			foreach ($rvs as $col) {
				if ($col=='CalemColDesign') $span++;
				else {
					$ar[]=array('col'=>$col, 'colSpan'=>$span+1);
					$span=0;
				}
			}
			$ar=array_reverse($ar);
			//render consolidated cols.
			foreach ($ar as $col) {
				$cid=$col['col'];
				$this->append($this->startCol($col['colSpan']));				
				$this->renderOneItem($cid);
				$this->append($this->endCol());
			}
			
			$this->append($this->endRow());
		}
		
		$this->append($this->endTable());
		$this->append($this->endDiv());
		return $this->doc;
	}
	
	public function renderOneItem($cid, $checkAcl=true) {
		if ($checkAcl && !$this->checkViewAcl($cid)) return;
		
		$itemInfo=CalemReportUtil::getItemInfo($cid, $this->info, $this->tableDd);	
		$impl=$this->controller->getReportRender($itemInfo); //Created an instance
		if (!$impl) {
			$this->logger->error("Error in locating render for: " . var_export($itemInfo, true));
		}
		$render=CalemReportUtil::getRenderInstance($impl);
		//Init the render
		$render->init($cid, $itemInfo, $this->controller);
		$doc=$render->render();
		$this->append($doc);
	}
	
	/** 
	 * toolbar, errorInfo to skip
	 */
	public function rowToSkip($row) {
		global $_CALEM_conf;
		$skipItems=$_CALEM_conf['report_conf']['items_no_render'];
		$cols = $row->getCols();
		$skip=false;
		foreach ($cols as $col) {
			if (isset($skipItems[$col]) && $skipItems[$col]) {
				$skip=true;
				break;
			}
		}
		return $skip;
	}
	
	/**
	 * Check acl for a given id
	 * Assume access by default.
	 */
	public function checkViewAcl($id) {
		return ($this->customInfo) ? $this->customInfo->checkViewAcl($id) : true;
	}
	
	/**
	 * Provide reportInfo (or viewInfo)
	 */
	public function getViewInfo() {
		return $this->info;
	}	 
	
}
?>
