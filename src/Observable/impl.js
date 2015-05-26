define('Observable/impl',[
  './namespace',
  'Events','Equals',
  'Hookable','Hookable/Descriptor',
  'utils/cloneDict'
],function (Observable,
            Events,Equals,
            Hookable,Descriptor,
            cloneDict) {
  // internal functions
  var trigger = Events.trigger.bind(Events);

  /**
   * @function
   * @name define
   * @memberOf BeautifulProperties.Observable
   * @see BeautifulProperties.Equals.equals
   * @see BeautifulProperties.Events.Event~options
   *
   * @param {object} object
   * @param {string} key
   * @param {{bubbles:boolean=}=} options part of BeautifulProperties.Events.Event~options.
   * @description This method can be use after Hookable.define.
   */
  Observable.define = function defineObservableProperty(object,key,options) {
    options = options || Object.create(null);
    // Observable property depends on Hookable.
    if (!Hookable.hasHooks(object,key)) {
      Hookable.define(object,key);
    }

    var descriptor = Descriptor.retrieve(object,key);
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