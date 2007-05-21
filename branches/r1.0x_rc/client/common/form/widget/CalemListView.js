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
 * This is the base CalemListView widget. 
 * Input: column list, colums to display, dataset and its controller
 * Events: see DwtListView
 */
function CalemListView(parent, className, posStyle, tableDd, customInfo, controller, noMaximize) {
	this._tableDd=tableDd;
	this._controller = controller;
	this._setupByCustomInfo(customInfo);
	this._colActionListener = new AjxListener(this, this.colActionEvent);
	posStyle = posStyle || DwtControl.ABSOLUTE_STYLE;
	DwtListView.call(this, parent, className, posStyle, this._headerList, noMaximize);
	//Setting up action menu
	this._setupActionMenu();
	//Now make room for Scrollbar.
	this._createListView();
	//padding for ie
	this._ieWidthPadding=CalemConf['widget_listview']['ieWidthPadding'];
}

CalemListView.prototype = new DwtListView;
CalemListView.prototype.constructor = CalemListView;

CalemListView.prototype.toString = 
function() {
	return "CalemListView";
}

/**
 * Set up by customInfo:
 * - Header list
 * - Action menu
 * @param customInfo includes acl and customInfo.
 */
CalemListView.prototype._setupByCustomInfo =
function(customInfo) {
	//Prepare customInfo
	var acl=customInfo.acl;
	var listInfo=customInfo.listInfo.getColList();
	//build a map of currentView first.
	this._headerListMap =new Object();
	this._customColMap=new Object();
	this._headerList = new Array();
	for (var i=0; i< listInfo.length; i++) {
		var col=listInfo[i];
		if (acl[col.getId()]) continue; //skip fields that in the acl.
		this._customColMap[col.getId()]=col;
		this._addColumn(col.getId(), this._headerList, true);
	}
	//Now figure out which field to add to the available column list
	var fieldList=this._tableDd.getFields();
	for (var i in fieldList) { //Each field is an object.
		if (acl[i] || this._customColMap[i]) continue; //check Acl, exclude visible fields.
		this._addColumn(i, this._headerList, false);
	}
}

	
CalemListView.prototype._addColumn =
function(fld, headerList, visible) {
	//All fields are resizable/sortable
	var lb=this._tableDd.getFieldLabel(fld);
	var width= this._customColMap[fld] ? this._customColMap[fld].getWidth() : null;
	this._headerListMap[fld]= new CalemListHeaderItem(fld, lb, null, width, true, true, visible, null);
	headerList[headerList.length]=this._headerListMap[fld];
}

CalemListView.prototype._setupActionMenu =
function() {
	//setup menu stuff
	if (this._actionMenu) {//release it.
		this._actionMenu.dispose(); //so this is reentrable.		
	}
	//Now creating menu based on headerList
	this._actionMenu = new CalemListViewActionMenu(this);
	for (var i=0; i< this._headerList.length; i++) {
		this._addMenuItem(this._headerList[i]);
	}
}

CalemListView.prototype._addMenuItem =
function(col) {
	var mi = this._actionMenu.createMenuItem(col._field, null, col._label, null, true, DwtMenuItem.CHECK_STYLE);
	mi.setData(CalemWidget.DATA, col._field);
	this._actionMenu.addSelectionListener(col._field, this._colActionListener);
	mi.setChecked(col._visible, true); //To skip notify.
}

/**
 * Fields for listView changed
 * @param - field added or removed.
 * Actions:
 * a) Added: add field to the list;
 * b) Removed: remove field from list; if field is displayed repaint the grid.
 * 
 */
CalemListView.prototype.__onFieldChange =
function(nodeChange) {
	if (nodeChange.op == CalemConst._NODE_ADDED) {
		this._addColumn(nodeChange.id, this._headerList, false);
		this._addMenuItem(this._headerListMap[nodeChange.id]);
	} else {//to decide if repaint is necessary.
		var repaint=this._headerListMap[nodeChange.id]._visible;
		//Remove from headerListMap, headerList and actionMenu
		this._actionMenu.removeMe(nodeChange.id, this._colActinLstener);
		delete this._headerListMap[nodeChange.id];
		for (var i=0; i< this._headerList.length; i++) {
			if (this._headerList[i]._field==nodeChange.id) {
				this._headerList.splice(i, 1);
				break;
			}
		}
		//Repaint if necessary
		if (repaint) {
			this._relayout();
		}
	}
}

CalemListView.prototype._relayout =
function() {
	if (this._getVisibleFieldCount()==0 && this._headerList.length > 0) {
		this._headerList[0]._visible=true;
		this._actionMenu.setChecked(this._headerList[0]._field, true);
	}
	DwtListView.prototype._relayout.call(this);
}

