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
 

function CalemTabView(parent, className, positionStyle) {
	//By-pass DwtTabView to replace DwtTabBar with CalemTabBar.
	if (arguments.length == 0) return;
	var clsName = className || "DwtTabView";
	
	var posStyle = DwtControl.ABSOLUTE_STYLE;
	if ((positionStyle !== void 0) && (positionStyle !== null)){
	    posStyle = positionStyle;
	}
	DwtComposite.call(this, parent, clsName, posStyle);
	this._stateChangeEv = new DwtEvent(true);
	this._tabs = new Array(); 
	this._tabIx = 1;
	this._pageDiv = document.createElement("div");
	this._pageDiv.className = clsName;
	this._pageDiv.style.position = DwtControl.STATIC_STYLE;
	this._tabBar = new DwtTabBar(this);
	this._createHTML();
}

CalemTabView.prototype = new DwtTabView;
CalemTabView.prototype.constructor = CalemTabView;

CalemTabView.prototype.toString = 
function() {
	return "CalemTabView";
}

/**
 * Provide view page state management so it knows when to refresh the screen.
 */
CalemTabView.prototype.switchToTab =
function(tabKey) {
	//Check for customize tab
	if (this._tabs[tabKey]['view'].isCustomTab()) {
		//do not switch tab.
		this.switchToTab(this.getCurrentTab());
		this._tabs[tabKey]['view'].handleCustomize();
		return;
	}
	//Do a workaround at this step 
	CalemContext.getInstance().doFf167801();
	for (var i=0; i< this._tabs.length; i++) {
		if (i==tabKey) continue;
		this._tabs[tabKey]["view"].setHideState();
	}
	DwtTabView.prototype.switchToTab.call(this, tabKey);
}  

//Use tab button to get it.
CalemTabView.prototype.getPageAbsOffset = 
function() {
	var margin=CalemConf['view_engine']['viewRenderMdTab']['pageAbsMargin'];
	var h=this.getTabButton(1).parent.getSize().y;
	return {x: margin.x, y: h+margin.y};
}

/**
 * Interfaces as a view
 */
CalemTabView.prototype.getElVisible =
function() {
	return this.parent.getElVisible();
}

/**
 * Embed controller
 */
CalemTabView.prototype.embedController =
function(controller) {
	this.parent.embedController(controller);
}  

CalemTabView.prototype.closeAndResumeParentController =
function(action) {
	this.parent.closeAndResumeParentController(action);
} 

 
/**
 * CalemTabBar
 */
function CalemTabBar(parent, tabCssClass, btnCssClass) { 
	if (arguments.length==0) return;
	DwtTabBar.call(this, parent, tabCssClass, btnCssClass);
}

CalemTabBar.prototype=new DwtTabBar;
CalemTabBar.prototype.constructor = CalemTabBar;

CalemTabBar.prototype.toString = function() { return 'CalemTabBar'; }

/**
* @param tabId - the id used to create tab button in @link DwtTabBar.addButton method
* @param listener - AjxListener
**/
CalemTabBar.prototype.addSelectionListener =
function(tabKey, listener) {
	this._buttons[tabKey].addSelectionListener(listener);
}

/**
* @param tabKey
* @param tabTitle
**/
CalemTabBar.prototype.addButton =
function(tabKey, tabTitle) {
	var tb = this._tbuttons[tabKey] = new CalemTabButton(this);
	var b = this._buttons[tabKey] = new DwtButton(tb, null, this._btnStyle, DwtControl.RELATIVE_STYLE);	
	
	// HACK: This is to get around resetting of button className during hover.
	var be = b.getHtmlElement();
	be.style.position = "relative";
	be.style.top = "-3px";
	
	this._buttons[tabKey].addSelectionListener(new AjxListener(this, DwtTabBar._setActiveTab));
	this._tbuttons[tabKey].addListener(DwtEvent.ONMOUSEUP, (new AjxListener(this,DwtTabBar._setActiveTab)));
	
	if (this._btnImage != null)
		b.setImage(this._btnImage);

	if (tabTitle != null)
		b.setText(tabTitle);

	b.setEnabled(true);
	b.setData("tabKey", tabKey);

	if(parseInt(tabKey) == 1)
		tb.setOpen();

	return b;
}

/**
 * CalemTabButton
 * To make it different from the formTabButton
 */
function CalemTabButton(parent) {
	if (arguments.length == 0) return;
	DwtTabButton.call(this, parent);
}

CalemTabButton.prototype = new DwtTabButton;
CalemTabButton.prototype.constructor = CalemTabButton;

CalemTabButton.prototype.toString = 
function() {
	return "CalemTabButton";
}

CalemTabButton.prototype._createHtml = 
function() {
	this.table = document.createElement("table");
	this.table.border = this.table.cellPadding = this.table.cellSpacing = 0;
	this.table.align = "center";
	this.table.width = "100%";

	this._middleRow = this.table.insertRow(-1);	
	this._centerMiddleCell = this._middleRow.insertCell(-1);
	this.centerImg = this._centerMiddleCell;
	AjxImg.setImage(this.centerImg, "Tab__BG", AjxImg.BACKGROUND, true);

	this.getHtmlElement().appendChild(this.table);
	this.table.className = this._inactiveClassName;
};

CalemTabButton.prototype.setTabImageState = 
function(imagePrefix) {
	AjxImg.setImage(this._centerMiddleCell, imagePrefix + "__BG", AjxImg.BACKGROUND, true);
};

