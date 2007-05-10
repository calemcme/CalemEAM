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
require_once _CALEM_DIR_ . 'server/include/util/CalemText.php';

class CalemTextTest extends PHPUnit2_Framework_TestCase {
	
	private function setupConf() {
		$GLOBALS['loc_conf']=array(
		  'timezone' => '(GMT-06.00) Central Time (US & Canada)',
		  'datefmt' => 'EEE, M/d/yy',
		  'timefmt' => 'h:mm a',
		  'datetimefmt' => 'EEE, M/d/yy h:mm a',
		  'intfmt' => '#,##0',
		  'numberfmt' => '#,##0.###',
		  'currencyfmt' => '#,##0.00;(#,##0.00)'
		);
	}
	
	public function testLocConf() {
		$this->setupConf();
		$tz=CalemText::getTimezone();
		$this->assertTrue($tz=='US/Central');
		
		$datefmt=CalemText::getDateFormat();
		$this->assertTrue($datefmt=='D, m/d/y');
		
		$timefmt=CalemText::getTimeFormat();
		$this->assertTrue($timefmt=='g:i a');
		
		$datetimefmt=CalemText::getDateTimeFormat();
		$this->assertTrue($datetimefmt=='D, m/d/y g:i a');
		
		//offset
		$dt=mktime(0,0,0,10,20,2007);
		$off=CalemText::getTimeOffset($dt);
		$this->assertTrue($off== -300*60);
		
		//Numbers
		$ifmt=CalemText::getIntFormat();
		$this->assertTrue($ifmt['decimal']==0 && $ifmt['dsep']=='' && $ifmt['ksep']==',');
		
		$nfmt=CalemText::getNumberFormat();
		$this->assertTrue($nfmt['decimal']==3 && $nfmt['dsep']='.' && $nfmt['ksep']==',');
		
		$cfmt=CalemText::getCurrencyFormat();
		$pfmt=$cfmt['positive'];
		$nfmt=$cfmt['negative'];
		$this->assertTrue($pfmt['decimal']==2 && $pfmt['dsep']='.' && $pfmt['ksep']==',');
		$this->assertTrue($nfmt['enclosed'] && $nfmt['left']=='(' && $nfmt['right']==')');
		
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "done with conf<br>"; 
		}
	}
	
	public function testTimezone() {
		date_default_timezone_set('US/Pacific');
		CalemText::setTimezone();
		$txt=date_default_timezone_get();
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "default tz=$txt<br>"; 
		}
		$this->assertTrue($txt=='US/Central');	
	}
	
	public function testDate() {
		$str=CalemText::formatDateString('2007-10-20');
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "date= " . $str . "<br>"; 
		}	
		$this->assertTrue($str=='Sat, 10/20/07');
		
		$str=CalemText::formatDateString(null);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "date= " . $str . "<br>"; 
		}	
		$this->assertTrue($str==null);
	}
	
	public function testTime() {
		$str=CalemText::formatTimeString('18:20:20');
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "time= " . $str . "<br>"; 
		}	
		$this->assertTrue($str=='6:20 pm');
		
		$str=CalemText::formatTimeString(null);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "time= " . $str . "<br>"; 
		}	
		$this->assertTrue($str==null);
	}
	
	public function testDateTime() {
		CalemText::setTimezone();
		$str=CalemText::formatDateTimeString('2007-10-20 18:20:20');
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "datetime= " . $str . "<br>"; 
		}	
		$this->assertTrue($str=='Sat, 10/20/07 1:20 pm');
	}
	
	public function testInt() {
		$i=CalemText::formatIntString('123456');
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "int= " . $i . "<br>"; 
		}		
		$this->assertTrue($i=='123,456');
	}
	
	public function testNumber() {
		$i=CalemText::formatNumberString('123456.789');	
		$this->assertTrue($i=='123,456.789');
		
		$i=CalemText::formatNumberString('123456');
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "n= " . $i . "<br>"; 
		}		
		$this->assertTrue($i=='123,456');
		
		$i=CalemText::formatNumberString(null);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "null n= " . $i . "<br>"; 
		}		
		$this->assertTrue($i==null);
	}
	
	public function testCurrency() {
		$i=CalemText::formatCurrencyString('123456.789');	
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "n= " . $i . "<br>"; 
		}	
		$this->assertTrue($i=='123,456.79');
		
		$i=CalemText::formatCurrencyString('123456');
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "n= " . $i . "<br>"; 
		}		
		$this->assertTrue($i=='123,456.00');
		
		$i=CalemText::formatCurrencyString('-123456.789');	
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "n= " . $i . "<br>"; 
		}	
		$this->assertTrue($i=='(123,456.79)');
		
		$i=CalemText::formatCurrencyString(null);	
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "null currency= " . $i . "<br>"; 
		}	
		$this->assertTrue($i==null);
	}
	
	public function testGetDateByDow() {
		$dt=mktime(0,0,0, 4, 4, 2007);
		$dow=3;
		
		//Same day test
		$ndt=CalemText::getDateByDow($dt, $dow);
		$data=getdate($ndt);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "ndt= " . date('Y-m-d', $ndt) . "<br>"; 
		}	
		$this->assertTrue($data['mday']==4 && $data['mon']==4 && $data['year']==2007);
		
		//prev day test
		$dow=0;
		$ndt=CalemText::getDateByDow($dt, $dow);
		$data=getdate($ndt);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "ndt= " . date('Y-m-d', $ndt) . "<br>"; 
		}	
		$this->assertTrue($data['mday']==1 && $data['mon']==4 && $data['year']==2007);
		
		//later day test
		$dow=6;
		$ndt=CalemText::getDateByDow($dt, $dow);
		$data=getdate($ndt);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "ndt= " . date('Y-m-d', $ndt) . "<br>"; 
		}	
		$this->assertTrue($data['mday']==7 && $data['mon']==4 && $data['year']==2007);
		
	}
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$jt=new CalemTextTest();
	$jt->testLocConf();
	$jt->testTimezone();
	$jt->testDate();
	$jt->testTime();
	$jt->testDateTime();
	$jt->testInt();
	$jt->testNumber();
	$jt->testCurrency();
	$jt->testGetDateByDow();
}
?>
