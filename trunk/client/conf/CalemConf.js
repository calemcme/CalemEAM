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
 * This is the configuration shipped out of the box.
 */
 
function CalemConst() {}
CalemConst.NEW_AT_TOP=0;
CalemConst.NEW_AT_BOTTOM=1; 

CalemConst.DELETE_PROMPT = 1;
CalemConst.DELETE_NO_PROMPT = -1;

CalemConst.CALEM_OOB = 'CALEM_OOB';
CalemConst.CUSTOM_SYSTEM = 'CUSTOM_SYSTEM';

CalemConst.LAYOUT_VERTICAL = 'LAYOUT_VERTICAL';
CalemConst.LAYOUT_HORIZONTAL = 'LAYOUT_HORIZONTAL';

CalemConst.DbExpr_EQ='=';
CalemConst.DbExpr_NEQ='<>';
CalemConst.DbExpr_GTEQ='>=';
CalemConst.DbExpr_GT='>';
CalemConst.DbExpr_LTEQ='<=';
CalemConst.DbExpr_LT='<';
CalemConst.DbExpr_IS_NULL='IS NULL';
CalemConst.DbExpr_IS_NOT_NULL='IS NOT NULL';
CalemConst.DbExpr_LIKE='LIKE';
CalemConst.DbExpr_IN='IN';

CalemConst.MY_SEARCH= 0;
CalemConst.SHARED_SEARCH=1;

CalemConst._EMPTY = '__empty';
CalemConst._TRUE = '__true';
CalemConst._FALSE= '__false';

CalemConst._NODE_ADDED = 1;
CalemConst._NODE_REMOVED = -1;

CalemConst._TAB_SINGLE= 'SINGLE';
CalemConst._TAB_MULTI = 'MULTIPLE';

CalemConst._TAB_CUSTOMIZE ='CUSTOMIZE_TAB';

CalemConst._TABLE_CUSTOM ='zc_';
CalemConst._REC_CUSTOM_ID ='zc_id';
CalemConst._REC_ID = 'id';

CalemConst._VARCHAR = 'varchar';
CalemConst._VT_DROPDOWN_USE = 'vt_dropdown_use';

CalemConst._CACHED = 1;

CalemConst._DUMMY_FLD = '__dummy_fld__';

CalemConst.TB_CUSTOMIZE = 'CalemTbCustomize';
 
/**
 * Constructor
 */
function CalemConf() {}

/**
 * SOAP
 */
CalemConf["soap_format"] = "js";

/**
 * Invalid login or session expiration
 */
CalemConf['soap_sessionError'] = {'NoActiveSession':true};

/**
 * Desktop topBar
 */  
/** Logo */
CalemConf['desktop_logo'] = {
	logoIcon: "/client/themes/calemeam.png",
	logoUrl: "http://www.calemeam.com"	
};

/** Desktop toolbar */
CalemConf["desktop_exitToolBar"]= {
	posInfo: {parentId: 'theme_headline_right'},
	extraInfo: {helpUrl: "http://www.calemeam.com"},
	tbDef: {
		CalemToolBarInfo: {
			      layout: ['CalemLogout', 'CalemHelp'],
					list: [
						{CalemButtonInfo: {id: 'CalemLogout'}},	
						{CalemButtonInfo: {id: 'CalemHelp'}}]
	}
  }
};

/** Module toolbar */
CalemConf["desktop_moduleToolBar"]= {
	posInfo: {parentId: 'theme_headline_mod'}
};

/** Menu list default */
CalemConf['menuListInfo']={
	menuInfo: {style: null, className: 'ActionMenu', posStyle: null, dialog: null},
	btnInfo: {shouldToggle: true, followIconStyle: DwtMenuItem.CASCADE_STYLE},
	btn: { style: (DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_LEFT),	
		    className: 'TBButton'
	     },
	menuItem: { style: DwtMenuItem.SELECT_STYLE,
					menu_className: null
	     }
}

/**
 * Desktop leftBar
 */ 
