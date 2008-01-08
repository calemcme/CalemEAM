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
 * CalemDataGrid
 * The data grid is a controller that uses CalemListView and CalemScrollBar to view a data set.
 * It uses lazy caching to build up the data set so the data grid's performance is deterministic 
 * regardless of the data set size in the backend.
 * 
 */
function CalemDataGrid(parent, id, tableDd, customInfo, controller) {
	if (arguments.length == 0) return;
	CalemUiController.call(this, parent, id, tableDd, customInfo, controller);
	this._dataChangeListener = new AjxListener(this, this._onDataChanged);
	this._dataRefreshListener = new AjxListener(this, this._onDataRefresh);
}

CalemDataGrid.SELECTION_EVENTS= [CalemEvent.NO_SELECTION, CalemEvent.SINGLE_SELECTION, 
               CalemEvent.MULTI_SELECTION, CalemEvent.DBL_CLICK_SELECTION];

CalemDataGrid.prototype = new CalemUiController;
CalemDataGrid.prototype.constructor = CalemDataGrid;

CalemDataGrid.prototype.toString = 
function() {
	return "CalemDataGrid";
}

/**
 * Creating CalemDataGrid UI control.
 */
CalemDataGrid.prototype._createUiControl =
function() {
	this._listView=new CalemListView(this._parent, null, null, this._tableDd, 
				this._widgetInfo, this, this._widgetInfo.listInfo.getNoMaximize());				
	this._listView.zShow(true);
	//selection listener
	this._selectionListener=new AjxListener(this, this.onRowSelection);
	this._listView.addSelectionListener(this._selectionListener);
	//Action listener
	this._actionListener=new AjxListener(this, this.onActionSelection);
	this._listView.addActionListener(this._actionListener);
	
	//Creating scroll bar and linking to listView
	this._scrollBar=new CalemScrollBar(this._parent);	
	//Attach scrollBar to listView
	var el=this._listView.getScrollBarEl();
	this._scrollBar.setParentEl(el, this);	
}

/**
 * Publish events to data model
 */
CalemDataGrid.prototype._publishEvents =
function() {
	this._modelItem.publishEvents(CalemDataGrid.SELECTION_EVENTS, this);
}

CalemDataGrid.prototype._unpublishEvents =
function() {
	this._modelItem.unpublishEvents(CalemDataGrid.SELECTION_EVENTS, this);
}

/**
 * shutdown - give data model a chance to unsubscribe events.
 */
CalemDataGrid.prototype._shutdown =
function() {
	this._unpublishEvents();
}

CalemDataGrid.prototype.getHtmlElement =
function() {
	return this._listView.getHtmlElement();
}

CalemDataGrid.prototype.getListWidth =
function() {
	return this._listView.getListWidth();
}

CalemDataGrid.prototype.getHeaderHeight =
function() {
	return this._listView.getHeaderHeight();
}

/**
 * Layout change
 */
CalemDataGrid.prototype._onLayoutChange =
function(bz) {
	//Let's not worry about scrollbar at this point.
	this._listView.setBounds(bz.x, bz.y, bz.width, bz.height);
	//Adjust layout.
	this._scrollBar.__onLayoutChange();
	//Repaint and preserve selection.
	if (this._displayed) {
		//View size adjustment.
		this._calcViewSize();
		//Repaint - try to preserve the selection
		var selected=this._getSelectedItems();
		this.resumeView();
		//Reset selected list.
		this._listView.setSelectedItems(selected.getArray());
		//Resynchronize selected status
		this._reportSelection();
	}
}

/**
 * Show data
 */
CalemDataGrid.prototype._showData =
function() {
	if (!this._displayed) {//First time.
	   var recList=this._modelItem.getRecordList();
	   var total= recList ? recList.getTotal() : 0; //In case doing the design.
	   var list;
		if (total <=0) { //Nothing in the database.
			list=new AjxVector(); //empty list.
			this._listView.set(list);
			this._scrollBar.init(0, 0, 0, this);
		} else { //Figure out how many rows to show
			this._calcViewSize();
			list=recList._sliceByVector(0, this._viewSize); //this._controller.getDataBulk(1, viewSize, null, this._tableDd);
			this._listView.set(list, null);
			this._scrollBar.init(0, total, this._viewSize, this);
		}	
	}
	this._displayed=true;
}

