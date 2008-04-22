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
 * CalemModuleInfo
 */
function CalemModuleInfo() {
}

CalemModuleInfo.prototype.toString = function() {return "CalemModuleInfo";}

//Deserialize the object
CalemModuleInfo.prototype.setJson =
function(obj) {
   this._id=obj.id;
   this._icon=obj.icon;
   this._admin= obj.admin ? 1 : 0;
   this._defaultMenu=obj.defaultMenu;
   this._toolBar=CalemJson.setJson(obj.toolBar);
}

//Serialize the object
CalemModuleInfo.prototype.getJson =
function() {
	return ["{CalemModuleInfo: {id: '", this._id, "', icon: '", this._icon, "', admin: ", this._admin, ", defaultMenu: '",
	        this._defaultMenu, "', toolBar: ", (this._toolBar? this._toolBar.getJson() : ''), '}}'].join('');
}

//Public API
CalemModuleInfo.prototype.getId = function() {return this._id;}
CalemModuleInfo.prototype.getTitle=function() {return CalemMsg.getMsg(this._id);}
CalemModuleInfo.prototype.getIcon = function() {return this._icon;}
CalemModuleInfo.prototype.getAdmin = function() {return this._admin;}
CalemModuleInfo.prototype.getDefaultMenu = function() {return this._defaultMenu;}
CalemModuleInfo.prototype.getToolBar = function() {return this._toolBar;}

CalemModuleInfo.prototype.getDefaultMenuInfo = 
function() { 
	return CalemJson.setJson({CalemMenuItemInfo: {id: this._defaultMenu}}); 
};

//Place holder for now.
CalemModuleInfo.prototype.getModsum = function() {return null;}

/**
 * CalemToolBarInfo
 */
function CalemToolBarInfo() {
} 

CalemToolBarInfo.prototype.toString = function() {return "CalemToolBarInfo";}
CalemToolBarInfo.prototype.getClassName = function() {return 'CalemToolBarInfo';}

// deserialize
CalemToolBarInfo.prototype.setJson =
function(obj) {
	this._layout=obj.layout;
	this._list=CalemJson.setJsonAsArray(obj.list);
}

// deserialize
CalemToolBarInfo.prototype.getJson =
function() {
	return ["{", this.getClassName(), ": {layout: ", CalemJson.arrayToJson(this._layout), ", list: ", CalemJson.arrayToJson(this._list), '}}'].join('');
}

// Public APIs
CalemToolBarInfo.prototype.getList = function() {return this._list;}
CalemToolBarInfo.prototype.getLayout = function() {return this._layout;}


/**
 * CalemToolBarDesignInfo
 */
function CalemToolBarDesignInfo() {
} 

CalemToolBarDesignInfo.prototype = new CalemToolBarInfo();
CalemToolBarDesignInfo.prototype.constructor=CalemToolBarDesignInfo;

CalemToolBarDesignInfo.prototype.toString = function() {return "CalemToolBarDesignInfo";}
CalemToolBarDesignInfo.prototype.getClassName = function() {return 'CalemToolBarDesignInfo';}

/**
 * CalemMenuItemInfo
 * This is the generic structure used as either a button or menu item.
 */
function CalemMenuItemInfo() {}

CalemMenuItemInfo.prototype.toString = function() {return "CalemMenuItemInfo";} 

CalemMenuItemInfo.prototype.setJson =
function(obj) {
	this._id=obj.id;
	this._customInfo=CalemJson.setJson(obj.customInfo);
	this._def=CalemMenuDef[this._id]; //This is where all the info are stored.
	this._onSelect=CalemJson.setJson(this._def.onSelect);
}

CalemMenuItemInfo.prototype.getJson =
function(obj) {
	var rtn=["{", this._getClassName(), ": {id: '", this._id, "'"].join(''); 
	if (this._customInfo) {
		rtn=[rtn, ", customInfo: "+this._customInfo.getJson()].join('');	
	}
	return [rtn, "}}"].join('');
}

CalemMenuItemInfo.prototype._getClassName =
function() {
	return 'CalemMenuItemInfo';
}

CalemMenuItemInfo.prototype.getCustomInfo =
function() {
	return this._customInfo;
}

CalemMenuItemInfo.prototype.getId =
function() {
	return this._id;
}

CalemMenuItemInfo.prototype.getDef =
function() {
	return this._def;
}

CalemMenuItemInfo.prototype.getTitle =
function() {
	return CalemMsg.getMsg(this._def.title);
}

CalemMenuItemInfo.prototype.getIcon =
function() {
	return this._def.icon;
}

CalemMenuItemInfo.prototype.getBtnStyle =
function() {
	return CalemConf['menuListInfo']['btn'].style;
}

CalemMenuItemInfo.prototype.getBtnClassName =
function() {
	return CalemConf['menuListInfo']['btn'].className;
}

/**
 * Need to use getters for customization
 */
CalemMenuItemInfo.prototype.getEnabled =
function() {
	return (this._customInfo && this._customInfo.getEnabled()!=null)? this._customInfo.getEnabled() : this._def.enabled;
}

//CustomInfo
CalemMenuItemInfo.prototype.getListenerName =
function() {
	var rtn = (this._customInfo ? this._customInfo.getListenerName() : null);
	if (!rtn) {
		 rtn = this._onSelect ? this._onSelect.getListenerName() : null;
	}
 	return rtn;
}

/**
 * CalemMenuButtonInfo 
 * This is the intrim menu button it will not display if its menu tree is empty.
 */
function CalemMenuButtonInfo() {}

