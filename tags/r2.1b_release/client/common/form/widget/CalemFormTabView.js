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
 * CalemFormTabView manages all the forms opened.
 * It's built out of the DwtTabView so CalemFormTabBar can be used instead of DwtTabBar.
 */
function CalemFormTabView(parent, className, positionStyle) {

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
	this._tabBar = new CalemFormTabBar(this); //hack to use CalemFormTabBar
	this._createHTML();
	//Use a single listener
	this._tabSelectListener = new AjxListener(this, this._tabButtonListener);
	//form close listener
	this._tabCloseListener = new AjxListener(this, this.onFormClose);
	//moreButton handlers
	this._moreCallback=new AjxCallback(this, this.onMoreButtonClick);
	this._showFormListener=new AjxListener(this, this.onShowForm);
	//Data model
	this._formList=new Array();
	//configuration
	this._conf=CalemConf['desktop_mainView'];
	this._btnStyle=this._conf["fmBtnStyle"];
}

CalemFormTabView.prototype = new DwtTabView;
CalemFormTabView.prototype.constructor = CalemFormTabView;

CalemFormTabView.prototype.toString = 
function() {
	return "CalemFormTabView";
}

/**
 * Main form area change
 */
CalemFormTabView.prototype.onLayoutChange =
function(param) {
	DwtTabView.prototype.setBounds.call(this, param.x, param.y, param.width, param.height);
} 

/**
 * Figure out the offset between pageDiv and the formTabView so
 * the next control can be positioned absolutely.
 */
CalemFormTabView.prototype.getPageAbsOffset = 
function() {
	var loc=this.getLocation();
	var locPage=Dwt.getLocation(this._pageDiv);
	return {x: locPage.x - loc.x, y: locPage.y - loc.y};
}

/**
 * More button handler
 */
CalemFormTabView.prototype.onMoreButtonClick =
function() {
	var menu=new DwtMenu(this._moreBtn);
	for (var i=this._conf.displayTabs; i< this._formList.length; i++) {
		var formItem=this._formList[i];
		var menuItem=DwtMenuItem.create(menu, formItem.getIcon(), formItem.getTitle(),null, true);
		menuItem.setData("formIdx", i);
		menuItem.addSelectionListener(this._showFormListener);
	}
	return menu;
} 

//Whenever more items change this menu should be reset.
CalemFormTabView.prototype._resetMoreMenu =
function() {
	this._moreBtn.setMenu(this._moreCallback);
}

/**
 * This is the work to switch the form
 */
CalemFormTabView.prototype.onShowForm =
function(ev) {
	var idx= (ev && ev.item)? ev.item.getData('formIdx') : null;
	if (!idx) return;
	//Now bring this form to focus
	this._bringFormToFocus(idx);
} 

/**
 * Bring form at idx to focus.
 */
CalemFormTabView.prototype._bringFormToFocus =
function(idx) {
	//Is the current form on focus (so nothing needs to be done).
	if (idx < this._conf.displayTabs) { //So this form is displayable.
		if (idx!=this._currentTabKey) this.switchToTab(idx);
		return;
	}
	var formItem= this._formList[idx];
	this._formList.splice(idx, 1);
	//Make room for the hidden formItem
	this._rightShiftForm(this._conf.displayTabs-1);
	this._replaceFormAt(this._conf.displayTabs-1, formItem);
   //Reset menu list
   this._resetMoreMenu();
   //Switch to active tab
	this.switchToTab(this._conf.displayTabs-1);
}

/**
 * Provide view page state management so it knows when to refresh the screen.
 */
CalemFormTabView.prototype.switchToTab =
function(tabKey) {
	//Do a workaround at this step 
	CalemContext.getInstance().doFf167801();
	for (var i=0; i< this._tabs.length; i++) {
		if (i==tabKey) continue;
		this._formList[i].getViewHolder().setHideState();
	}
	DwtTabView.prototype.switchToTab.call(this, tabKey);
} 

/**
 * Get current form
 */
CalemFormTabView.prototype.getCurrentForm =
function() {
	return this._formList.length > 0 ? this._formList[this.getCurrentTab()] : null;
} 

/**
 * Close currently active form tab async to avoid script not responding error.
 */
