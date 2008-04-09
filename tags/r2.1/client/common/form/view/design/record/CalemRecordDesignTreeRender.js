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
 * CalemRecordDesignTreeRender
 *  
 */
function CalemRecordDesignTreeRender(parent, id, info, controller) {
	if (arguments.length==0) return;
	CalemUiDesignRender.call(this, parent, id, info, controller);
	this._margin=CalemConf['view_engine']['viewRecordDesign'].treeMargin;
}

CalemRecordDesignTreeRender.prototype=new CalemUiDesignRender;
CalemRecordDesignTreeRender.prototype.constructor=CalemRecordDesignTreeRender;

CalemRecordDesignTreeRender.prototype.toString = function() { return "CalemRecordDesignTreeRender"; }

CalemRecordDesignTreeRender.prototype.render =
function(parentEl, yOff, clsName) {
	this._yOff=yOff;
	this._control= this._createControl(clsName);
	this._control.reparentHtmlElement(parentEl);
	this._control.setScrollStyle(DwtControl.SCROLL); //Left panel can be minimized.
	this._fitBounds(yOff, parentEl);
	//Sneak in a render property for checking back.
	this._control._parentRender=this;
	//Tree initialization
	this._control.initTree(this._info, this._controller, this._dragSrc, this._dropTarget);
}

CalemRecordDesignTreeRender.prototype._createControl =
function(clsName) {
	return new CalemRecordDesignTree(this._parent, null, clsName);
}

CalemRecordDesignTreeRender.prototype._fitBounds =
function(yOff, resize) {
	//Let's figure out the bounds for the tree.
	var pBz=this._parent.getBounds(); //Use pBz so we can also do resizing.
	var width= pBz.width - this._margin.x*2 - this._getExtraMargin();
	var height=pBz.height - yOff - this._margin.y*2;
	//Use parent's width to get around the inconsistency of FF and IE.
	//Also leave room for scroll bar of browser.
	var tbz={x: this._margin.x, y: yOff+this._margin.y, width: width, height: height};
	this._control.setBounds(tbz.x, tbz.y, tbz.width, tbz.height);
	if (CalemDebug.isDebug()) {
		CalemDebug.debug("CalemRecordTreeDesignRender - parentEl " + CalemDebug.getBzText(pBz)+", new tree "+CalemDebug.getBzText(tbz));
	}
}

CalemRecordDesignTreeRender.prototype._getExtraMargin =
function() {
	return 0;
}

CalemRecordDesignTreeRender.prototype.onLayoutChange =
function() {
	this._fitBounds(this._yOff, true);
}

/**
 * Get acl info
 */
CalemRecordDesignTreeRender.prototype.getAclInfo =
function() {
	return this._control.getAclInfo();
} 
