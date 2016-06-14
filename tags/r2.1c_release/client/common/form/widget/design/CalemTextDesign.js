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
 * CalemTextDesign
 * This is the text design widget.
 */
function CalemTextDesign(param) {
	if (arguments.length==0) return;
	CalemFieldDesign.call(this, param.parent);
	this._param=param;
} 

CalemTextDesign.prototype = new CalemFieldDesign;
CalemTextDesign.prototype.constructor = CalemTextDesign;

CalemTextDesign.prototype.toString = 
function() {
	return "CalemTextDesign";
}

CalemTextDesign.prototype.setText =
function(text) {
	CalemFieldDesign.prototype.setText.call(this, text);
	this._setTextLayout(this._param);
}

CalemTextDesign.prototype._setTextLayout =
function(param) {
	var factor=CalemConf['view_engine'].textLengthDesignFactor;
	var size = Math.floor(param.size/(factor!=0 ? factor : 2));
	Dwt.setSize(this._textCell, size+"em", param.rows+"em");
}
