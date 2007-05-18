<?php
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
 * This defines all the JS files used. The order reflects the object dependency and
 * must be maintained.
 */
$_CALEM_scripts=array(
	'Calem.js'=>array(
   	'path'=>'client',
   	'files'=>array(
			
			//<!-- configuration -->
			'/conf/CalemConf.js',
			'/conf/CalemConfCustom.js',
			//<!-- currency -->
			'/conf/data/CalemCurrency.js',
			
			//<!-- util -->
			'/common/util/CalemDebug.js',
			'/common/util/CalemConfUtil.js',
			'/common/util/CalemMsgExt.js',
         '/common/util/CalemTextUtil.js',
			'/common/util/CalemJson.js',
			'/common/util/WebToolkitBase64.js',
			//Other utils
			'/common/form/model/CalemDropdownUtil.js',
			'/common/form/model/widget/CalemCustomInfoManager.js',
			'/common/form/view/CalemViewUtil.js',
			'/common/form/widget/CalemWidgetUtil.js',
			
			//<!-- common -->
			'/common/CalemContext.js',
			
			//Dialogs
			'/common/form/widget/dialog/CalemQuestionDialog.js',
			'/common/form/widget/dialog/CalemInfoDialog.js',
			
			//Soap
			'/common/soap/CalemSoapResponse.js',
			'/common/soap/CalemSoapClient.js',
			//Error info
			'/common/form/model/errorinfo/CalemErrorInfo.js',
			//SoapUtil
			'/common/soap/CalemSoapUtil.js',
			//Model
			'/common/form/model/event/CalemEvent.js',
			'/common/form/model/event/CalemSelectionEvent.js',
			'/common/form/model/event/CalemCacheChangeEvent.js',
			'/common/form/model/event/CalemDataChangeEvent.js',
			'/common/form/model/event/CalemDataValidEvent.js',
			'/common/form/model/event/CalemRecordPosEvent.js',
			'/common/form/model/event/CalemRecMoveEvent.js',
			'/common/form/model/event/CalemRecChangeEvent.js',
			'/common/form/model/event/CalemRecEditEvent.js',
			'/common/form/model/event/CalemSearchEditEvent.js',
			'/common/form/model/event/CalemParentRecModifiedEvent.js',
			
			//Base model class
			'/common/form/model/CalemModel.js',
            //Widgets
			'/common/form/model/widget/CalemDataGridInfo.js',
			'/common/form/model/widget/CalemModuleInfo.js',
			'/common/form/model/widget/CalemViewInfo.js',
			'/common/form/model/widget/CalemViewCustomInfo.js',
			'/common/form/model/widget/CalemFormInfo.js',
			'/common/form/model/widget/CalemFormCustomInfo.js',
			'/common/form/model/widget/CalemEmbedInfo.js',
			'/common/form/model/widget/CalemSearchInfo.js',
			'/common/form/model/widget/CalemModuleCustomInfo.js',
			'/common/form/model/widget/CalemScheduleInfo.js',
         
			//Database-query
			'/common/form/model/database/query/CalemDbExpr.js',
			'/common/form/model/database/query/CalemTableQuery.js',
			'/common/form/model/database/query/CalemDbQuery.js',
			//DataModel
			'/common/form/model/datamodel/CalemRecord.js',
			'/common/form/model/datamodel/CalemRecordList.js',
			'/common/form/model/datamodel/CalemRecordListDbCache.js',
			'/common/form/model/datamodel/CalemDataModelItem.js',
			'/common/form/model/datamodel/CalemDataModelItemCached.js',
			'/common/form/model/datamodel/CalemDataModelItemDb.js',
			'/common/form/model/datamodel/CalemDataModel.js',
			//form model
			'/common/form/model/formmodel/CalemFormModel.js',
			//Database
			'/common/form/model/database/CalemDb.js',
			'/common/form/model/database/CalemTableDd.js',
			'/common/form/model/database/CalemTableDdView.js',
			'/common/form/model/database/CalemCachedItem.js',
         '/common/form/model/database/CalemCache.js',			
			
			//Registry
			'/common/form/model/CalemRegistry.js',
			
			/**
			 * UI components
			 */
			'/common/form/CalemUiDef.js',
			
			// Widgets extension
			'/common/form/widget/CalemWidget.js',
			'/common/form/widget/CalemListView.js',
			'/common/form/widget/CalemFormTabView.js',
			'/common/form/widget/CalemScrollBar.js',
			'/common/form/widget/CalemFieldLabel.js',
			'/common/form/widget/CalemButton.js',
			'/common/form/widget/CalemTabView.js',
			//toolbar
			'/common/form/widget/toolbar/CalemTbButton.js',
			'/common/form/widget/toolbar/CalemToolBar.js',
			'/common/form/widget/toolbar/CalemToolBarModule.js',
			//Editing controls
			'/common/form/widget/edit/CalemInputField.js',
			'/common/form/widget/edit/CalemEditText.js',
			'/common/form/widget/edit/CalemDateLookup.js',
			'/common/form/widget/edit/CalemEditDate.js',

			//AC
			'/common/form/widget/edit/ac/CalemInputAc.js',
			'/common/form/widget/edit/ac/CalemAcCached.js',
			'/common/form/widget/edit/ac/CalemAcDb.js',
			
			'/common/form/widget/edit/CalemEditLookup.js',
			'/common/form/widget/edit/CalemEditDropdown.js',
			'/common/form/widget/edit/CalemEditTime.js',
			'/common/form/widget/edit/CalemEditBoolean.js',
			'/common/form/widget/edit/CalemEditMultiSelect.js',
			'/common/form/widget/edit/CalemEditPassword.js',
			'/common/form/widget/edit/CalemEditSchedule.js',
			//Read
			'/common/form/widget/read/CalemReadText.js',
			'/common/form/widget/read/CalemReadDefault.js',
			'/common/form/widget/read/CalemReadBoolean.js',
			//Design
			//Read
			'/common/form/widget/design/CalemLabelDesign.js',
			'/common/form/widget/design/CalemFieldDesign.js',
			'/common/form/widget/design/CalemTextDesign.js',
			'/common/form/widget/design/CalemFieldLabelDesign.js',
			'/common/form/widget/design/CalemRowDesign.js',
			'/common/form/widget/design/CalemColDesign.js',
			'/common/form/widget/design/CalemTbButtonDesign.js',
			'/common/form/widget/design/CalemToolBarDesign.js',
			//Tree
			//Record
			'/common/form/widget/design/tree/CalemDesignTreeItem.js',
			'/common/form/widget/design/tree/CalemDesignTreeRow.js',
			'/common/form/widget/design/tree/CalemDesignTreeLabel.js',
			'/common/form/widget/design/tree/CalemDesignTreeFieldLabel.js',
			'/common/form/widget/design/tree/CalemDesignTreeField.js',
			'/common/form/widget/design/tree/CalemDesignTreeButton.js',	
         //Grid design  
         '/common/form/widget/design/tree/list/CalemLayoutTreeGridField.js',
         '/common/form/widget/design/tree/list/CalemLayoutTreeGridTable.js',
         
			//Root nodes
			'/common/form/widget/design/tree/CalemDesignTreeToolBar.js',
			'/common/form/widget/design/tree/CalemDesignTreeTable.js',
			'/common/form/widget/design/tree/CalemDesignTreeLabelRoot.js',
			'/common/form/widget/design/tree/CalemDesignTreeFormRecord.js',
			
			'/common/form/widget/design/tree/list/CalemLayoutTreeGridRoot.js',
         '/common/form/widget/design/tree/list/CalemDesignTreeFormList.js',
         
         //mdtab
         '/common/form/widget/design/tree/mdtab/CalemDesignTreeForm.js',
         '/common/form/widget/design/tree/mdtab/CalemDesignTreeTab.js',
         '/common/form/widget/design/tree/mdtab/CalemDesignTreeTabCustomize.js',
         '/common/form/widget/design/tree/mdtab/CalemDesignTreeFormMdTab.js',
         '/common/form/widget/design/tree/mdtab/CalemDesignTreeFormRoot.js',
         '/common/form/widget/design/tree/mdtab/CalemDesignTreeTabRoot.js',
         
         '/common/form/widget/design/tree/mdtab/CalemLayoutTreeForm.js',
         '/common/form/widget/design/tree/mdtab/CalemLayoutTreeFormFixed.js',
         '/common/form/widget/design/tree/mdtab/CalemLayoutTreeFormMdTab.js',
         '/common/form/widget/design/tree/mdtab/CalemLayoutTreeTab.js',
         '/common/form/widget/design/tree/mdtab/CalemLayoutTreeTabFixed.js',
         '/common/form/widget/design/tree/mdtab/CalemLayoutTreeTabCustomize.js',
                   
         //base, record, list, mdtab design tree
			'/common/form/widget/design/tree/CalemViewDesignTree.js',
         '/common/form/widget/design/tree/CalemLabelLayoutTree.js',
         '/common/form/widget/design/tree/CalemRecordDesignTree.js',
         
         //List
			'/common/form/widget/design/tree/list/CalemGridLayoutTree.js',
			'/common/form/widget/design/tree/list/CalemListDesignTree.js',
			//MdTab design tree
			'/common/form/widget/design/tree/mdtab/CalemMdTabDesignTree.js',			
			'/common/form/widget/design/tree/mdtab/CalemMdTabLayoutTree.js',
			
			//Search
			'/common/form/widget/search/CalemSearchSelect.js',
			'/common/form/widget/search/CalemSearchSave.js',
			
			//View
			'/common/form/view/CalemUiRender.js',
			//View Holder
			'/common/form/view/CalemViewPage.js',
			'/common/form/view/CalemViewPanel.js',
			'/common/form/view/mdtab/CalemViewPageMd.js',
			'/common/form/view/mdtab/CalemViewPageMdCustomize.js',
			//View types
			'/common/form/view/CalemView.js',
			'/common/form/view/CalemViewRender.js', 
			'/common/form/view/CalemViewRuntimeRender.js', 
			//Specific renders
			'/common/form/view/CalemToolBarRender.js',
			'/common/form/view/CalemDataGridRender.js',
			'/common/form/view/CalemLabelRender.js',
			'/common/form/view/CalemHSeparatorRender.js',
			'/common/form/view/CalemFieldRender.js',
			'/common/form/view/CalemFieldLabelRender.js',
			'/common/form/view/CalemFormErrorRender.js',
         //edit
         '/common/form/view/edit/CalemViewEditRender.js',
         '/common/form/view/edit/CalemEditRenderFacade.js',
         '/common/form/view/edit/CalemEditRender.js',
         '/common/form/view/edit/CalemEditStringRender.js',
         '/common/form/view/edit/CalemEditDateRender.js',
         '/common/form/view/edit/CalemEditTimeRender.js',
         '/common/form/view/edit/CalemEditDateTimeRender.js',
         '/common/form/view/edit/CalemEditTextRender.js',
         '/common/form/view/edit/CalemEditLookupRender.js',
         '/common/form/view/edit/CalemEditNumberRender.js',
         '/common/form/view/edit/CalemEditPercentRender.js',
         '/common/form/view/edit/CalemEditIntegerRender.js',
         '/common/form/view/edit/CalemEditSysCurrencyRender.js',
         '/common/form/view/edit/CalemEditDropdownJoinRender.js',
         '/common/form/view/edit/CalemEditBooleanRender.js',
         '/common/form/view/edit/CalemEditPasswordRender.js',
         '/common/form/view/edit/CalemEditScheduleRender.js',
         //list
         '/common/form/view/list/CalemViewListRender.js',
         //read
         '/common/form/view/read/CalemViewReadRender.js',
         '/common/form/view/read/CalemFieldReadRender.js',
         '/common/form/view/read/CalemReadTextRender.js',
         '/common/form/view/read/CalemReadDefaultRender.js',
         '/common/form/view/read/CalemReadLookupRender.js',
         '/common/form/view/read/CalemReadBooleanRender.js',
         '/common/form/view/read/CalemReadScheduleRender.js',
         
         //mdtab
         '/common/form/view/mdtab/CalemViewMd.js',
			'/common/form/view/mdtab/CalemViewMdTab.js', 
			'/common/form/view/mdtab/CalemViewTabRender.js',
			'/common/form/view/mdtab/CalemViewMdRender.js', 
			'/common/form/view/mdtab/CalemViewMdTabRender.js',
			
         //Design
         '/common/form/view/design/CalemUiDesignRender.js',
         '/common/form/view/design/CalemGridDesignRenderFacade.js',
         '/common/form/view/design/CalemFieldDesignRender.js',
         '/common/form/view/design/CalemFieldLabelDesignRender.js',
         '/common/form/view/design/CalemFormErrorDesignRender.js',
         '/common/form/view/design/CalemLabelDesignRender.js',
         '/common/form/view/design/CalemTextDesignRender.js',
         '/common/form/view/design/CalemDesignSaveSelectRender.js',
         //search
         '/common/form/view/design/CalemSearchSaveDesignRender.js',
         
         '/common/form/view/design/toolbar/CalemTbDesignSeparatorRender.js',
         '/common/form/view/design/toolbar/CalemTbDesignButtonRender.js',
         '/common/form/view/design/toolbar/CalemToolBarDesignRender.js',
         
   		//View design render
         '/common/form/view/design/CalemViewDesignRender.js',
         
         //Record form
         '/common/form/view/design/record/CalemRecordDesignRowRender.js',
         '/common/form/view/design/record/CalemRecordDesignColRender.js',
         '/common/form/view/design/record/CalemRecordDesignTreeRender.js',
         '/common/form/view/design/record/CalemViewRecordDesignRender.js',
         
         //List form
         '/common/form/view/design/list/CalemGridDesignRender.js',
         '/common/form/view/design/list/CalemGridTreeDesignRender.js',
         '/common/form/view/design/list/CalemListDesignTreeRender.js',
         '/common/form/view/design/list/CalemViewListDesignRender.js',
         
         //mdtab
         '/common/form/view/design/mdtab/CalemMdTabDesignTreeRender.js',
         '/common/form/view/design/mdtab/CalemMdTabLayoutTreeRender.js',
         '/common/form/view/design/mdtab/CalemViewMdTabDesignRender.js',
         
         //search control renders
         '/common/form/view/search/CalemSearchSelectRender.js',
         '/common/form/view/search/CalemSearchSaveRender.js',
         '/common/form/view/search/CalemSearchFieldRenderFacade.js',
         '/common/form/view/search/CalemSearchFieldRender.js',
         '/common/form/view/search/CalemSearchStringRender.js',
         '/common/form/view/search/CalemSearchTextRender.js',
         '/common/form/view/search/CalemSearchDropdownJoinRender.js',
         '/common/form/view/search/CalemSearchLookupRender.js',
         '/common/form/view/search/CalemSearchBooleanRender.js',
         '/common/form/view/search/CalemSearchDateTimeRender.js',
         '/common/form/view/search/CalemSearchIntegerRender.js',
         '/common/form/view/search/CalemSearchNumberRender.js',
         '/common/form/view/search/CalemSearchPercentRender.js',
         '/common/form/view/search/CalemSearchScheduleRender.js',
         '/common/form/view/search/CalemSearchDateRender.js',
                  
         //search view renders
         '/common/form/view/search/CalemViewSearchSelectRender.js',
         '/common/form/view/search/CalemViewSearchEditRender.js',

			// End UI components
			
			//Key cmd
			'/common/form/controller/keycmd/CalemCmdCustomize.js',
			'/common/form/controller/keycmd/CalemKeyHandler.js',
			
			//Actions
			'/common/form/controller/action/CalemFormAction.js',
			//Controllers
			'/common/form/controller/CalemController.js',
			'/common/form/controller/CalemUiController.js',
			'/common/form/controller/CalemDataGrid.js',
			'/common/form/controller/CalemForm.js',
			'/common/form/controller/CalemFormList.js',
			'/common/form/controller/CalemFormListDet.js',
			'/common/form/controller/CalemFormListDetNoMd.js',
			'/common/form/controller/CalemFormNew.js',
			'/common/form/controller/CalemFormNewCacheLoad.js',
			'/common/form/controller/CalemFormEdit.js',
			'/common/form/controller/CalemFormEditDet.js',
			'/common/form/controller/CalemFormRead.js',
			'/common/form/controller/CalemFormReadDet.js',
			'/common/form/controller/CalemFormMdTab.js',
			'/common/form/controller/CalemFormLookup.js',
			'/common/form/controller/CalemFormLookupNoMd.js',
			'/common/desktop/main/CalemMainController.js',	
			//Report
			'/common/form/controller/CalemReportListDet.js',
			'/common/form/controller/CalemReportList.js',
			'/common/form/controller/CalemReportRead.js',
			'/common/form/controller/CalemReportMdTab.js',
			
			
			//Design
			'/common/form/controller/design/CalemFormDesign.js',	
			'/common/form/controller/design/CalemFormRecordDesign.js',
			'/common/form/controller/design/CalemFormListDesign.js',
			'/common/form/controller/design/CalemFormMdTabDesign.js',
			
			//Search
			'/common/form/controller/search/CalemFormSearch.js',	
			'/common/form/controller/search/CalemFormSearchSelect.js',
			'/common/form/controller/search/CalemFormSearchEdit.js',
			
			//desktop		
			'/common/desktop/topbar/CalemLogo.js',
			'/common/desktop/topbar/CalemExitToolBarController.js',
			'/common/desktop/topbar/CalemModuleController.js',
			
			'/common/desktop/leftbar/CalemModMenu.js',
			'/common/desktop/leftbar/CalemModBarView.js',
			'/common/desktop/leftbar/CalemModSumView.js',
			'/common/desktop/leftbar/CalemModView.js',
			
			 //Login
			'/modules/admin/CalemLogin.js',
			 //Main entry
			'/common/CalemDesktop.js',
			         
			/**
			 * Common Module definition
			 */
			 //BO util
			'/common/util/CalemBoUtil.js',
			 
			 //Modules file list - each in module def file.
			)
		)
);

?>