CalemFormTabView.prototype.closeCurrentForm =
function(formAction) {
	//Close it async
	var at=new AjxTimedAction(this, this._closeCurrentForm, {tabKey: this.getCurrentTab(), action: formAction});
	AjxTimedAction.scheduleAction(at, 100); //Do it right now.
}

CalemFormTabView.prototype._closeCurrentForm =
function(param) {
	this._onFormClose(param, true);
}

/**
 * When a form is closed
 */
CalemFormTabView.prototype.onFormClose =
function(ev) {
	//Give the form a chance to close before losing data.
	var tabKey=ev.item.getData("tabKey");
	var callback=new AjxCallback(this, this._onFormClose, {tabKey: tabKey});
   this._formList[tabKey].canClose(callback);
}

CalemFormTabView.prototype._onFormClose =
function(param, canClose) {		
	if (!canClose) return; //Form requests not to close.
	tabKey=param.tabKey;
	//Let's check for were we're with the tabs
	//a) moreButton not displayed - simple; b) moreButton displayed and can be removed; c) moreButton continue to display.
	if (this._formList.length <= this._conf.displayTabs) {//Just remove the entry we're fine.
		this._removeForm(tabKey);
		if (tabKey >= this._tabs.length) tabKey--; //Only when it's the last one.
	} 
	//More button is displayed.
	else {
		var removeMoreBtn= (this._formList.length == this._conf.displayTabs + 1);
		this._leftShiftDeleteForm(tabKey);
		if (removeMoreBtn) {//let's remove more button.
			this._removeMoreButton();
		} else {
			this._resetMoreMenu();
		}
	} 
	if (this._tabs.length>0) {
		this.switchToTab(tabKey);
	}
	//Check for form action
	this._onFormAction(param.action);
}

CalemFormTabView.prototype._onFormAction =
function(fmAction) {
	if (fmAction) {
		fmAction.onAction();
	}
}

CalemFormTabView.prototype._removeTab =
function(tabKey) {
	//Delete from tabs
	var obj=this._tabs[tabKey];
	this._tabs.splice(tabKey, 1);
	delete obj;
}

/**
 * Open form function
 */
CalemFormTabView.prototype.openForm = 
function(fmId, data) {
	var rtn=false;
	var idx=this._getReplacementByData(fmId, data);
	if (typeof(idx)!= 'undefined') {
		//Move form to the data spot.
		if (data) { //Wait for data to be ready.
			this._formList[idx].openAt(data, new AjxCallback(this, this._onOpenAt, {idx: idx}));
		} else {
			this._bringFormToFocus(idx);
		}
		return this._formList[idx];
	}
	var controllerId=CalemViewUtil.getFormControllerById(fmId);
	var form=eval(['new ', controllerId, '(this, fmId, data)'].join(''));
	//Create a view holder for the controller.
	var viewHolder=this._createViewHolder();
	viewHolder.addController(form);
	this._addForm(form);
	return form;
}

//Move to callback.
CalemFormTabView.prototype._onOpenAt =
function(param) {
	this._bringFormToFocus(param.idx);
}

CalemFormTabView.prototype._createViewHolder =
function(controller) {
	var impl= CalemConf['desktop_mainView']['form']['viewHolder'];
	return eval(['new ', impl, '(this)'].join(''));
}

/**
* Adding a new form to the tab view.
* @param itemDef - item definition
* @param data - data for the item
**/
CalemFormTabView.prototype._addForm =
function (formItem) {
	//A few items to consider here: a) can just display the form; b) has to replace and add more; c) just replace.
	if (this._tabs.length < this._conf.displayTabs) {//We can just add it and display.
	   var idx=this._tabs.length;
	   this._formList[idx]=formItem;
		this._addFormToTab(idx, true);
	} else {//Shift tabs upward and make room for the new form.
		this._rightShiftForm(this._conf.displayTabs-1);
		this._replaceFormAt(this._conf.displayTabs-1, formItem);
		//Add more button.
		if (this._tabs.length == this._conf.displayTabs) {
	   	this._addMoreButton();
	   }
	   //Reset menu list
	   this._resetMoreMenu();
	   //Switch to active tab
		this.switchToTab(this._conf.displayTabs-1);
	} 
}

