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
 * CalemLabelRender
 *  
 */
function CalemLabelRender(parent, id, lbInfo, controller) {
	if (arguments.length==0) return;
	CalemUiRender.call(this, parent, id, lbInfo, controller);
}

CalemLabelRender.prototype=new CalemUiRender;
CalemLabelRender.prototype.constructor=CalemLabelRender;

CalemLabelRender.prototype.toString = function() { return "CalemLabelRender"; }

CalemLabelRender.prototype.render =
function(parentEl, yOff, clsName) {
	var style=(DwtLabel.IMAGE_RIGHT | DwtLabel.ALIGN_LEFT);
	this._label=new DwtLabel(this._parent, style, clsName);
	this._label.setText(this._info.getLabel());
	this._label.reparentHtmlElement(parentEl);
}
