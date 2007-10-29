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
 * CalemTableQuery includes the where, orderBy and range to use 
 * when fetching data from a table. CalemTableQuery is mainly used
 * to fetch data for presentation.
 */
function CalemTableQuery(id, table, type) {
	if (arguments.length == 0) return;
	this._id=id;	
	this._table=table;
	this._type=type || CalemTableQuery.GET;
	this._select=new CalemQuerySelect();
	this._where=new CalemQueryWhere();	
	this._aliasKey=1;
}

CalemTableQuery.GET='GET';
CalemTableQuery.GET_COUNT='GET_COUNT';
CalemTableQuery.UPDATED='UPDATED';
CalemTableQuery.DELETED='DELETED';

CalemTableQuery.prototype.toString =
function() {
	return 'CalemTableQuery';
}

CalemTableQuery.prototype.nextAliasKey =
function() {
	return this._aliasKey++;
}

CalemTableQuery.prototype.getType =
function() {
	return this._type;
}

CalemTableQuery.prototype.addSelect =
function(fld) {
	this._select.add(fld);
}

CalemTableQuery.prototype.removeSelect =
function(fld) {
	this._select.remove(fld);
}

CalemTableQuery.prototype.getSelect =
function() {
	return this._select;
}

CalemTableQuery.prototype.setWhere =
function(table, expr, tblJoin) {
	this._where.set(table, expr, tblJoin);
}

CalemTableQuery.prototype.addWhere =
function(table, leftField, expr, tableDd) {
	this._where.addWhereExpr(table, leftField, expr, tableDd);
}

CalemTableQuery.prototype.getWhere =
function(table, leftFld) {
	return this._where.get(table, leftFld);
}

CalemTableQuery.prototype.getWhereAll =
function() {
	return this._where;
}

CalemTableQuery.prototype.hasWhereExpr =
function() {
	return this._where.hasWhereExpr();
}

CalemTableQuery.prototype.query =
function(rec) {
	return this._where.query(rec);
}

CalemTableQuery.prototype.setOrderBy =
function(orderBy) {
	this._orderBy=orderBy;
	/** this is not necessary since it's already handled by the system */
	/*
	if (orderBy.getAlias()) { //Then this is a join field, so let's add to select list
		this.addSelect(orderBy.getSelectField());
	}
	*/
}

CalemTableQuery.prototype.getOrderBy =
function() {
	return this._orderBy;
}

CalemTableQuery.prototype.setRange =
function(range) {
	this._range=range;
}

CalemTableQuery.prototype.getRange =
function() {
	return this._range;
}

//Serialization for persistence.
CalemTableQuery.prototype.getJson =
function() {
	var srcTable= this._srcTable ? [", srcTable: '", this._srcTable, "'"].join('') : '';
	var rtn=["{", this.toString(), ": {type: '", this._type, "'", srcTable, ", table: '", this._table, "', select: ", this._select.getJson(),
	         ", where: ", this._where.getJson()].join('');
	if (this._orderBy) rtn=[rtn, ", orderBy: ", this._orderBy.getJson()].join('');
	if (this._range) rtn=[rtn, ", range: ", this._range.getJson()].join('');
	return (rtn + "}}");
}

CalemTableQuery.prototype.setJson =
function(obj) {
	this._type=obj.type;
	this._srcTable=obj.srcTable;
	this._table=obj.table;
	this._select=CalemJson.setJson(obj.select);
	this._where=CalemJson.setJson(obj.where);
	this._orderBy=CalemJson.setJson(obj.orderBy);
	this._range=CalemJson.setJson(obj.range);	
}

//sql building
CalemTableQuery.prototype.getSql =
function() {
	//Using SQL join to build select and from
	var rtn=[this._select.getSql(), " FROM ", this._table].join('');
	if (this._where) rtn=[rtn, ' ', this._where.getSql()].join('');
	if (this._orderBy) rtn=[rtn, ' ', this._orderBy.getSql()].join('');
	if (this._range) rtn=[rtn, ' ', this._range.getSql()].join('');
	return rtn;
}

CalemTableQuery.prototype.getCountSql =
function() {
	var rtn=["SELECT count(*) FROM ", this._table].join('');
	if (this._where) rtn=[rtn, ' ', this._where.getCountSql()].join('');
	return rtn;
}