//Move all the items up a slot
CalemFormTabView.prototype._rightShiftForm =
function(idx) {
	for (var i=this._formList.length; i > idx; i--) {
		this._formList[i]=this._formList[i-1];
	}
}

CalemFormTabView.prototype._leftShiftDeleteForm =
function(tabKey) {
	//Remove the view first.
	this._removeTabPage(tabKey);
	var oldFormItem=this._formList[tabKey];
	for (var i=tabKey+1; i< this._formList.length; i++) {
		var formItem=this._formList[i];
		this._formList[i-1]=formItem;
		if (i <= this._conf.displayTabs) {
			var tabView= formItem.getTabPageView();
			//Adding new view to the tabView
			if (i==this._conf.displayTabs) {
				var el=tabView.getHtmlElement()? tabView.getHtmlElement() : tabView._removedEl;
				this._pageDiv.appendChild(el);
			}
			this._tabs[i-1]['view']=tabView;
			this._tabs[i-1]['title']=formItem.getTitle();
			this._tabBar.replaceTabBtn(i-1, formItem.getIcon(), formItem.getTitle());
		}
	}
	this._formList.splice(this._formList.length-1, 1); //Remove the last item
	this._removeFormItemData(oldFormItem);
}

CalemFormTabView.prototype._replaceFormAt =
function(idx, formItem) {
	//Data exchange
	var oldFormItem=this._formList[idx];
	var oldView=oldFormItem.getTabPageView();
	var newView=formItem.getTabPageView();
	this._formList[idx]=formItem;
	this._tabs[idx]['view']=newView;
	this._tabs[idx]["title"] = formItem.getTitle();
	//replace the tab pages
	this._replaceTabPage(newView, oldView);
	//Need to replace the tabBar
	this._tabBar.replaceTabBtn(idx, formItem.getIcon(), formItem.getTitle());
}

/**
 * Tabpage removal and swap.
 */
CalemFormTabView.prototype._removeTabPage =
function(idx) {
	var el= this._tabs[idx]['view'].getHtmlElement();
	el.parentNode.removeChild(el);
}

CalemFormTabView.prototype._replaceTabPage =
function(newView, oldView) {
	var oldEl= oldView.getHtmlElement() || oldView._removedEl;
	var newEl= newView.getHtmlElement() || newView._removedEl;
	oldEl.parentNode.replaceChild(newEl, oldEl);
	//Preserve the el here.
	oldView._removedEl = oldEl;
}

/**
 * Upon form close
 */
CalemFormTabView.prototype._removeForm =
function(tabKey) {
	//Remove tabs
	this._removeTab(tabKey);
	//remove formItem
	this._removeFormItem(tabKey);
	//Remove from tabBar
	this._tabBar.removeButton(tabKey);
}

CalemFormTabView.prototype._removeFormItem =
function(tabKey) {
	//Delete form data 
	var formItem=this._formList[tabKey];
	this._formList.splice(tabKey, 1);
	this._removeFormItemData(formItem);
}

CalemFormTabView.prototype._removeFormItemData =
function(formItem) {
	//clean up the form item including remove all listeners to external components
	formItem.shutdown();
	//delete the control.
	var view=formItem.getTabPageView();
	//Release the view which will be removed from parent div by <code>dispose</code>.
	view.dispose();
	//Delete formItem object
	delete formItem;
}

/**
 * Adding a form to the tab.
 */
CalemFormTabView.prototype._addFormToTab =
function(tabKey, activate) {
	var formItem=this._formList[tabKey];
	//Configure the data to be displayed at the spot.
	var title=formItem.getTitle();
	if (!this._tabs[tabKey]) this._tabs[tabKey] = new Object(); //May reuse the object
	this._tabs[tabKey]["title"] = title;
	this._tabs[tabKey]["button"]= this._tabBar.addFormButton(tabKey, formItem.getIcon(), title, this._btnStyle, 
		CalemMsg.getMsg(this._conf["closeBtn"]["title"]), this._conf['closeBtn']['icon'], 
		this._conf['closeBtn']['hoverIcon'], this._tabSelectListener, this._tabCloseListener);
	//add the page 
	var tabView= formItem.getTabPageView();
	this._tabs[tabKey]["view"] = tabView;
	this._pageDiv.appendChild(tabView.getHtmlElement());
	tabView._tabKey = tabKey;	
	if (activate) this.switchToTab(tabKey);			
	return tabKey;
}

