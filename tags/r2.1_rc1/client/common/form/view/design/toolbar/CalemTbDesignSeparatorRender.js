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
 * CalemTbDesignSeparatorRender
 *  
 */
function CalemTbDesignSeparatorRender(parent, id, lbInfo, controller) {
	if (arguments.length==0) return;
	CalemUiDesignRender.call(this, parent, id, lbInfo, controller);
}

CalemTbDesignSeparatorRender.prototype=new CalemUiDesignRender;
CalemTbDesignSeparatorRender.prototype.constructor=CalemTbDesignSeparatorRender;

CalemTbDesignSeparatorRender.prototype.toString = function() { return "CalemTbDesignSeparatorRender"; }

CalemTbDesignSeparatorRender.prototype.render =
function(parentEl, yOff, clsName) {
	//classname
	var conf=CalemConf['view_engine']['viewRecordDesign'].seperatorBtn;
	this._control=new CalemTbButtonDesign(this._parent, conf.style, conf.className); //Use button for this purpose.
	this._control.setText(CalemMsg.getMsg('separator'));
	this._control.setImage('CalemSeparator');
	//Sneak in a render property for checking back.
	this._enableDnd();
	this._control._parentRender=this;
}

//Drop handling.
CalemTbDesignSeparatorRender.prototype._onDrop =
function(srcControl, targetControl) {
	if (srcControl instanceof CalemDesignTreeButton) {
		this._parent.addButton(srcControl.getInfo());
		srcControl.removeMe();
	} else {
		this._swapControls(srcControl, targetControl);
	}
    return true;
}
