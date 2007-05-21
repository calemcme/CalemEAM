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
 * CalemDesignTreeFormRecord
 * This is the root node.
 */
function CalemDesignTreeFormRecord(parent, text, icon) {
	if (arguments.length==0) return;
	text= text ? text : CalemMsg.getMsg('form_design');
	icon = icon || 'CalemCustomize'; 
	CalemDesignTreeItem.call(this, parent, null, text, icon);
	this.setDropTarget(this._tree._dropTarget);
	this._calemDropAllowed=CalemConf['view_engine']['viewRecordDesign'].dropAllowed;
} 

CalemDesignTreeFormRecord.prototype = new CalemDesignTreeItem;
CalemDesignTreeFormRecord.prototype.constructor = CalemDesignTreeFormRecord;

CalemDesignTreeFormRecord.prototype.toString = 
function() {
	return "CalemDesignTreeFormRecord";
}

/**
 * Handling drop from view layout to the tree.
 */
CalemDesignTreeFormRecord.prototype._onDrop =
function(srcControl, targetControl) {
	var srcRender=srcControl._parentRender;
	if (srcRender instanceof CalemRecordDesignRowRender) {
		this._onRowDrop(srcControl);
	} else {
		this._onObjectDrop(srcControl);
	}
    return true;
}

/**
 * Handle an object drop.
 * Add the object to tree, then remove the object.
 */
CalemDesignTreeFormRecord.prototype._onObjectDrop =
function(srcControl) {
	this._tree._addObject(srcControl);
	srcControl._parentRender.replaceWithDesignCol(srcControl);
} 

/**
 * Move the tems from the row to the tree and then drop the blank row.
 */
CalemDesignTreeFormRecord.prototype._onRowDrop =
function(srcControl) {
	//Collect all the items from row, insert them properly, then, remove the row.
	var td=srcControl.getHtmlElement().parentNode;
	var row=td.parentNode;
	var cells=row.cells;
	var controls=[srcControl];
	for (var i=1; i< cells.length; i++) {
		var el=cells[i]; //td
		var objEl=el.firstChild;
		var obj=Dwt.getObjectFromElement(objEl);
		controls.push(obj);
		this._tree._addObject(obj); //Adding object to tree if applicable.
	}
	//Dispose control and its render
	for (var i=0; i< controls.length; i++) {
		controls[i]._parentRender.remove(controls[i]);
	}
	controls.splice(0, controls.length); //Release the array.
	//Remove the row from parent.
	row.parentNode.removeChild(row);
}



