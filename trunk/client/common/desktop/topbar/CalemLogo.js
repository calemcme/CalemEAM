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
 * This toolbar includes a logo and the following functions:
 * - logout
 * - help 
 */
 
/**
 * Constructor
 */
function CalemLogo(parent) {
	this._parent = parent;
	this._icon="/client/themes/calemeam.png";
	this._url="http://www.calemeam.com"
	this.createLogo();
} 

/**
 * Logo icon
 */
CalemLogo.prototype.createLogo =
function() {
   this._logoDiv=document.getElementById('theme_headline_logo');
   this._logoDiv.innerHTML=["<img src='", calemRootUrl, this._icon, "' onclick=\"javascript:window.open('", 
                       this._url, "', 'CalemEAM - Open Source EAM/CMMS')\">"].join("");
}
	 