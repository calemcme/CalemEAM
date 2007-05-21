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
 * CalemViewSearchEditRender
 *  
 * This is the edit view render.
 */
function CalemViewSearchEditRender(parent, id, viewInfo, controller) {
	if (arguments.length==0) return;
	CalemViewRuntimeRender.call(this, parent, id, viewInfo, controller);
}

CalemViewSearchEditRender.prototype=new CalemViewRuntimeRender;
CalemViewSearchEditRender.prototype.constructor=CalemViewSearchEditRender;

CalemViewSearchEditRender.prototype.toString = function() { return "CalemViewSearchEditRender"; }
CalemViewSearchEditRender.prototype.getClassName = function() { return "CalemViewSearchEditRender"; }

CalemViewSearchEditRender.prototype._getBlankRows =
function() {
	return 2;
}

/**
 * Set focus
 */
CalemViewSearchEditRender.prototype.setFocus =
function() {
	for (var i in this._renders) {
		//Set focus on the first edit render.
		if (this._renders[i] instanceof CalemSearchFieldRenderFacade) {
			this._renders[i].setFocus(); //Set focus to the first control.
			break;
		}
	}
}

/**
 * Validation functions
 */
CalemViewSearchEditRender.prototype.verifyViewInput =
function(fld, isValid) {
	for (var i in this._renders) {
		if (this._renders[i] instanceof CalemSearchFieldRenderFacade) {
			this._renders[i].verifyInput(fld, isValid);
		}
	}
	return true;
}


