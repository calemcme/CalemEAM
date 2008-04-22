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
 * These are data model bound buttons.
 */
function CalemTbButton(parent, style, className) {
	if (arguments.length==0) return;
	DwtButton.call(this, parent, style, className);
	//Use one event handler.
	this._selectionListener=new AjxListener(this, this.onSelection);
} 

CalemTbButton.prototype = new DwtButton;
CalemTbButton.prototype.constructor = CalemTbButton;

CalemTbButton.prototype.toString = function() { return "CalemTbButton";}

/**
 * Events setup
 */
CalemTbButton.prototype.setupEvents =
function(btnInfo, controller) {
	this._btnInfo=btnInfo;
	this._controller=controller;
	var eventMap;
	if (!btnInfo.getCustomInfo() || !(eventMap=btnInfo.getCustomInfo().getEventMap())) return;
	var modelItem=controller.getDataModel().getModelItem();
	this._table=modelItem.getTableDd().getTableName();
	for (var i in eventMap) {
		var event= eventMap[i];
		modelItem.addListener(event.getId(), this._selectionListener);
	}
}

/**
 * Event handler
 */
CalemTbButton.prototype.onSelection =
function(evt) {
	this.setData(CalemContext.DATA, {event: evt, table: this._table});
	var eventMap=this._btnInfo.getCustomInfo().getEventMap();
	var func=eventMap[evt.getType()].getFunction();
	eval(['this.', func, '();'].join(''));
}

/**
 * Stock functions for enable/disable button
 */
CalemTbButton.prototype._enableIt=
function() {
	this.setEnabled(true);
}

CalemTbButton.prototype._disableIt=
function() {
	this.setEnabled(false);
}

//Notify listener - mimic a click selection.
CalemTbButton.prototype._clickIt=
function() {
	var selEv = DwtShell.selectionEvent;
   selEv.item = this;
   selEv.detail = 0;
   this.notifyListeners(DwtEvent.SELECTION, selEv);
}

/**
 * shutdown - to remove all the listeners
 */
CalemTbButton.prototype._shutdown =
function() {
	//Remove listeners registered in other components
	this._removeEventListeners();
	//Remove selection listeners
	this.removeSelectionListeners();
}  

/**
 * Events setup
 */
CalemTbButton.prototype._removeEventListeners =
function() {
	var eventMap;
	if (!this._btnInfo.getCustomInfo() || !(eventMap=this._btnInfo.getCustomInfo().getEventMap())) return;
	var modelItem=this._controller.getDataModel().getModelItem();
	for (var i in eventMap) {
		var event= eventMap[i];
		modelItem.removeListener(event.getId(), this._selectionListener);
	}
}
