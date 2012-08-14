describe("BeautifulProperties.Events", function() {
  describe(".getCallbacks", function() {
    var targetObject;
    beforeEach(function(){
      targetObject = {};
    });
    describe("first call",function () {
      describe("no create argument",function () {
        it("callbacks is not retrieved",function () {
          expect(BeautifulProperties.Events.getCallbacks(targetObject)).not.toBeDefined();
        });
      });
      describe("create argument is false",function () {
        it("callbacks is not retrieved",function () {
          expect(BeautifulProperties.Events.getCallbacks(targetObject,false)).not.toBeDefined();
        });
      });
      describe("create argument is true",function () {
        it("callbacks is retrieved",function () {
          expect(BeautifulProperties.Events.getCallbacks(targetObject,true)).toBeDefined();
        });
      });
    });
    describe("after create callbacks",function () {
      var callbacks;
      beforeEach(function(){
        callbacks = BeautifulProperties.Events.getCallbacks(targetObject,true);
      });
      describe("no create argument",function () {
        it("callbacks is retrieved",function () {
          expect(BeautifulProperties.Events.getCallbacks(targetObject)).toBeDefined();
        });
        it("retrieved callbacks is same",function () {
          expect(BeautifulProperties.Events.getCallbacks(targetObject)).toBe(callbacks);
        });
      });
      describe("create argument is false",function () {
        it("callbacks is retrieved",function () {
          expect(BeautifulProperties.Events.getCallbacks(targetObject,false)).toBeDefined();
        });
        it("retrieved callbacks is same",function () {
          expect(BeautifulProperties.Events.getCallbacks(targetObject,false)).toBe(callbacks);
        });
      });
      describe("create argument is true",function () {
        it("callbacks is retrieved",function () {
          expect(BeautifulProperties.Events.getCallbacks(targetObject,true)).toBeDefined();
        });
        it("retrieved callbacks is same",function () {
          expect(BeautifulProperties.Events.getCallbacks(targetObject,true)).toBe(callbacks);
        });
      });
      it("internalObject exists",function () {
        expect(targetObject[BeautifulProperties.internalObjectKey]).toBeDefined();
      });
      it("internalObject is not enumerable",function () {
        for (var key in targetObject) {
          expect(key).not.toBe(BeautifulProperties.internalObjectKey);
        }
      });
    });

  });
  describe("on",function () {
    var targetPrototype,targetObject;
    beforeEach(function(){
      targetPrototype = Object.create(null);
      targetObject = Object.create(targetPrototype);
    });
    describe("no context argument",function () {
      describe("trigger",function () {
        it("callback's context is trrigger target object",function () {
          var spy = jasmine.createSpy();
          BeautifulProperties.Events.on(targetObject,'test',function (){
            expect(this).toBe(targetObject);
            spy();
          });
          BeautifulProperties.Events.trigger(targetObject,'test');
          expect(spy).toHaveBeenCalled();
        });
      });
      describe("triggerWithBubbling",function () {
        it("callback's context is trrigger target object",function () {
          var spy = jasmine.createSpy();
          BeautifulProperties.Events.on(targetPrototype,'test',function (){
            expect(this).toBe(targetObject);
            spy();
          });
          BeautifulProperties.Events.triggerWithBubbling(targetObject,'test');
          expect(spy).toHaveBeenCalled();
        });
      });
    });
    describe("with context argument",function () {
      var contextObject;
      beforeEach(function(){
        contextObject = Object.create(null);
      });
      describe("trigger",function () {
        it("callback's context is bound context object",function () {
          var spy = jasmine.createSpy();
          BeautifulProperties.Events.on(targetObject,'test',function (){
            expect(this).toBe(contextObject);
            spy();
          },contextObject);
          BeautifulProperties.Events.trigger(targetObject,'test');
          expect(spy).toHaveBeenCalled();
        });
      });
      describe("triggerWithBubbling",function () {
        it("callback's context is bound context object",function () {
          var spy = jasmine.createSpy();
          BeautifulProperties.Events.on(targetPrototype,'test',function (){
            expect(this).toBe(contextObject);
            spy();
          },contextObject);
          BeautifulProperties.Events.trigger(targetObject,'test');
          expect(spy).toHaveBeenCalled();
        });
      });
    });
  });
  describe("trigger",function () {
    var targetObject;
    beforeEach(function(){
      targetObject = Object.create(null);
    });
    describe("call",function () {
      var callbackSpy;
      beforeEach(function(){
        callbackSpy = jasmine.createSpy('callbackSpy');
        BeautifulProperties.Events.on(targetObject,'test',callbackSpy);
      });
      it("with no arguments",function(){
        BeautifulProperties.Events.trigger(targetObject,'test');
        expect(callbackSpy).toHaveBeenCalledWith();
      });
      it("with arguments",function(){
        BeautifulProperties.Events.trigger(targetObject,'test',1,'2');
        expect(callbackSpy).toHaveBeenCalledWith(1,'2');
      });
    });
    describe("triggerWithBubbling",function () {
      var targetPrototype1,targetPrototype2,targetObject;
      beforeEach(function(){
        targetPrototype1 = Object.create(null);
        targetPrototype2 = Object.create(targetPrototype1)
        targetObject = Object.create(targetPrototype2);
      });
      describe("call",function () {
        var callbackSpy1,callbackSpy2,callbackSpy3;
        beforeEach(function(){
          callbackSpy1 = jasmine.createSpy('callbackSpy1');
          callbackSpy2 = jasmine.createSpy('callbackSpy2');
          callbackSpy3 = jasmine.createSpy('callbackSpy3');
          BeautifulProperties.Events.on(targetPrototype1,'test',callbackSpy1);
          BeautifulProperties.Events.on(targetPrototype2,'test',callbackSpy2);
          BeautifulProperties.Events.on(targetObject,'test',callbackSpy3);
        });
        it("with no arguments",function(){
          BeautifulProperties.Events.triggerWithBubbling(targetObject,'test');
          expect(callbackSpy1).toHaveBeenCalledWith();
          expect(callbackSpy2).toHaveBeenCalledWith();
          expect(callbackSpy3).toHaveBeenCalledWith();
        });
        it("with arguments",function(){
          BeautifulProperties.Events.triggerWithBubbling(targetObject,'test',1,'2');
          expect(callbackSpy1).toHaveBeenCalledWith(1,'2');
          expect(callbackSpy2).toHaveBeenCalledWith(1,'2');
          expect(callbackSpy3).toHaveBeenCalledWith(1,'2');
        });
      });
    });
  });
});