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
 * CalemAclGroupFormList
 */
function CalemAclGroupFormList(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormList.call(this, parent, formId, data);
	//acl design listener
	this._groupAclDesignListener=new AjxListener(this, this.onGroupAclDesign);
}

CalemAclGroupFormList.prototype = new CalemFormList;
CalemAclGroupFormList.prototype.constructor = CalemAclGroupFormList;

CalemAclGroupFormList.prototype.toString = function() { return "CalemAclGroupFormList";}

/**
 * Business APIs
 */
CalemAclGroupFormList.prototype._onNew =
function(evt) {
    //To embed new form.
    var ebInfo=new CalemEmbedInfo(this._parent, 'CalemAclGroupFormNew');
	this._embedForm(ebInfo);
} 

/**
 * Open a master detailed view with recordlist and current record position.
 */
CalemAclGroupFormList.prototype._onOpen =
function(evt) {	
	//Get the selection event
	var item=CalemEvent.getItem(evt);
	//Prepare data for master detail view.
	var data = {modelItem: this._modelItem, item: item};
	//embed read form here.
    var ebInfo=new CalemEmbedReadInfo(this._parent, 'CalemAclGroupFormRead', data);
    this._embedForm(ebInfo);
} 

/**
 * Deletion must be handled specially
 */
CalemAclGroupFormList.prototype.onDelete =
function(evt) {
	//If there're detailed records do not allow a deletion.
	var rec=CalemEvent.getItem(evt);
	CalemAclGroupBo.getInstance().canDelete(rec, new AjxCallback(this, this.onDeleteBoCallback, {evt: evt}));
}

/**
 * Access design listener
 */
CalemAclGroupFormList.prototype.getGroupAclDesignListener =
function() {
	return this._groupAclDesignListener;
} 

CalemAclGroupFormList.prototype.onGroupAclDesign =
function(evt) {
	//Get the selection event
	var item=CalemEvent.getItem(evt);
	this._setSystemDesignTarget(true, item);
	//embed like a read.
    var ebInfo=new CalemEmbedReadInfo(this._parent, 'CalemModuleFormList', {item: item});
    this._embedForm(ebInfo);
} 

/**
 * Set system design target scope
 */
CalemAclGroupFormList.prototype._setSystemDesignTarget =
function(set, grpRec) {
	var dt=null;
	if (set) {
		dt=new CalemDesignTargetInfo(CalemDesignTargetInfo.GROUP, grpRec.id, grpRec.getField('acl_group').getValue());
	}
	CalemDesignTargetInfo.setSystemDesignTarget(dt);
}

CalemAclGroupFormList.prototype._shutdown =
function() {
	this._setSystemDesignTarget(false);
	CalemFormList.prototype._shutdown.call(this);
}
