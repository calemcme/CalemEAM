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
 * CalemScrollBar
 * The scroll bar includes up and down buttons, scroll slider and 
 * the scroll background.
 * 
 */
function CalemScrollBar(parent, className, posStyle) {
	if (arguments.length == 0) return;
	className = className || "CalemScrollBar";
	posStyle = posStyle || DwtControl.ABSOLUTE_STYLE;
	DwtComposite.call(this, parent, className, posStyle);
	//Data bound action
	this._onDataScrollAction = new AjxTimedAction(this, this.onDataScroll);
	//Slider
	this._scrollSlider=new CalemScrollSlider(parent); //do not use 'this' since div is to be reset.
	this._scrollSlider.registerCallback(this.onSliderMoveEvent, this);
	//Up button
	this._onUpButtonListener = new AjxListener(this, this.onUpButtonScrollEvent);
	this._upBtn=new CalemScrollButton(parent, 'CalemScrollButtonUp');
	this._upBtn.init(this._onUpButtonListener);
	//Down button
	this._onDownButtonListener = new AjxListener(this, this.onDownButtonScrollEvent);
	this._downBtn=new CalemScrollButton(parent, 'CalemScrollButtonDown');
	this._downBtn.init(this._onDownButtonListener);
	//Event listener for down click.
	this._setEventHdlrs([DwtEvent.ONMOUSEDOWN]);
	this._onMouseDownListener = new AjxListener(this, this.onMouseDownEvent);
	this.addListener(DwtEvent.ONMOUSEDOWN, this._onMouseDownListener);
	//Now creating the scroll bar
	this._createScrollBar();	
	//Get the conf
	this._conf=CalemConf['widget_scrollbar'];
}

CalemScrollBar.prototype = new DwtComposite;
CalemScrollBar.prototype.constructor = CalemScrollBar;

CalemScrollBar.prototype.toString = 
function() {
	return "CalemScrollBar";
}

CalemScrollBar.prototype._createScrollBar =
function() {
	//Allocating Ids
   this._upBtnId=Dwt.getNextId();
   this._downBtnId=Dwt.getNextId();
   this._trackId=Dwt.getNextId();
   //Set up html element
   var htmlElement = this.getHtmlElement();
   htmlElement.innerHTML = 
   	["<table border=0 cellspacing=0 cellpadding=0 class=CalemScrollBarTable>",
		 "<tr><td><div id=", this._upBtnId, "></div></td></tr>",
		 "<tr style='height:100%'><td id=", this._trackId, "></td></tr>",
		 "<tr><td><div id=", this._downBtnId, "></div></td></tr>",
		 "</table>"].join('');	
	//Getting html elements
	this._upBtnEl=document.getElementById(this._upBtnId);
	this._upBtnEl.appendChild(this._upBtn.getHtmlElement());
	this._downBtnEl=document.getElementById(this._downBtnId);
	this._downBtnEl.appendChild(this._downBtn.getHtmlElement());
	this._trackEl=document.getElementById(this._trackId);	
	this._trackEl.appendChild(this._scrollSlider.getHtmlElement()); //This is to prevent zooming to change position.
}

/**
 * External events to trigger UI changes
 * @param start - current record position
 * @param dataSize - total data rows
 * @param viewSize - data rows to show in list view
 * 
 */
 
/** Init the scrollbar */ 
CalemScrollBar.prototype.init =
function(start, dataSize, viewSize, controller) {
	this._start=start;
	this._dataSize=dataSize;
	this._viewSize=viewSize;
	this._controller=controller;
	this.__onLayoutChange(); //Set layout once.
	this._initUom();
}

/**
 * view size change
 */
CalemScrollBar.prototype.onViewSizeChange =
function(viewSize) {
	this._viewSize=viewSize;
} 

/**
 * External events to trigger UI changes
 */
CalemScrollBar.prototype.onDataChange =
function(dataSize) {
	this._dataSize=dataSize;
}

/**
 * This is to resume grid after coming out of a hosted state.
 */
CalemScrollBar.prototype.resumeView =
function() {
	this._initUom();
	this.onDataScroll();
}