/**
 * Adding a more button.
 */
CalemFormTabView.prototype._addMoreButton =
function() {
	var tabKey=this._conf.displayTabs;
	var title=CalemMsg.getMsg(this._conf["moreTab"]['title']);
	this._tabs[tabKey]=new Object();
	this._tabs[tabKey]["title"] = title;
	this._moreBtn=this._tabs[tabKey]["button"]= this._tabBar.addMoreButton(tabKey, this._conf['moreTab']['icon'], 
			this._conf['moreTab']['hoverIcon'], title, this._btnStyle, this._moreCallback);
	//add the page 
	this._tabs[tabKey]["view"] = null;	
}

CalemFormTabView.prototype._removeMoreButton =
function() {
	var tabKey=this._conf.displayTabs;
	this._removeTab(tabKey);
	this._tabBar.removeMoreButton(tabKey);
}

/**
 * Is this form with the same data on display already?
 */
CalemFormTabView.prototype._getReplacementByData =
function(id, data) {
	var repIdx;
	var idx;
	for (var i=0; i< this._formList.length; i++) {
		if (this._formList[i].getId() == id) {
			idx=i;
			break;
		}
	}
	if (typeof(idx) == 'undefined') return repIdx; //
	var currFormItem=this._formList[idx];
	//Do we need to replace?
	if (currFormItem.isReplaceById()) {
		repIdx=idx;
	} else if (currFormItem.isReplaceByIdData()) {
		var id= data ? data.getId() : null;
		var id2=currFormItem.getData() ? currFormItem.getData().getId() : null;
		if (id && id2 && id==id2) {
			repIdx=idx;
		}
	}
	return repIdx;
}

/**
 * CalemFormTabViewPage
 * This is the entry view for every form item.
 */
function CalemFormTabViewPage(parent) {
	if (arguments.length==0) return;
   DwtTabViewPage.call(this, parent);
}

CalemFormTabViewPage.prototype = new DwtTabViewPage;
CalemFormTabViewPage.prototype.constructor = CalemFormTabViewPage;

CalemFormTabViewPage.prototype.toString =  function() { return "CalemFormTabViewPage"; }

CalemFormTabViewPage.prototype.showMe =
function() {
	this.setZIndex(DwtTabView.Z_ACTIVE_TAB);
	this._resetSizeWithMargin();
}

CalemFormTabViewPage.prototype.resetSize = 
function(newWidth, newHeight) {
	this.setSize(newWidth, newHeight);
	this._resetSizeWithMargin();
}

/**
 * Modified not to rely on 80 as a fixed margin. Added a function to figure this out from
 * the layout.
 */
CalemFormTabViewPage.prototype._resetSizeWithMargin = 
function() {
	/*
	if (CalemDebug.isDebug()) {
		var bz=Dwt.getBounds(this.getHtmlElement());
		CalemDebug.printBounds('CalemFormTabViewPage resetSize bz', bz);
	}
	*/
	var mConf=CalemConf['view_engine']['tabPage'];
	var yTop=mConf['yMargin']['top'];
	var yBottom=mConf['yMargin']['bottom'];
	var xLeft=mConf['xMargin']['left'];
	var xRight=mConf['xMargin']['right'];
	var margin=this.parent.getPageAbsOffset();
	var hMargin=margin.y+yTop+yBottom;
	var xMargin=xLeft+xRight;
	//Use utility to do so
	var sz=Dwt.getSize(this.parent.getHtmlElement());
	var width = (sz.x > xMargin) ? sz.x - xMargin: sz.x;
	var height= (sz.y > hMargin) ? sz.y - hMargin : sz.y;
	this.setSize(width, height);
	//Let's also configure the location of the page
	this.setLocation(xLeft, yTop+margin.y);
	/*
	if (CalemDebug.isDebug()) {
		var bz=Dwt.getBounds(this.getHtmlElement());
		CalemDebug.printBounds('CalemFormTabViewPage resetSize done bz', bz);
	}
	*/
}


/**
 * CalemFormTabBar
 * This is the tab bar for all forms opened. The last element is a "more" button.
 */
