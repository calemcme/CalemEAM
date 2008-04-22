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
 * CalemViewDesignRender
 */
function CalemViewDesignRender(parent, id, viewInfo, controller, conf) {
	if (arguments.length==0) return;
	CalemViewRender.call(this, parent, id, viewInfo, controller);
	//Creating drag and drop handlers.
	this._dragSrc = new DwtDragSource(Dwt.DND_DROP_MOVE);
	this._dragSrc.addDragListener(new AjxListener(this, this.onDrag));
	this._dropTarget=new DwtDropTarget(DwtControl); //So in general allow everyone to do so.
	this._dropTarget.addDropListener(new AjxListener(this, this.onDrop));
	//Design specific conf
	this._sashDelay=CalemConf['view_engine']['viewDesign'].sashDelay;
	this._margin=conf.margin;
	this._sashX=this._margin+conf.leftPanelWidth+this._margin;
	this._leftViewId=conf.leftPanelViewId;
	this._rowsNoDnd=conf.rowsNoDnd;

	this._layoutChange=new AjxTimedAction(this, this.onLayoutChange);
}

CalemViewDesignRender.prototype=new CalemViewRender;
CalemViewDesignRender.prototype.constructor=CalemViewDesignRender;

CalemViewDesignRender.prototype.toString = function() { return "CalemViewDesignRender"; }
CalemViewDesignRender.prototype.getClassName = function() { return "CalemViewDesignRender"; }

/**
 * Drag and drop generic handling
 * All the control are handled at the drop place.
 */
CalemViewDesignRender.prototype.onDrag = 
function(ev) {
	/* The drop event has several fields:
	 * operation - Is it a move or a copy
	 * srcControl - The source i.e. an employee
	 * action - Current action. May be one of:
	 *	DwtDragEvent.DRAG_START - Starting drag operation
	 *	DwtDragEvent.SET_DATA - Request to set srcData field of event
	 * 	DwtDragEvent.DRAG_END - Drag operation is ending
	 * srcData - The source data
	 * doIt - We are responsible for setting this to true if we want the op to proceed */   
   if (ev.action==DwtDragEvent.DRAG_START) {
   	/**
   	 * Setting doIt to false is not stopping it. So move it to the drop side.
   	 */
   	/*
   	ev.doIt=true;
		//Decide if allowed.
		var handler= ev.srcControl._parentRender ? ev.srcControl._parentRender : ev.srcControl;
		if (handler && handler._onDragStart) {
			ev.doIt=handler._onDragStart(ev);
		}
		*/
   }
	if (ev.action == DwtDragEvent.SET_DATA) {
		// We have been asked to set the data for the node that is being dragged.
		ev.srcData = ev.srcControl;
	} else if (ev.action == DwtDragEvent.DRAG_END) {
		//Don't do anything here since we have already finised what we set out to do at the drop spot.
	}
}

/**
 * Default drop listener simply swap two controls.
 */
CalemViewDesignRender.prototype.onDrop =
function(ev) {
	/* The drop event has several fields:
	 * operation - Is it a move or a copy
	 * targetControl - The drop target i.e. a department
	 * action - Current action. May be one of:
	 *	DwtDropEvent.DRAG_ENTER - The source is entering the targetControl
	 *	DwtDropEvent.DRAG_LEAVE - The source is leaving the targetControl
	 * 	DwtDropEvent.DRAG_OP_CHANGED - Operation changed (e.g. from move -> copy - not currently supported)
	 *	DwtDropEvent.DRAG_DROP - The actual drop i.e. the mouse button has been released
	 * srcData - The actual source data
	 * doIt - We are responsible for setting this to true if we want the op to proceed */
	if (ev.action == DwtDropEvent.DRAG_ENTER) {
		// Checking source from there since DragStart is not honoring <code>doIt</code>
		var srcControl=ev.srcData;
		var srcHdlr= srcControl._parentRender ? srcControl._parentRender : srcControl;
		if (srcHdlr && srcHdlr._onDragStart) {
			if (!srcHdlr._onDragStart(ev)) {
				ev.doIt=false;
				return;
			}
		}
		// Flow to check drag enter.
		ev.doIt=false;
		//Decide if allowed.
		var handler= ev.targetControl._parentRender ? ev.targetControl._parentRender : ev.targetControl;
		if (handler && handler._onDragEnter) {
			ev.doIt=handler._onDragEnter(ev.srcData, ev.targetControl);
			if (ev.doIt) this._allowDrag(ev.targetControl);
		}
	} else	if (ev.action == DwtDropEvent.DRAG_LEAVE) {
		this._restoreClassName(ev.targetControl);		
	} else	if (ev.action == DwtDropEvent.DRAG_DROP) {
		var handler= ev.targetControl._parentRender ? ev.targetControl._parentRender : ev.targetControl;
		if (handler && handler._onDrop) {
			ev.doIt=handler._onDrop(ev.srcData, ev.targetControl);
		}		
	}
}