CalemMenuButtonInfo.prototype.toString = function() {return "CalemMenuButtonInfo";}

CalemMenuButtonInfo.prototype=new CalemMenuItemInfo;
CalemMenuButtonInfo.prototype.constructor=CalemMenuButtonInfo;

CalemMenuButtonInfo.prototype._getClassName =
function() {
	return 'CalemMenuButtonInfo';
}

/**
 * CalemButtonInfo
 * This is the button to display on a toolbar.
 */
function CalemButtonInfo() {}

CalemButtonInfo.prototype=new CalemMenuItemInfo;
CalemButtonInfo.prototype.constructor=CalemButtonInfo;

CalemButtonInfo.prototype.toString = function() {return "CalemButtonInfo";}

CalemButtonInfo.prototype._getClassName =
function() {
	return 'CalemButtonInfo';
}

/**
 * CalemMenuInfo
 * This is one menu sub tree.
 */
function CalemMenuInfo(btnInfo, menuList) {
	if (arguments.length==0) return;
	this._menuButton = btnInfo;
	this._menuList=menuList;
}

CalemMenuInfo.prototype.toString = function() {return 'CalemMenuInfo';}

CalemMenuInfo.prototype.setJson =
function(obj) {
	this._menuButton=CalemJson.setJson(obj.menuButton);
	this._menuList=CalemJson.setJsonAsArray(obj.menuList);
}

CalemMenuInfo.prototype.getJson =
function(obj) {
	var rtn=["{CalemMenuInfo: {menuButton: ", this._menuButton.getJson()].join('');
	if (this._menuList) {
		rtn=[rtn, ", menuList: ", CalemJson.arrayToJson(this._menuList)].join('');
	}
	return [rtn, "}}"].join('');
}

CalemMenuInfo.prototype.getId =
function() {
	return this._menuButton.getId();
} 


CalemMenuInfo.prototype.getMenuButton =
function() {
	return this._menuButton;
} 

CalemMenuInfo.prototype.hasMenu =
function() {
	return (this._menuList ? this._menuList.length > 0 : false);
}

CalemMenuInfo.prototype.getMenuList =
function() {
	return this._menuList;
} 

/**
 * CalemMenuCustomInfo
 */
function CalemMenuCustomInfo() {
}

CalemMenuCustomInfo.prototype.setJson =
function(obj) {
	this._onSelect=CalemJson.setJson(obj.onSelect);
	this._enabled=obj.enabled;
	this._impl=CalemJson.setJson(obj.impl);
	this._eventMap=new Object();
	this._eventList=new Array();
	CalemJson.setJsonByArray(obj.events, this);
}

CalemMenuCustomInfo.prototype.add =
function(event) {
	this._eventList.push(event);
	this._eventMap[event.getId()]=event;
}

CalemMenuCustomInfo.prototype.getJson =
function() {
	var rtn=["{CalemMenuCustomInfo: {onSelect: ", (this._onSelect ? this._onSelect.getJson(): 'null')].join('');
	if (this._enabled != null) {
		rtn=[rtn, ', enabled: ', this._enabled].join('');
	}
	if (this._impl) {
		rtn=[rtn, ', impl: ', this._impl.getJson()].join('');
	}
	if (this._eventList) {
		rtn=[rtn, ", events: ", CalemJson.arrayToJson(this._eventList)].join('');
	}
	return [rtn, "}}"].join('');
}

//Public APIs
CalemMenuCustomInfo.prototype.getEnabled =
function() {
	return this._enabled;
}
CalemMenuCustomInfo.prototype.getImpl =
function() {
	return this._impl;
}

CalemMenuCustomInfo.prototype.getListenerName =
function() {
	return (this._onSelect)? this._onSelect.getListenerName() : null;
}

CalemMenuCustomInfo.prototype.getEventList =
function() {
	return this._eventList;
}

CalemMenuCustomInfo.prototype.getEventById =
function(id) {
	return this._eventMap[id];
}

CalemMenuCustomInfo.prototype.getEventMap =
function(id) {
	return this._eventMap;
}

/**
 * CalemMenuSelect
 */
function CalemMenuSelect() {}

CalemMenuSelect.prototype.setJson =
function(obj) {
	this._listener=obj.listener;
}

CalemMenuSelect.prototype.getJson =
function() {
	return ["{CalemMenuSelect: {listener: '", this._listener, "'}}"].join('');
}

CalemMenuSelect.prototype.getListenerName =
function() {
	return this._listener;
}

/**
 * CalemEventInfo
 */
function CalemEventInfo() {}

CalemEventInfo.prototype.setJson =
function(obj) {
	this._id=obj.id;
	this._func=obj.func;
}

CalemEventInfo.prototype.getJson =
function() {
	return ["{CalemEventInfo: {id: '", this._id, "', func: '", this._func, "'}}"].join('');
}

CalemEventInfo.prototype.getId =
function() {
	return this._id;
}

CalemEventInfo.prototype.getFunction =
function() {
	return this._func;
}

/**
 * CalemSeparator
 */
function CalemSeparator() {} 

CalemSeparator.prototype.setJson =
function(obj) {
    this._id=obj.id;
	this._className=obj.className;
}

CalemSeparator.prototype.getId =
function() {
	return this._id;
}

CalemSeparator.prototype.getTitle =
function() {
	return CalemMsg.getMsg('separator');
}

CalemSeparator.prototype.getClassName =
function() {
	return this._className;
}

CalemSeparator.prototype.getJson =
function() {
	return ["{CalemSeparator: {id: '", this._id, "', className: '", this._className, "'}}"].join('');
}


