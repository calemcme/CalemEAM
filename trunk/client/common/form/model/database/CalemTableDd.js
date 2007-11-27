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
 * This is the class that provides all the meta data info about a table.
 */
 
/**
 * Constructor
 */
function CalemTableDd(tableDef) {
	if (arguments.length==0) return;
	this._baseTableDef=tableDef;
	this._reloadDd();
	this._gridWidth=CalemConf['view_datagrid_width'];
	this._fldEditSize=CalemConf['view_record_size']['edit'];
	this._fldReadSize=CalemConf['view_record_size']['read'];
	this._multiLineSize=CalemConf['view_engine']['multi_line'].size;
	this._multiLines=CalemConf['view_engine']['multi_line'].lines;
}

CalemTableDd.DROPDOWN='dropdown';
CalemTableDd.MEMORY='memory';
CalemTableDd.DATABASE='database';
CalemTableDd.GETALL= -1;

CalemTableDd.TEXT_INPUT_LENGTH=65536;
CalemTableDd.GUID_LENGTH = 36;

//Field types
CalemTableDd.TYPE_TEXT = 'text';
CalemTableDd.TYPE_JOIN = 'join';
CalemTableDd.TYPE_DROPDOWN_JOIN='dropdown_join';

CalemTableDd.TYPE_CURRENCY = 'currency';
CalemTableDd.TYPE_SYS_CURRENCY ='sys_currency';
CalemTableDd.TYPE_CURRENCY_ID ='currency_id';

CalemTableDd.TYPE_PASSWORD = 'password';


CalemTableDd.prototype.toString = 
function() {
	return "CalemTableDd";
}


//Add custom info
CalemTableDd.prototype._addCustomField=
function(id, field) {
	if (!CalemMetadataCustom[this.getCustomTableName()]) {
		CalemMetadataCustom[this.getCustomTableName()] = {fields: {}};
	}
	var fields = CalemMetadataCustom[this.getCustomTableName()].fields;
	fields[id] = field;
	this._reloadDd();
}

//Add custom info
CalemTableDd.prototype._deleteCustomField=
function(id) {
	var fields = CalemMetadataCustom[this.getCustomTableName()].fields;
	delete fields[id];
	this._reloadDd();
}

//Rename custom field
CalemTableDd.prototype._replaceCustomField=
function(oldId, id, field) {
	var fields = CalemMetadataCustom[this.getCustomTableName()].fields;
	var newFields={};
	for (var i in fields) {
		if (i==oldId) {
			newFields[id]=field;
		} else {
			newFields[i]=fields[i];
		}
	}
	CalemMetadataCustom[this.getCustomTableName()].fields=newFields;
	this._reloadDd();
}

//ReloadDD
CalemTableDd.prototype._reloadDd =
function() {
	//reload this table.
	this._baseTableDef = CalemMetadata[this.getTableName()]; //Source field changed.
	
	this._allTableDef=new Object();
	CalemViewUtil.addObject(this._baseTableDef, this._allTableDef);
	this._customTableDef=CalemMetadataCustom[this.getCustomTableName()];
	if (this._customTableDef) { //Generate a merged fields.
		var fields=this._allTableDef.fields;
		var allFields=new Object();
		CalemViewUtil.addObject(fields, allFields);
		var cFields=this._customTableDef.fields;
		CalemViewUtil.addObject(cFields, allFields);
		this._allTableDef.fields=allFields;
		this._customFieldList=CalemViewUtil.getListByMap(cFields);
	}
	//Constructing field list
	this._allFieldList=CalemViewUtil.getListByMap(this._allTableDef.fields);
	this._baseFieldList=CalemViewUtil.getListByMap(this._baseTableDef.fields);
}

/**
 * Dropdown as object format.
 */
CalemTableDd.prototype.getDropdownMap =
function() {
	if (!this._dropdownMap) {
		this._reloadDropdown();
	}
	return this._dropdownMap;
}

CalemTableDd.prototype._reloadDropdown =
function() {
	CalemTableDd.getRegistry().getCache()._loadDropdown(this.getTableName(), true);
	this._dropdownMap = this._createDropdownMap(CalemDropdown.get(this.getTableName()));
}

/**
 * Oob dropdown is stored as object format.
 */
CalemTableDd.prototype.getOobDropdownMap =
function() {
	if (!this._oobDropdownMap) {
		this._oobDropdownMap= this._createDropdownMap(CalemDropdown.getNoCustom(this.getTableName()));
	}
	return this._oobDropdownMap;
}

