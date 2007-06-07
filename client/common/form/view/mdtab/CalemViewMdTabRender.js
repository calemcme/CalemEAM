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
 * CalemViewMdTabRender
 *  
 * This is the master detail tab view render.
 */
function CalemViewMdTabRender(parent, id, fmInfo, controller, customInfo) {
	if (arguments.length==0) return;
	CalemUiRender.call(this, parent, id, fmInfo, controller);
	this._customInfo=customInfo;
	this._pages=new Object();
}

CalemViewMdTabRender.prototype=new CalemUiRender;
CalemViewMdTabRender.prototype.constructor=CalemViewMdTabRender;

CalemViewMdTabRender.prototype.toString = function() { return "CalemViewMdTabRender"; }
CalemViewMdTabRender.prototype.getClassName = function() { return "CalemViewMdTabRender"; }

/**
 * Acl checking
 */
CalemViewMdTabRender.prototype._checkTabAcl =
function(tabId) {
	return (this._customInfo ? this._customInfo.checkTabAcl(tabId) : true);
} 

/**
 * MdTab views
 */
CalemViewMdTabRender.prototype.render =
function() {
	//Getting layout info
	var layout = (this._customInfo && this._customInfo.getLayout()) ? this._customInfo.getLayout() : this._info.getLayout();
	var tabList=layout.getTabList();
	this._tabView=new CalemTabView(this._parent);
	this._fitToParent();
	var addCustomizeTab=false;
	for (var i=0; i< tabList.length; i++) {
		var tabId=tabList[i];
		//m06 - customize for admin
		if (tabId==CalemConst._TAB_CUSTOMIZE && !CalemBoUtil.isUserInAdminGroup()) continue;
		
		if (!this._checkTabAcl(tabId)) continue;
		
		if (tabId==CalemConst._TAB_CUSTOMIZE) {
			addCustomizeTab=true;
			continue;
		}
		var tabPage = new CalemViewPageMd(this._tabView, null, null, this._controller, 
											this._info, this._customInfo, tabId);
		var title=this._info.getItem(tabId).getLabel();											
		this._tabView.addTab(title, tabPage);
		this._pages[tabId]=tabPage; //Keep track of all pages.
	}
	/**
	 * This is to prevent Admin from locking out from customization 
	 * a) Current user is in CUSTOM_SYSTEM group
	 * b) Customize button is not in the layout but in acl
	 * c) The controller is customizable (i.e., not a design form)
	 */	 
	 if (this._controller && this._controller.allowCustomize && this._controller.allowCustomize()
	   && CalemBoUtil.isUserInAdminGroup()
	   && this._info.getItem(CalemConst._TAB_CUSTOMIZE) //It's in the map
	   && !this._checkTabAcl(CalemConst._TAB_CUSTOMIZE) ) {
	 	addCustomizeTab=true;
	 }
	//Add a tab for customization.
	if (addCustomizeTab) {
		var tabPage=new CalemViewPageMdCustomize(this._tabView, null, null, this._controller, 
											this._info, this._customInfo, tabId);
		this._tabView.addTab(CalemMsg.getMsg(CalemConst._TAB_CUSTOMIZE), tabPage);											
	}
	//DwtTabView will auto-display first tab.
}

CalemViewMdTabRender.prototype._fitToParent =
function() {
	var sz=this._parent.getSize();
	var margin=CalemConf['view_engine']['viewRenderMdTab']['tabViewMargin'];
	this._tabView.setBounds(margin.x, margin.y, sz.x-margin.x, sz.y-margin.y);
}

CalemViewMdTabRender.prototype.onLayoutChange =
function() {
	this._fitToParent();
	//@tbd handle the tabs below.
}

//Going through each tab.
CalemViewMdTabRender.prototype.resumeView =
function() {	
	for (var i in this._pages) this._pages[i].resumeView();
}