/*
 * This can be determined dynamically but for now let's assume simple
 * cases for listView use only.
 */
CalemScrollBar.prototype.setParentEl =
function(el, grid) {
	//use container el to figure out the offset.
	this._pEl=el;
	el.appendChild(this.getHtmlElement());
	this._grid=grid;
}

/**
 * Provide current state of the scrollBar
 */
CalemScrollBar.prototype.getState =
function() {
	return {start: this._start, viewSize: this._viewSize, dataSize: this._dataSize};
}

CalemScrollBar.prototype.resetState =
function(state) {
	this._start=state.start;
	this._dataSize=state.dataSize;
	this._viewSize=state.viewSize;
	this._initUom();
}

CalemScrollBar.prototype.__onLayoutChange =
function() {
	//figure out how to position the scrollbar.
	var bz=Dwt.getBounds(this._pEl);
    if (CalemDebug.isDebug()) CalemDebug.printBounds('scrollBar parentEl', bz);
	var x=this._grid.getListWidth();
	var y=this._grid.getHeaderHeight();
	var offset=0;
	var width=bz.width;
	if (bz.width<=0) { //Workaround for Firfox. Fixed layout is not fixing it in FF.
		offset=CalemConf["widget_scrollbar"]['width'];
		width=offset; 
	}
	if (CalemDebug.isDebug()) CalemDebug.debug("scrollBar's offset="+offset+", width="+width);
	this._bz={x:x-offset, y: y, width: width, height: bz.height};
	this.setBounds(this._bz.x, this._bz.y, this._bz.width, this._bz.height);
	if (CalemDebug.isDebug()) CalemDebug.printBounds("scrollBar's bounds", this._bz);
	this._disableIt();
}

CalemScrollBar.prototype._disableIt =
function() {
	var rtn=false;
	if (!this._dataSize || this._dataSize==0 || this._dataSize <= this._viewSize) {
		this._scrollSlider.setVisible(false);
		this._upBtn.setEnabled(false);
		this._downBtn.setEnabled(false);
		rtn=true;
	}
	return rtn;
}

/**
 * Conversion calculation
 */
CalemScrollBar.prototype._initUom =
function() {
	if (this._disableIt()) return;
	else {
		this._upBtn.setEnabled(true);
		this._downBtn.setEnabled(true);
		this._scrollSlider.setVisible(true); //Enable scroll slider so we can get its bounds.
	}
	this._bzTrack=Dwt.getBounds(this._trackEl);
	var h= Math.floor(this._viewSize * this._bzTrack.height / this._dataSize);	
	this._scrollSlider.adjustSize(this._bzTrack.width, h);		
	var bz=Dwt.getBounds(this._scrollSlider.getHtmlElement());	
	this._sliderH = bz.height; //In case minimum height is not realized.
	//Now calculate rop (data row over pixel measure) and por (pixel over data row)
	var range = (this._bzTrack.height - this._sliderH);
	if (range<0) {
		this._scrollSlider.setVisible(false);
	} else {
		this._scrollSlider.setVisible(true);
		range= range>0 ? range : 0;
		this._rop =  range<=0 ? 0 : (this._dataSize/range);
		this._por =  range  / this._dataSize;
		var bzUpBtn=this._upBtn.getBounds();
		this._yOffset=bzUpBtn.height;
		this._redrawSlider();
	}
}	

/**
 * UI layout
 */
CalemScrollBar.prototype._redrawSlider =
function() {
	if (!this._scrollSlider.getVisible()) return;
	var y= Math.floor((this._start) * this._por);
	this._sliderY=y;
	this._scrollSlider.setLocation(0, this._yOffset+y);
}

/**
 * Listeners
 */
