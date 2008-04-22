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
require_once _CALEM_DIR_ . 'server/modules/report/widget/report/ReportListView.php';
require_once _CALEM_DIR_ . 'server/include/util/CalemReportUtil.php';

/**
 * Ported and simplified from web client.
 */
class CalemListView extends ReportListView {
	protected $tableDd;
	protected $customInfo;
	protected $controller;
	
	protected $headerList;
	protected $headerListMap;
	protected $customColMap;
	
	protected $ieWidthPadding;
	 
	public function CalemListView($className, $posStyle, $tableDd, $customInfo, $controller, $noMaximize=true) {
		$this->tableDd=$tableDd;
		$this->controller = $controller;
		$this->setupByCustomInfo($customInfo);
		parent::ReportListView($className, $posStyle, $this->headerList, $noMaximize);
		//padding for ie
		$this->ieWidthPadding=4;
	}
	
	/**
	 * Set up by customInfo:
	 * - Header list
	 * - Action menu
	 * @param customInfo includes acl and customInfo.
	 */
	public function setupByCustomInfo($customInfo) {
		//Prepare customInfo
		$acl=$customInfo['acl'];
		$listInfo=$customInfo['listInfo']->getColList();
		//build a map of currentView first.
		$this->headerListMap =array();
		$this->customColMap=array();
		$this->headerList = array();
		//Allocating width based on total width minus a margin.
		$tot=0;
		foreach ($listInfo as $col) {
			$tot += $col->getWidth();				
		}
		foreach ($listInfo as $col) {
			if ($acl[$col->getId()]) continue; //skip fields that in the acl.
			$w=CalemReportUtil::getColWidth($tot, $col->getWidth());
			$col->setWidth($w);
			$this->customColMap[$col->getId()]=$col;
			$this->addColumn($col->getId(), true);
		}
	}
	
		
	public function addColumn($fld, $visible) {
		//All fields are resizable/sortable
		$lb=$this->tableDd->getFieldLabel($fld);
		$width= $this->customColMap[$fld] ? $this->customColMap[$fld]->getWidth() : null;
		$this->headerListMap[$fld]= $this->getHeaderItem($fld, $lb, null, $width, false, false, $visible, null);
		array_push($this->headerList, $this->headerListMap[$fld]);
	}
	

	public function set($list, $sort=null) {
		return parent::set($list, $sort);
	}
	
	// Called by DwtListView to draw a row representing a single item.
	public function createItemHtml($item, $style) {
		$doc='';
		// Data
		foreach ($this->headerList as $col) {
			if (!$col['visible']) continue;
			
			$doc .= "<td class=CalemListView-DataTd ";
			// IE misbehaves w/ the box model so we correct ourselves
			//var width = AjxEnv.isIE ? (col._width + $this->ieWidthPadding) : col._width;
			//htmlArr[idx++] = width ? (" width=" + width + ">") : ">";
			$doc .= ' width=' . $col['width'] . '>';
			// add a div to force clipping (TD's dont obey it)
			$doc .= "<div";
			//A few layout improvement: a) checkbox for boolean; b) numerical right alignment
			$doc .= " class=CalemListViewCol_" . $this->tableDd->getNormalizedType($col['field']);
			$doc .= $col['width'] ? " style='width: " . $col['width'] . "'>" : ">";
			// htmlArr[idx++] = width ? " style='width: " + width + "'>" : ">";
			//A few layout improvement: a) checkbox for boolean; b) numerical right alignment
			if ($this->tableDd->isBooleanField($col['field'])) {
				if ($item->getValue($col['field'])) {
					$doc .="<input type='checkbox' onclick='this.checked=true' checked>";   
				} else {
					$doc .="<input type='checkbox' onclick='this.checked=false'>";
				}
				$doc .= "</div></td>";
			} else {
				$value = $item->getValue($col['field']);
				$doc .= $value ? $value . "</div></td>" : "&nbsp;</div></td>";
			}
		}		
		return $doc;
	}
	
	/**
	 CalemListHeaderItem
	 */
	public function getHeaderItem($id, $label, $iconInfo, $width, $sortable, $resizeable, $visible, $name) {
		return array(
			'id'=>$id,
			'label'=>$label,
			'iconInfo'=>$iconInfo,
			'width'=>$width,
			'sortable'=>$sortable,
			'resizeable'=>$resizeable,
			'visible'=>$visible,
			'name'=>$name,
			'field'=>$id		
		);
	}
}
?>