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
 * This is the module bar viewer.
 * 
 * Model: module configuration and list of modules.
 * Generated events: a) module selected; b) module customized (in the order).
 * Received events: a) changes of bar area sizes 
 */
 
/**
 * Constructor
 */
function CalemModBarView(parent, conf, modules, modSelectListener, modCustomizeListener) {
	DwtComposite.call(this, parent, "CalemModBarView", Dwt.ABSOLUTE_STYLE);
	this._parent=parent;
   this._conf=conf;
   this._modules=modules;
   this._selectListener=modSelectListener;
   this._localSelectListener=new AjxListener(this, this.onModSelection);
   this._customizeListener=modCustomizeListener;	
   this._createUi();
   //Getting the x and y pad value
   var cf=CalemConf['desktop_modView'];
   this._xOff=cf.xOff;
   this._yOff=cf.yOff;
   this._xPad=cf.xPad;
   this._yPad=cf.yPad;
} 

CalemModBarView.MODULE="MODULE";
CalemModBarView.BUTTON="_button";
CalemModBarView.ICON="_icon";
CalemModBarView.ICON_MORE="_iconMore";

CalemModBarView.prototype = new DwtComposite;
CalemModBarView.prototype.constructor = CalemModBarView;

CalemModBarView.prototype.toString = 
function() {
	return "CalemModBarView";
}

/**
 * Creating UI objects for use later
 */
CalemModBarView.prototype._createUi =
function() {
	if (this._uiRepo) delete this._uiRepo;
	this._uiRepo=new Object();
	//Creating a button and icon for each module
	for (var i=0; i< this._modules.length; i++) {
		var mod=this._modules[i];
		var modUi=new Object();
		this._uiRepo[mod.getId()]=modUi;
		//Creating an icon for the module
		var dwtBtn=new DwtButton(this, this._conf.buttonStyle, "MODButton", Dwt.ABSOLUTE_STYLE);
		dwtBtn.setText(mod.getTitle());
		dwtBtn.setImage(mod.getIcon());
		dwtBtn.setData(CalemModBarView.MODULE, mod);
		dwtBtn.addSelectionListener(this._localSelectListener);	
		dwtBtn.setVisible(false);
		modUi[CalemModBarView.BUTTON]=dwtBtn;
		//Creating icon
		dwtBtn=new DwtButton(this, null, "MODButton", Dwt.ABSOLUTE_STYLE);
		dwtBtn.setToolTipContent(mod.getTitle());
		dwtBtn.setImage(mod.getIcon());
		dwtBtn.setData(CalemModBarView.MODULE, mod);
		dwtBtn.addSelectionListener(this._localSelectListener);
		modUi[CalemModBarView.ICON]=dwtBtn;		
		dwtBtn.setVisible(false);
	}
	var iconUi=new Object();
	this._uiRepo[CalemModBarView.ICON_MORE]=iconUi;
	//Creating a moreIcon
	var moreConf=CalemConf["desktop_modBarViewMore"];
	dwtBtn=new DwtButton(this, null, "MODButton", Dwt.ABSOLUTE_STYLE);
	dwtBtn.setToolTipContent(CalemMsg[moreConf.id]);
	dwtBtn.setImage(moreConf.icon);
	iconUi[CalemModBarView.ICON]=dwtBtn;
	dwtBtn.setVisible(false);
} 

/**
 * Layout change event
 * @param layout {x:, y:, width:, height:}
 */