CalemScrollBar.prototype.onSliderMoveEvent =
function(delta) {
	//Boundary conditions to stop the movement.
	var y= this._sliderY + delta;
	if (delta > 0) {
		if (this._sliderY + this._sliderH >= this._bzTrack.height) return 0;
		if (y + this._sliderH > this._bzTrack.height) {
			y=this._bzTrack.height - this._sliderH;
		   delta= y - this._sliderY;
		}
	} else if (delta < 0) {
		if (this._sliderY <= 0) return 0;
		if (y < 0) {
			y=0; 
			delta= -this._sliderY;
		}
	}
	this._sliderY =y;
	this._start=Math.floor(this._rop * y);
	//Boundary check.
	if (this._start < 1) {
		this._start=0;
	} else if (this._start > this._dataSize) {
		this._start=this._dataSize -1;
	}
	AjxTimedAction.scheduleAction(this._onDataScrollAction, this._conf['dataScrollDelay']);
	return delta;
} 

CalemScrollBar.prototype.onUpButtonScrollEvent =
function() {
	if (this._start==0) return; //No action
	this._start--;
	this._redrawSlider();
	AjxTimedAction.scheduleAction(this._onDataScrollAction, this._conf['dataScrollDelay']);
}	
	
CalemScrollBar.prototype.onDownButtonScrollEvent =
function() {
	if (this._start==this._dataSize-1) return; //No action
	this._start++;
	this._redrawSlider();
	AjxTimedAction.scheduleAction(this._onDataScrollAction, this._conf['dataScrollDelay']);
}	

/**
 * Wheel scroll event
 */
CalemScrollBar.prototype.scrollByWheel =
function(delta) {
	if (!this._scrollSlider.getVisible()) return; //No scrollSlider.
	//Cannot scroll anymore.
	if ( (this._start==0 && delta > 0) || (this._start==(this._dataSize-1) && delta < 0) ) return;
	if (delta > 0) {
   	this._start -= delta;
   	if (this._start<1) this._start=0;
   } else {
   	this._start -= delta;
   	if (this._start>this._dataSize-1) this._start=this._dataSize-1;
   }   
   this._redrawSlider(); //change UI properly.
   AjxTimedAction.scheduleAction(this._onDataScrollAction, this._conf['dataScrollDelay']);
}

CalemScrollBar.prototype.onMouseDownEvent =
function(ev) {
	if (!this._scrollSlider.getVisible()) return; //No scrollSlider.
	if ( (!ev.elementY)
       || (this._start==0 && ev.elementY <= this._sliderY)
       || (this._start==(this._dataSize-1) && ev.elementY>=this._sliderY) ) return;
   if (ev.elementY < this._sliderY) {
   	this._start -= this._viewSize;
   	if (this._start<1) this._start=0;
   } else {
   	this._start += this._viewSize;
   	if (this._start>this._dataSize-1) this._start=this._dataSize-1;
   }   
   this._redrawSlider(); //change UI properly.
   AjxTimedAction.scheduleAction(this._onDataScrollAction, this._conf['dataScrollDelay']);
}	

CalemScrollBar.prototype.onDataScroll =
function() {
	if (CalemDebug.isDebug()) CalemDebug.debug("on data scroll: _start="+this._start+", view="+this._viewSize+", dataSize="+this._dataSize);
	this._controller.scrollTo(this._start, this._viewSize, this._dataSize);
}	 

/**
 * CalemScrollSlider
 * The slider can be dragged up and down like a sash.
 * 
 */ 
function CalemScrollSlider(parent, style, className, threshold, posStyle) {
	if (arguments.length == 0) return;
	//Bypass sash constructor
	this._className = className ? className : "CalemScrollSlider";
	posStyle = posStyle ? posStyle : DwtControl.ABSOLUTE_STYLE; //Must be absolute for movement control.
	//Bypass DwtSash's constructor
	DwtControl.call(this, parent, this._className, posStyle);
	//Threshold
	this._threshold = (threshold > 0) ? threshold : 1;
	//Creating the scrollbar
	this._createScrollSlider();
	//Capture dragging
	this._captureObj = new DwtMouseEventCapture(this, "CalemScrollSlider", 
	      CalemScrollSlider._mouseOverHdlr,
			CalemScrollSlider._mouseDownHdlr, CalemScrollSlider._mouseMoveHdlr, 
			CalemScrollSlider._mouseUpHdlr, CalemScrollSlider._mouseOutHdlr);
	this.setHandler(DwtEvent.ONMOUSEDOWN, CalemScrollSlider._mouseDownHdlr);
	this.setHandler(DwtEvent.ONMOUSEOVER, CalemScrollSlider._mouseOverHdlr);
	this.setHandler(DwtEvent.ONMOUSEOUT, CalemScrollSlider._mouseOutHdlr);

	this.setZIndex(Dwt.Z_VIEW);
	//Set state to initial
	this._state=CalemScrollSlider.OUT;
	this._moveState=CalemScrollSlider.OVER;
	//Workaround for firefox
	this._minHeight=CalemConf['widget_scrollbar']['scrollSliderMinHeight'];
}

