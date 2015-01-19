define('Hookable/Hooks',[
  'LazyInitializable'
],function (LazyInitializable) {

  /**
   * @function
   * @param {Array.<number>} array
   * @returns {number}
   * @private
   */
  function max(array) {
    return array.length === 1 ? array[0] : Math.max.apply(null,array);
  }
  /**
   * @function
   * @param {Array.<number>} array
   * @returns {number}
   * @private
   */
  function min(array) {
    return array.length === 1 ? array[0] : Math.min.apply(null,array);
  }

  var collectionProto = Object.create(null);
  /**
   * @name add
   * @memberOf HookCollection
   * @function
   * @param {function} hook
   * @param {number} priority 1..10000
   */
  collectionProto.add = function add(hook,priority) {
    // empty
    if (this.length === 0) {
      this.push(hook);
      this.priorities.push(priority);
      return;
    }
    // The given priority is highest.
    if (max(this.priorities) < priority) {
      this.unshift(hook);
      this.priorities.unshift(priority);
      return;
    }
    // The given priority is lowest.
    if (min(this.priorities) > priority) {
      this.push(hook);
      this.priorities.push(priority);
      return;
    }
    // The given hook is already exists.
    if (this.indexOf(hook) !== -1) {
      this.remove(hook);
    }
    // Insert the given hook and priority to the next index of the last priority
    // that greater equal than the given priority in the priorities.
    var threshold = min(this.priorities.filter(function (aPriority) {
      return aPriority >= priority;
    }));
    var index = this.priorities.lastIndexOf(threshold);
    this.priorities.splice(index + 1,0,priority);
    this.splice(index + 1,0,hook);
  };
  /**
   * @name remove
   * @memberOf HookCollection
   * @function
   * @param {function} hook
   */
  collectionProto.remove = function remove(hook) {
    var index = this.indexOf(hook);
    if (index === -1) {
      return;
    }
    this.splice(index,1);
    this.priorities.splice(index,1);
  };
  /**
   *
   * @name HookCollection
   * @constructor
   * @extends Array.<function>
   * @private
   */
  function HookCollection(){
    var collection = [];
    collection.priorities = [];
    Object.keys(collectionProto).forEach(function(key){
      collection[key] = collectionProto[key];
    });
    return collection;
  }
  /**
   * @name Hooks
   * @property {HookCollection} beforeGet
   * @property {HookCollection} afterGet
   * @property {HookCollection} beforeSet
   * @property {HookCollection} afterSet
   * @property {HookCollection} refresh
   * @constructor
   * @private
   */
  function Hooks(){}

  (function (proto) {
    'beforeGet afterGet beforeSet afterSet refresh'.split(' ').forEach(function(key){
      LazyInitializable.define(proto,key,{
        init:function(){
          return new HookCollection;
        }
      })
    });
  })(Hooks.prototype);
  return Hooks;
});