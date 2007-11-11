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
$_CALEM_lang=array(
	'title'=>'English',
	'def'=>array(
/**
 * Language definition in php array format
 */	
'step_lang_help'=>'Thank you for selecting CalemEAM, the Best Open Source CMMS/EAM solution built with Web 2.0 technologies for optimal productivity. This program will guide you through the installation of CalemEAM. Please select a language to use for your installation.',
'step_license_help'=>'Please review the software license. You must accept the license agreement to continue the installation. If you have questions about accepting the license, stop the installation and contact your CalemEAM representatives.',
'step_syscheck_help'=>'The set of minimum system requirements are listed below for the installation and use of CalemEAM. Your system must meet all the requirements to continue installation.',
'step_dbschema_help'=>'We are ready to set up your database. First we need a database or database schema for CalemEAM. You may have the installation program create a database, a user and tables for you (the Express Setup) or you may create the database and user manually (the Custom Setup). We recommend the use of "utf_general_ci" as the collation of your CalemEAM database.',
'step_dbexpress_help'=>'Express setup creates the database, user and tables for CalemEAM. It requires a user with administration privileges for these operations. You will provide the user and database to be created. If the user or database exists it will be used without being recreated. The installation will also perform upgrade if applicable.',
'step_dbinfo_help'=>'To continue the installation you must have a database and a user created for use with CalemEAM. Your database DBA or system admin can help create a database and a user for you.',
'step_dbsetup_help'=>'Database configuration will create tables, upgrade a previous version if applicable, load system data, load sample data and verify that all tables are in the database. Data in existing tables will not be affected.',
'step_saveconf_help'=>'Settings used in the installation will be saved in <b>server/conf/calem.custom.php</b> so you can use CalemEAM. The settings include database information and server URLs. This step also creates some directories and data cache.', 
'step_done_help'=>'Congratulations! Your installation is complete. You must delete the <b>installation</b> directory before using your CalemEAM.',

'check_php_version_help' => 'PHP 5.0 or later has a new object model and better object-oriented features which are a good fit for the object-oriented architecture of CalemEAM.',
'check_pdo_help' => 'PDO is an efficient, lightweight, consistent interface for accessing databases in PHP. CalemEAM builds its database layer on top of PDO',
'check_pdo_mysql_help' => 'This is the PDO Driver for MySQL.',
'check_conf_writable_help' => 'The configuration file will be modified at the end of the installation.',

'inst_title' => 'Installation of',
'step_list_title'=>'Steps',
'step_lang'=>'Language',
'step_lang_action'=>'Select Language',
'step_license' => 'License',
'step_license_action' => 'Review License',
'step_syscheck' => 'System Check',
'step_syscheck_action' => 'Check Minimum System Requirements',
'step_dbschema' => 'Database',
'step_dbschema_action' => 'Staring Database Setup',
'step_dbexpress' => 'Express Setup',
'step_dbexpress_action' => 'Set Up Database, User and Tables',
'step_dbinfo' => 'Custom Setup - Database Information',
'step_dbinfo_action' => 'Get Database Information',
'step_dbsetup' => 'Custom Setup - Database Configuration',
'step_dbsetup_action' => 'Configure Database',
'step_saveconf'=>'Save Settings',
'step_saveconf_action'=>'Save Settings',
'step_done' => 'Finish',
'step_done_action' => 'Installation Finished!',

'db_express' => 'Express Setup',
'db_custom' => 'Custom Setup',
'db_express_help'=>'Use this option if you are installing CalemEAM the first time, do not have a database created for CalemEAM, or just want to get CalemEAM up and running. This selection requires admin privileges for your MySQL server to create database, user and tables for you.',
'db_standard_help'=>'Use this option if CalemEAM has been installed before, or both a database and a user for that database have been created for CalemEAM. The database user must have the privileges to create and alter tables.',

'button_next' => 'Next',
'button_prev' => 'Previous',
'button_accept' => 'Accept',
'button_refresh' => 'Check Again',

'syscheck_item' => 'Item',
'check_db'=>'Database',
'db_unknown'=>'(Unknown)',
'check_db_help'=>'We cannot verify your database at this time. MySQL 5.0 or later is required (for information_schema and performance improvement in innoDB). If you have WAMP 1.5 or later, or XAMPP 1.5 or later, you are fine. To find the version of your MySQL server open a browser to the home page of phpMyAdmin of your MySQL installation which displays MySQL version.',

'check_php_version' => 'PHP Version',
'check_pdo' => 'PDO', 
'check_pdo_mysql' => 'PDO for MySQL',
'check_conf_writable' => 'Configuration',
'syscheck_current' => 'Current',
'syscheck_required' => 'Required',
'syscheck_passed' => 'Passed?',

'db_info_required' => 'There are fields missing values. All fields (excepting Password) must be filled out.',
'db_info_exception' => 'There are errors in connecting to database. Please verify the field values and try again.',
'db_conf_exception' => 'There are errors in configuring database. Please resolve the issues below.',

'input_lang' => 'Select Language',
'input_lang_help' => 'Select a language for your installation',
'input_dbtype' => 'Database type',
'input_dbtype_help' => 'MySQL is the database for this field.',
'input_dbhost' => 'Database host',
'input_dbhost_help' => "This is the host name of your database. It is usually <b>localhost</b> or provided by your system admininstrator.",
'input_username' => 'User name',
'input_username_help' => 'This is the user for CalemEAM. This user must have privileges to create and alter tables. You may grant to the user access to information_schema of your MySQL server so CalemEAM can verify your database.',
'input_password' => 'Password',
'input_password_help' => 'Password to access the database',
'input_dbname' => 'Database',
'input_dbname_help' => "This is the CalemEAM database created by your system admin such as 'calemeam'.",
'input_verify_db' => 'Verify database',
'input_verify_db_help' => 'When checked, all tables in the database are verified. The database user must have access to information_schema.',
'input_admin_user'=>'Admin user',
'input_admin_user_help'=>'This is the user that CalemEAM will connect to your database server to create database and user for CalemEAM.',
'input_admin_password' =>'Admin password',
'input_admin_password_help'=> 'This is the password of the Admin user.',
'input_calem_user'=>'CalemEAM user',
'input_calem_user_help'=>'This is the user to be created for accessing CalemEAM database. This user will have privileges to create/alter tables and access to information_schema. You may enter a user already created for this purpose.',
'input_calem_password' => 'Password',
'input_calem_password_help' => 'This is the password for CalemEAM user.',
'input_calem_dbname'=>'Database',
'input_calem_dbname_help'=>'This is the database to be created for CalemEAM. You may enter a database already created for this purpose.',

'wait_conf_db'=>'Configuring database...',

'new_version' => 'New version',
'new_version_help' => 'This is the version to be installed',
'current_version' => 'Current version',
'no_version_found' => '(No version found)',
'current_version_help' => 'This is the version that has been installed',
'upgrade' => 'Upgrade',
'upgrade_help' => 'Upgrade currently installed version to new version',
'load_sample' => 'Load sample data',
'load_sample_help' => 'When checked, sample data is loaded after database setup.',
'calem_url'=>'Your CalemEAM URL',
'calem_url_help'=>'This is the link of your CalemEAM installation. After deleting the <b>installation</b> diretory click the link to start using your CalemEAM.'
     )
);
?>
