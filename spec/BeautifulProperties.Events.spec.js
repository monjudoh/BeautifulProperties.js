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
  describe("BeautifulProperties.Events", function() {
    var Array_from = (function () {
      return function(arrayLike) {
        var slice = Array.prototype.slice;
        return slice.call(arrayLike);
      };
    })();
    describe("on",function () {
      var targetPrototype,targetObject;
      var spy;
      beforeEach(function(){
        targetPrototype = Object.create(null);
        targetObject = Object.create(targetPrototype);
        spy = sinon.spy();
      });
      describe("no thisObject argument",function () {
        describe("trigger",function () {
          it("callback's this is trrigger target object",function () {
            BeautifulProperties.Events.on(targetObject, 'test', function () {
              assert(this === targetObject);
              spy();
            });
            BeautifulProperties.Events.trigger(targetObject,'test');
            assert(spy.called);
          });
        });
      });
      describe("with thisObject argument",function () {
        var thisObject;
        beforeEach(function(){
          thisObject = Object.create(null);
        });
        describe("trigger",function () {
          it("callback's this is bound thisObject",function () {
            BeautifulProperties.Events.on(targetObject, 'test', function () {
              assert(this === thisObject);
              spy();
            }, {thisObject : thisObject});
            BeautifulProperties.Events.trigger(targetObject,'test');
            assert(spy.called);
          });
          it("callback's this is bound context object",function () {
            BeautifulProperties.Events.on(targetObject, 'test', function () {
              assert(this === thisObject);
              spy();
            }, {thisObject : thisObject});
            BeautifulProperties.Events.trigger(targetObject,'test');
            assert(spy.called);
          });
        });
      });
      describe("multiple binding",function () {
        it("",function () {
          BeautifulProperties.Events.on(targetObject, ['test1','test2'], spy);
          BeautifulProperties.Events.trigger(targetObject,'test1');
          BeautifulProperties.Events.trigger(targetObject,'test2');
          assert(spy.callCount === 2);
        });
      });
    });
    describe("off",function () {
      var targetPrototype,targetObject;
      var triggerAll;
      var spy1,spy1_1,spy2,spy3;
      beforeEach(function(){
        targetPrototype = Object.create(null);
        targetObject = Object.create(targetPrototype);

        spy1 = sinon.spy();
        spy1_1 = sinon.spy();
        spy2 = sinon.spy();
        spy3 = sinon.spy();
        BeautifulProperties.Events.on(targetObject, 'test1', spy1);
        BeautifulProperties.Events.on(targetObject, 'test1', spy1_1);
        BeautifulProperties.Events.on(targetObject, 'test2', spy2);
        BeautifulProperties.Events.on(targetObject, 'test3', spy3);
        triggerAll = function () {
          BeautifulProperties.Events.trigger(targetObject,'test1');
          BeautifulProperties.Events.trigger(targetObject,'test2');
          BeautifulProperties.Events.trigger(targetObject,'test3');
        };
      });
      describe("with only object argument",function(){
        beforeEach(function(){
          BeautifulProperties.Events.off(targetObject);
          triggerAll();
        });
        it("all handlers are unbound.",function(){
          assert(!spy1.called);
          assert(!spy1_1.called);
          assert(!spy2.called);
          assert(!spy3.called);
        });
      });
      describe("with object,eventType arguments",function(){
        describe("eventType argument is single eventType",function(){
          beforeEach(function(){
            BeautifulProperties.Events.off(targetObject,'test1');
            triggerAll();
          });
          it("handlers related with given eventType are unbound.",function(){
            assert(!spy1.called);
            assert(!spy1_1.called);
            assert(spy2.called);
            assert(spy3.called);
          });
        });
        describe("eventType argument is eventTypes",function(){
        });
      });
      describe("with object,eventType,handler arguments",function(){
        beforeEach(function(){
          BeautifulProperties.Events.off(targetObject,'test1',spy1);
          triggerAll();
        });
        it("handler related with given eventType,handler is unbound.",function(){
          assert(!spy1.called);
          assert(spy1_1.called);
          assert(spy2.called);
          assert(spy3.called);
        });
      });
      describe("with object,eventType,handler arguments and thisObject option",function(){
        beforeEach(function(){
          var thisObject = Object.create(null);
          BeautifulProperties.Events.on(targetObject,'test1',spy1,{thisObject:thisObject});
          BeautifulProperties.Events.on(targetObject,'test1',spy1,{thisObject:thisObject});
          BeautifulProperties.Events.off(targetObject,'test1',spy1,{thisObject:thisObject});
          triggerAll();
        });
        it("handlers related with given eventType,handler,thisObject is unbound.",function(){
          assert(spy1.callCount === 1);
          assert(spy1_1.called);
          assert(spy2.called);
          assert(spy3.called);
        });
      });
      describe("with object,handler arguments",function(){
        beforeEach(function(){
          BeautifulProperties.Events.on(targetObject, 'test2', spy1);
          BeautifulProperties.Events.off(targetObject,null,spy1);
          triggerAll();
        });
        it("handlers related with given handler are unbound.",function(){
          assert(!spy1.called);
          assert(spy1_1.called);
          assert(spy2.called);
          assert(spy3.called);
        });
      });
      describe("multiple unbinding",function () {
        it("",function () {
          var spy = sinon.spy();
          BeautifulProperties.Events.on(targetObject, ['test1','test2'], spy);
          BeautifulProperties.Events.off(targetObject, ['test1','test2'], spy);
          BeautifulProperties.Events.trigger(targetObject,'test1');
          BeautifulProperties.Events.trigger(targetObject,'test2');
          assert(!spy.called);
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
          targetPrototype2 = Object.create(targetPrototype1);
          targetObject = Object.create(targetPrototype2);
        });

        describe("call",function () {
          var callbackSpy;
          beforeEach(function(){
            callbackSpy = sinon.spy();
            BeautifulProperties.Events.on(targetObject,'test',callbackSpy);
          });
          it("with no arguments",function(){
            options.exercise(targetObject,'test');
            assert(callbackSpy.calledWith(sinon.match.instanceOf(BeautifulProperties.Events.Event)));
          });
          it("with arguments",function(){
            options.exercise(targetObject,'test',1,'2');
            assert(callbackSpy.calledWith(sinon.match.instanceOf(BeautifulProperties.Events.Event),1,'2'));
          });
        });
        describe("bubbles",function () {
          var callbackSpy1,callbackSpy2,callbackSpy3;
          beforeEach(function(){
            callbackSpy1 = sinon.spy();
            callbackSpy2 = sinon.spy();
            callbackSpy3 = sinon.spy();
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
                assert(!callbackSpy1.called);
                assert(!callbackSpy2.called);
              });
              it("with arguments",function(){
                options.exercise(targetObject,'test',1,'2');
                assert(!callbackSpy1.called);
                assert(!callbackSpy2.called);
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
            callbackSpy1 = sinon.spy();
            callbackSpy2 = sinon.spy();
            callbackSpy3 = sinon.spy();
          });
          describe("event handler is bound to all object in the prototype chain.",function(){
            beforeEach(function(){
              BeautifulProperties.Events.on(targetPrototype1,'test',callbackSpy1);
              BeautifulProperties.Events.on(targetPrototype2,'test',callbackSpy2);
              BeautifulProperties.Events.on(targetObject,'test',callbackSpy3);
            });
            it("with no arguments",function(){
              options.exercise(targetObject,'test');
              assert(callbackSpy1.calledWith(sinon.match.instanceOf(BeautifulProperties.Events.Event)));
              assert(callbackSpy2.calledWith(sinon.match.instanceOf(BeautifulProperties.Events.Event)));
              assert(callbackSpy3.calledWith(sinon.match.instanceOf(BeautifulProperties.Events.Event)));
            });
            it("with arguments",function(){
              options.exercise(targetObject,'test',1,'2');
              assert(callbackSpy1.calledWith(sinon.match.instanceOf(BeautifulProperties.Events.Event),1,'2'));
              assert(callbackSpy2.calledWith(sinon.match.instanceOf(BeautifulProperties.Events.Event),1,'2'));
              assert(callbackSpy3.calledWith(sinon.match.instanceOf(BeautifulProperties.Events.Event),1,'2'));
            });
          });

        });
        describe("Event",function(){
          describe("#stopPropagation()",function(){
            var callbackSpy1,callbackSpy3;
            beforeEach(function(){
              callbackSpy1 = sinon.spy();
              callbackSpy3 = sinon.spy();
              BeautifulProperties.Events.on(targetPrototype1,'test',callbackSpy1);
              BeautifulProperties.Events.on(targetPrototype2,'test',function(ev){
                ev.stopPropagation();
              });
              BeautifulProperties.Events.on(targetObject,'test',callbackSpy3);
            });
            it("should stop event propagation.",function(){
              options.exercise(targetObject,'test');
              assert(!callbackSpy1.called);
              assert(callbackSpy3.calledWith(sinon.match.instanceOf(BeautifulProperties.Events.Event)));
            })
          });
          describe("#target",function(){
            var event;
            it("ev.target is always targetObject.",function(){
              BeautifulProperties.Events.on(targetPrototype1,'test',function(ev){
                assert(ev.target === targetObject);
                event = ev;
              });
              BeautifulProperties.Events.on(targetPrototype2,'test',function(ev){
                assert(ev.target === targetObject);
              });
              BeautifulProperties.Events.on(targetObject,'test',function(ev){
                assert(ev.target === targetObject);
              });
              options.exercise(targetObject,'test');
              assert(event.target === targetObject);
            })
          });
          describe("#currentTarget",function(){
            var event;
            it("ev.currentTarget is the object that is bound to event handler.",function(){
              BeautifulProperties.Events.on(targetPrototype1,'test',function(ev){
                assert(ev.currentTarget === targetPrototype1);
                event = ev;
              });
              BeautifulProperties.Events.on(targetPrototype2,'test',function(ev){
                assert(ev.currentTarget === targetPrototype2);
              });
              BeautifulProperties.Events.on(targetObject,'test',function(ev){
                assert(ev.currentTarget === targetObject);
              });
              options.exercise(targetObject,'test');
              assert(event.currentTarget === null);
            })
          });
        });

      });
    })
  });
});