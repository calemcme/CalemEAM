/*
WICK: Web Input Completion Kit
http://wick.sourceforge.net/
Copyright (c) 2004, Christopher T. Holland
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of the Christopher T. Holland, nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

* 
* Portions created by CalemEAM Inc. are Copyright (c) CalemEAM Inc.
* 
*/

/**
 * CalemInputAc
 * Auto-completion
 */
function CalemInputAc(fld, lkupFld, lkupDd, controller, lkupEditFld) {
	if (arguments.length==0) return;
	this._fld=fld;
	this._lkupFld=lkupFld;
	this._lkupDd=lkupDd;
	this._controller=controller;
	this._lkupEditFld=lkupEditFld;
	this._inputEl=lkupEditFld.getEditField()._inputField;
	this._inputEl._iac=this;
	this._initAc();
}

CalemInputAc.prototype.toString = function() {return "CalemInputAc";}

//Init the field for Auto-completion.
CalemInputAc.prototype._initAc =
function() {
	this._inputEl.setAttribute("autocomplete","OFF");
	this._inputEl.onfocus = CalemInputAc.handleFocus;
	this._inputEl.onblur = CalemInputAc.handleBlur;
	this._inputEl.onkeydown = CalemInputAc.handleKeyDown;
	this._inputEl.onkeyup = CalemInputAc.handleKeyPress;
	
	if (!CalemInputAc._acFloater) {
		CalemInputAc._acFloater = document.createElement("table");
		CalemContext.getInstance().getShell().getHtmlElement().appendChild(CalemInputAc._acFloater);
		CalemInputAc._acFloater.cellPadding=0;
		CalemInputAc._acFloater.cellSpacing=0;
		CalemInputAc._acFloater.className='acFloater';
		var row1=CalemInputAc._acFloater.insertRow(-1);
		CalemInputAc._acFloaterContent=row1.insertCell(-1);
		CalemInputAc._acFloaterContent.noWrap=true;
													  
		//Setup mouse event listener
		if (document.addEventListener) {
			document.addEventListener("mouseup", CalemInputAc.handleClick, false);
			document.addEventListener("mouseover", CalemInputAc.handleMouseOver, false);
		} else {
			document.onmouseup = CalemInputAc.handleClick;
			document.onmouseover = CalemInputAc.handleMouseOver;
		}													  
	}
}

/**
 * Event handlers for Auto-completion
 */
CalemInputAc.handleFocus = function(event) {
	var e = CalemInputAc.getEvent(event);
	var eL = CalemInputAc.getEventElement(e);
	if (eL._iac) {
		eL._iac.onAcFocus();
	}
}//handleFocus()

CalemInputAc.prototype.onAcFocus =
function() {
	if (!this._siw) { //Init the siw here.
		this._siw = new smartInputWindow(this._inputEl);
	}
}

//Key press - may initialize and load data here. 
CalemInputAc.handleKeyPress = function(event) {
	var e = CalemInputAc.getEvent(event);
	var eL = CalemInputAc.getEventElement(e);
	if (eL._iac) {
		eL._iac.onKeyPress(e);
	}
}

CalemInputAc.prototype.onKeyPress =
function(e) {	
	var kc = e["keyCode"];
	//Now loading data if not loaded before
	this.loadDataOnDemand(kc); //This is delayed data loading for DB or instantly for cached.
}

CalemInputAc.prototype.onKeyPressAfterDataLoaded =
function(kc) {
	if (this._siw && ((kc == 13) || (kc == 9))) {
		this._siw.selectingSomething = true;
		if (this._siw.isSafari) this._siw.inputBox.blur();   //hack to "wake up" safari
		this._siw.inputBox.focus();
		this._siw.inputBox.value = this._siw.inputBox.value.replace(/[ \r\n\t\f\s]+$/gi,''); //No space here.
		this.hideSmartInputFloater();
	} else if ((kc != 38) && (kc != 40) && (kc != 37) && (kc != 39) && (kc != 13) && (kc != 27)) {
		if (!this._siw || (this._siw && !this._siw.selectingSomething)) {
			this.processSmartInput(this._inputEl);
		}
	} else if (this._siw && this._siw.inputBox) {
		this._siw.inputBox.focus(); //kinda part of the hack.
	}
}//handleKeyPress()

