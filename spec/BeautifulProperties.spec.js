describe("BeautifulProperties", function() {
  describe(".Internal", function() {
    describe(".retrieve", function() {
      var target,prototype;
      /**
       * @type Function
       */
      var retrieveRaw;
      beforeEach(function(){
        prototype = {};
        target = Object.create(prototype);
        retrieveRaw = BeautifulProperties.Internal.retrieve.bind(null,'raw');
      });
      describe("after create raw for target",function () {
        beforeEach(function(){
          retrieveRaw(true,target);
        });
        it("internalObject exists",function () {
          expect(target[BeautifulProperties.Internal.Key]).toBeDefined();
        });
        it("internalObject is not enumerable",function () {
          for (var key in target) {
            expect(key).not.toBe(BeautifulProperties.Internal.Key);
          }
        });
      });
      describe("prototype has internalObject",function () {
        beforeEach(function(){
          retrieveRaw(true,prototype);
        });
        it("can not retrieveRaw from target",function () {
          expect(retrieveRaw(false,target)).not.toBeDefined();
        });
        it("target's raw isn't same with prototype's raw",function () {
          var raw = retrieveRaw(true,target);
          expect(raw).toBeDefined();
          expect(raw).not.toBe(retrieveRaw(false,prototype));
        });
      });
      describe("target don't have internalObject",function () {
        describe("create argument is false",function () {
          it("raw is not retrieved",function () {
            expect(retrieveRaw(false,target)).not.toBeDefined();
          });
        });
        describe("create argument is true",function () {
          it("raw is retrieved",function () {
            expect(retrieveRaw(true,target)).toBeDefined();
          });
        });
      });
      describe("target has internalObject",function () {
        var raw;
        beforeEach(function(){
          raw = retrieveRaw(true,target);
        });
        describe("create argument is false",function () {
          it("raw is retrieved",function () {
            expect(retrieveRaw(false,target)).toBeDefined();
          });
          it("retrieved raw is same",function () {
            expect(retrieveRaw(false,target)).toBe(raw);
          });
        });
        describe("create argument is true",function () {
          it("raw is retrieved",function () {
            expect(retrieveRaw(true,target)).toBeDefined();
          });
          it("retrieved raw is same",function () {
            expect(retrieveRaw(true,target)).toBe(raw);
          });
        });
      });
    });
  });
  describe(".LazyInitializable.define", function() {
    it("define property",function(){
      var object = Object.create(null);
      var expectedValue = 1;
      expect(object['key']).toBeUndefined();
      BeautifulProperties.LazyInitializable.define(object,'key',function(){
        return expectedValue;
      });
      expect(object['key']).toEqual(expectedValue);
    });
    it("defaultValueGenerator to have been called only after first property access",function(){
      var spy = jasmine.createSpy();
      var object = Object.create(null);
      BeautifulProperties.LazyInitializable.define(object,'key',function (){
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
      BeautifulProperties.LazyInitializable.define(object,'key',function (){
        expect(this).toBe(object);
        spy();
        return 1;
      });
      object['key'];
      expect(spy).toHaveBeenCalled();
    })
  });
});