CalemConf["desktop_modView"] = {
	xOff: 0,
	yOff: 2,
	xPad: 2,
	yPad: 2,
	modViewWidth:150, modBarHeight:450, 
   minModSumHeight: 40, minModWidth: 100, redrawDelay:400, sashLimit: 3
};

CalemConf["desktop_modBarView"] = {
	buttonHeight: 26,
	minButtonCount: 1,
	iconWidth: 40,
	minIconCount: 1,
	buttonStyle: (DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_LEFT)
};
CalemConf["desktop_modBarViewMore"]={id: "txtCalemMore", icon: "CalemMoreIcon"};

/**
 * Desktop main area
 */ 
CalemConf["desktop_mainView"] = {
	welcomeConf: {id: 'theme_headline_center', msg: 'welcome_with_time', repeat: true, interval: 60000},
	shell: {
		className: null,
		scrollable: false
	},
	ff167801Enabled: true,
	redrawDelay:400, 
	sashLimit: 3,
	controller: 'CalemMainController',
	mainView: 'CalemFormTabView',
	displayTabs: 5,
	moreTab: {
		title: 'txtCalemMore',
		icon: 'CalemMore',
		icon: 'CalemMoreHover'
	},
	closeBtn: {
		title: 'tab_close',
		icon: 'CalemCloseTab',
		hoverIcon: 'CalemCloseTabHover'
	},
	fmBtnStyle: (DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_LEFT),
	form: {
		viewImpl: 'CalemView',
		viewMdTabImpl: {SINGLE: 'CalemViewMd', MULTIPLE: 'CalemViewMdTab'},
		viewHolder: 'CalemViewPage',
		viewDesignImpl: 'CalemViewDesign',
		modelImpl: 'CalemDataModel',
		formModelImpl: 'CalemFormModel'
	}
};

