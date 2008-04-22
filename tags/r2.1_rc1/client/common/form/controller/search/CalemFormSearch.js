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
 * CalemFormSearch
 * This is the search form
 * 
 */
function CalemFormSearch(parent, formId, data) {
	if (arguments.length==0) return;
	CalemForm.call(this, parent, formId, data);
	//Cancel
	this._cancelListener=new AjxListener(this, this.onCancel);
}

CalemFormSearch.prototype = new CalemForm;
CalemFormSearch.prototype.constructor = CalemFormSearch;

CalemFormSearch.prototype.toString = function() { return "CalemFormSearch"; }

/**
 * Data model is copied over and will not load data
 * <code>this._dataModel</code> is copied over by sub-classes.
 */
CalemFormSearch.prototype._createDataModel =
function(data) {	
	var impl= CalemConf['desktop_mainView']['form']['modelImpl'];
	var mdId=this._dataModel.getId();
	this._dataModel=eval(['new ', impl, '(mdId, this, data)'].join(''));
	this._modelItem=this._dataModel.getModelItem();
	this.setDataLoaded(true); //will not load data.
}

// default is CalemView
CalemFormSearch.prototype.createView =
function() {
	CalemForm.prototype.createView.call(this);
	this._view.setScrollStyle(Dwt.SCROLL);
}

 
//Cancel listener
CalemFormSearch.prototype.getCancelListener =
function() {
	return this._cancelListener;
} 

CalemFormSearch.prototype.onCancel =
function() {
	this._onCancel();
} 

//Default implementation
CalemFormSearch.prototype._onCancel =
function() {
	this._closeAndResumeParentForm(); //Since it's cached.
}  

//Find read renders
CalemFormSearch.prototype.getRender =
function(info) {
	var render;
	if (!(render=CalemConf['view_engine']['viewSearchRender'][info.getClassName()])) {
		render=CalemForm.prototype.getRender.call(this, info);
	} 
	return render;
}

CalemFormSearch.prototype.getFieldRender =
function(normType) {
	var render;
	if (!(render=CalemConf['view_engine']['viewSearchRender']['FieldRenders'][normType])
	  &&!(render=CalemConf['view_engine']['viewSearchRender']['FieldRenders']['default'])) {
		render=CalemForm.prototype.getFieldRender.call(this, normType);
	} 
	return render;
}
