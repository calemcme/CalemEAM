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
 * CalemLabelDesign
 * This is the label design widget.
 */
function CalemLabelDesign(parent, style, className, posStyle) {
	if (arguments.length==0) return;
	style= style || (DwtLabel.IMAGE_RIGHT | DwtLabel.ALIGN_LEFT);
	className = className || 'CalemLabelDesign';
	DwtLabel.call(this, parent, style, className, posStyle);
	//Capture mouse events for drag and drop
	this._setMouseEventHdlrs(false);
} 

CalemLabelDesign.prototype = new DwtLabel;
CalemLabelDesign.prototype.constructor = CalemLabelDesign;

CalemLabelDesign.prototype.toString = 
function() {
	return "CalemLabelDesign";
}

//Set required label
CalemLabelDesign.prototype.setRequired =
function(bl) {
	var conf=CalemConf['view_engine']['field']['icon'];
	if (bl) this.setImage(conf['required']);
	else this.setImage(conf['not_required']);
}

//Drag and drop support.constructor
CalemLabelDesign.prototype._getDnDIcon =
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
	c.innerHTML=this.getText();
	//Add required image
	c = row.insertCell(i);
   c.noWrap = true;
	AjxImg.setImage(c, this.getImage());
	
	this.shell.getHtmlElement().appendChild(icon);
	Dwt.setZIndex(icon, Dwt.Z_DND);
	return icon;
}

//Label design
CalemLabelDesign.prototype.doLabelEdit = 
function() {
	return false;
}

CalemLabelDesign.prototype.getLabelId =
function() {
	return this._parentRender.getLabelId();
}

CalemLabelDesign.prototype.onLabelChanged =
function() {
	this.setText(this._parentRender.getLabel());
}


