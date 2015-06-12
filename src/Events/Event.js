define('Events/Event',[
  './namespace',
  'utils/hasConsoleError'
],function (Events,
            hasConsoleError) {
  /**
   * @typedef BeautifulProperties.Events.Event~options
   * @property {string} type
   * @property {object} target
   * @property {boolean=} bubbles
   * @description Options for BeautifulProperties.Events.Event constructor.
   */
  var readonlyKeys = 'type target'.split(' ');
  var necessaryKeys = 'type target'.split(' ');
  var optionalKeys = 'bubbles'.split(' ');
  /**
   *
   * @param {BeautifulProperties.Events.Event~options} options
   * @constructor Event
   * @memberOf BeautifulProperties.Events
   */
  function Event(options) {
    var event = this;
    necessaryKeys.forEach(function(key){
      if (!(key in options)) {
        if (hasConsoleError) {
          console.error(key + " is necessary in Event's options.",options);
        }
        throw new Error(key + " is necessary in Event's options.");
      }
      event[key] = options[key];
    });
    optionalKeys.forEach(function(key){
      if (!(key in options)) {
        return;
      }
      event[key] = options[key];
    });
    readonlyKeys.forEach(function(key){
      Object.defineProperty(event,key,{
        writable:false
      });
    });

  }
  (function (proto) {
    /**
     * @type {boolean}
     * @name bubbles
     * @memberOf BeautifulProperties.Events.Event#
     * @description Default value is true.
     */
    proto.bubbles = true;
    /**
     * @type {boolean}
     * @name isPropagationStopped
     * @memberOf BeautifulProperties.Events.Event#
     * @description stop propagation flag
     */
    proto.isPropagationStopped = false;
    /**
     * @type {object?}
     * @name currentTarget
     * @memberOf BeautifulProperties.Events.Event#
     */
    this.currentTarget = null;
    /**
     * @type {object?}
     * @name previousTarget
     * @memberOf BeautifulProperties.Events.Event#
     * @description Previous `currentTarget` in bubbling phase.
     */
    /**
     * @function stopPropagation
     * @memberOf BeautifulProperties.Events.Event#
     */
    proto.stopPropagation = function stopPropagation () {
      this.isPropagationStopped = true;
    };
  })(Event.prototype);
  Events.Event = Event;
  return Event;
});