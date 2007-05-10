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
 * Must define _CALEM_DIR_ and _LOG4PHP_CONFIGURATION
 * 
 */ 

//Note that PHPUnit2 must be on the include path for it to work.
require_once 'PHPUnit2/Framework/TestCase.php';

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

/**
 * This class tests CalemSecurityBo class.
 */
class CalemSecurityBoTest extends PHPUnit2_Framework_TestCase {
	/**
	 * Helper functions
	 */
	public function getUsersCountByUsername($conn, $username) {
		$sql="select count(*) from users where username=?";
		$stmt=$conn->prepare($sql);
		$stmt->bindParam(1, $username);
		$stmt->execute();
		$cnt=$stmt->fetchColumn();
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "record username=$username in users table: " . $cnt . '<br>';
		}
		return $cnt;
	}
	public function deleteByUsername($conn, $username) {
		$sql="delete from users where username=?";
		$stmt=$conn->prepare($sql);
		$stmt->bindParam(1, $username);
		$conn->beginTransaction();
		$stmt->execute();
		$conn->commit();
		$cnt=$stmt->rowCount();
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "record username=$username deleted in table: " . $cnt . '<br>';
		}
	}
	public function insertUser($conn, $username, $password, $loginAllowed) {
		$sql="insert into users (id, username, password, login_allowed) values(?, ?, ?, ?)";
		$stmt=$conn->prepare($sql);
		$id=$username . $password;
		$stmt->bindParam(1, $id);
		$stmt->bindParam(2, $username);
		$stmt->bindParam(3, $password);
		$allowed=$loginAllowed ? 1 : 0;
		$stmt->bindParam(4, $allowed);
		$conn->beginTransaction();
		$stmt->execute();
		$conn->commit();
		$cnt=$stmt->rowCount();
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "record username=$username inserted in table: " . $cnt . '<br>';
		}
	}
	
	/**
	 * This class will have a test method for each service method on the
	 * CalemSecurityBo class.
	 */
	public function testVerifyLogin() {
		$dbHandler=	CalemFactory::getDbHandler();
		$conn=$dbHandler->getCalemConnection();
		$this->assertTrue(isset($conn));
		//Let's verify that the username does not exist
		$username="securitybo";
		$password="securitybo";
		$cnt=$this->getUsersCountByUsername($conn, $username);
		if ($cnt>0) {//This user exist...so let's remove it for our test
			$this->deleteByUsername($conn, $username);
		}
		$cnt=$this->getUsersCountByUsername($conn, $username);
		$this->assertTrue($cnt==0);
		//Now let's verify that the login is not successful
		$securityBo=CalemFactory::getSecurityBo();;
		try {
			list($succ, $userDbo)=$securityBo->verifyLogin($username, $password);
			$this->assertTrue(1!=1);
		} catch (CalemDboDataNotFoundException $e) {
			if (!isset($_ENV['CALEM_BATCH_TEST'])) {
				echo "negative case, succ=$succ, userDbo=$userDbo <br>";
			}
		}
		
		//Now let's test a positive case
		$this->insertUser($conn, $username, md5($password), true);
		$cnt=$this->getusersCountByUsername($conn, $username);
		$this->assertTrue($cnt==1);
		//Now verify the positive case.
		list($succ, $userDbo)=$securityBo->verifyLogin($username, $password);
		$this->assertTrue($succ && $userDbo);
		//remove the record now
		$this->deleteByUsername($conn, $username, md5($password));
		$cnt=$this->getusersCountByUsername($conn, $username);
		$this->assertTrue($cnt==0);
	}
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new CalemSecurityBoTest();
	$res->testVerifyLogin();
}
?>
