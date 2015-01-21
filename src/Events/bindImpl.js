define('Events/bindImpl',[
  './namespace','./Event','./Ancestor',
  'InternalObject',
  'utils/Array_from'
],function (Events,Event,Ancestor,
            InternalObject,
            Array_from) {
  var retrieveCallbacks = InternalObject.retrieve.bind(null,'callbacks',true);
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

    var calls = retrieveCallbacks(object);
    var list = calls[eventType] || (calls[eventType] = []);
    var boundCallback = context
    ? handler.bind(context)
    : function () {
      var self = this;
      handler.apply(self,Array_from(arguments));
    };
    boundCallback.originalCallback = handler;
    list.push(boundCallback);
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
    var eventTypes, calls, list, i;

    // No eventType, or removing *all* eventType.
    if (!(calls = retrieveCallbacks(object))){
      return;
    }
    // only object argument
    if (!(eventType || handler)) {
      Object.keys(calls).forEach(function(event){
        delete calls[event];
      });
      return;
    }

    eventTypes = eventType ? [eventType] : Object.keys(calls);

    // Loop through the handler list, splicing where appropriate.
    while (eventType = eventTypes.shift()) {
      if (!(list = calls[eventType]) || !handler) {
        delete calls[eventType];
        continue;
      }

      for (i = list.length - 1; i >= 0; i--) {
        if (handler && list[i].originalCallback === handler) {
          list.splice(i, 1);
        }
      }
    }
  };
});