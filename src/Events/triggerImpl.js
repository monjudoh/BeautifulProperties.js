define('Events/triggerImpl',[
  './namespace','./Event','./Ancestor',
  'InternalObject',
  'utils/Array_from','utils/cloneDict'
],function (Events,Event,Ancestor,
            InternalObject,
            Array_from,cloneDict) {
  var toString = Object.prototype.toString;
  var retrieveCallbacks = InternalObject.retrieve.bind(null,'callbacks',false);

  /**
   * @function trigger
   * @memberOf BeautifulProperties.Events
   *
   * @param {object} object
   * @param {string|BeautifulProperties.Events.Event.options} eventType
   * @description  <pre>Trigger one or many events, firing all bound callbacks. Callbacks are
   * passed the same arguments as `trigger` is, apart from the event name.</pre>
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
});