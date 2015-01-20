define('Versionizable/impl',[
  './namespace','./Version','./Transaction','./retrieveHistory',
  'Hookable','Hookable/Internal',
  'Equals','Events',
  'InternalObject/PropertySpecific'
],function (Versionizable,Version,Transaction,retrieveHistory,
            Hookable,HookableInternal,
            Equals,Events,
            PropertySpecific) {
  PropertySpecific.mixinRetriever('Versionizable::History',Array);
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
  var aNullVersion = new Version();
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
    callback.call(new (Transaction)(object,key),versionsBeforeTransaction);
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
        var version = new Version;
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
});