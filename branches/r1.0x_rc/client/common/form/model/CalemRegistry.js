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
 * This is the object registry.
 */
 
/**
 * Constructor
 */
function CalemRegistry() {
   this._registry=new Object();
   this._tableDd = new Object();
   this._internalInit();
   //Link up to context
   CalemContext.getInstance().setRegistry(this);
} 

/**
 * Identity method
 */
CalemRegistry.prototype.toString =
function() {
	return 'CalemRegistry';
} 

//Internal init
CalemRegistry.prototype._internalInit =
function() {
	var conf=CalemConf['registry_db'];
	this._db = eval(['new ', conf.impl, '()'].join(''));
	conf=CalemConf['registry_cache'];
	this._cache = eval(['new ', conf.impl, '()'].join(''));
	//Link db to cache
	this._cache.setDb(this._db);
	this._cache.setRegistry(this);
	//Init formatters
	CalemTextUtil._init();
}

/**
 * Init method
 *  - another alternative is to use lazy init if performance turn out to be a problem.
 */
CalemRegistry.prototype.init =
function(regNames) {
   for (var i=0; i< regNames.length; i++) {
      var regName=regNames[i];
      //Each reg name has a list of items.
      var regObj=CalemConf[regName];
      //Call its loader function
      eval(['this.', regObj.loader, "(regName, regObj)"].join(''));      
   }
}

/**
 * Init for unit tests - a hack for now.
 */ 
CalemRegistry.prototype.initForTest =
function(regNames) {
	var str="{sid: '11233', uid: 'calem', 'gid': 'admin_on_install'}";
   AjxCookie.setCookie(document, 'CALEM_SID', Base64.encode(str));
   CalemContext.getInstance().init(); //Initialize context.
			   
	var acl_groups={data: [['CALEM_SYSTEM', 'My system', '', 'test it', '', '','','']], parentMap: {CALEM_SYSTEM: ['CALEM_OOB'],
        	            admin_on_install: ['CALEM_SYSTEM', 'CALEM_OOB']}};
   CalemData['acl_group']=acl_groups;
   var cachedGroups=new CalemCachedGroups(this._cache);
   this.init(regNames);
} 

//Module loader
CalemRegistry.prototype.loadModules =
function(regName, regObj) {
   //Take into consideration of customization
   var modListMgr=CalemCustomModListManager.getInstance();
   var cInfo=modListMgr.getFullCustomInfo(null, null);
   var modList= (cInfo && cInfo.getLayout()) ? cInfo.getLayout() : modListMgr.getSysModList();
   
   //Creating a cache for each registry name.
   this._registry[regName]=new Object(); 
   this._registry[regName]._objList=new Array();
   for (var j=0; j < modList.length; j++) {
      var itemName=modList[j];
      if (!cInfo.checkAcl(itemName)) continue; //Checking parent acl for permission.
      
      obj=CalemJson.setJson(CalemModuleDef[itemName]); //This is deserialize interface for all widgetInfo supporting customization.
      this._registry[regName][obj.getId()]=obj;
      this._registry[regName]._objList.push(obj);
   }
}

/**
 * Get module list
 */
CalemRegistry.prototype.getModuleList =
function () {
   return this._registry.registry_module._objList;
} 

/**
 * Get module object
 */
CalemRegistry.prototype.getModule =
function (id)  {
   return this._registry.registry_module[id];
}

CalemRegistry.prototype.getCache =
function() {
	return this._cache;
}

CalemRegistry.prototype.getDb =
function() {
	return this._db;
}

//Lazy init of tableDd
CalemRegistry.prototype.getTableDd =
function(id) {
	if (!this._tableDd[id]) {
		this._tableDd[id] = CalemTableDdFactory.create(id);
	}
	if (!this._tableDd[id]) {
		CalemDebug.error("No definition found for table: "+id);
		throw new AjxException(id, id, null, 'Table not found'); 
	}
	return this._tableDd[id];
}