CalemConf['view_engine'] = {
	alternate_color: false,
	alternate_row_color: {even: '#CCFFCC', odd: '#FFFFCC'},
	
	validationDelay: 100,
	multi_line: {size: 76, lines: {varchar: 3, text: 6}},
	tabPage: {
		xMargin: {left: 1, right:  1},
		yMargin: {top:  1, bottom: 1}
	},
	grid: {
		xMargin: 2,
		yMargin: 5,
		min: {width: 100, height: 100}
	},
	defaultRowHeight: 24,
	viewDiv: { widthOffset: 30, heightOffset: 0},
	viewRender: { //Default or shared renders
	   rowsNoColor: {'err': true, 'toolbar': true, '_save_search': true},
	   
		CalemToolBarInfo: 'CalemToolBarRender',
		CalemDataGridInfo: 'CalemDataGridRender',
		CalemLabelInfo: 'CalemLabelRender',
		CalemHSeparatorInfo: 'CalemHSeparatorRender',
		CalemFieldLabelInfo: 'CalemFieldLabelRender',
	   CalemFieldInfo: 'CalemFieldReadRender',
	   CalemFormErrorInfo: 'CalemFormErrorRender',
	   FieldRenders: {
	   	
	   }
	},
	viewListRender: {
		CalemViewInfo: 'CalemViewListRender',
		FieldRenders: {
	   	
	   }
	},
	viewReadRender: {
		CalemViewInfo: 'CalemViewReadRender',
		CalemFieldInfo: 'CalemFieldReadRender',
		CalemEditScheduleInfo: 'CalemReadScheduleRender',
		FieldRenders: {
	   	'text'  : 	'CalemReadTextRender',
	   	'boolean' : 'CalemReadBooleanRender',
	   	'join': 'CalemReadLookupRender',
	   	'default':  'CalemReadDefaultRender'
	   }
	},
	viewEditRender: { //New and edit
		CalemViewInfo: 'CalemViewEditRender',
		CalemFieldInfo: 'CalemEditRenderFacade',
		CalemEditScheduleInfo: 'CalemEditScheduleRender',
		CalemEditInCheckoutToInfo: 'CalemEditInCheckoutToRender',
		FieldRenders: {
			//String type
			'varchar': 	'CalemEditStringRender',
			'text'  : 	'CalemEditTextRender',
			//Boolean
			'boolean':  'CalemEditBooleanRender',
			//Numerical
			'integer':	'CalemEditIntegerRender',
			'int':	'CalemEditIntegerRender',
			'double':   'CalemEditNumberRender',
			'percent':   'CalemEditPercentRender',
			//date/time
			'date':     'CalemEditDateRender',
			'time':     'CalemEditTimeRender',
			'datetime': 'CalemEditDateTimeRender',
			//currency
			'currency': 'CalemEditCurrencyRender',
			'sys_currency': 'CalemEditSysCurrencyRender',
			'currency_id': 'CalemEditCurrencyIdRender',
			//Dropdown
			'dropdown_join': 'CalemEditDropdownJoinRender',
			'join': 'CalemEditLookupRender',
			'password': 'CalemEditPasswordRender'
		}
	},
	viewRenderMdTab: {//Renders are determined by view class
	   pageAbsMargin: {x: 0, y: 1},
		tabViewMargin: {x: 0, y: 3},
		formMargin: {y: 3},
		rowMarginY: 15,
		CalemViewMd: 'CalemViewMdRender',
		CalemViewMdTab: 'CalemViewMdTabRender',
		CalemViewPageMd: 'CalemViewTabRender'
	},
	/**
	 * Design renders
	 */
	dev_admin_id: '1000001',
	devDesignPhase: true,
	devDesignGroup: CalemConst.CALEM_OOB,
	textLengthDesignFactor: 2,
	dndAllowedCss: 'CalemDndAllowed',
	viewDesign: {
		sashDelay: 400,
		CalemToolBarInfo: 'CalemToolBarDesignRender',
		CalemDataGridInfo: 'CalemGridDesignRenderFacade',
		CalemLabelInfo: 'CalemLabelDesignRender',
		CalemFieldLabelInfo: 'CalemFieldLabelDesignRender',
	   CalemFormErrorInfo: 'CalemFormErrorDesignRender',
	   CalemEditScheduleInfo: 'CalemTextDesignRender',
	   CalemEditInCheckoutToInfo: 'CalemTextDesignRender',
	   FieldRenders: {			
			'text'  : 	'CalemTextDesignRender',
			'default': 	'CalemFieldDesignRender'
	   },
	   //Regular renders have to use an alias to get to
	   CalemToolBarDesignInfo: 'CalemToolBarRender', //regular toolbar render
		CalemDesignLabelInfo: 'CalemLabelRender',   //regular label render
		CalemDesignSelectInfo: 'CalemDesignSaveSelectRender',
		//Search save
		CalemSearchSaveInfo: 'CalemSearchSaveDesignRender'
	},
	viewRecordDesign: {
		rowsNoDnd: {'err': true, 'toolbar': true, '_save_search': true},
		leftPanelWidth: 180,
		margin: 2,
		actionMenuMarginX: 60,
		
		treeMargin: {x: 2, y: 2},
		leftPanelViewId: 'CalemViewDesignRecordPanel',
		CalemViewInfo: 'CalemViewRecordDesignRender',
		CalemRecordDesignTreeInfo: 'CalemRecordDesignTreeRender',
		seperatorBtn: {style: DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_LEFT, className: 'TBButton'},
		dropAllowed: {
			//Col can accept Lable, field
			CalemRecordDesignColRender: {
				CalemLabelDesignRender: true,
				CalemFieldLabelDesignRender: true,
				CalemFieldDesignRender: true,
				CalemTextDesignRender: true,
				CalemDesignTreeLabel: true, //Tree items
				CalemDesignTreeFieldLabel: true,
				CalemDesignTreeField: true,
				CalemDesignTreeText: true
			},
			//Row can accept new row, or row swap.
			CalemRecordDesignRowRender: {
				CalemRecordDesignRowRender: true,
				CalemDesignTreeRow: true
			},
			//Label can accept label and field
			CalemLabelDesignRender: {
				CalemLabelDesignRender: true,
				CalemFieldLabelDesignRender: true,
				CalemFieldDesignRender: true,
				CalemTextDesignRender: true,
				CalemDesignTreeLabel: true
			},
			//field label can get label, field
			CalemFieldLabelDesignRender: {
				CalemLabelDesignRender: true,
				CalemFieldLabelDesignRender: true,
				CalemFieldDesignRender: true,
				CalemTextDesignRender: true
			},
			//field can get label and field
			CalemFieldDesignRender: {
				CalemLabelDesignRender: true,
				CalemFieldLabelDesignRender: true,
				CalemFieldDesignRender: true,
				CalemTextDesignRender: true
			},
			//Text can get label and field.
			CalemTextDesignRender: {
				CalemLabelDesignRender: true,
				CalemFieldLabelDesignRender: true,
				CalemFieldDesignRender: true,
				CalemTextDesignRender: true
			},
			//Buttons
			CalemTbDesignButtonRender: {
				CalemTbDesignButtonRender: true,
				CalemTbDesignSeparatorRender: true,
				CalemDesignTreeButton: true
			},
			//Separators
			CalemTbDesignSeparatorRender: {
				CalemTbDesignButtonRender: true,
				CalemTbDesignSeparatorRender: true,
				CalemDesignTreeButton: true
			},
			//Tree
			CalemDesignTreeFormRecord: {
				CalemLabelDesignRender: true,
				CalemFieldLabelDesignRender: true,
				CalemFieldDesignRender: true,
				CalemTextDesignRender: true,
				//button
				CalemTbDesignButtonRender: true,
				//row
				CalemRecordDesignRowRender: true	
			}
		}
	},
	viewListDesign: {
		grid: {height: 100},
		rowsNoDnd: {'toolbar': true, 'grid': true},
		leftPanelWidth: 180,
		margin: 2,
		treeMargin: {x: 2, y: 2},
		seperatorBtn: {style: DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_LEFT, className: 'TBButton'},
		leftPanelViewId: 'CalemViewDesignListPanel',
		CalemListDesignTreeInfo: 'CalemListDesignTreeRender',
		CalemViewInfo: 'CalemViewListDesignRender',
		dropAllowed: {
		}
	},
	
	viewMdTabDesign: {
		startDelay: 50,
		viewImpl: 'CalemViewMd',
		CalemViewMd: 'CalemViewMdTabDesignRender',
		//Common design items
		rowsNoDnd: {},
		leftPanelWidth: 180,
		margin: 2,
		
		treeMargin: {x: 2, y: 2},
		seperatorBtn: {style: DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_LEFT, className: 'TBButton'},
		leftPanelViewId: 'CalemViewDesignMdTabPanel',
		CalemMdTabDesignTreeInfo: 'CalemMdTabDesignTreeRender',

		dropAllowed: {
			//FormMdTab can accept tab, tabCustomize and form
			CalemDesignTreeFormMdTab: {
				CalemLayoutTreeForm: true,
				CalemLayoutTreeTab: true,
				CalemLayoutTreeTabCustomize: true
			},
			//Row can accept new row, or row swap.
			CalemLayoutTreeFormMdTab: {
				CalemDesignTreeTab: true,
				CalemDesignTreeTabCustomize: true
			},
			CalemLayoutTreeTabFixed: {
				CalemLayoutTreeForm: true,
				CalemDesignTreeForm: true
			},
			//Label can accept label and field
			CalemLayoutTreeTab: {
				CalemLayoutTreeForm: true,
				CalemDesignTreeForm: true
			},
			CalemLayoutTreeForm: {
				CalemLayoutTreeForm: true
			}
		}	
	},
	
	//Module list design
	moduleViewListDesign: {
		rowsNoDnd: {},
		leftPanelWidth: 180,
		margin: 2,
		treeMargin: {x: 2, y: 2},
		seperatorBtn: {style: DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_LEFT, className: 'TBButton'},
		
		leftPanelViewId: 'CalemViewDesignListPanel',
		CalemListDesignTreeInfo: 'CalemModuleListDesignTreeRender',
		CalemViewInfo: 'CalemModuleViewListDesignRender',
		dropAllowed: {
			//module design root
			CalemDesignTreeModListRoot: {
				CalemLayoutTreeModule: true
			},
			//Row can accept new row, or row swap.
			CalemLayoutTreeModListRoot: {
				CalemDesignTreeModule: true
			},
			//Label can accept label and field
			CalemLayoutTreeModule: {
				CalemLayoutTreeModule: true
			}
		}
	},	
	
	//Module design
	moduleViewDesign: {
		rowsNoDnd: {},
		leftPanelWidth: 180,
		margin: 2,
		treeMargin: {x: 2, y: 2},
		seperatorBtn: {style: DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_LEFT, className: 'TBButton'},
		
		leftPanelViewId: 'CalemViewDesignListPanel',
		CalemListDesignTreeInfo: 'CalemModuleDesignTreeRender',
		CalemViewInfo: 'CalemModuleViewDesignRender',
		dropAllowed: {
			//module design root
			CalemDesignTreeFormModule: {
				CalemLayoutTreeMenuItem: true,
				CalemLayoutTreeMenuNode: true
			},
			
			CalemLayoutTreeFormDesign: {
				CalemLayoutTreeMenuItem: true,
				CalemLayoutTreeDefaultMenu: true
			},
			
			CalemLayoutTreeDefaultMenuRoot: {
				CalemLayoutTreeMenuItem: true
			},
			
			CalemLayoutTreeDefaultMenu: {
				CalemLayoutTreeMenuItem: true
			},
			
			CalemLayoutTreeLayoutRoot: {
				CalemDesignTreeMenuNode: true,
				CalemDesignTreeMenuItem: true	
			},
			
			CalemLayoutTreeMenuNode: {
				CalemLayoutTreeMenuNode: true,
				CalemLayoutTreeMenuItem: true	
			},
			
			CalemLayoutTreeMenuItem: {
				CalemLayoutTreeMenuItem: true	
			},
			
			CalemLayoutTreeLabel: {
				CalemLayoutTreeMenuItem: true	
			},
			
			CalemLayoutTreeSeparator: {
				CalemLayoutTreeMenuItem: true	
			}
		}
	},	
	
	//table design
	tableViewDesign: {
		rowsNoDnd: {},
		leftPanelWidth: 200,
		margin: 2,
		treeMargin: {x: 2, y: 2},
		seperatorBtn: {style: DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_LEFT, className: 'TBButton'},
		menuMarginX: 100,
		fieldConf: {
			varcharMaxLen: 4000, //for Oracle
			nameRegExp: '\\w+'
		},
		leftPanelViewId: 'CalemViewDesignTablePanel',
		CalemListDesignTreeInfo: 'CalemTableDesignTreeRender',
		CalemViewInfo: 'CalemTableViewDesignRender',
		dropAllowed: {
			
		}
	},	
	
	//dropdown design
	dropdownViewDesign: {
		rowsNoDnd: {},
		leftPanelWidth: 200,
		margin: 2,
		treeMargin: {x: 2, y: 2},
		seperatorBtn: {style: DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_LEFT, className: 'TBButton'},
		menuMarginX: 100,
		
		leftPanelViewId: 'CalemViewDesignDropdownPanel',
		CalemListDesignTreeInfo: 'CalemDropdownDesignTreeRender',
		CalemViewInfo: 'CalemDropdownViewDesignRender',
		dropAllowed: {
			
			CalemLayoutTreeDropdownTableCustom: {
				CalemDesignTreeField: true
			},
			
			CalemLayoutTreeDropdownCustom: {
				CalemLayoutTreeDropdownCustom: true
			}
		}
	},	
	
	//Label design
	labelDesign: {
		group: 'CUSTOM_SYSTEM',
		locale: { clientMap: {def: {id: 'en'}},
		          serverMap: {'en': {id: ''}}
		}
	},
	
	//ViewSearch
	viewSearchRender: { //General view search
		CalemMySearchSelectInfo: 'CalemMySearchSelectRender',
		CalemSharedSearchSelectInfo: 'CalemSharedSearchSelectRender',
		CalemSearchSaveInfo: 'CalemSearchSaveRender'
	},
	
	//ViewSearchSelect
	viewSearchSelectRender: {
		CalemViewInfo: 'CalemViewSearchSelectRender'
	},
	
	//ViewSearchEdit
	searchSave: {display: 30, max: 30},
	viewSearchEditRender: {
		dropdownRows: 4,
		CalemViewInfo: 'CalemViewSearchEditRender',
		CalemFieldInfo: 'CalemSearchFieldRenderFacade',
		CalemEditScheduleInfo: 'CalemSearchScheduleRender',
		FieldRenders: {
			//String type
			'varchar': 	'CalemSearchStringRender',
			'text'  : 	'CalemSearchTextRender',
			//Boolean
			'boolean':  'CalemSearchBooleanRender',
			//Numerical
			'integer':	'CalemSearchIntegerRender',
			'int':	'CalemSearchIntegerRender',
			'double':   'CalemSearchNumberRender',
			'percent':   'CalemSearchPercentRender',
			//date/time
			'date':     'CalemSearchDateRender',
			'time':     'CalemSearchTimeRender',
			'datetime': 'CalemSearchDateTimeRender',
			//currency
			'currency': 'CalemSearchNumberRender',
			'sys_currency': 'CalemSearchNumberRender',
			'currency_id': 'CalemSearchLookupRender',
			//Dropdown
			'dropdown_join': 'CalemSearchDropdownJoinRender',
			'join': 'CalemSearchLookupRender'
		},
		FieldEditOps : {
			'varchar': [CalemConst.DbExpr_LIKE, CalemConst.DbExpr_EQ, CalemConst.DbExpr_IS_NULL, CalemConst.DbExpr_IS_NOT_NULL],
			'text' : [CalemConst.DbExpr_LIKE, CalemConst.DbExpr_IS_NULL, CalemConst.DbExpr_IS_NOT_NULL],
			'boolean': [CalemConst.DbExpr_EQ],
			'integer': [CalemConst.DbExpr_EQ, CalemConst.DbExpr_GT, CalemConst.DbExpr_GTEQ, CalemConst.DbExpr_LT, CalemConst.DbExpr_LTEQ, CalemConst.DbExpr_IS_NULL, CalemConst.DbExpr_IS_NOT_NULL],
			'double':  [CalemConst.DbExpr_EQ, CalemConst.DbExpr_GT, CalemConst.DbExpr_GTEQ, CalemConst.DbExpr_LT, CalemConst.DbExpr_LTEQ, CalemConst.DbExpr_IS_NULL, CalemConst.DbExpr_IS_NOT_NULL],
			'percent':  [CalemConst.DbExpr_EQ, CalemConst.DbExpr_GT, CalemConst.DbExpr_GTEQ, CalemConst.DbExpr_LT, CalemConst.DbExpr_LTEQ, CalemConst.DbExpr_IS_NULL, CalemConst.DbExpr_IS_NOT_NULL],
			'date': [CalemConst.DbExpr_EQ, CalemConst.DbExpr_GT, CalemConst.DbExpr_GTEQ, CalemConst.DbExpr_LT, CalemConst.DbExpr_LTEQ, CalemConst.DbExpr_IS_NULL, CalemConst.DbExpr_IS_NOT_NULL],
			'time': [CalemConst.DbExpr_EQ, CalemConst.DbExpr_GT, CalemConst.DbExpr_GTEQ, CalemConst.DbExpr_LT, CalemConst.DbExpr_LTEQ, CalemConst.DbExpr_IS_NULL, CalemConst.DbExpr_IS_NOT_NULL],
			'datetime': [CalemConst.DbExpr_EQ, CalemConst.DbExpr_GT, CalemConst.DbExpr_GTEQ, CalemConst.DbExpr_LT, CalemConst.DbExpr_LTEQ, CalemConst.DbExpr_IS_NULL, CalemConst.DbExpr_IS_NOT_NULL],
			'currency': [CalemConst.DbExpr_EQ, CalemConst.DbExpr_GT, CalemConst.DbExpr_GTEQ, CalemConst.DbExpr_LT, CalemConst.DbExpr_LTEQ, CalemConst.DbExpr_IS_NULL, CalemConst.DbExpr_IS_NOT_NULL],
			'sys_currency': [CalemConst.DbExpr_EQ, CalemConst.DbExpr_GT, CalemConst.DbExpr_GTEQ, CalemConst.DbExpr_LT, CalemConst.DbExpr_LTEQ, CalemConst.DbExpr_IS_NULL, CalemConst.DbExpr_IS_NOT_NULL],
			'currency_id': [CalemConst.DbExpr_EQ, CalemConst.DbExpr_LIKE, CalemConst.DbExpr_IS_NULL, CalemConst.DbExpr_IS_NOT_NULL],
			'dropdown_join': [CalemConst.DbExpr_IN, CalemConst.DbExpr_IS_NULL, CalemConst.DbExpr_IS_NOT_NULL],
			'join': [CalemConst.DbExpr_EQ, CalemConst.DbExpr_IS_NULL, CalemConst.DbExpr_IS_NOT_NULL],
			'schedule': [CalemConst.DbExpr_IS_NOT_NULL, CalemConst.DbExpr_EQ, CalemConst.DbExpr_IS_NULL] 
		}
	},

	//Misc
	hsepClassName: 'horizSep',
	field: {
		icon: {required: 'CalemRequired', not_required: ''},
		inputErrorIcon: DwtInputField.ERROR_ICON_LEFT
	}
};

