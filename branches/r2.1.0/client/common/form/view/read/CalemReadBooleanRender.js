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
 * CalemReadBooleanRender
 * Render boolean readonly field.
 *  
 */
function CalemReadBooleanRender(parent, id, fldInfo, controller) {
	if (arguments.length==0) return;
	CalemFieldReadRender.call(this, parent, id, fldInfo, controller);
}

CalemReadBooleanRender.prototype=new CalemFieldReadRender;
CalemReadBooleanRender.prototype.constructor=CalemReadBooleanRender;

CalemReadBooleanRender.prototype.toString = function() { return "CalemReadBooleanRender"; }

CalemReadBooleanRender.prototype.render =
function(parentEl, yOff) {
	this._control=new CalemReadBoolean(this._parent);
	this._control.reparentHtmlElement(parentEl);
	//Set value for the control.
	val= this._getFieldRawValueByRec();
    this._control.setValue(val);  //No validation           
}

