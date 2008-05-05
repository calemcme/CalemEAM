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
 * This is the module view.
 * 
 * It's an aggregate view of CalemModBarView and CalemModSumView.
 * Generated events: resizing for ModBarView and ModSumView
 * Received events: layoutChange; module selection; 
 */
 
/**
 * Constructor
 */
function CalemModView(parent, modules, modSelectListener, modCustomizeListener) {
	this._parent = parent;
	//barView
	this._modBarView=new CalemModBarView(this._parent, CalemConf["desktop_modBarView"], modules, modSelectListener, modCustomizeListener);
	this._modBarView.zShow(true);
	//sumView
	this._module= modules ? modules[0] : null; //Default module.
	this._modSumView=this._module.getModsum();
	if (this._modSumView) this._modSumView.zShow(true);
	//Init bounds
	this._modConf=CalemConf["desktop_modView"];
	//Use a scheduled action to control the repainting
	this._modViewChanged=new AjxTimedAction(this, this.onSashChanged);
	//Sash to separate barView and sumView
	this._modSash = new DwtSash(parent, DwtSash.VERTICAL_STYLE, "AppSash-vert", this._modConf['sashLimist']);
	this._modSash.registerCallback(this.onSashMove, this);
	this._modSash.zShow(true);
} 

/**
 * Module selection
 * @param CalemModule the current module selected.
 */
CalemModView.prototype.onModuleSelection =
function(mod) {
	if (this._module==mod) return; //No real change.
	this._module=mod;
	this._modSumView=this._module.getModsum();
	if (this._modSumView) this._modSumView.onLayoutChange(this._modSumBounds);
} 

/**
 * Layout changes from outside
 * @param Object {x, y, w, h}
 */
CalemModView.prototype.onLayoutChange =
function(param) {
	//Fix the case when IE does not pass the bounds correctly.
	if (param.height < this._modBarView.getMinHeight() ) {
		if (CalemDebug.isInfo()) {
			CalemDebug.info("Module view bounds not valid, ignore: {x="+param.x+", y="+param.y+
		                ", width="+param.width+", height="+param.height+"}, minModBarHeight="+this._modBarView.getMinHeight());
		}
		return;		                
	}
	this._bounds=param;
	this._setBounds(param);
	//modSumView update
	if (this._modSumView) this._modSumView.onLayoutChange(this._modSumBounds);
	//Sash repositioning
	this._modSash.setBounds(this._sashBounds.x, this._sashBounds.y, this._sashBounds.width, Dwt.DEFAULT);
	//modBarView update
	this._modBarView.onLayoutChange(this._modBarBounds);
}

CalemModView.prototype._setBounds =
function(param) {
	//Set sash bounds only the first time.
	if (!this._sashBounds) {//First time displaying the sash.
	   this._sashBounds = Dwt.getBounds(this._modSash.getHtmlElement()); //get sashBounds to find out the height of the sash.
	   var sashY=param.y + (param.height-this._modConf.modBarHeight-this._sashBounds.height);
	   this._sashBounds={x: param.x, y: sashY, width: param.width, height: this._sashBounds.height};
	} else {//Sash bounds to be inline with the outer bounds
		this._sashBounds.width=param.width;
	}
	//Fix the case when desktop is resized to have toolbar out of client area.
	if (param.height < this._sashBounds.y) { //let's adjust a bit.
		this._sashBounds.y= param.y + (param.height-this._modConf.modBarHeight-this._sashBounds.height);
	}
	//Set modSum bounds
	this._modSumBounds={x: param.x, y: param.y, width: param.width, height: this._sashBounds.y - param.y};
	//Set modBar bounds
	var barY=this._sashBounds.y+this._sashBounds.height;
	this._modBarBounds={x: param.x, y: barY, width: param.width, height:param.height - (barY - param.y)};
}

/**
 * Clint area sash sizing
 * @param int 	Width of the sash for ModView
 * @return boolean if the width is less than the minimum width of the ModBar.
 */
CalemModView.prototype.widthAllowed =
function(width) {
	return (width > this._modBarView.getMinWidth());
}

CalemModView.prototype.getInitWidth = 
function() {
	return this._modConf.modViewWidth;
}

CalemModView.prototype.getMinWidth =
function() {
	return this._modConf['minModWidth'];
}

/**
 * Sash move attemp
 */
CalemModView.prototype.onSashMove =
function(delta) {
	var absDelta = Math.abs(delta);
	// Only sashBounds is updated so let's use it due to timed action.
	if (delta < 0 && absDelta >= this._sashBounds.y - this._bounds.y) {
		return 0; //Cannot exceed the starting point.
	} else {
		var barH= this._bounds.height - (this._sashBounds.y - this._bounds.y + this._sashBounds.height) - delta;
		if (barH < this._modBarView.getMinHeight()) return 0;
	}
	//Accepting the changes
	this._sashBounds.y += delta;
	//Use timed action
	AjxTimedAction.scheduleAction(this._modViewChanged, this._modConf['redrawDelay']);
	return delta; //Always stop here.
}

CalemModView.prototype.onSashChanged =
function() {
	this.onLayoutChange(this._bounds);
} 


