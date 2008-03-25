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
 * CalemFieldReadRender
 * Render field in read view (no change is allowed).
 *  
 */
function CalemFieldReadRender(parent, id, fldInfo, controller) {
	if (arguments.length==0) return;
	CalemFieldRender.call(this, parent, id, fldInfo, controller);
}

CalemFieldReadRender.prototype=new CalemFieldRender;
CalemFieldReadRender.prototype.constructor=CalemFieldReadRender;

CalemFieldReadRender.prototype.toString = function() { return "CalemFieldReadRender"; }

CalemFieldReadRender.prototype.render =
function(parentEl, yOff) {
	this._renderField(parentEl, yOff);
}

/**
 * shutdown 
 */
CalemFieldReadRender.prototype._shutdown =
function() {
	this._render._renderShutdown();
} 

CalemFieldReadRender.prototype._renderShutdown =
function() {
	//Overwrite
} 

//Resume view assuming a change is made.
CalemFieldReadRender.prototype.resumeView = 
function() {
	this._render._refreshField();
}

//Default implementation for all the read renders.
CalemFieldReadRender.prototype._refreshField =
function() {
	var val= this._getFieldValueByRec();
	this._control.setValue(val); 
}
