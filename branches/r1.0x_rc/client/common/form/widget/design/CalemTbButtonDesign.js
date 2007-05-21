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
 * CalemTbButtonDesign
 * Toolbar Button supporting dnd design.
 */
function CalemTbButtonDesign(parent, style, className) {
	if (arguments.length==0) return;
	CalemTbButton.call(this, parent, style, className);
	//Capture mouse events for drag and drop
	this._setMouseEventHdlrs(false);
} 

CalemTbButtonDesign.prototype = new CalemTbButton;
CalemTbButtonDesign.prototype.constructor = CalemTbButtonDesign;

CalemTbButtonDesign.prototype.toString = function() { return "CalemTbButtonDesign";}

/**
 * Events setup
 */
CalemTbButtonDesign.prototype.setupEvents =
function(btnInfo, controller) {
}

/**
 * Event handler
 */
CalemTbButtonDesign.prototype.onSelection =
function(evt) {
}

//Notify listener - mimic a click selection.
CalemTbButtonDesign.prototype._clickIt=
function() {
}

//Drag and drop support.constructor
CalemTbButtonDesign.prototype._getDnDIcon =
function() {
	var icon = document.createElement("div");
	icon.className=this._className;
	Dwt.setPosition(icon, Dwt.ABSOLUTE_STYLE); 
	var table = document.createElement("table");
	icon.appendChild(table);
	table.cellSpacing = table.cellPadding = 0;
		
	var row = table.insertRow(0);
	var i = 0;
	//Add text.
	var c = row.insertCell(i++);
   c.noWrap = true;
	AjxImg.setImage(c, this.getImage());
	//Add text.
	c = row.insertCell(i++);
	c.noWrap = true;
	c.innerHTML=this.getText();
	//Add required image
	
	
	this.shell.getHtmlElement().appendChild(icon);
	Dwt.setZIndex(icon, Dwt.Z_DND);
	return icon;
}
