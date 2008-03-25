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
 * CalemUiDesignRender
 */
function CalemUiDesignRender(parent, id, info, controller) {
	if (arguments.length==0) return;
	CalemUiRender.call(this, parent, id, info, controller);
	this._calemDropAllowed=CalemConf['view_engine']['viewRecordDesign'].dropAllowed;
}

CalemUiDesignRender.prototype=new CalemUiRender;
CalemUiDesignRender.prototype.constructor=CalemUiDesignRender;

CalemUiDesignRender.prototype.toString = function() { return "CalemUiDesignRender"; }
CalemUiDesignRender.prototype.getClassName=function() {return this.toString();}

//General drag/drop
CalemUiDesignRender.prototype._enableDnd =
function() {
	this._control.setDragSource(this._dragSrc);
	this._control.setDropTarget(this._dropTarget);
}

CalemUiDesignRender.prototype._onDragEnter =
function(srcControl, targetControl) {
	return false;
}

/**
 * Default action is to swap controls.
 */
CalemUiDesignRender.prototype._onDrop =
function(srcControl, targetControl) {
	this._swapControls(srcControl, targetControl);
	return true;
}

/**
 * Swap controls.
 */
CalemUiDesignRender.prototype._swapControls =
function(srcControl, targetControl) {
	//Let's swap the controls based on their parent.
	var sourceHtml=srcControl.getHtmlElement();
	var targetHtml=targetControl.getHtmlElement();
	//Swapping TD could avoid changing the association between control and html.	
	//Take each out of the parent node.
	var srcTd=sourceHtml.parentNode;
	var tgtTd=targetHtml.parentNode;
	CalemViewUtil.swapNodes(srcTd, srcTd.cellIndex, tgtTd, tgtTd.cellIndex);
}

/**
 * Drops allowed
 */
/**
 * To decide which controls are allowed to be dropped: 
 * Allowed: [Label, Field, FieldLabel, Text]
 * Not Allowed: [Button, Row, Col]
 * 
 */
CalemUiDesignRender.prototype._onDragEnter =
function(srcControl, targetControl) {
	var rtn=false;
	var allowed=this._calemDropAllowed[this.toString()]; //Use toString to get the class name.
	//It's either render or DwtTreeItem.
	var dropId= srcControl._parentRender ? srcControl._parentRender.toString() : srcControl.toString();
	rtn = (allowed && allowed[dropId]);
	return rtn;
} 

CalemUiDesignRender.prototype.onFieldLabelChanged =
function() {
	//no implementation.
}