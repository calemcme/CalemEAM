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
 * CalemPeerTabDesignTree
 * This is the leftpanel tree
 */
function CalemPeerTabDesignTree(parent, style, className, posStyle) {
	if (arguments.length==0) return;
	CalemMdTabDesignTree.call(this, parent, style, className, posStyle);
} 

CalemPeerTabDesignTree.prototype = new CalemMdTabDesignTree;
CalemPeerTabDesignTree.prototype.constructor = CalemPeerTabDesignTree;

CalemPeerTabDesignTree.prototype.toString = 
function() {
	return "CalemPeerTabDesignTree";
}

/**
 * Add ACL info to tree
 * a) the item is in parent acl, do not add it. 
 * b) the item is in the layout, do not add it.
 */
CalemPeerTabDesignTree.prototype._initAcl =
function(parentCustomInfo, myCustomInfo) {
	//Figuring out who is in the layout.
	var layout= (myCustomInfo && myCustomInfo.getLayout()) ? myCustomInfo.getLayout() : this._formInfo.getLayout();
	var tabMap=new Object();
	var formMap=new Object();
	var tabList=layout.getTabList();
	for (var i=0; i< tabList.length; i++) {
		tabMap[tabList[i]]=true;
		//consider special tab.
		if (CalemViewUtil.isCustomizeTab(tabList[i])) continue;
		//Add forms to the map.
		var fmLayout=layout.getTabItem(tabList[i]);
		var colCount= (fmLayout ? fmLayout.getColCount() : 0);
		for (var ci=0; ci < colCount; ci++) {
			var fmList=fmLayout.getColLayout(ci);
			for (var j=0; j< fmList.length; j++) {
				var fmId=fmList[j];
				formMap[fmId]=this._formInfo.getItem(fmId);
			}
		}
	}
	//Now going through the original item list.
	var map=this._formInfo.getItemMap().getMap();
	for (var i in map) {
		var item=map[i];
		if (item instanceof CalemTabInfo) {//it's tab
			if (tabMap[i] || !parentCustomInfo.checkTabAcl(i)) continue;
			this._addTab(i, item);
		} else if (item instanceof CalemFormLayoutInfo) {
			if (formMap[i] || !parentCustomInfo.checkFormAcl(i)) continue;
			this._addForm(i, item)
		} else {
			//unknown item
			if (CalemDebug.isInfo()) {
				CalemDebug.info("CalemPeerTabDesignTree: unknown item: "+i+", type="+item);
			}	
		}
	}
} 


