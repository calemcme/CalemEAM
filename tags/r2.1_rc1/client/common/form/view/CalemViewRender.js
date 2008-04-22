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
 * CalemViewRender
 *  
 * This is the view render.
 */
function CalemViewRender(parent, id, viewInfo, controller) {
	if (arguments.length==0) return;
	CalemUiRender.call(this, parent, id, viewInfo, controller);
	this._renders=new Object();
	this._noColorRows=CalemConf['view_engine']['viewRender']['rowsNoColor'];
}

CalemViewRender.prototype=new CalemUiRender;
CalemViewRender.prototype.constructor=CalemViewRender;

CalemViewRender.prototype.toString = function() { return "CalemViewRender"; }
CalemViewRender.prototype.getClassName = function() { return "CalemViewRender"; }

/**
 * Use custom rows if any
 */
CalemViewRender.prototype._getLayoutRows =
function() {
	return (this._customInfo && this._customInfo.getLayout()) ? 
				this._customInfo.getLayout().getViewLayout() : this._layout.getRows();
}

/**
 * Check acl for a given id
 * Assume access by default.
 */
CalemViewRender.prototype._checkViewAcl =
function(id) {
	return (this._customInfo) ? this._customInfo.checkViewAcl(id) : true;
}

//Get custom info by toolbar render.
CalemViewRender.prototype.getCustomInfo =
function(id) {
	return this._customInfo;
}

CalemViewRender.prototype.render =
function(parentEl, layout) {
	if (CalemDebug.isInfo()) CalemDebug.info("<font style='color:red;'>CalemViewRender.prototype.render is deprecated</font>");
}

CalemViewRender.prototype.rowAllowColor =
function(cols) {
	for (var i=0; i< cols.length; i++) {
		if (this._noColorRows[cols[i]]) return false;
	}
	return true;
}

/**
 * Couple things: a) debug mode; b) set by parameter; c) set by configuration.
 */
CalemViewRender.prototype._useAlternateColor =
function(cols) {
	if (!this.rowAllowColor(cols)) return false;
	if (typeof(calemUseAlternateColor)!='undefined') return calemUseAlternateColor;
	else return (CalemDebug.isDebug() ||CalemConf['view_engine']['useAlternateColor']);
}

