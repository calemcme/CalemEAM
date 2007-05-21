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

$_CALEM_dist['report_conf']=array(
   'timezone'=>array(
   	'std'=>'(GMT-06.00) Central Time (US & Canada)',
   	'(GMT-06.00) Central Time (US & Canada)'=>array(
   		'php'=>'US/Central'
   	)
   ),
   'datefmt'=>array(
      'std'=>'EEE, M/d/yy',
   	'EEE, M/d/yy'=>array(
   		'php'=>'D, m/d/y'
   	)
   ),
   'timefmt'=>array(
   	'std'=>'h:mm a',
   	'h:mm a'=>array(
   		'php'=>'g:i a'
   	)
   ),
   'datetimefmt'=>array(
      'std'=>'EEE, M/d/yy h:mm a',
   	'EEE, M/d/yy h:mm a'=>array(
   		'php'=>'D, m/d/y g:i a'
   	)
   ),
   //Note: dsep and ksep are locale dependent.
   'intfmt'=>array(
   	'std'=>'#,##0',
   	'#,##0'=>array('decimal'=>0, 'dsep'=>'', 'ksep'=>',')
   ),
   'numberfmt'=>array(
      'std'=>'#,##0.###',
   	'#,##0.###'=>array('decimal'=>3, 'dsep'=>'.', 'ksep'=>',')   	
   ),
   'currencyfmt'=>array(
      'std'=>'#,##0.00;(#,##0.00)',
   	'#,##0.00;(#,##0.00)'=>array(
   		'positive'=>array('decimal'=>2, 'dsep'=>'.', 'ksep'=>','),
   		'negative'=>array(
   			'enclosed'=>true,
   			'left'=>'(',
   			'right'=>')'
   		)
   	)
   ),
   //Renders
   'reportRender'=>array(
		'CalemViewInfo' =>array(
          'class'=>'CalemReportReadRender',
          'path'=>'server/modules/report/render/read/'
      ),
		'CalemFieldInfo'=>array(
          'class'=>'CalemFieldReadRender',
          'path'=>'server/modules/report/render/read/'
      ),
		'CalemEditScheduleInfo'=>array(
 			 'class'=>'CalemReadScheduleRender',
 			 'path'=>'server/modules/report/render/read/'
 		),
 		
 		//grid, label, field label
 		'CalemDataGridInfo' =>array(
          'class'=>'CalemDataGridRender',
          'path'=>'server/modules/report/render/'
      ),
		'CalemLabelInfo'=>array(
          'class'=>'CalemLabelRender',
          'path'=>'server/modules/report/render/'
      ),
		'CalemFieldLabelInfo'=>array(
 			 'class'=>'CalemFieldLabelRender',
 			 'path'=>'server/modules/report/render/'
 		),
 		
		'FieldRenders'=>array(
		  	'text'=>array(
	          'class'=>'CalemReadTextRender',
	          'path'=>'server/modules/report/render/read/'
	      ),
	   	'boolean'=>array(
	 			 'class'=>'CalemReadBooleanRender',
	 			 'path'=>'server/modules/report/render/read/'
	 		),
	   	'default'=>array(
	 			 'class'=>'CalemReadDefaultRender',
	 			 'path'=>'server/modules/report/render/read/'
	 		)
	   )
	),
	'report_size'=>array(
		'width'=>210, //mm
		'height'=>297,
		'x_margin'=>10,
		'unit'=>'mm'
	),	
	'items_no_render'=>array(
		'toolbar'=>true,
		'err'=>true
	)
);

?>
