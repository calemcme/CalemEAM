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
 * This is the base toolbar class.
 */
 
/**
 * Constructor
 */
function CalemToolBar(parent, posInfo, tbInfo, className, posStyle, cellSpacing, cellPadding, style) {
	if (arguments.length==0) return;
	if (tbInfo) {
		className= tbInfo.className ? tbInfo.className : className;
		posStyle=tbInfo.posStyle ? tbInfo.posStyle : posStyle;
		cellSpacing=tbInfo.cellSpacing? tbInfo.cellSpacing : cellSpacing;
		cellPadding=tbInfo.cellPadding? tbInfo.cellPadding : cellPadding;
		style=tbInfo.style? tbInfo.style : style;
	}
	DwtToolBar.call(this, parent, className, posStyle, cellSpacing, cellPadding, style);
	//Adjust its position here.
	if (posInfo) {
		if (posInfo.parentId) {//associate it with parent element.
			var htmlEl=document.getElementById(posInfo.parentId);
			Dwt.removeChildren(htmlEl);
			this.reparentHtmlElement(htmlEl);
		} else if (posInfo.parentEl) {
			this.reparentHtmlElement(posInfo.parentEl);
		} else if (posInfo.bzEl) {
			var htmlEl = document.getElementById(posInfo.bzEl);
			var bz=Dwt.getBounds(htmlEl);
			this.setBounds(bz.x, bz.y, bz.width, bz.height);
		}
	}
	//Set up the collection here.
	this._buttons=new Object();
	this._conf=CalemConf['menuListInfo'];
} 

CalemToolBar.prototype = new DwtToolBar;
CalemToolBar.prototype.constructor = CalemToolBar;

CalemToolBar.prototype.toString = 
function() {
	return "CalemToolBar";
}

/**
 * Check acl
 */
CalemToolBar.prototype._checkAcl =
function(id) {
	return (this._customInfo) ? this._customInfo.checkTbAcl(id) : true;
} 

/**
 * Create the toolbar.
 * @param toolbarInfo - toolbar info
 * @param listenerFactory - use this factory method to get listener.
 */
CalemToolBar.prototype.createToolBar =
function(tbInfo, listenerFactory, controller, customInfo) {
	this._listenerFactory=listenerFactory;
	this._controller= controller;
	this._customInfo=customInfo;
	
	this._setupTbMapAndLayout(tbInfo, customInfo);
	
	for (var i=0; i< this._layout.length; i++) {
		var itemInfo=this._map[this._layout[i]];
		
		//m06 - customize for admin
		if (this._layout[i]==CalemConst.TB_CUSTOMIZE && !CalemBoUtil.isUserInAdminGroup()) continue;
		
		//Check acl here
		if (!this._checkAcl(this._layout[i])) continue; //Acled out.
		
		//Now creating toolbar
		if (itemInfo instanceof CalemSeparator) {
			this.addSeparator(itemInfo.getClassName(), null, itemInfo);
		} else if (itemInfo instanceof CalemLabelInfo) {
			this.addLabel(itemInfo);
		} else if (itemInfo instanceof CalemMenuInfo) {
			this.addMenu(itemInfo);
		} else if (itemInfo instanceof CalemButtonInfo) {
			this.addButton(itemInfo);
		} else if (itemInfo instanceof CalemMenuItemInfo) {
			this.addButton(itemInfo);
		} else {
			CalemDebug.error("unknown menuInfo: "+itemInfo);
		}
	}
	/**
	 * This is to prevent Admin from locking out from customization  
	 * a) Current user is in CUSTOM_SYSTEM group
	 * b) Customize button is not in the layout but in acl
	 * c) The controller is customizable (i.e., not a design form)
	 */	 
	 if (this._controller && this._controller.allowCustomize && this._controller.allowCustomize()
	   && CalemBoUtil.isUserInAdminGroup()
	   && this._map[CalemConst.TB_CUSTOMIZE] //It's in the list
	   && !this._checkAcl(CalemConst.TB_CUSTOMIZE) ) {
	 	this.addButton(this._map[CalemConst.TB_CUSTOMIZE]);
	 }
}

