define('Hookable/Descriptor',[
  'internal/Descriptor',
  'InternalObject/PropertySpecific','InternalObject/retrieve'
],function (base,
            PropertySpecific,retrieveInternalObject) {
  /**
   * @namespace BeautifulProperties.Hookable~Descriptor
   * @extends BeautifulProperties~Descriptor
   * @private
   */
  var Descriptor = Object.create(base);
  PropertySpecific.mixinRetriever('Hookable::Descriptor');
  /**
   * @function retrieve
   * @memberOf BeautifulProperties.Hookable~Descriptor
   * @param {object} object
   * @param {string} key
   * @returns {(BeautifulProperties~DataDescriptor|BeautifulProperties~AccessorDescriptor|BeautifulProperties~GenericDescriptor)=}
   */
  Descriptor.retrieve = PropertySpecific.retrieverFactory('Hookable::Descriptor',false);
  /**
   * @function store
   * @memberOf BeautifulProperties.Hookable~Descriptor
   * @param {object} object
   * @param {string} key
   * @param {(BeautifulProperties~DataDescriptor|BeautifulProperties~AccessorDescriptor|BeautifulProperties~GenericDescriptor)}
   */
  Descriptor.store = function store(object,key,descriptor){
    var retriever = retrieveInternalObject('Hookable::Descriptor',true,object);
    var store = retriever.store;
    store(key,descriptor);
  };
  return Descriptor;
});