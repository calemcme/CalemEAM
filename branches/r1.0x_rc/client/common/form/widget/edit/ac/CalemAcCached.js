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
 * CalemAcCached
 * Auto-completion
 */
function CalemAcCached(fld, lkupFld, lkupDd, controller, lkupEditFld) {
	if (arguments.length==0) return;
	CalemInputAc.call(this, fld, lkupFld, lkupDd, controller, lkupEditFld);
}

CalemAcCached.prototype = new CalemInputAc;
CalemAcCached.prototype.constructor = CalemAcCached;

CalemAcCached.prototype.toString = function() {return "CalemAcCached";}

//Loading data
CalemAcCached.prototype.loadDataOnDemand =
function(kc) {
	if (!this._collection) {//Data not loaded here yet.
		var recList=this._controller.loadCachedRecList(this._lkupDd.getTableName());
		this._collection=new CalemAcCollection(recList);
	}
	this.onKeyPressAfterDataLoaded(kc);
}

CalemAcCached.prototype.runMatchingLogic =
function(userInput, standalone) {
	var userInput = this.simplify(userInput);
	/** used a new matching algorithm for cached list
	var uifc = userInput.charAt(0).toLowerCase();
	if (uifc == '"') uifc = (n = userInput.charAt(1)) ? n.toLowerCase() : "z";
	if (standalone) userInput = uifc;
	*/
	if (this._siw) this._siw.matchCollection = new Array();
	var cached = this._collection.getCachedList(userInput);
	/** Moved to collection
	if (this._siw && this._siw.revisedCollection && (this._siw.revisedCollection.length > 0) && this._siw.lastUserInput && (userInput.indexOf(this._siw.lastUserInput) == 0)) {
		pointerToCollectionToUse = this._siw.revisedCollection;
	} else if (this.collectionIndex[userInput] && (this.collectionIndex[userInput].length > 0)) {
		pointerToCollectionToUse = this.collectionIndex[userInput];
	} else if (this.collectionIndex[uifc] && (this.collectionIndex[uifc].length > 0)) {
		pointerToCollectionToUse = this.collectionIndex[uifc];
	} else if (this._siw && (userInput.length == 1) && (!this.collectionIndex[uifc])) {
		this._siw.buildIndex = true;
	} else if (siw) {
		this._siw.buildIndex = false;
	}
	**/
	var cList=cached.clist;
	var re = new RegExp("(" + userInput + ")","i");
	if (cached.fullMatch) { //So we're done, let's get info for display.
		if (cList) {
			for (var i=0; (i< cList.length && i < this._siw.MAX_MATCHES); i++) {
				var rec=cList[i];			
				var entry=rec.getField(this._lkupFld).getRawValue();
				this._siw.matchCollection[i] = new smartInputMatch(entry, entry.replace(re,"<b>$1</b>"), rec.id); //mEntry.replace(/\>/gi,'}').replace(/\< ?/gi,'{').replace(re,"<b>$1</b>"), rec.id);
			}
		}
	} else if (cList) { //Doing a match here
		var tempList = new Array();
		
		for (i=0,j=0;(i<cList.length);i++) {
			var rec=cList[i];
			var entry=rec.getField(this._lkupFld).getRawValue();
			if (entry.toLowerCase().indexOf(userInput)==0) {
				if (j< this._siw.MAX_MATCHES) {
					this._siw.matchCollection[j] = new smartInputMatch(entry, entry.replace(re,"<b>$1</b>"), rec.id); //mEntry.replace(/\>/gi,'}').replace(/\< ?/gi,'{').replace(re,"<b>$1</b>"), rec.id);
				}
				tempList[j] = rec;
				j++
			}
		}//loop thru collection
		//Add cached list if any
		if (tempList.length > 0) {
			this._collection.addCached(userInput, tempList);
		}
	}
	
	/*
	var tempCollection = new Array();

	var re1m = new RegExp("^([ \"\>\<\-]*)("+userInput+")","i");
	var re2m = new RegExp("([ \"\>\<\-]+)("+userInput+")","i");
	var re1 = new RegExp("^([ \"\}\{\-]*)("+userInput+")","gi");
	var re2 = new RegExp("([ \"\}\{\-]+)("+userInput+")","gi");
	
	for (i=0,j=0;(i<pointerToCollectionToUse.length);i++) {
		displayMatches = ((!standalone) && (j < siw.MAX_MATCHES));
		entry = pointerToCollectionToUse[i];
		mEntry = simplify(entry);
		if (!standalone && (mEntry.indexOf(userInput) == 0)) {
			userInput = userInput.replace(/\>/gi,'\\}').replace(/\< ?/gi,'\\{');
			re = new RegExp("(" + userInput + ")","i");
			if (displayMatches) {
				siw.matchCollection[j] = new smartInputMatch(entry, mEntry.replace(/\>/gi,'}').replace(/\< ?/gi,'{').replace(re,"<b>$1</b>"));
			}
			tempCollection[j] = entry;
			j++;		
		} else if (mEntry.match(re1m) || mEntry.match(re2m)) {
			if (!standalone && displayMatches) {
				siw.matchCollection[j] = new smartInputMatch(entry, mEntry.replace(/\>/gi,'}').replace(/\</gi,'{').replace(re1,"$1<b>$2</b>").replace(re2,"$1<b>$2</b>"));
			}
			tempCollection[j] = entry;
			j++;
		}
	}//loop thru collection
	if (this._siw) {
		this._siw.lastUserInput = userInput;
		this._siw.revisedCollection = tempCollection.join(",").split(",");
		this.collectionIndex[userInput] = tempCollection.join(",").split(",");
	}
	if (standalone || this._siw.buildIndex) {
		this.collectionIndex[uifc] = tempCollection.join(",").split(",");
		if (this._siw) this._siw.buildIndex = false;
	}
	*/
}//runMatchingLogic
