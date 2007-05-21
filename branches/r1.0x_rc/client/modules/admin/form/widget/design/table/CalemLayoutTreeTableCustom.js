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
 * CalemLayoutTreeTableCustom
 * This is the table node.
 */
function CalemLayoutTreeTableCustom(parent) {
	if (arguments.length==0) return;
	text=CalemMsg.getMsg('table_extension');
	CalemDesignTreeItem.call(this, parent, null, text, 'CalemTableExtesion');
	this._setupMenu();
	this._xMargin=CalemConf['view_engine']['tableViewDesign'].menuMarginX;
} 

CalemLayoutTreeTableCustom.prototype = new CalemDesignTreeItem;
CalemLayoutTreeTableCustom.prototype.constructor = CalemLayoutTreeTableCustom;

CalemLayoutTreeTableCustom.prototype.toString = 
function() {
	return "CalemLayoutTreeTableCustom";
}

CalemLayoutTreeTableCustom.prototype._setupMenu =
function() {
	this._fldMenu=new DwtMenu(this._tree.parent); //let's not mess with the tree items.
	var mi=new DwtMenuItem(this._fldMenu);
	mi.setImage('CalemFieldAdd');
	mi.setText(CalemMsg.getMsg("field_add"));	
	mi.addSelectionListener(this._tree._controller.getFieldAddListener());
}

/**
 * Add field
 */
CalemLayoutTreeTableCustom.prototype.addFieldInfo = 
function(id, info, text) {
	var idx=this._getIndex(text);
	var item=new CalemLayoutTreeFieldCustom(this, idx, text, id, info);
} 

/** Option menu */
CalemLayoutTreeTableCustom.prototype.onOptionMenu =
function() {
	var loc=this.getLocation();
	this._fldMenu.popup(0, loc.x+this._xMargin, loc.y);
}

