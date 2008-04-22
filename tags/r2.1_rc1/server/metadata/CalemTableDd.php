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
require_once _CALEM_DIR_ . 'server/metadata/CalemTableNotFoundException.php';
require_once _CALEM_DIR_ . 'server/include/core/database/query/CalemTableQuery.php';
require_once _CALEM_DIR_ . 'server/modules/report/model/widget/CalemViewInfo.php';
require_once _CALEM_DIR_ . 'server/include/util/CalemMsg.php';

/**
 * This is the Calem table DD class.
 */
class CalemTableDd {
	const REC_ID = 'id';
	const DROPDOWN='dropdown';
	const MEMORY='memory';
	const DATABASE='database';
	const GETALL= -1;
	
	const TEXT_INPUT_LENGTH=65536;
	const GUID_LENGTH = 36;
	const MULTI_LINE_LENGTH = 76;
	
	//Field types
	const TYPE_TEXT = 'text';
	const TYPE_JOIN = 'join';
	const TYPE_DROPDOWN_JOIN='dropdown_join';
	
	const TYPE_CURRENCY = 'currency';
	const TYPE_SYS_CURRENCY ='sys_currency';
	const TYPE_CURRENCY_ID ='currency_id';
	
	const TYPE_PASSWORD = 'password';
	
	protected $baseTableDef;
	protected $allTableDef;
	protected $customTableDef;
	
	protected $baseFieldList;
	protected $allFieldList;
	protected $customFieldList;
	
	protected $resourceMgr;
	
	/**
	 * Constructor
	 */
	public function __construct($table_name) {
		$file= _CALEM_DIR_ . 'server/metadata/table/'. $table_name . '.php';
		if (!file_exists($file)) {
			throw new CalemTableNotFoundException($table_name);	
		}
		include $file;
		$def=CALEM_TABLE_DEF;
		$this->baseTableDef=&$$def;
		$this->baseFieldList=array_keys($this->baseTableDef['fields']);
		$this->allTableDef=$$def; //Copy to be the same as base.
		$this->allFieldList=array_keys($this->allTableDef['fields']);
		
		//Custom table stuff
		$file= _CALEM_DIR_ . 'custom/global/metadata/' . $this->getCustomTableName() . '.metadata';
		if (!file_exists($file)) {//All is well, no custom table info
			return;	
		}
		//Setup custom
		$cDef=file_get_contents($file);
		$this->customTableDef=unserialize($cDef);
		$this->customFieldList=array_keys($this->customTableDef['fields']);
		
		//Combine with all
		$this->allFieldList=array_merge($this->baseFieldList, $this->customFieldList);
		$this->allTableDef['fields']=array_merge($this->baseTableDef['fields'], $this->customTableDef['fields']);		
   }
   
   private function getResourceMgr() {
   	if (!isset($this->resourceMgr)) {
   		$this->resourceMgr=CalemFactory::getResourceManager();	
   	}	
   	return $this->resourceMgr;
   }
	
	/**
	 * Service functions
	 */
	public function getTableDef() {
		return $this->allTableDef;
	}
	
	public function getLookupTableDd($fld) {
		$dd=null;
		if (isset($this->allTableDef['fields'][$fld])) {
			$fldInfo=$this->allTableDef['fields'][$fld];
			if (isset($fldInfo['lookup'])) {
				$dd=$this->getResourceMgr()->getTableDd($fldInfo['lookup']);
			}
		}
		return $dd;	
	}

	/**
	 * Get Join info
	 * @return array of table, field and lkupField.
	 */
	public function getJoin($fld) {
		$rtn=null;
		$lkupDd=$this->getLookupTableDd($fld);
		if ($lkupDd && !$lkupDd->isDropdown()) {
			$lkupMap=$lkupDd->getLookupMapping();
			$rtn=array('table'=>$lkupDd->getTableName(), 'field'=>$lkupMap['field'], 'lkupField'=>$lkupMap['primary']);
		}	
		return $rtn;
	}
	
	public function getFieldList() {
		return $this->allFieldList;
	}

	public function getBaseFields() {
		return $this->baseTableDef['fields'];
	}
	
	public function getCustomFields() {
		return ($this->customTableDef ? $this->customTableDef['fields'] : null);
	}
	
	public function isField($fld) {
		return isset($this->allTableDef['fields'][$fld]);
	}
   
