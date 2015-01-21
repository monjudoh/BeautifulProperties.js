define('Events/impl',[
  './namespace',
  'utils/provideMethodsFactory',
  './bindImpl','./triggerImpl'
],function(Events,
           provideMethodsFactory){
  /**
   * @function provideMethods
   * @memberOf BeautifulProperties.Events
   *
   * @param {object} object
   */
  Events.provideMethods = provideMethodsFactory(Events,['on','off','trigger']);
});