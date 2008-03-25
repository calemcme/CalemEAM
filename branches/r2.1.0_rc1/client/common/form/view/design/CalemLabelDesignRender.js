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
 * CalemLabelDesignRender
 *  
 */
function CalemLabelDesignRender(parent, id, lbInfo, controller) {
	if (arguments.length==0) return;
	CalemUiDesignRender.call(this, parent, id, lbInfo, controller);
}

CalemLabelDesignRender.prototype=new CalemUiDesignRender;
CalemLabelDesignRender.prototype.constructor=CalemLabelDesignRender;

CalemLabelDesignRender.prototype.toString = function() { return "CalemLabelDesignRender"; }

CalemLabelDesignRender.prototype.render =
function(parentEl, yOff, clsName) {
	this._control=new CalemLabelDesign(this._parent, null, clsName);
	this._control.setText(this._info.getLabel());
	this._control.reparentHtmlElement(parentEl);
	//Sneak in a render property for checking back.
	this._enableDnd();
	this._control._parentRender=this;
	//Adding mouse down listener.
	if (this._controller.getMouseDownListener) {
		this._control.addListener(DwtEvent.ONMOUSEDOWN, this._controller.getMouseDownListener());
	}
}

CalemLabelDesignRender.prototype.getLabelId =
function() {
	return this._info.getId();
}

CalemLabelDesignRender.prototype.getLabel =
function() {
	return this._info.getLabel();
}



