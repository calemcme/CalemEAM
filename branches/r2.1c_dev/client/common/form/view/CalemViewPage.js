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
 * CalemViewPage
 * This is the page that host a view page.
 */
function CalemViewPage(parent, className, positionStyle) {
	if (arguments.length==0) return;
	
	className = className || "CalemViewPage";
	positionStyle = positionStyle || DwtControl.ABSOLUTE_STYLE;
	CalemFormTabViewPage.call(this, parent, className, positionStyle);
	//Controller list for embedding.
	this._controllers=[];
	//Visibility state
	this._state=CalemViewPage.STATE_NEW;
}

CalemViewPage.STATE_NEW = 0;
CalemViewPage.STATE_HIDE = 1;
CalemViewPage.STATE_SHOW = 2;

CalemViewPage.prototype = new CalemFormTabViewPage;
CalemViewPage.prototype.constructor = CalemViewPage;

CalemViewPage.prototype.toString = function() { return "CalemViewPage"; }

//Public APIs

// TabViewPage inherited methods
CalemViewPage.prototype.showMe =
function() {
	CalemFormTabViewPage.prototype.showMe.call(this);
	//Display form.
	if (this._state==CalemViewPage.STATE_HIDE) { //repaint.
		this.resumeHost();
	} else {
		this.showForm();
	} 
	this._state=CalemViewPage.STATE_SHOW;
}

//So the tab is hidden now.
CalemViewPage.prototype.setHideState =
function() {
	this._state=CalemViewPage.STATE_HIDE;
}

// TabViewPage inherited methods
CalemViewPage.prototype.resetSize = 
function(newWidth, newHeight)  {
	CalemFormTabViewPage.prototype.resetSize.call(this, newWidth, newHeight);
	//Is this tab visible? If yes, let's propagate the size change.
	if (this.getVisible()) {
		this.onLayoutChange();
	}
}

/**
 * Interfaces for subclass to overwrite.
 */
CalemViewPage.prototype.resumeHost =
function(action) {
	this._controller.resumeHostForm(action);
}

CalemViewPage.prototype.showForm =
function() {
	this._controller.showForm();
}

CalemViewPage.prototype.onLayoutChange =
function() {
	this._controller.onLayoutChange();
}

/**
 * This is from a) FormTabView or the desktop or for an embedded controller.
 */
CalemViewPage.prototype.addController =
function(controller) {
	if (this._controllers.length==0) {//This is the root controller
		this._rootController=controller;
	}
	this._controllers.splice(0, 0, controller);
	this._controller=controller;
	this._controller.setViewHolder(this); //Link it both ways.
} 

/**
 * Embed a controller
 */
CalemViewPage.prototype.embedController =
function(ebInfo) {
	this._controller.setViewVisible(false); //Hide current view.
	//setup the controller here.
	this._setupController(ebInfo);
}

/**
 * Set up a controller by either locating one or creating a new one.
 */
CalemViewPage.prototype._setupController =
function(ebInfo)  {
	var found=false;
	//Skip the current controller.
	for (var i=1; i< this._controllers.length; i++) {
		if (this._controllers[i].getId() == ebInfo.getId()) {//Found it.
			found=true;
			//Set the controller to be  the current one.
			this._controller=this._controllers[i];
			this._controllers.splice(i, 1); //Delete the controller from the array first.
			this._controllers.splice(0, 0, this._controller); //Move it to the first.
			break;
		}
	}
	if (CalemDebug.isDebug()) CalemDebug.debug("Embed controller found: "+found+", id="+ebInfo.getId());
	//Prepare the controller for use.
	if (found) { //Reinstantiate it for current situation.
		this._controller.setViewVisible(true); //Make view visible first.
		ebInfo.instantiate(this._controller);
		this.resumeHost(); //2nd time.
	} else {//Creating one for use.
		var cl=ebInfo.create();
		this.addController(cl);
		this.showMe(); //First time.
	}
 }

/**
 * Resume host controller
 */
CalemViewPage.prototype.closeAndResumeParentController =
function(action) {	
	//If we're closing the root controller, than let's close the form.
	if (this._rootController==this._controllers[0]) {
		//There's no embed form...so let the formTabView handle it.
		this.parent.closeCurrentForm();
	} else {//restore host controller.
		//Each controller can decide if it needs to be cached (such as lookup for db and cached data).
		if (this._controller.getCacheEmbedOnClose()) {//Keep it in cache
			this._controller.setViewVisible(false);
			this._controllers.splice(0, 1); //Remove current controller from the head;
			this._controllers.push(this._controller); //Move it to the end of the queue.							
		} else { //Shutdown the embed controller.
			this._controllers.splice(0, 1); //Remove current controller;
			var embedController=this._controller;
			embedController._shutdown(); //disconnect all the external links.
			embedController._removeView();
		}
		//Restore the host controller
		this._controller=this._controllers[0];
		this._controller.setViewVisible(true);
		this.resumeHost(action);
	}
} 

/**
 * Force current form to close.
 */
CalemViewPage.prototype.closeForm =
function(action) {	
	this.parent.closeCurrentForm(action);
}

/**
 * Close and shutdown handling
 */
CalemViewPage.prototype.canClose =
function(callback) { //Forward to the top controller to make a decision.
	this._controller._canClose(callback);
}

CalemViewPage.prototype.shutdown =
function() {//each form must shutdown itself.
	for (var i=0; i< this._controllers.length; i++) {
		this._controllers[i]._shutdown();
	}
	//Remove all the controllers for GC
	this._controllers.splice(0, this._controllers.length);
}

/**
 * The buck stops here.
 */
CalemViewPage.prototype.getElVisible =
function() {
	return this.getVisible();
}

/**
 * Get the host controller
 */
CalemViewPage.prototype.getHostForm =
function(idx) {
	idx = idx ? idx : 1;
	return this._controllers[idx];
} 

CalemViewPage.prototype.getActiveController =
function() {
	return this._controller;
}

