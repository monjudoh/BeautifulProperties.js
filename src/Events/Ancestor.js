define('Events/Ancestor',[
  './namespace',
  'InternalObject','InternalObject/retrieve',
  'utils/createChildNamespace'
],function (Events,
            InternalObject,retrieveInternalObject,
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
   * @returns {object|null}
   * @description The function to retrieve the ancestor of given object.
   */
  /**
   *
   * @name setRetriever
   * @memberOf BeautifulProperties.Events.Ancestor
   * @param {object} object target object
   * @param {BeautifulProperties.Events.Ancestor~ancestorRetriever} ancestorRetriever
   * @function
   */
  Ancestor.setRetriever = function set(object,ancestorRetriever){
    InternalObject.register(object,namespace,ancestorRetriever);
  };
  /**
   *
   * @name retrieve
   * @memberOf BeautifulProperties.Events.Ancestor
   * @param {object} object target object
   * @returns {object|null} the ancestor of the target object
   * @function
   * @description Retrieve the ancestor of the target object by the ancestorRetriever that set on the target object.
   * If the target object don't have ancestorRetriever,the method returns the prototype of the target object.
   */
  Ancestor.retrieve = function retrieve(object) {
    var retriever = retrieveInternalObject(namespace,false,object);
    if (retriever) {
      return retriever(object);
    } else {
      return Object.getPrototypeOf(object);
    }
  };
  return Ancestor;
});