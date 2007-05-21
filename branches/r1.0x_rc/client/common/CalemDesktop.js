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
 * This is the main entry point of Calemos.
 */
 
/**
 * Constructor
 */
function CalemDesktop() {
	//Logout listener
	this._logoutListener=new AjxListener(this, this.onLogout)
   //Listeners for module selection
   this._moduleSelectListener=new AjxListener(this, this.onModuleSelect);
   this._moduleCustomizeListener=new AjxListener(this, this.onModuleCustomize)
   //Use a scheduled action to control the repainting
	this._onLayoutChangeAction=new AjxTimedAction(this, this.onLayoutChange);
	//desktop conf
	this._conf=CalemConf['desktop_mainView'];
	//logout callback
	this._logoutCallback=new AjxCallback(null, CalemSoapClient.reLogin);
	//welcome action
	this._welcomeAction=new AjxTimedAction(this, this._showWelcome);
	this._welcomeConf=CalemConf['desktop_mainView']['welcomeConf'];
} 

/*
 * Setters for the form.
 */
CalemDesktop.prototype.setShell =
function(shell) {
   this._shell=shell;
	this._shell.addControlListener(new AjxListener(this, this.onDesktopControlEvent));
} 

CalemDesktop.prototype.setRegistry =
function(reg) {
   this._registry=reg;
}

/*
 * Handles a browser window resize event.
 */
CalemDesktop.prototype.onDesktopControlEvent =
function(ev) {
	if (ev.oldWidth != ev.newWidth || ev.oldHeight != ev.newHeight) {
		this.onLayoutChangeEvent();
	}
}

/**
 * A module is selected.
 * @param module object
 */
CalemDesktop.prototype.onModuleSelect =
function(mod) {
	//If current module is displayed do nothing.
	if (!this._modController || this._modController.getModule()!=mod) {
		this._modController = new CalemModuleController(this._shell, mod);
	}
	//Has the size of the topbar changed?
	if (this.isTopbarResized()) {
		if (CalemDebug.isDebug()) CalemDebug.debug("Topbar resized, to resize desktop immediately.");
		this.onLayoutChange(); //To change right away so the grid layout below is not an issue.
	}
	//Let's figure out the default form and open it.
	this._mainController.openDefaultForm(this._modController.getDefaultMenu());
}

CalemDesktop.prototype.openForm =
function(fmId, data) {
	return this._mainController.openForm(fmId, data);
}

CalemDesktop.prototype.getCurrentForm =
function() {
	return this._mainController.getCurrentForm();
}

//Ceck for topbar resize
CalemDesktop.prototype.isTopbarResized =
function() {	
	var bz=Dwt.getBounds(this._clientEl);
	return (bz.y!=this._bounds.y);
}

/**
 * Not supported at this time.
 * Group design has this function for now.
 */
CalemDesktop.prototype.onModuleCustomize =
function(modules) {
}

/**
 * Logout selected
 */
CalemDesktop.prototype.onLogout =
function() {
	//logout
	CalemSoapClient.logout(this._logoutCallback); 
}

/**
 * Launch desktop
 * <ul>
 * <li> Creating form and module areas
 * <li> Creating sashes for the layout of the client area: formSash and modSash.
 * <li> Creating modsum and mod-nav buttons
 * <li> Creating form
 * </ul>
 */
CalemDesktop.prototype.launchDesktop =
function() {
	this._showWelcome();
	//Creating logo
	this._logo=new CalemLogo(this._shell);
	//the main bar to logout/help
	this._exitToolbar=new CalemExitToolBarController(this._shell, this._logoutListener);
	// Create vertical sash between view and filter panel
	this._sash = new DwtSash(this._shell, DwtSash.HORIZONTAL_STYLE, "AppSash-horiz", this._conf['sashLimit']);
	this._sash.registerCallback(this.onSashMove, this);
	this._sash.zShow(true);
   //Get module list
   this._modules=this._registry.getModuleList();
   //Create modView
   this._modView=new CalemModView(this._shell, this._modules, this._moduleSelectListener, this._moduleCustomizeListener);
	//Set up main controller
	this._setupMainController();
   //start displaying the screen
   this.onLayoutChange();
   /**
    * Key support to consider later
    */
   /*
	   //Start key listener
	   this._setupKeyListener();
	   //Key handler to setup
	   this._keyHandler=new CalemKeyHandler();
   */
} 

/**
 * Key listener here.
 */
CalemDesktop.prototype._setupKeyListener =
function() {
	document["onkeypress"] = CalemDesktop._handleKeyEvents;
}

CalemDesktop._cancelEvent =
function(event) {
	event.cancelBubble = true;
	if (event.stopPropagation) event.stopPropagation();
} 

CalemDesktop._handleKeyEvents =
function(event) {	
	event = event || window.event; //Either passed in or directly from window
   if (event == null) return true;
    
    var target = event.target ? event.target: event.srcElement; //get the target of the event
    if (!target) return true;    
    
    //Process key presses
    var processed=CalemContext.getInstance().getDesktop().onKeyEvent(event, target);
    if (processed) {
    	CalemDesktop._cancelEvent(event);
    	return false;
    }
    return true;	
}

CalemDesktop.prototype.onKeyEvent =
function(event, target) {
	var fm=this.getCurrentForm();
	fm= fm ? fm.getActiveController() : fm;
	return this._keyHandler.onKeyEvent(event, targe, fm, this);
}

