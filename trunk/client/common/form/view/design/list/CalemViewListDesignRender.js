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
 * CalemViewListDesignRender
 */
function CalemViewListDesignRender(parent, id, viewInfo, controller) {
	if (arguments.length==0) return;
	var conf=CalemConf['view_engine']['viewListDesign'];
	CalemViewDesignRender.call(this, parent, id, viewInfo, controller, conf);
}

CalemViewListDesignRender.prototype=new CalemViewDesignRender;
CalemViewListDesignRender.prototype.constructor=CalemViewListDesignRender;

CalemViewListDesignRender.prototype.toString = function() { return "CalemViewListDesignRender"; }
CalemViewListDesignRender.prototype.getClassName = function() { return "CalemViewListDesignRender"; }

/**
 * Row cell is not rendered so starts with 1.
 */
CalemViewListDesignRender.prototype._getStartCol =
function() {
	return 0;
}

/**
 * Handle grid case.
 */
CalemViewListDesignRender.prototype._handleObjectLayout =
function(obj, layout) {
	if (obj instanceof CalemListView) {
		layout._gridLayout=obj._parentRender.getGridLayout();
	} else {
		CalemViewDesignRender.prototype._handleObjectLayout.call(this, obj, layout);
	}
}
