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


/**
 * This file defined the configuration for this installation by 
 * combining the custom with the distributed installation. 
 */
 
//Checking basic initialization
if (!defined('_CALEM_DIR_')) die("Access denied at ".__FILE__);

/**
 * Global constants - should not be changed at all.
 */ 
//submit parameter names 
define('CALEM_ACTION', '_action'); //Action name used in http request
//acl page 
define('CALEM_ACL_PAGE', '_acl_page');

//Module DD
define('CALEM_DD_DEF','_CALEM_dd'); //DD definition for a module
define('CALEM_TABLE_DEF','_CALEM_table'); //table definition 
/**
 * Muse use exception for database error reporting.
 */
define('CALEM_DB_ERR_HANDLING', PDO::ERRMODE_EXCEPTION);
//Soap dispatcher
define('CALEM_SOAP_MODULE', 'module');
define('CALEM_SOAP_CLASS', 'class');
define('CALEM_SOAP_SESSIONID', 'CALEM_SID');
//Line break
define('CALEM_LFCR', "\r\n");
define('CALEM_SEP_LFCR', ";\r\n");
//Param values
define('CALEM_PARAM_LANG', 'lang');
define('CALEM_PARAM_LOAD_MODE', 'loadmode');
define('CALEM_PARAM_THEME', 'theme');
//Field identifier length
define('CALEM_ID_LENGTH', 25);
define('CALEM_ID_MAX_LENGTH', 30);
//Update conflict exception
define('CALEM_DBO_UPDATE_CONFLICT', -10);
//Production or dev mode
define('CALEM_DEVELOPMENT', 'development');
define('CALEM_PRODUCTION', 'production');
//Default groups
define('CALEM_OOB', 'CALEM_OOB');
define('CUSTOM_SYSTEM', 'CUSTOM_SYSTEM');


//File operations
define('VIEW_USER', 'user');
define('VIEW_GROUP', 'group');

define('ERROR_CREATE_DIR', -1);
define('ERROR_CREATE_FILE', -2);
define('ERROR_WRITE_FILE', -3);
define('ERROR_CLOSE_FILE', -4);
define('ERROR_DELETE_FILE', -5);
define('ERROR_FILE_NOT_FOUND', -6);

define('CUSTOM_FIELD_ID', 'zc_id');
define('CUSTOM_TABLE', 'zc_');

define('FIELD_VARCHAR', 'varchar');

define('REPORT_PATH', 'converted');
define('REPORT_EXT', '.phpo');

define('TAB_CUSTOMIZE', 'CUSTOMIZE_TAB');

define('EMPTY_REC', '__NULL_REC__');
	
define('KEY_PREFIX', '___');

//Must have x rights for directory.
define('DIR_WRITE_RIGHTS', 0775);
	
/**
 * Configuration from the distribution. 
 * All initial configuration is defined in <code>_CALEM_dist</code> 
 * global array.
 */
