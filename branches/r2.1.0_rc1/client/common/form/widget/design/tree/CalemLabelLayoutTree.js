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
 * CalemLabelLayoutTree
 * This is the base layout tree.
 */
function CalemLabelLayoutTree(parent, style, className, posStyle) {
	if (arguments.length==0) return;
	CalemViewDesignTree.call(this, parent, style, className, posStyle);
	this._xMargin=CalemConf['view_engine']['dropdownViewDesign'].menuMarginX;
} 

CalemLabelLayoutTree.prototype = new CalemViewDesignTree;
CalemLabelLayoutTree.prototype.constructor = CalemLabelLayoutTree;

CalemLabelLayoutTree.prototype.toString = 
function() {
	return "CalemLabelLayoutTree";
}

//Add menu function here.
CalemLabelLayoutTree.prototype._initTree =
function() {
	if (!CalemDesignTargetInfo.getLabelDesignPermit()) return;
	//So this user can design labels.
	this._fldMenu=new DwtMenu(this.parent); //let's not mess with the tree items.
	this._addMenuItem('label_edit', 'CalemLabelEdit', this._controller.getLabelEditListener());	
	//Add a selection listener
	this.addSelectionListener(new AjxListener(this, this.onTreeSelection));
}

CalemLabelLayoutTree.prototype._addMenuItem =
function(labelId, img, listener) {
	var mi=new DwtMenuItem(this._fldMenu);
	mi.setImage(img);
	mi.setText(CalemMsg.getMsg(labelId));	
	mi.addSelectionListener(listener);
}

CalemLabelLayoutTree.prototype.onTreeSelection =
function(evt) {
	if (evt.detail != DwtTree.ITEM_ACTIONED) return;
	var item=evt.items[0];
	if (!item.doLabelEdit) return;
	//Set up menu data
	var items=this._fldMenu.getItems();
   for (var i=0; i< items.length; i++) {
   	items[i].setData(CalemContext.DATA, item);
   } 
   //Show menu and process it.
	if (item.doLabelEdit()) return; //Item customized showing menu.
	//Otherwise show label here.
	var loc=item.getLocation();
	this._fldMenu.popup(0, loc.x+this._xMargin, loc.y);
}
