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
 * CalemFieldLabel
 * This is the field label widget.
 */
function CalemFieldLabel(parent, style, className, posStyle) {
	if (arguments.length==0) return;
	style= style || (DwtLabel.IMAGE_RIGHT | DwtLabel.ALIGN_LEFT);
	DwtLabel.call(this, parent, style, className, posStyle);
} 

CalemFieldLabel.prototype = new DwtLabel;
CalemFieldLabel.prototype.constructor = CalemFieldLabel;

CalemFieldLabel.prototype.toString = 
function() {
	return "CalemFieldLabel";
}

//Set required label
CalemFieldLabel.prototype.setRequired =
function(bl) {
	var conf=CalemConf['view_engine']['field']['icon'];
	if (bl) this.setImage(conf['required']);
	else this.setImage(conf['not_required']);
}