//starting configuration
$_CALEM_dist=array(
	//DD and language resource manager
	'CalemResourceManager'=>array(
	       'path'=>'server/include/core/',
	       'name'=>'CalemResourceManager'),
	//Calem type to database type mapping - These plug-in classes handle different database
	'dbHandler'=>array(
	    'path'=>'server/include/core/database/mysql/', //Database handler
       'name'=>'MysqlHandler'),
	//Database configuration used in creating the database
	'calem_db_config'=>array(
		'if_not_exists'=>'IF NOT EXISTS',
		'character_set'=>'utf8',
		'collation'=>'utf8_general_ci'
	),
	//Calem user privilege
	'calem_db_privileges'=>array(
		'SELECT', 'UPDATE', 'INSERT', 'DELETE', 'CREATE', 'ALTER', 'INDEX'
	),
	//MySql is not stable for persistent connection - Parent: child process exited with status 3221225477 -- Restarting
	//So do not turn this on unless tested with tests/database/testDbScript.php
	'persistent_db_connection'=>false,
	//Database engine type (applicable for MySql installation)
	'db_engine'=>'InnoDB',
	//Data fetch configuraiton
	'db_fetch_style'=>PDO::FETCH_ASSOC,
	'db_fetch_all_style'=>PDO::FETCH_COLUMN,
	//default system currency
	'system_currency'=>'USD',
	//DB monitoring function
	'monitor_db_queries'=>2, //1 - warning; 2 - all; 0 - do not monitoring.
	'warning_db_query_time'=>0.4,
	'db_time_precision'=>4,
	//Need to show database stmt log if it takes this long.
	'database_threshold_ms'=>500,
	//DB statement cursor type by default
	'db_stmt_driver_options'=>array(PDO::ATTR_CURSOR, PDO::CURSOR_FWDONLY),
	
	//File cache manager
	'CalemDataCacheManager'=>array(
		'path'=>'server/include/core/cache/',
		'name'=>'CalemFileCacheManager'
	),
	
	//Session manager
	'CalemSessionManager'=>array(
		'path'=>'server/include/core/session/',
		'name'=>'CalemFileSessionManager'
	),
	//Actions allowed when not logged on - using key/value pair to avoid using array_key_exists function for performance
	'default_noses_action'=>'LoginAction',
	'noses_allowed_actions'=>array(
		'LoginAction'=>'client/launchpad/CalemLoginLite.php',
	),
	'ses_launch_app'=>'client/launchpad/CalemStart.php',
	//Other handlers
	'CalemReport'=>'server/modules/report/CalemReport.php',
	'CalemDashboard'=>'server/modules/dashboard/CalemDashboard.php',
	'CalemDashboardExport'=>'server/include/charts/share/export.php',
	
	//Module list
	'modules'=>array(
		'admin', 'asset', 'budget', 'pm', 'inventory', 'workorder', 'requisition', 'purchase', 
      'document','schedule', 'rcm','contact', 'contractor', 'inspection', 'training',
		'project', 'dashboard'
	),
	//Default SOAP return format - must be XML for unit tests to pass.
	'default_soap_output_format'=>'XML',
	//Default style sheet
	'client_theme'=>'calem',
	//Default file format
	'client_download_zip'=>false,
	'server_gzip_rate'=>9,
	//Default js load mode
	'client_js_load_mode'=>'gzip', //indv/aggr/min/gzip (individual/aggregate)
	'client_js_load_mode_ext_nogzip'=>'.js.min', 
	'client_js_custom_ext'=>array(
		'aggr'=>'',
		'min'=>'.min',
		'gzip'=>'.gz'
	),
	//Default system icon
	'calemeam_icon'=>'calemeam.png',
	//Default language resource file
	'client_language'=>'',
	//language list supported - used in building the language packs
	'client_lang_list'=>array(
	   //en_us
		'CalemMsg.js'=>array('AjxMsg'=>array('AjxMsg'),
                           'I18nMsg'=>array('I18nMsg'),
                           'CalemMsg'=>array('CalemMsg', 'CalemMsgCustom')),
      //ch_cn
      'CalemMsg_cn.js'=> array('AjxMsg'=>array('AjxMsg_cn'),
            					'I18nMsg'=>array('I18nMsg_zh', 'I18nMsg_zh_CN'),
            					'CalemMsg'=>array('CalemMsg_cn', 'CalemMsgCustom_cn')),
      //ja
      'CalemMsg_ja.js'=> array('AjxMsg'=>array('AjxMsg_ja'),
            					'I18nMsg'=>array('I18nMsg_ja', 'I18nMsg_ja_JP'),
            					'CalemMsg'=>array('CalemMsg_ja', 'CalemMsgCustom_ja'))
    ),
   //custom items to include
   'calem_cutsom_set'=>array('.view.js', '.form.js', '.search.js', '.mod.js', '.modlist.js'),
   'calem_cutsom_design_load'=>array('.view.js.min', '.form.js.min', '.mod.js.min', '.modlist.js.min'),
   
   //host/protocol
   'calem_host'=>array('http'=>'http://', 'https'=>'https://'),
	//uri
	'calem_root_uri'=>'/CalemEAM',
	'calem_request_uri'=>'/CalemEAM/index.php',
	//Soap uri
	'calem_soap_uri'=>'/CalemEAM/CalemSoapService.php',
	//SecurityBo configuration
	'CalemSecurityBo'=>array(
	       'path'=>'server/modules/admin/',
	       'name'=>'CalemSecurityBo'),
	//Calem ACL acos
	'aco_view'=>'view',
	'aco_edit'=>'edit',
	'aco_insert'=>'insert',
	'aco_delete'=>'delete',
	//Calem SOAP header
	/** 'calem_soap_xmlheader'=>"<?xml version=\"1.0\" encoding=\"UTF-8\"?>", */
	'calem_soap_fault_xmlheader'=>'',
	'calem_soap_xmlheader'=>'',
	'calem_soap_fault_status'=>'HTTP/1.1 500 SOAP FAULT',
	'calem_soap_status'=>'HTTP/1.1 200 OK',
	'calem_soap_allow_gzip'=>true,
	//Data cache configuration
	'calem_cache_config'=>array(
		'cacheDir'=>_CALEM_DIR_ . 'server/cache/data/',
		'lifeTime'=>315360000, //no expiration or 10 years - it's event driven update.
		'automaticSerialization'=>true,
		'automaticCleaningFactor'=>0,
		'readControl'=>false,
        'writeControl'=>false,
		'fileNameProtection'=>false,
		'hashedDirectoryLevel'=>1	
	),
	//Session configuration
	'calem_session_config'=>array(
		'cacheDir'=>_CALEM_DIR_ . 'server/cache/session/',
		'lifeTime'=>3600, //1 hour
		'fileNameProtection'=>false,
        'readControl'=>false,
        'writeControl'=>false,
		'automaticSerialization'=>true,
		'automaticCleaningFactor'=>200,
		'hashedDirectoryLevel'=>1	
	),
	//data sets to load in the order specified. 
	'calem_data_load_init'=>array(
	   'conflictResolution'=>'overwrite', //overwrite, ignore
		'dataset'=>array('server/setup/init')
	),
	'calem_data_load_sample'=>array(
	   'conflictResolution'=>'overwrite', //overwrite, ignore
		'dataset'=>array('server/setup/sampledata')
	),
	//Time setting
	'calem_datetime_format'=>"Y-m-d H:i:s",
	'calem_default_userId'=>1000000, //Default user
	'calem_default_groupId'=>CUSTOM_SYSTEM, //Default group
  
	//Php to xml serializer options
	'calem_xml_serializer_option'=>array (
		   'addDecl' => false,
		   'encoding' => 'UTF-8',
		   'indent' => ' ',
		   'rootName' => 'Dummy', //To be replaced by method call
		   'rootAttributes'=>array('env:encodingStyle'=>"http://www.w3.org/2003/05/soap-encoding"),
		   'defaultTagName' => 'dtn'),
	'calem_server_time_format'=>'Y-m-d H:i:s',	
	//Default data insertion/deletion/update BO
	'CalemDataBo'=>array(
		'path'=>'server/modules/database/',
		'name'=>'CalemDataBo'
	),	
	//Default Dbo
	'CalemDbo'=>array(
      'path'=>'server/include/core/database/', 
      'name'=>'CalemDbo'),
   //Default Dbo Custom
	'CalemDboCustom'=>array(
      'path'=>'server/include/core/database/', 
      'name'=>'CalemDboCustom'),
   //Dropdown
	'CalemDropdown'=>array(
      'path'=>'server/include/core/database/', 
      'name'=>'CalemDropdown'),
   //Uid generator
	'CalemUid'=>array(
      'path'=>'server/include/util/', 
      'name'=>'Rfc4122Impl'),
   //calemeam mode
   'calem_mode'=>CALEM_PRODUCTION,
   'design_target'=>array(
   	'dev_admin_id'=>'1000001',
   	'devDesignPhase'=>true,
		'devDesignGroup'=>CALEM_OOB,
	),
	/**
	 * JsMin configuration
	 * Note: jsmin.exe is about 6 times faster in C than in PHP so the default is jsmin.exe
	 * In platforms where jsmin.exe is not working, use php version:
	 * CalemJsMinExe - use jsmin exe version (exe defined in jsmin_exe)
	 * CalemJsMinPhp - use jsmin php version
	 */ 
	'jsminClass'=>array('path'=>'build', 'class'=>'CalemJsMinExe'),
	'jsmin_exe'=>'build/jsmin/jsmin.exe',  
);

