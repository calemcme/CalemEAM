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
 * CalemReadTextRender
 * Render string edit field.
 *  
 */
function CalemReadTextRender(parent, id, fldInfo, controller) {
	if (arguments.length==0) return;
	CalemFieldReadRender.call(this, parent, id, fldInfo, controller);
}

CalemReadTextRender.prototype=new CalemFieldReadRender;
CalemReadTextRender.prototype.constructor=CalemReadTextRender;

CalemReadTextRender.prototype.toString = function() { return "CalemReadTextRender"; }

CalemReadTextRender.prototype.render =
function(parentEl, yOff) {
	this._control=new CalemReadText({parent: this._parent, type: DwtInputField.STRING, 
	              size: this._tableDd.getTextDisplayLength(this._field),
	              rows: this._tableDd.getTextDisplayRows(this._field)});
	this._control.reparentHtmlElement(parentEl);
	var val= this._getFieldValueByRec();
	this._control.setValue(val);             
}