   public function isPrimaryKey($fld) {
      return isset($this->allTableDef['primary_key'][$fld]);  
   }
   
   public function isUniqueIndex($fld) {
      return isset($this->allTableDef['primary_key'][$fld]);  
   }
	
	public function isDropdown() {
		return (isset($this->allTableDef['cache_type']) ? $this->allTableDef['cache_type']=='dropdown' : false);
	}
	
	public function isMemoryCached() {
		return (isset($this->allTableDef['cache_type'])? $this->allTableDef['cache_type']=='memory' : false);	
	}
	
	public function isCached() {
		return $this->isDropdown() || $this->isMemoryCached();
	}
	
	public function isJoinField($fld) {	
		$rtn=false;
		$dd=$this->getLookupTableDd($fld);
		if ($dd) {
			$rtn= !$dd->isDropdown();	
		}
		return $rtn;	
	}
	
	public function isDropdownField($fld) {
		$rtn=false;
		$dd=$this->getLookupTableDd($fld);
		if ($dd) {
			$rtn= $dd->isDropdown();	
		}
		return $rtn;
	}
	
	public function isMemoryCachedField($fld) {
		$rtn=false;
		$dd=$this->getLookupTableDd($fld);
		if ($dd) {
			$rtn= $dd->isMemoryCached();	
		}
		return $rtn;	
	}
	
	/**
	 * The field is 'fieldName_lookupFieldName' if the field is to be brought over.
	 */
	public function getJoinFieldName($fld) {
		$name=$fld;
		$dd=$this->getLookupTableDd($fld);
		if ($dd && !$dd->isDropdown()) {
			$name=$fld . '__' . $dd->getShortName($dd->getPrimaryLookup());	
		}
		return $name;	
	}
	
	//Short name support
	public function getShortName($fld) {
		return (isset($this->allTableDef['fields'][$fld]) && isset($this->allTableDef['fields'][$fld]['sn'])) ? $this->allTableDef['fields'][$fld]['sn'] : $fld;
	}
	
	//Get primary lookup field
	public function getPrimaryLookup() {
		return isset($this->allTableDef['lookup_mapping']) ? $this->allTableDef['lookup_mapping']['primary'] : null;	
	}
	
	/**
	 * Find out the input length of a field.
	 */
	public function getFieldInputLength($field_name, $dbHandler) {
		$field=$this->allTableDef['fields'][$field_name];
		$len=0;
		if (isset($field['input_length'])) {
			$len=$field['input_length'];
		} else if (isset($field['length'])) {
			$len=$field['length'];
		} else { //Need to use db specific conversion to figure this out.
			$len=$dbHandler->getFieldLength($field['type']);
		}
		return $len;
	}
	
	public function getTableName() {
		return $this->allTableDef['table_name'];
	}
	
	public function getViewName() {
		return $this->allTableDef['table_name'];
	}
	
	public function getCustomTableName() {
		return CUSTOM_TABLE . $this->baseTableDef['table_name'];
	}
	
	public function getPrimaryKey() {
		return $this->allTableDef['primary_key'];
	}	 
	
	public function getUniqueIndexes() {
		return (isset($this->allTableDef['unique_indexes']) ? $this->allTableDef['unique_indexes'] : null);
	}
	
	public function getCacheType() {
		return $this->allTableDef['cache_type'];
	}
	
	public function getIndexes() {
		return (isset($this->allTableDef['indexes'])?$this->allTableDef['indexes']:null);
	}
	
	public function getFields() {
		return $this->allTableDef['fields'];
	}
	
	public function getField($fld) {
		return $this->allTableDef['fields'][$fld];
	}
	
	public function getLookupMapping() {
		return isset($this->allTableDef['lookup_mapping']) ? $this->allTableDef['lookup_mapping'] : null;	
	}
	
	//Bo interface
	public function getDataBo() {
		return (isset($this->allTableDef['data_bo'])) ? $this->allTableDef['data_bo'] : null;	
	}
	//Dbo
	public function getDbo() {
		return isset($this->allTableDef['dbo']) ? $this->allTableDef['dbo'] : null;	
	}
	
