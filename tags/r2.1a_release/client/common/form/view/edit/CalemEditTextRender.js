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
 * CalemEditTextRender
 * Render string edit field.
 *  
 */
function CalemEditTextRender(parent, id, fldInfo, controller) {
	if (arguments.length==0) return;
	CalemEditRender.call(this, parent, id, fldInfo, controller);
}

CalemEditTextRender.prototype=new CalemEditRender;
CalemEditTextRender.prototype.constructor=CalemEditTextRender;

CalemEditTextRender.prototype.toString = function() { return "CalemEditTextRender"; }

CalemEditTextRender.prototype.render =
function(parentEl, yOff) {
	this._control=new CalemEditText({parent: this._parent, type: DwtInputField.STRING, 
	              size: this._tableDd.getTextDisplayLength(this._field),
	              rows: this._tableDd.getTextDisplayRows(this._field),
	              //Note: must have error icon set so DwtInputField will render it as a string first.
	              errorIconStyle: CalemConf['view_engine']['field']['inputErrorIcon']});
	var len=this._tableDd.getTextInputLength(this._field);	              
   if (len!=null) {	              
		this._control.setValidStringLengths(null, len);
   }
	if (this._tableDd.isRequired(this._field)) {
		this._control.setRequired(true);
	}
	this._control.reparentHtmlElement(parentEl);
	var val= this._getFieldValueByRec();;
	this._control.setValue(val, true);            
}

//fieldValue
CalemEditTextRender.prototype.getFieldValue =
function() {
	var val= this._control.getFieldValue();
	val = val ? val.trim() : val;
	return val;
}

//Value for server (such as string for date)
CalemEditTextRender.prototype.getEditFieldServerValue =
function() {
	return this.getFieldValue();
} 
