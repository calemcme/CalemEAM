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
 * This is the module summary viewer.
 * 
 * Model: modsum view html so all the events will be routed back to the module that generates it.
 * Generated events: a) modsum selected (per data item selected).
 * Receive events: a) updated modsum view; b) size changes.
 */
 
/**
 * Constructor
 */
function CalemModSumView() {
	var shell=CalemContext.getInstance().getShell();
	this._parent=shell;
	DwtComposite.call(this, shell, "CalemModSumView", Dwt.ABSOLUTE_STYLE);
	//The will be a title and a list of items.
	this._titleId = Dwt.getNextId();
	this._createView();
} 

CalemModSumView.prototype = new DwtComposite;
CalemModSumView.prototype.constructor = CalemModSumView;

/**
 * Title for this summary panel
 */
CalemModSumView.prototype.setTitle =
function(title) {
	var el=document.getElementById(this._titleId);
	if (el) {
		el.innerHTML=title;
	}
}

/**
 * Default is just the title
 */
CalemModSumView.prototype._createView =
function() {
	var el=this.getHtmlElement();
	var i=0;
	var html = new Array();
	html[i++] = "<table style='width:100%;height:100%' cellpadding='0' cellspacing='1' border='0'>";
	html[i++] = "<tr><td><div id=";
	html[i++] =	this._titleId;
	html[i++] = ">divTesting</div></td></tr>";
	html[i++] = "</table>";
	el.innerHTML=html.join('');
}

/**
 * Layout change
 */
CalemModSumView.prototype.onLayoutChange =
function(param) {
	this.setBounds(param.x, param.y, param.width, param.height);
}

/**
 * Minimum height
 */
CalemModSumView.prototype.getMinHeight =
function() {
	return CalemConf['desktop_modView']['minModSumHeight'];
}

/**
 * Initialization
 */
CalemModSumView.prototype.init =
function(mod) {
	this._module=mod;
	this.setTitle(mod.getTitle());
}


