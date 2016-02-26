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
 * CalemDateLookup
 */
function CalemDateLookup(parent) {
	if (arguments.length==0) return;
	//Use a custom text button to overcome IE's button issue.
	var selectButton = new DwtDialog_ButtonDescriptor(CalemDateLookup.SELECT_BUTTON, CalemMsg.getMsg('button_select'), DwtDialog.ALIGN_RIGHT);
	var dismissButton = new DwtDialog_ButtonDescriptor(DwtDialog.DISMISS_BUTTON, AjxMsg[DwtDialog.MSG_KEY[DwtDialog.DISMISS_BUTTON]], DwtDialog.ALIGN_RIGHT);
	DwtDialog.call(this, parent, null, null, DwtDialog.NO_BUTTONS, [selectButton, dismissButton], null, DwtDialog.MODAL, null);
	//Register callbacks for the buttons
	this.registerCallback(CalemDateLookup.SELECT_BUTTON, this._onSelect, this);
	this.registerCallback(DwtDialog.DISMISS_BUTTON, this._onDismiss, this);
	this._initControl();
}

CalemDateLookup.SELECTION = 'CALEM_DATE_SELECT';
CalemDateLookup.SELECT_BUTTON = -1;

CalemDateLookup.prototype=new DwtDialog;
CalemDateLookup.prototype.constructor=CalemDateLookup;

CalemDateLookup.prototype.toString= function() {return 'CalemDateLookup'}

//Set size, calendar and listeners
CalemDateLookup.prototype._initControl =
function() {
	this._conf=CalemConf['calendar_lookup'];
	//size adjustment.
	this._cal=new CalemCalendar(this.parent);
	var calSz=this._cal.getSize();
	var sz=this.getSize();
	var x=calSz.x+sz.x+this._conf['containerExtra']['x'];
	var y=calSz.y+sz.y+this._conf['containerExtra']['y'];
	this._size={x: x, y: y};
	this.setSize(x, y);
	//Attach calendar view
	this.setView(this._cal);
	//Listeners
	this._cal.addSelectionListener(new AjxListener(this, this._onDateSelection));
}

/**
 * Listeners
 */
CalemDateLookup.prototype._onSelect =
function() {
	this._notifyDateSelection();
}

CalemDateLookup.prototype._onDismiss =
function() {
	//Remove listener
	this.removeAllListeners(CalemDateLookup.SELECTION);
	this.popdown();
}

CalemDateLookup.prototype._onDateSelection =
function(ev) {
	if (ev.type == DwtCalendar.DATE_DBL_CLICKED) {
		this._notifyDateSelection();	
	}
}

CalemDateLookup.prototype._notifyDateSelection =
function(ev) {
	if (this.isListenerRegistered(CalemDateLookup.SELECTION)) {
		this.notifyListeners(CalemDateLookup.SELECTION, ev);
		this._onDismiss(); //Close down the lookup.
	}
}

/**
 * Public APIs
 */
CalemDateLookup.prototype.getDate =
function() {
	return this._cal.getDate();
}
 
CalemDateLookup.prototype._addSelectionListener =
function(listener) {
	this.addListener(CalemDateLookup.SELECTION, listener);
}

CalemDateLookup.prototype.popupCalendar =
function(bz, date, listener) {
	date = date || new Date();
	this._cal.setDate(date);
	var lc=this._setupLoc(bz);
	this.popup(lc);
	this.setLocation(lc.x, lc.y);
	this._addSelectionListener(listener);
} 
 
CalemDateLookup.prototype._setupLoc =
function(bz) {
	//Do a quick boundary check here.
	var x= bz.x - this._conf['calOff']['x'];
	if (x > this._size.x) {
		x -= this._size.x;
	}
	var y= bz.y - this._conf['calOff']['y'];
	if (y > this._size.y) {
		y -= this._size.y;
	} else {
		y = bz.y + bz.height+ this._conf['calOff']['y'];
	}
	return {x: x, y: y};
}

/**
 * CalemCalendar
 */
function CalemCalendar(parent, className, posStyle, firstDayOfWeek, forceRollOver, workingDaysArray, hidePrevNextMo, readOnly) {
	if (arguments.length==0) return;
	this._conf=CalemConf['calendar_lookup'];
	firstDayOfWeek = firstDayOfWeek || this._conf['firstDayOfWeek'];
	workingDaysArray= workingDaysArray || this._conf['workingDaysArray'];
	DwtCalendar.call(this, parent, className, posStyle, firstDayOfWeek, forceRollOver, workingDaysArray, hidePrevNextMo, readOnly);
	//Handlers to close the lookup.
	this._initLookup();
} 

CalemCalendar.prototype = new DwtCalendar;
CalemCalendar.prototype.constructor = CalemCalendar;

CalemCalendar.prototype.toString = function() { return "CalemCalendar"; }

/**
 * Close control
 */ 
CalemCalendar.prototype._initLookup =
function() {
	//Set size
	this._size={x: this._conf['calSize']['x'], y: this._conf['calSize']['y']};
	this.setSize(this._size.x, this._size.y);
}