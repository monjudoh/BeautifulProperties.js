(function (fn) {
  if (typeof define === 'function' && typeof define.amd == 'object' && define.amd) {
    // in AMD
    define(['BeautifulProperties'],function(BeautifulProperties){
      fn(BeautifulProperties);
    });
  } else if (typeof require === 'function') {
    // in node
    fn(require('../dist/cjs/BeautifulProperties'));
  } else {
    fn(BeautifulProperties);
  }
})(function (BeautifulProperties) {
  describe("BeautifulProperties.Events", function() {
    var Array_from = (function () {
      return function(arrayLike) {
        var slice = Array.prototype.slice;
        return slice.call(arrayLike);
      };
    })();
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
            BeautifulProperties.Events.on(targetObject, 'test', function () {
              expect(this).toBe(targetObject);
              spy();
            });
            BeautifulProperties.Events.trigger(targetObject,'test');
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
            BeautifulProperties.Events.on(targetObject, 'test', function () {
              expect(this).toBe(contextObject);
              spy();
            }, {context : contextObject});
            BeautifulProperties.Events.trigger(targetObject,'test');
            expect(spy).toHaveBeenCalled();
          });
        });
      });
    });
    [{
      desc:"trigger bubbles:false",
      exercise:function(targetObject,eventType){
        var args = Array_from(arguments);
        args[1] = {
          bubbles:false,
          type:eventType
        };
        BeautifulProperties.Events.trigger.apply(BeautifulProperties.Events,args);
      }
    }].forEach(function(options){
      describe(options.desc,function () {
        var targetPrototype1,targetPrototype2,targetObject;
        beforeEach(function(){
          targetPrototype1 = Object.create(null);
          targetPrototype2 = Object.create(targetPrototype1)
          targetObject = Object.create(targetPrototype2);
        });

        describe("call",function () {
          var callbackSpy;
          beforeEach(function(){
            callbackSpy = jasmine.createSpy('callbackSpy');
            BeautifulProperties.Events.on(targetObject,'test',callbackSpy);
          });
          it("with no arguments",function(){
            options.exercise(targetObject,'test');
            expect(callbackSpy).toHaveBeenCalledWith(jasmine.any(BeautifulProperties.Events.Event));
          });
          it("with arguments",function(){
            options.exercise(targetObject,'test',1,'2');
            expect(callbackSpy).toHaveBeenCalledWith(jasmine.any(BeautifulProperties.Events.Event),1,'2');
          });
        });
        describe("bubbles",function () {
          var callbackSpy1,callbackSpy2,callbackSpy3;
          beforeEach(function(){
            callbackSpy1 = jasmine.createSpy('callbackSpy1');
            callbackSpy2 = jasmine.createSpy('callbackSpy2');
            callbackSpy3 = jasmine.createSpy('callbackSpy3');
          });
          [{
            desc:"event handler is bound to all objects in the prototype chain.",
            beforeEach:function(){
              BeautifulProperties.Events.on(targetPrototype1,'test',callbackSpy1);
              BeautifulProperties.Events.on(targetPrototype2,'test',callbackSpy2);
              BeautifulProperties.Events.on(targetObject,'test',callbackSpy3);
            }
          },{
            desc:"event handler is bound to only prototype objects.",
            beforeEach:function(){
              BeautifulProperties.Events.on(targetPrototype1,'test',callbackSpy1);
              BeautifulProperties.Events.on(targetPrototype2,'test',callbackSpy2);
            }
          }].forEach(function(options2){
            describe(options2.desc,function(){
              beforeEach(options2.beforeEach);
              it("with no arguments",function(){
                options.exercise(targetObject,'test');
                expect(callbackSpy1).not.toHaveBeenCalled();
                expect(callbackSpy2).not.toHaveBeenCalled();
              });
              it("with arguments",function(){
                options.exercise(targetObject,'test',1,'2');
                expect(callbackSpy1).not.toHaveBeenCalled();
                expect(callbackSpy2).not.toHaveBeenCalled();
              });
            });
          });
        });
      });
    });
    [{
      desc:"trigger",
      exercise:function(targetObject,eventType){
        var args = Array_from(arguments);
        BeautifulProperties.Events.trigger.apply(BeautifulProperties.Events,args);
      }
    },{
      desc:"trigger bubbles:true",
      exercise:function(targetObject,eventType){
        var args = Array_from(arguments);
        args[1] = {
          bubbles:true,
          type:eventType
        };
        BeautifulProperties.Events.trigger.apply(BeautifulProperties.Events,args);
      }
    }].forEach(function(options){
      describe(options.desc,function () {
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
          });
          describe("event handler is bound to all object in the prototype chain.",function(){
            beforeEach(function(){
              BeautifulProperties.Events.on(targetPrototype1,'test',callbackSpy1);
              BeautifulProperties.Events.on(targetPrototype2,'test',callbackSpy2);
              BeautifulProperties.Events.on(targetObject,'test',callbackSpy3);
            });
            it("with no arguments",function(){
              options.exercise(targetObject,'test');
              expect(callbackSpy1).toHaveBeenCalledWith(jasmine.any(BeautifulProperties.Events.Event));
              expect(callbackSpy2).toHaveBeenCalledWith(jasmine.any(BeautifulProperties.Events.Event));
              expect(callbackSpy3).toHaveBeenCalledWith(jasmine.any(BeautifulProperties.Events.Event));
            });
            it("with arguments",function(){
              options.exercise(targetObject,'test',1,'2');
              expect(callbackSpy1).toHaveBeenCalledWith(jasmine.any(BeautifulProperties.Events.Event),1,'2');
              expect(callbackSpy2).toHaveBeenCalledWith(jasmine.any(BeautifulProperties.Events.Event),1,'2');
              expect(callbackSpy3).toHaveBeenCalledWith(jasmine.any(BeautifulProperties.Events.Event),1,'2');
            });
          });

        });
        describe("Event",function(){
          describe("#stopPropagation()",function(){
            var callbackSpy1,callbackSpy3;
            beforeEach(function(){
              callbackSpy1 = jasmine.createSpy('callbackSpy1');
              callbackSpy3 = jasmine.createSpy('callbackSpy3');
              BeautifulProperties.Events.on(targetPrototype1,'test',callbackSpy1);
              BeautifulProperties.Events.on(targetPrototype2,'test',function(ev){
                ev.stopPropagation();
              });
              BeautifulProperties.Events.on(targetObject,'test',callbackSpy3);
            });
            it("should stop event propagation.",function(){
              options.exercise(targetObject,'test');
              expect(callbackSpy1).not.toHaveBeenCalled();
              expect(callbackSpy3).toHaveBeenCalledWith(jasmine.any(BeautifulProperties.Events.Event));
            })
          });
          describe("#target",function(){
            var event;
            it("ev.target is always targetObject.",function(){
              BeautifulProperties.Events.on(targetPrototype1,'test',function(ev){
                expect(ev.target).toBe(targetObject);
                event = ev;
              });
              BeautifulProperties.Events.on(targetPrototype2,'test',function(ev){
                expect(ev.target).toBe(targetObject);
              });
              BeautifulProperties.Events.on(targetObject,'test',function(ev){
                expect(ev.target).toBe(targetObject);
              });
              options.exercise(targetObject,'test');
              expect(event.target).toBe(targetObject);
            })
          });
          describe("#currentTarget",function(){
            var event;
            it("ev.currentTarget is the object that is bound to event handler.",function(){
              BeautifulProperties.Events.on(targetPrototype1,'test',function(ev){
                expect(ev.currentTarget).toBe(targetPrototype1);
                event = ev;
              });
              BeautifulProperties.Events.on(targetPrototype2,'test',function(ev){
                expect(ev.currentTarget).toBe(targetPrototype2);
              });
              BeautifulProperties.Events.on(targetObject,'test',function(ev){
                expect(ev.currentTarget).toBe(targetObject);
              });
              options.exercise(targetObject,'test');
              expect(event.currentTarget).toBeNull();
            })
          });
        });

      });
    })
  });
});