//soap structure
CalemTableQuery.prototype.getSoap =
function() {
	return {table: this._table, type: this._type, sql: this.getSql(), countSql: this.getCountSql()};
}

//Count soap only
CalemTableQuery.prototype.getSoapCount =
function() {
	return {table: this._table, type: CalemTableQuery.GET_COUNT, countSql: this.getCountSql()};
}

CalemTableQuery.prototype.getFullTableId =
function() {
	return this._table;
}

CalemTableQuery.prototype.getTableId =
function() {
	return this._table;
}

CalemTableQuery.prototype.getId =
function() {
	return this._id;
}

/**
 * CalemQueryUpdated
 * this query finds out records updated from the database.
 * @param table - table to query updated values
 * @param time - data changed after the time to be fetched
 * @param fld - field to apply the time
 */
function CalemQueryUpdated(id, table, time, fld) {
	if (arguments.length==0) return;
	CalemTableQuery.call(this, id, table, CalemTableQuery.UPDATED);
	//Add selection
	var sel=new CalemSelectField(this._table);
	this.addSelect(sel);
	//Set time
	this.setTimeValue(time, fld);
}

CalemQueryUpdated.prototype=new CalemTableQuery;
CalemQueryUpdated.prototype.constructor=CalemQueryUpdated;

CalemQueryUpdated.prototype.toString=
function() {
	return 'CalemQueryUpdated';
}

CalemQueryUpdated.prototype.setTimeValue =
function(val, fld) {
	fld= fld || 'modified_time';
	fld=new CalemDbField(this._table, fld);
	val=new CalemDbString(val);
	var exprTime=new CalemDbExpr(fld, CalemDbExpr.GTEQ, val);
	//add to query
	this.setWhere(this._table, exprTime);
}

CalemQueryUpdated.prototype.getCountSql =
function() {
	return ["SELECT count(*) FROM ", this._table].join('');
}

/**
 * CalemQueryDeleted
 * this query finds out records deleted from the database.
 * @param table - table to query deleted values
 * @param time - time after which deletion is made.
 * 
 */
function CalemQueryDeleted(id, table, time) {
	if (arguments.length==0) return;
	CalemTableQuery.call(this, id, CalemQueryDeleted.TABLE, CalemTableQuery.DELETED);
	this._srcTable=table;
	//Add selection
	var sel=new CalemSelectField(this._table, 'rec_id');
	this.addSelect(sel);
	//Set time value
	this.setTimeValue(time);
}

CalemQueryDeleted.TABLE='recycle_bin';

CalemQueryDeleted.prototype=new CalemTableQuery;
CalemQueryDeleted.prototype.constructor=CalemQueryDeleted;

CalemQueryDeleted.prototype.toString=
function() {
	return 'CalemQueryDeleted';
}

CalemQueryDeleted.prototype.setTimeValue =
function(value) {
	var andExpr=new CalemExprAnd();
	//-created_time
	var fld=new CalemDbField(this._table, 'created_time');
	var val=new CalemDbString(value);
	var exprTime=new CalemDbExpr(fld, CalemDbExpr.GTEQ, val);
	//-table name
	fld=new CalemDbField(CalemQueryDeleted.TABLE, 'table_name');
	val=new CalemDbString(this._srcTable);
	var exprTable=new CalemDbExpr(fld, CalemDbExpr.EQ, val);
	//-adding exprs together.
	andExpr.add(exprTime);
	andExpr.add(exprTable);
	//add to query
	this.setWhere(this._table, andExpr);
}

//soap structure
CalemQueryDeleted.prototype.getSoap =
function() {
	return {table: this._srcTable, type: this._type, sql: this.getSql()};
}

CalemQueryDeleted.prototype.getFullTableId =
function() {
	return [this._table, '_', this._srcTable].join('');
}

CalemQueryDeleted.prototype.getTableId =
function() {
	return this._srcTable;
}

/** * CalemQuerySelect
 * Each select field is of the format: 
 * {id: project_no, alias: project_id__project_no}
 * or just: 
 * {id: modified_time} 
 */
function CalemQuerySelect() {
	this._select=new Array();
}

CalemQuerySelect.prototype.add =
function(fld) {
	this._replace(fld);
}

