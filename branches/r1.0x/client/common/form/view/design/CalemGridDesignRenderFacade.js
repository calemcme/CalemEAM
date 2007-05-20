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
 * CalemGridDesignRenderFacade
 *  
 */
function CalemGridDesignRenderFacade(parent, id, gridInfo, controller) {
	if (arguments.length==0) return;
	CalemUiDesignRender.call(this, parent, id, gridInfo, controller);
}

CalemGridDesignRenderFacade.prototype=new CalemUiDesignRender;
CalemGridDesignRenderFacade.prototype.constructor=CalemGridDesignRenderFacade;

CalemGridDesignRenderFacade.prototype.toString = function() { return "CalemGridDesignRenderFacade"; }

/**
 * This is the facade to create two more renders: grid and grid tree.
 */
CalemGridDesignRenderFacade.prototype.render =
function(parentEl, yOff) {
	this._yOff=yOff;
	this._gridRender=new CalemGridDesignRender(this._parent, this._id, this._info, this._controller);
	this._newOff=this._gridRender.render(parentEl, yOff);
	//Render the tree
	this._treeRender=new CalemGridTreeDesignRender(this._parent, this._id, this._info, this._controller);
	//Pass around the drag/drop handling.
	this._treeRender.initDnd(this._dragSrc, this._dropTarget); //Drag drop
	this._treeRender.render(parentEl, this._newOff);
	//Binding events together
	this._treeRender.setTreeChangeCallback(new AjxCallback(this, this.onTreeChange));
	this._treeRender.setCanDragCallback(new AjxCallback(this, this.canDrag));
}

/**
 * Fields add/remove from the grid tree callback.
 */
CalemGridDesignRenderFacade.prototype.onTreeChange =
function(nodeChange) {
	this._gridRender.onFieldChange(nodeChange);
}

CalemGridDesignRenderFacade.prototype.canDrag =
function() {
	return this._gridRender.canRemoveField();
}  

CalemGridDesignRenderFacade.prototype.onLayoutChange =
function() {
	this._treeRender.onLayoutChange();
}