// keydown - will cause initialization here.
CalemInputAc.handleKeyDown = function(event) {
	var e = CalemInputAc.getEvent(event);
	var eL = CalemInputAc.getEventElement(e);
	if (eL._iac) {
		eL._iac.onKeyDown(e);
	}
}

CalemInputAc.prototype.onKeyDown =
function(e) {
	var kc;
	if (this._siw && (kc = e["keyCode"])) {
		if (kc == 40) {
			this._siw.selectingSomething = true;
			CalemInputAc.freezeEvent(e);
			 //FF workaround 
			 //if (this._siw.isGecko) this._siw.inputBox.blur(); /* Gecko hack */
			this.selectNextSmartInputMatchItem();
		} else if (kc == 38) {
			this._siw.selectingSomething = true;
			CalemInputAc.freezeEvent(e);
			//FF workaround
			//if (this._siw.isGecko) this._siw.inputBox.blur();
			this.selectPreviousSmartInputMatchItem();
		} else if ((kc == 13) || (kc == 9)) {
			this._siw.selectingSomething = true;
			this.activateCurrentSmartInputMatch();
			CalemInputAc.freezeEvent(e);
		} else if (kc == 27)  {
			this.hideSmartInputFloater();
			CalemInputAc.freezeEvent(e);
		} else {
			this._siw.selectingSomething = false;
		}
	}
}//handleKeyDown()

CalemInputAc.handleBlur = function(event) {
	var e = CalemInputAc.getEvent(event);
	var eL = CalemInputAc.getEventElement(e);
	if (eL._iac) {
		eL._iac.onBlur(e);
	}
}//handleBlur()

CalemInputAc.prototype.onBlur =
function(e) {
	if (this._siw && !this._siw.selectingSomething) {
		this.hideSmartInputFloater();
		CalemInputAc._acFloater._inputEl=null; //no current field associated with it for now.
	}
}

CalemInputAc.handleClick = function(event) {
	if (CalemInputAc._acFloater._inputEl && CalemInputAc._acFloater._inputEl._iac) {
		CalemInputAc._acFloater._inputEl._iac.onMouseClick();	
	}
}//handleClick()

CalemInputAc.prototype.onMouseClick =
function(e) {
	if (this._siw && this._siw.selectingSomething) {
		this.selectFromMouseClick();
	}
}

CalemInputAc.handleMouseOver = function(event) {
	var e = CalemInputAc.getEvent(event);
	var eL = CalemInputAc.getEventElement(e);
	if (CalemInputAc._acFloater._inputEl && CalemInputAc._acFloater._inputEl._iac) {
		CalemInputAc._acFloater._inputEl._iac.onMouseOver(eL);	
	}
}//handleMouseOver

CalemInputAc.prototype.onMouseOver =
function(eL) {
	if (this._siw && (mEl = CalemInputAc.isWithinNode(eL,null,"acMatchedSmartInputItem",null,null))) {
		this._siw.selectingSomething = true;
		this.selectFromMouseOver(mEl);
	} else if (CalemInputAc.isWithinNode(eL,null,"siwCredit",null,null)) {
		this._siw.selectingSomething = true;
	}else if (this._siw) {
		this._siw.selectingSomething = false;
	}
}
  

/* start dhtml building blocks */
CalemInputAc.freezeEvent = function(e) {
	if (e.preventDefault) e.preventDefault();
	e.returnValue = false;
	e.cancelBubble = true;
	if (e.stopPropagation) e.stopPropagation();
	return false;
}//freezeEvent

