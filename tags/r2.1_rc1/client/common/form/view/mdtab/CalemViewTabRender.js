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
 * CalemViewMdRender
 *  
 * This is the master detail view render.
 */
function CalemViewTabRender(parent, id, fmInfo, controller, customInfo, tabId) {
	if (arguments.length==0) return;
	CalemUiRender.call(this, parent, id, fmInfo, controller);
	this._customInfo=customInfo;
	this._layout= customInfo && customInfo.getLayout() ? customInfo.getLayout() : fmInfo.getLayout();
	this._tabId=tabId;
	this._renders=new Object();
}

CalemViewTabRender.prototype=new CalemUiRender;
CalemViewTabRender.prototype.constructor=CalemViewTabRender;

CalemViewTabRender.prototype.toString = function() { return "CalemViewTabRender"; }
CalemViewTabRender.prototype.getClassName = function() { return "CalemViewTabRender"; }

/**
 * Md views are using absolute layout for most of the blocks.
 */
CalemViewTabRender.prototype.render =
function() {
	var fmList=this.getFormList();

	var yOff=0;
	var xOff=0;
	var yMargin=CalemConf['view_engine']['viewRenderMdTab']['formMargin'].y;
	var rowMarginY=CalemConf['view_engine']['viewRenderMdTab']['rowMarginY'];
	var sz=this._parent.getSize();
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
		CalemViewUtil.setSize(viewPanel, layout.getWidth(), height);
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
	this._height=yOff;
}

CalemViewTabRender.prototype.getFormList =
function() {
	return this._layout.getTabItem(this._tabId).getLayout();
}

/**
 * Recording layout info
 */
CalemViewTabRender.prototype._add =
function(id, yOff, viewPanel, form) {
	this._renders[id]={yOff: yOff, viewPanel: viewPanel, form: form};
}

CalemViewTabRender.prototype.onLayoutChange =
function() {
	//@todo To handle CalemViewUtil.H_FULL blocks which should be the last block.
}

CalemViewTabRender.prototype.resumeView =
function() {
	for (var i in this._renders) {
		this._renders[i].form.resumeHostForm();
	}
}
