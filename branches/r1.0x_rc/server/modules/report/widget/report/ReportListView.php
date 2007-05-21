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
 
/**
 * Ported and simplified from DwtListView for report rendering.
 */

//Checking basic initialization
if (!defined('_CALEM_DIR_')) die("Access denied at ".__FILE__);

require_once _CALEM_DIR_ . 'server/include/log4php/LoggerManager.php';

class ReportListView {
	protected $logger;
	protected $headerDoc;
	protected $listViewDoc;
	
	protected $noMaximize;
	protected $headerList;
	
	protected $list;
	protected $offset;
	protected $headerColCreated;
	
	public function ReportListView($className, $posStyle, $headerList, $noMaximize) {
		$this->headerDoc='';
		$this->listViewDoc='';
		
		$this->noMaximize=$noMaximize;
		$this->headerList=$headerList; 
		
		$this->list = null;
		$this->offset = 0;
		$this->headerColCreated = false;
		
		$this->logger=&LoggerManager::getLogger('ReportListView');
	}
	
	const HEADERITEM_HEIGHT 	= 24;
	const HEADERITEM_ARROW  	= "arr--";
	const HEADER_ID			= "crr--";
	const HEADERITEM_LABEL 	= "drr--";
	
	const TYPE_HEADER_ITEM 	= "1";
	const TYPE_LIST_ITEM 		= "2";
	const TYPE_HEADER_SASH 	= "3";
	
	const DEFAULT_LIMIT = 25;
	const MAX_REPLENISH_THRESHOLD = 10;
	const MIN_COLUMN_WIDTH = 10;
	const COL_MOVE_THRESHOLD = 3;
	
	public function createHeaderHtml($defaultColumnSort=null) {
	
		// does this list view have headers or have they already been created?
		if (!$this->headerList || $this->headerColCreated)
			return;
		
		$doc = $this->headerDoc;
		/** Do not use 100% height
		var htmlArr = new Array();
		$this->headerTableId = DwtListView.HEADER_ID + Dwt.getNextId();
	
		htmlArr[idx++] = "<table id='" + $this->headerTableId + "' cellpadding=0 cellspacing=0 border=0 height=100%";
		*/
		/* $doc .= "<table class=ReportListViewHeaderTable cellpadding=0 cellspacing=0 border=0 height=100%"; */
		$doc .= "<table class=ReportListViewTable cellpadding=0 cellspacing=0 border=0";
		$doc .= $this->noMaximize ? ">" : " width=100%>";
		$doc .= "<tr class=ReportListViewHeaderTr>";
		foreach ($this->headerList as $headerCol) {
			if (!$headerCol['visible'])
				continue;
				
			$doc .= "<td class='";
			$doc .= "DwtListView-Column'";
			$doc .= $headerCol['width'] ? " width=" . $headerCol['width'] . ">" : ">";
			// must add a div to force clipping :(
			$doc .= "<div class=DwtListView-ColumnDiv " . ($headerCol['width'] ? " style='width:" . $headerCol['width'] . "'>" : ">");
			$doc .= '&nbsp;' . $headerCol['label'];
			$doc .= "</div></td>";
		}
		$doc .= "</tr>";
		
		$this->headerColCreated = true;
		return $doc;
	}
	
	/**
	* Creates a list view out of the given vector of items. The derived class should override _createItemHtml()
	* in order to display an item.
	*
	* @param list	a vector of items (AjxVector)
	* @param defaultColumnSort	default column field to sort (optional)
	*/
	public function set($list, $defaultColumnSort) {
		//$this->resetList();
		$this->list = $list;
		return $this->setUI($defaultColumnSort); //doc rendering.
	}
	
	/**
	* Renders the list view using the current list of items.
	*
	* @param defaultColumnSort		[string]	ID of column that represents default sort order
	* @param noResultsOk			[boolean]*	if true, don't show "No Results" for empty list
	*/
	public function setUI($defaultColumnSort, $noResultsOk=true) {
		$docHeader = $this->createHeaderHtml($defaultColumnSort);
		$docList=$this->renderList($this->list, $noResultsOk);
		return $docHeader . $docList;
	}
	
	public function renderList($list, $noResultsOk) {
		$doc = $this->listViewDoc;
		if ($list) {
			$i=0;
			foreach ($list as $item) {
				$style= ($i++ % 2 ==0) ? '-EVEN' : '-ODD';
				$doc .="<tr class=ReportListViewDataTr" . $style . ">";
				$doc .= $this->createItemHtml($item, $style);
				$doc .="</tr>";
			}
		} else if (!$noResultsOk) {
			$this->setNoResultsHtml();
		}
		$doc .= '</table>';
		return $doc;
	}
	
	/**
	* Renders a single item as a DIV element.
	*
	* Default implementation creates a simple div with the innerHTML set to 
	* the string value of the item.
	*/
	public function createItemHtml($item, $now, $isDnDIcon) {
		/*
		var div = document.createElement("DIV");
		div.id = Dwt.getNextId();
		var rowClassName = AjxBuffer.concat($this->className, "Row");
		div._styleClass = AjxBuffer.concat("Row ",rowClassName);
		div._selectedStyleClass = AjxBuffer.concat("Row-", DwtCssStyle.SELECTED, " ", rowClassName);
		div._selectedDisabledStyleClass = AjxBuffer.concat("Row-", DwtCssStyle.SELECTED, "-" , DwtCssStyle.DISABLED, " ", rowClassName);
		div.className = div._styleClass;
		if (typeof(item) == "object") {
			div.innerHTML = AjxStringUtil.htmlEncode(item.toString());
		} else {
			div.innerHTML = AjxStringUtil.htmlEncode(String(item));
		}
		$this.associateItemWithElement(item, div, ReportListView.TYPE_LIST_ITEM);
		return div;
		*/
	}
	
	public function setNoResultsHtml() {
		/*
		var htmlArr = new Array(5);
		var	div = document.createElement("div");
		var idx = 0;
	
		htmlArr[idx++] = "<table width='100%' cellspacing='0' cellpadding='1'>";
		htmlArr[idx++] = "<tr><td class='NoResults'><br>";
		htmlArr[idx++] = AjxMsg.noResults;
		htmlArr[idx++] = "</td></tr></table>";
	
		div.innerHTML = htmlArr.join("");
	
		$this->addRow(div);
		*/
	}	
}
?>