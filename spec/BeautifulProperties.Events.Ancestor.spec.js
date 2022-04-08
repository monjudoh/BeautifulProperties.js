(function (fn) {
  if (typeof define === 'function' && typeof define.amd == 'object' && define.amd) {
    // in AMD
    define(['BeautifulProperties'],function(BeautifulProperties){
      fn(BeautifulProperties);
    });
  } else if (typeof require === 'function') {
    // in node
    fn(require('../'));
  } else {
    fn(BeautifulProperties);
  }
})(function (BeautifulProperties) {
  describe("BeautifulProperties.Events.Ancestor", function() {
    describe(".retrieve",function(){
      var top,object1,object2;
      beforeEach(function(){
        top = Object.create(null);
        object1 = Object.create(top);
        object2 = Object.create(top);
      });
      describe("no ancestorRetriever",function(){
        it("should returns the prototype of the given object",function(){
          assert(BeautifulProperties.Events.Ancestor.retrieve(object1) === top);
          assert(BeautifulProperties.Events.Ancestor.retrieve(object2) === top);
          assert(BeautifulProperties.Events.Ancestor.retrieve(top) === null);
        });
      });
      describe("ancestorRetriever",function(){
        beforeEach(function(){
          BeautifulProperties.Events.Ancestor.setRetriever(object2,function(){
            return object1;
          });
        });
        it("should returns the return value of the given object's ancestorRetriever",function(){
          assert(BeautifulProperties.Events.Ancestor.retrieve(object2) === object1);
          assert(Object.getPrototypeOf(object2) !== object1);
        });
      });
    });
  });
});