CalemQuerySelect.prototype._replace =
function(fld) {
	var replaced=false;
	for (var i=0; i< this._select.length; i++) {
		if (this._select[i].equals(fld)) {
			delete this._select[i];
			this._select[i]=fld;
			replaced=true;
			break;
		}
	}
	if (!replaced) this._select.push(fld);
}

CalemQuerySelect.prototype.remove =
function(fld) {
	for (var i=0; i< this._select.length; i++) {
		if (this._select[i].equals(fld)) {
			var del=this._select.splice(i, 1);
			delete del[0];
			break;
		}
	}
}

//serialization
CalemQuerySelect.prototype.getJson =
function() {
	return ["{CalemQuerySelect: ", CalemJson.arrayToJson(this._select), "}"].join('');
}

CalemQuerySelect.prototype.setJson =
function(ar) {
	CalemJson.setJsonByArray(ar, this);
}

CalemQuerySelect.prototype.getSql =
function() {
	return 'SELECT ' + CalemJson.arrayToSql(this._select, ',');
}

/**
 * CalemTableField object
 */
function CalemSelectField(table, field, alias) {
	if (arguments.length == 0) return;
	this._table=table;
	this._field=field;
	this._alias=alias;
}

CalemSelectField.prototype.getOrderByField =
function() {
	var rtn= this._alias ? this._alias : this._field;
	return rtn;
}

CalemSelectField.prototype.getJson =
function() {
	var rtn=["{CalemSelectField: {table: '", this._table,"'"].join('');
	if (this._field) {
		rtn=[rtn, ", field: '", this._field, "'"].join('');
		if (this._alias) {
			rtn=[rtn, ", alias: '", this._alias, "'"].join('');
		}
	}
	return (rtn +"}}");
}

CalemSelectField.prototype.setJson =
function(obj) {
	this._table=obj.table;
	this._field=obj.field;
	this._alias=obj.alias;
}

CalemSelectField.prototype.getSql =
function() {
	var rtn;
	if (!this._field) {
		rtn=[this._table, ".*"].join('');
	} else if (!this._alias) {
		rtn=[this._table, ".", this._field].join('');
	} else {
		rtn=[this._table, ".", this._field, " AS ", this._alias].join('');
	}
	return rtn;
}

CalemSelectField.prototype.equals =
function(fld) {
	return (fld instanceof CalemSelectField
	        && fld._table===this._table
	        && fld._field===this._field
	        && fld._alias===this._alias); 	
}

/**
 * CalemQueryWhere 
 */
function CalemQueryWhere() {
	this._where=new Object();
}

CalemQueryWhere.prototype.set =
function(table, expr, tblJoin) {
	//use table join for the where key if applicable
	var key= (tblJoin) ? table+"__"+tblJoin.getLeftField() : table;
	this._where[key]=new CalemWhereItem(table, expr, tblJoin);
}

CalemQueryWhere.prototype.get =
function(table, leftField) {
	var key= leftField ? table+"__"+leftField : table;
	return this._where[key];
}

CalemQueryWhere.prototype.hasWhereExpr =
function() {
	var hasExpr=false;
	for (var i in this._where) {
		var item=this._where[i];
		if (item.getExpr()) {
			hasExpr=true;
			break;
		}
	}
	return hasExpr;
}

/**
 * For now we're supporting only one table query only.
 * Table join is not considered at this time.
 */
CalemQueryWhere.prototype.getCoreExpr =
function() {
	var rtn=null;
	for (var i in this._where) {
		rtn=this._where[i].getExpr();
		break;
	}
	return rtn;
}

CalemQueryWhere.prototype.query =
function(rec) {
	var match=true;
	for (var i in this._where) {
		var item=this._where[i];
		if (!item.query(rec)) {
			match=false;
			break;
		}
	}
	return match;
}

CalemQueryWhere.prototype.getJson =
function() {
	return ["{CalemQueryWhere: ", CalemJson.arrayToJson(this._where), "}"].join('');
}

CalemQueryWhere.prototype.setJson =
function(obj) {
	for (var i=0; i< obj.length; i++) {
		var o=CalemJson.setJson(obj[i]);
		this._where[o._table]=o;
	}
}

