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

class CalemText {
	
	/**
	 * Set up timezone based on client
	 */
   public function setTimezone() {
   	$tz=CalemText::getTimezone();
   	date_default_timezone_set($tz);
   }
   
	/**
	 * Date is formated as: YYYY-MM-DD
	 */
	public static function formatDateString($str) {
		if (!$str) return null;
		$dt=CalemText::parseServerDate($str);
		$datefmt=CalemText::getDateFormat();
		return date($datefmt, $dt);	
	}
	
	/**
	 * Time is formated as: hh-mm-ss
	 */
	public static function formatTimeString($str) {
		if (!$str) return null;
		$dt=CalemText::parseServerTime($str);
		$datefmt=CalemText::getTimeFormat();
		return date($datefmt, $dt);	
	}
	
	/**
	 * Format DateTime string
	 */
	public static function formatDateTimeString($str) {
		if (!$str) return null;
		$dt=CalemText::parseServerDateTime($str); //Got to neutral time format.
		$datefmt=CalemText::getDateTimeFormat();
		if (substr($str, 11)=='00:00:00') {
			$rtn=gmdate($datefmt, $dt);
		} else {
			$rtn= date($datefmt, $dt);
		}
		return $rtn;	
	}
	
	/**
	 * Format int
	 */
	public static function formatIntString($str) {
		$intfmt=CalemText::getIntFormat();
		return number_format($str, $intfmt['decimal'], $intfmt['dsep'], $intfmt['ksep']);	
	}
	
	/**
	 * Format number
	 */
	public static function formatNumberString($str) {
		$nfmt=CalemText::getNumberFormat();
		$n=number_format($str, $nfmt['decimal'], $nfmt['dsep'], $nfmt['ksep']);
		$n=CalemText::stripEndingZeros($n);
		return $n;	
	}
	
	/**
	 * Format currency
	 */
	public static function formatCurrencyString($str) {
		if (!$str) return null;
		$cfmt=CalemText::getCurrencyFormat();
		$pfmt=$cfmt['positive'];
		$rtn=number_format($str, $pfmt['decimal'], $pfmt['dsep'], $pfmt['ksep']);
		if ($str < 0) {
			$rtn=substr($rtn, 1, strlen($rtn)-1); //remove '-'
			$nfmt=$cfmt['negative'];
			if ($nfmt['enclosed']) {
				$rtn = $nfmt['left'] . $rtn . $nfmt['right'];
			}	
		}	
		return $rtn;
	}
	
	public static function stripEndingZeros($n) {
		$n=trim($n, '0');
		if (strpos($n, '.')==strlen($n)-1) $n=substr($n, 0, strlen($n)-1);
		return $n;
	}
	
	/**
	 * Get timezone mapped to php
	 */
	public static function getTimezone() {
		$tz=CalemText::getFormat('timezone');
		return $tz['php'];	
	}
	
	/**
	 * To write a formatter for short date to be correct.
	 */
	public static function getDateFormat() {
		$fmt=CalemText::getFormat('datefmt');
		return $fmt['php'];	
	}
	
	public static function getTimeFormat() {
		$fmt=CalemText::getFormat('timefmt');
		return $fmt['php'];			
	}
	
	public static function getDateTimeFormat() {
		$fmt=CalemText::getFormat('datetimefmt');
		return $fmt['php'];
	}
	
	/**
	 * To replace dsep and ksep per locale later.
	 */
	public static function getIntFormat() {
		return CalemText::getFormat('intfmt');	
	}
	
	public static function getNumberFormat() {
		return CalemText::getFormat('numberfmt');	
	}
	
	public static function getCurrencyFormat() {
		return CalemText::getFormat('currencyfmt');	
	}
	
	/**
	 * Time offset
	 */
	public static function getTimeOffset($dt) {
		return date('Z', $dt);
	}
	
	/**
	 * Format function
	 */
	public static function getFormat($id) {
		global $loc_conf;
		global $_CALEM_conf;
		if (!$loc_conf) {
			$fmt=$_CALEM_conf['report_conf'][$id]['std'];
		} else {
			$fmt=$loc_conf[$id];	
		}
		$rtn=$_CALEM_conf['report_conf'][$id][$fmt];
		return $rtn;
	}
	
	/**
	 * Get date from a string (YYYY-MM-DD)
	 */
	public static function parseServerDate($dtStr) {
		return ($dtStr ? mktime(0, 0, 0, substr($dtStr, 5, 2), substr($dtStr, 8, 2), substr($dtStr, 0,4)) : null);
	}
	
	/**
	 * Time format: hh:mm:ss
	 */
	public static function parseServerTime($dtStr) {
		return ($dtStr ? mktime(substr($dtStr, 0,2), substr($dtStr, 3, 2), substr($dtStr, 6,2), 1,1,2007) : null);
	}
	
	/**
	 * Datetime format: YYYY-MM-DD hh:mm:ss
	 */
	public static function parseServerDateTime($dtStr) {
		return (!$dtStr ? null : gmmktime(substr($dtStr, 11,2), substr($dtStr, 14, 2), substr($dtStr, 17,2),
		              substr($dtStr, 5, 2), substr($dtStr, 8, 2), substr($dtStr, 0,4) )); 
	}
	
	//Datetime format: 2007-12-28 15:20:30
	public static function datetimeToDate($dtStr) {
		return substr($dtStr, 0, 10);
	}
	
	//Get server date
	public static function getServerDate($dt=null) {
		if (!$dt) {
			$rtn=date('Y-m-d');
		} else {
			$rtn=date('Y-m-d', $dt);
		}	
		return $rtn;
	}
	
	public static function getServerDateTime($dt=null) {
		if (!$dt) {
			$rtn=gmdate('Y-m-d H:i:s');
		} else {
			$rtn=gmdate('Y-m-d H:i:s', $dt);
		}	
		return $rtn;
	}
	
	/**
	 * Server date time in raw format
	 */
   public static function getServerDateInt() {
   	return mktime();	
   }
	
	//Adjust $dt properly so it's the dow
	public static function getDateByDow($dt, $dow, $sameMonth=false) {
		$data=getdate($dt);
		$w=$data['wday'];
		if ($w==$dow) {
			$ndt=$dt;	
		} else {
			$sign= ($dow > $w) ? '+' : '-';
			$ndt=strtotime($sign . abs($dow - $w) . ' day', $dt);	
			if ($sameMonth && $sign=='-' && $data['mday'] <= $w-$dow) {
				$ndt=strtotime('+7 day', $ndt);	
			}
		}
		return $ndt;
	}
}
?>
