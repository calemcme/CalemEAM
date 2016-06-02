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
 * This is the base toolbar design class.
 * It implements a render's interface to handle buttons DnD.
 */
 
/**
 * Constructor
 */
function CalemToolBarDesign(parent, posInfo, tbInfo, className, posStyle, cellSpacing, cellPadding, style) {
	if (arguments.length==0) return;
	CalemToolBar.call(this, parent, posInfo, tbInfo, className, posStyle, cellSpacing, cellPadding, style);
	this._renders=new Object();
} 

CalemToolBarDesign.prototype = new CalemToolBar;
CalemToolBarDesign.prototype.constructor = CalemToolBarDesign;

CalemToolBarDesign.prototype.toString = 
function() {
	return "CalemToolBarDesign";
}

/**
 * Creating toolbar
 */
CalemToolBarDesign.prototype.createToolBar =
function(tbInfo, listenerFactory, controller, dragSrc, dropTarget, customInfo) {
	this._dragSrc=dragSrc;
	this._dropTarget=dropTarget;
	CalemToolBar.prototype.createToolBar.call(this, tbInfo, listenerFactory, controller, customInfo);
} 

/**
 * Adding a button to the toolbar
 */
CalemToolBarDesign.prototype.addButton =
function(btnInfo) {
	var render=new CalemTbDesignButtonRender(this, btnInfo.getId(), btnInfo);
	var btn=render.initDnd(this._dragSrc, this._dropTarget);
	render.render();
	return btn;
}

/**
 * Adding a separator and support DnD.
 */
CalemToolBarDesign.prototype.addSeparator =
function(clsName, idx, itemInfo) {
	var render=new CalemTbDesignSeparatorRender(this, itemInfo.getId(), itemInfo);
	render.initDnd(this._dragSrc, this._dropTarget);
	render.render();	
}

/**
 * Get layout info into an array.
 */
CalemToolBarDesign.prototype.getTbLayout =
function() {
	var rtn=[];
	//Traverse the dom tree to figure out the control order.
	var item=this.getItem(0);
	var el=item.getHtmlElement();
	var td=el.parentNode;
	var tr=td.parentNode;
	var tds=tr.childNodes;
	for (var i=0; i< tds.length; i++) {//skip row cell.
		var td=tds[i];
		var obj=Dwt.getObjectFromElement(td.firstChild);
		rtn.push(obj._parentRender.getId());
	}
	return rtn;
}
