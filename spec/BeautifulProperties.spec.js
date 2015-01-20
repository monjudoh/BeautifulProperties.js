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
      var object,spy;
      beforeEach(function(){
        object = Object.create(null);
        spy = jasmine.createSpy();
      });
      it("define property",function(){
        var expectedValue = 1;
        expect(object['key']).toBeUndefined();
        BeautifulProperties.LazyInitializable.define(object,'key',{
          init : function(){
            return expectedValue;
          }
        });
        expect(object['key']).toEqual(expectedValue);
      });
      it("init to have been called only after first property access",function(){
        BeautifulProperties.LazyInitializable.define(object,'key',{
          init : function (){
            spy();
            return 1;
          }
        });

        expect(spy).not.toHaveBeenCalled();
        object['key'];
        expect(spy).toHaveBeenCalled();
      });
      it("init's context is saved",function(){
        BeautifulProperties.LazyInitializable.define(object,'key',{
          init : function (){
            expect(this).toBe(object);
            spy();
            return 1;
          }
        });
        object['key'];
        expect(spy).toHaveBeenCalled();
      });
      [{
        value:1,
        configurable : true,
        enumerable : true,
        writable : true
      },
        {
          value:1,
          configurable : false,
          enumerable : false,
          writable : false
        }].forEach(function(expectedDescriptor){
        it("can set property descriptor",function(){
          BeautifulProperties.LazyInitializable.define(object,'key',{
            init : function (){
              return expectedDescriptor.value;
            },
            configurable : expectedDescriptor.configurable,
            enumerable : expectedDescriptor.enumerable,
            writable : expectedDescriptor.writable
          });
          object['key'];
          var actualDescriptor = Object.getOwnPropertyDescriptor(object,'key');
          expect(actualDescriptor).toEqual(expectedDescriptor);
        });
      });
      it("default property descriptor",function(){
        var temp = Object.create(null);
        Object.defineProperty(temp,'key',{
          value : 1
        });
        var expectedDescriptor = Object.getOwnPropertyDescriptor(temp,'key');
        BeautifulProperties.LazyInitializable.define(object,'key',{
          init : function (){
            return 1;
          }
        });
        object['key'];
        var actualDescriptor = Object.getOwnPropertyDescriptor(object,'key');
        expect(actualDescriptor).toEqual(expectedDescriptor);
      });

    });
  });
});