CalemScrollSlider.prototype = new DwtSash;
CalemScrollSlider.prototype.constructor = CalemScrollSlider;

CalemScrollSlider.prototype.toString = 
function() {
	return "CalemScrollSlider";
}

CalemScrollSlider.OUT='';
CalemScrollSlider.DOWN='_Over';
CalemScrollSlider.MOVE='_Move';
CalemScrollSlider.OVER='_Over';
CalemScrollSlider.UP='_Over';
	
//Creating scrollbar html elements
CalemScrollSlider.prototype._createScrollSlider =
function() {
	//Allocating Ids
   this._topId=Dwt.getNextId();
   this._fillUpId=Dwt.getNextId();
   this._gripId=Dwt.getNextId();
   this._fillDownId=Dwt.getNextId();
   this._bottomId=Dwt.getNextId();
   //Set up html element
   var htmlElement = this.getHtmlElement();
   htmlElement.innerHTML = 
   	["<table height=100% border=0 cellspacing=0 cellpadding=0 class=CalemScrollSliderTable>",
		 "<tr><td><div id=", this._topId, "></div></td></tr>",
		 "<tr style='height:50%'><td id=", this._fillUpId, "></td></tr>",
		 "<tr><td><div id=", this._gripId, "></div></td></tr>",
		 "<tr style='height:50%'><td id=", this._fillDownId, "></td></tr>",
		 "<tr><td><div id=", this._bottomId, "></div></td></tr>",
		 "</table>"].join('');	
	//Getting html elements
	this._topEl=document.getElementById(this._topId);
	this._fillUpEl=document.getElementById(this._fillUpId);
	this._gripEl=document.getElementById(this._gripId);
	this._fillDownEl=document.getElementById(this._fillDownId);
	this._bottomEl=document.getElementById(this._bottomId);
	this._setClassName(CalemScrollSlider.OUT);
}

/** 
 * Workaround for firefox to make sure the size don't go too low.
 */
CalemScrollSlider.prototype.adjustSize =
function(w, h) {
	if (h < this._minHeight) {
		h=this._minHeight;
	}
	this.setSize(w,h);
}

CalemScrollSlider.prototype._setClassName =
function(suffix) {
	this._topEl.className=[this._className, '_Top',suffix].join('');
	this._fillUpEl.className=[this._className, '_Fill', suffix].join('');
	this._gripEl.className=[this._className, '_Grip', suffix].join('');
	this._fillDownEl.className=[this._className, '_Fill', suffix].join('');
	this._bottomEl.className=[this._className, '_Bottom', suffix].join('');
}

/**
 * Mouse handlers
 */
CalemScrollSlider.prototype.onMouseOver =
function(ev) {
	if (this._state==CalemScrollSlider.MOVE) {
		this._moveState=CalemScrollSlider.OVER;
		return;
	}
	this._setClassName(CalemScrollSlider.OVER);
} 

CalemScrollSlider.prototype.onMouseDown =
function(ev) {
	this._state=CalemScrollSlider.DOWN;
	this._setClassName(CalemScrollSlider.DOWN);
} 

CalemScrollSlider.prototype.onMouseMove =
function(ev) {
	this._state=CalemScrollSlider.MOVE;
	this._setClassName(CalemScrollSlider.MOVE);
} 

