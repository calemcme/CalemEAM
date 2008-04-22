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
 * CalemSoapUtil
 */
function CalemSoapUtil() {} 

/**
 * Soap call handler
 */
CalemSoapUtil._onSoapCall =
function(soapApi, soapObj, callback, errorCallback, extraInfo) {
	CalemSoapClient.soapCall(soapApi, soapObj, 
		new AjxCallback(null, CalemSoapUtil._onSoapCallback, {api: soapApi, callback: callback, errorCallback: errorCallback, ei: extraInfo}));
}

CalemSoapUtil._onSoapCallback =
function(param, resp) {
	//Analyze error msg.
   if (resp.getException()) {
   	if (param.errorCallback) {
   		param.errorCallback.run(resp);
   	} else { //Show error msg and stop here.
	   	var msg;
	   	if (msg=resp.getErrorMsg()) CalemInfoDialog.showIt(CalemMsg.getMsg('error_server'), msg);
   	}
   } else {//Analyze soap response.
   	eval(['var rsp=', 'resp.getResponse().', param.api, 'Response'].join(''));   	
   	param.callback.run(rsp, param.ei);     
   }
}

