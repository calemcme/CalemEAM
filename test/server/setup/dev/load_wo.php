<?php

if (!defined('_CALEM_DIR_')) {
	if (!isset($_ENV['CALEM_DIR'])) {
		chdir('../../../..');
		define('_CALEM_DIR_', getcwd() . '/');
	} else {
		define('_CALEM_DIR_', $_ENV['CALEM_DIR']);
	} 
	define('LOG4PHP_CONFIGURATION', _CALEM_DIR_ . 'log4php.properties');
}

require_once _CALEM_DIR_ . 'server/conf/calem.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';

$count=10000;
$dbo=CalemFactory::getDbo('workorder');
$uidObj=CalemFactory::getUidGen();
for ($i=0; $i< $count; $i++) {
	try {
		if ($i % 100 ==0) set_time_limit(20);
		$row['id']=$uidObj->getUid();
		$row['wo_no']='wo_dev_test_' . $i;
		$row['description']='This is a test description ' . $i;
		$row['asset_id']='10000';
		$dbo->setChangeBulk($row);
		$dbo->insert();
	} catch (CalemDboDuplicateKeyException $ex) {
	}
	
}
?>