CalemListView.prototype.__canRemoveField =
function() {
	return (this._headerList.length > 1);
}

CalemListView.prototype._getVisibleFieldCount =
function(fld) {
	var count=0;
	for (var i in this._headerListMap) {
		count = (this._headerListMap[i]._visible) ? count+1 : count;
	}
	return count;
}

/**
 * Recreate list view to make room for scrollbar
 */
CalemListView.prototype._createListView =
function() {
	//Use a table for the data view layout.
	var el = this.getHtmlElement(); //This element's html element
	el.removeChild(this._listDiv);
	//Replace the listview area with a table
	this._listViewId=Dwt.getNextId();
	this._scrollBarId=Dwt.getNextId();
	var div=document.createElement('div');
	div.innerHTML=
	    ["<table border=0 cellspacing=0 cellpadding=0 class=CalemListViewTable>",
		 "<tr class=CalemListViewTableTr><td class=CalemListViewTableDataTd id=", this._listViewId, "></td>",
		     "<td class=CalemListViewTableScrollBarTd id=", this._scrollBarId, "></td></tr>","</table>"].join('');
	el.appendChild(div);
	//Relink listDiv
	this._listViewEl=document.getElementById(this._listViewId);
	this._listViewEl.appendChild(this._listDiv);
	this._scrollBarEl=document.getElementById(this._scrollBarId);
}
	
// Public functions

/**
 * Functions for ScrollBar to figure out its position
 */
CalemListView.prototype.getListWidth =
function() {
	var bz=Dwt.getSize(this._listDiv);
	return bz.x;
}

CalemListView.prototype.getHeaderHeight =
function() {
	var bz=Dwt.getSize(this._listColDiv);
	return bz.y;
}
 
/**
 * Provide the element for linking in scrollbar
 */
CalemListView.prototype.getScrollBarEl =
function() {
	return this._scrollBarEl;
}

/**
 * Get header list
 */
CalemListView.prototype.getHeaderList =
function() {
	return this._headerList;
} 

/**
 * Navigation functions for list view scrolling.
 */
/**
 * A hack to get the row height to determine how many rows to display
 * in the list view.
 */
CalemListView.prototype.__getHeightByData =
function(pageData) {
	this.set(pageData);
	//the height of the data presented here.
   return this._getBoundsByItem(pageData.get(0));
} 

CalemListView.prototype._getBoundsByItem =
function(item) {
	var el=this._getElFromItem(item);
	return Dwt.getBounds(el);
}

/**
 * Is the last frame of data is in the listView?
 */
CalemListView.prototype.isPageDisplayed =
function(pageData) {
	var rtn=(this._list && pageData.size()==this._list.size());
	if (rtn) {
		for (var i=0; i< pageData.size(); i++) {
			if (pageData.get(i).id != this._list.get(i).id) {
				rtn=false;
				break;
			}
		}
	}
	return rtn;
} 

/**
 * provide view bounds for size estimation.
 */
CalemListView.prototype.__getViewBounds =
function() {
	return Dwt.getBounds(this._listDiv);
}

/**
* Fills the list view with the gien data.
*
* @param list		a DvItemList or a AjxVector of items
*/
CalemListView.prototype.set =
function(list, sort) {
	DwtListView.prototype.set.call(this, list, sort);
}

// Private functions

// Called by DwtListView to draw a row representing a single item.
CalemListView.prototype._createItemHtml =
function(item) {

	var	div = document.createElement("div");
	var base = "Row";
	div._styleClass = base;
	div._selectedStyleClass = [base, DwtCssStyle.SELECTED].join("-");	// Row-selected

	this.associateItemWithElement(item, div, DwtListView.TYPE_LIST_ITEM);
	div.className = div._styleClass;

	var htmlArr = new Array();
	var idx = 0;
	
	// Table
	htmlArr[idx++] = "<table cellpadding=0 cellspacing=0 border=0";
	htmlArr[idx++] = this._noMaximize ? ">" : " width=100%>";
	
	// Row
	htmlArr[idx++] = "<tr id='" + item.id + "'>";
	//Get tableDd
	var tableDd=item.getTableDd();
	
	// Data
	for (var j = 0; j < this._headerList.length; j++) {
		var col = this._headerList[j];
		if (!col._visible)
			continue;
		
		htmlArr[idx++] = "<td";
		// IE misbehaves w/ the box model so we correct ourselves
		var width = AjxEnv.isIE ? (col._width + this._ieWidthPadding) : col._width;
		htmlArr[idx++] = width ? (" width=" + width + ">") : ">";
		// add a div to force clipping (TD's dont obey it)
		htmlArr[idx++] = "<div";
		//A few layout improvement: a) checkbox for boolean; b) numerical right alignment
		htmlArr[idx++] = [" class=CalemListViewCol_", tableDd.getNormalizedType(col._field)].join('');
		htmlArr[idx++] = width ? " style='width: " + width + "'>" : ">";
		//A few layout improvement: a) checkbox for boolean; b) numerical right alignment
		if (tableDd.isBooleanField(col._field)) {
			if (item.getValue(col._field)) {
				htmlArr[idx++]="<input type='checkbox' onclick='this.checked=true' checked>";   
			} else {
				htmlArr[idx++]="<input type='checkbox' onclick='this.checked=false'>";
			}
			htmlArr[idx++] = "</div></td>";
		} else {
			var value = item.getValue(col._field);
			htmlArr[idx++] = value ? value + "</div></td>" : "</div></td>";
		}
	}

	htmlArr[idx++] = "</tr></table>";
	
	div.innerHTML = htmlArr.join("");
	return div;
}

