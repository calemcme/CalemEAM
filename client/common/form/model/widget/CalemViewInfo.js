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
 * CalemViewInfo
 */
function CalemViewInfo() {
}

CalemViewInfo.prototype.toString = function() {return "CalemViewInfo";}
CalemViewInfo.prototype.getClassName = function() {return "CalemViewInfo";}

//Deserialize the object
CalemViewInfo.prototype.setJson =
function(obj) {
   this._id=obj.id;
   this._layout=CalemJson.setJson(obj.layout);
   this._itemMap=CalemJson.setJson(obj.itemMap);
}

//Serialization
CalemViewInfo.prototype.getJson =
function() {
	return ["{CalemViewInfo: {id: '", this._id, "', layout: ", this._layout.getJson(), 
	              ", itemMap: ", this._itemMap.getJson(), "}}"].join('');
}

CalemViewInfo.prototype.getId =
function() {
	return this._id;
}

CalemViewInfo.prototype.getLayout =
function() {
	return this._layout;
}

CalemViewInfo.prototype.getItem =
function(id) {
	return this._itemMap.get(id);}

CalemViewInfo.prototype.getItemMap =
function() {
	return this._itemMap;
}

/**
 * CalemLayoutInfo
 */
function CalemLayoutInfo() {}

CalemLayoutInfo.prototype.toString = function() {return 'CalemLayoutInfo';}

CalemLayoutInfo.prototype.setJson =
function(obj) {
	this._tableLayout=CalemJson.setJson(obj.tableLayout);
	this._colLayout=CalemJson.setJson(obj.colLayout);
	this._rows = CalemJson.setJsonAsArray(obj.rows);
}

CalemLayoutInfo.prototype.getJson =
function() {
	return ["{CalemLayoutInfo: {tableLayout: ", this._tableLayout.getJson(), ", colLayout: ", this._colLayout.getJson(), 
	               ", rows: ", CalemJson.arrayToJson(this._rows), "}}"].join('');
}

CalemLayoutInfo.prototype.getColLayout =
function() {
	return this._colLayout;
}

CalemLayoutInfo.prototype.getTableLayout =
function() {
	return this._tableLayout;
}

CalemLayoutInfo.prototype.getRows =
function() {
	return this._rows;
}

/**
 * CalemTableLayoutInfo
 */
function CalemTableLayoutInfo() {}

CalemTableLayoutInfo.prototype.toString = function() {return 'CalemTableLayoutInfo';}

CalemTableLayoutInfo.prototype.setJson =
function(obj) {
	this._width=obj.width;
	this._height=obj.height;
}

CalemTableLayoutInfo.prototype.getJson =
function() {
	return ["{CalemTableLayoutInfo: {width: ", this._width !=null ? ["'", this._width, "'"].join('') : 'null', ", height:", 
	           this._height!=null ? this._height : 'null', "}}"].join('');
}

CalemTableLayoutInfo.prototype.getWidth =
function() {
	return this._width;
}

CalemTableLayoutInfo.prototype.getHeight =
function() {
	return this._height;
}


/**
 * CalemColLayoutInfo
 */
function CalemColLayoutInfo() {}

CalemColLayoutInfo.prototype.toString = function() {return 'CalemColLayoutInfo';}

CalemColLayoutInfo.prototype.setJson =
function(obj) {
	this._colCount=obj.colCount;
}

CalemColLayoutInfo.prototype.getJson =
function() {
	return ["{CalemColLayoutInfo: {colCount: ", this._colCount,"}}"].join('');
}

CalemColLayoutInfo.prototype.getColCount =
function() {
	return this._colCount;
}

/**
 * CalemTrInfo
 */
function CalemTrInfo(cols, height) {
	if (arguments.length==0) return;
	this._height= height || CalemViewUtil.H_AUTO;
	this._cols = cols;
}

CalemTrInfo.prototype.toString = function() {return 'CalemTrInfo';}

CalemTrInfo.prototype.setJson =
function(obj) {
	this._height=obj.height ? obj.height : CalemViewUtil.H_AUTO;
	this._cols=obj.cols;
}

CalemTrInfo.prototype.getJson =
function() {
	return ["{CalemTrInfo: {height: ", this._height,", cols: ", CalemJson.arrayToJson(this._cols), "}}"].join('');
}

