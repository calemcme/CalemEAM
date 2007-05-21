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


//Checking basic initialization
if (!defined('_CALEM_DIR_')) die("Access denied at ".__FILE__);

require_once _CALEM_DIR_ . 'server/include/util/CalemJson.php';

class CalemExprComposite {
	const COMPOSITE_AND = 'AND';
	const COMPOSITE_OR = 'OR';
	
	private $type;
	private $exprs;
	
	public function __construct($type) {
		$this->type=$type;
		$this->exprs= array();
	}

	public function add($expr) {
		array_push($this->exprs, $expr);
	}

	public function getSql() {
		return '(' . CalemJson::arrayToSql($this->exprs, $this->type) . ")";
	}
}

class CalemExprAnd extends CalemExprComposite {
	public function __construct() {
		parent::__construct(CalemExprComposite::COMPOSITE_AND);
	}	
}

class CalemExprOr extends CalemExprComposite {
	public function __construct() {
		parent::__construct(CalemExprComposite::COMPOSITE_OR);
	}	
}

/**
 * These expr classes are ported from client's CalemDbExpr.
 * Supported exprs: ==, !=, >=, >, <=, <, isNull, isNotNull, like, in, and, or
 * 
 */
class CalemDbExpr {
	const EXPR_EQ = '=';
	const EXPR_NEQ = '<>';
	const EXPR_GTEQ = '>=';
	const EXPR_GT = '>';
	const EXPR_LTEQ = '<=';
	const EXPR_LT = '<';
	const EXPR_IS_NULL = 'IS NULL';
	const EXPR_IS_NOT_NULL = 'IS NOT NULL';
	const EXPR_LIKE = 'LIKE';
	const EXPR_IN = 'IN';
	
	
	private $field;
	private $op;
	private $value;
	
	public function __construct($fld, $op, $value) {
		$this->field=$fld;
		$this->op=$op;
		$this->value=$value;
	}

	public function getSql() {
		$rtn= $this->field->getSql() . ' ' . $this->op;
		if ($this->op != CalemDbExpr::EXPR_IS_NULL && $this->op != CalemDbExpr::EXPR_IS_NOT_NULL) {
			$rtn .= ' ' . $this->value->getSql($this->op);	
		}
		return $rtn;
	}

	public function getValue() {
		return $this->value;
	}
	
	public function getOp() {
		return $this->op;
	}
}

/**
 * CalemField
 */
class CalemDbField {
	
	private $table;
	private $field;
	
	public function __construct($table, $fld) {
		$this->table=$table;
		$this->field = $fld;
	}

	public function getSql() {
		return $this->table . '.' . $this->field;
	}
	
	public function getField() {
		return $this->field;
	}
	
	public function getTable() {
		return $this->table;
	}
}

/**
 * CalemDbValue 
 * Derived classes:
 * <ul>
 * <li>CalemDbString - normal string
 * <li>CalemDbLookup - id and string
 * <li>CalemDbNumber
 * <li>CaldmDbUser
 * <li>CalemDbDate
 * <li>CalemDbTime
 * <li>CalemDbDateTime
 * <li>CalemDbHolder
 * </ul>
 */
class CalemDbValue {
	protected $value;
	
	public function __construct($val) {
		$this->value=$val;
	}

	public function getValue() {
		return $this->value;
	}
	
	public function getRawValue() {
		return $this->value;
	}

	public function getSql($op) {
		return $this->value;
	}
}

/**
 * CalemDbString
 * 
 */
class CalemDbString extends CalemDbValue {

	public function getSql($op) {
		$rtn=$this->value;
		if ($op && $op==CalemDbExpr::EXPR_LIKE) {
			$rtn ='%' . $rtn .'%';
		}
		return "'" . $rtn . "'";
	}
}

/**
 * CalemDbNumber
 * 
 */
class CalemDbNumber extends CalemDbValue {	
}

/**
 * CalemDbDate
 * Internal format is GMT string format already.
 */
class CalemDbDate extends CalemDbString {
}


/**
 * CalemDbDateTime
 * Internal format is GMT datetime format ready for query.
 */
class CalemDbDateTime extends CalemDbString {
}

/**
 * CalemDbTime
 * Internal format is time format already
 */
class CalemDbTime extends CalemDbString {
}

/**
 * CalemDbParamHolder
 * 
 */
class CalemDbParamHolder extends CalemDbValue {
	public function getSql() {
		return '?';
	}
}

/**
 * CalemDbDropdown
 * $value is the raw string value.
 */
class CalemDbDropdown extends CalemDbString {
}

/**
 * CalemDbBoolean
 */
class CalemDbBoolean extends CalemDbNumber {
}

?>