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
   'Ajax.js'=>array(
   	'path'=>'client/ajax',
   	'files'=>array(
		'/core/AjxCore.js',
		'/core/AjxEnv.js',
		'/util/AjxUtil.js',
		'/util/AjxText.js',
		'/core/AjxException.js',
		'/util/AjxCookie.js',
		'/soap/AjxSoapException.js',
		'/soap/AjxSoapFault.js',
		'/soap/AjxSoapDoc.js',
		'/net/AjxRpcRequest.js',
		'/net/AjxRpc.js',
		'/util/AjxWindowOpener.js',
		'/util/AjxVector.js',
		'/util/AjxStringUtil.js',
		'/debug/AjxDebug.js',
		'/debug/AjxDebugXmlDocument.js',
		'/xml/AjxXmlDoc.js',
		// '/config/data/AjxConfig.js',
		'/core/AjxEnv.js',
		'/core/AjxImg.js',
		'/core/AjxException.js',
		'/util/AjxCallback.js',
		'/util/AjxTimedAction.js',
		'/events/AjxEvent.js',
		'/events/AjxEventMgr.js',
		'/events/AjxListener.js',
		'/util/AjxDateUtil.js',
		'/util/AjxTimezone.js',
		'/util/AjxStringUtil.js',
		'/util/AjxSelectionManager.js',
		'/net/AjxPost.js',
		'/util/AjxBuffer.js',
		'/util/AjxCache.js',
		'/util/AjxMD5.js',
		
		// <!-- DWT classes -->
		'/dwt/core/DwtImg.js',
		
		'/dwt/core/Dwt.js',
		'/dwt/core/DwtException.js',
		'/dwt/core/DwtDraggable.js',
		
		'/dwt/graphics/DwtCssStyle.js',
		'/dwt/graphics/DwtPoint.js',
		'/dwt/graphics/DwtRectangle.js',
		'/dwt/graphics/DwtUnits.js',
		
		'/dwt/events/DwtEvent.js',
		'/dwt/events/DwtEventManager.js',
		'/dwt/events/DwtDateRangeEvent.js',
		'/dwt/events/DwtDisposeEvent.js',
		'/dwt/events/DwtUiEvent.js',
		'/dwt/events/DwtControlEvent.js',
		'/dwt/events/DwtKeyEvent.js',
		'/dwt/events/DwtMouseEvent.js',
		'/dwt/events/DwtMouseEventCapture.js',
		'/dwt/events/DwtListViewActionEvent.js',
		'/dwt/events/DwtSelectionEvent.js',
		'/dwt/events/DwtHtmlEditorStateEvent.js',
		'/dwt/events/DwtTreeEvent.js',
		'/dwt/events/DwtHoverEvent.js',
		
		'/dwt/dnd/DwtDragEvent.js',
		'/dwt/dnd/DwtDragSource.js',
		'/dwt/dnd/DwtDropEvent.js',
		'/dwt/dnd/DwtDropTarget.js',
		
		'/dwt/widgets/DwtHoverMgr.js',
		
		'/dwt/widgets/DwtControl.js',
		'/dwt/widgets/DwtComposite.js',
		'/dwt/widgets/DwtShell.js',
		'/dwt/widgets/DwtColorPicker.js',
		'/dwt/widgets/DwtBaseDialog.js',
		'/dwt/widgets/DwtDialog.js',
		'/dwt/widgets/DwtLabel.js',
		'/dwt/widgets/DwtListView.js',
		'/dwt/widgets/DwtButton.js',
		'/dwt/widgets/DwtMenuItem.js',
		'/dwt/widgets/DwtMenu.js',
		'/dwt/widgets/DwtMessageDialog.js',
		'/dwt/widgets/DwtHtmlEditor.js',
		'/dwt/widgets/DwtInputField.js',
		'/dwt/widgets/DwtSash.js',
		'/dwt/widgets/DwtToolBar.js',
		'/dwt/graphics/DwtBorder.js',
		'/dwt/widgets/DwtToolTip.js',
		'/dwt/widgets/DwtStickyToolTip.js',
		'/dwt/widgets/DwtTreeItem.js',
		'/dwt/widgets/DwtTree.js',
		'/dwt/widgets/DwtCalendar.js',
		'/dwt/widgets/DwtPropertyPage.js',
		'/dwt/widgets/DwtTabView.js',
		'/dwt/widgets/DwtWizardDialog.js',
		'/dwt/widgets/DwtSelect.js',
		'/dwt/widgets/DwtAddRemove.js',
		'/dwt/widgets/DwtAlert.js',
		'/dwt/widgets/DwtText.js',
		'/dwt/widgets/DwtIframe.js',
		// '/dwt/widgets/DwtXFormDialog.js',
		'/dwt/widgets/DwtPropertySheet.js',
		'/dwt/widgets/DwtGrouper.js',
		'/dwt/widgets/DwtProgressBar.js',
		
		'/dwt/events/DwtXFormsEvent.js',
		'/dwt/xforms/XFormGlobal.js',
		'/dwt/xforms/XModel.js',
		'/dwt/xforms/XModelItem.js',
		'/dwt/xforms/XForm.js',
		'/dwt/xforms/XFormItem.js',
		'/dwt/xforms/XFormChoices.js',
		'/dwt/xforms/OSelect_XFormItem.js',
		'/dwt/xforms/ButtonGrid.js',
		),
	)
);
?>