CalemViewDesignRender.prototype._allowDrag =
function(ctrl) {	
	if (ctrl._origClassName) {
		ctrl._origClassName=ctrl.className;
	}
	ctrl.className=CalemConf['view_engine'].dndAllowedCss;
}

CalemViewDesignRender.prototype._restoreClassName =
function(ctrl) {
	if (ctrl._origClassName) {
		ctrl.className=ctrl._origClassName;
	}
}

CalemViewDesignRender.prototype._renderView =
function(parentEl, layout) {
	return CalemViewRender.prototype._renderView.call(this, parentEl, layout, this._controller.getCustomInfo());
}

/**
 * Form design render
 * It creates a left panel with a tree view of all available 
 * fields, labels and buttons, the right panel is the view layout.
 *  
 */
CalemViewDesignRender.prototype.render =
function(parentEl, layout) {
	this._parentEl=parentEl;
	if (CalemDebug.isDebug()) {
		var dtStart=new Date();
	}
	//Creating left panel, sash and right panel
	this._leftPanel=new DwtComposite(this._parent, this._getLeftPanelClass(), Dwt.ABSOLUTE_STYLE);
	this._leftPanel.setScrollStyle(DwtControl.CLIP); //Left panel can be minimized.
	this._sash = new DwtSash(this._parent, DwtSash.HORIZONTAL_STYLE, "AppSash-horiz", 5);
	this._sash.registerCallback(this.onSashCallback, this); 
	this._rightPanel=new DwtComposite(this._parent, this._getRightPanelClass(), Dwt.ABSOLUTE_STYLE);
	this._rightPanel.setScrollStyle(DwtControl.SCROLL); //Right panel must scroll.
	//Initialize the size now.
	this._setSizes();
	//Now do layout using existing mechanism.
	var leftViewInfo=CalemJson.setJson(CalemViewDef[this._leftViewId]);
	this._leftRender=new CalemViewRender(this._leftPanel, this._leftViewId, leftViewInfo, this._controller);
	//Drag/drop setup
	this._leftRender.setDragSource(this._dragSrc);
	this._leftRender.setDropTarget(this._dropTarget);
	//render it.
	var leftHeight=this._leftRender._renderView(this._leftPanel.getHtmlElement(), leftViewInfo.getLayout(), 
                                                CalemCustomViewManager.getInstance()._getEmptyCustomInfo(this._leftViewId));
	//Render right side the way it is.
	this._parent=this._rightPanel; //Overwrite this._parent since the right panel is the real one and the parent's role is finished.
	var rightHeight=this._renderView(this._rightPanel.getHtmlElement(), layout);
	//Show some debug info
	this._height=leftHeight; //Left height is going to be full height.
	if (CalemDebug.isDebug()) {
		var dtFinish=new Date();
		CalemDebug.debug("<font style='color:purple;'>ViewRender completed: "+this._id+", height="+this._height+", rendering time="+(dtFinish-dtStart)+"</font>");
	}
	return this._height;
} 

/**
 * ClassNames
 */
