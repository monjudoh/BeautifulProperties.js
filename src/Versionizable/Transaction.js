define('Versionizable/Transaction',[
  './namespace','./Version','./History'
],function (Versionizable,Version,History) {
  /**
   * @constructor Transaction
   * @memberOf BeautifulProperties.Versionizable
   *
   * @param {object} object
   * @param {string} key
   *
   * @property {object} object
   * @property {string} key
   */
  function Transaction(object,key){
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
  }
  /**
   * @function insert
   * @memberOf BeautifulProperties.Versionizable.Transaction#
   *
   * @param {number} index
   * @param {*} value
   * @param {{timestamp:number=}=} options
   */
  Transaction.prototype.insert = function insert(index,value,options) {
    var history = History.retrieve(this.object,this.key);
    var version = new Version;
    version.value = value;
    version.timestamp = (options && options.timestamp) || Date.now();
    history.splice(index,0,version);
  };
  /**
   * @function remove
   * @memberOf BeautifulProperties.Versionizable.Transaction#
   *
   * @param {BeautifulProperties.Versionizable.Version} version
   */
  Transaction.prototype.remove = function remove(version) {
    var history = History.retrieve(this.object,this.key);
    var index = history.indexOf(version);
    if (index === -1) {
      return;
    }
    history.splice(index,1);
  };
  Versionizable.Transaction = Transaction;
  return Transaction;
});