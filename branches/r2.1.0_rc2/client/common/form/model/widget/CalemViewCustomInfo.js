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
 * CalemViewCustomInfo
 * This object stores the custom acl and layout for a view.
 */
function CalemViewCustomInfo(id, acl, layout) {
	if (arguments.length==0) return;
	this._id=id;
	this._acl=acl;
	this._layout=layout;
}

CalemViewCustomInfo.prototype.toString = function() {return "CalemViewCustomInfo";}
CalemViewCustomInfo.prototype.getClassName = function() {return "CalemViewCustomInfo";}

//Deserialize the object
CalemViewCustomInfo.prototype.setJson =
function(obj) {
	this._id=obj.id;
   this._acl=CalemJson.setJson(obj.acl);
   this._layout= (obj.layout ? CalemJson.setJson(obj.layout) : null);
}

//Serialization
CalemViewCustomInfo.prototype.getJson =
function() {
	return ["{CalemViewCustomInfo: {id: '", this._id, "', acl: ", this._acl.getJson(), 
					", layout: ", (this._layout ? this._layout.getJson() : 'null'),"}}"].join('');
}

CalemViewCustomInfo.prototype.getId =
function() {
	return this._id;
}

CalemViewCustomInfo.prototype.getAcl =
function() {
	return this._acl;
}

CalemViewCustomInfo.prototype.getLayout =
function() {
	return this._layout;
}

CalemViewCustomInfo.prototype.setLayout =
function(layout) {
	this._layout=layout;
}

//Acl api
CalemViewCustomInfo.prototype.checkViewAcl =
function(id) {
	return (this._acl) ? this._acl.checkViewAcl(id) : true;
}

CalemViewCustomInfo.prototype.checkTbAcl =
function(id) {
	return (this._acl) ? this._acl.checkTbAcl(id) : true;
}

/**
 * Creating a custom view layout.
 */
CalemViewCustomInfo.getFieldLabelId =
function(fld) {
	return ['flb_', fld].join('');
} 

CalemViewCustomInfo.createCustomLayout =
function(viewInfo, tableDd, fldList, excludeList) {	
	var ci=CalemCustomViewManager.getInstance()._getEmptyCustomInfo();
	var tbLayout=viewInfo.getItem('toolbar').getLayout();
	var rows=viewInfo.getLayout().getRows();
	var colCount=viewInfo.getLayout().getColLayout().getColCount();
	var i=0;
	while (i < fldList.length) {
		if (excludeList) {
			var found=false;
			for (var ei=0; ei<excludeList.length; ei++) {
				if (excludeList[ei]==fldList[i]) {
					found=true;
					break;
				}
			}
			if (found) {
				i++;
				continue;
			}
		}
		var j=0;
		var ar=[];
		while (j < colCount) { 
			ar.push(CalemViewCustomInfo.getFieldLabelId(fldList[i]));
			ar.push(fldList[i]);
			i +=1;
			j +=2;
			if (i >= fldList.length) {
				break;
			}
		}
		if (j < colCount) { //End of fldList.
			while (j++ < colCount) {
				ar.push('CalemColDesign'); //Fill it up.
			}			
		}
		
		//Creating a row.
		var tr=new CalemTrInfo(ar);
		rows.push(tr);
		if (i >= fldList.length) break;
	}
	var vl=new CalemViewLayoutInfo(tbLayout, rows);
	ci.setLayout(vl);
	return ci;
}

/**
 * CalemViewAclInfo
 */
function CalemViewAclInfo(tbAcl, viewAcl) {
	if (arguments.length==0) return;
	this._tbAcl=tbAcl;
	this._viewAcl=viewAcl;
}

CalemViewAclInfo.prototype.toString = function() {return "CalemViewAclInfo";}
CalemViewAclInfo.prototype.getClassName = function() {return "CalemViewAclInfo";}

//Deserialize the object
CalemViewAclInfo.prototype.setJson =
function(obj) {
   this._tbAcl=new CalemAclInfo(obj.tbAcl);
   this._viewAcl=new CalemAclInfo(obj.viewAcl);
}

//Serialization
CalemViewAclInfo.prototype.getJson =
function() {
	return ["{CalemViewAclInfo: {tbAcl: ", this._tbAcl.getJson(), 
					", viewAcl: ", this._viewAcl.getJson(),"}}"].join('');
}

CalemViewAclInfo.prototype.getTbAcl =
function() {
	return this._tbAcl;
}

CalemViewAclInfo.prototype.getViewAcl =
function() {
	return this._viewAcl;
}

CalemViewAclInfo.prototype.checkViewAcl =
function(id) {
	return (this._viewAcl ? this._viewAcl.checkAcl(id) : true);
}

CalemViewAclInfo.prototype.checkTbAcl =
function(id) {
	return (this._tbAcl ? this._tbAcl.checkAcl(id) : true);
}

/**
 * Support aggregation
 */
CalemViewAclInfo.prototype.aggregate =
function(viewAcl) {
	if (viewAcl._tbAcl) {
		this._tbAcl.aggregate(viewAcl._tbAcl);
	}
	if (viewAcl._viewAcl) {
		this._viewAcl.aggregate(viewAcl._viewAcl);
	}
}

/**
 * CalemViewLayoutInfo
 */
function CalemViewLayoutInfo(tbLayout, viewLayout, gridLayout) {
	if (arguments.length==0) return;
	this._tbLayout=tbLayout;
	this._viewLayout=viewLayout;
	this._gridLayout=gridLayout;
}

CalemViewLayoutInfo.prototype.toString = function() {return "CalemViewLayoutInfo";}
CalemViewLayoutInfo.prototype.getClassName = function() {return "CalemViewLayoutInfo";}

//Deserialize the object
CalemViewLayoutInfo.prototype.setJson =
function(obj) {
   this._tbLayout=obj.tbLayout;
   this._viewLayout=CalemJson.setJsonAsArray(obj.viewLayout);
   this._gridLayout=CalemJson.setJson(obj.gridLayout);
}

//Serialization
CalemViewLayoutInfo.prototype.getJson =
function() {
	return ["{CalemViewLayoutInfo: {tbLayout: ", CalemJson.arrayToJson(this._tbLayout), 
					", viewLayout: ", CalemJson.arrayToJson(this._viewLayout),
					(this._gridLayout ? [", gridLayout: ", this._gridLayout.getJson()].join('') : '')
					,"}}"].join('');
}

CalemViewLayoutInfo.prototype.getTbLayout =
function() {
	return this._tbLayout;
}

CalemViewLayoutInfo.prototype.getViewLayout =
function() {
	return this._viewLayout;
}

CalemViewLayoutInfo.prototype.getGridLayout =
function() {
	return this._gridLayout;
}
