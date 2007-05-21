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
 * CalemLayoutTreeFieldCustom
 * This is the field item.
 */
function CalemLayoutTreeFieldCustom(parent, index, text, id, info) {
	if (arguments.length==0) return;
	CalemDesignTreeItem.call(this, parent, index, text, 'CalemTreeField', id, info, true);
	this._setupMenu();
	this._xMargin=CalemConf['view_engine']['tableViewDesign'].menuMarginX;
} 

CalemLayoutTreeFieldCustom.prototype = new CalemDesignTreeItem;
CalemLayoutTreeFieldCustom.prototype.constructor = CalemLayoutTreeFieldCustom;

CalemLayoutTreeFieldCustom.prototype.toString = 
function() {
	return "CalemLayoutTreeFieldCustom";
}

CalemLayoutTreeFieldCustom.prototype._setupMenu =
function() {
	if (!this._tree._fldMenu) {
		this._tree._fldMenu=new DwtMenu(this._tree.parent); //let's not mess with the tree items.
		this._addMenuItem('field_type_change', 'CalemDataDesign', this._tree._controller.getFieldTypeChangeListener());
		this._addMenuItem('field_name_change', 'CalemDataDesign', this._tree._controller.getFieldNameChangeListener());
		this._addMenuItem('field_delete', 'CalemFieldDelete', this._tree._controller.getFieldDeleteListener());
	}	
}

CalemLayoutTreeFieldCustom.prototype._addMenuItem =
function(labelId, img, listener) {
	var mi=new DwtMenuItem(this._tree._fldMenu);
	mi.setImage(img);
	mi.setText(CalemMsg.getMsg(labelId));	
	mi.addSelectionListener(listener);
}

/** Option menu */
CalemLayoutTreeFieldCustom.prototype.onOptionMenu =
function() {
   var loc=this.getLocation();
   var items=this._tree._fldMenu.getItems();
   for (var i=0; i< items.length; i++) {
   	items[i].setData(CalemContext.DATA, this.getId());
   }   
	this._tree._fldMenu.popup(0, loc.x+this._xMargin, loc.y);
}


