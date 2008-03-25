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
 * CalemAcDb
 * Auto-completion for data that's not cached on the client.
 */
function CalemAcDb(fld, lkupFld, lkupDd, controller, lkupEditFld) {
	if (arguments.length==0) return;
	CalemInputAc.call(this, fld, lkupFld, lkupDd, controller, lkupEditFld);
}

CalemAcDb.prototype = new CalemInputAc;
CalemAcDb.prototype.constructor = CalemAcDb;

CalemAcDb.prototype.toString = function() {return "CalemAcDb";}

//Loading data
CalemAcDb.prototype.loadDataOnDemand =
function(kc) { //Data loading is delayed at matching time.
	this.onKeyPressAfterDataLoaded(kc);
}

CalemAcDb.prototype.runMatchingLogic =
function(userInput, standalone) {
	var userInput = this.simplify(userInput);
	/** used a new matching algorithm for cached list
	var uifc = userInput.charAt(0).toLowerCase();
	if (uifc == '"') uifc = (n = userInput.charAt(1)) ? n.toLowerCase() : "z";
	if (standalone) userInput = uifc;
	*/
	if (!this._collection) this._collection=new CalemAcCollection(null);
	var cached = this._collection.getCachedList(userInput, true);
	if (cached.fullMatch) {
		this.buildResults(userInput, cached.clist);
	} else { //Doing a remote call
		var ta=new AjxTimedAction(this, this._onAcFetch, {userInput: userInput, inputEl: this._inputEl});
		AjxTimedAction.scheduleAction(ta, CalemConf['auto_completion']['fetchDelay']);
	}
}//runMatchingLogic

CalemAcDb.prototype.buildResults =
function(userInput, clist) {
	if (!this._siw) this._siw = new smartInputWindow(this._inputEl);
	if (this._siw) this._siw.matchCollection = new Array();
	if (clist) {
		var re = new RegExp("(" + userInput + ")","i");
		for (var i=0; (i< clist.length && i < this._siw.MAX_MATCHES); i++) {
			var rec=clist[i];			
			var entry=rec.getField(this._lkupFld).getRawValue();
			this._siw.matchCollection[i] = new smartInputMatch(entry, entry.replace(re,"<b>$1</b>"), rec.id); //mEntry.replace(/\>/gi,'}').replace(/\< ?/gi,'{').replace(re,"<b>$1</b>"), rec.id);
		}
	}
}

/**
 * Soap call and wake up the Floater
 */
CalemAcDb.prototype.isAcValid =
function(param) {
	var v=this.simplify(param.inputEl.value);
	return (v==param.userInput && CalemInputAc._acFloater._inputEl==param.inputEl);
} 
CalemAcDb.prototype._onAcFetch =
function(param) {
	//Check for validity before call is made.
	if (this.isAcValid(param)) {
		var cb=new AjxCallback(this, this._onAcFetchCb, param);
		this._controller.fetchAcList(param.userInput, this._lkupFld, this._lkupDd, cb);	
	}
} 

CalemAcDb.prototype._onAcFetchCb =
function(param, resultList) {
	var recList=resultList[this._lkupDd.getTableName()];
	var clist= (recList ? recList.getList() : null);
	this._collection.addCached(param.userInput, clist);
	if (this.isAcValid(param)) {
		this.buildResults(param.userInput, recList.getList());
		this.processMatchResults(); //continue on displaying the results.
	}
} 