function CalemFormTabBar(parent, tabCssClass, btnCssClass) {
	DwtTabBar.call(this, parent, tabCssClass, btnCssClass);
	this._rButtons = new Array();
	this._activeTabListener = new AjxListener(this, DwtTabBar._setActiveTab); //This should be DwtTabBar.prototype....
} 

CalemFormTabBar.prototype = new DwtTabBar;
CalemFormTabBar.prototype.constructor = CalemFormTabBar;

CalemFormTabBar.prototype.toString = 
function() {
	return "CalemFormTabBar";
}

/**
 * Replace a button with name and icon
 */
CalemFormTabBar.prototype.replaceTabBtn =
function(tabKey, icon, title) {
	this._buttons[tabKey].setImage(icon);
	this._buttons[tabKey].setText(title);
} 

/**
 * Button and right close button
 */
CalemFormTabBar.prototype.addFormButton =
function(tabKey, icon, title, style, rbTitle, rbImage, rbHoverImage, listener, rbListener) {
	style=style || (DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_LEFT);
	//Count how many items to display in the tab button.
	count= (icon||title) ? 1 : 0;
	count=rbTitle? (count+1) : count;
	//Create the container button
	var tb = this._tbuttons[tabKey] = new CalemFormTabButton(this, count);
	tb.setTabKey(tabKey);
	//Hack to get rid of the single pixel offset
	this._removePadding(tb);
	//
	var b = this._buttons[tabKey] = new DwtButton(tb, style, this._btnStyle, DwtControl.RELATIVE_STYLE);
	var rb;
	if (rbTitle) {
		rb= this._rButtons[tabKey]= new DwtButton(tb, style, this._btnStyle, DwtControl.RELATIVE_STYLE);
		rb.setToolTipContent(rbTitle);
		rb.setImage(rbImage);
		rb.setHoverImage(rbHoverImage);
		rb.setEnabledImage(rbImage); //for mouse out again.
		rb.setData('tabKey', tabKey);
		this._workaround(rb);
		this._rButtons[tabKey].addSelectionListener(rbListener);
	}
	
	// HACK: This is to get around resetting of button className during hover.
	this._workaround(b);
	//Set up listener.
	this._addSelectionListener(tabKey, listener);
	//Provide image and text.
	if (icon) {
		b.setImage(icon);
	} else if (this._btnImage != null) {
		b.setImage(this._btnImage);
	}
	if (title) b.setText(title);
	b.setEnabled(true);
	b.setData("tabKey", tabKey);

	/** this is not performed.
	if(parseInt(tabKey) == 1)
		tb.setOpen();
	**/
	return b;
}

CalemFormTabBar.prototype.addMoreButton =
function(tabKey, icon, hoverIcon, title, style, callback) {
	style=style || (DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_LEFT);
	//Create the container button
	var tb = this._tbuttons[tabKey] = new CalemFormTabButton(this, 1);
	var b = this._buttons[tabKey] = new DwtButton(tb, style, this._btnStyle, DwtControl.RELATIVE_STYLE);
	//Hack to get rid of the single pixel offset
	this._removePadding(tb);
	// HACK: This is to get around resetting of button className during hover.
	this._workaround(b);
	//Provide list of forms opened.
	b.setMenu(callback); //This is a drop down menu.
	//Provide image and text.
	if (icon) {
		b.setImage(icon);
	} 
	if (hoverIcon) {
		b.setHoverImage(hoverIcon);
	}
	if (title) {
		b.setText(title);
	}
	b.setEnabled(true);
	return b;
}

// Workaround to get rid of the padding

CalemFormTabBar.prototype._removePadding =
function(tb) {
	var tbEl=tb.getHtmlElement();
	if (tbEl.parentNode && tbEl.parentNode.style) {
		tbEl.parentNode.style.width="0px";
	}
}

// HACK: This is to get around resetting of button className during hover.
CalemFormTabBar.prototype._workaround =
function(b) {
	var be = b.getHtmlElement();
	be.style.position = "relative";
	be.style.top = "-3px";
}	

/**
 * remove button
 */
CalemFormTabBar.prototype.removeButton =
function(tabKey) {
	this._removeButton(tabKey);
	for (var i=tabKey; i< this._tbuttons.length; i++) {
		btn=this._tbuttons[i];
		btn.setTabKey(i);
		if (this._buttons[i])  this._buttons[i].setData("tabKey", i);
		if (this._rButtons[i]) this._rButtons[i].setData('tabKey', i);
	}
} 