//Need to build out the join info first - followed by where conditions.
CalemQueryWhere.prototype.getSql =
function(noLeftJoin) {
	var joins=[];
	var where=[];
	for (var i in this._where) {
		if (noLeftJoin) {
			var whereItem=this._where[i];
			if (whereItem.getJoin() && whereItem.getJoin().isLeftJoin() && !whereItem.getExpr()) continue;
		}
		var jn=this._where[i].getJoinSql();
		if (jn) joins.push(jn);
		var ex=this._where[i].getExprSql();
		if (ex) where.push(ex);
	}
	var rtn='';
	var stw='';
	if (joins.length > 0)rtn=joins.join(' ');
	if (where.length==1) {
		stw=["WHERE ", where].join('');
	} else if (where.length > 1) {
		stw=["WHERE ", where.join(' AND ')].join('');
	}
	return (rtn + stw);
}

//To skip left join for count calculation when possible
CalemQueryWhere.prototype.getCountSql =
function() {
	//Figure out if left-join is needed.
	var noLeftJoin=true;
	for (var i in this._where) {
		var whereItem=this._where[i];
		if (whereItem.getJoin()) continue;
		//This is one that does not have a join so it's where conditions
		var expr=whereItem.getExpr();
		noLeftJoin=expr.isExprOnTable(i);
		break;		
	}
	return this.getSql(noLeftJoin);
}

CalemQueryWhere.prototype.addWhereExpr =
function(table, leftField, expr, tableDd) {
	var where=this.get(table, leftField);
	var whereExpr= where ? where.getExpr() : null;
	if (whereExpr) {
		if (whereExpr instanceof CalemExprAnd) {
			whereExpr.add(expr);
		} else {
			var ne=new CalemExprAnd();
			ne.add(whereExpr);
			ne.add(expr);
			whereExpr=ne;
		}
	} else {
		whereExpr=expr;
	}
	if (where) {
		where.setExpr(whereExpr);
	} else if (!leftField) {
		this.set(table, whereExpr);
	} else { //Must create a join here.
		join=tableDd.getJoin(leftField);
		tableJoin=new CalemTableJoin(CalemTableJoin.LEFT, this._table, leftField, join.table, join.field);
		this.set(table, whereExpr, tableJoin);
	}
}

/**
 * Each where item
 */
function CalemWhereItem(table, expr, join) {
	if (arguments.length==0) return;
	this._table=table;
	this._expr=expr;
	this._join=join;
}

CalemWhereItem.prototype.getJoin =
function() {
	return this._join;
}

CalemWhereItem.prototype.getExpr =
function() {
	return this._expr;
}

CalemWhereItem.prototype.setExpr =
function(expr) {
	this._expr=expr;
}

CalemWhereItem.prototype.query =
function(rec) {
	return (this._expr ? this._expr.query(rec) : true);
}

CalemWhereItem.prototype.getJson =
function() {
	var expr=this._expr ? ([", expr:", this._expr.getJson()].join('')) : '';
	if (this._join) {
			rtn=["{CalemWhereItem: {table: '", this._table, "'", expr, ", tblJoin: ", this._join.getJson(), "}}"].join('');
		} else {
			rtn=["{CalemWhereItem: {table: '", this._table, "'", expr, "}}"].join('');
		}
	return rtn;
}

CalemWhereItem.prototype.setJson =
function(obj) {
	this._table=obj.table;
	this._expr=CalemJson.setJson(obj.expr);
	this._join=CalemJson.setJson(obj.tblJoin);
}

CalemWhereItem.prototype.getJoinSql =
function() {
	var rtn=null;
	if (this._join) rtn=this._join.getSql();
	return rtn;
}

CalemWhereItem.prototype.getExprSql =
function() {
	var rtn=null;
	if (this._expr) rtn=this._expr.getSql();
	return rtn;
}

/**
 * Table join class.
 */
function CalemTableJoin(type, leftTbl, leftFld, rightTbl, rightFld, aliasKey) {
	if (arguments.length == 0) return;	
	this._type=type;
	this._leftTbl=leftTbl;
	this._leftFld=leftFld;
	this._rightTbl=rightTbl;
	this._rightFld=rightFld;
	this._aliasKey=aliasKey
}

CalemTableJoin.LEFT='LEFT';
CalemTableJoin.INNTER='INNER';