/**
 * Show data for design
 */ 
CalemDataGrid.prototype.showDataForDesign =
function() {
	var dm=this._controller.getParentDataModel();
	var di= dm ? dm.getModelItem() : null;
	if (di) {
		var recList=di.getRecordList();
		var list=recList._sliceByVector(0, 1);
		this._listView.set(list, null);
	}
}

/**
 * Figure out view size
 * Note - IE with checkbox cause a row taller than without checkbox. 
 * So each grid must calibrate by itself.
 */
CalemDataGrid.prototype._calcViewSize =
function() { 
	if (!this._uorH) {
		//Need to try out the model to see if there are records
		var recList=this._modelItem.getRecordList();
	   var total=recList.getTotal();
	   if (total <= 0) return;
	   var list=recList._sliceByVector(0,1);
	   var bz=this._listView.__getHeightByData(list);
	   this._uorH=bz.height;
	   CalemViewUtil.setUorH(this._uorH); //For system to accumulate the height.   
	}
	if (this._uorH) {
		var bz=this._listView.__getViewBounds();
		this._viewSize= Math.floor(bz.height / this._uorH);
		if (!this._tableDd.isCached()) {
			this._viewSize = Math.min(this._viewSize, CalemConfUtil.getBulkFetchSize());
		}
		this._scrollBar.onViewSizeChange(this._viewSize);
		if (CalemDebug.isDebug()) {
			CalemDebug.printBounds('listView bz', bz);
			CalemDebug.debug("viewSize="+this._viewSize+", id="+this._id);
		}
	} 
}

/**
 * Data scroll control
 */
CalemDataGrid.prototype.scrollTo =
function(start, viewSize, dataSize) {
	var ptStart=start;
	var fetchSize=viewSize;
	if (dataSize < viewSize) {//It's within one frame.
		fetchSize=dataSize;
	} else if (start + viewSize > dataSize) {
		ptStart=dataSize-viewSize;
	} 
	this._modelItem.getRecordList().sliceByVector(ptStart, fetchSize, 
	    new AjxCallback(this, this._onScrollToCallback, {start: start, viewSize: viewSize, dataSize: dataSize}));
}

//Adding callback for DB-based table scrolling.
CalemDataGrid.prototype._onScrollToCallback =
function(param, list) {
	//Cannot optimize set list (since record could become dirty).
	if (!this._listView.isPageDisplayed(list)) {//Verify if the data has been changed in the grid view.
		this._listView.set(list);
		this._reportSelection();
	} else {
		this._listView.set(list);
	}
}

/**
 * Scroll by mouse wheeler
 */  
CalemDataGrid.prototype.onWheelEvent =
function(delta) {
	this._scrollBar.scrollByWheel(delta);
}

/**
 * Data sort
 */ 
CalemDataGrid.prototype.sortList =
function(fld, ascending) {
	if (CalemDebug.isDebug()) CalemDebug.debug("sort field: "+fld+", ascending="+ascending);
	var order= ascending ? CalemQueryOrderBy.ASC : CalemQueryOrderBy.DESC;
	var ob=CalemQueryOrderBy.createOrderBy(this._tableDd, fld, order);
	if (this._modelItem.isSameOrderBy(ob)) return;
	/**
	 * Ajustments: a) keep row position; b) selected rows.
	 */
	var selected=this._getSelectedItems();
	var scrollState=this._scrollBar.getState();
	scrollState.start=0; //Reset to start from the begining.
	var callback = new AjxCallback(this, this.onSortComplete, {selected: selected, scrollState: scrollState});
	this._modelItem.sortList(ob, callback, scrollState.start);
} 

CalemDataGrid.prototype.onSortComplete =
function(param) {
	//Let's get the list and redraw the current view.
	var recList = this._modelItem.getRecordList();
	param.scrollState.dataSize=recList.getTotal();
	this._scrollBar.resetState(param.scrollState);
	//Now redraw the data window.
	var list=recList._sliceByVector(param.scrollState.start, param.scrollState.viewSize);
	this._listView.set(list);
	//Reset selected list.
	this._listView.setSelectedItems(param.selected.getArray());
	//Resynchronize selected status
	this._reportSelection();
}

