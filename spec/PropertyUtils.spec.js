describe("PropertyUtils", function() {
  describe("PropertyUtils.defineDefaultValueProperty", function() {
    it('define property',function(){
      var object = Object.create(null);
      var expectedValue = 1;
      expect(object['key']).toBeUndefined();
      PropertyUtils.defineDefaultValueProperty(object,'key',function(){
        return expectedValue;
      });
      expect(object['key']).toEqual(expectedValue);
    });
    it('defaultValueGenerator to have been called only after first property access',function(){
      var spy = jasmine.createSpy();
      var object = Object.create(null);
      PropertyUtils.defineDefaultValueProperty(object,'key',function (){
        spy();
        return 1;
      });

      expect(spy).not.toHaveBeenCalled();
      object['key'];
      expect(spy).toHaveBeenCalled();
    });
    it("defaultValueGenerator's context is saved",function(){
      var spy = jasmine.createSpy();
      var object = Object.create(null);
      PropertyUtils.defineDefaultValueProperty(object,'key',function (){
        expect(this).toBe(object);
        spy();
        return 1;
      });
      object['key'];
      expect(spy).toHaveBeenCalled();
    })
  });
});