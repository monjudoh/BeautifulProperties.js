define('Events/bindImpl',[
  './namespace','./Event','./Ancestor','./HandlerCollection',
  'utils/cloneDict'
],function (Events,Event,Ancestor,HandlerCollection,
            cloneDict) {
  /**
   * @typedef BeautifulProperties.Events~BindingOptions
   * @property {*=} thisObject is the ThisBinding of the handler execution context.
   * @property {*=} context is the alias of the thisObject. (deprecated)
   */
  /**
   * @function on
   * @memberOf BeautifulProperties.Events
   *
   * @param {object} object
   * @param {string|Array.<string>} eventType
   * @param {function} handler
   * @param {BeautifulProperties.Events~BindingOptions=} options
   */
  Events.on = function on(object, eventType, handler, options) {
    if (!handler) {
      throw new Error('handler is necessary in BeautifulProperties.Events.on');
    }
    options = options ? cloneDict(options) : Object.create(null);
    // deprecated
    if (options.context !== undefined) {
      options.thisObject = options.context;
    }
    if (options.thisObject === undefined) {
      options.thisObject = null;
    }
    if (Array.isArray(eventType)) {
      eventType.forEach(function(eventType){
        options = cloneDict(options);
        var handlers = HandlerCollection.retrieveWithCreate(object, eventType);
        handlers.add(handler, options);
      });
    } else {
      var handlers = HandlerCollection.retrieveWithCreate(object, eventType);
      handlers.add(handler, options);
    }
  };

  /**
   * @function off
   * @memberOf BeautifulProperties.Events
   *
   * @param {object} object
   * @param {string|Array.<string>|null} eventType
   * @param {function} handler
   * @param {BeautifulProperties.Events~BindingOptions=} options
   *
   * @description <pre>Remove callbacks.
   * If `handler` is null, removes all handlers for the eventType.
   * If `eventType` is null, removes all bound handlers for all events.</pre>
   */
  Events.off = function off(object, eventType, handler, options) {
    var registeredEventTypes = HandlerCollection.keys(object);
    // No eventType, or removing *all* eventType.
    if (registeredEventTypes.length === 0){
      return;
    }
    var eventTypes = !eventType ? registeredEventTypes
                                : Array.isArray(eventType) ? eventType
                                                           : [eventType];
    eventTypes.forEach(function(eventType){
      var handlers = HandlerCollection.retrieve(object,eventType);
      if (!handlers) {
        return;
      }
      if (handler) {
        handlers.remove(handler, options);
      } else {
        handlers.clear();
        HandlerCollection.remove(object,eventType);
      }
    });
  };
});