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
 * This is the base controller.
 */
function CalemController(parent) {
	if (arguments.length==0) return;
	CalemModel.call(this, true);
	this._parent=parent;
	this._listenerFactory = new AjxCallback(this, this.getListener);
	this.openFormListener=new AjxListener(this, this.onOpenForm);
}

CalemController.prototype=new CalemModel;
CalemController.prototype.constructor=CalemController;

CalemController.prototype.toString = 
function() {
	return "CalemController";
}

/**
 * Listener factory
 */
CalemController.prototype.getListenerFactory = 
function() {
	return this._listenerFactory;
} 

CalemController.prototype.getListener =
function(name) {
	return eval(['this.get',name, '()'].join(''));
}

/**
 * Common listener getters
 */
CalemController.prototype.getOpenFormListener =
function() {
	return this.openFormListener;
}

/**
 * Default listeners
 */
CalemController.prototype.onOpenForm =
function(ev) {
	var id=ev.item.getData(CalemContext.DATA);
	CalemContext.getInstance().openForm(id);
} 

 