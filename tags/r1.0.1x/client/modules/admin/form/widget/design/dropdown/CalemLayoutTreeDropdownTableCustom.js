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
 * CalemLayoutTreeDropdownTableCustom
 * This is the table node.
 */
function CalemLayoutTreeDropdownTableCustom(parent, text) {
	if (arguments.length==0) return;
	CalemDesignTreeItem.call(this, parent, null, text, 'CalemTableExtesion');
	//Dnd setup
	this.setDropTarget(this._tree._dropTarget);
	this._calemDropAllowed=CalemConf['view_engine']['dropdownViewDesign'].dropAllowed;
	
	this._setupMenu();
	this._xMargin=CalemConf['view_engine']['dropdownViewDesign'].menuMarginX;
} 

CalemLayoutTreeDropdownTableCustom.prototype = new CalemDesignTreeItem;
CalemLayoutTreeDropdownTableCustom.prototype.constructor = CalemLayoutTreeDropdownTableCustom;

CalemLayoutTreeDropdownTableCustom.prototype.toString = 
function() {
	return "CalemLayoutTreeDropdownTableCustom";
}

CalemLayoutTreeDropdownTableCustom.prototype._setupMenu =
function() {
	this._fldMenu=new DwtMenu(this._tree.parent); //let's not mess with the tree items.
	var mi=new DwtMenuItem(this._fldMenu);
	mi.setImage('CalemFieldAdd');
	mi.setText(CalemMsg.getMsg("dropdown_add"));	
	mi.addSelectionListener(this._tree._controller.getDropdownAddListener());
}

/**
 * Add field
 */
CalemLayoutTreeDropdownTableCustom.prototype.addFieldInfo = 
function(id, info, text) {
	var idx=this._getIndex(text);
	var item=new CalemLayoutTreeDropdownCustom(this, idx, text, id, info);
} 

/** Option menu */
CalemLayoutTreeDropdownTableCustom.prototype.onOptionMenu =
function() {
	var loc=this.getLocation();
	this._fldMenu.popup(0, loc.x+this._xMargin, loc.y);
}

/**
 * If the field is alreay in the tree, cannot make the drop.
 */
CalemLayoutTreeDropdownTableCustom.prototype._onDragEnter =
function(srcControl, targetControl) {
	var rtn=false;
	var allowed=this._calemDropAllowed[this.toString()]; //Use toString to get the class name.
	//It's either render or DwtTreeItem.
	var dropId= srcControl._parentRender ? srcControl._parentRender.toString() : srcControl.toString();
	rtn = (allowed && allowed[dropId]);
	if (rtn) {
		var items=this.getItems();
		var id=srcControl.getId();
		for (var i=0; i< items.length; i++) {
			if (items[i].getId()==id) {
				rtn=false;
				break;
			}
		}
	}
	return rtn;
}

/**
 * Handling drop from view layout to the tree.
 */
CalemLayoutTreeDropdownTableCustom.prototype._onDrop =
function(srcControl, targetControl) {
	this._tree._controller.addDropdown(srcControl.getId());
   return true;
}
