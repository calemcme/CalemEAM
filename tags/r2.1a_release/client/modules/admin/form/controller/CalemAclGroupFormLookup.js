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
 * CalemAclGroupFormLookup
 */
function CalemAclGroupFormLookup(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormLookup.call(this, parent, formId, data);
}

CalemAclGroupFormLookup.prototype = new CalemFormLookup;
CalemAclGroupFormLookup.prototype.constructor = CalemAclGroupFormLookup;

CalemAclGroupFormLookup.prototype.toString = function() { return "CalemAclGroupFormLookup";}

/**
 * Business APIs
 */
CalemAclGroupFormLookup.prototype._onNew =
function(evt) {
    //To embed new form.
    var ebInfo=new CalemEmbedInfo(this._parent, 'CalemAclGroupFormNew');
	this._embedForm(ebInfo);
} 

/**
 * Open a master detailed view with recordlist and current record position.
 */
CalemAclGroupFormLookup.prototype._onOpen =
function(evt) {
	//To embed read form.
   var ebInfo=new CalemEmbedInfo(this._parent, 'CalemAclGroupFormRead');
	this._embedForm(ebInfo);
} 

/**
 * Deletion must be handled specially
 */
CalemAclGroupFormLookup.prototype.onDelete =
function(evt) {
	//If there're detailed records do not allow a deletion.
	var rec=CalemEvent.getItem(evt);
	CalemAclGroupBo.getInstance().canDelete(rec, new AjxCallback(this, this.onDeleteBoCallback, {evt: evt}));
}