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
 * CalemSearchSelect
 * This is search select control.
 */
function CalemSearchSelect(parent, tableId, type, controller) {
	if (arguments.length==0) return;
	DwtComposite.call(this, parent, 'CalemSearchSelect');
	this._tableId=tableId;
	this._type=type;
	this._controller = controller;
	this._selectListener=new AjxListener(this, this.onSelect);
	this._createControl();
} 

CalemSearchSelect.prototype = new DwtComposite;
CalemSearchSelect.prototype.constructor = CalemSearchSelect;

CalemSearchSelect.prototype.toString = function() { return "CalemSearchSelect"; }

CalemSearchSelect.prototype._createControl  =
function(param) {
	var el=this.getHtmlElement();
	var selectId=Dwt.getNextId();
	var applyId=Dwt.getNextId();
	var editId=Dwt.getNextId();
	var deleteId=Dwt.getNextId();
	el.innerHTML=["<table class=CalemSearchSelectTable><tr>",
	              "<td id=", selectId, " class=CalemSearchSelectTd></td>",
	              "<td id=", applyId, " class=CalemSearchApplyTd> </td>",
	              "<td id=", editId, " class=CalemSearchEditTd> </td>",
	              "<td id=", deleteId, " class=CalemSearchDeleteTd> </td>",
	              "</tr></table>"].join('');
	//Getting the elements
	var selectEl=document.getElementById(selectId);
	var applyEl=document.getElementById(applyId);
	var editEl=document.getElementById(editId);
	var deleteEl=document.getElementById(deleteId);	                            
	//Creating the elements
	this._select=new DwtSelect(this.parent);
	this._select.addChangeListener(this._selectListener);
	this._select.reparentHtmlElement(selectEl);
	
	this._apply=this._createButton('menu_apply', 'CalemApply', this._controller.getApplyListener(), applyEl);
	this._edit=this._createButton('menu_edit', 'CalemEdit', this._controller.getEditListener(), editEl);
	this._delete=this._createButton('menu_delete', 'CalemDelete', this._controller.getDeleteListener(), deleteEl);
	//Data initialization
	this._setupOptions();
}

//create a button
CalemSearchSelect.prototype._createButton = 
function(menuId, image, listener, parentEl) {
	var btn=new CalemButton(this.parent);
	btn.setText(CalemMsg.getMsg(menuId));
	btn.setImage(image);
	btn.addSelectionListener(listener);
	btn.reparentHtmlElement(parentEl);
	return btn;
}

//Some initialization
CalemSearchSelect.prototype._setupOptions =
function() {
	this._disable(true);
	
	this._select.clearOptions();
	this._valueMap=CalemViewUtil.getSearchByTable(this._tableId, this._type);
	var bSelected=true;
	for (var i in this._valueMap) {
		var opt=new DwtSelectOption(i, bSelected, this._valueMap[i].getName());
		this._select.addOption(opt);
		if (bSelected) {
			bSelected=false;
			this._onSelect(i);
		}
	}
	//If empty display an empty string
	if (bSelected) {
		var opt=new DwtSelectOption('no_saved_search', true, CalemMsg.getMsg('no_saved_search'));
		this._select.addOption(opt);
	}
}

CalemSearchSelect.prototype.onSelect =
function(ev) {
	if (this._valueMap[ev._args.newValue]) {//This will recognize the null value added.
		this._onSelect(ev._args.newValue);
	}
}

CalemSearchSelect.prototype._onSelect =
function(id) {
	if (this._type==CalemConst.MY_SEARCH) {
		this._enable(id, true);
	} else {
		if (CalemViewUtil.canEditSharedSearch(this._valueMap[id])) {
			this._enable(id, true);
		} else {
			this._enable(id, false);
		}
	}
}

CalemSearchSelect.prototype._enable =
function(id, all) {
	this._apply.setData(CalemContext.DATA, this._valueMap[id]);
	this._apply.setEnabled(true);
	if (all) {
		this._edit.setData(CalemContext.DATA, this._valueMap[id]);
		this._edit.setEnabled(true);
		this._delete.setData(CalemContext.DATA, this._valueMap[id]);
		this._delete.setEnabled(true);
	}
}

CalemSearchSelect.prototype._disable =
function(all) {
	this._edit.setEnabled(false);
	this._delete.setEnabled(false);
	if (all)	this._apply.setEnabled(false);
}

CalemSearchSelect.prototype.setFocus =
function() {
	//Not supported.
}

/**
 * Resume view to reload search.
 */
CalemSearchSelect.prototype.resumeView =
function() {
	this._setupOptions();
}