CalemFormTabBar.prototype.removeMoreButton =
function(tabKey) {
	this._removeButton(tabKey);
} 

CalemFormTabBar.prototype._removeButton =
function(tabKey) {
	var btn=this._tbuttons[tabKey];
	this._tbuttons.splice(tabKey, 1);
	if (this._buttons[tabKey]) {
		this._buttons.splice(tabKey, 1);
	}
	if (this._rButtons[tabKey]) {
		this._rButtons[tabKey].setToolTipContent(null);
		this._rButtons.splice(tabKey, 1);
	}
	//Now remove the button from the toolbar
	btn.dispose();
}

/**
* @param tabId - the id used to create tab button in @link DwtTabBar.addButton method
* @param listener - AjxListener
**/
CalemFormTabBar.prototype._addSelectionListener =
function(tabKey, listener) {
	this._buttons[tabKey].addSelectionListener(listener);	
	this._tbuttons[tabKey].addListener(DwtEvent.ONMOUSEUP, listener);
	//Also add active tab listener
	this._buttons[tabKey].addSelectionListener(this._activeTabListener);
	this._tbuttons[tabKey].addListener(DwtEvent.ONMOUSEUP, this._activeTabListener);
}

/**
 * CalemFormTabButton - support both the tab button and right button.
 * 
 * @see DwtTabButton
 */
function CalemFormTabButton(parent, cellCount) {
	this._cellCount=cellCount;
	this._topCell=new Array();
	this._middleCell=new Array();
	this._bottomCell=new Array();
	this._topDiv=new Array();
	this._bottomDiv=new Array();
	this._cellIndex=0;
	DwtTabButton.call(this, parent);
}

CalemFormTabButton.prototype = new DwtTabButton;
CalemFormTabButton.prototype.constructor = CalemFormTabButton;

CalemFormTabButton.prototype.toString = 
function() {
	return "CalemFormTabButton";
}

/**
 * Overwrite _createHtml to add a right button.
 */
CalemFormTabButton.prototype._createHtml = 
function() {
	this.table = document.createElement("table");
	this.table.border = this.table.cellPadding = this.table.cellSpacing = 0;
	this.table.align = "center";
	this.table.width = "100%";

	this._topRow = this.table.insertRow(-1);
	this._middleRow = this.table.insertRow(-1);
	this._bottomRow = this.table.insertRow(-1);	

	this._leftTopCell = this._topRow.insertCell(-1);
	this._createCells(this._topCell, this._topRow);
	this._rightTopCell = this._topRow.insertCell(-1);

	this._leftMiddleCell = this._middleRow.insertCell(-1);
	this._createCells(this._middleCell, this._middleRow);
	this._rightMiddleCell = this._middleRow.insertCell(-1);

	this._leftBottomCell = this._bottomRow.insertCell(-1);
	this._createCells(this._bottomCell, this._bottomRow);
	this._rightBottomCell = this._bottomRow.insertCell(-1);

	this._leftTopCell.className = "DwtTabButtonTL";
	this._setCells(this._topCell, "className", "DwtTabButtonTM");
	this._rightTopCell.className = "DwtTabButtonTR";

	this._leftBottomCell.className = "DwtTabButtonBL";
	this._setCells(this._bottomCell, "className", "DwtTabButtonTM");
	this._rightBottomCell.className = "DwtTabButtonBR";
	//Top
	this.leftTopImg = document.createElement("div");
	this._createDivs(this._topDiv);
	this.rightTopImg = document.createElement("div");
	AjxImg.setImage(this.leftTopImg, "Tab_TL", null, true);
	this._setImages(this._topDiv, "Tab_T__H", AjxImg.HORIZ_BORDER, true); 
	AjxImg.setImage(this.rightTopImg, "Tab_TR", null, true);
	this._leftTopCell.appendChild(this.leftTopImg);
	this._appendDivs(this._topCell, this._topDiv);
	this._rightTopCell.appendChild(this.rightTopImg);
   //Middle row is a direct set.
	AjxImg.setImage(this._leftMiddleCell, "Tab_L__V", AjxImg.VERT_BORDER, true);
	this._setImages(this._middleCell, "Tab__BG", AjxImg.BACKGROUND, true);
	AjxImg.setImage(this._rightMiddleCell, "Tab_R__V", AjxImg.VERT_BORDER, true);
	//Bottom
	this.leftBottomImg = document.createElement("div");
	this._createDivs(this._bottomDiv);
	this.rightBottomImg = document.createElement("div");
	AjxImg.setImage(this.leftBottomImg, "Tab_BL", null, true);
	this._setImages(this._bottomDiv, "Tab_B__H", AjxImg.HORIZ_BORDER, true);
	AjxImg.setImage(this.rightBottomImg, "Tab_BR", null, true);
	this._leftBottomCell.appendChild(this.leftBottomImg);
	this._appendDivs(this._bottomCell, this._bottomDiv);
	this._rightBottomCell.appendChild(this.rightBottomImg);

	this.getHtmlElement().appendChild(this.table);
	this.table.className = this._inactiveClassName;
};

