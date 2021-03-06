define('Events/Ancestor',[
  './namespace',
  'InternalObject',
  'utils/createChildNamespace'
],function (Events,
            InternalObject,
            createChildNamespace) {
  /**
   * @namespace Ancestor
   * @memberOf BeautifulProperties.Events
   */
  var Ancestor = createChildNamespace(Events,'Ancestor');
  var namespace = 'Events.Ancestor';
  /**
   * @callback BeautifulProperties.Events.Ancestor~ancestorRetriever
   * @param {object} object target object
   * @param {BeautifulProperties.Events.Event} event
   * @returns {object|null|undefined}
   * @description The function to retrieve the ancestor of given object.
   */
  /**
   *
   * @function setRetriever
   * @memberOf BeautifulProperties.Events.Ancestor
   * @param {object} object target object
   * @param {BeautifulProperties.Events.Ancestor~ancestorRetriever} ancestorRetriever
   */
  Ancestor.setRetriever = function set(object,ancestorRetriever){
    InternalObject.register(object,namespace,ancestorRetriever);
  };
  /**
   *
   * @function retrieve
   * @memberOf BeautifulProperties.Events.Ancestor
   * @param {object} object target object
   * @param {BeautifulProperties.Events.Event}
   * @returns {object|null} the ancestor of the target object
   * @description Retrieve the ancestor of the target object by the ancestorRetriever that set on the target object.
   * If the target object don't have ancestorRetriever or the ancestorRetriever returns undefined,
   * the method returns the prototype of the target object.
   */
  Ancestor.retrieve = function retrieve(object,event) {
    var retriever = InternalObject.retrieve(namespace,false,object);
    var ancestor;
    if (retriever) {
      ancestor = retriever(object,event);
    }
    if (ancestor === undefined) {
      ancestor = Object.getPrototypeOf(object);
    }
    return ancestor;
  };
  return Ancestor;
});