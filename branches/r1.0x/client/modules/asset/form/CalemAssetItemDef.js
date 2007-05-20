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
 * forms
 */
CalemItemDef['CalemAssetFormList']={
	CalemFormInfo: {
		id: 'CalemAssetFormList',
		title: 'asset_list',
		icon: 'CalemAsset',
		controller: 'CalemAssetFormList',
		model: 'asset', 
		view: {CalemViewRefInfo: {id: 'CalemAssetViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemAssetFormSearch'
	}
}

CalemItemDef['CalemAssetFormLookup']={
	CalemFormInfo: {
		id: 'CalemAssetFormLookup',
		title: 'asset',
		icon: 'CalemAsset',
		controller: 'CalemAssetFormLookup',
		model: 'asset', 
		view: {CalemViewRefInfo: {id: 'CalemAssetViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemAssetFormSearch'
	}
}

CalemItemDef['CalemAssetFormNew']={
	CalemFormInfo: {
		id: 'CalemAssetFormNew',
		title: 'asset',
		icon: 'CalemAsset',
		controller: 'CalemAssetFormNew',
		model: 'asset', 
		view: {CalemViewRefInfo: {id: 'CalemAssetViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemAssetFormEdit']={
	CalemFormInfo: {
		id: 'CalemAssetFormEdit',
		title: 'asset',
		icon: 'CalemAsset',
		controller: 'CalemAssetFormEdit',
		model: 'asset', 
   	view: {CalemViewRefInfo: {id: 'CalemAssetViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemAssetFormRead']={
	CalemFormInfo: {
		id: 'CalemAssetFormRead',
		title: 'asset',
		icon: 'CalemAsset',
		controller: 'CalemAssetFormRead',
		model: 'asset', 
		view: {CalemViewRefInfo: {id: 'CalemAssetViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemAssetFormSearch']={
	CalemFormInfo: {
		id: 'CalemAssetFormSearch',
		title: 'asset',
		icon: 'CalemAsset',
		controller: 'CalemFormSearchEdit',
		model: 'asset', 
		view: {CalemViewRefInfo: {id: 'CalemAssetViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemAssetFormMdTab']={
	CalemFormMdTabInfo: {
		id: 'CalemAssetFormMdTab',
		title: 'asset',
		icon: 'CalemAsset',
		replaceType: CalemItemDef.REPLACE_BY_ID,
		//Three portions of info: layout, model and itemMap.
		layout: {
			CalemMdTabLayoutInfo: {
				tabList: ['tab_main', 'tab_downtime', 'CUSTOMIZE_TAB'],
				tabMap: {
					'tab_main': {CalemTabLayoutInfo: ['CalemAssetFormRead']},
					
					'tab_downtime' : {CalemTabLayoutInfo: ['CalemAssetDowntimeFormList','CalemAssetCommentFormList']}
				}
			} },
		model: {
				CalemFormModelInfo: {
					master: 'CalemAssetFormRead',
			      items: 
			             [{CalemFormLinkInfo: {id: 'CalemAssetDowntimeFormList', link: {CalemFieldMdInfo: {fld: 'asset_id', parentFld: 'id'}}} },
			              {CalemFormLinkInfo: {id: 'CalemAssetCommentFormList', link: {CalemFieldMdInfo: {fld: 'asset_id', parentFld: 'id'}}} },
			              {CalemFormLinkInfo: {id: 'CalemAssetMeterFormList', link: {CalemFieldMdInfo: {fld: 'asset_id', parentFld: 'id'}}} },
			              {CalemFormLinkInfo: {id: 'CalemAssetPartFormList', link: {CalemFieldMdInfo: {fld: 'asset_id', parentFld: 'id'}}} },
			              {CalemFormLinkInfo: {id: 'CalemAssetDepreciationFormList', link: {CalemFieldMdInfo: {fld: 'asset_id', parentFld: 'id'}}} }
			             ]
				}
		}, 
		itemMap : { //Default layout conf.
		  CalemItemMap :{
			 'CalemAssetFormRead' : {
			 	CalemFormLayoutInfo: {
			 		id: 'CalemAssetFormRead',
			 		fixed: true, //Move not allowed.
			 		layout: {CalemBlockLayoutInfo: {width: '100%', height: '-2'}}
			 	}
			 },
			 
			 'CalemAssetDowntimeFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemAssetDowntimeFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 
			 'CalemAssetCommentFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemAssetCommentFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 
			 'CalemAssetPartFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemAssetPartFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 
			 'CalemAssetDepreciationFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemAssetDepreciationFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
		  
		  'CalemAssetMeterFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemAssetMeterFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 
		  'tab_main': {
		  		CalemTabInfo: {id: 'tab_asset_main', fixed: 1}
		  },
		  
		  'tab_downtime': {
		  		CalemTabInfo: {id: 'tab_asset_downtime'}
		  },
		  
		  'tab_meter': {
		  		CalemTabInfo: {id: 'tab_asset_meter'}
		  },
		  
		  'tab_part': {
		  		CalemTabInfo: {id: 'tab_asset_part'}
		  },
		  
		  'tab_depreciation': {
		  		CalemTabInfo: {id: 'tab_asset_depreciation'}
		  },
		  
		  'tab_comment': {
		  		CalemTabInfo: {id: 'tab_asset_comment'}
		  },
		  
		  'tab_misc': {
		  		CalemTabInfo: {id: 'tab_asset_misc'}
		  },
		  
		  'CUSTOMIZE_TAB' : {
		  		CalemTabInfo: {id: 'CUSTOMIZE_TAB'}
		  }
		  
		  }
		  
		} //itemMap
	} //MdTabInfo
}

/**
 * Downtime
 */
CalemItemDef['CalemAssetDowntimeFormList']={
	CalemFormInfo: {
		id: 'CalemAssetDowntimeFormList',
		title: 'asset_downtime',
		icon: 'CalemAsset',
		controller: 'CalemAssetDowntimeFormList',
		model: 'asset_downtime', 
		view: {CalemViewRefInfo: {id: 'CalemAssetDowntimeViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemAssetDowntimeFormNew']={
	CalemFormInfo: {
		id: 'CalemAssetDowntimeFormNew',
		title: 'asset_downtime',
		icon: 'CalemAsset',
		controller: 'CalemAssetDowntimeFormNew',
		model: 'asset_downtime', 
		view: {CalemViewRefInfo: {id: 'CalemAssetDowntimeViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemAssetDowntimeFormEdit']={
	CalemFormInfo: {
		id: 'CalemAssetDowntimeFormEdit',
		title: 'asset_downtime',
		icon: 'CalemAsset',
		controller: 'CalemAssetDowntimeFormEdit',
		model: 'asset_downtime', 
   	view: {CalemViewRefInfo: {id: 'CalemAssetDowntimeViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemAssetDowntimeFormRead']={
	CalemFormInfo: {
		id: 'CalemAssetDowntimeFormRead',
		title: 'asset_downtime',
		icon: 'CalemAsset',
		controller: 'CalemAssetDowntimeFormRead',
		model: 'asset_downtime', 
		view: {CalemViewRefInfo: {id: 'CalemAssetDowntimeViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * Asset comment
 */
CalemItemDef['CalemAssetCommentFormList']={
	CalemFormInfo: {
		id: 'CalemAssetCommentFormList',
		title: 'asset_comment',
		icon: 'CalemAsset',
		controller: 'CalemAssetCommentFormList',
		model: 'asset_comment', 
		view: {CalemViewRefInfo: {id: 'CalemAssetCommentViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemAssetCommentFormNew']={
	CalemFormInfo: {
		id: 'CalemAssetCommentFormNew',
		title: 'asset_comment',
		icon: 'CalemAsset',
		controller: 'CalemAssetCommentFormNew',
		model: 'asset_comment', 
		view: {CalemViewRefInfo: {id: 'CalemAssetCommentViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemAssetCommentFormEdit']={
	CalemFormInfo: {
		id: 'CalemAssetCommentFormEdit',
		title: 'asset_comment',
		icon: 'CalemAsset',
		controller: 'CalemAssetCommentFormEdit',
		model: 'asset_comment', 
   	view: {CalemViewRefInfo: {id: 'CalemAssetCommentViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemAssetCommentFormRead']={
	CalemFormInfo: {
		id: 'CalemAssetCommentFormRead',
		title: 'asset_comment',
		icon: 'CalemAsset',
		controller: 'CalemAssetCommentFormRead',
		model: 'asset_comment', 
		view: {CalemViewRefInfo: {id: 'CalemAssetCommentViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}


/**
 * Meter
 */
CalemItemDef['CalemAssetMeterFormList']={
	CalemFormInfo: {
		id: 'CalemAssetMeterFormList',
		title: 'asset_meter',
		icon: 'CalemAsset',
		controller: 'CalemAssetMeterFormList',
		model: 'asset_meter', 
		view: {CalemViewRefInfo: {id: 'CalemAssetMeterViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemAssetMeterFormLookup']={
	CalemFormInfo: {
		id: 'CalemAssetMeterFormLookup',
		title: 'asset_meter',
		icon: 'CalemAsset',
		controller: 'CalemAssetMeterFormLookup',
		model: 'asset_meter', 
		view: {CalemViewRefInfo: {id: 'CalemAssetMeterViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemAssetMeterFormNew']={
	CalemFormInfo: {
		id: 'CalemAssetMeterFormNew',
		title: 'asset_meter',
		icon: 'CalemAsset',
		controller: 'CalemAssetMeterFormNew',
		model: 'asset_meter', 
		view: {CalemViewRefInfo: {id: 'CalemAssetMeterViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemAssetMeterFormEdit']={
	CalemFormInfo: {
		id: 'CalemAssetMeterFormEdit',
		title: 'asset_meter',
		icon: 'CalemAsset',
		controller: 'CalemAssetMeterFormEdit',
		model: 'asset_meter', 
   	view: {CalemViewRefInfo: {id: 'CalemAssetMeterViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemAssetMeterFormRead']={
	CalemFormInfo: {
		id: 'CalemAssetMeterFormRead',
		title: 'asset_meter',
		icon: 'CalemAsset',
		controller: 'CalemAssetMeterFormRead',
		model: 'asset_meter', 
		view: {CalemViewRefInfo: {id: 'CalemAssetMeterViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * Meter reading
 */
CalemItemDef['CalemAssetMeterReadingFormList']={
	CalemFormInfo: {
		id: 'CalemAssetMeterReadingFormList',
		title: 'meter_transaction',
		icon: 'CalemAsset',
		controller: 'CalemAssetMeterReadingFormList',
		model: 'meter_transaction', 
		view: {CalemViewRefInfo: {id: 'CalemAssetMeterReadingViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemAssetMeterReadingFormNew']={
	CalemFormInfo: {
		id: 'CalemAssetMeterReadingFormNew',
		title: 'meter_transaction',
		icon: 'CalemAsset',
		controller: 'CalemAssetMeterReadingFormNew',
		model: 'meter_transaction', 
		view: {CalemViewRefInfo: {id: 'CalemAssetMeterReadingViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemAssetMeterReadingFormRead']={
	CalemFormInfo: {
		id: 'CalemAssetMeterReadingFormRead',
		title: 'meter_transaction',
		icon: 'CalemAsset',
		controller: 'CalemAssetMeterReadingFormRead',
		model: 'meter_transaction', 
		view: {CalemViewRefInfo: {id: 'CalemAssetMeterReadingViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}


/**
 * Part
 */
CalemItemDef['CalemAssetPartFormList']={
	CalemFormInfo: {
		id: 'CalemAssetPartFormList',
		title: 'asset_part',
		icon: 'CalemAsset',
		controller: 'CalemAssetPartFormList',
		model: 'asset_part', 
		view: {CalemViewRefInfo: {id: 'CalemAssetPartViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemAssetPartFormNew']={
	CalemFormInfo: {
		id: 'CalemAssetPartFormNew',
		title: 'asset_part',
		icon: 'CalemAsset',
		controller: 'CalemAssetPartFormNew',
		model: 'asset_part', 
		view: {CalemViewRefInfo: {id: 'CalemAssetPartViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemAssetPartFormEdit']={
	CalemFormInfo: {
		id: 'CalemAssetPartFormEdit',
		title: 'asset_part',
		icon: 'CalemAsset',
		controller: 'CalemAssetPartFormEdit',
		model: 'asset_part', 
   	view: {CalemViewRefInfo: {id: 'CalemAssetPartViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemAssetPartFormRead']={
	CalemFormInfo: {
		id: 'CalemAssetPartFormRead',
		title: 'asset_part',
		icon: 'CalemAsset',
		controller: 'CalemAssetPartFormRead',
		model: 'asset_part', 
		view: {CalemViewRefInfo: {id: 'CalemAssetPartViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * Depreciation
 */
CalemItemDef['CalemAssetDepreciationFormList']={
	CalemFormInfo: {
		id: 'CalemAssetDepreciationFormList',
		title: 'asset_depreciation',
		icon: 'CalemAsset',
		controller: 'CalemAssetDepreciationFormList',
		model: 'asset_depreciation', 
		view: {CalemViewRefInfo: {id: 'CalemAssetDepreciationViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemAssetDepreciationFormNew']={
	CalemFormInfo: {
		id: 'CalemAssetDepreciationFormNew',
		title: 'asset_depreciation',
		icon: 'CalemAsset',
		controller: 'CalemAssetDepreciationFormNew',
		model: 'asset_depreciation', 
		view: {CalemViewRefInfo: {id: 'CalemAssetDepreciationViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemAssetDepreciationFormEdit']={
	CalemFormInfo: {
		id: 'CalemAssetDepreciationFormEdit',
		title: 'asset_depreciation',
		icon: 'CalemAsset',
		controller: 'CalemAssetDepreciationFormEdit',
		model: 'asset_depreciation', 
   	view: {CalemViewRefInfo: {id: 'CalemAssetDepreciationViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemAssetDepreciationFormRead']={
	CalemFormInfo: {
		id: 'CalemAssetDepreciationFormRead',
		title: 'asset_depreciation',
		icon: 'CalemAsset',
		controller: 'CalemAssetDepreciationFormRead',
		model: 'asset_depreciation', 
		view: {CalemViewRefInfo: {id: 'CalemAssetDepreciationViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * Manufacturer
 */
CalemItemDef['CalemManufacturerFormList']={
	CalemFormInfo: {
		id: 'CalemManufacturerFormList',
		title: 'manufacturer_list',
		icon: 'CalemAsset',
		controller: 'CalemManufacturerFormList',
		model: 'manufacturer', 
		view: {CalemViewRefInfo: {id: 'CalemManufacturerViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemManufacturerFormSearch'
	}
}

CalemItemDef['CalemManufacturerFormLookup']={
	CalemFormInfo: {
		id: 'CalemManufacturerFormLookup',
		title: 'manufacturer',
		icon: 'CalemAsset',
		controller: 'CalemManufacturerFormLookup',
		model: 'manufacturer', 
		view: {CalemViewRefInfo: {id: 'CalemManufacturerViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemManufacturerFormSearch'
	}
}

CalemItemDef['CalemManufacturerFormNew']={
	CalemFormInfo: {
		id: 'CalemManufacturerFormNew',
		title: 'manufacturer',
		icon: 'CalemAsset',
		controller: 'CalemManufacturerFormNew',
		model: 'manufacturer', 
		view: {CalemViewRefInfo: {id: 'CalemManufacturerViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemManufacturerFormEdit']={
	CalemFormInfo: {
		id: 'CalemManufacturerFormEdit',
		title: 'manufacturer',
		icon: 'CalemAsset',
		controller: 'CalemManufacturerFormEdit',
		model: 'manufacturer', 
   	view: {CalemViewRefInfo: {id: 'CalemManufacturerViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemManufacturerFormRead']={
	CalemFormInfo: {
		id: 'CalemManufacturerFormRead',
		title: 'manufacturer',
		icon: 'CalemAsset',
		controller: 'CalemManufacturerFormRead',
		model: 'manufacturer', 
		view: {CalemViewRefInfo: {id: 'CalemManufacturerViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemManufacturerFormSearch']={
	CalemFormInfo: {
		id: 'CalemManufacturerFormSearch',
		title: 'manufacturer',
		icon: 'CalemAsset',
		controller: 'CalemFormSearchEdit',
		model: 'manufacturer', 
		view: {CalemViewRefInfo: {id: 'CalemManufacturerViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * AssetType
 */
CalemItemDef['CalemAssetTypeFormList']={
	CalemFormInfo: {
		id: 'CalemAssetTypeFormList',
		title: 'asset_type_list',
		icon: 'CalemAsset',
		controller: 'CalemAssetTypeFormList',
		model: 'asset_type', 
		view: {CalemViewRefInfo: {id: 'CalemAssetTypeViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemAssetTypeFormSearch'
	}
}

CalemItemDef['CalemAssetTypeFormLookup']={
	CalemFormInfo: {
		id: 'CalemAssetTypeFormLookup',
		title: 'asset_type',
		icon: 'CalemAsset',
		controller: 'CalemAssetTypeFormLookup',
		model: 'asset_type', 
		view: {CalemViewRefInfo: {id: 'CalemAssetTypeViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemAssetTypeFormSearch'
	}
}

CalemItemDef['CalemAssetTypeFormNew']={
	CalemFormInfo: {
		id: 'CalemAssetTypeFormNew',
		title: 'asset_type',
		icon: 'CalemAsset',
		controller: 'CalemAssetTypeFormNew',
		model: 'asset_type', 
		view: {CalemViewRefInfo: {id: 'CalemAssetTypeViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemAssetTypeFormEdit']={
	CalemFormInfo: {
		id: 'CalemAssetTypeFormEdit',
		title: 'asset_type',
		icon: 'CalemAsset',
		controller: 'CalemAssetTypeFormEdit',
		model: 'asset_type', 
   	view: {CalemViewRefInfo: {id: 'CalemAssetTypeViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemAssetTypeFormRead']={
	CalemFormInfo: {
		id: 'CalemAssetTypeFormRead',
		title: 'asset_type',
		icon: 'CalemAsset',
		controller: 'CalemAssetTypeFormRead',
		model: 'asset_type', 
		view: {CalemViewRefInfo: {id: 'CalemAssetTypeViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemAssetTypeFormSearch']={
	CalemFormInfo: {
		id: 'CalemAssetTypeFormSearch',
		title: 'asset_type',
		icon: 'CalemAsset',
		controller: 'CalemFormSearchEdit',
		model: 'asset_type', 
		view: {CalemViewRefInfo: {id: 'CalemAssetTypeViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * MeterType
 */
CalemItemDef['CalemMeterTypeFormList']={
	CalemFormInfo: {
		id: 'CalemMeterTypeFormList',
		title: 'meter_type_list',
		icon: 'CalemAsset',
		controller: 'CalemMeterTypeFormList',
		model: 'meter_type', 
		view: {CalemViewRefInfo: {id: 'CalemMeterTypeViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemMeterTypeFormSearch'
	}
}

CalemItemDef['CalemMeterTypeFormLookup']={
	CalemFormInfo: {
		id: 'CalemMeterTypeFormLookup',
		title: 'meter_type',
		icon: 'CalemAsset',
		controller: 'CalemMeterTypeFormLookup',
		model: 'meter_type', 
		view: {CalemViewRefInfo: {id: 'CalemMeterTypeViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemMeterTypeFormSearch'
	}
}

CalemItemDef['CalemMeterTypeFormNew']={
	CalemFormInfo: {
		id: 'CalemMeterTypeFormNew',
		title: 'meter_type',
		icon: 'CalemAsset',
		controller: 'CalemMeterTypeFormNew',
		model: 'meter_type', 
		view: {CalemViewRefInfo: {id: 'CalemMeterTypeViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemMeterTypeFormEdit']={
	CalemFormInfo: {
		id: 'CalemMeterTypeFormEdit',
		title: 'meter_type',
		icon: 'CalemAsset',
		controller: 'CalemMeterTypeFormEdit',
		model: 'meter_type', 
   	view: {CalemViewRefInfo: {id: 'CalemMeterTypeViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemMeterTypeFormRead']={
	CalemFormInfo: {
		id: 'CalemMeterTypeFormRead',
		title: 'meter_type',
		icon: 'CalemAsset',
		controller: 'CalemMeterTypeFormRead',
		model: 'meter_type', 
		view: {CalemViewRefInfo: {id: 'CalemMeterTypeViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemMeterTypeFormSearch']={
	CalemFormInfo: {
		id: 'CalemMeterTypeFormSearch',
		title: 'meter_type',
		icon: 'CalemAsset',
		controller: 'CalemFormSearchEdit',
		model: 'meter_type', 
		view: {CalemViewRefInfo: {id: 'CalemMeterTypeViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

//Meter select form list
CalemItemDef['CalemAssetMeterSelectFormList']={
	CalemFormInfo: {
		id: 'CalemAssetMeterSelectFormList',
		title: 'asset_meter_select',
		icon: 'CalemAsset',
		controller: 'CalemAssetMeterSelectFormList',
		model: 'asset_meter', 
		view: {CalemViewRefInfo: {id: 'CalemAssetMeterSelectViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemAssetFormSearch'
	}
} 