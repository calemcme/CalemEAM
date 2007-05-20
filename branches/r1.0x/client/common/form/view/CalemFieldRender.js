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
 * CalemFieldRender
 *  
 */
function CalemFieldRender(parent, id, lbInfo, controller) {
	if (arguments.length==0) return;
	CalemUiRender.call(this, parent, id, lbInfo, controller);
   this._modelItem=this._controller.getDataModel().getModelItem();
   this._field=this._info.getField();
   this._tableDd=this._modelItem.getTableDd();
}

CalemFieldRender.prototype=new CalemUiRender;
CalemFieldRender.prototype.constructor=CalemFieldRender;

CalemFieldRender.prototype.toString = function() { return "CalemFieldRender"; }

CalemFieldRender.prototype.render =
function(parentEl, yOff, clsName) {
	//Overwrite
}

CalemFieldRender.prototype.setFocus =
function() {
	//Overwrite
}

/**
 * Get info about the field
 */
CalemFieldRender.prototype.getFieldInfo =
function() {
	return {fld: this._field};
} 

/**
 * Identify field render
 */
CalemFieldRender.prototype._renderField =
function(parentEl, yOff) {
	//Find the real render to do the job.
	var impl=this._controller.getFieldRender(this._tableDd.getNormalizedType(this._field));
	this._render=eval(['new ', impl, '(this._parent, this._id, this._info, this._controller)'].join(''));
	this._render.render(parentEl, yOff);
} 

/**
 * Read view handling.
 */
CalemFieldRender.prototype._getFieldRawValue =
function() {
	var rec=this._modelItem.getCurrentRecord();
	var val= rec ? rec.getField(this._field).getRawValue() : null;
   return val;
}

/**
 * Read view handling.
 */
CalemFieldRender.prototype._getFieldValueByRec =
function() {
	var rec=this._modelItem.getCurrentRecord();
	var val= rec ? rec.getField(this._field).getValue() : null;
	val = val ? val : this._getDefaultValue(rec);
   val = val ? val :  this.getNullReplacement();
   return val;
}

/**
 * Editing handling.
 */
CalemFieldRender.prototype._getFieldEditValueByRec =
function() {
	var rec=this._modelItem.getCurrentRecord();
	var val= rec ? rec.getField(this._field).getEditValue() : null;
	val = val ? val : this._getDefaultValue(rec);
   val = val ? val :  this.getNullReplacement();
   return val;
}

/**
 * Editing handling.
 */
CalemFieldRender.prototype._getFieldRawValueByRec =
function() {
	var rec=this._modelItem.getCurrentRecord();
	var val= rec ? rec.getField(this._field).getRawValue() : null;
	val = val ? val : this._getDefaultValue(rec);
   return val;
}

CalemFieldRender.prototype._getDefaultValue =
function(rec) {
	return null;
}