CalemModBarView.prototype.onLayoutChange =
function(param) {
	//Consider padding here
	param={x: param.x, y: param.y, width: param.width-this._xPad, height: param.height-this._yPad}
	this._bounds=param;
	this.setBounds(param.x, param.y, param.width, param.height);
	//figuring out number of buttons to display.
	var count=Math.floor(param.height/this._conf.buttonHeight);
	count= Math.max(count, this._conf.minButtonCount);
	count= Math.min(count, this._modules.length); 
	var iconCount=0;
	var iconModCount=0;
	var moreCount=0;
	if (count < this._modules.length) {
		count -=1; //Leave one button row out for icons.
		//Figure out how many icons to display.
		iconCount=Math.floor(param.width/this._conf.iconWidth);
		iconCount=Math.max(iconCount, this._conf.minIconCount);
		iconCount=Math.min(iconCount, this._modules.length-count);
		iconModCount=iconCount;
		if (this._modules.length > count + iconCount) {
			iconModCount--;
			moreCount= this._modules.length - count - iconModCount;
		}
	}
    if (CalemDebug.isDebug()) {
        CalemDebug.debug("buttonCount="+count+", iconModCount="+iconModCount+", moreCount="+moreCount);
    }
	
	//Let's hide all items we don't need to display
	this._hideModUi(count, this._modules.length, CalemModBarView.BUTTON);
	this._hideModUi(0, this._modules.length, CalemModBarView.ICON);
	this._hideMoreIcon(moreCount);
	
	//Display buttons
	var x=this._xOff;
	var y=this._yOff;
	var width=param.width;
	var height=this._conf.buttonHeight;
	for (var i=0; i< count; i++) {
		var mod=this._modules[i];
		modUi=this._uiRepo[mod.getId()];
		var dwtBtn=modUi[CalemModBarView.BUTTON];
		dwtBtn.setBounds(x, y, width, height);
		dwtBtn.setVisible(true);
		y+=height;
	}
	//Check for icons
	if (moreCount<=0 && iconCount<=0) return;
	//Avg out the width of icons.
	var iconWidth= Math.floor(param.width/iconCount);
	//Do iconCount first.
	for (var i=0; i< iconModCount; i++) {
		var j=count+i; //This is the module we're dealing with
		var mod=this._modules[j];
		var modUi=this._uiRepo[mod.getId()];
		var dwtBtn=modUi[CalemModBarView.ICON];
		dwtBtn.setBounds(x, y, iconWidth, height);
		dwtBtn.setVisible(true);
		x+=iconWidth;
	}
	//Decide if moreIcon is necessary.
	if (moreCount>0) {
		var iconUi=this._uiRepo[CalemModBarView.ICON_MORE];
		var dwtBtn=iconUi[CalemModBarView.ICON];
		dwtBtn.setVisible(true);
		dwtBtn.setBounds(x, y, iconWidth, height);
		//Now creating menu for the more icons
		var menu = new CalemModMenu(this); //the menu pop up can be displayed as needed.
		menu.setLocX(param.x+param.width);
	   dwtBtn.setMenu(menu, true);
	   //Let's creating menu items here.
	   for (var i=count+iconModCount; i< this._modules.length; i++) {
	   	var mod=this._modules[i];
	   	var mi=DwtMenuItem.create(menu, mod.getIcon(), mod.getTitle(), null, true, DwtMenuItem.RADIO_STYLE, 0);
	   	mi.setData(CalemModBarView.MODULE, mod);
	   	mi.addSelectionListener(this._localSelectListener);
	   }	
	}
}

/**
 * helper functions
 */
CalemModBarView.prototype._hideModUi =
function(start, end, type) {
	for (var i=start; i< end; i++) {
		var mod=this._modules[i];
		var modUi=this._uiRepo[mod.getId()];
		var btn=modUi[type];
		btn.setVisible(false);
	}
}

CalemModBarView.prototype._hideMoreIcon =
function(moreCount) {
	if (moreCount>0) return;
	var iconUi=this._uiRepo[CalemModBarView.ICON_MORE];
	var icon=iconUi[CalemModBarView.ICON];
	icon.setVisible(false);
}

/**
 * Module selection by user
 */
CalemModBarView.prototype.onModSelection =
function(ev) {
	var item = ev.item;
	this._selectListener.handleEvent(item.getData(CalemModBarView.MODULE));
}

/**
 * Module changes
 */
CalemModBarView.prototype.onModuleListChange =
function(modules) {
	this._modules=modules;
	this.onLayoutChange(this._bounds); //Mock a layout change event.
}

/**
 * Minimum width
 */
CalemModBarView.prototype.getMinWidth =
function() {
	return this._conf.minIconCount * this._conf.iconWidth;
} 

/**
 * Minimum height
 */
CalemModBarView.prototype.getMinHeight =
function() {
	return this._conf.minButtonCount * this._conf.buttonHeight;
} 