/**
 * Setup toolbar
 * - layout is a list of ids
 * - map is the item maps
 */
CalemToolBar.prototype._setupTbMapAndLayout =
function(tbInfo, customInfo) {
	this._map=new Object();
	var list=tbInfo.getList();
	for (var i=0; i< list.length; i++) this._map[list[i].getId()]=list[i];
	this._layout=tbInfo.getLayout();
	//Use custom info for the list.
	if (customInfo && customInfo.getLayout()) {
		this._layout=customInfo.getLayout().getTbLayout();
	}
}

/**
 * Adding a button to the toolbar
 */
CalemToolBar.prototype.addButton =
function(btnInfo) {
	var def=btnInfo.getDef();
	var btn=new CalemTbButton(this, btnInfo.getBtnStyle(), btnInfo.getBtnClassName());
	btn.setImage(btnInfo.getIcon());
	btn.setText(btnInfo.getTitle());
	btn.setToolTipContent(def.tooltip);
	btn.setData(CalemContext.DATA, btnInfo.getId());
	btn.setEnabled(btnInfo.getEnabled());
	this._buttons[btnInfo.getId()]=btn;
	//Linking to data model
	var listener=this._getListener(btnInfo)
	if (listener) {
		this.addListener(btnInfo.getId(), listener);
	}
	btn.setupEvents(btnInfo, this._controller);
	return btn;
}

/**
 * Adding a menuItem
 */
CalemToolBar.prototype.addMenu =
function(menuInfo) {
	if (!menuInfo.hasMenu()) return; //No menu in this one.
	//Creating a button first
	var btn=this.addButton(menuInfo.getMenuButton());
	var mi=this._conf.menuInfo;
	var menu=new DwtMenu(btn, mi.style, mi.className, mi.posStyle, mi.dialog);
	var bi=this._conf.btnInfo;
	btn.setMenu(menu, bi.shouldToggle, bi.followIconStyle);
	//Creating menuItem in the menu list
	var list=menuInfo.getMenuList();
	for (var i=0; i< list.length; i++) {
		//Check acl here
		if (!this._checkAcl(list[i].getId())) continue; //Acled out.
		
		this._createMenuItem(menu, list[i]);
	}
}

/**
 * Create a menuItem
 */
CalemToolBar.prototype._createMenuItem =
function(menu, btnInfo) {
	var def=btnInfo.getDef();
	var conf=this._conf.menuItem;
	var mi=DwtMenuItem.create(menu, def.icon, btnInfo.getTitle(), def.disIcon, 
						btnInfo.getEnabled(), conf.style, null,  //Radio groupId
						null, //radio idx
						conf.className, conf.posStyle);
	mi.setData(CalemContext.DATA, btnInfo.getId());
	var listener = this._getListener(btnInfo);
	if (listener) {
		mi.addSelectionListener(listener);
	}
}

/**
 * Add a caption to the menu bar
 */
CalemToolBar.prototype.addLabel =
function(lbInfo) {
	var lb=new DwtLabel(this);
	lb.setImage(lbInfo.getIcon());
	lb.setText(lbInfo.getLabel());
	if (lbInfo.getCcsClass()) lb.setClassName(lbInfo.getCcsClass());
}

CalemToolBar.prototype._getListener =
function(btnInfo) {
	var listener=null;
	var ln=btnInfo.getListenerName();
	if (this._listenerFactory && ln) {
		listener=this._listenerFactory.run(ln);
	}
	return listener;
}

/**
 * Common functions
 */
CalemToolBar.prototype.addListener =
function(id, listener) {
	this._buttons[id].addSelectionListener(listener);
} 

CalemToolBar.prototype.setEnabled =
function(id, enabled) {
	this._buttons[id].setEnabled(enabled);
}

/**
 * shutdown - to remove all the listeners
 */
CalemToolBar.prototype._shutdown =
function() {
	for (var i in this._buttons) {
		this._buttons[i]._shutdown();
	}
}  

