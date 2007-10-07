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
 * CalemFieldLabelRender
 *  
 */
function CalemFieldLabelRender(parent, id, lbInfo, controller) {
	if (arguments.length==0) return;
	CalemFieldRender.call(this, parent, id, lbInfo, controller);
}

CalemFieldLabelRender.prototype=new CalemFieldRender;
CalemFieldLabelRender.prototype.constructor=CalemFieldLabelRender;

CalemFieldLabelRender.prototype.toString = function() { return "CalemFieldLabelRender"; }

CalemFieldLabelRender.prototype.render =
function(parentEl, yOff, clsName) {
	this._label=new CalemFieldLabel(this._parent, null, clsName);
	//Get field label based on data model.
	var text=this._modelItem.getTableDd().getFieldLabel(this._field);
	this._label.setText(text+":");
	if (this._modelItem.getTableDd().isRequired(this._field)) {
		this._label.setRequired(true);
	}
	this._label.reparentHtmlElement(parentEl);
	//Adding mouse down listener.
	if (this._controller.getMouseDownListener) {
		this._label.addListener(DwtEvent.ONMOUSEDOWN, this._controller.getMouseDownListener());
	}
}