//Get module configuration
@include _CALEM_DIR_ . 'server/modules/admin/admin_conf.php';
@include _CALEM_DIR_ . 'server/modules/inventory/admin_conf.custom.php';

@include _CALEM_DIR_ . 'server/modules/inventory/in_conf.php';
@include _CALEM_DIR_ . 'server/modules/inventory/in_conf.custom.php';

@include _CALEM_DIR_ . 'server/modules/workorder/wo_conf.php';
@include _CALEM_DIR_ . 'server/modules/workorder/wo_conf.custom.php';

@include _CALEM_DIR_ . 'server/modules/pm/pm_conf.php';
@include _CALEM_DIR_ . 'server/modules/pm/pm_conf.custom.php';

@include _CALEM_DIR_ . 'server/modules/report/report_conf.php';
@include _CALEM_DIR_ . 'server/modules/report/report_conf.custom.php';

@include _CALEM_DIR_ . 'server/modules/requisition/req_conf.php';
@include _CALEM_DIR_ . 'server/modules/requisition/req_conf.custom.php';

@include _CALEM_DIR_ . 'server/modules/purchase/po_conf.php';
@include _CALEM_DIR_ . 'server/modules/purchase/po_conf.custom.php';

@include _CALEM_DIR_ . 'server/modules/budget/budget_conf.php';
@include _CALEM_DIR_ . 'server/modules/budget/budget_conf.custom.php';

@include _CALEM_DIR_ . 'server/modules/dashboard/dash_conf.php';
@include _CALEM_DIR_ . 'server/modules/dashboard/dash_conf.custom.php';

//Finally get the custom and install conf.
//The custom/installation files are included here.
@include_once _CALEM_DIR_ . 'server/conf/custom.php';  //@depreciated
@include_once _CALEM_DIR_ . 'server/conf/install.php'; //@depreciated

//recommended format
@include_once _CALEM_DIR_ . 'server/conf/calem.custom.php';

// used to bundle pear libraries and preserve existing include path (mantis ref 0000010)
set_include_path(get_include_path() . PATH_SEPARATOR . _CALEM_DIR_ . 'server/include');

$GLOBALS['_CALEM_conf']= $_CALEM_dist;
?>
