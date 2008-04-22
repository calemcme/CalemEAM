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
 * CalemChartRender
 *  
 */
function CalemChartRender(parent, id, cInfo, controller) {
	if (arguments.length==0) return;
	CalemUiRender.call(this, parent, id, cInfo, controller);
	this._chartId=[this._info.getId(), '_', this._controller.getId(), '_', this._controller.getMdTabId()].join('');
	this._conf=CalemConf['chart_engine'];
}

CalemChartRender.prototype=new CalemUiRender;
CalemChartRender.prototype.constructor=CalemChartRender;

CalemChartRender.prototype.toString = function() { return "CalemChartRender"; }

CalemChartRender.prototype.render =
function(parentEl, yOff) {
	this._yOff=yOff;
	this._chartBz=this._getChartBounds(yOff);
	this._chartDiv = document.createElement("div");
	this._chartDiv.className = 'CalemChartDiv';
	this._chartDiv.id = Dwt.getNextId();
	parentEl.appendChild(this._chartDiv);
	this._showChart();
}

CalemChartRender.prototype._showChart =
function() {
	this._so = new SWFObject(this.getSwfUrl(), this._chartId, this._chartBz.width, 
	                  this._chartBz.height, this._conf['flashVersion'], this._conf['backgroundColor']);
	this._so.addVariable("settings_file", escape(this.getSettingUrl()));
	this._so.addVariable("data_file", escape(this.getDataUrl()));
	this._so.addVariable("preloader_color", this._conf['preloaderColor']);
	this._so.write(this._chartDiv.id);
	//Set up the chart on form
	if (this._controller.setChartObj) {
		this._controller.setChartObj(document.getElementById(this._chartId));
		this._controller.setDataParam(this.getDataUrl());
	}
}

CalemChartRender.prototype.getSwfUrl =
function() {
	return calemRootUrl + this.getChartSwf();
}

CalemChartRender.prototype.getSettingUrl =
function() {
	return [calemRequestUrl, '?aid=', this._conf['aid'], '&did=', this._info.getId(), '&tid=', this._conf['tidSetting']].join('');
}
CalemChartRender.prototype.getDataUrl =
function() {
	return [calemRequestUrl, '?aid=', this._conf['aid'], '&did=', this._info.getId(), '&tid=', this._conf['tidData']].join('');
}


CalemChartRender.prototype._getChartBounds =
function(yOff) {
	//Use a workaround to account for borders, etc.
	var vConf=CalemConf['view_engine']['chart'];
	//Let's figure out the real bounds for the grid now.
	var pBz=this._parent.getBounds(); //Use pBz so we can also do resizing.
   var sbWidth=CalemConf["widget_scrollbar"]['browserRightMargin'];
	var width= pBz.width - sbWidth - vConf['xMargin'];
	var height=pBz.height - yOff - vConf['yMargin'];
	var sz=CalemViewUtil.validateGridSize(width, height);
	//Use parent's width to get around the inconsistency of FF and IE.
	//Also leave room for scroll bar of browser.
	var gbz={x: 0, y: yOff, width: sz.width, height: sz.height};
	if (CalemDebug.isDebug()) {
		CalemDebug.debug("CalemChartRender - parentEl " + CalemDebug.getBzText(pBz)+", new chart "+CalemDebug.getBzText(gbz));
	}
	return gbz;
}

CalemChartRender.prototype.onLayoutChange =
function() {
}

CalemChartRender.prototype.resumeView =
function() {
}

