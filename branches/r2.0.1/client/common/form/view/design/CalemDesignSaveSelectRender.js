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
 * CalemDesignSaveSelectRender
 * This is also a special controller to handle valid selection here.
 *  
 */
function CalemDesignSaveSelectRender(parent, id, info, controller) {
	if (arguments.length==0) return;
	CalemUiRender.call(this, parent, id, info, controller);
	this._modelItem=this._controller.getDataModel().getModelItem();
}

CalemDesignSaveSelectRender.prototype=new CalemUiRender;
CalemDesignSaveSelectRender.prototype.constructor=CalemDesignSaveSelectRender;

CalemDesignSaveSelectRender.prototype.toString = function() { return "CalemDesignSaveSelectRender"; }

/**
 * This render uses native select to fill the info.
 */
CalemDesignSaveSelectRender.prototype.render =
function(parentEl, yOff) {
	//Get valid list of info from controller.
	this._target=this._controller.getDesignTarget();	
	var sel={};
	sel[this._target.getId()]=this._target.getValue();
	//No need for callback for this case.
	this._control = new CalemEditMultiSelect({parent: this._parent, size: this._info.getSize(), 
									items: sel});
	var selected=[this._target.getId()];									
	this._control.setSelected(selected);
	this.onSelectChange(selected);
	this._control.reparentHtmlElement(parentEl);
	//Sneak in a render property for checking back.
	this._control._parentRender=this;
}

CalemDesignSaveSelectRender.prototype.onSelectChange =
function(selected) {
	//issue event listeners
	var evt=new CalemSelectionEvent(true);
	if (selected && selected.length > 0) {
		evt.setType(CalemEvent.MULTI_SELECTION);
		for (var i=0; i< selected.length; i++) evt.add(selected[i]);
	} else {
		evt.setType(CalemEvent.NO_SELECTION);
	}
	this._modelItem.notifyListeners(evt.getType(), evt);
}


