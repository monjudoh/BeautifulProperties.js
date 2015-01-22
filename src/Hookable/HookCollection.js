define('Hookable/HookCollection',function () {
  /**
   * @function BeautifulProperties.Hookable~HookCollection~max
   * @param {Array.<number>} array
   * @returns {number}
   * @private
   */
  function max(array) {
    return array.length === 1 ? array[0] : Math.max.apply(null,array);
  }
  /**
   * @function BeautifulProperties.Hookable~HookCollection~min
   * @param {Array.<number>} array
   * @returns {number}
   * @private
   */
  function min(array) {
    return array.length === 1 ? array[0] : Math.min.apply(null,array);
  }

  var proto = Object.create(null);
  /**
   * @function add
   * @memberOf BeautifulProperties.Hookable~HookCollection#
   * @param {function} hook
   * @param {number} priority 1..10000
   */
  proto.add = function add(hook,priority) {
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
   * @function remove
   * @memberOf BeautifulProperties.Hookable~HookCollection#
   * @param {function} hook
   */
  proto.remove = function remove(hook) {
    var index = this.indexOf(hook);
    if (index === -1) {
      return;
    }
    this.splice(index,1);
    this.priorities.splice(index,1);
  };
  /**
   *
   * @constructor BeautifulProperties.Hookable~HookCollection
   * @extends Array.<function>
   * @private
   */
  function HookCollection(){
    var collection = [];
    collection.priorities = [];
    Object.keys(proto).forEach(function(key){
      collection[key] = proto[key];
    });
    return collection;
  }
  return HookCollection;
});