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
 * CalemReadFileUpload
 * This is the default object to hold a field value.
 */
function CalemReadFileUpload(params) {
	if (arguments.length==0) return;
	var clsName = params.className ? params.className : "CalemReadFileUpload";
	DwtControl.call(this, params.parent, clsName, params.posStyle);	
} 

CalemReadFileUpload.prototype = new DwtControl;
CalemReadFileUpload.prototype.constructor = CalemReadFileUpload;

CalemReadFileUpload.prototype.toString = function() { return "CalemReadFileUpload"; }

CalemReadFileUpload.prototype.setFileUpload =
function(rawValue, value) {
	if (rawValue) {
		var htmlEl = this.getHtmlElement();
		htmlEl.innerHTML=['<a href="', CalemConf['file_upload']['viewMethod'], "('", rawValue, "')", '">', value, "</a>"].join('');
	}
}