CalemTableDd.prototype._createDropdownMap =
function(dataList) {
	map={};
	var fldList=this.getFieldList();
	for (var i=0; i< dataList.length; i++) {
		var recList=dataList[i];
		var recMap={};
		for (var j=1; j< fldList.length; j++) {
			recMap[fldList[j]]=recList[j];
		}
		map[recList[0]]=recMap;
	}
	return map;
}

//Dropdown manipulation and refreshing.
CalemTableDd.prototype.createVtDropdownDd =
function(targetId) {
	var targetDd=CalemTableDd.getRegistry().getTableDd(targetId);
	var newDef=targetDd._baseTableDef;
	//Get base fields.
	var vtDd=CalemTableDd.getRegistry().getTableDd('vt_dropdown');	
	//rebuild fields for target.
	var fields=vtDd._baseTableDef.fields;
	var newFields={};	
	CalemViewUtil.addObject(vtDd._baseTableDef.fields, newFields);
	CalemViewUtil.addObject(this._baseTableDef.fields, newFields, true);
	
	newDef.fields=newFields;
	CalemMetadata[targetId]=newDef;
	targetDd._reloadDd();
}

CalemTableDd.prototype.addDropdown =
function(row) {
	var fields=this.getFields();
	var list=[];
	for (var i in fields) {
		list.push(row[i]);
	}
	CalemDropdown.addEntry(list, this.getTableName());
	this._reloadDropdown();	
}

CalemTableDd.prototype.deleteDropdown =
function(id) {
	CalemDropdown.deleteEntry(id, this.getTableName());
	this._reloadDropdown();	
}

CalemTableDd.prototype.modifyDropdown =
function(row) {
	var fields=this.getFields();
	var list=[];
	for (var i in fields) {
		list.push(row[i]);
	}
	CalemDropdown.modifyEntry(list, this.getTableName());
	this._reloadDropdown();	
}

CalemTableDd.prototype.swapDropdown =
function(srcId, dstId, tableId) {
	CalemDropdown.swapEntry(srcId, dstId, tableId);
	this._reloadDropdown();	
}

CalemTableDd.getRegistry =
function() {
	if (!CalemTableDd._reg) {
		CalemTableDd._reg=CalemContext.getInstance().getRegistry();
	}
	return CalemTableDd._reg;
}

/**
 * Row count to fetch
 */
CalemTableDd.prototype.getFetchCount =
function() {
	return (this.isCached()? CalemTableDd.GETALL : CalemConf['db_fetchCount']);
} 

/**
 * Basic services
 */
CalemTableDd.prototype.getTableName =
function() {
	return this._baseTableDef['table_name'];
}

CalemTableDd.prototype.getViewName =
function() {
	return this.getTableName();
}

CalemTableDd.prototype.getTableNameForDesign =
function() {
	return [CalemMsg.getMsg(this.getTableName()), ' (', this.getTableName(), ')'].join('');
}

CalemTableDd.prototype.getCustomTableName =
function() {
	return [CalemConst._TABLE_CUSTOM, this._baseTableDef['table_name']].join('');
}

CalemTableDd.prototype.getModule =
function() {
	return this._baseTableDef['module'];
}

//Order by 
CalemTableDd.prototype.getOrderBy =
function() {
	return this._baseTableDef['order_by'];
}
 
CalemTableDd.prototype.isDropdown =
function() {
	return this._baseTableDef.cache_type == CalemTableDd.DROPDOWN;
}

CalemTableDd.prototype.isMemoryCached =
function() {
	return (this._baseTableDef.cache_type == CalemTableDd.MEMORY);
}

/**
 * Query cache type of the table
 */
CalemTableDd.prototype.isCached =
function() {
	return (this.isDropdown() || this.isMemoryCached());
}

/**
 * Fields consist of core fields and custom fields.
 * getFields, getFieldList: core + custom
 * getCoreFields: core
 * getCustomFields: custom
 */
CalemTableDd.prototype.getFields =
function() {
	return this._allTableDef.fields;
}

CalemTableDd.prototype.getFieldList =
function() {
	return this._allFieldList;
}

CalemTableDd.prototype.getBaseFields =
function() {
	return this._baseTableDef.fields;
}

CalemTableDd.prototype.getCustomFields =
function() {
	return (this._customTableDef ? this._customTableDef.fields : null);
}

CalemTableDd.prototype.isField =
function(fld) {
	return this._allTableDef.fields[fld];
}

CalemTableDd.prototype.isBaseField =
function(fld) {
	return this._baseTableDef.fields[fld];
}