CalemInputAc.isWithinNode = function(e,i,c,t,obj) {
	var answer = false;
	var te = e;
	while(te && !answer) {
		if	((te.id && (te.id == i)) || (te.className && (te.className == i+"Class"))
				|| (!t && c && te.className && (te.className == c))
				|| (!t && c && te.className && (te.className.indexOf(c) != -1))
				|| (t && te.tagName && (te.tagName.toLowerCase() == t))
				|| (obj && (te == obj))
			) {
			answer = te;
		} else {
			te = te.parentNode;
		}
	}
	return te;
}//isWithinNode

/**
 * Utility functions
 */
CalemInputAc.getEvent = function(event) {
	return (event ? event : window.event);
}//getEvent()

CalemInputAc.getEventElement = function(e) {
	return (e.srcElement ? e.srcElement: (e.target ? e.target : e.currentTarget));
}//getEventElement()

CalemInputAc.findElementPosX = function(obj) {
	var curleft = 0;
	if (obj.offsetParent) {
		while (obj.offsetParent) {
			curleft += obj.offsetLeft;
			obj = obj.offsetParent;
		}
	}//if offsetParent exists
	else if (obj.x)
		curleft += obj.x
	return curleft;
}//findElementPosX

CalemInputAc.findElementPosY = function(obj) {
	var curtop = 0;
	if (obj.offsetParent) {
		while (obj.offsetParent) {
			curtop += obj.offsetTop;
			obj = obj.offsetParent;
		}
	}//if offsetParent exists
	else if (obj.y)
		curtop += obj.y
	return curtop;
}//findElementPosY
/* end dhtml building blocks */


CalemInputAc.prototype.showSmartInputFloater =
function() {
	if (!this._siw.floater.style.display || (this._siw.floater.style.display=="none")) {
		if (!this._siw.customFloater) {
			var x = CalemInputAc.findElementPosX(this._siw.inputBox);
			var y = CalemInputAc.findElementPosY(this._siw.inputBox) + this._siw.inputBox.offsetHeight;
			//hack: browser-specific adjustments.
			if (!this._siw.isGecko && !this._siw.isWinIE) x += 8;
			if (!this._siw.isGecko && !this._siw.isWinIE) y += 10;
			this._siw.floater.style.left = x+"px"; //FF workaround.
			this._siw.floater.style.top = y+"px";
		} else {
			//you may
			//do additional things for your custom floater
			//beyond setting display and visibility
		}
		this._siw.floater.style.display="block";
		this._siw.floater.style.visibility="visible";
	}
}//showSmartInputFloater()

CalemInputAc.prototype.hideSmartInputFloater =
function() {
	if (this._siw) {
		this._siw.floater.style.display="none";
		this._siw.floater.style.visibility="hidden";
		this._siw = null;
	}//siw exists
}//hideSmartInputFloater

/**
 * Auto-completion core function
 */
CalemInputAc.prototype.processSmartInput =
function(inputBox) {
	if (!this._siw) this._siw = new smartInputWindow(this._inputEl);	
	this.setSmartInputData();
	this.processMatchResults();
}//processSmartInput()

CalemInputAc.prototype.processMatchResults =
function() {
	if (this._siw.matchCollection && (this._siw.matchCollection.length > 0)) this.selectSmartInputMatchItem(0);
	var content = this.getSmartInputBoxContent();
	if (content) {
		this.modifySmartInputBoxContent(content);
		this.showSmartInputFloater();
	} else {
		this.hideSmartInputFloater();
	}
}


CalemInputAc.prototype.simplify =
function(s) {
	return s.toLowerCase().replace(/^[ \s\f\t\n\r]+/,'').replace(/[ \s\f\t\n\r]+$/,'');
}//simplify

/** No use for this function
CalemInputAc.prototype.getUserInputToMatch =
function(s) {
	var a = s;
	fields = s.split(",");
	if (fields.length > 0) a = fields[fields.length - 1];
	return a;
}//getUserInputToMatch
*/

/** No need for this function
CalemInputAc.prototype.getUserInputBase =
function() {
	var s = this._siw.inputBox.value;
	var a = s;
	if ((lastComma = s.lastIndexOf(",")) != -1) {
		a = a.replace(/^(.*\,[ \r\n\t\f\s]*).*$/i,'$1');
	}
	else
		a = "";
	return a;
}//getUserInputBase()
*/

