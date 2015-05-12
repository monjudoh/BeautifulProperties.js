define('Events/triggerImpl',[
  './namespace','./Event','./Ancestor','./HandlerCollection',
  'utils/Array_from','utils/cloneDict'
],function (Events,Event,Ancestor,HandlerCollection,
            Array_from,cloneDict) {
  var toString = Object.prototype.toString;

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

    var handlers;
    do {
      if (target !== currentTarget && !event.bubbles) {
        // no bubbling
        break;
      }
      handlers = HandlerCollection.retrieve(currentTarget,event.type);
      // no callbacks
      if (!handlers  || handlers.length === 0) {
        continue;
      }
      event.currentTarget = currentTarget;
      // Copy handler lists to prevent modification.
      handlers = handlers.clone();
      handlers.forEach(function(handler,index){
        var context = handlers.contexts[index];
        if (context === null) {
          context = target;
        }
        handler.apply(context, [event].concat(rest));
      });
      if (!event.bubbles || event.isPropagationStopped) {
        break;
      }
    } while (currentTarget = Ancestor.retrieve(currentTarget,event)) ;
    event.currentTarget = null;
  };
});