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
 * CalemPeerTabLayoutTree
 * This is the right hand tree for design use.
 */
function CalemPeerTabLayoutTree(parent, style, className, posStyle) {
	if (arguments.length==0) return;
	CalemMdTabLayoutTree.call(this, parent, style, className, posStyle);
} 

CalemPeerTabLayoutTree.prototype = new CalemMdTabLayoutTree;
CalemPeerTabLayoutTree.prototype.constructor = CalemPeerTabLayoutTree;

CalemPeerTabLayoutTree.prototype.toString = 
function() {
	return "CalemPeerTabLayoutTree";
}

CalemPeerTabLayoutTree.prototype._createRoot =
function() {
	return new CalemLayoutTreeFormPeerTab(this);
}

/**
 * Adding layout to the tree.
 */
CalemPeerTabLayoutTree.prototype._setupTree =
function(customInfo) {
	//Figuring out who is in the layout.
	var layout= (customInfo && customInfo.getLayout()) ? customInfo.getLayout() : this._formInfo.getLayout();
	var tabList=layout.getTabList();
	for (var i=0; i< tabList.length; i++) {
		if (!customInfo.checkTabAcl(tabList[i])) continue;
		var tab=this._addTab(tabList[i]);
		//consider special ab.
		if (CalemViewUtil.isCustomizeTab(tabList[i])) continue;
		//Add forms to the map.
		var fmLayout=layout.getTabItem(tabList[i]);	
		var colCount=fmLayout.getColCount();
		for (var ci=0; ci < colCount; ci++)	 {
			var fmList=fmLayout.getColLayout(ci);
			for (var j=0; j< fmList.length; j++) {
				var fmInfo=this._formInfo.getItem(fmList[j]);
				if (!customInfo.checkFormAcl([fmInfo])) continue;
				this._addForm(tab, fmInfo.getId(), fmInfo, null,ci);
			}
		}
	}
}

CalemPeerTabLayoutTree.prototype._addForm =
function(tab, id, item, text, ci) {
	text = text || CalemFormInfo.getFormDesignText(id);
	var col=tab.getCol(ci);
	if (item.getFixed()) {
		new CalemLayoutTreeFormFixed(col, null, text, id, item);
	} else {
		new CalemLayoutTreeForm(col, null, text, id, item);
	}
}

/**
 * Collecting form layout info
 */
CalemPeerTabLayoutTree.prototype.getFormLayoutInfo =
function() {
	var tabList=new Array();
	var tabMap=new Object();
	var items=this._root.getItems();
	for (var i=0; i< items.length; i++) {
		var tab=items[i];
		tabList.push(tab.getId());
		if (CalemViewUtil.isCustomizeTab(tab.getId())) continue;
		var cols=tab.getItems();
		var colLayout=new Array();
		for (var ci=0; ci< cols.length; ci++) {
			var fms=cols[ci].getItems();
			var layout=new Array();
			for (j=0; j< fms.length; j++) {
				layout.push(fms[j].getInfo().getId());
			}
			//Now construct one item
			var item=new CalemTabLayoutInfo(layout);
			colLayout.push(item);
		}
		tabMap[tab.getId()]=new CalemTabColLayoutInfo(colLayout);
	}
	var fmInfo=new CalemPeerTabLayoutInfo(tabList, tabMap);
	return fmInfo;
} 