/**
 * Reistry of meta data
 */
CalemConf['registry_manager'] = {impl:"CalemRegistry", names:['registry_module']};
//Modules
CalemConf["registry_module"]={
	   loader: 'loadModules',
	   names: ['modCalemWo', 'modCalemSched', 'modCalemAsset', 'modCalemPm', 
	           'modCalemIn', 'modCalemReq', 'modCalemPo', 'modCalemRcm',
	           'modCalemAdmin', 'modCalemProject', 'modCalemDoc', 'modCalemContact', 
	           'modCalemContractor', 'modCalemBudget', 'modCalemInspection','modCalemTraining'] };
      
//Db and cache definition
CalemConf['registry_db']= {
	impl: 'CalemDb'
}

CalemConf['registry_cache']= {
	impl: 'CalemCache',
	//The stale configuration could be overwritten by metadata per data item.
	processDelay: 10,           //Should start immediately.
	staleMax: 120000           //default is 2 min 
}

//Rows to fetch for presentation
CalemConf['db_query'] = {
	fetchCount: 40,
	maxFetchCount: 5000,
	db_recList_impl: 'CalemRecordListDbCache'
}

CalemConf['widget_scrollbar']= {
	scrollSliderMinHeight: 16,
	width: 16,
	browserRightMargin: 22,
	holdTime: 500,
	moveDelay: 100,
	dataScrollDelay:300
}