CalemViewRender.prototype._renderView =
function(parentEl, layout, customInfo) {
	this._layout=layout;
	this._customInfo=customInfo; //This is the customInfo.
	this._tableDd=this._controller.getModelItem().getTableDd();
	
	if (CalemDebug.isDebug()) {
		var dtStart=new Date();
	}
	//Creating the table for doing the layout.
	var tableInfo=layout.getTableLayout();
	var table = document.createElement("table");
	parentEl.appendChild(table);
	if (tableInfo.getWidth()) {
		table.width  = tableInfo.getWidth();
	}
	if (tableInfo.getHeight()) {
		table.height  = tableInfo.getHeight();
	}
	table.border = table.cellPadding = table.cellSpacing = 0;
	table.backgroundColor = DwtCssStyle.getProperty(parentEl, "background-color");
	table.className=this.getClassName();
	this._colCount=layout.getColLayout().getColCount();
	//var rows=layout.getRows();
	//Consider customization
	var rows=this._getLayoutRows();
	var yOff=0;
	//Layout each row.
	var sz=Dwt.getSize(parentEl);
	var canMove;
	for (var i=0; i< rows.length; i++) {
		var row= rows[i];
		var rowEl=table.insertRow(-1);
		var height=CalemViewUtil.getHeight(sz, yOff, row.getHeight());
		CalemViewUtil.setHeight(rowEl, height);
		
		var cols = row.getCols();
		canMove=this._onRowCreated(rowEl, cols);
		
		//alternate coloring
		if (i>0 && this._useAlternateColor(cols)) {
			rowEl.style.background= (i%2==0) ? CalemConf['view_engine']['alternate_row_color']['even'] : CalemConf['view_engine']['alternate_row_color']['odd'];
		}
		
		//Render every col, giving design a chance to render it differently.
		for (var j=0; j<this._colCount; j++) {
			var colId=cols[j];
			//ColDesign special handling
			if (colId == 'CalemColDesign') {
				this._renderForCalemColDesign(rowEl);
				continue;
			}
			if (j >= cols.length) {
				this._renderCol(rowEl);
				continue; //We're over the available cols.
			}
			var colEl = rowEl.insertCell(-1);
			CalemViewUtil.setHeight(colEl, height);
			//ColSpan processing.
			var colSpan=null;			
			if (cols.length < this._colCount && j==cols.length-1) { //Apply remaining to this col. - maybe configurable by col.
				colSpan= this._getColSpan(this._colCount - j, canMove); //colspan must include self.
			}
			if (colSpan!=null) {
				colEl.colSpan=colSpan;
			} 
			//Classify normal col-css
			if (cols.length==this._colCount) {
				if (j % 2==0) colEl.className='COLUMN-EVEN';
				else colEl.className='COLUMN-ODD';
			}
			this._renderOneItem(colEl, yOff, colId, true);
			//Check for colspan and exit if it's filled.
			if (colSpan && (colSpan+j)==this._colCount) break;
		}
		var newH=CalemViewUtil.getHeightAfterLayout(rowEl, height);
		yOff += newH; //IE 7 does not obey the height set so must use the height to do layout.
	}
	//Check for blank rows to add at the end
	var blankRows=this._getBlankRows();
	for (var i=0; i< blankRows; i++) {
		var rowEl=table.insertRow(-1);
		var colEl=rowEl.insertCell(-1);
		colEl.innerHTML='&nbsp;'; //blank text to force the row to render.
		colEl.colSpan=this._colCount;
		var newH=CalemViewUtil.getHeightAfterLayout(rowEl, CalemViewUtil.H_AUTO);
		yOff += newH; //IE 7 does not obey the height set so must use the height to do layout.
	}
	this._height=yOff;
	if (CalemDebug.isDebug()) {
		var dtFinish=new Date();
		CalemDebug.debug("<font style='color:purple;'>ViewRender completed: "+this._id+", height="+this._height+", rendering time="+(dtFinish-dtStart)+"</font>");
	}
	return this._height;
}

CalemViewRender.prototype._renderOneItem =
function(colEl, yOff, id, checkAcl) {
	if (checkAcl && !this._checkViewAcl(id)) return;
	
	var itemInfo=CalemViewUtil.getItemInfo(id, this._info, this._tableDd);	
	var impl=this._controller.getRender(itemInfo);
	if (!impl) {
		CalemDebug.error("Error in locating render for: "+itemInfo.getJson());
	}
	var render=eval(['new ', impl, '(this._parent, id, itemInfo, this._controller)'].join(''));
	render.initDnd(this._dragSrc, this._dropTarget); //Drag drop
	var cls= (itemInfo.getCcsClass) ? itemInfo.getCcsClass() : null;
	render._parentRender=this;
	render.render(colEl, yOff, cls);
	this._add(id, render);
}

/**
 * Blank rows at the end
 */
CalemViewRender.prototype._getBlankRows =
function() {
	return 0;
} 

/**
 * Give sub class a chance to add stuff to it.
 */
CalemViewRender.prototype._onRowCreated =
function(rowEl, cols) {
	//Overwrite.
	return true;
}

CalemViewRender.prototype._getColSpan =
function(colSpan, canMove) {
	return colSpan;
}

CalemViewRender.prototype._renderCol =
function(rowEl, canMove) {
}

CalemViewRender.prototype._renderForCalemColDesign =
function(rowEl) {
	rowEl.insertCell(-1); //To preserve layout in runtime mode.
}

CalemViewRender.prototype._add =
function(id, render) {
	this._renders[id]=render;
}

CalemViewRender.prototype.onLayoutChange =
function() {
	for (var i in this._renders) {
		this._renders[i].onLayoutChange();
	}
}

CalemViewRender.prototype.resumeView =
function() {
	for (var i in this._renders) {
		this._renders[i].resumeView();
	}
}

