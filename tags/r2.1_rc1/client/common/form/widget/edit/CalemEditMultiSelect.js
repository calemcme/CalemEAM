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
 * CalemEditMultiSelect
 * Multi-selection object.
 */
function CalemEditMultiSelect(param) {
	if (arguments.length==0) return;
	DwtControl.call(this, param.parent, param.className, param.posStyle);
	this._createControl(param);
} 

CalemEditMultiSelect.prototype = new DwtControl;
CalemEditMultiSelect.prototype.constructor = CalemEditMultiSelect;

CalemEditMultiSelect.prototype.toString = function() { return "CalemEditMultiSelect"; }

CalemEditMultiSelect.prototype._createControl  =
function(param) {
	this._items=param.items;
	//Creating the control now.
	var selectId = Dwt.getNextId();
	var errorIconId = Dwt.getNextId();
	var el = this.getHtmlElement();
	var html=[];
	var i=0;
	html[i++]=["<table cellspacing='0' cellpadding='0'><tr>", 
	           "<td style='padding-right:2px;'id='", errorIconId, "'></td>",
	           "<td><select id=", selectId, " class=CalemEditMultiSelectTd multiple=true size=", param.size, ">"].join('');           
	//Build the select
	var k=0;
	this._indexMap=new Object();
	for (var j in this._items) {
		html[i++]=["<option value='", j, "'>", this._items[j], "</option>"].join(''); //No use of label/value to work with FF.
		this._indexMap[j]=k++;
	}	           
	html[i++]="</select></td></tr></table>";
	el.innerHTML=html.join('');
	this._selectEl=document.getElementById(selectId);
	//Init error icon to none.
	this._errorIconTd = document.getElementById(errorIconId);
	this._errorIconTd.vAlign = "middle";
	this._errorIconTd.innerHTML = DwtInputField._NOERROR_ICON_HTML;
	//Get callback 
	this._selectEl.onchange=CalemEditMultiSelect._onChange;  
	//Set callback to render
	if (param.callback) {
		this._onChangeCallback=param.callback;
	}
}

CalemEditMultiSelect.prototype.setChangeCallback =
function(callback) {
	this._onChangeCallback=callback;
}

CalemEditMultiSelect._onChange =
function(ev) {
	var obj = DwtUiEvent.getDwtObjFromEvent(ev);
	if (obj && obj._onSelectChange) {
		obj._onSelectChange();
	}
}

CalemEditMultiSelect.prototype._onSelectChange =
function() {
	if (this._onChangeCallback) {
		this._onChangeCallback.run(this._getSelected());
	}
}

CalemEditMultiSelect.prototype._getSelected =
function() {
	var selected=[];
	var options=this._selectEl.options;
	for (var i=0; i< options.length; i++) {
		if (options[i].selected) selected.push(options[i].value);
	}
	return selected;
}

CalemEditMultiSelect.prototype.setSelected =
function(selected) {
	var options=this._selectEl.options;
	for (var i=0; i< options.length; i++) {
		options[i].selected=false;
	}
	for (var i=0; i< selected.length; i++) {
		options[this._indexMap[selected[i]]].selected=true;
	}
}

CalemEditMultiSelect.prototype.setValidationCallback =
function(vcCallback) {
	this._vcCallback = vcCallback;
}

CalemEditMultiSelect.prototype.setFieldInfo =
function(fldInfo) {
	this._fieldInfo=fldInfo;	
}

CalemEditMultiSelect.prototype.getFieldInfo =
function(fldInfo) {
	return this._fieldInfo;	
}

CalemEditMultiSelect.prototype.isValid =
function() {
	return true;
}
