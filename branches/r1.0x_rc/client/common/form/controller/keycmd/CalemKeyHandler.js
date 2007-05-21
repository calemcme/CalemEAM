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
 

//Customize command: a) verify access rights; b) forward to forms
function CalemKeyHandler() {
	this._keymap=CalemConf['desktop_keymap'];
}

CalemKeyHandler.prototype.toString = function() {return "CalemKeyHandler";}

CalemKeyHandler.prototype.lookupCmdByEvent =
function(event) {
	var key= event.keyCode || event.charCode;
	var c=key;
	if (typeof(key)=='number') c=String.fromCharCode(key);
	var rtn=this._keymap[c];
	if (rtn) {
		rtn=eval(['new ', rtn.cmd, '()'].join(''));
	}
	return rtn;
}


/**
 * onKeyEvent
 * @return true 	if key handled successfully
 * 		  false  this key is not processed here.
 */
CalemKeyHandler.prototype.onKeyEvent =
function(event, target, currForm, desktop) {
	var rtn;
	//Check which widget we're dealing with
	var widget=Dwt.getObjectFromElement(target);
	if (widget && widget.onKeyHandler) {
		rtn=widget.onKeyHandler(event);
	}
	
	var cmd=this.lookupCmdByEvent(event);
	if (cmd) {
		rtn= cmd.execute(target, currForm, desktop);
	} else {
		rtn=false;
	}
	return rtn;
}
