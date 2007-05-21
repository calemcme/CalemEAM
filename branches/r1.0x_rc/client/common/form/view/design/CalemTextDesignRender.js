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
 * CalemTextDesignRender
 *  
 */
function CalemTextDesignRender(parent, id, lbInfo, controller) {
	if (arguments.length==0) return;
	CalemFieldDesignRender.call(this, parent, id, lbInfo, controller);
}

CalemTextDesignRender.prototype=new CalemFieldDesignRender;
CalemTextDesignRender.prototype.constructor=CalemTextDesignRender;

CalemTextDesignRender.prototype.toString = function() { return "CalemTextDesignRender"; }

CalemTextDesignRender.prototype.render =
function(parentEl, yOff, clsName) {
	clsName = clsName || 'CalemTextDesign';
	this._control=new CalemTextDesign({parent: this._parent, type: DwtInputField.STRING, 
	              size: this._tableDd.getTextDisplayLength(this._field),
	              rows: this._tableDd.getTextDisplayRows(this._field),
	              className: clsName});
	var text=this._modelItem.getTableDd().getDesignLabel(this._field);
	this._control.setText(text);
	this._control.reparentHtmlElement(parentEl);
	//Sneak in a render property for checking back.
	this._enableDnd();
	this._control._parentRender=this;
}