CalemViewDesignRender.prototype._getLeftPanelClass =
function() {
	return 'CalemViewDesignLeft';
} 

CalemViewDesignRender.prototype._getRightPanelClass =
function() {
	return 'CalemViewDesignRight';
}

CalemViewDesignRender.prototype._setSizes =
function() {
	this._sz=Dwt.getSize(this._parentEl);	
	this._sash.setBounds(this._sashX, 0, Dwt.DEFAULT, this._sz.y);
	this._leftPanel.setBounds(this._margin, 0, this._sashX-2*this._margin, this._sz.y);
	var sashSz=this._sash.getSize();
	var rightX=this._sashX+sashSz.x+this._margin;
	this._rightPanel.setBounds(rightX, 0, this._sz.x-rightX, this._sz.y);
}

/**
 * Sash callback
 */
CalemViewDesignRender.prototype.onSashCallback =
function(delta) {
	var absDelta = Math.abs(delta);
	var viewBds = Dwt.getBounds(this._parentEl);
	var leftSz=this._leftPanel.getSize();
	// make sure we aren't moving too far
	if ((delta < 0 && (absDelta >= leftSz.x)) || (delta > 0 && (absDelta >= viewBds.width)))
		return 0;
	this._sashX += delta;
	//Used timed action
	AjxTimedAction.scheduleAction(this._layoutChange, this._sashDelay);
	return delta;
} 

/**
 * Layout change handling
 */
CalemViewDesignRender.prototype.onLayoutChange =
function() {
	this._setSizes();
	this._leftRender.onLayoutChange();
	//Right render is super class
	CalemViewRender.prototype.onLayoutChange.call(this);
}

/** 
 * Check for special rows
 */
CalemViewDesignRender.prototype._canRowMove =
function(cols) {
	for (var i=0; i< cols.length; i++) {
		if (this._rowsNoDnd[cols[i]]) return false;
	}
	return true;
}

/**
 * Get customized view info for saving
 * - acl info from leftPanel
 * - layout from right panel
 */
CalemViewDesignRender.prototype.getCustomizedView =
function() {
	var aclInfo=this._leftRender.getAclInfo();
	var viewInfo=this._getCustomizedViewInfo();
	var custom=new CalemViewCustomInfo(this._info.getId(), aclInfo, viewInfo);
	return custom;
}

/**
 * Start a walk through the dom to generate layout.
 */
CalemViewDesignRender.prototype._getCustomizedViewInfo =
function() {
	var el=this._rightPanel.getHtmlElement();
	while (el.tagName!='TBODY') {
		el=el.firstChild;
	}
	//Now go through each row and generate a layout.
	var layout=new CalemViewLayoutInfo();
	var rows=[];
	var nodes=el.childNodes;
	var trNode;
	for (var i=0; i < nodes.length; i++) {
		trNode=nodes[i];
		this._addOneRow(trNode, rows, layout);
	}
	layout._viewLayout=rows;
	return layout;
} 

CalemViewDesignRender.prototype._addOneRow =
function(trNode, rows, layout) {
	var tds=trNode.childNodes;
	var cells=[];
	var hasObj=false;
	for (var i=this._getStartCol(); i< tds.length; i++) {//skip row cell.
		var td=tds[i];
		var obj=Dwt.getObjectFromElement(td.firstChild);
		if (obj instanceof CalemColDesign) {
			cells.push('CalemColDesign');
		} else {//It should a render.
			cells.push(obj._parentRender.getId());
			hasObj=true;
			this._handleObjectLayout(obj, layout);
		}
	}
	if (hasObj) {
		var trInfo=new CalemTrInfo();
		trInfo._cols=cells;
		trInfo._height=CalemViewUtil.H_AUTO;
		rows.push(trInfo);
	}
}

/**
 * Providing subclass a way to handle it.
 */
CalemViewDesignRender.prototype._handleObjectLayout =
function(obj, layout) {
	if (obj instanceof CalemToolBarDesign) {
		layout._tbLayout=obj.getTbLayout();
	}
}
