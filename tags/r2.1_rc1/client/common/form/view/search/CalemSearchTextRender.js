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
 * CalemSearchTextRender
 * Render string edit field.
 *  
 */
function CalemSearchTextRender(parent, id, fldInfo, controller) {
	if (arguments.length==0) return;
	CalemSearchFieldRender.call(this, parent, id, fldInfo, controller);
}

CalemSearchTextRender.prototype=new CalemSearchFieldRender;
CalemSearchTextRender.prototype.constructor=CalemSearchTextRender;

CalemSearchTextRender.prototype.toString = function() { return "CalemSearchTextRender"; }

CalemSearchTextRender.prototype._createControl =
function(parentEl) {
	this._control=new CalemEditText({parent: this._parent, type: DwtInputField.STRING, 
	              size: this._tableDd.getTextDisplayLength(this._field),
	              rows: this._tableDd.getTextDisplayRows(this._field),
	              //Note: must have error icon set so DwtInputField will render it as a string first.
	              errorIconStyle: CalemConf['view_engine']['field']['inputErrorIcon']});
	var len=this._tableDd.getTextInputLength(this._field);	              
   if (len!=null) {	              
		this._control.setValidStringLengths(null, len);
   }
	this._control.reparentHtmlElement(parentEl);
	this.resumeView();            
}

//resumeView
CalemSearchTextRender.prototype.resumeView =
function() {
	var val= this._getSearchValue();
	val = val ? val : this.getNullReplacement();
   this._control.setValue(val, true);  //No validation
}

CalemSearchTextRender.prototype._getFieldOps =
function() {
	return this._ops['text'];
}

//fieldValue
CalemSearchTextRender.prototype.getFieldValue =
function() {
	var val= this._control.getFieldValue();
	val = val ? val.trim() : val;
	return val;
}

//Value for server (such as string for date)
CalemSearchTextRender.prototype.getFieldDbValue =
function() {
	var val=this.getFieldValue();
	if (!val) return null;
	return new CalemDbString(val);
} 
