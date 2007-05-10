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
 * CalemModuleViewListDesignRender
 */
function CalemModuleViewListDesignRender(parent, id, viewInfo, controller) {
	if (arguments.length==0) return;
	var conf=CalemConf['view_engine']['moduleViewListDesign'];
	CalemViewDesignRender.call(this, parent, id, viewInfo, controller, conf);
}

CalemModuleViewListDesignRender.prototype=new CalemViewDesignRender;
CalemModuleViewListDesignRender.prototype.constructor=CalemModuleViewListDesignRender;

CalemModuleViewListDesignRender.prototype.toString = function() { return "CalemModuleViewListDesignRender"; }
CalemModuleViewListDesignRender.prototype.getClassName = function() { return "CalemModuleViewListDesignRender"; }

/**
 * Render the design with a tree view
 */
CalemModuleViewListDesignRender.prototype._renderView =
function(parentEl, layout) {
	var render=new CalemModuleListLayoutTreeRender(this._parent, this._id, this._info, this._controller);
	render.initDnd(this._dragSrc, this._dropTarget); //Drag drop
	render._parentRender=this;
	render.render(parentEl, 0);
	this._add(this._id, render); //so onlayout change can be handled.
}

/**
 * Get customized info for saving
 * - acl info from leftPanel
 * - layout from right panel
 */
CalemModuleViewListDesignRender.prototype.getCustomizedView =
function() {
	var aclInfo=this._leftRender.getAclInfo();
	var modListInfo=this._renders[this._id].getModListInfo();
	var custom=new CalemModListCustomInfo(aclInfo, modListInfo);
	return custom;
}