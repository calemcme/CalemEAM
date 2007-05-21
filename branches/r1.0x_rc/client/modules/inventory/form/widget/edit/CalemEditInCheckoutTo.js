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
 * CalemEditInCheckoutTo
 * This is the time edit control
 */
function CalemEditInCheckoutTo(param) {
	if (arguments.length==0) return;
	DwtComposite.call(this, param.parent);
	//Validation callback
	this._vdCallbackProxy = new AjxCallback(this, this.onVdCallbackProxy);
	this._param=param;
	this._createControl();
} 

CalemEditInCheckoutTo.prototype = new DwtComposite;
CalemEditInCheckoutTo.prototype.constructor = CalemEditInCheckoutTo;

CalemEditInCheckoutTo.prototype.toString = function() { return "CalemEditInCheckoutTo"; }

//create control
CalemEditInCheckoutTo.prototype._createControl  =
function() {	
	//internal data mappings
	this._createCheckoutTo();
	
	var html=new Array();
	var i=0;
	html[i++]="<table class=CalemEditInCheckoutToTable>";
	for (var r in this._radioGroups) {
		html[i++]="<tr>"
		html[i++]=["<td><input type='radio' class=CalemEditInCheckoutToRadio name='checkout_to', id=", this._radioGroups[r]._id,
	            ">", CalemMsg.getMsg(r), "</td>"].join('');
		html[i++]=["<td class=CalemEditInCheckoutToTd id=", this._lookups[r]._id, "></td>"].join('');
		html[i++]="</tr>";
	}
	html[i++]="</table>";
	//Set html layout.
	var el=this.getHtmlElement();
	el.innerHTML=html.join('');
	//Now continue layout and binding
	for (var i in this._radioGroups) {
		this._radioGroups[i]._el=document.getElementById(this._radioGroups[i]._id);
		this._radioGroups[i]._el.onclick = CalemEditInCheckoutTo._onRadioClick;
		//render lookup field
		var fld=this._lookups[i]._fld;
		var tbDd=this._param.controller.getModelItem().getTableDd();
		var fldInfo=tbDd.getFieldInfo(fld);
		this._lookups[i]._el=document.getElementById(this._lookups[i]._id);
		this._lookups[i]._render=new CalemEditLookupRender(this._param.parent, fld, fldInfo, this._param.controller);
		this._lookups[i]._render.render(this._lookups[i]._el);
		this._lookups[i]._render.setupValidation(this._vdCallbackProxy);
	}
}

/**
 * Checkout to
 */
CalemEditInCheckoutTo.prototype._createCheckoutTo =
function() {
	this._radioGroups=new Object();
	this._lookups=new Object();
	var checkoutTo=CalemConfUtil.get('in_vt_checkout_to_fldMap');
	for (var i in checkoutTo) {
		this._radioGroups[i]=new Object();
		this._radioGroups[i]._id=Dwt.getNextId();
		this._lookups[i]=new Object();
		this._lookups[i]._id=Dwt.getNextId();
		this._lookups[i]._fld=checkoutTo[i];
	}
}

/**
 * To display.
 */
CalemEditInCheckoutTo.prototype.setValue =
function(val, noValidate) {
	//Preserve previous value.
	var checked=false;
	for (var i in this._radioGroups) {
		if (this._radioGroups[i]._el.checked) {
			checked=true;
		}
	}
	if (!checked) {
		for (var i in this._radioGroups) {
			this._radioGroups[i]._el.checked=true;
			break;
		}
		this.onRadioClicked(true);
	}
}

CalemEditInCheckoutTo.prototype.setRequired =
function(bl) {
	for (var i in this._lookups) this._lookups[i]._render._control.setRequired();
}

CalemEditInCheckoutTo.prototype.focus =
function() {
	//NA.
}

/**
 * Validation
 */
CalemEditInCheckoutTo.prototype.setValidationCallback =
function(callback) {
	this._vdCallback=callback;
} 

CalemEditInCheckoutTo.prototype.onVdCallbackProxy =
function(fld, isValid, value) {
	if (isValid) {
		try {
			this.isValid();
		} catch (ex) {
			if (CalemDebug.isDebug()) CalemDebug.debug("CalemEditInCheckoutTo, got exception in vdCallbackProxy: "+ex);
			isValid=false;
		}
	}
	this._vdCallback.run(this, isValid, value)
}

CalemEditInCheckoutTo.prototype.setFieldInfo =
function(info) {
	this._fieldInfo=info;
} 

CalemEditInCheckoutTo.prototype.getFieldInfo =
function(info) {
	return this._fieldInfo;
}

CalemEditInCheckoutTo.prototype.isValid =
function() {
	for (var i in this._radioGroups) {
		if (this._radioGroups[i]._el.checked) {
			this._lookups[i]._render.verifyInput();
		}
	}
	return true;
}

//This is native type
CalemEditInCheckoutTo.prototype.getFieldValue =
function() {
	var rtn=null;
	for (var i in this._radioGroups) {
		if (this._radioGroups[i]._el.checked) {
			var id=this._lookups[i]._render._control.getFieldValue();
			if (id) {
				rtn=new CalemInCheckoutToInfo();
				rtn._checkoutTypeId=i;
				rtn._checkoutToId=id;
			}
			break;
		}
	}
	return rtn;
} 

//This is server type.
CalemEditInCheckoutTo.prototype.getEditFieldServerValue =
function() {
	return this.getFieldValue();
} 

CalemEditInCheckoutTo.prototype.setFieldError =
function(errMsg) {
	//
} 

CalemEditInCheckoutTo.prototype.clearFieldError =
function() {
	//
} 

//Handle radio button clicked.
CalemEditInCheckoutTo.prototype.onRadioClicked =
function(noReport) {
	for (var i in this._radioGroups) {
		if (this._radioGroups[i]._el.checked) {
			this._lookups[i]._render.enable();
		} else {
			this._lookups[i]._render._control.clearErrorFlag();
			this._lookups[i]._render.disable();
		}		
	}
	if (!noReport) {
		this.onVdCallbackProxy(this, true, null);
	}
}

/**
 * radio click function
 */
CalemEditInCheckoutTo._onRadioClick =
function(ev) {
	var obj = DwtUiEvent.getDwtObjFromEvent(ev);
	if (obj) obj.onRadioClicked();
} 
