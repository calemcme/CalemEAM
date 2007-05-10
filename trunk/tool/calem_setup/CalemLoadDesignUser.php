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


if (!defined('_CALEM_DIR_')) {
	chdir('../..');
	define('_CALEM_DIR_', getcwd() . '/'); 
	define('LOG4PHP_CONFIGURATION', _CALEM_DIR_ . 'log4php.properties');
}

require_once _CALEM_DIR_ . 'server/conf/calem.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';

$dbo=CalemFactory::getDbo('users');
$dbo->setChangeBulk(
	array(
		'id'=>'1000001',
		'username'=>'calem',
		'password'=>md5('calem'),
		'login_allowed'=>'1',
		'full_name'=>'Calem Eam',
		'acl_group_id'=>'CUSTOM_SYSTEM'
	)
);
try {
    $dbo->insert();
} catch (CalemDboDuplicateKeyException $ex) {
    echo 'calem user was already loaded';
}


?>