CalemTableDd.prototype.getLookupTableDd =
function(fld) {
	var dd=null;
	var rtn=this._allTableDef.fields[fld];
	if  (rtn) {
		rtn=rtn['lookup'];
		if (rtn) dd=CalemTableDd.getRegistry().getTableDd(rtn);
	}
	return dd;	
}

CalemTableDd.prototype.isJoinField =
function(fld) {
	var result=false;
	var rtn=this.getLookupTableDd(fld);
	if (rtn) {
		result=!rtn.isDropdown();
	}
	return result;		
}
	
CalemTableDd.prototype.isDropdownField =
function(fld) {
	var result=false;
	var rtn=this.getLookupTableDd(fld);
	if (rtn) {
		result=rtn.isDropdown();
	}
	return result;	
}
	
CalemTableDd.prototype.isMemoryCachedField =
function(fld) {
	var result=false;
	rtn=this.getLookupTableDd(fld);
	if (rtn) {
		result=rtn.isMemoryCached();
	}
	return result;	
}
	
CalemTableDd.prototype.getJoin =
function(fld) {
	var rtn=null;
	var lkupDd=this.getLookupTableDd(fld);
	if (lkupDd && !lkupDd.isDropdown()) { //it's a join field.
	   var map=lkupDd.getLookupMapping();
		rtn={table: lkupDd.getTableName(), field: map['field'], lkupField: map['primary']};
	}
	return rtn;
}

CalemTableDd.prototype.getLookupMapping =
function() {
	return this._allTableDef['lookup_mapping'];	
}

/**
 * The field is 'fieldName_lookupFieldName' if the field is to be brought over.
 */
CalemTableDd.prototype.getJoinFieldName=
function(fld) {
	var name=fld;
	var dd=this.getLookupTableDd(fld);
	if (dd && !dd.isDropdown()) {
		name=[fld, '__', dd.getShortName(dd.getPrimaryLookup())].join('');	
	}
	return name;	
}

//Get primary lookup field
CalemTableDd.prototype.getPrimaryLookup =
function() {
	return this._allTableDef['lookup_mapping'] ? this._allTableDef['lookup_mapping']['primary'] : null;	
}

//Short name support
CalemTableDd.prototype.getShortName=
function(fld) {
	return (this._allTableDef.fields[fld] && this._allTableDef.fields[fld]['sn']) ? this._allTableDef.fields[fld]['sn'] : fld;
}

/**
 * Presentation functions
 */

/**
 * Handles a few cases:
 * currency: print label as "labor cost (CAD):"
 * sys_currency: print lable as "labor cost (USD):"
 * lookup: to print as lookup table's name
 */
//External interface
CalemTableDd.prototype.getFieldLabel =
function(fld) {
	var msg=this._getFieldLabel(fld);
	if (msg) {
		if (this.isSysCurrencyField(fld)) {
			msg=[msg, " (", CalemConf['sys_currency'].id, ")"].join('');
		}
		return msg;
	}
	//Otherwise, let's look at the link only once.
	var lkupDd=this.getLookupTableDd(fld);
	if (lkupDd) {
		if (lkupDd.isDropdown()) {
			msg= CalemMsg.getMsg(lkupDd.getTableName(), true);
			if (msg) return msg;
			fld= lkupDd.getTableName();
		} else {
			var map=lkupDd.getLookupMapping();
			msg= lkupDd._getFieldLabel(map['primary']);
			if (msg) return msg;
			fld=map['primary'];
		}	
	}	
	//Msg not defined_ use field id.
	return '_'+fld;
}

CalemTableDd.prototype._getFieldLabel =
function(fld) {
	var msg;
	var msgId=this.getLabelId(fld);
	return CalemMsg.getMsg(msgId, true);
	}

CalemTableDd.prototype.getLabelId =
function(fld) {
	var id=this._allTableDef.fields[fld]['label'];
	return (id ? id : fld);
}

//System fields are internal fields that should not be displayed.
CalemTableDd.prototype.isSysField =
function(fld) {
	return (fld==CalemConst._REC_ID || this._allTableDef.fields[fld]['isSys']);
}

CalemTableDd.prototype.getIdFieldName =
function() {
	return CalemConst._REC_ID;
}

CalemTableDd.prototype.isRequired =
function(fld) {
	return (this._allTableDef.fields[fld]['required']==true);
}

CalemTableDd.prototype.isDateField=
function(fld) {	
	return (this._allTableDef.fields[fld]['type']=='date');
}