CalemTrInfo.prototype.getHeight =
function() {
	return this._height;
}

CalemTrInfo.prototype.getCols =
function() {
	return this._cols;
}

/**
 * CalemItemMap
 */
function CalemItemMap() {}

CalemItemMap.prototype.toString = function() {return "CalemItemMap";}

CalemItemMap.prototype.setJson =
function(obj) {
	this._itemMap=CalemJson.setJsonByMap(obj);
}

CalemItemMap.prototype.getJson = 
function() {
	return ["{CalemItemMap: ", CalemJson.mapToJson(this._itemMap), "}"].join('');
}

CalemItemMap.prototype.get =
function(id) {
	return this._itemMap[id];
}

CalemItemMap.prototype.getMap =
function() {
	return this._itemMap;
}

/**
 * CalemLabelInfo
 */
function CalemLabelInfo() {}

CalemLabelInfo.prototype.toString = function() {return "CalemLabelInfo";}
CalemLabelInfo.prototype.getClassName = function() {return "CalemLabelInfo";}

CalemLabelInfo.prototype.setJson =
function(obj) {
	this._id=obj.id;
	this._ccsClass=obj.className;
	this._icon=obj.icon;
}

CalemLabelInfo.prototype.getJson = 
function() {
	var rtn=["{CalemLabelInfo: {id: '", this._id, "'"].join('');
	if (this._ccsClass) rtn=[rtn, ", className: '", this._ccsClass, "'"].join('');
	if (this._icon) rtn=[rtn, ", icon: '", this._icon,"'"].join('');
	return [rtn, "}}"].join('');
}

//Service APIs
CalemLabelInfo.prototype.getId =
function() {
	return this._id;
}

CalemLabelInfo.prototype.getCcsClass =
function() {
	return this._ccsClass;
}

CalemLabelInfo.prototype.getIcon =
function() {
	return this._icon;
}

CalemLabelInfo.prototype.getLabel =
function() {
	return CalemMsg.getMsg(this._id);
}

/**
 * CalemDesignLabelInfo
 */
function CalemDesignLabelInfo() {}

CalemDesignLabelInfo.prototype = new CalemLabelInfo();
CalemDesignLabelInfo.prototype.constructor=CalemDesignLabelInfo;

CalemDesignLabelInfo.prototype.toString = function() {return "CalemDesignLabelInfo";}
CalemDesignLabelInfo.prototype.getClassName = function() {return "CalemDesignLabelInfo";}

/**
 * CalemFieldLabelInfo
 */
function CalemFieldLabelInfo(fld) {
	if (arguments.length==0) return;
	this._field=fld;
}

CalemFieldLabelInfo.prototype.toString = function() {return "CalemFieldLabelInfo";}
CalemFieldLabelInfo.prototype.getClassName = function() {return "CalemFieldLabelInfo";}

CalemFieldLabelInfo.prototype.setJson =
function(obj) {
	this._field=obj.field;
}

CalemFieldLabelInfo.prototype.getJson = 
function() {
	return ["{CalemFieldLabelInfo: {field: '", this._field, "'}}"].join('');
}

//Service APIs
CalemFieldLabelInfo.prototype.getField =
function() {
	return this._field;
}

/**
 * CalemFieldInfo
 */
function CalemFieldInfo(fld) {
	if (arguments.length==0) return;
	this._field=fld;
}

CalemFieldInfo.prototype.toString = function() {return "CalemFieldInfo";}
CalemFieldInfo.prototype.getClassName = function() {return "CalemFieldInfo";}

CalemFieldInfo.prototype.setJson =
function(obj) {
	this._field=obj.field;
}

CalemFieldInfo.prototype.getJson = 
function() {
	return ["{CalemFieldInfo: {field: '", this._field, "'}}"].join('');
}

//Service APIs
CalemFieldInfo.prototype.getField =
function() {
	return this._field;
}

/**
 * CalemHSeparatorInfo
 */
function CalemHSeparatorInfo() {}

CalemHSeparatorInfo.prototype.toString = function() {return "CalemHSeparatorInfo";}
CalemHSeparatorInfo.prototype.getClassName = function() {return "CalemHSeparatorInfo";}

CalemHSeparatorInfo.prototype.setJson =
function(obj) {
	this._size=obj;
}

CalemHSeparatorInfo.prototype.getJson = 
function() {
	return ["{CalemHSeparatorInfo: ", this._size+"}"].join('');
}

