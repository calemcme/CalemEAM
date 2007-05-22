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
 * CalemSearchSaveDesignRender
 *  
 */
function CalemSearchSaveDesignRender(parent, id, lbInfo, controller) {
	if (arguments.length==0) return;
	CalemUiDesignRender.call(this, parent, id, lbInfo, controller);
}

CalemSearchSaveDesignRender.prototype=new CalemUiDesignRender;
CalemSearchSaveDesignRender.prototype.constructor=CalemSearchSaveDesignRender;

CalemSearchSaveDesignRender.prototype.toString = function() { return "CalemSearchSaveDesignRender"; }

CalemSearchSaveDesignRender.prototype.render =
function(parentEl, yOff, clsName) {
	this._control=new CalemFieldDesign(this._parent, null, clsName);
	//Get field label based on data model.
	var text=CalemMsg.getMsg('save_search_field');
	this._control.setText(text);
	this._control.reparentHtmlElement(parentEl);
	//Sneak in a render property for checking back.
	this._enableDnd();
	this._control._parentRender=this;
}

