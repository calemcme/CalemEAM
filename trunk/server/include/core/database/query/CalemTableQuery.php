<?php
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
if (!defined('_CALEM_DIR_')) die("Access denied at ".__FILE__);

require_once _CALEM_DIR_ . 'server/include/core/database/query/CalemDbExpr.php';

/**
 * CalemTableQuery includes the where, orderBy and range to use 
 * when fetching data from a table. CalemTableQuery is mainly used
 * to fetch data for presentation.
 */
class CalemTableQuery {
	const GET = 'get';
	
	protected $id;
	protected $table;
	protected $type;
	protected $select;
	protected $where;
	protected $aliasKey;
	protected $orderBy;
	protected $range;
	
	public function __construct($id, $table=null, $type=CalemTableQuery::GET) {
		$this->id=$id;
		$this->table=$table ? $table : $id;
		$this->type=$type;
		
		$this->select=new CalemQuerySelect();
		$this->where=new CalemQueryWhere();
		$this->aliasKey=1;
	}


	public function nextAliasKey() {
		return $this->aliasKey++;
	}
	
	public function getType() {
		return $this->type;
	}
	
	public function addSelect($fld) {
		$this->select->add($fld);
	}
	
	public function removeSelect($fld) {
		$this->select->remove($fld);
	}
	
	public function getSelect() {
		return $this->select;
	}
	
	public function setWhere($table, $expr, $tblJoin=null) {
		$this->where->set($table, $expr, $tblJoin);
	}
	
	/** Adding where sql directly */
	public function setWhereSql($sql) {
		$this->where->setSql($sql);	
	}
	
	public function addWhere($table, $leftField, $expr, $tableDd=null) {
		$this->where->addWhereExpr($table, $leftField, $expr, $tableDd=null);
	}
	
	public function getWhere($table, $leftFld) {
		return $this->where->get($table, $leftFld);
	}
	
	public function hasWhereExpr() {
		return $this->where->hasWhereExpr();
	}
	
	public function setOrderBy($orderBy) {
		$this->orderBy=$orderBy;
	}
	
	public function getOrderBy() {
		return $this->orderBy;
	}
	
	public function setRange($range) {
		$this->range=$range;
	}
	
	public function getRange() {
		return $this->range;
	}
	
	//sql building
	public function getSql() {
		$rtn= $this->select->getSql() . " FROM " . $this->table;
		if ($this->where) $rtn .= $this->where->getSql();
		if ($this->orderBy) $rtn .= $this->orderBy->getSql();
		if ($this->range) $rtn .= $this->range->getSql();
		return $rtn;
	}
	
	public function getFullTableId() {
		return $this->table;
	}
	
	public function getTableId() {
		return $this->table;
	}
	
	public function getId() {
		return $this->id;
	}
}
	
	/**	 * CalemQuerySelect
	 * Each select field is of the format: 
	 * {id: project_no, alias: project_id__project_no}
	 * or just: 
	 * {id: modified_time} 
	 */
class CalemQuerySelect {
	protected $select;
	
	public function __construct() {
		$this->select = array();
	}
	
	public function add($fld) {
		$this->replace($fld);
	}
	
	public function replace($fld) {
		$replaced=false;
		for ($i=0; $i< count($this->select); $i++) {
			if ($this->select[$i]->equals($fld)) {
				$replaced=true;
				break;
			}
		}
		if (!$replaced) {
			array_push($this->select, $fld);
		}
	}
	
	public function remove($fld) {
		for ($i=0; i< count($this->select); $i++) {
			if ($this->select[$i]->equals($fld)) {
				$this->select->splice($i, 1);
				break;
			}
		}
	}
	
	public function getSql() {
		return 'SELECT ' . CalemJson::arrayToSql($this->select, ',');
	}
}
	
	/**
	 * CalemTableField object
	 */
class CalemSelectField {
	public $table;
	public $field;
	public $alias;
	
	public function __construct($table, $field=null, $alias=null) {
		$this->table=$table;
		$this->field=$field;
		$this->alias=$alias;
	}
	
	public function getOrderByField() {
		$rtn= $this->alias ? $this->alias : $this->field;
		return $rtn;
	}
	
	public function getSql() {
		if (!$this->field) {
			$rtn=$this->table . ".*";
		} else if (!$this->alias) {
			$rtn=$this->table . "." . $this->field;
		} else {
			$rtn= $this->table . "." . $this->field . " AS " . $this->alias;
		}
		return $rtn;
	}
	
	public function equals($fld) {
		return (is_a($fld, 'CalemSelectField') 
		        && $fld->table===$this->table
		        && $fld->field===$this->field
		        && $fld->alias===$this->alias); 	
	}
}
	
	/**
	 * CalemQueryWhere 
	 */
class CalemQueryWhere {
	private $where;
	private $sql;
	
	public function __construct() {
		$this->where=array();
	}
	
	public function set($table, $expr, $tblJoin=null) {
		//use table join for the where key if applicable
		$key= ($tblJoin) ? $table . "__" . $tblJoin->getLeftField() : $table;
		$this->where[$key]=new CalemWhereItem($table, $expr, $tblJoin);
	}
	
	public function setSql($sql) {
		$this->sql=$sql;
	}
	
	public function get($table, $leftField=null) {
		$key= $leftField ? $table . "__" . $leftField : $table;
		return $this->where[$key];
	}
	
	public function hasWhereExpr() {
		$hasExpr=false;
		foreach ($this->where as $key=>$val) {
			if ($val->getExpr()) {
				$hasExpr=true;
				break;
			}
		}	
		return $hasExpr;
	}
	
