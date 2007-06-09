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
 * Widget utility
 */
function CalemWidgetUtil() {
} 

/**
 * Find the nearest parent that's shown in absolute position.
 */
CalemWidgetUtil.getAbsParent =
function(el) {
	var rtn=null;
	while (el.parentNode) {
		el=el.parentNode;
		if (DwtCssStyle.getProperty(el, 'position')=='absolute') {
  	 		rtn=el;
  	 		break;
  	 	}
	}
	return rtn;	
}

/**
 * Traverse the tree upward to find out if a parent node is not visible. 
 * (it's simplified...not in use).
 */
CalemWidgetUtil.getVisible =
function(el) {
	if (!CalemWidgetUtil.rootEl) {
		CalemWidgetUtil.rootEl=CalemContext.getInstance().getShell().getHtmlElement();
	}
	var rtn=CalemWidgetUtil._getVisible(el);
	while (rtn) {
		el=el.parentNode;
		if (el==CalemWidgetUtil.rootEl) break;
		rtn=CalemWidgetUtil._getVisible(el);
	}
	return rtn;	
}

CalemWidgetUtil._getVisible =
function(el) {
	return (el.style && el.style.display != Dwt.DISPLAY_NONE);
}