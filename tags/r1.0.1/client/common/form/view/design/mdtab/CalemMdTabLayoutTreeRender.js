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
 * CalemMdTabLayoutTreeRender
 */
function CalemMdTabLayoutTreeRender(parent, id, info, controller) {
	if (arguments.length==0) return;
	CalemRecordDesignTreeRender.call(this, parent, id, info, controller);
}

CalemMdTabLayoutTreeRender.prototype=new CalemRecordDesignTreeRender;
CalemMdTabLayoutTreeRender.prototype.constructor=CalemMdTabLayoutTreeRender;

CalemMdTabLayoutTreeRender.prototype.toString = function() { return "CalemMdTabLayoutTreeRender"; }

CalemMdTabLayoutTreeRender.prototype._createControl =
function(clsName) {
	return new CalemMdTabLayoutTree(this._parent, null, clsName);
}

CalemMdTabLayoutTreeRender.prototype.getFormLayoutInfo =
function() {
	return this._control.getFormLayoutInfo();
}
