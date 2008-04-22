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
 * CalemViewTabPeerRender
 */
function CalemViewTabPeerRender(parent, id, fmInfo, controller, customInfo, tabId) {
	if (arguments.length==0) return;
	CalemViewTabRender.call(this, parent, id, fmInfo, controller, customInfo, tabId);
}

CalemViewTabPeerRender.prototype=new CalemViewTabRender;
CalemViewTabPeerRender.prototype.constructor=CalemViewTabPeerRender;

CalemViewTabPeerRender.prototype.toString = function() { return "CalemViewTabPeerRender"; }
CalemViewTabPeerRender.prototype.getClassName = function() { return "CalemViewTabPeerRender"; }

/**
 * Md views are using absolute layout for most of the blocks.
 */
CalemViewTabPeerRender.prototype.render =
function() {
	//Use default render for one column forms
	var tabInfo = this._info.getItem(this._tabId);
	if (!tabInfo.getColCount() || tabInfo.getColCount()<2) {
		CalemViewTabRender.prototype.render.call(this);
		return;
	}
	
	//Absolute layout here.
	var colWidth=tabInfo.getColWidth();
	var xColOff=0;
	var yMargin=CalemConf['view_engine']['viewRenderPeerTab']['formMargin'].y;
	var rowMarginY=CalemConf['view_engine']['viewRenderPeerTab']['rowMarginY'];
	var sz=this._parent.getSize();
	this._height=0;
	var colLayout=this._layout.getTabItem(tabInfo.getId());
	for (var ci=0; ci< tabInfo.getColCount(); ci++) {
		var fmList=colLayout.getColLayout(ci)
		var yOff=0;
		var xOff=xColOff;
		var colW=Math.floor(sz.x * parseFloat(colWidth[ci]));
		for (var i=0; i< fmList.length; i++) {		
			var fmId=fmList[i];
			//check acl here.
			if (!this._customInfo.checkFormAcl(fmId)) continue;
			//Now find out the layout by fmId
			var fm=this._info.getItem(fmId);
			var layout=fm.getLayout();
			//Creating a view holder.
			var posStyle=Dwt.STATIC_STYLE;
			if (layout.getRows() > 0 || layout.getHeight() > 0 || layout.getHeight()==CalemViewUtil.H_FULL) {
				posStyle=Dwt.ABSOLUTE_STYLE;
			}
			var viewPanel=new CalemViewPanel(this._parent, null, posStyle);
			//Adjust size
			var height= layout.getRows() > 0 ? (layout.getRows() * CalemViewUtil.getUorH()+rowMarginY) : layout.getHeight();
			var height=CalemViewUtil.getHeight(sz, yOff, height);
			//Adjust size
			CalemViewUtil.setSize(viewPanel, colW, height);
			if (posStyle==Dwt.ABSOLUTE_STYLE) {
				viewPanel.setLocation(xOff, yOff);
			}
			//Start laying out the form.
			var form=this._controller.getFormModel().getForm(fm.getId());
			form.setViewHolder(viewPanel);
			//Start layout.
			form.showForm();
			this._add(fm.getId(), yOff, viewPanel, form);
			//Calculating offset
			var newH=CalemViewUtil.getHeightAfterLayout(viewPanel.getHtmlElement(), height);		
			yOff += newH+yMargin; //IE 7 does not obey the height set so must use the height to do layout.
		}
		this._height=Math.max(this._height, yOff);
		xColOff += colW;
	}
}

CalemViewTabPeerRender.prototype.getFormList =
function() {
	return this._layout.getTabItem(this._tabId).getColLayout(0);
}