CalemTableDd.prototype.isTimeField=
function(fld) {
	return (this._allTableDef.fields[fld]['type']=='time');
}

CalemTableDd.prototype.isDateTimeField=
function(fld) {
	return (this._allTableDef.fields[fld]['type']=='datetime');
}

CalemTableDd.prototype.isBooleanField=
function(fld) {
	return (this._allTableDef.fields[fld]['type']=='boolean');
}

CalemTableDd.prototype.isNumericField=
function(fld) {
	var type=this._allTableDef.fields[fld]['type'];
	return (type=='int'||type=='double'||type=='currency'||type=='sys_currency'||type=='percent');
}

CalemTableDd.prototype.isIntegerField=
function(fld) {
	return (this._allTableDef.fields[fld]['type']=='int');
}

CalemTableDd.prototype.isNumberField=
function(fld) {
	var type=this._allTableDef.fields[fld]['type'];
	return (type=='double');
}

CalemTableDd.prototype.isPercentField=
function(fld) {
	var type=this._allTableDef.fields[fld]['type'];
	return (type=='percent');
}

CalemTableDd.prototype.isCurrencyField=
function(fld) {
	var type=this._allTableDef.fields[fld]['type'];
	return (type=='currency');
}

CalemTableDd.prototype.isSysCurrencyField=
function(fld) {
	var type=this._allTableDef.fields[fld]['type'];
	return (type=='sys_currency');
}

CalemTableDd.prototype.isCurrencyIdField=
function(fld) {
	var rtn= (this._allTableDef['currency_mapping']) ? (this._allTableDef['currency_mapping']['field'] == fld) : false;
	return rtn;
}

CalemTableDd.prototype.isStringField =
function(fld) {
	var type=this._allTableDef.fields[fld]['type'];
	return (type=='varchar'||type=='text'||type=='guid');
}

CalemTableDd.prototype.isTextField =
function(fld) {
	var type=this._allTableDef.fields[fld]['type'];
	return (type=='text' || (type=='varchar' && this._allTableDef.fields[fld]['length'] > this._multiLineSize));
}

CalemTableDd.prototype.isPasswordField =
function(fld) {
	return (this._allTableDef.fields[fld]['is_password']);
}

/**
 * Normalized field type
 */
CalemTableDd.prototype.getNormalizedType =
function(fld) {
	var type;
	var rtn=this.getLookupTableDd(fld);
	if (rtn) {
		if (rtn.isDropdown()) {
			type=CalemTableDd.TYPE_DROPDOWN_JOIN;
		} else if (this.isCurrencyIdField(fld)) {
			type=CalemTableDd.TYPE_CURRENCY_ID;
		} else {
			type=CalemTableDd.TYPE_JOIN;
		}
	} else if (this.isTextField(fld)) {
		type=CalemTableDd.TYPE_TEXT;
	} else if (this.isPasswordField(fld)) {
		type=CalemTableDd.TYPE_PASSWORD;
	} else {
		type=this._allTableDef.fields[fld]['type'];
		type= (type=='guid') ? 'varchar' : type;
	}
	return type;
}

/**
 * Get a list of tables that are cached (dropdown or memory cached)
 */
CalemTableDd.prototype.getCachedParentTableDds =
function() {
	var lkup;
	var tableDd;
	var rtn=[];
	for (var i in this._allTableDef['fields']) {
		if (lkup=this._allTableDef['fields'][i]['lookup']) {
			lkupDd=CalemTableDd.getRegistry().getTableDd(lkup);
			if (lkupDd.isCached()) {
				rtn.push(lkupDd);
			}
		}
	}
	return rtn;
}

/**
 * This is the query field list
 */
CalemTableDd.prototype.getFieldListForQuery =
function() {
	//Build the query first, then collect fields from query's select
	var tblQuery=this._buildGetAllQueryNoOrderBy();
	var select=tblQuery.getSelect()._select;
	var flds=[];
	CalemViewUtil.addList(this.getFieldList(), flds);
	for (var i=0; i< select.length; i++) {
		var sel=select[i];
		if (sel._table==this.getTableName() || sel._table==this.getCustomTableName()) continue;
		//Otherwise, assume a field object only
		if (sel._alias!=null) {
			CalemViewUtil.addList([sel._alias], flds);
		}
	}
	return flds;
}

/**
 * Creating a default record filling in all the default values
 * @return {fldList: arrayOfFields, recDefault: arrayOfDefaults}
 */
