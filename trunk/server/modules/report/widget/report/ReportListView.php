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
		}
	
	public function setNoResultsHtml() {
	}
	
	/**
	 * Render Excel File Download
	 */
	public function renderExcel($list, $controller) {
		require_once _CALEM_DIR_ . "server/include/Spreadsheet/Excel/Writer.php";

		//Create workbook
		$excel =& new Spreadsheet_Excel_Writer();
		//Create worksheet
		$st1 =& $excel->addWorksheet('sheet1');
      //Send HTTP headers to tell the browser what's coming
	   $excel->send($controller->getModelItem()->getTableName() . '.xls');
	
		//Get report title
		$titleText = $controller->getTitle();
		//Create a format object
		$titleFormat =& $excel->addFormat();
		// Set the font family - Helvetica works for OpenOffice calc too...
		$titleFormat->setFontFamily('Helvetica');
		// Set the text to bold
		$titleFormat->setBold();
		//Set the text size
		$titleFormat->setSize('13');
		//Set the text color
		$titleFormat->setColor('navy');
		//Set the bottom border width to "thick"
		$titleFormat->setBottom(2);
		//Set the color of the bottom border
		$titleFormat->setBottomColor('navy');
		//Set the alignment to the special merge value
		$titleFormat->setAlign('merge');
		//Add the title to the top left cell of the worksheet,
		//passing it the title string and the format object
		$st1->write(0,0,$titleText,$titleFormat);
		//Add three empty cells to merge with
		$st1->write(0,1,'',$titleFormat);
		$st1->write(0,2,'',$titleFormat);
		$st1->write(0,3,'',$titleFormat);
		//The row height
		//$st1->setRow(0,30);
		//Set the column width for the first 4 columns
		//$st1->setColumn(0,3,15);
	
		//Set column headers
		$colHeadingFormat =& $excel->addFormat();
		$colHeadingFormat->setBold();
		$colHeadingFormat->setFontFamily('Helvetica');
		$colHeadingFormat->setBold();
		$colHeadingFormat->setSize('10');
		$colHeadingFormat->setAlign('center');
		//An array with the data for the column headings
		$colNames = array();
		foreach ($this->headerList as $headerCol) {
			if (!$headerCol['visible'])
				continue;
			$colNames[]=$headerCol['label'];
		}
		//Add all the column headings with a single call
		//leaving a blank row to look nicer
		$st1->writeRow(2,0,$colNames,$colHeadingFormat);
	
		/**
		 * Exporting data
		*/
		//Use this to keep track of the row number
		$row = 4;	
		//Loop through the data, adding it to the sheet
		if ($list) {
			foreach ($list as $item) {
				$ar=array();
				foreach ($this->headerList as $col) {
					if (!$col['visible']) continue;
					$ar[]=array($col['label']=> $item->getValue($col['field']));
				}
				$st1->writeRow($row,0,$ar);
 				$row++;
			}
		}
		
		// Finish the spreadsheet, dumping it to the browser
		$excel->close();
	}	
}
?>
