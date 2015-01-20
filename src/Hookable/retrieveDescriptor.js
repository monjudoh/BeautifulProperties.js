define('Hookable/retrieveDescriptor',[
  'InternalObject/PropertySpecific'
],function (PropertySpecific) {
  PropertySpecific.mixinRetriever('Hookable::Descriptor');
  /**
   * @function Hookable~retrieveDescriptor
   * @private
   */
  return PropertySpecific.retrieverFactory('Hookable::Descriptor',false);
});