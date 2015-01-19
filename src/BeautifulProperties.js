define('BeautifulProperties',[
  'namespace',
  'LazyInitializable',
  'InternalObject','InternalObject/retrieve','InternalObject/PropertySpecific','InternalObject/PrototypeWalker',
  'Hookable','Hookable/Internal',
  'Events',
  'utils/Array_from','utils/cloneDict'
],function(BeautifulProperties,
           LazyInitializable,
           InternalObject,retrieveInternalObject,PropertySpecific,PrototypeWalker,
           Hookable,HookableInternal,
           Events,
           Array_from,cloneDict) {


  var toString = Object.prototype.toString;
  function isFunction(obj) {
    return toString.call(obj) == '[object Function]';
  }
  var hasConsoleWarn = typeof console !== 'undefined' && !!console.warn;
  var hasConsoleError = typeof console !== 'undefined' && !!console.error;

  /**
   * @constant
   * @name VERSION
   * @memberOf BeautifulProperties
   */
  Object.defineProperty(BeautifulProperties,'VERSION',{
    value : '0.1.8',
    writable : false
  });

  BeautifulProperties.Internal = Object.create(null);
  BeautifulProperties.Internal.Key = InternalObject.Key;
  BeautifulProperties.Internal.retrieve = retrieveInternalObject;
  /**
   * @name getRaw
   * @memberOf BeautifulProperties
   * @function
   * @deprecated since version 0.1.6
   * @see BeautifulProperties.Hookable.getRaw
   *
   * @param {Object} object
   * @param {String} key
   * @return {*}
   */
  BeautifulProperties.getRaw = function getRaw(object,key) {
    return HookableInternal.getRaw(object,key);
  };
  /**
   * @name setRaw
   * @memberOf BeautifulProperties
   * @function
   * @deprecated since version 0.1.6
   * @see BeautifulProperties.Hookable.setRaw
   *
   * @param {Object} object
   * @param {String} key
   * @param {*} val
   */
  BeautifulProperties.setRaw = function setRaw(object,key,val) {
    HookableInternal.setRaw(object,key,val);
  };

  /**
   * @name Equals
   * @namespace
   * @memberOf BeautifulProperties
   */
  BeautifulProperties.Equals = Object.create(null);
  /**
   * @name Functions
   * @namespace
   * @memberOf BeautifulProperties.Equals
   * @see BeautifulProperties.Equals.equals
   */
  BeautifulProperties.Equals.Functions = Object.create(null);
  (function (Functions) {
    /**
     * @name StrictEqual
     * @memberOf BeautifulProperties.Equals.Functions
     * @function
     *
     * @param {*} value
     * @param {*} otherValue
     * @returns {boolean}
     * @description ===
     */
    Functions.StrictEqual = function StrictEqual(value,otherValue){
      return value === otherValue;
    };
  })(BeautifulProperties.Equals.Functions);
  (function (Equals,Functions,PropertySpecific) {
    PropertySpecific.mixinRetriever('Equals');
    var retrieve = retrieveInternalObject.bind(null,'Equals',true);
    /**
     * @name set
     * @memberOf BeautifulProperties.Equals
     * @function
     * @see BeautifulProperties.Equals.equals
     *
     * @param {object} object
     * @param {string} key
     * @param {function(*,*):boolean} equalsFn equals function for BeautifulProperties.Equals.equals.
     * @description It set the equals function on the property.
     */
    Equals.set = function set(object,key,equalsFn){
      equalsFn = equalsFn || Functions.StrictEqual;
      retrieve(object).store(key,equalsFn);
    };
    var walkAndRetrieve = PrototypeWalker.retrieve.bind(null,'Equals');
    /**
     * @name equals
     * @memberOf BeautifulProperties.Equals
     * @function
     *
     * @param {object} object
     * @param {string} key
     * @param {*} value
     * @param {*} otherValue
     * @returns {boolean}
     * @description If it returns true,value is equal to otherValue in the property.
     */
    Equals.equals = function equals(object,key,value,otherValue){
      var equalsFn = walkAndRetrieve(object,key);
      if (!equalsFn) {
        return value === otherValue;
      }
      if (equalsFn === Functions.StrictEqual){
        return value === otherValue;
      }
      return equalsFn.call(object,value,otherValue);
    };
  })(BeautifulProperties.Equals,BeautifulProperties.Equals.Functions,PropertySpecific);


  /**
   * @name Observable
   * @namespace
   * @memberOf BeautifulProperties
   */
  BeautifulProperties.Observable = Object.create(null);
  (function (Observable,Events,Equals,Hookable) {
    // internal functions
    var retrieveDescriptor = HookableInternal.retrieveDescriptor;
    var trigger = Events.trigger.bind(Events);

    /**
     * @function
     * @name define
     * @memberOf BeautifulProperties.Observable
     * @see BeautifulProperties.Equals.equals
     * @see BeautifulProperties.Events.Event.options
     *
     * @param {object} object
     * @param {string} key
     * @param {{bubbles:boolean=}=} options part of BeautifulProperties.Events.Event.options.
     * @description This method can be use after Hookable.define.
     */
    Observable.define = function defineObservableProperty(object,key,options) {
      options = options || Object.create(null);
      // Observable property depends on Hookable.
      if (!Hookable.hasHooks(object,key)) {
        Hookable.define(object,key);
      }

      var descriptor = retrieveDescriptor(object,key);
      function checkChangeAndTrigger(val,previousVal) {
        if (!Equals.equals(this,key,val,previousVal)){
          var eventOptions = cloneDict(options);
          eventOptions.type = 'change:' + key;
          trigger(this, eventOptions,val,previousVal);
        }
      }
      var hookType = descriptor.get ? 'refresh' : 'afterSet';
      Hookable.addHook(object,key,hookType,checkChangeAndTrigger,1);
    };
  })(BeautifulProperties.Observable,BeautifulProperties.Events,BeautifulProperties.Equals,BeautifulProperties.Hookable);

  /**
   * @name Versionizable
   * @namespace
   * @memberOf BeautifulProperties
   */
  BeautifulProperties.Versionizable = Object.create(null);
  (function (Versionizable) {
    /**
     * @constructor
     * @memberOf BeautifulProperties.Versionizable
     *
     * @property {boolean} isNull
     * @property {*} value
     * @property {number} timestamp
     */
    function Version(){
    }
    Object.defineProperty(Version.prototype,'isNull',{
      value:false,
      writable:true
    });
    Versionizable.Version = Version;
  })(BeautifulProperties.Versionizable);
  (function (Versionizable,Hookable,Equals,Events,PropertySpecific) {
    PropertySpecific.mixinRetriever('Versionizable::History',Array);
    /**
     * @function
     * @inner
     * @param {object} object
     * @returns {function(string):Array.<BeautifulProperties.Versionizable.Version>}
     */
    var retrieveHistory = retrieveInternalObject.bind(null,'Versionizable::History',true);
    // internal functions
    var retrieveDescriptor = HookableInternal.retrieveDescriptor;

    /**
     * @function
     * @name getHistoryLength
     * @memberOf BeautifulProperties.Versionizable
     *
     * @param {object} object
     * @param {string} key
     * @returns {number}
     */
    Versionizable.getHistoryLength = function getHistoryLength(object,key) {
      var history = retrieveHistory(object)(key);
      return history.length;
    };
    var aNullVersion = new (Versionizable.Version)();
    (function (version) {
      Object.defineProperty(version,'isNull',{
        value:true,
        writable:false
      });
      Object.defineProperty(version,'value',{
        value:undefined,
        writable:false
      });
    })(aNullVersion);
    /**
     * @function
     * @name getVersions
     * @memberOf BeautifulProperties.Versionizable
     *
     * @param {object} object
     * @param {string} key
     * @returns {Array.<BeautifulProperties.Versionizable.Version>}
     */
    Versionizable.getVersions = function getVersions(object,key) {
      var history = retrieveHistory(object)(key);
      return history.slice();
    };
    /**
     * @function
     * @name getVersion
     * @memberOf BeautifulProperties.Versionizable
     *
     * @param {object} object
     * @param {string} key
     * @param {number} index
     * @returns {BeautifulProperties.Versionizable.Version}
     */
    Versionizable.getVersion = function getVersion(object,key,index) {
      var history = retrieveHistory(object)(key);
      return history[index] || aNullVersion;
    };
    /**
     * @name undo
     * @memberOf BeautifulProperties.Versionizable
     * @function
     *
     * @param {object} object
     * @param {string} key
     * @param {BeautifulProperties.Versionizable.Version} version
     */
    Versionizable.undo = function undo(object,key,version) {
      // Only for data property.
      this.transaction(object,key,function (versions){
        var t = this;
        var targetIndex = versions.indexOf(version);
        if (versions.length <= 1 || targetIndex === -1) {
          return;
        }
        versions.filter(function(version,index){
          return index < targetIndex;
        }).forEach(function(version){
          t.remove(version);
        });
      },function done(currentVersion,versions,currentVersionBeforeTransaction,versionsBeforeTransaction){
        if (currentVersion !== currentVersionBeforeTransaction) {
          Events.trigger(object,'undo:'+key,currentVersion.value,currentVersionBeforeTransaction.value);
        }
      });
    };
    /**
     * @callback BeautifulProperties.Versionizable~transactionCallback
     * @this BeautifulProperties.Versionizable.Transaction
     * @param {Array.<BeautifulProperties.Versionizable.Version>} versions
     */
    /**
     * @callback BeautifulProperties.Versionizable~doneCallback
     * @param {BeautifulProperties.Versionizable.Version} currentVersion
     * @param {Array.<BeautifulProperties.Versionizable.Version>} versions
     * @param {BeautifulProperties.Versionizable.Version} currentVersionBeforeTransaction
     * @param {Array.<BeautifulProperties.Versionizable.Version>} versionsBeforeTransaction
     */
    /**
     * @name transaction
     * @memberOf BeautifulProperties.Versionizable
     * @function
     *
     * @param {object} object
     * @param {string} key
     * @param {BeautifulProperties.Versionizable~transactionCallback} callback
     * @param {BeautifulProperties.Versionizable~doneCallback=} doneCallback
     * @description The method modify property's history.<br/>
     * It's experimental API.
     */
    Versionizable.transaction = function transaction(object,key,callback,doneCallback){
      var currentVersionBeforeTransaction = this.getVersion(object,key,0);
      var versionsBeforeTransaction = this.getVersions(object,key);
      callback.call(new (Versionizable.Transaction)(object,key),versionsBeforeTransaction);
      var currentVersion = this.getVersion(object,key,0);
      var versions = this.getVersions(object,key);
      if ((currentVersion.isNull && !currentVersionBeforeTransaction.isNull)
      || (!currentVersion.isNull && currentVersionBeforeTransaction.isNull)
      || !Equals.equals(this,key,currentVersion.value,currentVersionBeforeTransaction.value)) {
        Hookable.setRaw(object,key,currentVersion.value);
      }
      if (doneCallback) {
        doneCallback(currentVersion,versions,currentVersionBeforeTransaction,versionsBeforeTransaction);
      }
    };
    /**
     * @name Transaction
     * @memberOf BeautifulProperties.Versionizable
     * @constructor
     *
     * @param {object} object
     * @param {string} key
     *
     * @property {object} object
     * @property {string} key
     */
    Versionizable.Transaction = function Transaction(object,key){
      Object.defineProperties(this,{
        object:{
          value:object,
          writable:false,
          configurable:false
        },
        key:{
          value:key,
          writable:false,
          configurable:false
        }
      })
    };
    /**
     * @name insert
     * @memberOf BeautifulProperties.Versionizable.Transaction#
     * @function
     *
     * @param {number} index
     * @param {*} value
     * @param {{timestamp:number=}=} options
     */
    Versionizable.Transaction.prototype.insert = function insert(index,value,options) {
      var history = retrieveHistory(this.object)(this.key);
      var version = new (Versionizable.Version);
      version.value = value;
      version.timestamp = (options && options.timestamp) || Date.now();
      history.splice(index,0,version);
    };
    /**
     * @name remove
     * @memberOf BeautifulProperties.Versionizable.Transaction#
     * @function
     *
     * @param {BeautifulProperties.Versionizable.Version} version
     */
    Versionizable.Transaction.prototype.remove = function remove(version) {
      var history = retrieveHistory(this.object)(this.key);
      var index = history.indexOf(version);
      if (index === -1) {
        return;
      }
      history.splice(index,1);
    };
    /**
     * @function
     * @name getPreviousValue
     * @memberOf BeautifulProperties.Versionizable
     *
     * @param {object} object
     * @param {string} key
     * @returns {*}
     */
    Versionizable.getPreviousValue = function getPreviousValue(object,key) {
      var history = retrieveHistory(object)(key);
      return (history[1] || aNullVersion).value;
    };
    /**
     * @function
     * @name define
     * @memberOf BeautifulProperties.Versionizable
     * @see BeautifulProperties.Equals.equals
     *
     * @param {object} object
     * @param {string} key
     * @param {{length:number=}=} options length's default value is 2.
     * @description This method can be use after Hookable.define.
     */
    Versionizable.define = function define(object,key,options) {
      options = options || Object.create(null);
      if (options.length === undefined) {
        options.length = 2;
      }
      // Versionizable property depends on Hookable.
      if (!Hookable.hasHooks(object,key)) {
        Hookable.define(object,key);
      }
      var descriptor = retrieveDescriptor(object,key);
      function checkChangeAndEnqueue(val,previousVal) {
        if (!Equals.equals(this,key,val,previousVal)) {
          var history = retrieveHistory(this)(key);
          var version = new (Versionizable.Version);
          version.value = val;
          version.timestamp = Date.now();
          history.unshift(version);
          // truncate
          if (history.length > options.length){
            history.length = options.length;
          }
        }
      }
      var hookType = descriptor.get ? 'refresh' : 'afterSet';
      Hookable.addHook(object,key,hookType,checkChangeAndEnqueue,10000);
    };
  })(BeautifulProperties.Versionizable,BeautifulProperties.Hookable,BeautifulProperties.Equals,BeautifulProperties.Events,PropertySpecific);

  return BeautifulProperties;
});