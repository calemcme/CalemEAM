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
 * CalemFormDesign
 * This is the form design widget.
 * 
 */
function CalemFormDesign(parent, formId, data, designId, dataModel) {
	if (arguments.length==0) return;
	this._designId=designId;
	this._parentDataModel=dataModel;
	CalemForm.call(this, parent, formId, data);	
	//Support save and cancel listener
	this._saveListener = new AjxListener(this, this.onSave);
	this._cancelListener = new AjxListener(this, this.onCancel);
	//Label edit listener
	this._labelEditListener = new AjxListener(this, this.onLabelEdit);
}

CalemFormDesign.prototype = new CalemForm;
CalemFormDesign.prototype.constructor = CalemFormDesign;

CalemFormDesign.prototype.toString = 
function() {
	return "CalemFormDesign";
}

/**
 * Form rendering first time - go ahead rendering the view.
 */
CalemFormDesign.prototype.showForm =
function() {
	this._showView();
}  

/**
 * Render factory
 */
CalemFormDesign.prototype.getFieldRender =
function(normType) {
	var render;
	if (!(render=CalemConf['view_engine']['viewDesign']['FieldRenders'][normType])) {
		render=CalemConf['view_engine']['viewDesign']['FieldRenders']['default'];
	} 
	return render;
}
 
CalemFormDesign.prototype.getRender =
function(info) {
	var render=CalemConf['view_engine']['viewDesign'][info.getClassName()];
	if (!render && info instanceof CalemFieldInfo) {
		render=this.getFieldRender(this._modelItem.getTableDd().getNormalizedType(info.getField()));
	}
	return render;
}

/**
 * Overwrite getId so the design forms having unique ids.
 */
CalemFormDesign.prototype.getId =
function() {
	return this._designId;
} 

/**
 * Listener providers
 */
CalemFormDesign.prototype.getSaveListener =
function() {
	return this._saveListener;
} 

CalemFormDesign.prototype.getCancelListener =
function() {
	return this._cancelListener;
} 

/**
 * Save handler
 */
CalemFormDesign.prototype.onSave =
function(ev) {
	this._onSave(ev);
} 

CalemFormDesign.prototype._onSave =
function(ev) {
	var data=ev.item.getData(CalemContext.DATA);
	var groups=data.event.getItems();
	//Collect acl and viewInfo.
	var customInfo=this._view.getCustomizedView();
	//Now let's make a soap call with busy signal
	var views={view_0: {id: customInfo.getId(), 
							  shared: this.getDesignTarget().isGroup() ? 1 : 0, 
							  target: this.getDesignTarget().getId(),
							  custom: Base64.encode(customInfo.getJson())}};
	CalemSoapUtil._onSoapCall('SaveView', views, new AjxCallback(this, this._onSoapSaveViewResponse, customInfo));
}

/**
 * Process soap response from server
 */
CalemFormDesign.prototype._onSoapSaveViewResponse =
function(customInfo, resp) {
	//This is single record so let's process it.
	var saveResp=resp[0];
	if (saveResp.status == CalemForm.SOAP_SUCC) { //Update local copy.
		this.addCustomInfo(customInfo);
		this._closeAndResumeParentForm(new CalemReRenderAction()); //Need to rerender form.
	} else { //Need to display error.
		//display error msg based on exception.
		var errorHandler;
		if (saveResp.errorInfo && saveResp.errorInfo.id) {
			errorHandler=eval(['new ', saveResp.errorInfo.id, '(saveResp.id, saveResp.errorInfo)'].join(''));
		} else {
			errorHandler=new CalemErrorInfo(saveResp.id)
		}
		CalemInfoDialog.showIt(CalemMsg.getMsg('error_server'), errorHandler.getMessage());
	}
}

/**
 * Cancel - just close the form
 */
CalemFormDesign.prototype.onCancel =
function(ev) {
	this._onCancel(ev);
} 

//close the design form.
CalemFormDesign.prototype._onCancel =
function() {
	this._closeAndResumeParentForm();
}


CalemFormDesign.prototype.getParentCustomInfo =
function() {
	return CalemCustomViewManager.getInstance().getParentCustomInfo(this.getViewId(), this.getDesignTarget());
}

CalemFormDesign.prototype.getMyCustomInfo =
function() {
	return CalemCustomViewManager.getInstance().getMyCustomInfo(this.getViewId(), this.getDesignTarget());
}

CalemFormDesign.prototype.addCustomInfo =
function(customInfo) {
	return CalemCustomViewManager.getInstance().addCustomInfo(customInfo, this.getDesignTarget());
}

CalemFormDesign.prototype.getParentDataModel =
function() {
	return this._parentDataModel;
}

//Label edit support
CalemFormDesign.prototype.getLabelEditListener =
function() {
	return this._labelEditListener;
}

//Displaying special label edit form.
CalemFormDesign.prototype.onLabelEdit =
function(evt) {
	var ctrl=evt.item.getData(CalemContext.DATA);
	var ebInfo=new CalemEmbedInfo(this._parent, 'CalemLabelFormEdit', {item: ctrl});
	this._embedForm(ebInfo);
}

//Customize a design form? Don't think so.
CalemFormDesign.prototype.allowCustomize =
function() {
	return false;
}
