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
 * CalemRecordDesignRowRender
 *  
 */
function CalemRecordDesignRowRender(parent, id, lbInfo, controller) {
	if (arguments.length==0) return;
	CalemUiDesignRender.call(this, parent, id, lbInfo, controller);
}

CalemRecordDesignRowRender.prototype=new CalemUiDesignRender;
CalemRecordDesignRowRender.prototype.constructor=CalemRecordDesignRowRender;

CalemRecordDesignRowRender.prototype.toString = function() { return "CalemRecordDesignRowRender"; }

CalemRecordDesignRowRender.prototype.render =
function(parentEl, yOff, clsName, canMove) {
	this._el= parentEl;
	this._control=new CalemRowDesign(this._parent, null, clsName);
	this._control.setText(CalemMsg.getMsg('row'));
	this._control.setImage('CalemRow');
	this._control.reparentHtmlElement(this._el);
	//Sneak in a render property for checking back.
	this._control.setDropTarget(this._dropTarget);
	if (canMove) {
		this._control.setDragSource(this._dragSrc);
	}
	this._control._parentRender=this;
}

//Drop handling.
CalemRecordDesignRowRender.prototype._onDrop =
function(srcControl, targetControl) {
	var tgtRow=this._el.parentNode; //tr, this._el is td
	if (srcControl instanceof CalemDesignTreeRow) {
		this._parentRender._renderDesignRow(tgtRow.parentNode, tgtRow.rowIndex); //create rows.
	} else {
		//Swap rows.
		var srcRow=srcControl.getHtmlElement().parentNode.parentNode;
		CalemViewUtil.swapNodes(srcRow, srcRow.rowIndex, tgtRow, tgtRow.rowIndex);
	}
	return true;
}

//No action for the parentRender
CalemRecordDesignRowRender.prototype.removeRender =
function() {
	//No action, since render is not stored anywhere.
}