CalemFormTabButton.prototype.setTabKey =
function(tabKey) {
	//Make sure we set the tabKey if needed.
	this.table.setAttribute("tabKey", tabKey);
	this._leftMiddleCell.setAttribute("tabKey", tabKey);
	this._rightMiddleCell.setAttribute("tabKey", tabKey);
	this.leftTopImg.setAttribute("tabKey", tabKey);
	this.rightTopImg.setAttribute("tabKey", tabKey);		
	this._bottomRow.setAttribute("tabKey", tabKey);
}

/**
 * Helper functions for the center cells
 */
CalemFormTabButton.prototype._createCells =
function(cells, row) {
	for (var i=0; i< this._cellCount; i++) {
		cells.push(row.insertCell(-1));
	}
}

CalemFormTabButton.prototype._setCells =
function(cells, prop, value) {
	for (var i=0; i< this._cellCount; i++) {
		cells[i][prop]=value;
	}
}

CalemFormTabButton.prototype._createDivs =
function(divs) {
	for (var i=0; i< this._cellCount; i++) {
		divs.push(document.createElement("div"));
	}
}

CalemFormTabButton.prototype._setImages = 
function(divs, imageName, style, useParentEl) {
	for (var i=0; i< this._cellCount; i++) {
		AjxImg.setImage(divs[i], imageName, style, useParentEl);
	}
} 

CalemFormTabButton.prototype._appendDivs =
function(cells, divs) {
	for (var i=0; i< this._cellCount; i++) {
		cells[i].appendChild(divs[i]);
	}
}


/**
* @param child
* DwtComposite.addChild method is overriden to to create tab switch graphics
**/
CalemFormTabButton.prototype.addChild = 
function(child) {
	// This is a hack to support two butons- the buttons must be added in the order of button and right button. 
	this._middleCell[this._cellIndex].appendChild(child.getHtmlElement());
	this._cellIndex++;
	child.addListener(DwtEvent.ONMOUSEOVER, this._mouseOverListener);
	child.addListener(DwtEvent.ONMOUSEOUT, this._mouseOutListener);
};

CalemFormTabButton.prototype.setTabImageState = 
function(imagePrefix) {
	//Top row
	AjxImg.setImage(this.leftTopImg, imagePrefix + "_TL", null, true);
	this._setImages(this._topDiv, imagePrefix + "_T__H", AjxImg.HORIZ_BORDER, true);
	AjxImg.setImage(this.rightTopImg, imagePrefix + "_TR", null, true);
	//Middle row
	AjxImg.setImage(this._leftMiddleCell, imagePrefix + "_L__V", AjxImg.VERT_BORDER, true);
	this._setImages(this._middleCell, imagePrefix + "__BG", AjxImg.BACKGROUND, true);
	AjxImg.setImage(this._rightMiddleCell, imagePrefix + "_R__V", AjxImg.VERT_BORDER, true);
	//Bottom row
	AjxImg.setImage(this.leftBottomImg, imagePrefix + "_BL", null, true);
	this._setImages(this._bottomDiv, imagePrefix + "_B__H", AjxImg.HORIZ_BORDER, true);
	AjxImg.setImage(this.rightBottomImg, imagePrefix + "_BR", null, true);
};
 
	
