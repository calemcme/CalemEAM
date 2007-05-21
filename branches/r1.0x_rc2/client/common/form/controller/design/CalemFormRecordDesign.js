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
 * CalemFormRecordDesign
 * This is the form design widget.
 * 
 */
function CalemFormRecordDesign(parent, formId, data, designId, dataModel) {
	if (arguments.length==0) return;
	CalemFormDesign.call(this, parent, formId, data, designId, dataModel);	
	//Mouse down listener
	this._calemMouseDownListener=new AjxListener(this, this.onCalemMouseDown);
	this._labelDesign= CalemDesignTargetInfo.getLabelDesignPermit();
	//So this user can design labels.
	this._fldMenu = new DwtMenu(this._parent); //let's not mess with the tree items.
	this._addMenuItem('label_edit', 'CalemLabelEdit', this.getLabelEditListener());
	//Menu x margin
	this._xMargin=CalemConf['view_engine']['viewRecordDesign'].actionMenuMarginX;
}

CalemFormRecordDesign.prototype = new CalemFormDesign;
CalemFormRecordDesign.prototype.constructor = CalemFormRecordDesign;

CalemFormRecordDesign.prototype.toString = 
function() {
	return "CalemFormRecordDesign";
}

CalemFormRecordDesign.prototype._addMenuItem =
function(labelId, img, listener) {
	var mi=new DwtMenuItem(this._fldMenu);
	mi.setImage(img);
	mi.setText(CalemMsg.getMsg(labelId));	
	mi.addSelectionListener(listener);
}

// default is CalemView
CalemFormRecordDesign.prototype.createView =
function() {
	CalemFormDesign.prototype.createView.call(this);
	this._view.setScrollStyle(Dwt.SCROLL);
}

/**
 * Render factory
 */
CalemFormRecordDesign.prototype.getRender =
function(info) {
	var render= CalemConf['view_engine']['viewRecordDesign'][info.getClassName()];
	if (!render) {
		render=CalemFormDesign.prototype.getRender.call(this, info);
	}
	return render;
}

/**
 * Field label change handler
 */
CalemFormRecordDesign.prototype.getMouseDownListener = 
function() {
	return this._calemMouseDownListener;
}

CalemFormRecordDesign.prototype.onCalemMouseDown = 
function(ev) {
	if (ev.button != DwtMouseEvent.RIGHT || !this._labelDesign) return;
	var item=DwtUiEvent.getDwtObjFromEvent(ev);
	if (!item || !item.doLabelEdit) return;

	//Set up menu data
	var items=this._fldMenu.getItems();
   for (var i=0; i< items.length; i++) {
   	items[i].setData(CalemContext.DATA, item);
   } 
	//Popup menu here.
	var loc=item.getLocation();
	this._fldMenu.popup(0, loc.x+this._xMargin, loc.y);	
}
