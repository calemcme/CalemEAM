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
 * CalemEditDropdown
 * This is the dropdown control.
 */
function CalemEditDropdown(parent, valueList) {
	if (arguments.length==0) return;
	DwtComposite.call(this, parent);
	//Prepare the values from the value
	this._valueList=valueList;
	this._initControl();
}

CalemEditDropdown.prototype = new DwtComposite;
CalemEditDropdown.prototype.constructor = CalemEditDropdown;

CalemEditDropdown.prototype.toString = function() {return "CalemEditDropdown";}

//Relayout so it's aligned and error flag.
CalemEditDropdown.prototype._initControl =
function() {
	var selectId = Dwt.getNextId();
	var errorIconId = Dwt.getNextId();
	var el = this.getHtmlElement();
	el.innerHTML=["<table cellspacing='0' cellpadding='0'><tr>", 
	           "<td style='padding-right:2px;'id='", errorIconId, "'></td>",
	           "<td id=", selectId, "></td>",
	           "</tr></table>"].join('');
	this._selectEl=document.getElementById(selectId);
	//Init error icon to none.
	this._errorIconTd = document.getElementById(errorIconId);
	this._errorIconTd.vAlign = "middle";
	this._errorIconTd.innerHTML = DwtInputField._NOERROR_ICON_HTML;
	//Init values for DwtSelect
	var values=[];
	for (var i=0; i< this._valueList.length; i++) {
		values.push(this._valueList[i].msg);
	}
	this._control=new DwtSelect(this.parent, values);
	this._control.reparentHtmlElement(this._selectEl);
	//Init a change listener
	this._control.addChangeListener(new AjxListener(this, this.onFieldChange));
}
/**
 * Control interfaces with render.
 */
CalemEditDropdown.prototype.setFieldInfo =
function(info) {
	this._fieldInfo=info;
}

CalemEditDropdown.prototype.getFieldInfo =
function() {
	return this._fieldInfo;
}

//Validation callback
CalemEditDropdown.prototype.setValidationCallback =
function(vcCallback) {
	this._vcCallback=vcCallback;
}

//Only string type
CalemEditDropdown.prototype.getFieldValue =
function() {
	return this._value; //This is only for string type.
} 

//Only string type
CalemEditDropdown.prototype.getEditFieldServerValue =
function() {
	return this.getFieldValue(); //This is only for string type.
} 


CalemEditDropdown.prototype.setFieldError =
function(errMsg) {
	//No errors for this field
} 

CalemEditDropdown.prototype._clearFieldError =
function() {
  //no action.
}

CalemEditDropdown.prototype.setValue =
function(value, noValidation) {
  this._value=value;
  if (noValidation) {
  	  var backup=this._vcCallback;
  	  this._vcCallback=null;
  	  this._setSelectedByValue();
  	  this._vcCallback=backup;
  } else {
  	  this._setSelectedByValue();
  }
}

CalemEditDropdown.prototype._setSelectedByValue =
function() {
  var idx;
  var found=false;
  for (var i=0; i< this._valueList.length; i++) {
  		if (this._value==this._valueList[i].id) {
  			idx=i;
  			found=true;
  			break;
  		}
  }
  if (found) {
  	 this._control.setSelectedValue(this._valueList[idx].msg);
  } else {
  	 this._control.setSelected(0);
  	 this._value=null;
  }
}

// field change event
CalemEditDropdown.prototype.onFieldChange =
function(ev) {
	var idx=this._control.getSelectedIndex();
	this._value=this._valueList[idx].id;
	//Notify controller
	if (this._vcCallback) this._vcCallback.run(this, true, this.getFieldValue());
}

CalemEditDropdown.prototype.focus =
function() {
	//
}

CalemEditDropdown.prototype.setReadOnly =
function() {
	this._control.disable();
}

//Always valid.
CalemEditDropdown.prototype.isValid =
function() {
	return true;
}

CalemEditDropdown.prototype.enable =
function() {
	this._control.enable();
} 

CalemEditDropdown.prototype.disable =
function() {
	this._control.disable();
}



