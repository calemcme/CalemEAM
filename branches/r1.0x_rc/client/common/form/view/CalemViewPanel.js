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
 * CalemViewPanel
 * A view panel hosts a CalemView.
 */
function CalemViewPanel(parent, className, positionStyle) {
	if (arguments.length==0) return;
	className = className || "CalemViewHolder";
	DwtComposite.call(this, parent, className, positionStyle);
}

CalemViewPanel.prototype = new DwtComposite;
CalemViewPanel.prototype.constructor = CalemViewPanel;

CalemViewPanel.prototype.toString = function() { return "CalemViewPanel"; }

//Public APIs

// TabViewPage inherited methods
CalemViewPanel.prototype.showMe =
function() {
	this._controller.showForm();
}

// Resume view
CalemViewPanel.prototype.resumeHost =
function() {
	this._controller.resumeHostForm();
}

// TabViewPage inherited methods
CalemViewPanel.prototype.resetSize = 
function(newWidth, newHeight)  {
	this.setSize(newWidth, newHeight); //finish the change.
	//Is this tab visible? If yes, let's propagate the size change.
	if (this.getVisible()) {
		this._controller.onLayoutChange();
	}
}

/**
 * Visibility
 */
CalemViewPanel.prototype.getElVisible =
function() {
	if (!this.getVisible()) return false;
	else return this.parent.getElVisible();
}

/**
 * Embed controller
 */
CalemViewPanel.prototype.embedController =
function(controller) {
	this.parent.embedController(controller);
} 

//For ViewMdTab use.
CalemViewPanel.prototype.closeAndResumeParentController =
function(action) {
	this.parent.closeAndResumeParentController(action);
} 