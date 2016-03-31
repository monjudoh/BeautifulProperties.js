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
    describe(".LazyInitializable.define", function() {
      var object,spy;
      beforeEach(function(){
        object = Object.create(null);
        spy = sinon.spy();
      });
      it("define property",function(){
        var expectedValue = 1;
        assert(object['key'] === undefined);
        BeautifulProperties.LazyInitializable.define(object,'key',{
          init : function(){
            return expectedValue;
          }
        });
        assert(object['key'] === expectedValue);
      });
      it("init to have been called only after first property access",function(){
        BeautifulProperties.LazyInitializable.define(object,'key',{
          init : function (){
            spy();
            return 1;
          }
        });

        assert(!spy.called);
        object['key'];
        assert(spy.called);
      });
      it("init's this is saved",function(){
        BeautifulProperties.LazyInitializable.define(object,'key',{
          init : function (){
            assert(this === object);
            spy();
            return 1;
          }
        });
        object['key'];
        assert(spy.called);
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
          assert.deepEqual(actualDescriptor,expectedDescriptor);
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
        assert.deepEqual(actualDescriptor,expectedDescriptor);
      });

    });
  });
});