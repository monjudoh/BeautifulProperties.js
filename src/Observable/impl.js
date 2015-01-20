define('Observable/impl',[
  './namespace',
  'Events','Equals',
  'Hookable','Hookable/Internal',
  'utils/cloneDict'
],function (Observable,
            Events,Equals,
            Hookable,HookableInternal,
            cloneDict) {
  // internal functions
  var retrieveDescriptor = HookableInternal.retrieveDescriptor;
  var trigger = Events.trigger.bind(Events);

  /**
   * @function
   * @name define
   * @memberOf BeautifulProperties.Observable
   * @see BeautifulProperties.Equals.equals
   * @see BeautifulProperties.Events.Event.options
   *
   * @param {object} object
   * @param {string} key
   * @param {{bubbles:boolean=}=} options part of BeautifulProperties.Events.Event.options.
   * @description This method can be use after Hookable.define.
   */
  Observable.define = function defineObservableProperty(object,key,options) {
    options = options || Object.create(null);
    // Observable property depends on Hookable.
    if (!Hookable.hasHooks(object,key)) {
      Hookable.define(object,key);
    }

    var descriptor = retrieveDescriptor(object,key);
    function checkChangeAndTrigger(val,previousVal) {
      if (!Equals.equals(this,key,val,previousVal)){
        var eventOptions = cloneDict(options);
        eventOptions.type = 'change:' + key;
        trigger(this, eventOptions,val,previousVal);
      }
    }
    var hookType = descriptor.get ? 'refresh' : 'afterSet';
    Hookable.addHook(object,key,hookType,checkChangeAndTrigger,1);
  };
});