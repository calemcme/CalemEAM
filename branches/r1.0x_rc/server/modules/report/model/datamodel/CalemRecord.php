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

require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';
require_once _CALEM_DIR_ . 'server/include/util/CalemMsg.php';
require_once _CALEM_DIR_ . 'server/include/util/CalemText.php';
require_once _CALEM_DIR_ . 'server/modules/report/model/datamodel/CalemRecordList.php';
 
/**
 * Ported and simplified from web client for reports.
 */
class CalemRecord {
	private $recList;
	private $recValue;
	private $tableDd;
	private $id;
	
	private $fields;
	 
	public function CalemRecord($recList, $row) {
		$this->recList=$recList;
		$this->recValue=$row;
		$this->tableDd=$recList->getTableDd();
		if ($row) $this->id=$row['id'];
		
		$this->fields=array();
	}
	
	/** 
	 * factory method to create a field 
	 * Note: all fields returned from MySql are strings so let's convert for numeric fields here.
	 */ 
	public function createField($fn, $value, $tableDd) {
		if ($tableDd->isDropdownField($fn)) {
			$fld=new CalemDropdownField($this, $fn, $value);
		} else if ($tableDd->isJoinField($fn)) {		
			$joinValue=$this->recValue[$tableDd->getJoinFieldName($fn)];
			$fld=new CalemJoinField($this, $fn, $value, $joinValue);
		} 
		//Date, Time and DateTime fields
		else if ($tableDd->isDateField($fn) ) {
			$fld=new CalemDateField($this, $fn);
			$fld->setServerDateString($value);
		} else if ($tableDd->isTimeField($fn) ) {
			$fld=new CalemTimeField($this, $fn);
			$fld->setServerTimeString($value);
		} else if ($tableDd->isDateTimeField($fn) ) {
			$fld=new CalemDateTimeField($this, $fn);
			$fld->setServerDateTimeString($value);
		} 
		//Boolean
		else if ($tableDd->isBooleanField($fn) ) {
			$fld=new CalemBooleanField($this, $fn, $value);
		} 
		//Integer and number fields
		else if ($tableDd->isIntegerField($fn)) {
			$fld=new CalemIntegerField($this, $fn, $value);
		} else if ($tableDd->isNumberField($fn)) {
			$fld=new CalemNumberField($this, $fn, $value);
		} 
		//Currency and currencyId fields
		else if ($tableDd->isCurrencyField($fn)) {
			$fld=new CalemCurrencyField($this, $fn, $value);
		} else if ($tableDd->isSysCurrencyField($fn)) {
			$fld=new CalemSysCurrencyField($this, $fn, $value);
		} else if ($tableDd->isCurrencyIdField($fn)) {
			$fld=new CalemCurrencyIdField($this, $fn, $value);
		} 
		//text fields
		else if ($tableDd->isStringField($fn)) {
			$fld=new CalemStringField($this, $fn, $value);
		}
		//Otherwise it's the system field
		else if ($fn==$tableDd->getIdFieldName()) { //Create Id field
			$fld=new CalemStringField($this, $fn, $value);
		}
		return $fld;
	}
	
	public function getTableDd() {return $this->tableDd;}
	
	public function getField($fld) {
		if (!$this->fields[$fld]) {
			$this->fields[$fld]=$this->createField($fld, $this->getRawValue($fld), $this->tableDd);
		}
		return $this->fields[$fld];
	}
	
	public function getRawValue($fld) {
		return isset($this->recValue[$fld]) ? $this->recValue[$fld] : null;
	}
	
	public function getValue($fld) {
		return $this->getField($fld)->getValue();
	}
	
	public function getRecList() {
		return $this->recList;
	}
}
	
/**
 * Ported from Web client.
 */
class CalemField {
	protected $rec;
	protected $name;
	protected $value;
	 
	public function CalemField($rec, $name, $value=null) {
		$this->rec=$rec;
		$this->name=$name;
		$this->value=$value;
	}
	
	public function getValue() {
		if ($this->value==null) return null;
		return $this->_getValue();
	}
	
	public function _getValue() {
		return $this->value;
	}
	
	//_$value is the raw $value.
	public function getRawValue() {
		return $this->value;
	}
}
	
/**
 * CalemDropdownField
 */
class CalemDropdownField extends CalemField {
	
	//Getters
	public function _getValue() {
		return CalemMsg::getMsg($this->value);
	}
}
	
/**
 * CalemJoinField
 */
class CalemJoinField extends CalemField {
	protected $joinValue; 
	
	public function CalemJoinField($rec, $name, $value, $joinValue) {
		parent::CalemField($rec, $name, $value);
		$this->joinValue=$joinValue;
	}
	
	//Getters
	public function _getValue() {
		return $this->joinValue;
	}
}
	
/**
 * CalemDateField
 * Internal format is Date.
 */
class CalemDateField extends CalemField {
	
	public function setServerDateString($dateStr) {
		$this->value=$dateStr;
	}
	
	public function getValue() {
		return CalemText::formatDateString($this->value);
	}
}
	
/**
 * CalemTimeField
 * Internal format is Date GMT.
 */
class CalemTimeField extends CalemField {

	public function setServerTimeString($timeStr) {
		$this->value=$timeStr;
	}
	
	public function getValue() {
		return CalemText::formatTimeString($this->value);
	}
}
	
/**
 * CalemDateTimeField
 * Local date time is the $value - internally it's storing the local date $value.
 */
class CalemDateTimeField extends CalemField {
	public function setServerDateTimeString($dateStr) {
		$this->value=$dateStr;
	}
	
	public function getValue() {
		return CalemText::formatDateTimeString($this->value);
	}
}
	
/**
 * CalemBooleanField
 * Boolean field is stored as small integer with $values of 0 and 1
 */
class CalemBooleanField extends CalemField {
	public function getValue() {
		return $this->value ? 1 : 0;
	}
}
	
/**
 * CalemNumberField
 * Number $value field
 */
class CalemNumberField extends CalemField {
	
	public function getValue() {
		return CalemText::formatNumberString($this->value);
	}
}
	
/**
 * CalemIntegerField
 * Integer $value field
 */
class  CalemIntegerField extends CalemField {
	public function getValue() {
		return CalemText::formatIntString($this->value);
	}
}

/**
 * CalemSysCurrencyField
 */
class CalemSysCurrencyField extends CalemField {
	
	public function getValue() {
		return CalemText::formatCurrencyString($this->value);
	}
}
	
/**
 * CalemCurrencyField - not implemented for now.
 */
class CalemCurrencyField extends CalemSysCurrencyField {}

	
/**
 * CalemPercentField
 */
class CalemPercentField extends CalemNumberField {}
	
/**
 * CalemStringField
 */
class CalemStringField extends CalemField {
}

?>