CalemConf['text_formatter'] = {
	time_compare_secs: false,
	date: {
		read: ['EEE, ', I18nMsg['formatDateShort']].join(''), 
		edit: I18nMsg['formatDateShort'],
		server: 'yyyy-MM-dd'
	},
	time: {
		read: I18nMsg['formatTimeShort'],
		edit: I18nMsg['formatTimeShort'],
		server: 'HH:mm:ss',
		parse: {ampm_reqd: false, pmMax: 7}
	},
	datetime: {
		read: ['EEE, ', I18nMsg['formatDateShort'], ' ', I18nMsg['formatTimeShort']].join(''),
		server: 'yyyy-MM-dd HH:mm:ss'
	},
	number: {
		local: I18nMsg['formatNumber'], 
		server: '####0.#####'
	},
	integer: {
		local: I18nMsg['formatNumberInteger'], 
		server: '####'
	},
	sys_currency: { read: '#,##0.00;(#,##0.00)',
	                edit: '#,##0.00'},
	percent: '#,##0.###%', // Allow decimal points - I18nMsg['formatNumberPercent'],
	datePrompt: '', //'({1})', //({0}, {1}) where {0} is the format expr., {1} is a sample.
	timePrompt: '' //'({1})'	
}

CalemConf['db_recordList'] = {
	useBatchLoad: false,
	batchCount: 200,
	loadDelay:  30,
	sortDelay:  10,
	sortCaseSensitive: false	
}