/**
 * Event listeners from UIs
 */
CalemDataGrid.prototype.onRowSelection =
function(ev) {
	this._reportSelection(ev);
	//Let's decide how to handle double click
	if (ev.detail==DwtListView.ITEM_DBL_CLICKED) {
		//set this item as selected
		this._listView.setSelectedItems([ev.item]);
		//Somehow we need an event for this.
		var selEv=new CalemSelectionEvent(true);
		selEv.setType(CalemEvent.DBL_CLICK_SELECTION);
		selEv.add(ev.item);
		this.notifyListeners(selEv.getType(), selEv);
	}
} 

//This is used to check if a right click is made.
CalemDataGrid.prototype.onActionSelection =
function(ev) {
	this._reportSelection(ev);
}

//Let's figure out the selections and report to controller
CalemDataGrid.prototype._reportSelection =
function(ev) {
	var selEv=new CalemSelectionEvent(true);
	selEv.setItems(this._getSelectedItems());
	if (selEv.size()==0) {
		selEv.setType(CalemEvent.NO_SELECTION);
	} else if (selEv.size()==1) {
		selEv.setType(CalemEvent.SINGLE_SELECTION);
	} else if (selEv.size() > 1) {
		selEv.setType(CalemEvent.MULTI_SELECTION);
	}  
	this.notifyListeners(selEv.getType(), selEv);
}

/**
 * Maintaining selected items. Selection change source:
 * <ul>
 * <li> sort list causes items to fly out of the view window.
 * <li> scroll items out of window so they are no longer selected.
 * </ul>
 * @todo - to keep selected across scrolling windows.
 */
CalemDataGrid.prototype._getSelectedItems =
function() {
	var items=new AjxVector();
	var els=this._listView.getSelectedItems();
	for (var i=0; i< els.size(); i++) {
		var el=els.get(i);
		var item=this._listView.getItemFromElement(el);
		items.add(item);
	}
	return items;
}

/**
 * provide listener and handle events
 */
CalemDataGrid.prototype.getDataChangeListener =
function() {
	return this._dataChangeListener;
} 

CalemDataGrid.prototype._onDataChanged =
function(evt) {
	//Report data change
	this._scrollBar.onDataChange(evt.getTotal());
	//Notify controller (this path seems shorter, could have controller notify grid as well - a longer walk).
	this._controller._onDataChanged(evt);
} 

/**
 * provide listener and handler for Data refresh
 */
CalemDataGrid.prototype.getDataRefreshListener =
function() {
	return this._dataRefreshListener;
} 

CalemDataGrid.prototype._onDataRefresh =
function(evt) {
	//Report data change
	this._scrollBar.onDataRefresh();
} 

/**
 * Coming out of hosted state so let's redraw grid for sure.
 */
CalemDataGrid.prototype.resumeView =
function() {
	//Try to keep selections
	var selected=this._getSelectedItems();
	this._calcViewSize(); //To cover from empty grids.
	this._scrollBar.resumeView();
	//Reset selected list.
	this._listView.setSelectedItems(selected.getArray());
	//Resynchronize selected status
	this._reportSelection();
}

/**
 * Design support
 */
CalemDataGrid.prototype.onFieldChange =
function(nodeChange) {
	this._listView.__onFieldChange(nodeChange);
}

CalemDataGrid.prototype.canRemoveField =
function() {
	return this._listView.__canRemoveField();
}

CalemDataGrid.prototype.getGridLayout =
function() {
	var headerList=this._listView._headerList;
	var colList=new Array();
	for (var i=0; i< headerList.length; i++) {
		var col=headerList[i];
		if (!col._visible) continue;
		colList.push(new CalemCol(col._field, col._width));
	}
	return new CalemListInfo(colList, this._listView._noMaximize);
}

CalemDataGrid.prototype.setParentRender =
function(pr) {
	this._listView._parentRender=pr;
}