	//Numeric fields
	public function isNumericField($fld) {
		$type=$this->allTableDef['fields'][$fld]['type'];
		return ($type=='boolean' 
				||$type== 'int'
				||$type== 'double'
				||$type== 'percent'
				||$type== 'currency'
				||$type== 'sys_currency');	
	}
	
	/**
	 * Query builders
	 */
	public function buildGetAllQuery ($includeMd=false) {
		$tableQuery=$this->buildGetAllQueryNoOrderBy($includeMd);
		//Let's figure out order by if any.
		$orderBy=$this->getOrderBy();
		if ($orderBy) {
			$ob=CalemQueryOrderBy::createOrderBy($this, $orderBy['field'], $orderBy['order']);
			$tableQuery->setOrderBy($ob);
		}
		return $tableQuery;
	}

	public function buildGetOneQuery() {
		$tableQuery=$this->buildGetAllQueryNoOrderBy();
		//Now add query by the id.
		$fld =new CalemDbField($this->getTableName(), $this->getIdFieldName());
		$val =new CalemDbParamHolder(true);
		$expr=new CalemDbExpr($fld, CalemDbExpr::EXPR_EQ, $val);
		$tableQuery->setWhere($this->getTableName(), $expr);
		return $tableQuery;
	}
	
	public function buildGetAllQueryNoOrderBy($includeMd=false) {
		$tableName=$this->getTableName();
		$tableQuery=new CalemTableQuery($this->getViewName(), $tableName); //So this is a GET query.
		$sf=new CalemSelectField($tableName); //This is select all from this table.
		$tableQuery->addSelect($sf);
		//Build base table query.
		$tableQuery=$this->buildQueryJoins($this->getBaseFields(), $tableName, $tableQuery, $includeMd);
		//Check custom table - custom fields don't support join fields.
		if ($this->getCustomFields()) {//a) add a join; b) add select fields
			$sf=new CalemSelectField($this->getCustomTableAlias());
			$tableQuery->addSelect($sf);
			$join= new CalemTableJoin(CalemTableJoin::LEFT, $tableName, 'id', 
									$this->getCustomTableName(), CUSTOM_FIELD_ID);
			$tableQuery->setWhere($this->getCustomTableName(), null, $join);									
		}	
		return $tableQuery;
	}
	
	public function buildQueryJoins($flds, $tableName, $tableQuery, $includeMd)  {
		foreach ($flds as $fid=>$fval) {
			$lkupDd=$this->getLookupTableDd($fid);
			if ($lkupDd) {
				//Dropdown to be handled differently; otherwise get it as a join.
				if ($lkupDd->isDropdown() || (!$includeMd && $this->isLookupMd($fid))) continue;
				//a) Add a join for where and b) a field in select list.
				$join=$this->getJoin($fid);
				$tableJoin=new CalemTableJoin(CalemTableJoin::LEFT, $tableName, $fid, $join['table'], $join['field']);
				$tableQuery->setWhere($tableJoin->getAlias(), null, $tableJoin);
				//Add selection field.
				$tableQuery->addSelect(new CalemSelectField($tableJoin->getAlias(), $join['lkupField'], 
				                         $this->getJoinFieldName($fid)) );
			}
		} 
		return $tableQuery;
	}
	
	public function isLookupMd($fld) {
		$rtn=$this->allTableDef['fields'][$fld];
		return ($rtn['lookup'] && isset($rtn['md']) && $rtn['md']);
	}
	
	/**
	 * Custom table must use an alias that's used in join with the id field.
	 */
	public function getCustomTableAlias() {
		return $this->getCustomTableName() . "_id";
	}
	
	public function getOrderBy() {
		return $this->baseTableDef['order_by'];
	}
	
	/**
	 * Ported from tableDd.js
	 */
	public function isDateField($fld) {	
		return ($this->allTableDef['fields'][$fld]['type']=='date');
	}
	
	public function isTimeField($fld) {
		return ($this->allTableDef['fields'][$fld]['type']=='time');
	}
	
	public function isDateTimeField($fld) {
		return ($this->allTableDef['fields'][$fld]['type']=='datetime');
	}
	
	public function isBooleanField($fld) {
		return ($this->allTableDef['fields'][$fld]['type']=='boolean');
	}
	
	public function isIntegerField($fld) {
		return ($this->allTableDef['fields'][$fld]['type']=='int');
	}
	