//Service APIs
CalemHSeparatorInfo.prototype.getCssClassName =
function() {
	return CalemConf['view_engine']['hsepClassName'];
}

/**
 * CalemDesignSelectInfo
 */
function CalemDesignSelectInfo() {}

CalemDesignSelectInfo.prototype.toString = function() {return "CalemDesignSelectInfo";}
CalemDesignSelectInfo.prototype.getClassName = function() {return "CalemDesignSelectInfo";}

CalemDesignSelectInfo.prototype.setJson =
function(obj) {
	this._size=obj.size;
}

CalemDesignSelectInfo.prototype.getJson = 
function() {
	return ["{CalemDesignSelectInfo: {size: ", this._size+"}}"].join('');
}

//Service APIs
CalemDesignSelectInfo.prototype.getSize =
function() {
	return this._size;
}

/**
 * CalemRecordDesignTreeInfo
 */
function CalemRecordDesignTreeInfo() {}

CalemRecordDesignTreeInfo.prototype.toString = function() {return "CalemRecordDesignTreeInfo";}
CalemRecordDesignTreeInfo.prototype.getClassName = function() {return "CalemRecordDesignTreeInfo";}

CalemRecordDesignTreeInfo.prototype.setJson =
function(obj) {
}

CalemRecordDesignTreeInfo.prototype.getJson = 
function() {
	return ["{CalemDesignRecordTreeInfo: true}"].join('');
}

/**
 * CalemListDesignTreeInfo
 */
function CalemListDesignTreeInfo() {}

CalemListDesignTreeInfo.prototype.toString = function() {return "CalemListDesignTreeInfo";}
CalemListDesignTreeInfo.prototype.getClassName = function() {return "CalemListDesignTreeInfo";}

CalemListDesignTreeInfo.prototype.setJson =
function(obj) {
}

CalemListDesignTreeInfo.prototype.getJson = 
function() {
	return ["{CalemListDesignTreeInfo: true}"].join('');
}


//Edit schedule info
function CalemEditScheduleInfo(fld) {
	if (arguments.length==0) return;
	this._field=fld;
}

CalemEditScheduleInfo.prototype.toString = function() {return "CalemEditScheduleInfo";}
CalemEditScheduleInfo.prototype.getClassName = function() {return "CalemEditScheduleInfo";}

CalemEditScheduleInfo.prototype.setJson =
function(obj) {
	this._field=obj.field;
}

CalemEditScheduleInfo.prototype.getJson = 
function() {
	return ["{CalemEditScheduleInfo: {field: '", this._field, "'}}"].join('');
}

CalemEditScheduleInfo.prototype.getField =
function() {
	return this._field;
}

//Edit schedule time info
function CalemEditScheduleTimeInfo(fld) {
	if (arguments.length==0) return;
	this._field=fld;
}

CalemEditScheduleTimeInfo.prototype.toString = function() {return "CalemEditScheduleTimeInfo";}
CalemEditScheduleTimeInfo.prototype.getClassName = function() {return "CalemEditScheduleTimeInfo";}

CalemEditScheduleTimeInfo.prototype.setJson =
function(obj) {
	this._field=obj.field;
}

CalemEditScheduleTimeInfo.prototype.getJson = 
function() {
	return ["{CalemEditScheduleTimeInfo: {field: '", this._field, "'}}"].join('');
}

CalemEditScheduleTimeInfo.prototype.getField =
function() {
	return this._field;
}

/**
 * CalemChartInfo
 */
function CalemChartInfo(id) {
	if (arguments.length==0) return;
	this._id=id;
}

CalemChartInfo.prototype.toString = function() {return "CalemChartInfo";}
CalemChartInfo.prototype.getClassName = function() {return "CalemChartInfo";}

CalemChartInfo.prototype.setJson =
function(obj) {
	this._id=obj.id;
}

CalemChartInfo.prototype.getJson = 
function() {
	return ["{CalemChartInfo: {id: '", this._id, "'}}"].join('');
}

//Service APIs
CalemChartInfo.prototype.getId =
function() {
	return this._id;
}

//Line charts
function CalemChartLineInfo(id) {
	if (arguments.length==0) return;
	CalemChartInfo.call(this, id);
}