CalemScrollSlider.prototype.onMouseUp =
function(ev) {
	this._state=CalemScrollSlider.UP;
	if (this._moveState==CalemScrollSlider.OVER) {
		this.onMouseOver(ev);
	} else if (this._moveState==CalemScrollSlider.OUT) {
		this.onMouseOut(ev);
	} else {
		this._setClassName(CalemScrollSlider.UP);
	}
	this._moveState=CalemScrollSlider.OVER;
} 

CalemScrollSlider.prototype.onMouseOut =
function(ev) {
	if (this._state==CalemScrollSlider.MOVE) {
		this._moveState=CalemScrollSlider.OUT;
		return;
	}
	this._state=CalemScrollSlider.OUT;
	this._setClassName(CalemScrollSlider.OUT);
} 

//Get the slider object to handle the event.
CalemScrollSlider.getEventDwtObject =
function(ev) {
	var slider=DwtUiEvent.getDwtObjFromEvent(ev);
	if (slider && slider instanceof CalemScrollSlider) {
		return slider;
	} else {
		return null;
	}
}
/**
 * Mouse handlers
 */
CalemScrollSlider._mouseOverHdlr =
function(ev) {
	var slider=CalemScrollSlider.getEventDwtObject(ev);
	if (slider) slider.onMouseOver(ev);
	return DwtSash._mouseOverHdlr(ev);	
}

CalemScrollSlider._mouseDownHdlr =
function(ev) {
	var slider=CalemScrollSlider.getEventDwtObject(ev);
	if (slider) slider.onMouseDown(ev);
	return DwtSash._mouseDownHdlr(ev);
}

CalemScrollSlider._mouseMoveHdlr =
function(ev) {
	var slider=CalemScrollSlider.getEventDwtObject(ev);
	if (slider) slider.onMouseMove(ev);
	return DwtSash._mouseMoveHdlr(ev);
}

CalemScrollSlider._mouseUpHdlr =
function(ev) {
	var slider=CalemScrollSlider.getEventDwtObject(ev);
	if (slider) slider.onMouseUp(ev);
	else {
		slider=DwtMouseEventCapture.getTargetObj();
		if (slider && slider instanceof CalemScrollSlider) {
			slider.onMouseUp(ev);
		}
	}
	return DwtSash._mouseUpHdlr(ev);
}

CalemScrollSlider._mouseOutHdlr =
function(ev) {
	var slider=CalemScrollSlider.getEventDwtObject(ev);
	if (slider) slider.onMouseOut(ev);
	return DwtSash._mouseOutHdlr(ev);	
} 

/**
 * Scroll buttons (Up and down) on the scroll bar
 * 
 */
function CalemScrollButton(parent, className, posStyle) {
	if (arguments.length == 0) return;
	this._className= className;
	DwtControl.call(this, parent, this._className, posStyle);
	//Listening to mouse up, down, out events for mouse held down.
	// add custom mouse handlers to standard ones
	var mouseEvents = [DwtEvent.ONMOUSEDOWN,DwtEvent.ONMOUSEUP];
	if (AjxEnv.isIE)
		mouseEvents.push(DwtEvent.ONMOUSEENTER, DwtEvent.ONMOUSELEAVE);
	else
		mouseEvents.push(DwtEvent.ONMOUSEOVER, DwtEvent.ONMOUSEOUT);
	this._setEventHdlrs(mouseEvents);
	//Add listeners	
	this.addListener(DwtEvent.ONMOUSEDOWN, new AjxListener(this, this.onMouseDown));
	this.addListener(DwtEvent.ONMOUSEUP,   new AjxListener(this, this.onMouseUp));
	this.addListener(DwtEvent.ONMOUSEOUT,  new AjxListener(this, this.onMouseOut));
	this.addListener(DwtEvent.ONMOUSEOVER,  new AjxListener(this, this.onMouseOver));
	//Timed action to monitor the mouse being down.
	this._onFirstMouseDown=new AjxTimedAction(this, this._monitorFirstMouseDown);
	this._onOtherMouseDown=new AjxTimedAction(this, this._monitorOtherMouseDown);
	//Create the button
	this._createScrollButton();
	//state
	this.setEnabled(true);
}

