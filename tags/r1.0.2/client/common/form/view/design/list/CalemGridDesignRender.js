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
 * CalemGridDesignRender
 *  
 */
function CalemGridDesignRender(parent, id, gridInfo, controller) {
	if (arguments.length==0) return;
	CalemUiDesignRender.call(this, parent, id, gridInfo, controller);
	this._modelItem=controller.getModelItem();
}

CalemGridDesignRender.prototype=new CalemUiDesignRender;
CalemGridDesignRender.prototype.constructor=CalemGridDesignRender;

CalemGridDesignRender.prototype.toString = function() { return "CalemGridDesignRender"; }

CalemGridDesignRender.prototype.render =
function(parentEl, yOff) {
	this._yOff=yOff;
	var gridInfo=this._controller.getGridCustomInfo();
	this._grid =new CalemDataGrid(this._parent, this._id, this._modelItem.getTableDd(), gridInfo, this._controller);
	parentEl.appendChild(this._grid.getHtmlElement());
	var newOff=this._fitBounds(yOff);
	//for data collection
	this._grid.setParentRender(this);
	//Show empty data
	this._showDesignData();
	//Get the new offset out.
	return newOff;
}

CalemGridDesignRender.prototype._fitBounds =
function(yOff, resize) {
	//Use a workaround to account for borders, etc.
	var vConf=CalemConf['view_engine']['grid'];
	//Let's figure out the real bounds for the grid now.
	var pBz=this._parent.getBounds(); //Use pBz so we can also do resizing.
   var sbWidth=CalemConf["widget_scrollbar"]['browserRightMargin'];
	var width= pBz.width - sbWidth - vConf['xMargin'];
	var height=CalemConf['view_engine']['viewListDesign']['grid'].height; //This is a fixed height.
	var sz=CalemViewUtil.validateGridSize(width, height);
	//Use parent's width to get around the inconsistency of FF and IE.
	//Also leave room for scroll bar of browser.
	var gbz={x: 0, y: yOff, width: sz.width, height: sz.height};
	this._grid.onLayoutChange(gbz);
	if (CalemDebug.isDebug()) {
		CalemDebug.debug("CalemGridDesignRender - parentEl " + CalemDebug.getBzText(pBz)+", new grid "+CalemDebug.getBzText(gbz));
	}
	return (yOff + sz.height);
}

CalemGridDesignRender.prototype._showDesignData =
function() {
	this._grid.showDataForDesign();
}

/**
 * Shutdown
 * remove grid data change listener.
 */
CalemGridDesignRender.prototype._shutdown =
function(parentEl, yOff) {
	//Tell grid to shutdown as well
	this._grid._shutdown();
} 

/**
 * Handle field changes from the tree
 */
CalemGridDesignRender.prototype.onFieldChange =
function(nodeChange) {
	this._grid.onFieldChange(nodeChange);
} 

CalemGridDesignRender.prototype.canRemoveField =
function(nodeChange) {
	return this._grid.canRemoveField();
}

CalemGridDesignRender.prototype.getGridLayout =
function(nodeChange) {
	return this._grid.getGridLayout();
}

