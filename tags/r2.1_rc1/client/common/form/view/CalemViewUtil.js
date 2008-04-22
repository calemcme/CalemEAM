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
 * View utility
 */
function CalemViewUtil() {
} 

/**
 * Set up height for an element.
 * 0 - default
 * -2 - auto
 * -1 - 100%
 * >0 - in pixels
 */
CalemViewUtil.H_DEFAULT = 0;
CalemViewUtil.H_FULL = -1;
CalemViewUtil.H_AUTO = -2;

CalemViewUtil.getHeight =
function(sz, yOff, height) {
	var rtn;
	if (height==CalemViewUtil.H_FULL) {
		rtn = sz.y - yOff;
	} else if (height==CalemViewUtil.H_DEFAULT) {
		rtn=CalemConf['view_engine']['defaultRowHeight'];		
	} else if (height == CalemViewUtil.H_AUTO) {
		rtn=CalemViewUtil.H_AUTO;
	} else if (height > 0) {
		rtn=height;
	} 
	return rtn;
}

CalemViewUtil.setHeight =
function(el, height) {
	if (height==CalemViewUtil.H_AUTO) return;
	Dwt.setSize(el, Dwt.DEFAULT, height);	
}

CalemViewUtil.setSize =
function(ctrl, width, height) {
	if (width==CalemViewUtil.H_AUTO) width=Dwt.DEFAULT;
	if (height==CalemViewUtil.H_AUTO) heigth=Dwt.DEFAULT;
	ctrl.setSize(width, height);	
}

CalemViewUtil.getHeightAfterLayout =
function(rowEl, height) {
	if (height==CalemViewUtil.H_AUTO) {
		height=Dwt.getSize(rowEl).y;
	}
	return height;
}

CalemViewUtil.setWidth =
function(el, width) {
	Dwt.setSize(el, width, Dwt.DEFAULT);	
}


/**
 * Swapping two TD or TRs
 * Wapping at TD/TR level will keep the control to html mapping intact.
 */
CalemViewUtil.swapNodes =
function(elA, idxA, elB, idxB) {
   if (idxA > idxB) {//Swapping to have A having a smaller index.
   	var temp=elA; elA=elB; elB=temp; //Swap elA, elB
   	temp=idxA; idxA=idxB; idxB=temp; //Swap idxA, idxB
   }
	var next=elB.nextSibling; //For placing B back.
	var bParent=elB.parentNode;
	//use dom to manipulate.
	bParent.removeChild(elB);
	elA.parentNode.replaceChild(elB, elA);
	if (next) {
		bParent.insertBefore(elA, next);
	} else {
		bParent.appendChild(elA);
	}
} 

/**
 * Field label
 */
CalemViewUtil.FLD_LABEL='flb_' ;
CalemViewUtil.getFieldLabel =
function(fld) {
	return CalemViewUtil.FLD_LABEL+fld;
}

CalemViewUtil.isFieldLabel =
function(lb) {
	return lb.indexOf(CalemViewUtil.FLD_LABEL)==0;
}

CalemViewUtil.getFieldFromLabel =
function(lb) {
	return lb.substring(CalemViewUtil.FLD_LABEL.length);
}

CalemViewUtil.getItemInfo =
function(id, viewInfo, tableDd) {
	var item=viewInfo.getItem(id);
	if (!item) {
		if (tableDd.isField(id)) item=tableDd.getFieldInfo(id);
		else if (CalemViewUtil.isFieldLabel(id)) {
			item=tableDd.getFieldLabelInfo(CalemViewUtil.getFieldFromLabel(id));
		}
	}
	return item;
}

//Get a boolean map by list values
CalemViewUtil.getMapByList =
function(myLayout) {
	var map=new Object();
	if (myLayout) {
		for (var i=0; i< myLayout.length; i++) {
			map[myLayout[i]]=true;
		}
	}	
	return map;
}

CalemViewUtil.getMapByRows =
function(rows) {
	var map=new Object();
	if (rows) {
		for (var i=0; i< rows.length; i++) {
			var cols=rows[i].getCols();
			for (j=0; j< cols.length; j++) {
				map[cols[j]]=true;
			}
		}	
	}
	return map;
}