/**
 * Display welcome panel
 */
CalemDesktop.prototype._showWelcome =
function() {
	var el=document.getElementById(this._welcomeConf.id);
	var datetime=CalemTextUtil.getFormatter(CalemTextUtil.DATETIME_READ_FORMATTER).format(new Date());
	var fullName=CalemContext.getInstance().getUserFullName();
	el.innerHTML=AjxMessageFormat.format(CalemMsg.getMsg(this._welcomeConf.msg), [fullName, datetime]);
	AjxTimedAction.scheduleAction(this._welcomeAction, this._welcomeConf.interval);
} 

/**
 * Set up main controller
 */
CalemDesktop.prototype._setupMainController =
function() {
	this._mainController=eval(['new ', this._conf.controller, '(this._shell)'].join(''));
	this._mainController.init(this._conf);
} 

/**
 * Sash move attemp
 */
CalemDesktop.prototype.onSashMove =
function(delta) {
	var absDelta = Math.abs(delta);
	// Only sashBounds is updated so let's use it due to timed action.
	if ( (delta < 0 && this._sashBounds.x - this._bounds.x - absDelta < this._modView.getMinWidth())
	   ||(delta > 0 && absDelta >= this._bounds.width - (this._sashBounds.x-this._bounds.x+this._sashBounds.width)) ) {
		return 0; //Cannot exceed the starting point.
	} 
	//Accepting the changes
	this._sashBounds.x += delta;
	this.onLayoutChangeEvent();
	return delta; //Always stop here.
}

/**
 * Layout change
 */
CalemDesktop.prototype.onLayoutChangeEvent =
function() {
	AjxTimedAction.scheduleAction(this._onLayoutChangeAction, this._conf['redrawDelay']);
} 

/**
 * Layout change handler.
 */
CalemDesktop.prototype.onLayoutChange =
function() {
	//Init bounds
	this._initBounds();
	//Set up bounds first.
	this._setBounds();
	//sash
	this._sash.setBounds(this._sashBounds.x, this._sashBounds.y, this._sashBounds.width, this._sashBounds.height);
	//Mod view layout change
	this._modView.onLayoutChange(this._modBounds);
	//main area layout change
	this._mainController.onLayoutChange(this._formBounds);
} 

/**
 * Set up main client bounds
 */
CalemDesktop.prototype._initBounds =
function() {
	if (!this._clientEl) {
		this._clientEl=document.getElementById('theme_main_td');
	}	
	this._bounds=Dwt.getBounds(this._clientEl);
	
	//Sash bounds to set up first.
	if (!this._sashBounds) {//Very first time.
	   this._sashBounds = Dwt.getBounds(this._sash.getHtmlElement());
		this._sashBounds={x: this._bounds.x+this._modView.getInitWidth(), 
		                  y: this._bounds.y, width: this._sashBounds.width, height: this._bounds.height};
	} else {
		this._sashBounds.y = this._bounds.y; // this fixed it! - bounds of tables affect the sash layout, a workaround is placed now to remove the borders 
														 // from main_td and form toolbar. A solution might be searched for later.
		this._sashBounds.height=this._bounds.height;
	}
}

/**
 * Set up bounds based on sash and client area.
 */
CalemDesktop.prototype._setBounds =
function() {
	//Setting up module bounds
	this._modBounds={x: this._bounds.x, y: this._bounds.y, 
	                 width: this._sashBounds.x-this._bounds.x, height: this._bounds.height};              
	//Setting up form bounds
	this._formBounds={x: this._sashBounds.x+this._sashBounds.width, y: this._bounds.y,
	                  width: this._bounds.width - (this._sashBounds.x+this._sashBounds.width),
	                  height: this._bounds.height};
} 

/**
 * Exit desktop
 */
CalemDesktop.onExitDesktop =
function() {
	return CalemMsg.getMsg('exit_calemeam');
}

CalemDesktop._getDomShell =
function() {
	return window.document.getElementById('theme_layout');
}

/**
 * Launch the desktop
 */
CalemDesktop.launch =
function() {
   //Creating the shell.
   var domShell= CalemDesktop._getDomShell();
   var cf=CalemConf['desktop_mainView']['shell'];
   var shell = new DwtShell(cf.className, cf.scrollable, CalemDesktop.onExitDesktop, domShell);
   //get CalemContext
	var cc=CalemContext.getInstance();
	cc.init(); //Initialize context.
   cc.setShell(shell);
   cc.setupWorkarounds(); //Prepare workarounds.
   var desktop=new CalemDesktop();
   desktop.setShell(shell);
   cc.setDesktop(desktop);
   //Verify sessionId in the cookie
	var sid=cc.getSessionId();
	if (!sid) {
		//No valid sessionId so let's go back to login screen.
		desktop.onLogout();
		return;
	}
   //Init registry
   var regMgr=CalemConf.registry_manager;
   var reg=eval(["new ", regMgr.impl, "()"].join(""));
  
   //Init groups for accessing ACLs and customization.
   var cache=reg.getCache();
   var cachedGroup=new CalemCachedGroups(cache);
   //Continue initiating registry based on acl-groups.
   reg.init(regMgr.names)
   desktop.setRegistry(reg);
   //Now launchDesktop
   desktop.launchDesktop();
   return desktop;
}