CalemTableDd.prototype.getDefaultRecord =
function() {
	var ar=this.getFieldListForQuery();
	var arDefaults=[];
	for (var i in ar) {
		arDefaults.push(null);
	}
	return {fldList: ar, recDefault: arDefaults};		
}  

/**
 * This is the get all query.
 */
CalemTableDd.prototype._buildGetAllQueryNoOrderBy =
function(includeMd) {
	var tableName=this.getTableName();
	var tableQuery=new CalemTableQuery(this.getViewName(), tableName); //So this is a GET query.
	var sf=new CalemSelectField(tableName); //This is select all from this table.
	tableQuery.addSelect(sf);
	//Build base table query.
	this._buildQueryJoins(this.getBaseFields(), tableName, tableQuery, includeMd);
	//Check custom table - custom fields don't support join fields.
	if (this.getCustomFields()) {//a) add a join; b) add select fields
		sf=new CalemSelectField(this.getCustomTableAlias());
		tableQuery.addSelect(sf);
		var join= new CalemTableJoin(CalemTableJoin.LEFT, tableName, 'id', 
								this.getCustomTableName(), CalemConst._REC_CUSTOM_ID);
		tableQuery.setWhere(this.getCustomTableName(), null, join);									
	}	
	return tableQuery;
}

/**
 * Custom table must use an alias that's used in join with the id field.
 */
CalemTableDd.prototype.getCustomTableAlias =
function() {
	return this.getCustomTableName()+ "_id";
}

CalemTableDd.prototype.isLookupMd =
function(fld) {
	var rtn=this._allTableDef['fields'][fld];
	return (rtn['lookup'] && rtn['md']);
}

/**
 * Construct query for base or custom tables
 */
CalemTableDd.prototype._buildQueryJoins =
function(flds, tableName, tableQuery, includeMd)  {
	//Now let's figure out which additional joins are necessary
	var lkupDd, join, tableJoin;
	for (var i in flds) {
		if (lkupDd=this.getLookupTableDd(i)) {
			if (lkupDd.isCached() || (!includeMd && this.isLookupMd(i))) continue;
			//a) Add a join for where and b) a field in select list.
			join=this.getJoin(i);
			var alias= tableQuery.nextAliasKey();
			tableJoin=new CalemTableJoin(CalemTableJoin.LEFT, tableName, i, join.table, join.field, alias);
			tableQuery.setWhere(tableJoin.getAlias(), null, tableJoin);
			//Add selection field.
			tableQuery.addSelect(new CalemSelectField(tableJoin.getAlias(), join.lkupField, 
			                         this.getJoinFieldName(i)) );
		}
	} 
}

/**
 * Utility function to build a select all query for a given table.
 * Also check for database dependent fields to add to join/select/order by.
 * 
 */
CalemTableDd.prototype.buildGetAllQuery =
function(includeMd) {
	var tableQuery=this._buildGetAllQueryNoOrderBy(includeMd);
	//Let's figure out order by if any.
	var orderBy=this.getOrderBy();
	if (orderBy) {
		var ob=CalemQueryOrderBy.createOrderBy(this, orderBy.field, orderBy.order);
		tableQuery.setOrderBy(ob);
	}
	return tableQuery;
}

/**
 * Utility function to build a select query to fetch data inserted
 * or updated.
 */
CalemTableDd.prototype.buildGetOneQuery =
function() {
	var tableQuery=this._buildGetAllQueryNoOrderBy();
	//Now add query by the id.
	var fld =new CalemDbField(this.getTableName(), this.getIdFieldName());
	var val =new CalemDbParamHolder(true);
	var expr=new CalemDbExpr(fld, CalemDbExpr.EQ, val)
	tableQuery.setWhere(this.getTableName(), expr);
	return tableQuery;
}

/**
 * Utility function to build a count query for a given id.
 */
CalemTableDd.prototype.buildGetAllQueryByLookup =
function(fld, lkupValue) {
	var tableQuery=this._buildGetAllQueryNoOrderBy();
	//Now add query by the fld.
	var fld =new CalemDbField(this.getTableName(), fld);
	var val =new CalemDbString(lkupValue);
	var expr=new CalemDbExpr(fld, CalemDbExpr.EQ, val)
	tableQuery.setWhere(this.getTableName(), expr);
	return tableQuery;
}

CalemTableDd.prototype.buildGetAllQueryByExpr =
function(expr) {
	var tableQuery=this._buildGetAllQueryNoOrderBy();
	tableQuery.setWhere(this.getTableName(), expr);
	return tableQuery;
}

