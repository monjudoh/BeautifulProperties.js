define('Hookable/Descriptor',[
  'internal/Descriptor',
  'InternalObject/PropertySpecific','InternalObject/PrototypeWalker'
],function (base,
            PropertySpecific,PrototypeWalker) {
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
   * @function walkAndRetrieve
   * @memberOf BeautifulProperties.Hookable~Descriptor
   * @param {object} object
   * @param {string} key
   * @returns {(BeautifulProperties~DataDescriptor|BeautifulProperties~AccessorDescriptor|BeautifulProperties~GenericDescriptor)=}
   */
  Descriptor.walkAndRetrieve = PrototypeWalker.retrieve.bind(null,'Hookable::Descriptor');
  /**
   * @function store
   * @memberOf BeautifulProperties.Hookable~Descriptor
   * @param {object} object
   * @param {string} key
   * @param {(BeautifulProperties~DataDescriptor|BeautifulProperties~AccessorDescriptor|BeautifulProperties~GenericDescriptor)}
   */
  Descriptor.store = PropertySpecific.storerFactory('Hookable::Descriptor');
  return Descriptor;
});