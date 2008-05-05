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
 * CalemTableLayoutTreeRender
 */
function CalemTableLayoutTreeRender(parent, id, info, controller) {
	if (arguments.length==0) return;
	CalemRecordDesignTreeRender.call(this, parent, id, info, controller);
}

CalemTableLayoutTreeRender.prototype=new CalemRecordDesignTreeRender;
CalemTableLayoutTreeRender.prototype.constructor=CalemTableLayoutTreeRender;

CalemTableLayoutTreeRender.prototype.toString = function() { return "CalemTableLayoutTreeRender"; }

CalemTableLayoutTreeRender.prototype._createControl =
function(clsName) {
	return new CalemTableLayoutTree(this._parent, null, clsName);
}

CalemTableLayoutTreeRender.prototype.reRenderView =
function(clsName) {
	this._control.reRenderView();
}

