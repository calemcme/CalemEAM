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
 * CalemFieldDesignRender
 *  
 */
function CalemFieldDesignRender(parent, id, lbInfo, controller) {
	if (arguments.length==0) return;
	CalemUiDesignRender.call(this, parent, id, lbInfo, controller);
	this._modelItem=controller.getDataModel().getModelItem();
	this._tableDd=this._modelItem.getTableDd();
	this._field=lbInfo.getField();
}

CalemFieldDesignRender.prototype=new CalemUiDesignRender;
CalemFieldDesignRender.prototype.constructor=CalemFieldDesignRender;

CalemFieldDesignRender.prototype.toString = function() { return "CalemFieldDesignRender"; }

CalemFieldDesignRender.prototype.render =
function(parentEl, yOff, clsName) {
	this._control=new CalemFieldDesign(this._parent, null, clsName);
	//Get field label based on data model.
	this._setText();
	this._control.reparentHtmlElement(parentEl);
	//Sneak in a render property for checking back.
	this._enableDnd();
	this._control._parentRender=this;
}

CalemFieldDesignRender.prototype._setText =
function() {
	var text=this._modelItem.getTableDd().getDesignLabel(this._field);
	this._control.setText(text);
}

CalemFieldDesignRender.prototype.onFieldLabelChanged =
function(fld) {
	this._setText();
}