/**
 * List view width defaults
 */
CalemConf['view_datagrid_width'] = {
	'boolean': 80,
	'int': 100,
	'double': 100,
	'sys_currency': 100,
	'currency': 100,
	'date': 110,
	'time': 110,
	'datetime': 160,
	'text': 160,
	'varchar' : 100,
	'guid' : 100,
	'default': 100
}

/**
 * List view width defaults
 */
CalemConf['view_record_size'] = {
	edit: {
		'int': 15,
		'double': 15,
		'percent': 15,
		'sys_currency': 15,
		'currency': 15,
		'date': 10,
		'time': 11,
		'datetime': 25,
		'guid': 36,
		'default': 15
	},
	edit_varchar_display_max: {
		'password': 16,
		'varchar': -1,
		'text': -1
	},
	read: {
		'int': 15,
		'double': 15,
		'percent': 15,
		'sys_currency': 15,
		'currency': 15,
		'date': 20,
		'time': 20,
		'datetime': 40,
		'guid': 36,
		'default': 20
	}
}

/**
 * Calendar configuration
 */
CalemConf['calendar_lookup'] = {
	firstDayOfWeek: DwtCalendar.SUN,
	workingDaysArray: DwtCalendar._DEF_WORKING_DAYS,
	calSize: {x: 250, y: 170},
	calOff: {x: 0, y: 4},
	containerExtra: {x: 2, y: 2}
}

