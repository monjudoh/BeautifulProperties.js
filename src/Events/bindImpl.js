define('Events/bindImpl',[
  './namespace','./Event','./Ancestor',
  'InternalObject',
  'utils/Array_from'
],function (Events,Event,Ancestor,
            InternalObject,
            Array_from) {
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
});