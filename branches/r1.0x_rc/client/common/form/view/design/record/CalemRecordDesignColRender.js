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
 * CalemRecordDesignColRender
 *  
 */
function CalemRecordDesignColRender(parent, id, lbInfo, controller) {
	if (arguments.length==0) return;
	CalemUiDesignRender.call(this, parent, id, lbInfo, controller);
}

CalemRecordDesignColRender.prototype=new CalemUiDesignRender;
CalemRecordDesignColRender.prototype.constructor=CalemRecordDesignColRender;

CalemRecordDesignColRender.prototype.toString = function() { return "CalemRecordDesignColRender"; }

CalemRecordDesignColRender.prototype.render =
function(parentEl, yOff, clsName) {
	this._control=new CalemColDesign(this._parent, null, clsName);
	this._control.setText(CalemMsg.getMsg('col'));
	this._control.reparentHtmlElement(parentEl);
	//Sneak in a render property for checking back.
	this._control.setDropTarget(this._dropTarget);
	this._control._parentRender=this;
}

//No action for the parentRender
CalemRecordDesignColRender.prototype.removeRender =
function() {
	//No action, since render is not stored anywhere.
}

//Drop handling.
CalemRecordDesignColRender.prototype._onDrop =
function(srcControl, targetControl) {
	if (srcControl instanceof CalemDesignTreeItem) {
        var parentEl=this._control.getHtmlElement().parentNode;
		this._control.dispose(); //Remove current control.
		srcControl.removeMe(); //Remove source control.
		this._parentRender._renderOneItem(parentEl, null, srcControl.getId()); //Render in view panel.
	} else {
		this._swapControls(srcControl, targetControl);
	}
	return true;
}


