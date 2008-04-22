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
 * CalemEditLookupRender
 * Render lookup edit field.
 *  
 */
function CalemEditLookupRender(parent, id, fldInfo, controller) {
	if (arguments.length==0) return;
	CalemEditRender.call(this, parent, id, fldInfo, controller);
}

CalemEditLookupRender.prototype=new CalemEditRender;
CalemEditLookupRender.prototype.constructor=CalemEditLookupRender;

CalemEditLookupRender.prototype.toString = function() { return "CalemEditLookupRender"; }

CalemEditLookupRender.prototype.render =
function(parentEl, yOff) {
	this._initFieldInfo();
	//Use text field if the length of text is over a limit.
	var len=this._lkupDd.getTextInputLength(this._lkupFld); //This is the lookup info.
	var doAc=false; //Auto-completion.
	if (this._lkupDd.isTextField(this._lkupFld)) {
		this._control=new CalemEditTextLookup({parent: this._parent, type: DwtInputField.STRING, 
	              size: this._lkupDd.getTextDisplayLength(this._lkupFld),
	              rows: this._lkupDd.getTextDisplayRows(this._lkupFld),
	              //Note: must have error icon set so DwtInputField will render it as a string first.
	              errorIconStyle: CalemConf['view_engine']['field']['inputErrorIcon']});
	} else {
		doAc=true; //Do AC for normal edit only.
		this._control=new CalemEditLookup({parent: this._parent, type: DwtInputField.STRING, 
	              size: len, errorIconStyle: CalemConf['view_engine']['field']['inputErrorIcon']});
	}
	this._control.setValidStringLengths(null, len);
	if (this._tableDd.isRequired(this._field)) {
		this._control.setRequired(true);
	}
	this._control.reparentHtmlElement(parentEl);
	//set up other stuff here.
	var lkupFm=CalemFormDef._getLookupForm(this._lkupDd.getTableName(), this._field, this._controller);
	this._control.setLookupForm(lkupFm);

	this._control.setController(this._controller);
	//set up validator here
	this._control.setValidator(this, this._onValidator);
	//Now get both id and value here.
	this.resumeView();          
	//Init AC
	if (doAc) {
		this._control.setupAc(this._field, this._lkupFld, this._lkupDd);
	}
}

//Impl for edit lookup.
CalemEditLookupRender.prototype.resumeView =
function() {
	var rec=this._modelItem.getCurrentRecord();
	var fld=rec.getField(this._field);
	val= this._getFieldEditValueByRec();
	var id = fld.getRawValue();
   this._control.setValue(id, val, true);  //No validation
}

CalemEditLookupRender.prototype._initFieldInfo =
function() {
	this._lkupDd=this._tableDd.getLookupTableDd(this._field);
	var map=lkupDd.getLookupMapping();
	this._lkupFld=this._lkupDd.getPrimaryLookup();
}

CalemEditLookupRender.prototype.getFieldInfo =
function() {
	return {fld: this._field, lkupFld: this._lkupFld};
}

CalemEditLookupRender.prototype._onValidator =
function(value, callback) {//Use cache util for this purpose.
	//This could require a callback situation when validation is done from database...
	this._controller.validateLookup(this._lkupDd.getTableName(), this._lkupFld, this._field, value, callback);
}

CalemEditLookupRender.prototype.enable = 
function() {
	this._control.enable();
}

CalemEditLookupRender.prototype.disable = 
function() {
	this._control.disable();
}

CalemEditLookupRender.prototype.setFieldValue =
function(fv) {
	this._control.setValueByLkup(fv.id, fv.value);
}