	public function isNumberField($fld) {
		return ($this->allTableDef['fields'][$fld]['type']=='double');
	}
	
	public function isCurrencyField($fld) {
		return ($this->allTableDef['fields'][$fld]['type']=='currency');
	}
	
	public function isSysCurrencyField($fld) {
		return ($this->allTableDef['fields'][$fld]['type']=='sys_currency');
	}
	
	public function isCurrencyIdField($fld) {
		return(isset($this->allTableDef['currency_mapping'])) ? ($this->allTableDef['currency_mapping']['field'] == $fld) : false;
	}
	
	public function isStringField($fld) {
		$type=$this->allTableDef['fields'][$fld]['type'];
		return ($type=='varchar'||$type=='text'||$type=='guid');
	}
	
	public function isTextField($fld) {
		$type=$this->allTableDef['fields'][$fld]['type'];
		return ($type=='text' || ($type=='varchar' && $this->allTableDef['fields'][$fld]['length'] > CalemTableDd::MULTI_LINE_LENGTH));
	}
	
	public function isPasswordField($fld) {
		return ($this->allTableDef['fields'][$fld]['is_password']);
	}
	
	/**
	 * Normalized field type
	 */
	public function getNormalizedType($fld) {
		$rtn= $this->getLookupTableDd($fld);
		if ($rtn) {
			if ($rtn->isDropdown()) {
				$type=CalemTableDd::TYPE_DROPDOWN_JOIN;
			} else if ($this->isCurrencyIdField($fld)) {
				$type=CalemTableDd::TYPE_CURRENCY_ID;
			} else {
				$type=CalemTableDd::TYPE_JOIN;
			}
		} else if ($this->isTextField($fld)) {
			$type=CalemTableDd::TYPE_TEXT;
		} else if ($this->isPasswordField($fld)) {
			$type=CalemTableDd::TYPE_PASSWORD;
		} else {
			$type=$this->allTableDef['fields'][$fld]['type'];
			$type= ($type=='guid') ? 'varchar' : $type;
		}
		return $type;
	}
	
	/**
	 * creating item info on the fly
	 */
	public function getFieldInfo($fld) {
		return new CalemFieldInfo($fld);
	} 
	
	public function getFieldLabelInfo($fld) {
		return new CalemFieldLabelInfo($fld);
	} 
	/**
	 * Field label
	 */
	public function getFieldLabel($fld) {
		$msg=$this->_getFieldLabel($fld);
		if ($msg) {
			if ($this->isSysCurrencyField($fld)) {
				global $_CALEM_conf;
				$msg .=" (" .$_CALEM_conf['system_currency']. ")";
			}
			return $msg;
		}
		//Otherwise, let's look at the link only once.
		$lkupDd=$this->getLookupTableDd($fld);
		if ($lkupDd) {
			if ($lkupDd->isDropdown()) {
				$msg= CalemMsg::getMsg($lkupDd->getTableName(), true);
				if ($msg) return $msg;
			} else {
				$map=$lkupDd->getLookupMapping();
				$msg= $lkupDd->_getFieldLabel($map['primary']);
				if ($msg) return $msg;
			}	
		}	
		//Msg not defined_ use field id.
		return '_'+$fld;
	}
	
	public function _getFieldLabel($fld) {
		$msgId=isset($this->allTableDef['fields'][$fld]['label']) ? $this->allTableDef['fields'][$fld]['label'] : null;
		if ($msgId) {
			$msg= CalemMsg::getMsg($msgId, true);
		} else {
			$msg=CalemMsg::getMsg($fld, true); //Try out the field name itself.
		}
		return $msg;
	}
	
	public function getIdFieldName() {
		return CalemTableDd::REC_ID;
	}
}

/** 
 * Table DD factory method.
 */
class CalemTableDdFactory {

	public static function createDd($id) {
		try {
			$rtn= new CalemTableDd($id); //99% it's normal tableDD
		} catch (CalemTableNotFoundException $ex) {
			if (is_file(_CALEM_DIR_ . 'server/metadata/wtable/' . $id . ".php")) {
				include 	_CALEM_DIR_ . 'server/metadata/wtable/' . $id . ".php";
				$tid=$_CALEM_table['table_ref'];
				$rtn= new CalemTableDd($tid);
			} else {
				throw $ex;
			}
		} 
		return $rtn;
	}

}
?>
