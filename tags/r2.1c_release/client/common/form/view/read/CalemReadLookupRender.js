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
 * CalemReadLookupRender
 * Render field in read view (no change is allowed).
 *  
 */
function CalemReadLookupRender(parent, id, fldInfo, controller) {
	if (arguments.length==0) return;
	CalemFieldReadRender.call(this, parent, id, fldInfo, controller);
}

CalemReadLookupRender.prototype=new CalemFieldReadRender;
CalemReadLookupRender.prototype.constructor=CalemReadLookupRender;

CalemReadLookupRender.prototype.toString = function() { return "CalemReadLookupRender"; }

CalemReadLookupRender.prototype.render =
function(parentEl, yOff) {
	this._initFieldInfo();
	if (this._lkupDd.isTextField(this._lkupFld)) {
		this._control=new CalemReadText({parent: this._parent, type: DwtInputField.STRING, 
	              size: this._lkupDd.getTextDisplayLength(this._lkupFld),
	              rows: this._lkupDd.getTextDisplayRows(this._lkupFld)});
	} else {
		this._control=new CalemReadDefault({parent: this._parent, type: DwtInputField.STRING, 
	              size: this._tableDd.getTextReadLength(this._field)});
	}
	this._control.reparentHtmlElement(parentEl);
	var val= this._getFieldValueByRec();
	this._control.setValue(val);             
}

CalemReadLookupRender.prototype._initFieldInfo =
function() {
	this._lkupDd=this._tableDd.getLookupTableDd(this._field);
	this._lkupFld=this._lkupDd.getPrimaryLookup();
}