CalemViewUtil.getGridColMapByListInfo =
function(listInfo) {
	var map=new Object();
	if (listInfo && listInfo.getColList()) {
		var list=listInfo.getColList();
		for (var i=0; i< list.length; i++) {
			map[list[i].getId()]=true;
			
		}
	}
	return map;
}

CalemViewUtil.getListByMap =
function(map) {
	var list=[];
	if (map) {
		for (var i in map) {
			list.push(i);
		}
	}	
	return list;
}

/** 
 * Search utility functions
 */
CalemViewUtil.getSearchByTable =
function(table, type) {
	var userInfo=CalemContext.getInstance().getUserInfo();
	var map=new Object();
	if (type==CalemConst.MY_SEARCH) {
		CalemViewUtil.addSearchByTable(table, userInfo.uid, map);
	} else { //Shared case.
	   CalemViewUtil.addSearchByTable(table, userInfo.gid, map);
	   CalemViewUtil.addSearchByTable(table, CalemConst.CUSTOM_SYSTEM, map);
	   CalemViewUtil.addSearchByTable(table, CalemConst.CALEM_OOB, map);
	}
	return map;
}

CalemViewUtil.addSearchByTable =
function(table, id, map) {	
	CalemSearchDef.getSearchByTable(table);
	if (CalemSearchDef[table][id]) {
		for (var i in CalemSearchDef[table][id]) {	
			map[i]=CalemJson.setJson(CalemSearchDef[table][id][i]);
		}
	}
}
 
CalemViewUtil.canEditSharedSearch =
function(search) {
	var userInfo=CalemContext.getInstance().getUserInfo();
	return CalemDropdownUtil.isAdmin(userInfo.admin_type_id) ? 
				true : (CalemDropdownUtil.isAdminGroup(userInfo.admin_type_id)
	    					&& userInfo.gid==search.getAxoId());
}

/**
 * Update local search
 */
CalemViewUtil.updateLocalSearch =
function(searchInfo)  {
	var table=searchInfo.getTable();
	var axoId=searchInfo.getAxoId();
	if (!CalemSearchDef[table][axoId]) {
		CalemSearchDef[table][axoId]=new Object();
	}
	eval("var search="+searchInfo.getJson());
	CalemSearchDef[table][axoId][searchInfo.getId()]=search;
}

CalemViewUtil.deleteLocalSearch =
function(search)  {
	delete CalemSearchDef[search.getTable()][search.getAxoId()][search.getId()];
}

/**
 * Shared verifyInput for datetime field (search and normal editing)
 */
CalemViewUtil.datetimeVerifyInput =
function(dateField, timeField) {
	var valid=(dateField.isValid() && timeField.isValid());
	if (valid) { //Check field values (in case having a time portion but not date portion).
		var date=dateField.getFieldValue();
		var time=timeField.getFieldValue();
		valid = (date || (!date && !time));
	}
	if (valid) {
		dateField.clearFieldError();
		timeField.clearFieldError();
	} else {
		var msg=CalemMsg.getMsg("datetime_not_valid");
		dateField.setFieldError(msg);
		timeField.setFieldError(msg);
		throw msg;
	}
	return true;
} 

/**
 * Boolean search value list
 */
CalemViewUtil.getBooleanSearchOptions =
function() {
	if (!CalemViewUtil._BooleanSearchOptions)	{
		var obj=new Object();
		obj[CalemConst._EMPTY]=new DwtSelectOption(CalemConst._EMPTY, false, CalemMsg.getMsg('no_selection'));
		obj[CalemConst._TRUE]=new DwtSelectOption(CalemConst._TRUE, false, CalemMsg.getMsg('boolean_true'));
		obj[CalemConst._FALSE]=new DwtSelectOption(CalemConst._FALSE, false, CalemMsg.getMsg('boolean_false'));
		CalemViewUtil._BooleanSearchOptions=obj;
	}
	return CalemViewUtil._BooleanSearchOptions;
} 