CalemViewRender.prototype.setFieldReadOnly =
function(id) {
	if (this._renders[id]) {
		this._renders[id].setFieldReadOnly();
	}
}

//Valid range
CalemViewRender.prototype.setValidRange =
function(fld, min, max) {
	if (this._renders[fld]) {
		this._renders[fld].setValidRange(min, max);
	}	
}

//field value
CalemViewRender.prototype.setFieldValue =
function(fld, fv) {
	if (this._renders[fld]) {
		this._renders[fld].setFieldValue(fv);
	}	
}

CalemViewRender.prototype.hasRender =
function(fld) {
	return this._renders[fld];
}

CalemViewRender.prototype._shutdown =
function() {
	for (var i in this._renders) {
		this._renders[i]._shutdown();
	}
}

CalemViewRender.prototype.setFocus =
function() {
	//Overwrite
}
CalemViewRender.prototype.verifyViewInput =
function(fld, isValid) {
	//Overwrite
	return true;
}

/**
 * Default impl is good enough
 */
//FieldValue
CalemViewRender.prototype.getFieldValue =
function(id) {
	return (this._renders[id]) ? this._renders[id].getFieldValue() : null;
} 

CalemViewRender.prototype.getEditFieldServerValue =
function(id) {
	return (this._renders[id]) ? this._renders[id].getEditFieldServerValue() : null;
} 

CalemViewRender.prototype.getInsertFieldServerValue =
function(id) {
	return (this._renders[id]) ? this._renders[id].getInsertFieldServerValue() : null;
}

CalemViewRender.prototype.setFieldError =
function(id, errMsg) {
	if (this._renders[id]) this._renders[id].setFieldError(errMsg);
} 

/**
 * getFieldChanged
 */
CalemViewRender.prototype.getFieldChanged =
function(id) {
	return (this._renders[id]) ? this._renders[id].getFieldChanged() : false;
}

/**
 * getFieldSearch
 */
CalemViewRender.prototype.getFieldSearch =
function(id) {
	return this._renders[id] ? this._renders[id].getFieldSearch() : null;
} 


//Drag/drop support
CalemViewRender.prototype.setDragSource =
function(dragSrc) {
	this._dragSrc=dragSrc;
}

CalemViewRender.prototype.setDropTarget =
function(dropTarget) {
	this._dropTarget=dropTarget;
}
	
//Need to create an icon that can handle drag/drop.
CalemViewRender.prototype._renderRowDesign =
function(cellEl, canMove) {
	var render = new CalemRecordDesignRowRender(this._parent, null, null, this._controller, this._dragSrc, this._dropTarget);
	render.initDnd(this._dragSrc, this._dropTarget);
	render.render(cellEl, null, null, canMove);
	render._parentRender=this;
	return true;
}

CalemViewRender.prototype._renderColDesign =
function(cellEl) {
	var render = new CalemRecordDesignColRender(this._parent, null, null, this._controller, this._dragSrc, this._dropTarget);
	render.initDnd(this._dragSrc, this._dropTarget);
	render.render(cellEl);
	render._parentRender=this;
}

/**
 * Adding a new design row with design cells.
 */
CalemViewRender.prototype._renderDesignRow =
function(parentEl, idx) {
	var rowEl=parentEl.insertRow(idx);
	var cellEl=rowEl.insertCell(-1);
	this._renderRowDesign(cellEl, true);
	for (var i=0; i< this._colCount; i++) {
		cellEl=rowEl.insertCell(-1);
		this._renderColDesign(cellEl);
	}
}

//Remove a given render
CalemViewRender.prototype._removeRender =
function(id) {
	//render removal
	CalemDebug.info("Remove render, id="+id+", render="+this._renders[id]);
	delete this._renders[id];
}

/**
 * Collect items hidden from the tree
 */ 
CalemViewRender.prototype.getAclInfo =
function() {
	for (var i in this._renders) {
		if (this._renders[i].getAclInfo) { //Check interface for routing the call.
			return this._renders[i].getAclInfo();
		}
	}
}
