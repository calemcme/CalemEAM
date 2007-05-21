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
 

$_CALEM_scripts=array(
	'Calem.js'=>array(
   	'path'=>'client',
   	'files'=>array(
			
			//IN CONF
			'/modules/inventory/CalemInConf.js',
			
			//IN Form action
			'/modules/inventory/form/controller/action/CalemInFormAction.js',
			
			 // BO
			'/modules/inventory/bo/CalemInBo.js',
			'/modules/inventory/bo/CalemInTypeBo.js',
			'/modules/inventory/bo/CalemUomBo.js',
			'/modules/inventory/bo/CalemInErrorInfo.js',
			'/modules/inventory/bo/CalemInLocationBo.js',
			'/modules/inventory/bo/CalemInTranBo.js',
			
			 //Menu
         '/modules/inventory/form/CalemInMenuDef.js',
         
          //Widgets - model
			'/modules/inventory/form/model/CalemInCheckoutToInfo.js',
			'/modules/inventory/form/model/CalemEditInCheckoutToInfo.js',
			
          //Widget - inCheckoutTo
			'/modules/inventory/form/widget/edit/CalemEditInCheckoutTo.js',
			
			//Widget renders
			'/modules/inventory/form/view/edit/CalemEditInCheckoutToRender.js',
			 
         //inventory views
         '/modules/inventory/form/view/CalemInViewListDef.js',
         '/modules/inventory/form/view/CalemInToolViewLookupDef.js',
         '/modules/inventory/form/view/CalemInPartViewLookupDef.js',
         '/modules/inventory/form/view/CalemInViewLookupDef.js',
         '/modules/inventory/form/view/CalemInViewNewDef.js',
         '/modules/inventory/form/view/CalemInViewReadDef.js',
         '/modules/inventory/form/view/CalemInViewEditDef.js',
         '/modules/inventory/form/view/CalemInViewSearchDef.js',
         //Order list form
         '/modules/inventory/form/view/CalemInOrderViewListDef.js',
         '/modules/inventory/form/view/CalemInOrderViewReadDef.js',
         //Generate req form
         '/modules/inventory/form/view/CalemInGenOrderViewNewDef.js',
         
         //Stock
         '/modules/inventory/form/view/CalemInStockViewListDef.js',
         '/modules/inventory/form/view/CalemInStockViewNewDef.js',
         '/modules/inventory/form/view/CalemInStockViewReadDef.js',
         //Reserved
         '/modules/inventory/form/view/CalemInReservedViewListDef.js',
         //Comment
         '/modules/inventory/form/view/CalemInCommentViewListDef.js',
         '/modules/inventory/form/view/CalemInCommentViewNewDef.js',
         '/modules/inventory/form/view/CalemInCommentViewEditDef.js',
         '/modules/inventory/form/view/CalemInCommentViewReadDef.js',
         //Doc
         '/modules/inventory/form/view/CalemInDocViewListDef.js',
         '/modules/inventory/form/view/CalemInDocViewNewDef.js',
         '/modules/inventory/form/view/CalemInDocViewEditDef.js',
         '/modules/inventory/form/view/CalemInDocViewReadDef.js',
         //Audit
         '/modules/inventory/form/view/CalemInAuditViewListDef.js',
         '/modules/inventory/form/view/CalemInAuditViewNewDef.js',
         '/modules/inventory/form/view/CalemInAuditViewEditDef.js',
         '/modules/inventory/form/view/CalemInAuditViewReadDef.js',
         //Vendor
         '/modules/inventory/form/view/CalemInVendorViewListDef.js',
         '/modules/inventory/form/view/CalemInVendorViewNewDef.js',
         '/modules/inventory/form/view/CalemInVendorViewEditDef.js',
         '/modules/inventory/form/view/CalemInVendorViewReadDef.js',
         //Transaction
         '/modules/inventory/form/view/CalemInTranViewListDef.js',
         '/modules/inventory/form/view/CalemInTranViewReadDef.js',
         //Transaction worksheet
         '/modules/inventory/form/view/CalemInTranWorksheetViewListDef.js',
         
         //Uom
         '/modules/inventory/form/view/CalemUomViewListDef.js',
         '/modules/inventory/form/view/CalemUomViewLookupDef.js',
         '/modules/inventory/form/view/CalemUomViewNewDef.js',
         '/modules/inventory/form/view/CalemUomViewReadDef.js',
         '/modules/inventory/form/view/CalemUomViewEditDef.js',
         '/modules/inventory/form/view/CalemUomViewSearchDef.js',
         
         //Uom mapping
         '/modules/inventory/form/view/CalemUomMapViewListDef.js',
         '/modules/inventory/form/view/CalemUomMapViewNewDef.js',
         '/modules/inventory/form/view/CalemUomMapViewReadDef.js',
         '/modules/inventory/form/view/CalemUomMapViewEditDef.js',
         '/modules/inventory/form/view/CalemUomMapViewSearchDef.js',
         
         //inventory type
         '/modules/inventory/form/view/CalemInTypeViewListDef.js',
         '/modules/inventory/form/view/CalemInTypeViewLookupDef.js',
         '/modules/inventory/form/view/CalemInTypeViewNewDef.js',
         '/modules/inventory/form/view/CalemInTypeViewReadDef.js',
         '/modules/inventory/form/view/CalemInTypeViewEditDef.js',
         '/modules/inventory/form/view/CalemInTypeViewSearchDef.js',
         
         //stock location
         '/modules/inventory/form/view/CalemInLocationViewListDef.js',
         '/modules/inventory/form/view/CalemInLocationViewLookupDef.js',
         '/modules/inventory/form/view/CalemInLocationViewNewDef.js',
         '/modules/inventory/form/view/CalemInLocationViewReadDef.js',
         '/modules/inventory/form/view/CalemInLocationViewEditDef.js',
         '/modules/inventory/form/view/CalemInLocationViewSearchDef.js',
         
         //Transaction views
         '/modules/inventory/form/view/CalemInStockSelectViewListDef.js',
         '/modules/inventory/form/view/CalemInCheckoutQtyViewEditDef.js',
         
         '/modules/inventory/form/view/CalemInCheckoutLocViewEditDef.js',
         '/modules/inventory/form/view/CalemInReturnCheckoutToViewEditDef.js',
         '/modules/inventory/form/view/CalemInReturnViewListDef.js',
         '/modules/inventory/form/view/CalemInReturnPartViewEditDef.js',
         '/modules/inventory/form/view/CalemInReturnToolViewEditDef.js',
         
         '/modules/inventory/form/view/CalemInPhysicalViewEditDef.js',
         '/modules/inventory/form/view/CalemInMoveViewEditDef.js',
         '/modules/inventory/form/view/CalemInCheckinViewEditDef.js',
         
         '/modules/inventory/form/view/CalemInReceiveSelectViewEditDef.js',
         '/modules/inventory/form/view/CalemInReceivePoViewEditDef.js',
         '/modules/inventory/form/view/CalemInReceiveOtherViewEditDef.js',
         '/modules/inventory/form/view/CalemInReceiveStockViewListDef.js',
         '/modules/inventory/form/view/CalemInReceiveQtyViewEditDef.js',
         
          //Report def
		   '/modules/inventory/form/report/CalemInOrderReportListDef.js',
		   //Report item
		   '/modules/inventory/form/report/CalemInOrderReportList.js',

         //inventory forms
         '/modules/inventory/form/controller/CalemInFormList.js',
         '/modules/inventory/form/controller/CalemInFormMdTab.js',
         '/modules/inventory/form/controller/CalemInFormRead.js',
         '/modules/inventory/form/controller/CalemInFormNew.js',
         '/modules/inventory/form/controller/CalemInFormEdit.js',
         '/modules/inventory/form/controller/CalemInToolFormLookup.js',
         '/modules/inventory/form/controller/CalemInPartFormLookup.js',
         '/modules/inventory/form/controller/CalemInFormLookup.js',
         
         //Order list form
         '/modules/inventory/form/controller/CalemInOrderFormList.js',
         '/modules/inventory/form/controller/CalemInOrderFormRead.js',
         //Generate req form
         '/modules/inventory/form/controller/CalemInGenOrderFormNew.js',
         
         //Stock
         '/modules/inventory/form/controller/CalemInStockFormList.js',
         '/modules/inventory/form/controller/CalemInStockFormNew.js',
         '/modules/inventory/form/controller/CalemInStockFormRead.js',
         //Reserved
         '/modules/inventory/form/controller/CalemInReservedFormList.js',
         //Doc
         '/modules/inventory/form/controller/CalemInDocFormList.js',
         '/modules/inventory/form/controller/CalemInDocFormNew.js',
         '/modules/inventory/form/controller/CalemInDocFormEdit.js',
         '/modules/inventory/form/controller/CalemInDocFormRead.js',
         //Comment
         '/modules/inventory/form/controller/CalemInCommentFormList.js',
         '/modules/inventory/form/controller/CalemInCommentFormNew.js',
         '/modules/inventory/form/controller/CalemInCommentFormEdit.js',
         '/modules/inventory/form/controller/CalemInCommentFormRead.js',
         //Vendor
         '/modules/inventory/form/controller/CalemInVendorFormList.js',
         '/modules/inventory/form/controller/CalemInVendorFormNew.js',
         '/modules/inventory/form/controller/CalemInVendorFormEdit.js',
         '/modules/inventory/form/controller/CalemInVendorFormRead.js',
         //Audit
         '/modules/inventory/form/controller/CalemInAuditFormList.js',
         '/modules/inventory/form/controller/CalemInAuditFormNew.js',
         '/modules/inventory/form/controller/CalemInAuditFormEdit.js',
         '/modules/inventory/form/controller/CalemInAuditFormRead.js',
         //Tran
         '/modules/inventory/form/controller/CalemInTranFormList.js',
         '/modules/inventory/form/controller/CalemInTranFormRead.js',
         //Tran worksheet
         '/modules/inventory/form/controller/CalemInTranWorksheetFormList.js',
         
         //in_type forms
         '/modules/inventory/form/controller/CalemInTypeFormList.js',
         '/modules/inventory/form/controller/CalemInTypeFormRead.js',
         '/modules/inventory/form/controller/CalemInTypeFormNew.js',
         '/modules/inventory/form/controller/CalemInTypeFormEdit.js',
         '/modules/inventory/form/controller/CalemInTypeFormLookup.js',
         
         //Uom forms
         '/modules/inventory/form/controller/CalemUomFormList.js',
         '/modules/inventory/form/controller/CalemUomFormRead.js',
         '/modules/inventory/form/controller/CalemUomFormNew.js',
         '/modules/inventory/form/controller/CalemUomFormEdit.js',
         '/modules/inventory/form/controller/CalemUomFormLookup.js',
         
         //Uom Map forms
         '/modules/inventory/form/controller/CalemUomMapFormList.js',
         '/modules/inventory/form/controller/CalemUomMapFormRead.js',
         '/modules/inventory/form/controller/CalemUomMapFormNew.js',
         '/modules/inventory/form/controller/CalemUomMapFormEdit.js',
         
         //Stock location forms
         '/modules/inventory/form/controller/CalemInLocationFormList.js',
         '/modules/inventory/form/controller/CalemInLocationFormRead.js',
         '/modules/inventory/form/controller/CalemInLocationFormNew.js',
         '/modules/inventory/form/controller/CalemInLocationFormEdit.js',
         '/modules/inventory/form/controller/CalemInLocationFormLookup.js',
         
         //Transaction forms
         '/modules/inventory/form/controller/CalemInTranQtyFormEdit.js',
         '/modules/inventory/form/controller/CalemInStockSelectFormList.js',
         '/modules/inventory/form/controller/CalemInCheckoutQtyFormEdit.js',
         
         '/modules/inventory/form/controller/CalemInCheckoutLocFormEdit.js',
         '/modules/inventory/form/controller/CalemInReturnCheckoutToFormEdit.js',
         '/modules/inventory/form/controller/CalemInReturnFormList.js',
         '/modules/inventory/form/controller/CalemInReturnPartFormEdit.js',
         '/modules/inventory/form/controller/CalemInReturnToolFormEdit.js',
         
         '/modules/inventory/form/controller/CalemInPhysicalFormEdit.js',
         '/modules/inventory/form/controller/CalemInMoveFormEdit.js',
         '/modules/inventory/form/controller/CalemInCheckinFormEdit.js',
         
         '/modules/inventory/form/controller/CalemInReceiveSelectFormEdit.js',
         '/modules/inventory/form/controller/CalemInReceivePoFormEdit.js',
         '/modules/inventory/form/controller/CalemInReceiveOtherFormEdit.js',
         '/modules/inventory/form/controller/CalemInReceiveStockFormList.js',
         '/modules/inventory/form/controller/CalemInReceiveQtyFormEdit.js',
			
         //IN module
			'/modules/inventory/form/CalemInItemDef.js',
			'/modules/inventory/form/CalemInModuleDef.js',
			
			)
		)
);

?>