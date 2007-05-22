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
 * This class sends a soap request and parses soap result.
 */
 
/**
 * Constructor
 */
function CalemSoapClient(soapDoc, callback, showBusy) {
	if (arguments.length==0) return;
   this._soapDoc=soapDoc;
   this._callback=callback;
   this._showBusy=showBusy;
} 

/**
 * SoapClient call Id
 */
CalemSoapClient._callId=1;
 
CalemSoapClient.nextCallId =
function() {
	return 'SC'+CalemSoapClient._callId++;
}

/**
 * Constructor method for AjxSoapDoc
 */
CalemSoapClient.createSoapDoc =
function(method, namespace) {
	var ns= namespace || "urn:CalemosSoapService";
	var soapDoc= AjxSoapDoc.create(method, ns);
	return soapDoc;
} 

/**
 * Canned function to log out
 */
CalemSoapClient.logout =
function(callback) {
	//Create a soap document here
	var soapDoc=CalemSoapClient.createSoapDoc("Logout");
	soapDoc.set("sessionId", CalemContext.getInstance().getSessionId() );
   var client=new CalemSoapClient(soapDoc, callback);
   client.service();
   CalemContext.getInstance().deleteSessionId();
}

/**
 * Generic soap call interface
 */
CalemSoapClient.soapCall =
function(method, jsonObj, callback, showBusy) {
	var soapDoc=CalemSoapClient.createSoapDoc(method);
	soapDoc.set(method.toLowerCase(), jsonObj);
   var client=new CalemSoapClient(soapDoc, callback, showBusy);
   client.service();
} 

/**
 * Busy handling
 */
CalemSoapClient.prototype._setBusy =
function() {
	var shell=CalemContext.getInstance().getShell();
	if (this._showBusy && shell) {
		this._callId=CalemSoapClient.nextCallId();
		shell.setBusy(true, this._callId, true, 0, null);
   	shell.setBusyDialogText(CalemMsg.getMsg('soap_busy'));
	}
} 

CalemSoapClient.prototype._clearBusy =
function() {
	var shell=CalemContext.getInstance().getShell();
	if (this._showBusy && shell) { 
		shell.setBusy(false, this._callId);
	}
} 

/**
 * Service a soap call
 */
CalemSoapClient.prototype.service =
function() {
   //Configure header element
   var hdr = this._soapDoc.createHeaderElement();
	this._soapDoc.set("format", CalemConf.soap_format, hdr);
	//Set up sessionId if available
	var sid=CalemContext.getInstance().getSessionId();
	if (sid) {
		this._soapDoc.set(CalemContext.CALEM_SID, sid, hdr);
	}
	if (CalemDebug.isDebug()) {
		this._startTime=new Date();
		DBG.println("<font color=navy>Soap call:  "+this._soapDoc.getMethod().tagName+"</font>");
		DBG.printXML(this._soapDoc.getXml());
	}
	this._setBusy();
	if (!this._callback) {
		//Need to prse and handle exception here.
		var resp=AjxRpc.invoke(this._soapDoc.getXml(), calemSoapUrl, {"Content-Type": "application/soap+xml; charset=utf-8"});
		this._clearBusy();
		return this._handleSyncResponse(resp);
	} else {
	   var rpcCallback = new AjxCallback(this, this.handleResponse);
	   try {
	      this._rpcId = AjxRpc.invoke(this._soapDoc.getXml(), calemSoapUrl, {"Content-Type": "application/soap+xml; charset=utf-8"}, rpcCallback);  
	      this._clearBusy();
	   } catch (ex) {
	   	this._clearBusy();
	   	this._doCallback(this._getExceptionResponse(ex));
	   }
	}
} 

CalemSoapClient.prototype._doCallback =
function(res) {
	if (this._callback) this._callback.run(res);
}

/**
 * Exception handling
 */