CalemListView.prototype.resetHeight = 
function(newHeight) {
	this.setSize(Dwt.DEFAULT, newHeight);
	Dwt.setSize(this._parentEl, Dwt.DEFAULT, newHeight);
	this._resetColWidth();
}

CalemListView.prototype.setParentTabView = 
function(tabView) {
	this._parentTabView = tabView;
}

/*
CalemListView.prototype._getParentForColResize = 
function() {
	return this._parentTabView;
}
* */

CalemListView.prototype._sortColumn = 
function(columnItem, ascending) {
	this._controller.sortList(columnItem._field, ascending);
}

CalemListView.prototype._getActionMenuForColHeader = 
function() {
	return this._actionMenu;
}

CalemListView.prototype.colActionEvent = 
function(ev) {
	var menuItemId = ev.item.getData(CalemWidget.DATA);
	this._headerListMap[menuItemId]._visible= !this._headerListMap[menuItemId]._visible;
	//Make sure we have a default length if it's just set to visible.
	if (this._headerListMap[menuItemId]._visible) this._setColWidth(menuItemId);
	this._relayout();
}

CalemListView.prototype._setColWidth = 
function(colId) {
	if (this._headerListMap[colId]._width==null) {//Let's get a default width.
		this._headerListMap[colId]._width=this._tableDd.getWidth(colId);
	}
}

/**
 CalemListHeaderItem
 */
function CalemListHeaderItem(id, label, iconInfo, width, sortable, resizeable, visible, name) {
	DwtListHeaderItem.call(this, id, label, iconInfo, width, sortable, resizeable, visible, name);
	this._field=id;
}

CalemListHeaderItem.prototype = new DwtListHeaderItem;
CalemListHeaderItem.prototype.constructor = CalemListHeaderItem;

CalemListHeaderItem.prototype.toString = 
function() {
	return "CalemListHeaderItem";
}


/**
 * CalemListViewActionMenu
 */
function CalemListViewActionMenu(parent, className, dialog) {
	if (arguments.length == 0) return;
	className = className || "CalemListViewActionMenu";
	DwtMenu.call(this, parent, DwtMenu.POPUP_STYLE, className, null, dialog);
	this._menuItems = new Object();
}

CalemListViewActionMenu.prototype = new DwtMenu;
CalemListViewActionMenu.prototype.constructor = CalemListViewActionMenu;

CalemListViewActionMenu.prototype.toString = 
function() {
	return "CalemListViewActionMenu";
}

CalemListViewActionMenu.prototype.addSelectionListener =
function(menuItemId, listener) {
	this._menuItems[menuItemId].addSelectionListener(listener);
}

CalemListViewActionMenu.prototype.removeSelectionListener =
function(menuItemId, listener) {
	this._menuItems[menuItemId].removeSelectionListener(listener);
}

CalemListViewActionMenu.prototype.createMenuItem =
function(menuItemId, imageInfo, text, disImageInfo, enabled, style, radioGroupId) {
	var mi = this._menuItems[menuItemId] = new DwtMenuItem(this, style, radioGroupId);
	if (imageInfo)
		mi.setImage(imageInfo);
	if (text)
		mi.setText(text);
	if (disImageInfo)
		mi.setDisabledImage(disImageInfo);
	mi.setEnabled(enabled !== false);
	return mi;
}

CalemListViewActionMenu.prototype.createSeparator =
function() {
	new DwtMenuItem(this, DwtMenuItem.SEPARATOR_STYLE);
}

CalemListViewActionMenu.prototype.removeMe =
function(menuItemId, listener) {
	this.removeSelectionListener(menuItemId, listener);
	this._menuItems[menuItemId].dispose();
	delete this._menuItems[menuItemId];
}

CalemListViewActionMenu.prototype.setChecked =
function(menuItemId, checked) {
	this._menuItems[menuItemId].setChecked(checked, true);
}