/**
 * Dialog prompt text display
 */
CalemConf['dialog_text_wrap'] = {
	len: 55,
	eol: '<br>'	
}

/**
 * Data change conf
 */
CalemConf['form_data_change'] = {
	atPos: CalemConst.NEW_AT_TOP, //0 top, 1 bottom 
	deletePrompt: CalemConst.DELETE_PROMPT
}

/**
 * Default currency
 */
CalemConf['default_currency'] = {
	id: 'USD'
}

/**
 * Some dropdown constants
 */
CalemConf['dropdowns'] = {
	admin_type: {admin_none: 'admin_none', admin_group: 'admin_group', admin_system: 'admin_system'}
}

/**
 * dow resource list
 */
CalemConf['edit_schedule'] = {
	'dow_short': ['dow_short_sun', 'dow_short_mon', 'dow_short_tue', 'dow_short_wed', 'dow_short_thu',
                          'dow_short_fri', 'dow_short_sat'],
	'week_no'  : ['schedule_w1', 'schedule_w2', 'schedule_w3', 'schedule_w4', 'schedule_wl'],
	'defaultSelection'  : 'months',
	'defaultReadSize': 50
}
                          
/**
 * List view
 */
CalemConf['widget_listview'] = {
	ieWidthPadding: 4
}
             
CalemConf['report_window_conf'] = "width=1050,height=800,scrollbars=1,screenX=50,screenY=50,titlebar=1,menubar=1,toolbar=1,resizable=1";

/**
 * Key map
 */
CalemConf['desktop_keymap'] = {
	'c' : {cmd: 'CalemCmdCustomize', note: 'key_customize'}
};