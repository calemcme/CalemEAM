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
 * CalemToolBarDesignRender
 *  
 */
function CalemToolBarDesignRender(parent, id, tbInfo, controller) {
	if (arguments.length==0) return;
	CalemUiDesignRender.call(this, parent, id, tbInfo, controller);
}

CalemToolBarDesignRender.prototype=new CalemUiDesignRender;
CalemToolBarDesignRender.prototype.constructor=CalemToolBarDesignRender;

CalemToolBarDesignRender.prototype.toString = function() { return "CalemToolBarDesignRender"; }

CalemToolBarDesignRender.prototype.render =
function(parentEl, yOff) {
	this._control=new CalemToolBarDesign(this._parent, {parentEl: parentEl});
	this._customInfo=this._parentRender.getCustomInfo();
	this._control.createToolBar(this._info, this._controller.getListenerFactory(), this._controller, this._dragSrc, this._dropTarget, this._customInfo);
	this._control.zShow(true);
	//Sneak in a render property for checking back.
	this._control._parentRender=this;
}

/**
 * shutdown - to remove all the listeners
 */
CalemToolBarDesignRender.prototype._shutdown =
function() {
	//Nothing to do here.
}  