CalemChartLineInfo.prototype = new CalemChartInfo;
CalemChartLineInfo.prototype.constructor = CalemChartLineInfo

CalemChartLineInfo.prototype.toString = function() {return "CalemChartLineInfo";}
CalemChartLineInfo.prototype.getClassName = function() {return "CalemChartLineInfo";}

//Pie charts
function CalemChartPieInfo(id) {
	if (arguments.length==0) return;
	CalemChartInfo.call(this, id);
}

CalemChartPieInfo.prototype = new CalemChartInfo;
CalemChartPieInfo.prototype.constructor = CalemChartPieInfo

CalemChartPieInfo.prototype.toString = function() {return "CalemChartPieInfo";}
CalemChartPieInfo.prototype.getClassName = function() {return "CalemChartPieInfo";}

//Column charts
function CalemChartColumnInfo(id) {
	if (arguments.length==0) return;
	CalemChartInfo.call(this, id);
}

CalemChartColumnInfo.prototype = new CalemChartInfo;
CalemChartColumnInfo.prototype.constructor = CalemChartColumnInfo

CalemChartColumnInfo.prototype.toString = function() {return "CalemChartColumnInfo";}
CalemChartColumnInfo.prototype.getClassName = function() {return "CalemChartColumnInfo";}

/**
 * CalemFileUploadInfo
 */
function CalemFileUploadInfo(fld) {
	if (arguments.length==0) return;
	this._field=fld;
}

CalemFileUploadInfo.prototype.toString = function() {return "CalemFileUploadInfo";}
CalemFileUploadInfo.prototype.getClassName = function() {return "CalemFileUploadInfo";}

CalemFileUploadInfo.prototype.setJson =
function(obj) {
	this._field=obj.field;
}

CalemFileUploadInfo.prototype.getJson = 
function() {
	return ["{", this.toString(), ": {field: '", this._field, "'}}"].join('');
}

CalemFileUploadInfo.prototype.getField =
function() {
	return this._field;
}

/**
 * CalemEditFileUploadInfo
 */
function CalemEditFileUploadInfo(fld) {
	if (arguments.length==0) return;
	CalemFileUploadInfo.call(this, fld);
}


CalemEditFileUploadInfo.prototype = new CalemFileUploadInfo;
CalemEditFileUploadInfo.prototype.constructor = CalemEditFileUploadInfo;


CalemEditFileUploadInfo.prototype.toString = function() {return "CalemEditFileUploadInfo";}
CalemEditFileUploadInfo.prototype.getClassName = function() {return "CalemEditFileUploadInfo";}

/**
 * CalemNewFileUploadInfo
 */
function CalemNewFileUploadInfo(fld) {
	if (arguments.length==0) return;
	CalemFileUploadInfo.call(this, fld);
}


CalemNewFileUploadInfo.prototype = new CalemFileUploadInfo;
CalemNewFileUploadInfo.prototype.constructor = CalemNewFileUploadInfo;


CalemNewFileUploadInfo.prototype.toString = function() {return "CalemNewFileUploadInfo";}
CalemNewFileUploadInfo.prototype.getClassName = function() {return "CalemNewFileUploadInfo";}

/**
 * CalemReadFileUploadInfo
 */
function CalemReadFileUploadInfo(fld) {
	if (arguments.length==0) return;
	CalemFileUploadInfo.call(this, fld);
}


CalemReadFileUploadInfo.prototype = new CalemFileUploadInfo;
CalemReadFileUploadInfo.prototype.constructor = CalemReadFileUploadInfo;


CalemReadFileUploadInfo.prototype.toString = function() {return "CalemReadFileUploadInfo";}
CalemReadFileUploadInfo.prototype.getClassName = function() {return "CalemReadFileUploadInfo";}

/**
 * CalemReadFileAttachmentInfo
 */
function CalemReadFileAttachmentInfo(fld) {
	if (arguments.length==0) return;
	CalemFileUploadInfo.call(this, fld);
}


CalemReadFileAttachmentInfo.prototype = new CalemFileUploadInfo;
CalemReadFileAttachmentInfo.prototype.constructor = CalemReadFileAttachmentInfo;


CalemReadFileAttachmentInfo.prototype.toString = function() {return "CalemReadFileAttachmentInfo";}
CalemReadFileAttachmentInfo.prototype.getClassName = function() {return "CalemReadFileAttachmentInfo";}
