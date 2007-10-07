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
 * CalemSearchDateRender
 * Render Date field for Searching.
 *  
 */
function CalemSearchDateRender(parent, id, fldInfo, controller) {
	if (arguments.length==0) return;
	CalemSearchFieldRender.call(this, parent, id, fldInfo, controller);
}

CalemSearchDateRender.prototype=new CalemSearchFieldRender;
CalemSearchDateRender.prototype.constructor=CalemSearchDateRender;

CalemSearchDateRender.prototype.toString = function() { return "CalemSearchDateRender"; }

CalemSearchDateRender.prototype._createControl =
function(parentEl) {
	var len=this._tableDd.getDateInputLength(this._field);
	this._control=new CalemEditDate({parent: this._parent, type: DwtInputField.DATE, 
	              size: len,
	              errorIconStyle: CalemConf['view_engine']['field']['inputErrorIcon']});
	this._control.setValidStringLengths(null, len)	              ;
	
	this._control.reparentHtmlElement(parentEl);
	
	this.resumeView();          
}

CalemSearchDateRender.prototype._getFieldOps =
function() {
	return this._ops['date'];
}

//Value for server (such as string for date)
CalemSearchDateRender.prototype.getFieldDbValue =
function() {
	var date=this.getFieldValue();
	if (!date) return null;
	return new CalemDbDate(date);
} 

//Default implementation for all the read renders.
CalemSearchDateRender.prototype.resumeView =
function() {
	//To convert server time to local.    
	var val= this._getSearchValue();
	var dt;
	if (val) {
		dt=CalemTextUtil.formatLocalDateEdit(val);
	} else {
		dt=this.getNullReplacement();
	}
	this._control.setValue(dt, true);
}