//Get configuration by field type.
CalemTableDd.prototype._getConfByType =
function(type, conf) {
	var wd=conf[type];
	if (wd==null) {
		CalemDebug.info(this.getTableName()+", type="+type+", conf not defined!");
		wd=conf['default'];
	}
	return wd;
}

/**
 * Width are in pixels for grid display.
 */
CalemTableDd.prototype.getWidth =
function(fld) {
	return this._getGridWidthByType(this._allTableDef.fields[fld]['type']);
}

CalemTableDd.prototype._getGridWidthByType =
function(type) {
	return this._getConfByType(type, this._gridWidth);
}

CalemTableDd.prototype.getTextInputLengthByType =
function(type, fld) {
   var rtn=null;
	if (type=='varchar') {
		rtn=this._allTableDef.fields[fld]['length'];
	} else if (type=='guid') {
		rtn=CalemTableDd.GUID_LENGTH;
	} else if (type=='text') {
		rtn = CalemTableDd.LEN_TEXT_INPUT;
	} else {
		rtn = this._getConfByType(type, this._fldEditSize);
	}
	return rtn;
}
	
/**
 * Input length is in chars and are for record display.
 * @todo consider lookup - may need more accurate length here.
 */
CalemTableDd.prototype.getTextInputLength =
function(fld) {
	return this.getTextInputLengthByType(this._allTableDef.fields[fld]['type'], fld);
}

/**
 * Some special control about text display.
 */
CalemTableDd.prototype.getTextEditDisplayLength =
function(fld) {
	var rtn=this._allTableDef.fields[fld]['length'];
	var conf=CalemConf['view_record_size']['edit_varchar_display_max'];
	if (this.isTextField(fld) && conf['text']>0) {
		rtn=conf['text'];
	} else if (this.isPasswordField(fld) && conf['password']>0) {
		rtn=conf['password'];
	} else if (conf['varchar']>0) {
		rtn=conf['varchar'];
	}
	return rtn;
}

CalemTableDd.prototype.getDateInputLength =
function() {
	return this.getTextInputLengthByType('date');
}

CalemTableDd.prototype.getTimeInputLength =
function() {
	return this.getTextInputLengthByType('time');
}

/**
 * Read length
 */
CalemTableDd.prototype.getTextReadLength =
function(fld) {
	return this.getTextReadLengthByType(this._allTableDef.fields[fld]['type'], fld);
} 

CalemTableDd.prototype.getTextReadLengthByType =
function(type, fld) {
   var rtn=null;
	if (type=='varchar') {
		rtn=this._allTableDef.fields[fld]['length'];
	} else if (type=='guid') {
		rtn=CalemTableDd.GUID_LENGTH;
	} else if (type=='text') {
		rtn = CalemTableDd.LEN_TEXT_INPUT;
	} else {
		rtn = this._getConfByType(type, this._fldReadSize);
	}
	return rtn;
}

/**
 * This is for text field only.
 */
CalemTableDd.prototype.getTextDisplayLength =
function(fld) {
	return this._multiLineSize;
}

CalemTableDd.prototype.getTextDisplayRows =
function(fld) {
	var type=this._allTableDef.fields[fld]['type']; //Rows depending on type (varchar or text)
	return this._multiLines[type];
}

/**
 * Get default value
 */
CalemTableDd.prototype.getDefaultValue =
function(fld) {
	var fldDef=this._allTableDef.fields[fld];
	return fldDef['default'] ? fldDef['default'] : null;	
} 

CalemTableDd.prototype.getUniqueIndexes =
function() {
	return this._allTableDef['unique_indexes'];
}

CalemTableDd.prototype.getPrivate =
function(fld) {
	return this._allTableDef.fields[fld]['private'];
}
/**
 * creating item info on the fly
 */
CalemTableDd.prototype.getFieldInfo =
function(fld) {
	return new CalemFieldInfo(fld);
} 

CalemTableDd.prototype.getFieldLabelInfo =
function(fld) {
	return new CalemFieldLabelInfo(fld);
} 

CalemTableDd.prototype.getDesignLabel =
function(fld) {
	return [this.getFieldLabel(fld),
				' (', fld, ')'].join('');
}

/**
 * Min/Max value support
 */
CalemTableDd.prototype.getMinValue =
function(fld) {
	return this._allTableDef.fields[fld]['minVal'];
}

CalemTableDd.prototype.getMaxValue =
function(fld) {
	return this._allTableDef.fields[fld]['maxVal'];
}