CalemTableJoin.prototype.getJson =
function() {
	return ["{CalemTableJoin: {type: '", this._type, "', leftTbl: '", this._leftTbl, "', leftFld: '",
	        this._leftFld, "', rightTbl: '", this._rightTbl, "', rightFld: '", this._rightFld, "'",
	        (this._aliasKey ? [", aliasKey: '", this._aliasKey, "'"].join('') : ''), "}}"].join('');
}

CalemTableJoin.prototype.setJson =
function(obj) {
	this._type=obj.type;
	this._leftTbl=obj.leftTbl;
	this._leftFld=obj.leftFld;
	this._rightTbl=obj.rightTbl;
	this._rightFld=obj.rightFld;
	this._aliasKey=obj.aliasKey;
}

CalemTableJoin.prototype.getLeftField =
function() {
	return this._leftFld;
}

CalemTableJoin.prototype.getSql =
function() {
	return [' ', this._type, ' JOIN ', this._rightTbl, 
	        " as ",this.getAlias(), 
	        ' ON ', this._leftTbl, '.',
	        this._leftFld, '=', this.getAlias(),
	        '.', this._rightFld, ' '].join('');
}

CalemTableJoin.prototype.getAlias =
function() {
	return [this._rightTbl, '_', this._leftFld].join('');
}

CalemTableJoin.prototype.isLeftJoin =
function() {
	return this._type==CalemTableJoin.LEFT;
}

/**
 * Table orderBy class
 */
function CalemQueryOrderBy(fld, order) {
	if (arguments.length == 0) return;
	this._field=fld;
	this._order= order || CalemQueryOrderBy.ASC;	
} 

//Let's create order by as well as a select field if any.
CalemQueryOrderBy.createOrderBy =
function(tableDd, fldName, order) {
	var lkupDd, isJoin;
	if (lkupDd=tableDd.getLookupTableDd(fldName)) {
		isJoin=(!lkupDd.isCached()); 
	}
	var sel;
	if (isJoin) {
		var alias=tableDd.getJoinFieldName(fldName);
		sel=new CalemSelectField(tableDd.getTableName(), fldName, alias);
	} else {
		sel=new CalemSelectField(tableDd.getTableName(), fldName);
	}
	return new CalemQueryOrderBy(sel, order);
}

CalemQueryOrderBy.ASC='ASC';
CalemQueryOrderBy.DESC='DESC';

CalemQueryOrderBy.prototype.getJson =
function() {
	return ["{CalemQueryOrderBy: {field: ", this._field.getJson(), ", order: '", this._order, "'}}"].join('');
}

CalemQueryOrderBy.prototype.setJson =
function(obj) {
	this._field=CalemJson.setJson(obj.field);
	this._order=obj.order;
}

CalemQueryOrderBy.prototype.getSql =
function() {
	return [' ORDER BY ', this._field.getOrderByField(), ' ', this._order].join('');
}

CalemQueryOrderBy.prototype.isAscending =
function() {
	return this._order==CalemQueryOrderBy.ASC;
}

CalemQueryOrderBy.prototype.getField =
function() {
	return this._field._field;
}

CalemQueryOrderBy.prototype.getAlias =
function() {
	return this._field._alias;
}

CalemQueryOrderBy.prototype.getSelectField = 
function() {
	return this._field;
}

CalemQueryOrderBy.prototype.equals =
function(ob) {
	return (ob!=null && ob instanceof CalemQueryOrderBy && this._field.equals(ob._field) && this._order==ob._order);
}

/**
 * Table range to fetch
 */
function CalemQueryRange(start, size) {
	if (arguments.length==0) return;
	this._start=start || 0;
	this._size=size || CalemConf['db_query']['fetchCount'];	
}

CalemQueryRange.ALL=CalemConf['db_query']['maxFetchCount'];

CalemQueryRange.prototype.getJson =
function() {
	return ['{CalemQueryRange: {start: ', this._start, ', size: ', this._size,'}}'].join('');
}

CalemQueryRange.prototype.setJson =
function(obj) {
	this._start=obj.start;
	this._size=obj.size;
}

//MySql only at this time.
CalemQueryRange.prototype.getSql =
function() {
	return [' LIMIT ', this._start, ", ", this._size].join('');
}
