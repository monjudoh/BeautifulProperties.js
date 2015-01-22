define('Events/bindImpl',[
  './namespace','./Event','./Ancestor','./HandlerCollection'
],function (Events,Event,Ancestor,HandlerCollection) {
  /**
   * @function on
   * @memberOf BeautifulProperties.Events
   *
   * @param {object} object
   * @param {string} eventType
   * @param {function} handler
   * @param {{context:*=}=} options `context` is the ThisBinding of the handler execution context.
   */
  Events.on = function on(object, eventType, handler, options) {
    options = options || Object.create(null);
    var context = options.context || null;
    if (!handler) {
      throw new Error('handler is necessary in BeautifulProperties.Events.on');
    }
    var handlers = HandlerCollection.retrieveWithCreate(object,eventType);
    handlers.add(handler,context);
  };

  /**
   * @function off
   * @memberOf BeautifulProperties.Events
   *
   * @param {object} object
   * @param {string} eventType
   * @param {function} handler
   *
   * @description <pre>Remove callbacks.
   * If `handler` is null, removes all handlers for the eventType.
   * If `eventType` is null, removes all bound handlers for all events.</pre>
   */
  Events.off = function off(object, eventType, handler) {
    var registeredEventTypes = HandlerCollection.keys(object);
    // No eventType, or removing *all* eventType.
    if (registeredEventTypes.length === 0){
      return;
    }
    var eventTypes = eventType ? [eventType] : registeredEventTypes;
    eventTypes.forEach(function(eventType){
      var handlers = HandlerCollection.retrieve(object,eventType);
      if (!handlers) {
        return;
      }
      if (handler) {
        handlers.remove(handler);
      } else {
        handlers.clear();
        HandlerCollection.remove(object,eventType);
      }
    });
  };
});