CalemSoapClient.prototype._getExceptionResponse =
function(ex) {  
   DBG.println(AjxDebug.DBG1, "Got exception in CalemSoapClient, ex="+ex);
   res=CalemSoapResponse.createException(ex);
   DBG.dumpObj(res.getException());
   //Checking for invalid session. Logout if session is no longer valid.
   var soapErrorId=res.getSoapErrorId();
   if ( soapErrorId && CalemConf['soap_sessionError'][soapErrorId]) {
   	var logoutCallback = new AjxCallback(null, CalemSoapClient.reLogin);
   	CalemInfoDialog.showIt(CalemMsg.getMsg('error_server'), res.getErrorMsg(), logoutCallback);
   	return null;
   }
   return res;
} 
/**
 * Callback from soap client
 */
CalemSoapClient.prototype.handleResponse =
function(response) {
	var resp;
   try {
      resp=this.parseResponse(response);
   } catch (ex) {
      resp=this._getExceptionResponse(ex);
   }
   if (resp) this._doCallback(resp);
}

/**
 * Sync response handling for soap
 */
CalemSoapClient.prototype._handleSyncResponse =
function(response) {
	var resp;
   try {
      resp=this.parseResponse(response);
   } catch (ex) {
      resp=this._getExceptionResponse(ex);
   }
   return resp;
}

/**
 * Parse soap response
 */
CalemSoapClient.prototype.parseResponse =
function(response) { 
   //Parsing the response
   var respDoc=null;
   var xmlResponse=false;
   //Result is either JS or XML.
   if (response.text && typeof(response.text)=="string" && response.text.indexOf("{")==0) {
      respDoc=response.text;
   } else {
      xmlResponse=true;
      if (response.text || response.xml) {
         try {
            respDoc=(response.xml)?AjxSoapDoc.createFromDom(response.xml):AjxSoapDoc.createFromXml(response.text);
            if (!respDoc) {
               throw new AjxException("Parsed XML doc is null", 0, 'CalemSoapClient.prototype.parseResponse', '');
            }
         } catch (e) {
            DBG.println(AjxDebug.DBG1, "Error in parsing xml doc");
            throw e;
         }
      } else {//There's nothing to parse
         throw new AjxException("Response body is null", 0, 'CalemSoapClient.prototype.parseResponse', '');        
      }
   }
   //Get data to JS format
   var data;
   try {
      if (xmlResponse) {
         data = respDoc._xmlDoc.toJSObject(true,false); 
      } else {
         eval("data=" + respDoc);
      }
   } catch (ex) {
      throw new AjxException("Error in converting XML doc to JS object", 0, 'CalemSoapClient.prototype.parseResponse', '');
   }
   //Verify data validity
   if (!data) {
      throw new AjxException("Got NULL JS object from XML doc", 0, 'CalemSoapClient.prototype.parseResponse', '');
   }
   //Now check for fault
   if (data.Body.Fault) {
      //This is a SOAP fault so we need to display the error msg
      DBG.println(AjxDebug.DBG1, 'Received soap fault, Fault code='+data.Body.Fault.faultcode);
      throw new AjxException("Received Soap fault", data.Body.Fault.faultcode, 'CalemSoapClient.prototype.parseResponse', data.Body.Fault);
   } else if (!response.success) {//HTTP not 200 OK
      throw new AjxException("Error status received", 0, 'CalemSoapClient.prototype.parseResponse', "HTTP response status="+response.status);
   }
   res=CalemSoapResponse.createResponse(data);
   if (CalemDebug.isDebug()) {
   	var endTime=new Date();
   	DBG.println("<font color=navy>Soap call response:  "+this._soapDoc.getMethod().tagName+", time="+(endTime-this._startTime)+" ms </font>");
		DBG.dumpObj(res);
	}
   return res;
}

/**
 * Launch login form
 */
/**
 * logoutCallback definition.
 */
CalemSoapClient.reLogin =
function() {
	//Creating a form to fetch the logout form.
	var fmLogin = document.createElement('form');
	document.body.appendChild(fmLogin);
	fmLogin.innerHTML=""; //no info provided.
	fmLogin.action=calemRequestUrl+window.location.search;
	fmLogin.method="post";
	fmLogin.submit();
} 
 