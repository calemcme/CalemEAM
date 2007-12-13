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

require_once _CALEM_DIR_ . 'server/include/core/CalemWsFacade.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';
require_once _CALEM_DIR_ . 'server/include/core/session/CalemSession.php';

/**
 * This class will validate user login and create session if login is successful
 */
class CalemLoginSo extends CalemWsFacade {
	private $lang;
	private $theme;
	private $loadmode;
	
	public function initByWeb() {
		//setup session info.	
		//1. language	
		$this->setLang($_REQUEST[CALEM_PARAM_LANG]);
		//2. theme
		$this->setTheme($_REQUEST[CALEM_PARAM_THEME]);
		//3. loadmode
		$this->loadmode=isset($_REQUEST[CALEM_PARAM_LOAD_MODE])?$_REQUEST[CALEM_PARAM_LOAD_MODE]: $_CALEM_conf['client_js_load_mode'];
	}
	
	private function setLang($lang) {
		global $_CALEM_conf;	
		$def=$_CALEM_conf['client_language'];
		$this->lang= ($lang ? $lang : $def);
		//Verify $lang to exist first.
		if ($this->lang) {
			if (!is_file(_CALEM_DIR_ . 'client/launchpad/resource/CalemMsg_' . $lang . ".js")) {
				$this->lang=$def;
			}	
		}
	}
	
	private function setTheme($theme) {
		global $_CALEM_conf;	
		$def=$_CALEM_conf['client_theme'];
		$this->theme= ($theme ? $theme : $def);
		if (!is_dir(_CALEM_DIR_ . 'client/themes/' . $this->theme)) {
		 	$this->theme=$_CALEM_conf['client_theme'];
		}
	}
	
	/**
	 * Authentication is not required to fire off this request
	 */
	public function authenticationRequired() {
 		return false;
 	}
 	/**
 	 * Handling the Soap Login Request
 	 * If login is successful create a session for it to come back.
 	 * @param string 		username
 	 * @param string		password
 	 * @param string		language	//Optional
 	 * @param string		theme  	//@todo to add
 	 */
 	public function Login() {
 		$user=$this->getParamValue(0);
 		$passwd=$this->getParamValue(1);
 		$lang=$this->getParamValue(2);
 		$this->setLang($lang);
 		if ($this->logger->isDebugEnabled()) $this->logger->debug("Invoking the Login, user=" . $user . ", passwd=" . $passwd . ", lang=" . $lang);
 		//Use BO to check login.
 		$rtn=false;
 		try {
 			list($succ, $ses) = $this->doLogin($user, $passwd);
			if ($succ) {//Login is successful.
				global $_CALEM_conf;
				$userRow=$ses->get("user");
				return array('sessionId'=>$ses->getSid(), 
                         'validityPeriod'=>$_CALEM_conf['calem_session_config']['lifeTime'],
                         'info'=>array(
                             'uid'=>$userRow['id'],
                             'gid'=>$userRow['acl_group_id'],
                             'full_name'=>$userRow['full_name'],
                             'admin_type_id'=>$userRow['admin_type_id'],
                             'locale'=>$this->lang,
                             'team_id'=>$userRow['team_id']
                          )
                        );
			} 
 		} catch (Exception $e) {
 			$this->logger->error("Exception in processing login. Error msg=" . $e->getTraceAsString());
 		}
		$this->sendFault(CALEM_SF_INVALID_LOGIN);
 	}
 	
 	/**
 	 * Login service.
 	 */
 	public function doLogin($user, $passwd) {
 		$securityBo=CalemFactory::getSecurityBo();
		list($succ, $userDbo)=$securityBo->verifyLogin($user, $passwd);
		if ($succ) {//Login is successful.
			//Creating a session
			$ses=new CalemSession();
   		//configure session settings
   		$ses->set('setting', array('lang'=>$this->lang, 'theme'=>$this->theme, 'loadmode'=>$this->loadmode, 'login_time'=>mktime()));
			$ses->set('user', $userDbo->getRow()); //Store off the user.
			$ses->save();
		} 
		return array($succ, $ses);
 	}
}
?>
