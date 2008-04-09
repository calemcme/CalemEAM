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
 * CalemTbDesignButtonRender
 *  
 */
function CalemTbDesignButtonRender(parent, id, lbInfo, controller) {
	if (arguments.length==0) return;
	CalemUiDesignRender.call(this, parent, id, lbInfo, controller);
}

CalemTbDesignButtonRender.prototype=new CalemUiDesignRender;
CalemTbDesignButtonRender.prototype.constructor=CalemTbDesignButtonRender;

CalemTbDesignButtonRender.prototype.toString = function() { return "CalemTbDesignButtonRender"; }

CalemTbDesignButtonRender.prototype.render =
function(parentEl, yOff, clsName) {	
	var def=this._info.getDef();
	this._control=new CalemTbButtonDesign(this._parent, def.style, def.className);
	this._control.setImage(def.icon);
	this._control.setText(CalemMsg.getMsg(def.title));
	//Drag/drop handling
	this._enableDnd();
	this._control._parentRender=this;
	return this._control;
}

//Drop handling.
CalemTbDesignButtonRender.prototype._onDrop =
function(srcControl, targetControl) {
	if (srcControl instanceof CalemDesignTreeButton) {
		this._parent.addButton(srcControl.getInfo());
		srcControl.removeMe();
	} else {
		//Adding button to the front of target control
		var sourceHtml=srcControl.getHtmlElement();
		var targetHtml=targetControl.getHtmlElement();
		//Swapping TD could avoid changing the association between control and html.	
		//Take each out of the parent node.
		var srcTd=sourceHtml.parentNode;
		var tgtTd=targetHtml.parentNode;
		//Move to front
		srcTd.parentNode.removeChild(srcTd);
		tgtTd.parentNode.insertBefore(srcTd, tgtTd);
	}
 	return true;
}

//No action for the parentRender
CalemTbDesignButtonRender.prototype.removeRender =
function() {
	//No action, since render is not stored anywhere.
}

//replace button and its TD
CalemTbDesignButtonRender.prototype.replaceWithDesignCol =
function(ctrl) {
   var tdEl=ctrl.getHtmlElement().parentNode;
	this.remove(ctrl);
	tdEl.parentNode.removeChild(tdEl);
}
