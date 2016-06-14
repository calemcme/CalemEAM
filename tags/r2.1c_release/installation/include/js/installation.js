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

 function submitForm(fm, aid, validation) {
 	fm.aid.value=aid;
 	fm.validation.value=validation;
 	fm.bkcolor.value=document.body.className;
 	fm.submit(); 	
 }
 
 function submitFormWait(fm, aid, validation) {
 	var tbEl=document.getElementById('inst_toolbar');
 	var wtEl=document.getElementById('inst_toolbar_wait');
 	tbEl.style.display='none';
 	wtEl.style.display='block';
 	//Hide error if any
 	var errEl=document.getElementById('input_error');
 	if (errEl) {
 		errEl.style.display='none';
 	}
 	
 	fm.aid.value=aid;
 	fm.validation.value=validation;
 	fm.bkcolor.value=document.body.className;
 	//IE workaround - pause a bit for animation to get started.
 	window.setTimeout('submitDelayed()', 300); 	
 }
 
 function submitDelayed() {
 	fm=document.getElementById('instFormId');
 	if (fm) {
 		fm.submit();
 	}
 }
 
 function setBkColor(cls) {
 	document.body.className=cls;
 }
