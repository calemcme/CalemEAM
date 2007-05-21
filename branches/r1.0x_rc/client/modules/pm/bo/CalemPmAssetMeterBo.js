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
 * CalemPmAssetMeterBo - business logic
 */
function CalemPmAssetMeterBo() {
}

CalemPmAssetMeterBo.getInstance =
function() {
	if (!CalemPmAssetMeterBo.singleton) {
		CalemPmAssetMeterBo.singleton = new CalemPmAssetMeterBo();
	}
	return CalemPmAssetMeterBo.singleton;
}

CalemPmAssetMeterBo.prototype.onLookup =
function(controller, parentFunc, fmId, lkupCallback, id, fld) {
	if (fld=='meter_id') {
		var link=new CalemFieldMdInfo('asset_id', 'asset_id');
		var parentRec=controller.getParentRec();
		var ebInfo=new CalemEmbedLookupInfo(this._parent, fmId, lkupCallback, id, {parentRec: parentRec, link: link});
		controller._embedForm(ebInfo);
	} else {
		parentFunc.call(this, fmId, lkupCallback, id, fld);
	}
}

CalemPmAssetMeterBo.prototype._getLookupExtraInfo =
function(controller, fld) {
	var rtn=null;
	if (fld=='meter_id') {
		var value=controller.getParentRec().getField('asset_id').getRawValue();
		rtn=[{fld: 'asset_id', value: value}];
	}
	return rtn;
}
