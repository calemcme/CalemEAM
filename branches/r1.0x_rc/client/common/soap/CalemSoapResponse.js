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
 * This is the response object from a soap call. The possible response objects are:
 * <ul>
 * <li> Response object with information from server
 * <li> Response object including an exception
 * </ul>
 */
 
/**
 * Constructor
 */
function CalemSoapResponse(ex, data) {
   if (ex) {
      if (AjxUtil.isInstance(ex, AjxException)) {
         this._ajxException=ex;
      } else {
         this._ajxException=new AjxException(ex);
      }
      var soapErrId='soap_'+this._ajxException.code;
      if (soapErrId in CalemMsg) {
         this._errorMsg=CalemMsg[soapErrId];
      } else {
         this._errorMsg=CalemMsg.soap_default;
      }
      this._errorMsgDetail=this._ajxException.dump();
   }
   this._data=data;
}

/**
 * Static factory method to create a response object. 
 */
CalemSoapResponse.createException = 
function(ex) {
   resp=new CalemSoapResponse(ex, null);
   return resp;
}

CalemSoapResponse.createResponse = 
function(data) {
   resp=new CalemSoapResponse(null, data);
   return resp;
}

/**
 * Response helper methods
 */
CalemSoapResponse.prototype.getException =
function() {
   return this._ajxException;
} 

CalemSoapResponse.prototype.getErrorMsg =
function() {
   return this._errorMsg;
}

CalemSoapResponse.prototype.getErrorMsgDetail =
function() {
   return this._errorMsgDetail;
}

CalemSoapResponse.prototype.getData =
function() {
   if (this._ajxException) return false;
   return this._data;
}

CalemSoapResponse.prototype.getSoapErrorId =
function() {
	return (this._ajxException && this._ajxException.code) ? this._ajxException.code : null;
}

/**
 * Get response portion of the body
 */
CalemSoapResponse.prototype.getResponse =
function() {
   if (this._ajxException) return false;
   return this._data.Body;
}