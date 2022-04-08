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
  describe("BeautifulProperties.Versionizable", function() {
    describe(".define", function() {
      var object,proto;
      beforeEach(function(){
        proto = Object.create(null);
        object = Object.create(proto);
      });
      it("define a Versionizable property.",function(){
        BeautifulProperties.Versionizable.define(object,'key');
        object.key = 1;
        object.key = 2;
        assert(BeautifulProperties.Versionizable.getPreviousValue(object,'key') === 1);
      });
      it("add Versionizable to the Hookable property.",function(){
        BeautifulProperties.Hookable.define(object,'key');
        BeautifulProperties.Versionizable.define(object,'key');
        object.key = 1;
        object.key = 2;
        assert(BeautifulProperties.Versionizable.getPreviousValue(object,'key') === 1);
      });
      it("define a Versionizable property to the object,it have a Hookable property.",function(){
        BeautifulProperties.Hookable.define(object,'key2');
        BeautifulProperties.Versionizable.define(object,'key');
        object.key = 1;
        object.key = 2;
        assert(BeautifulProperties.Versionizable.getPreviousValue(object,'key') === 1);
        object.key2 = 1;
        object.key2 = 2;
        assert(BeautifulProperties.Versionizable.getPreviousValue(object,'key2') === undefined);
      });
      it("define a Versionizable property to the prototype.",function(){
        BeautifulProperties.Versionizable.define(proto,'key');
        object.key = 1;
        object.key = 2;
        assert(BeautifulProperties.Versionizable.getPreviousValue(object,'key') === 1);
      });
    });
    describe(".getPreviousValue", function() {
      var object,proto;
      beforeEach(function(){
        proto = Object.create(null);
        object = Object.create(proto);
      });
      it("retrieve previous value of the property.",function(){
        BeautifulProperties.Versionizable.define(object,'key');
        object.key = 1;
        object.key = 2;
        object.key = 2;
        assert(BeautifulProperties.Versionizable.getPreviousValue(object,'key') === 1);
      });
    });
    describe("getVersion",function(){
      var object;
      beforeEach(function(){
        object = Object.create(null);
      });
      it("retrieve a Version object.",function(){
        BeautifulProperties.Versionizable.define(object,'key');
        object.key = 1;
        object.key = 2;
        assert(haveProperties(BeautifulProperties.Versionizable.getVersion(object,'key',0),'value','isNull','timestamp'));
        assert(BeautifulProperties.Versionizable.getVersion(object,'key',0).value === 2);
        assert(BeautifulProperties.Versionizable.getVersion(object,'key',0).isNull === false);
        assert(BeautifulProperties.Versionizable.getVersion(object,'key',1).value === 1);
        assert(BeautifulProperties.Versionizable.getVersion(object,'key',1).isNull === false);
        assert(BeautifulProperties.Versionizable.getVersion(object,'key',2).isNull === true);
      });
    });
    describe("getHistoryLength",function(){
      var object;
      beforeEach(function(){
        object = Object.create(null);
      });
      it("initial length is 0.",function(){
        BeautifulProperties.Versionizable.define(object,'key');
        assert(BeautifulProperties.Versionizable.getHistoryLength(object,'key') === 0);
      });
      it("length increase when the property value change.",function(){
        BeautifulProperties.Versionizable.define(object,'key');
        object.key = 1;
        assert(BeautifulProperties.Versionizable.getHistoryLength(object,'key') === 1);
        object.key = 2;
        assert(BeautifulProperties.Versionizable.getHistoryLength(object,'key') === 2);
      });
      it("length stop increasing to options.length.",function(){
        BeautifulProperties.Versionizable.define(object,'key',{
          length:3
        });
        object.key = 1;
        object.key = 2;
        object.key = 3;
        object.key = 4;
        assert(BeautifulProperties.Versionizable.getHistoryLength(object,'key') === 3);
      });
    });
    describe("transaction",function(){
      var object;
      beforeEach(function(){
        object = Object.create(null);
        BeautifulProperties.Versionizable.define(object,'key',{length:1000});
      });
      describe("insert",function(){
        beforeEach(function(){
          object.key = 1;
          object.key = 2;
          object.key = 3;
          object.key = 4;
          object.key = 5;
        });
        it("to the head position",function(){
          assert(havePropertiesWithValues(object,{
            key:5
          }));
          BeautifulProperties.Versionizable.transaction(object,'key',function(){
            this.insert(0,6);
          },function done(currentVersion,versions,currentVersionBeforeTransaction,versionsBeforeTransaction){
            assert(currentVersion !== currentVersionBeforeTransaction);
            assert(currentVersion === versions[0]);
            assert(havePropertiesWithValues(currentVersion,{
              value:6
            }));
          });
          assert(havePropertiesWithValues(object,{
            key:6
          }));
        });
        it("to the tail position",function(){
          assert(havePropertiesWithValues(object,{
            key:5
          }));
          BeautifulProperties.Versionizable.transaction(object,'key',function(){
            this.insert(5,6);
          },function done(currentVersion,versions,currentVersionBeforeTransaction,versionsBeforeTransaction){
            assert(currentVersion === currentVersionBeforeTransaction);
            assert(havePropertiesWithValues(versions[versions.length - 1],{
              value:6
            }));
          });
          assert(havePropertiesWithValues(object,{
            key:5
          }));
        });
      });
      describe("remove",function(){
        beforeEach(function(){
          object.key = 1;
          object.key = 2;
          object.key = 3;
          object.key = 4;
          object.key = 5;
        });
        it("the head version",function(){
          assert(havePropertiesWithValues(object,{
            key:5
          }));
          var targetVersion = BeautifulProperties.Versionizable.getVersion(object,'key',0);
          BeautifulProperties.Versionizable.transaction(object,'key',function(){
            this.remove(targetVersion);
          },function done(currentVersion,versions,currentVersionBeforeTransaction,versionsBeforeTransaction){
            assert(currentVersion !== currentVersionBeforeTransaction);
            assert(currentVersion === versions[0]);
            assert(havePropertiesWithValues(currentVersion,{
              value:4
            }));
            assert(versions.indexOf(targetVersion) === -1);
          });
          assert(havePropertiesWithValues(object,{
            key:4
          }));
        });
        it("the tail version",function(){
          assert(havePropertiesWithValues(object,{
            key:5
          }));
          var targetVersion = BeautifulProperties.Versionizable.getVersion(object,'key',4);
          BeautifulProperties.Versionizable.transaction(object,'key',function(){
            this.remove(targetVersion);
          },function done(currentVersion,versions,currentVersionBeforeTransaction,versionsBeforeTransaction){
            assert(currentVersion === currentVersionBeforeTransaction);
            assert(currentVersion === versions[0]);
            assert(havePropertiesWithValues(currentVersion,{
              value:5
            }));
            assert(versions.indexOf(targetVersion) === -1);
          });
          assert(havePropertiesWithValues(object,{
            key:5
          }));
        });
      });
    });
    describe("undo",function(){
      var object;
      beforeEach(function(){
        object = Object.create(null);
        BeautifulProperties.Versionizable.define(object,'key',{length:1000});
        object.key = 1;
        object.key = 2;
        object.key = 3;
        object.key = 4;
        object.key = 5;
      });
      it("to the previous version",function(){
        assert(BeautifulProperties.Versionizable.getHistoryLength(object,'key') === 5);
        var targetVersion = BeautifulProperties.Versionizable.getVersion(object,'key',1);
        BeautifulProperties.Versionizable.undo(object,'key',targetVersion);
        assert(object.key === targetVersion.value);
        assert(BeautifulProperties.Versionizable.getHistoryLength(object,'key') === 4);
      });
    });
    describe("Equals",function(){
      var object;
      beforeEach(function(){
        object = Object.create(null);
      });
      it("equals callback",function(){
        var equals = sinon.spy();
        BeautifulProperties.Equals.set(object,'key',function(val,previousVal){
          equals(this,val,previousVal);
          return false;
        });
        BeautifulProperties.Hookable.define(object,'key',{
          value:BeautifulProperties.Hookable.Undefined
        });
        BeautifulProperties.Versionizable.define(object,'key');
        object.key; // init
        object.key = 1;
        assert(equals.calledWith(object,1,undefined));
      });
      it("A new vesion isn't added to history when it assign 'key' property and equals return true.",function(){
        BeautifulProperties.Equals.set(object,'key',function(val,previousVal){
          return true;
        });
        BeautifulProperties.Hookable.define(object,'key',{
          value:BeautifulProperties.Hookable.Undefined
        });
        object.key; // init
        BeautifulProperties.Versionizable.define(object,'key');
        object.key = 1;
        object.key = 2;
        assert(BeautifulProperties.Versionizable.getHistoryLength(object,'key') === 0);
      });
      it("The new vesion is added to history when it assign 'key' property and equals return false.",function(){
        BeautifulProperties.Equals.set(object,'key',function(val,previousVal){
          return false;
        });
        BeautifulProperties.Hookable.define(object,'key');
        object.key; // init
        BeautifulProperties.Versionizable.define(object,'key');
        object.key = 1;
        assert(BeautifulProperties.Versionizable.getHistoryLength(object,'key') === 1);
      });
    });
  });
});