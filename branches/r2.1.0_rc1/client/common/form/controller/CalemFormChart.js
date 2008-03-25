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
 * CalemFormChart
 * This is the read only view.
 * 
 */
function CalemFormChart(parent, formId, data) {
	if (arguments.length==0) return;
	CalemForm.call(this, parent, formId, data);
	this._printListener=new AjxListener(this, this.onPrint);	
	this._reload=['&',CalemConf['chart_engine']['forceload'],'=1'].join('');
	this._resetData=new AjxTimedAction(this, this._onResetData);
}

CalemFormChart.prototype = new CalemForm;
CalemFormChart.prototype.constructor = CalemFormChart;

CalemFormChart.prototype.toString = function() { return "CalemFormChart"; }
	 
/**
 * Load data for read form.
 */
CalemFormChart.prototype._loadData =
function() {
	this.onDataLoaded(); //bypass data loading.
}

//To have chart component to reload.
CalemFormChart.prototype._onDataRefresh =
function() {
	this._chartObj.reloadData(this._dataParam+this._reload);
	//Set a timer to reset the info not to force refresh.
	AjxTimedAction.scheduleAction(this._resetData, CalemConf['chart_engine']['resetDelay']);
}

//Reset data load without reload
CalemFormChart.prototype._onResetData =
function() {
	this._chartObj.reloadData(this._dataParam);
}

/**
 * Print
 */
CalemFormChart.prototype.getPrintListener =
function() {
	return this._printListener;
}

//@todo - to use export function doing this.
CalemFormChart.prototype._onPrint =
function(ev) {
	this._chartObj.exportImage(CalemViewUtil.getChartExportUrl());
}

//Find read renders
CalemFormChart.prototype.getRender =
function(info) {
	var render;
	if (!(render=CalemConf['view_engine']['viewReadRender'][info.getClassName()])) {
		render=CalemForm.prototype.getRender.call(this, info);
	} 
	return render;
}

CalemFormChart.prototype.getFieldRender =
function(normType) {
	var render;
	if (!(render=CalemConf['view_engine']['viewReadRender']['FieldRenders'][normType])
	  &&!(render=CalemConf['view_engine']['viewReadRender']['FieldRenders']['default'])) {
		render=CalemForm.prototype.getFieldRender.call(this, normType);
	} 
	return render;
}

CalemFormChart.prototype.setChartObj =
function(obj) {
	this._chartObj=obj;
}

CalemFormChart.prototype.setDataParam =
function(dataParam) {
	this._dataParam=dataParam;
}

//Business logic for form read 

//Get form design
CalemFormChart.prototype.getDesign =
function() {
	return 'CalemFormRecordDesign';
}