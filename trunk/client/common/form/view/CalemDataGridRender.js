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
 * CalemDataGridRender
 *  
 */
function CalemDataGridRender(parent, id, gridInfo, controller) {
	if (arguments.length==0) return;
	CalemUiRender.call(this, parent, id, gridInfo, controller);
	this._modelItem=controller.getDataModel().getModelItem();
	this._renders=new Object();
}

CalemDataGridRender.prototype=new CalemUiRender;
CalemDataGridRender.prototype.constructor=CalemDataGridRender;

CalemDataGridRender.prototype.toString = function() { return "CalemDataGridRender"; }

CalemDataGridRender.prototype.render =
function(parentEl, yOff) {
	this._yOff=yOff;
	this._grid =new CalemDataGrid(this._parent, this._id, this._modelItem.getTableDd(), 
																		this._controller.getGridCustomInfo(), this._controller);
	parentEl.appendChild(this._grid.getHtmlElement());
	this._fitBounds(yOff);
	this._showData();
	//Register for events.
	this._modelItem.addDataChangeListener(this._grid.getDataChangeListener());
    this._modelItem.addDataRefreshListener(this._grid.getDataRefreshListener());
}

CalemDataGridRender.prototype._fitBounds =
function(yOff, resize) {
	//Use a workaround to account for borders, etc.
	var vConf=CalemConf['view_engine']['grid'];
	//Let's figure out the real bounds for the grid now.
	var pBz=this._parent.getBounds(); //Use pBz so we can also do resizing.
   var sbWidth=CalemConf["widget_scrollbar"]['browserRightMargin'];
	var width= pBz.width - sbWidth - vConf['xMargin'];
	var height=pBz.height - yOff - vConf['yMargin'];
	var sz=CalemViewUtil.validateGridSize(width, height);
	//Use parent's width to get around the inconsistency of FF and IE.
	//Also leave room for scroll bar of browser.
	var gbz={x: 0, y: yOff, width: sz.width, height: sz.height};
	this._grid.onLayoutChange(gbz);
	if (CalemDebug.isDebug()) {
		CalemDebug.debug("CalemDataGridRender - parentEl " + CalemDebug.getBzText(pBz)+", new grid "+CalemDebug.getBzText(gbz));
	}
}

CalemDataGridRender.prototype._showData =
function() {
	this._grid.showData();
}

CalemDataGridRender.prototype.onLayoutChange =
function() {
	this._fitBounds(this._yOff, true);
}

CalemDataGridRender.prototype.resumeView =
function() {
	this._grid.resumeView();
}

/**
 * Shutdown
 * remove grid data change listener.
 */
CalemDataGridRender.prototype._shutdown =
function() {
	//remove listener for events.
	this._modelItem.removeDataChangeListener(this._grid.getDataChangeListener());
    this._modelItem.removeDataRefreshListener(this._grid.getDataRefreshListener());
	//Tell grid to shutdown as well
	this._grid._shutdown();
} 
