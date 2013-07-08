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
        expect(BeautifulProperties.Events.Ancestor.retrieve(object1)).toBe(top);
        expect(BeautifulProperties.Events.Ancestor.retrieve(object2)).toBe(top);
        expect(BeautifulProperties.Events.Ancestor.retrieve(top)).toBeNull();
      });
    });
    describe("ancestorRetriever",function(){
      beforeEach(function(){
        BeautifulProperties.Events.Ancestor.setRetriever(object2,function(){
          return object1;
        });
      });
      it("should returns the return value of the given object's ancestorRetriever",function(){
        expect(BeautifulProperties.Events.Ancestor.retrieve(object2)).toBe(object1);
        expect(Object.getPrototypeOf(object2)).not.toBe(object1);
      });
    });
  });
});