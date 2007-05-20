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
 * CalemViewRecordDesignRender
 */
function CalemViewRecordDesignRender(parent, id, viewInfo, controller) {
	if (arguments.length==0) return;
	var conf=CalemConf['view_engine']['viewRecordDesign'];
	CalemViewDesignRender.call(this, parent, id, viewInfo, controller, conf);
}

CalemViewRecordDesignRender.prototype=new CalemViewDesignRender;
CalemViewRecordDesignRender.prototype.constructor=CalemViewRecordDesignRender;

CalemViewRecordDesignRender.prototype.toString = function() { return "CalemViewRecordDesignRender"; }
CalemViewRecordDesignRender.prototype.getClassName = function() { return "CalemViewRecordDesignRender"; }

/**
 * Creating a grip on a row so it can used to move a row around.
 * @return canRowMove
 */
CalemViewRecordDesignRender.prototype._onRowCreated =
function(rowEl, cols) {
	var canMove=this._canRowMove(cols);
	var cellEl=rowEl.insertCell(-1);
	this._renderRowDesign(cellEl, canMove);
	return canMove;
}

/**
 * Row cell is rendered so always starts with 1.
 */
CalemViewRecordDesignRender.prototype._getStartCol =
function() {
	return 1;
}

CalemViewRecordDesignRender.prototype._renderCol =
function(rowEl) {
	var cellEl=rowEl.insertCell(-1);
	this._renderColDesign(cellEl);
}

CalemViewRecordDesignRender.prototype._getColSpan =
function(colSpan, canMove) {
	return canMove ? null : colSpan; //Force each cell to render.
}

CalemViewRecordDesignRender.prototype._renderForCalemColDesign =
function(rowEl) {
	this._renderCol(rowEl);
}

CalemViewRecordDesignRender.prototype.onFieldLabelChanged =
function(fld) {
	if (this._renders[fld]) this._renders[fld].onFieldLabelChanged();
}
