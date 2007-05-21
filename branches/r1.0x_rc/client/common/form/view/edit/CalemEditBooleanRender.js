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
 * CalemEditBooleanRender
 * Render boolean edit field.
 *  
 */
function CalemEditBooleanRender(parent, id, fldInfo, controller) {
	if (arguments.length==0) return;
	CalemEditRender.call(this, parent, id, fldInfo, controller);
}

CalemEditBooleanRender.prototype=new CalemEditRender;
CalemEditBooleanRender.prototype.constructor=CalemEditBooleanRender;

CalemEditBooleanRender.prototype.toString = function() { return "CalemEditBooleanRender"; }

CalemEditBooleanRender.prototype.render =
function(parentEl, yOff) {
	this._control=new CalemEditBoolean(this._parent);
	this._control.reparentHtmlElement(parentEl);
	//set up other stuff here.
	this._control.setController(this._controller);
	//Now get both id and value here.
	val= this._getFieldRawValueByRec();
   this._control.setValue(val, true);  //No validation           
} 

CalemEditBooleanRender.prototype.setFieldReadOnly =
function() {
	this._control.setReadOnly();
}


