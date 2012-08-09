describe("PropertyUtils", function() {
  describe("PropertyUtils.defineDefaultValueProperty", function() {
    it("define property",function(){
      var object = Object.create(null);
      var expectedValue = 1;
      expect(object['key']).toBeUndefined();
      PropertyUtils.defineDefaultValueProperty(object,'key',function(){
        return expectedValue;
      });
      expect(object['key']).toEqual(expectedValue);
    });
    it("defaultValueGenerator to have been called only after first property access",function(){
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
  describe("PropertyUtils.defineHookableProperty", function() {
    it("define property",function(){
      var object = Object.create(null);
      expect('key' in object).toBe(false);
      PropertyUtils.defineHookableProperty(object,'key',{});
      expect('key' in object).toBe(true);
    });
    describe("hooks have been or don't to have been called",function(){
      var object,beforeGet,afterGet,beforeSet,afterSet;
      beforeEach(function(){
        object = Object.create(null);
        beforeGet = jasmine.createSpy('beforeGet');
        afterGet = jasmine.createSpy('afterGet');
        beforeSet = jasmine.createSpy('beforeSet');
        afterSet = jasmine.createSpy('afterSet');
        PropertyUtils.defineHookableProperty(object,'key',{
          beforeGet : beforeGet,
          afterGet : afterGet,
          beforeSet : beforeSet,
          afterSet : afterSet
        });
      });
      describe("get",function(){
        beforeEach(function(){
          object['key'];
        });
        it("beforeGet was called",function(){
          expect(beforeGet).toHaveBeenCalled();
        });
        it("afterGet was called",function(){
          expect(afterGet).toHaveBeenCalled();
        });
        it("beforeSet was not called",function(){
          expect(beforeSet).not.toHaveBeenCalled();
        });
        it("afterSet was not called",function(){
          expect(afterSet).not.toHaveBeenCalled();
        });
      });
      describe("set",function(){
        beforeEach(function(){
          object['key'] = 1;
        });
        it("beforeGet was not called",function(){
          expect(beforeGet).not.toHaveBeenCalled();
        });
        it("afterGet was not called",function(){
          expect(afterGet).not.toHaveBeenCalled();
        });
        it("beforeSet was called",function(){
          expect(beforeSet).toHaveBeenCalled();
        });
        it("afterSet was called",function(){
          expect(afterSet).toHaveBeenCalled();
        });
      });
      describe("getRaw",function(){
        beforeEach(function(){
          PropertyUtils.getRaw(self,'key');
        });
        it("beforeGet was called",function(){
          expect(beforeGet).not.toHaveBeenCalled();
        });
        it("afterGet was called",function(){
          expect(afterGet).not.toHaveBeenCalled();
        });
        it("beforeSet was not called",function(){
          expect(beforeSet).not.toHaveBeenCalled();
        });
        it("afterSet was not called",function(){
          expect(afterSet).not.toHaveBeenCalled();
        });
      });
      describe("setRaw",function(){
        beforeEach(function(){
          PropertyUtils.setRaw(self,'key',1);
        });
        it("beforeGet was called",function(){
          expect(beforeGet).not.toHaveBeenCalled();
        });
        it("afterGet was called",function(){
          expect(afterGet).not.toHaveBeenCalled();
        });
        it("beforeSet was not called",function(){
          expect(beforeSet).not.toHaveBeenCalled();
        });
        it("afterSet was not called",function(){
          expect(afterSet).not.toHaveBeenCalled();
        });
        it("value could getRaw",function(){
          expect(PropertyUtils.getRaw(self,'key')).toBe(1);
        })
      });
    })
  });
});