/**
 * Refresh from server
 * - refresh search
 * - refresh view
 */
CalemViewUtil.getRefreshTargets =
function() {
	var userInfo=CalemContext.getInstance().getUserInfo();
	var rtn={row_0: {target: userInfo.uid, shared: 0},
			   row_1: {target: userInfo.gid, shared: 1}};
	if (!CalemDropdownUtil.isGroupCustom(userInfo.gid)) {
		rtn.row_2={target: CalemConst.CUSTOM_SYSTEM, shared: 1};
	}
	if (!CalemDropdownUtil.isGroupCalem(userInfo.gid)) {
		rtn.row_3={target: CalemConst.CALEM_OOB, shared: 1};
	}				   
	return rtn;
} 

/**
 * Check min w/h
 */
CalemViewUtil.validateGridSize =
function(width, height) {
	var conf=CalemConf['view_engine'].grid.min;
	width= (width > conf.width) ? width : conf.width;
	height= (height > conf.height) ? height : conf.height;
	return {width: width, height: height};
}

/**
 * Show status synchronously without holding up the control flow.
 */
CalemViewUtil.showStatus =
function(msg) { //default mapping.
	window.status=msg;
}

/**
 * Store info about row height for a data grid
 */
CalemViewUtil.getUorH =
function() {
	if (!CalemViewUtil._uorH) {
		return CalemConf['view_engine']['grid']['defaultRowH'];
	}
	return CalemViewUtil._uorH;	
} 

CalemViewUtil.setUorH = 
function(uorH) {
	if (CalemViewUtil._uorH) {//Use max so it's not shrinking existing rows.
		CalemViewUtil._uorH = Math.max(CalemViewUtil._uorH, uorH);
	} else {
		CalemViewUtil._uorH=uorH;
	}
}

CalemViewUtil.isCustomizeTab =
function(tabId) {
	return (tabId==CalemConst._TAB_CUSTOMIZE);
}

/** sort conf */
CalemViewUtil.sortCaseSensitive =
function() {
	return CalemConf['db_recordList']['sortCaseSensitive'];	
}

CalemViewUtil.addObject =
function(objSrc, objDest, noOverwrite) {
	if (objSrc) {
		for (var i in objSrc) {
			if (noOverwrite) {
				if (objDest[i]) continue;
			}
			objDest[i]=objSrc[i];
		}
	}
}

CalemViewUtil.addList =
function(listSrc, listDest) {
	if (listSrc) {
		var j=listDest.length;
		for (var i=0; i< listSrc.length; i++) {
			listDest[j++]=listSrc[i];
		}
	}
}

//Get vt_field_type by id
CalemViewUtil.getVtFieldTypeById =
function(id) {
	return id.substr('vt_field_'.length);
}

CalemViewUtil.getIdByVtFieldType =
function(id) {
	return ['vt_field_', id].join('');
}

CalemViewUtil.getLocaleClient =
function() {
	return CalemContext.getInstance().getUserInfo().locale;
}

CalemViewUtil.getLocaleServer =
function(locale) {
	var serverMap=CalemConf['view_engine']	['labelDesign']['locale']['serverMap'];
	locale = serverMap[locale] ? serverMap[locale].id : locale;
	return locale;
}

/**
 * Split data into base and custom
 */
CalemViewUtil.partitionData = 
function(tableDd, row) {
	var rowBase={};
	var rowCustom={};
	if (!tableDd.getCustomFields()) {
		rowBase=row;
	} else {
		for (var i in row) {
			if (tableDd.isBaseField(i)) rowBase[i]=row[i];
			else rowCustom[i]=row[i];
		}
	}
	return {base: rowBase, custom: rowCustom};
} 

CalemViewUtil.getFormControllerById =
function(fmId) {
	var fmInfo=CalemJson.setJson(CalemItemDef[fmId]);
	fmId = fmInfo.getController() || fmId;
	return fmId;
}

CalemViewUtil.getChartExportUrl =
function() {
	return [calemRequestUrl, '?aid=', CalemConf['chart_engine']['exportAid']].join('');	
}
	