CalemScrollButton.prototype = new DwtControl;
CalemScrollButton.prototype.constructor = CalemScrollButton;

CalemScrollButton.prototype.toString = 
function() {
	return "CalemScrollButton";
} 

CalemScrollButton.prototype.setEnabled =
function(enabled) {
	if (this._enabled==enabled) return; //Nothing to do.
	this._enabled=enabled;
	if (enabled) {
		this._state=CalemScrollButton.STATE_NONE;
		this._setClassName(CalemScrollButton.OUT);
	} else {
		this._setClassName(CalemScrollButton.DISABLE);
	}
}

//Creating scroll button html element
CalemScrollButton.prototype._createScrollButton =
function() {
	//Allocating Ids
   this._elId=Dwt.getNextId();
   //Set up html element
   var htmlElement = this.getHtmlElement();
   htmlElement.innerHTML = ["<div id=", this._elId,"></div>"].join('');	
	//Getting html elements
	this._el=document.getElementById(this._elId);
}

CalemScrollButton.prototype._setClassName =
function(suffix) {
	this._el.className=[this._className, suffix].join('');
}

CalemScrollButton.OUT='';
CalemScrollButton.DOWN='_Down';
CalemScrollButton.PRESSED='_Down';
CalemScrollButton.OVER='_Over';
CalemScrollButton.UP='_Over';
CalemScrollButton.DISABLE='_Disable';

CalemScrollButton.STATE_NONE=0;
CalemScrollButton.STATE_DOWN=1;
CalemScrollButton.STATE_PRESSED=2;

CalemScrollButton.prototype.init =
function(scrollListener, holdTime, moveDelay) {
	this._scrollListener = scrollListener;
	this._holdTime=  holdTime || CalemConf['widget_scrollbar']['holdTime'];
	this._moveDelay= moveDelay || CalemConf['widget_scrollbar']['moveDelay'];
}

/**
 * Mouse down handlers
 */
CalemScrollButton.prototype.onMouseDown =
function(ev) {
	if (!this._enabled || ev.button != DwtMouseEvent.LEFT) return;
	this._setClassName(CalemScrollButton.DOWN);
	this._scrollListener.handleEvent(ev);
	//Let's monitor for holding down here.
	this._state=CalemScrollButton.STATE_DOWN;
	this._actionId=AjxTimedAction.scheduleAction(this._onFirstMouseDown, this._holdTime);
}

CalemScrollButton.prototype._monitorFirstMouseDown =
function() {
	if (this._state==CalemScrollButton.STATE_DOWN) {
		this._setClassName(CalemScrollButton.PRESSED);
		this._state=CalemScrollButton.STATE_PRESSED;
		this._scrollListener.handleEvent();
		this._actionId=AjxTimedAction.scheduleAction(this._onOtherMouseDown, this._moveDelay);
	}
}

CalemScrollButton.prototype._monitorOtherMouseDown =
function() {
	if (this._state==CalemScrollButton.STATE_PRESSED) {
      this._scrollListener.handleEvent();
		this._actionId=AjxTimedAction.scheduleAction(this._onOtherMouseDown, this._moveDelay);
	}
}

/**
 * Mouse up handlers
 */
CalemScrollButton.prototype.onMouseUp =
function(ev) {
	if (!this._enabled) return;
	this._setClassName(CalemScrollButton.UP);
	this._clearMouseDown();
} 

/**
 * Mouse out handlers
 */
CalemScrollButton.prototype.onMouseOut =
function(ev) {
	if (!this._enabled) return;
	this._setClassName(CalemScrollButton.OUT);
	this._clearMouseDown();
} 

/**
 * Mouse over
 */
CalemScrollButton.prototype.onMouseOver =
function(ev) {
	if (!this._enabled) return;
	this._setClassName(CalemScrollButton.OVER);
}  

CalemScrollButton.prototype._clearMouseDown =
function() {
	if (this._state==CalemScrollButton.STATE_NONE) return; //cleared already.
	this._state=CalemScrollButton.STATE_NONE;
	if (this._actionId) {
		AjxTimedAction.cancelAction(this._actionId);
		this._actionId=null;
	}
} 