CalemInputAc.prototype.setSmartInputData =
function() {
	if (this._siw) {
		var orgUserInput = this._siw.inputBox.value;
		// orgUserInput = this.getUserInputToMatch(orgUserInput);
		var userInput = orgUserInput.toLowerCase().replace(/[\r\n\t\f\s]+/gi,' ').replace(/^ +/gi,'').replace(/ +$/gi,'').replace(/ +/gi,' ').replace(/\\/gi,'').replace(/\[/gi,'').replace(/\(/gi,'').replace(/\./gi,'\.').replace(/\?/gi,'');
		if (userInput && (userInput != "") && (userInput != '"')) {
			this.runMatchingLogic(userInput);
		}//if userinput not blank and is meaningful
		else {
			this._siw.matchCollection = null;
		}
	}//siw exists ... uhmkaaayyyyy
}//setSmartInputData

CalemInputAc.prototype.getSmartInputBoxContent =
function() {
	var a = null;
	if (this._siw && this._siw.matchCollection && (this._siw.matchCollection.length > 0)) {
		a = '';
		for (var i = 0;i < this._siw.matchCollection.length; i++) {
			selectedString = this._siw.matchCollection[i].isSelected ? ' acSelectedSmartInputItem' : '';
			a += '<p class="acMatchedSmartInputItem' + selectedString + '">' + this._siw.matchCollection[i].value.replace(/\{ */gi,"&lt;").replace(/\} */gi,"&gt;") + '</p>';
		}//
	}//siw exists
	return a;
}//getSmartInputBoxContent

CalemInputAc.prototype.modifySmartInputBoxContent =
function(content) {
	//todo: remove credits 'cuz no one gives a shit ;] - done
	this._siw.floaterContent.innerHTML = '<div id="acSmartInputResults">' + content + (this._siw.showCredit ? ('<p class="siwCredit">Powered By: <a target="PhrawgBlog" href="http://chrisholland.blogspot.com/?from=smartinput&ref='+escape(location.href)+'">Chris Holland</a></p>') : '') +'</div>';
	this._siw.matchListDisplay = document.getElementById("acSmartInputResults");
}//modifySmartInputBoxContent()

CalemInputAc.prototype.selectFromMouseOver =
function(o) {
	var currentIndex = this.getCurrentlySelectedSmartInputItem();
	if (currentIndex != null) this.deSelectSmartInputMatchItem(currentIndex);
	var newIndex = this.getIndexFromElement(o);
	this.selectSmartInputMatchItem(newIndex);
	this.modifySmartInputBoxContent(this.getSmartInputBoxContent());
}//selectFromMouseOver

CalemInputAc.prototype.selectFromMouseClick =
function() {
	this.activateCurrentSmartInputMatch();
	this._siw.inputBox.focus();
	this.hideSmartInputFloater();
}//selectFromMouseClick

CalemInputAc.prototype.getIndexFromElement =
function(o) {
	var index = 0;
	while(o = o.previousSibling) {
		index++;
	}//
	return index;
}//getIndexFromElement

CalemInputAc.prototype.getCurrentlySelectedSmartInputItem =
function() {
	var answer = null;
	for (var i = 0; ((i < this._siw.matchCollection.length) && !answer) ; i++) {
		if (this._siw.matchCollection[i].isSelected)
			answer = i;
	}//
	return answer;
}//getCurrentlySelectedSmartInputItem

CalemInputAc.prototype.selectSmartInputMatchItem =
function(index) {
	this._siw.matchCollection[index].isSelected = true;
}//selectSmartInputMatchItem()

CalemInputAc.prototype.deSelectSmartInputMatchItem =
function(index) {
	this._siw.matchCollection[index].isSelected = false;
}//deSelectSmartInputMatchItem()

CalemInputAc.prototype.selectNextSmartInputMatchItem =
function() {
	var currentIndex = this.getCurrentlySelectedSmartInputItem();
	if (currentIndex != null) {
		this.deSelectSmartInputMatchItem(currentIndex);
		if ((currentIndex + 1) < this._siw.matchCollection.length)
	 		this.selectSmartInputMatchItem(currentIndex + 1);
		else
			this.selectSmartInputMatchItem(0);
	} else {
		this.selectSmartInputMatchItem(0);
	}
	this.modifySmartInputBoxContent(this.getSmartInputBoxContent());
}//selectNextSmartInputMatchItem

CalemInputAc.prototype.selectPreviousSmartInputMatchItem =
function() {
	var currentIndex = this.getCurrentlySelectedSmartInputItem();
	if (currentIndex != null) {
		this.deSelectSmartInputMatchItem(currentIndex);
		if ((currentIndex - 1) >= 0)
	 		this.selectSmartInputMatchItem(currentIndex - 1);
		else
			this.selectSmartInputMatchItem(this._siw.matchCollection.length - 1);
	} else {
		this.selectSmartInputMatchItem(this._siw.matchCollection.length - 1);
	}
	this.modifySmartInputBoxContent(this.getSmartInputBoxContent());
}//selectPreviousSmartInputMatchItem

CalemInputAc.prototype.activateCurrentSmartInputMatch =
function() {
	// var baseValue = this.getUserInputBase();
	var selIndex;
	if ((selIndex = this.getCurrentlySelectedSmartInputItem()) != null) {
		// var addedValue = this._siw.matchCollection[selIndex].cleanValue;
		// var theString = (baseValue ? baseValue : "") + addedValue; //No additive here: + ", ";
		// this._siw.inputBox.value = addedValue; // theString;
		// this.runMatchingLogic(addedValue, true);
		var match=this._siw.matchCollection[selIndex];
		this._lkupEditFld.setValueByLkup(match.id, match.cleanValue);
	}
}//activateCurrentSmartInputMatch

/**
 * Smart input window
 */
function smartInputWindow(inputEl) {
	this.customFloater = false;
	this.inputBox = inputEl;
	this.floater = CalemInputAc._acFloater;
	this.floater._inputEl=inputEl;
	this.floaterContent = CalemInputAc._acFloaterContent;
	this.selectedSmartInputItem = null;
	this.MAX_MATCHES = CalemConf['auto_completion']['maxMatch'];
	//Use AjxEnv
	this.isGecko = AjxEnv.isGeckoBased; //(navigator.userAgent.indexOf("Gecko/200") != -1);
	this.isSafari = AjxEnv.isSafari; //(navigator.userAgent.indexOf("Safari") != -1);
	this.isWinIE = (AjxEnv.isWindows && AjxEnv.isIE); // ((navigator.userAgent.indexOf("Win") != -1 ) && (navigator.userAgent.indexOf("MSIE") != -1 ));
	this.showCredit = false;
}//smartInputWindow Object

//Match entry
function smartInputMatch(cleanValue, value, id) {
	this.cleanValue = cleanValue;
	this.value = value;
	this.isSelected = false;
	this.id=id;
}//smartInputMatch

//Data collection
function CalemAcCollection(recList) {
	this._recList=recList;
	this._cached=new Object();
}//CalemAcCollection

CalemAcCollection.prototype.getCachedList =
function(userInput, fullMatch) {
	if (fullMatch) {//Only interested in a full match.
		return {clist: this._cached[userInput], fullMatch: this._cached[userInput]};
	}
	
	var cl=null;
	var idx=userInput;
	while (true) {//Go by input and all the substrings
		if (this._cached[idx]) {
			cl=this._cached[idx];
			break;
		} else {
			if (idx.length > 1) {
				idx=idx.substr(0, idx.length -1);
			} else {
				break;
			}
		}
	}
	if (cl) {
		return {clist: cl, fullMatch: (idx==userInput)};
	} else {
		return {clist: this._recList, fullMatch: false};
	}
}

CalemAcCollection.prototype.addCached =
function(key, list) {
	this._cached[key]=list;
}