	//Need to build out the join info first - followed by where conditions->
	public function getSql($noLeftJoin=false) {
		$joins=array();
		$where=array();
		foreach ($this->where as $key=>$wi) {
			if ($noLeftJoin) {
				if ($wi->getJoin() && $wi->getJoin()->isLeftJoin() && !$wi->getExpr()) continue;
			}
			$jn=$wi->getJoinSql();
			if ($jn) array_push($joins, $jn);
			$ex=$wi->getExprSql();
			if ($ex) array_push($where, $ex);
		}
		$rtn='';
		$stw='';
		if (count($joins) > 0) $rtn= implode(' ', $joins);
		if (count($where)==1) {
			$stw= " WHERE " . implode(' ', $where);
		} else if (count($where) > 1) {
			$stw= " WHERE " .  implode(' AND ', $where);
		}
		if ($this->sql) {//if there's a fixed SQL already
			if ($stw) $stw .= ' AND ' . $this->sql;
			else $stw = ' WHERE ' . $this->sql;
		}
		return ($rtn . $stw);
	}
	
	public function addWhereExpr($table, $leftField, $expr, $tableDd=null) {
		$where=$this->get($table, $leftField);
		$whereExpr= $where ? $where->getExpr() : null;
		if ($whereExpr) {
			if (is_a($whereExpr, 'CalemExprAnd')) {
				$whereExpr->add($expr);
			} else {
				$ne=new CalemExprAnd();
				$ne->add($whereExpr);
				$ne->add($expr);
				$whereExpr=$ne;
			}
		} else {
			$whereExpr=$expr;
		}
		if ($where) {
			$where->setExpr($whereExpr);
		} else if (!$leftField) {
			$this->set($table, $whereExpr);
		} else { //Must create a join here
			$join=$tableDd->getJoin($leftField);
			$tableJoin=new CalemTableJoin(CalemTableJoin::LEFT, $this->table, $leftField, $join->table, $join->field);
			$this->set($table, $whereExpr, $tableJoin);
		}
	}
}
	
/**
 * Each where item
 */
class CalemWhereItem {
	private $table;
	private $expr;
	private $join;
	
	public function __construct($table, $expr, $join) {
		$this->table=$table;
		$this->expr=$expr;
		$this->join=$join;
	}
	
	public function getJoin() {
		return $this->join;
	}
	
	public function getExpr() {
		return $this->expr;
	}
	
	public function setExpr($expr) {
		$this->expr=$expr;
	}
	
	public function getJoinSql() {
		$rtn=null;
		if ($this->join) $rtn=$this->join->getSql();
		return $rtn;
	}
	
	public function getExprSql() {
		$rtn=null;
		if ($this->expr) $rtn=$this->expr->getSql();
		return $rtn;
	}
}
	
/**
 * Table join class->
 */
class CalemTableJoin {
	const LEFT='LEFT';
	const INNTER='INNER';
	
	private $type;
	private $leftTbl;
	private $rightTbl;
	private $rightFld;
	private $aliasKey;
	
	public function __construct($type, $leftTbl, $leftFld, $rightTbl, $rightFld, $aliasKey=null) {
		$this->type=$type;
		$this->leftTbl=$leftTbl;
		$this->leftFld=$leftFld;
		$this->rightTbl=$rightTbl;
		$this->rightFld=$rightFld;
		$this->aliasKey= ($aliasKey ? $aliasKey : ($this->rightTbl . '_' . $this->leftFld) );
	}
	
	public function getLeftField() {
		return $this->leftFld;
	}
	
	public function getSql() {
		return (' ' . $this->type . ' JOIN ' . $this->rightTbl .
		        ' AS ' . $this->getAlias() . 
		        ' ON ' . $this->leftTbl . '.' .
		        $this->leftFld . '=' . $this->getAlias() .
		        '.' . $this->rightFld . ' ');
	}
	
	public function getAlias () {
		return $this->aliasKey;
	}
	
	public function isLeftJoin() {
		return $this->type==CalemTableJoin::LEFT;
	}
}
	
/**
 * Table orderBy class
 */
class CalemQueryOrderBy {
	const ASC = 'ASC';
	const DESC = 'DESC';
	
	public $field;
	public $order;
	
	public function __construct($fld, $order=CalemQueryOrderBy::ASC) {
		$this->field=$fld;
		$this->order=$order;	
	} 
	
	//Let's create order by as well as a select field if any->
	public static function createOrderBy($tableDd, $fldName, $order) {
		$lkupDd=$tableDd->getLookupTableDd($fldName);
		if ($lkupDd) {
			$alias=$tableDd->getJoinFieldName($fldName);
			$sel=new CalemSelectField($tableDd->getTableName(), $fldName, $alias);
		} else {
			$sel=new CalemSelectField($tableDd->getTableName(), $fldName);
		}
		return new CalemQueryOrderBy($sel, $order);
	}
	
	public function getSql() {
		return ' ORDER BY ' . $this->field->getOrderByField() . ' ' . $this->order;
	}
	
	public function isAscending() {
		return $this->order==CalemQueryOrderBy::ASC;
	}
	
	public function getField() {
		return $this->field->field;
	}
	
	public function getAlias() {
		return $this->field->alias;
	}
	
	public function getSelectField() {
		return $this->field;
	}
	
	public function equals($ob) {
		return ($ob!=null && $ob instanceof CalemQueryOrderBy && $this->field->equals($ob->field) && $this->order==$ob->order);
	}
}
	
/**
 * Table range to fetch
 */
class CalemQueryRange {
	private $start;
	private $size;
	
	public function __construct($start=0, $size=0) {
		$this->start=$start;
		$this->size= size ? size : 40; //hard-coded here.	
	}
	
	//MySql only at this time->
	public function getSql() {
		return ' LIMIT ' . $this->start . ", " . $this->size;
	}
}
?>
