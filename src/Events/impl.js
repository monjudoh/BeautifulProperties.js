define('Events/impl',[
  './namespace','./Event','./Ancestor',
  'InternalObject',
  'utils/Array_from','utils/hasOwn','utils/cloneDict','utils/provideMethodsFactory'
],function(Events,Event,Ancestor,
           InternalObject,
           Array_from,hasOwn,cloneDict,provideMethodsFactory){
  (function () {
    var retrieveCallbacks = InternalObject.retrieve.bind(null,'callbacks',true);
    /**
     * @name on
     * @memberOf BeautifulProperties.Events
     * @function
     *
     * @param {object} object
     * @param {string} event
     * @param {function} callback
     * @param {{context:*=}=} options `context` is the ThisBinding of the callback execution context.
     */
    Events.on = function on(object, event, callback, options) {
      options = options || Object.create(null);
      var context = options.context || null;
      if (!callback) {
        throw new Error('callback is necessary in BeautifulProperties.Events.on');
      }

      var calls = retrieveCallbacks(object);
      var list = calls[event] || (calls[event] = []);
      var boundCallback = context
      ? callback.bind(context)
      : function () {
        var self = this;
        callback.apply(self,Array_from(arguments));
      };
      boundCallback.originalCallback = callback;
      list.push(boundCallback);
    };

    /**
     * @name off
     * @memberOf BeautifulProperties.Events
     * @function
     *
     * @param {object} object
     * @param {string} event
     * @param {function} callback
     *
     * @description Remove callbacks.<br/>
     * If `callback` is null, removes all callbacks for the event.<br/>
     * If `event` is null, removes all bound callbacks for all events.
     */
    Events.off = function off(object, event, callback) {
      var events, calls, list, i;

      // No event, or removing *all* event.
      if (!(calls = retrieveCallbacks(object))){
        return;
      }
      if (!(event || callback)) {
        Object.keys(calls).forEach(function(event){
          delete calls[event];
        });
        return;
      }

      events = event ? [event] : Object.keys(calls);

      // Loop through the callback list, splicing where appropriate.
      while (event = events.shift()) {
        if (!(list = calls[event]) || !callback) {
          delete calls[event];
          continue;
        }

        for (i = list.length - 1; i >= 0; i--) {
          if (callback && list[i].originalCallback === callback) {
            list.splice(i, 1);
          }
        }
      }
    };
  })();
  (function () {
    var toString = Object.prototype.toString;
    var retrieveCallbacks = InternalObject.retrieve.bind(null,'callbacks',false);
    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name.
    /**
     *
     * @name trigger
     * @memberOf BeautifulProperties.Events
     * @function
     *
     * @param {object} object
     * @param {string|BeautifulProperties.Events.Event.options} eventType
     */
    Events.trigger = function trigger(object, eventType) {
      var rest = Array_from(arguments).slice(2);
      var target = object;
      var currentTarget = object;
      var event;
      if (toString.call(eventType) == '[object String]') {
        event = new Event({type:eventType,target:target});
      } else {
        // eventType is a BeautifulProperties.Events.Event.options.
        event = new Event((function () {
          var options = cloneDict(eventType);
          options.target = target;
          return options;
        })());
      }

      do {
        if (target !== currentTarget && !event.bubbles) {
          // no bubbling
          break;
        }
        var callbackDict = retrieveCallbacks(currentTarget);
        // no callbacks
        if (!callbackDict || !callbackDict[event.type] || callbackDict[event.type].length === 0) {
          continue;
        }
        event.currentTarget = currentTarget;
        // Copy callback lists to prevent modification.
        callbackDict[event.type].slice().forEach(function(callback){
          callback.apply(target, [event].concat(rest));
        });
        if (!event.bubbles || event.isPropagationStopped) {
          break;
        }
      } while (currentTarget = Ancestor.retrieve(currentTarget)) ;
      event.currentTarget = null;
    };
  })();
  /**
   * @name provideMethods
   * @memberOf BeautifulProperties.Events
   * @function
   *
   * @param {object} object
   */
  Events.provideMethods = provideMethodsFactory(Events,['on','off','trigger']);
});