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
  function addHooks(object,key,hooks) {
    if (!BeautifulProperties.Hookable.hasHooks(object,key)) {
      throw new TypeError('The property (key:'+key+') is not a Hookable property. Hookable.addHooks is the method for a Hookable property.');
    }
    'beforeGet afterGet beforeSet afterSet refresh'.split(' ').forEach(function(hookType){
      if (hooks[hookType]) {
        BeautifulProperties.Hookable.addHook(object,key,hookType,hooks[hookType]);
      }
    });
  }
  describe("BeautifulProperties.Hookable", function() {
    describe(" hooks ",function() {
      var beforeGet,afterGet,beforeSet,afterSet,beforeInit,afterInit;
      beforeEach(function(){
        beforeGet = sinon.spy();
        afterGet = sinon.spy();
        beforeSet = sinon.spy();
        afterSet = sinon.spy();
        beforeInit = sinon.spy();
        afterInit = sinon.spy();
      });
      describe("have been or don't to have been called",function(){
        var object;
        beforeEach(function(){
          object = Object.create(null);
          BeautifulProperties.Hookable.define(object,'initializedKey',{
            value:0
          });
          object['initializedKey'];// init
          BeautifulProperties.Hookable.addHook(object,'initializedKey','beforeGet',beforeGet);
          BeautifulProperties.Hookable.addHook(object,'initializedKey','afterGet',afterGet);
          BeautifulProperties.Hookable.addHook(object,'initializedKey','beforeSet',beforeSet);
          BeautifulProperties.Hookable.addHook(object,'initializedKey','afterSet',afterSet);
          BeautifulProperties.Hookable.addHook(object,'initializedKey','beforeInit',beforeInit);
          BeautifulProperties.Hookable.addHook(object,'initializedKey','afterInit',afterInit);

          BeautifulProperties.Hookable.define(object,'notInitializedKey',{
            value:0
          });
          BeautifulProperties.Hookable.addHook(object,'notInitializedKey','beforeGet',beforeGet);
          BeautifulProperties.Hookable.addHook(object,'notInitializedKey','afterGet',afterGet);
          BeautifulProperties.Hookable.addHook(object,'notInitializedKey','beforeSet',beforeSet);
          BeautifulProperties.Hookable.addHook(object,'notInitializedKey','afterSet',afterSet);
          BeautifulProperties.Hookable.addHook(object,'notInitializedKey','beforeInit',beforeInit);
          BeautifulProperties.Hookable.addHook(object,'notInitializedKey','afterInit',afterInit);
        });
        describe("get initializedKey",function(){
          beforeEach(function(){
            object['initializedKey'];
          });
          it("beforeGet was called",function(){
            assert(beforeGet.called);
          });
          it("afterGet was called",function(){
            assert(afterGet.called);
          });
          it("beforeSet was not called",function(){
            assert(!beforeSet.called);
          });
          it("afterSet was not called",function(){
            assert(!afterSet.called);
          });
          it("beforeInit was not called",function(){
            assert(!beforeInit.called);
          });
          it("afterInit was not called",function(){
            assert(!afterInit.called);
          });
        });
        describe("get notInitializedKey",function(){
          beforeEach(function(){
            object['notInitializedKey'];
          });
          it("beforeGet was not called",function(){
            assert(beforeGet.called);
          });
          it("afterGet was not called",function(){
            assert(afterGet.called);
          });
          it("beforeSet was not called",function(){
            assert(!beforeSet.called);
          });
          it("afterSet was not called",function(){
            assert(!afterSet.called);
          });
          it("beforeInit was called",function(){
            assert(beforeInit.called);
          });
          it("afterInit was called",function(){
            assert(afterInit.called);
          });
        });
        describe("set initializedKey",function(){
          beforeEach(function(){
            object['initializedKey'] = 1;
          });
          it("beforeGet was not called",function(){
            assert(!beforeGet.called);
          });
          it("afterGet was not called",function(){
            assert(!afterGet.called);
          });
          it("beforeSet was called",function(){
            assert(beforeSet.called);
          });
          it("afterSet was called",function(){
            assert(afterSet.called);
          });
          it("beforeInit was not called",function(){
            assert(!beforeInit.called);
          });
          it("afterInit was not called",function(){
            assert(!afterInit.called);
          });
        });
        describe("set notInitializedKey",function(){
          beforeEach(function(){
            object['notInitializedKey'] = 1;
          });
          it("beforeGet was not called",function(){
            assert(!beforeGet.called);
          });
          it("afterGet was not called",function(){
            assert(!afterGet.called);
          });
          it("beforeSet was not called",function(){
            assert(beforeSet.called);
          });
          it("afterSet was not called",function(){
            assert(afterSet.called);
          });
          it("beforeInit was called",function(){
            assert(beforeInit.called);
          });
          it("afterInit was called",function(){
            assert(afterInit.called);
          });
        });
        describe("getRaw",function(){
          beforeEach(function(){
            BeautifulProperties.Hookable.getRaw(object,'initializedKey');
          });
          it("beforeGet was called",function(){
            assert(!beforeGet.called);
          });
          it("afterGet was called",function(){
            assert(!afterGet.called);
          });
          it("beforeSet was not called",function(){
            assert(!beforeSet.called);
          });
          it("afterSet was not called",function(){
            assert(!afterSet.called);
          });
          it("beforeInit was not called",function(){
            assert(!beforeInit.called);
          });
          it("afterInit was not called",function(){
            assert(!afterInit.called);
          });
        });
        describe("setRaw",function(){
          beforeEach(function(){
            BeautifulProperties.Hookable.setRaw(object,'initializedKey',1);
          });
          it("beforeGet was called",function(){
            assert(!beforeGet.called);
          });
          it("afterGet was called",function(){
            assert(!afterGet.called);
          });
          it("beforeSet was not called",function(){
            assert(!beforeSet.called);
          });
          it("afterSet was not called",function(){
            assert(!afterSet.called);
          });
          it("value could getRaw",function(){
            assert(BeautifulProperties.Hookable.getRaw(object,'initializedKey') === 1);
          });
          it("beforeInit was not called",function(){
            assert(!beforeInit.called);
          });
          it("afterInit was not called",function(){
            assert(!afterInit.called);
          });
        });
      });
      describe("afterGet could replace get value",function(){
        var object,originalValue,replacement,hooks;
        beforeEach(function(){
          object = Object.create(null);
          hooks = Object.create(null);
          hooks.beforeGet = beforeGet;
          originalValue = 1;
          hooks.afterGet = function (val){
            afterGet(val);
            return replacement;
          };
        });
        describe("hooks",function(){
          beforeEach(function(){
            replacement = 2;
            BeautifulProperties.Hookable.define(object,'key');
            object['key'] = originalValue;
            addHooks(object,'key',hooks);
            object['key'];
          });
          it("beforeGet to have been called with no arguments",function(){
            assert(beforeGet.called);
          });
          it("afterGet to have been called with originalValue",function(){
            assert(afterGet.calledWith(originalValue));
          });
        });
        describe("afterGet's return value isn't undefined",function(){
          beforeEach(function(){
            replacement = 2;
            BeautifulProperties.Hookable.define(object,'key');
            object['key'] = originalValue;
            addHooks(object,'key',hooks);
          });
          it("value should be replaced",function(){
            assert(object['key'] === replacement);
          });
        });
        describe("afterGet's return value is undefined",function(){
          beforeEach(function(){
            replacement = undefined;
            BeautifulProperties.Hookable.define(object,'key');
            addHooks(object,'key',hooks);
            object['key'] = originalValue;
          });
          it("value should not be replaced",function(){
            assert(object['key'] === originalValue);
          });
        });
        describe("afterGet's return value is Hookable.Undefined",function(){
          beforeEach(function(){
            replacement = BeautifulProperties.Hookable.Undefined;
            hooks.afterGet = function (val){
              afterGet(val);
              return replacement;
            };
            BeautifulProperties.Hookable.define(object,'key');
            addHooks(object,'key',hooks);
            BeautifulProperties.Hookable.setRaw(object,'key',originalValue);
          });
          it("value should not be replaced to undefined",function(){
            assert(object['key'] === undefined);
          });
        });
      });
      describe("beforeSet could replace set value",function(){
        var object,originalValue,replacement,previousValue,hooks;
        beforeEach(function(){
          object = Object.create(null);
          hooks = Object.create(null);
          hooks.beforeSet = function (val,previousVal){
            beforeSet(val,previousVal);
            return replacement;
          };
          hooks.afterSet = afterSet;
          previousValue = 0;
          originalValue = 1;
        });
        describe("hooks",function(){
          beforeEach(function(){
            replacement = 2;
            BeautifulProperties.Hookable.define(object,'key');
            object['key'] = undefined;
            addHooks(object,'key',hooks);
            BeautifulProperties.Hookable.setRaw(object,'key',previousValue);
            object['key'] = originalValue;
          });
          it("beforeSet to have been called with no originalValue,previousValue",function(){
            assert(beforeSet.calledWith(originalValue,previousValue));
          });
          it("afterSet to have been called with replacement,previousValue",function(){
            assert(afterSet.calledWith(replacement,previousValue));
          });
        });
        describe("return value isn't undefined",function(){
          beforeEach(function(){
            replacement = 2;
            BeautifulProperties.Hookable.define(object,'key');
            object['key'] = undefined;
            addHooks(object,'key',hooks);
            BeautifulProperties.Hookable.setRaw(object,'key',previousValue);
            object['key'] = originalValue;
          });
          it("value should be replaced",function(){
            assert(BeautifulProperties.Hookable.getRaw(object,'key') === replacement);
          });
        });
        describe("return value is undefined",function(){
          beforeEach(function(){
            replacement = undefined;
            BeautifulProperties.Hookable.define(object,'key');
            addHooks(object,'key',hooks);
            BeautifulProperties.Hookable.setRaw(object,'key',previousValue);
            object['key'] = originalValue;
          });
          it("value should not be replaced",function(){
            assert(BeautifulProperties.Hookable.getRaw(object,'key') === originalValue);
          });
        });
        describe("return value is Hookable.Undefined",function(){
          beforeEach(function(){
            replacement = BeautifulProperties.Hookable.Undefined;
            BeautifulProperties.Hookable.define(object,'key');
            object['key'] = previousValue;
            addHooks(object,'key',hooks);
            object['key'] = originalValue;
          });
          it("value should not be replaced to undefined",function(){
            assert(BeautifulProperties.Hookable.getRaw(object,'key') === undefined);
          });
        });
      });
    });
    describe(".define", function() {
      var object;
      beforeEach(function(){
        object = Object.create(null);
      });
      it("define property",function(){
        assert(!haveProperties(object, 'key'));
        BeautifulProperties.Hookable.define(object,'key');
        assert(haveProperties(object, 'key'));
      });
      // generic
      describe("enumerable",function(){
        it("false",function(){
          BeautifulProperties.Hookable.define(object,'key',{
            value:1,
            enumerable:false
          });
          assert(haveOwnPropertiesWithValues(Object.getOwnPropertyDescriptor(object,'key'),{
            enumerable:false
          }));
        });
        it("true",function(){
          BeautifulProperties.Hookable.define(object,'key',{
            value:1,
            enumerable:true
          });
          assert(haveOwnPropertiesWithValues(Object.getOwnPropertyDescriptor(object,'key'),{
            enumerable:true
          }));
        });
      });
      describe("configurable",function(){
        it("false",function(){
          BeautifulProperties.Hookable.define(object,'key',{
            value:1,
            configurable:false
          });
          assert(haveOwnPropertiesWithValues(Object.getOwnPropertyDescriptor(object,'key'),{
            configurable:false
          }));
        });
        it("true",function(){
          BeautifulProperties.Hookable.define(object,'key',{
            value:1,
            configurable:true
          });
          assert(haveOwnPropertiesWithValues(Object.getOwnPropertyDescriptor(object,'key'),{
            configurable:true
          }));
        });
      });
      // data
      describe("value",function(){
        it("could set initial value.",function(){
          BeautifulProperties.Hookable.define(object,'key',{
            value:1
          });
          assert(object['key'] === 1);
        });
        it("could set initial value.",function(){
          BeautifulProperties.Hookable.define(object,'key',{
            value:0
          });
          assert(object['key'] === 0);
        });
      });
      describe("writable=false (readonly)",function(){
        describe("value",function(){
          beforeEach(function(){
            BeautifulProperties.Hookable.define(object,'key',{
              value:1,
              writable:false
            });
          });
          it("could set initial value.",function(){
            assert(object['key'] === 1);
          });
          it("could not overwrite value.",function(){
            object['key'] = 2;
            assert(object['key'] === 1);
          });
        });
        describe("init",function(){
          var descriptor;
          beforeEach(function(){
            BeautifulProperties.Hookable.define(object,'key',{
              init:function(){
                return 1;
              },
              writable:false
            });
          });
          it("could set initial value.",function(){
            assert(object['key'] === 1);
          });
          it("could not overwrite value.",function(){
            object['key'] = 2;
            assert(object['key'] === 1);
          });
        });
      });
      // accessor
      describe("get",function(){
        var hooks,refresh;
        beforeEach(function(){
          hooks = Object.create(null);
          refresh = sinon.spy();
        });
        describe("",function(){
          beforeEach(function(){
            BeautifulProperties.Hookable.define(object,'key',{
              get:function(){
                return 1;
              }
            });
            addHooks(object,'key',hooks);
          });
          it("object could get value.",function(){
            assert(object['key'] === 1);
          });
          it("sub object could get value.",function(){
            var subObject = Object.create(object);
            assert(subObject['key'] === 1);
          });
        });
        describe("refresh hook should be called",function(){
          beforeEach(function(){
            hooks.refresh = refresh;
            BeautifulProperties.Hookable.define(object,'key',{
              get:function(){
                return 1;
              }
            });
            object['key']; // init
            addHooks(object,'key',hooks);
          });
          it(" when refreshProperty is called.",function(){
            BeautifulProperties.Hookable.Get.refreshProperty(object,'key');
            assert(refresh.calledWith(1,1));
          });
          it(" when property is accessed.",function(){
            object['key'];
            assert(refresh.calledWith(1,1));
          });
        });
        it("Get.getSilently skip refresh hook.",function(){
          hooks.refresh = refresh;
          BeautifulProperties.Hookable.define(object,'key',{
            get:function(){
              return 1;
            }
          });
          addHooks(object,'key',hooks);
          assert(BeautifulProperties.Hookable.Get.getSilently(object,'key') === 1);
          assert(!refresh.calledWith(1,undefined));
        });
      });
      describe("set",function(){
        var hooks,set,refresh;
        beforeEach(function(){
          hooks = Object.create(null);
          set = sinon.spy();
          refresh = sinon.spy();
        });
        describe("write only",function(){
          beforeEach(function(){
            hooks.refresh = refresh;
            BeautifulProperties.Hookable.define(object,'key',{
              set:set
            });

            addHooks(object,'key',hooks);
          });
          it(" when property is accessed.",function(){
            object['key'] = 1;
            assert(set.calledWith(1));
          });
          it("refresh hook shouldn't be called when property is accessed.",function(){
            object['key'] = 1;
            assert(!refresh.calledWith(1));
          });
        });
        describe("rw",function(){
          beforeEach(function(){
            hooks.refresh = refresh;
            var value;
            BeautifulProperties.Hookable.define(object,'key',{
              set:function(val){
                value = val;
              },get:function(){
                return value;
              }
            });
            object['key'] = 0; // init
            addHooks(object,'key',hooks);
          });
          it("refresh hook should be called when property is accessed.",function(){
            object['key'] = 1;
            assert(refresh.calledWith(1,0));
          });
        });
      });
    });
    describe(("redefine"),function(){
      var objectData,objectAccessor;
      beforeEach(function(){
        objectData = Object.create(null);
        objectAccessor = Object.create(null);
      });
      describe("configurable:true",function(){
        describe("generic descriptor",function(){
          beforeEach(function(){
            BeautifulProperties.Hookable.define(objectData,'key',{
              configurable:true,
              enumerable:false,
              value:1
            });
            BeautifulProperties.Hookable.define(objectAccessor,'key',{
              configurable:true,
              enumerable:false,
              get:function(){
                return 1;
              }
            });
          });
          describe("can modify",function(){
            beforeEach(function(){
              BeautifulProperties.Hookable.define(objectData,'key',{
                enumerable:true,
                configurable:false
              });
              BeautifulProperties.Hookable.define(objectAccessor,'key',{
                enumerable:true,
                configurable:false
              });
            });
            it("enumerable",function(){
              assert(haveOwnPropertiesWithValues(Object.getOwnPropertyDescriptor(objectData,'key'),{
                enumerable:true
              }));
              assert(haveOwnPropertiesWithValues(Object.getOwnPropertyDescriptor(objectAccessor,'key'),{
                enumerable:true
              }));
            });
            it("configurable",function(){
              assert(haveOwnPropertiesWithValues(Object.getOwnPropertyDescriptor(objectData,'key'),{
                configurable:false
              }));
              assert(haveOwnPropertiesWithValues(Object.getOwnPropertyDescriptor(objectAccessor,'key'),{
                configurable:false
              }));
              // configurable:false
              assert.throws(function(){
                // redefine
                BeautifulProperties.Hookable.define(objectData,'key',{
                  enumerable:false
                });
              });
              assert.throws(function(){
                // redefine
                BeautifulProperties.Hookable.define(objectAccessor,'key',{
                  set:function(){
                    1 + 2;
                  }
                });
              });
            });
          })
        });
        describe("same descriptor",function(){
          var set;
          beforeEach(function(){
            BeautifulProperties.Hookable.define(objectData,'key',{
              configurable:true,
              enumerable:false,
              writable:false,
              value:1
            });
            BeautifulProperties.Hookable.define(objectAccessor,'key',{
              configurable:true,
              enumerable:false,
              get:function(){
                return 1;
              }
            });
            set = sinon.spy();
          });
          describe("can modify",function(){
            beforeEach(function(){
              BeautifulProperties.Hookable.define(objectData,'key',{
                enumerable:true,
                configurable:false,
                writable:true,
                value:2
              });
              BeautifulProperties.Hookable.define(objectAccessor,'key',{
                enumerable:true,
                configurable:false,
                get:function(){
                  return 4;
                },
                set:set
              });
            });
            // generic
            it("enumerable",function(){
              assert(haveOwnPropertiesWithValues(Object.getOwnPropertyDescriptor(objectData,'key'),{
                enumerable:true
              }));
              assert(haveOwnPropertiesWithValues(Object.getOwnPropertyDescriptor(objectAccessor,'key'),{
                enumerable:true
              }));
            });
            it("configurable",function(){
              assert(haveOwnPropertiesWithValues(Object.getOwnPropertyDescriptor(objectData,'key'),{
                configurable:false
              }));
              assert(haveOwnPropertiesWithValues(Object.getOwnPropertyDescriptor(objectAccessor,'key'),{
                configurable:false
              }));
              // configurable:false
              assert.throws(function(){
                // redefine
                BeautifulProperties.Hookable.define(objectData,'key',{
                  enumerable:false
                });
              });
              assert.throws(function(){
                // redefine
                BeautifulProperties.Hookable.define(objectAccessor,'key',{
                  set:function(){
                    1 + 2;
                  }
                });
              });
            });
            // data
            it("value",function(){
              assert(haveOwnPropertiesWithValues(objectData,{
                key:2
              }));
            });
            it("writable",function(){
              objectData.key = 3;
              assert(haveOwnPropertiesWithValues(objectData,{
                key:3
              }));
            });
            // accessor
            it("get",function(){
              assert(haveOwnPropertiesWithValues(objectAccessor,{
                key:4
              }));
            });
            it("set",function(){
              objectAccessor.key = 3;
              assert(set.calledWith(3));
            });
          })
        });
        describe("different descriptor",function(){
          var set;
          beforeEach(function(){
            BeautifulProperties.Hookable.define(objectData,'key',{
              configurable:true,
              enumerable:false,
              writable:false,
              value:1
            });
            BeautifulProperties.Hookable.define(objectAccessor,'key',{
              configurable:true,
              enumerable:false,
              get:function(){
                return 1;
              }
            });
            set = sinon.spy();
          });
          describe("can modify",function(){
            beforeEach(function(){
              BeautifulProperties.Hookable.define(objectAccessor,'key',{
                enumerable:true,
                configurable:false,
                writable:true,
                value:2
              });
              BeautifulProperties.Hookable.define(objectData,'key',{
                enumerable:true,
                configurable:false,
                get:function(){
                  return 4;
                },
                set:set
              });
            });
            // generic
            it("enumerable",function(){
              assert(haveOwnPropertiesWithValues(Object.getOwnPropertyDescriptor(objectData,'key'),{
                enumerable:true
              }));
              assert(haveOwnPropertiesWithValues(Object.getOwnPropertyDescriptor(objectAccessor,'key'),{
                enumerable:true
              }));
            });
            it("configurable",function(){
              assert(haveOwnPropertiesWithValues(Object.getOwnPropertyDescriptor(objectData,'key'),{
                configurable:false
              }));
              assert(haveOwnPropertiesWithValues(Object.getOwnPropertyDescriptor(objectAccessor,'key'),{
                configurable:false
              }));
              // configurable:false
              assert.throws(function(){
                // redefine
                BeautifulProperties.Hookable.define(objectAccessor,'key',{
                  enumerable:false
                });
              });
              assert.throws(function(){
                // redefine
                BeautifulProperties.Hookable.define(objectData,'key',{
                  set:function(){
                    1 + 2;
                  }
                });
              });
            });
            // data
            it("value",function(){
              assert(haveOwnPropertiesWithValues(objectAccessor,{
                key:2
              }));
            });
            it("writable",function(){
              objectAccessor.key = 3;
              assert(haveOwnPropertiesWithValues(objectAccessor,{
                key:3
              }));
            });
            // accessor
            it("get",function(){
              assert(haveOwnPropertiesWithValues(objectData,{
                key:4
              }));
            });
            it("set",function(){
              objectData.key = 3;
              assert(set.calledWith(3));
            });
          })
        });
      });
      describe("configurable:false",function(){
        describe("writable:true",function(){
          beforeEach(function(){
            BeautifulProperties.Hookable.define(objectData,'key',{
              configurable:false,
              writable:true,
              value:1
            });
          });
          it("can modify writable true to false",function(){
            objectData.key = 2;
            assert(havePropertiesWithValues(objectData,{
              key:2
            }));
            // redefine
            BeautifulProperties.Hookable.define(objectData,'key',{
              writable:false
            });
            objectData.key = 3;
            assert(havePropertiesWithValues(objectData,{
              key:2
            }));
          });
          it("can modify value",function(){
            // redefine
            BeautifulProperties.Hookable.define(objectData,'key',{
              value:2
            });
            assert(havePropertiesWithValues(objectData,{
              key:2
            }));
          });

        });
        describe("can't modify",function(){
          beforeEach(function(){
            BeautifulProperties.Hookable.define(objectData,'key',{
              configurable:false,
              writable:false,
              enumerable:false,
              value:1
            });
            BeautifulProperties.Hookable.define(objectAccessor,'key',{
              configurable:false,
              get:function(){
                return 1;
              },
              set:function(){
                1+1;
              }
            });
          });
          it("configurable",function(){
            assert.throws(function(){
              // redefine
              BeautifulProperties.Hookable.define(objectData,'key',{
                configurable:true
              });
            });
            assert.throws(function(){
              // redefine
              BeautifulProperties.Hookable.define(objectAccessor,'key',{
                configurable:true
              });
            });
          });
          it("writable",function(){
            assert.throws(function(){
              // redefine
              BeautifulProperties.Hookable.define(objectData,'key',{
                writable:true
              });
            });
            assert.throws(function(){
              // redefine
              BeautifulProperties.Hookable.define(objectAccessor,'key',{
                writable:true
              });
            });
          });
          it("enumerable",function(){
            assert.throws(function(){
              // redefine
              BeautifulProperties.Hookable.define(objectData,'key',{
                enumerable:true
              });
            });
            assert.throws(function(){
              // redefine
              BeautifulProperties.Hookable.define(objectAccessor,'key',{
                enumerable:true
              });
            });
          });
          it("value",function(){
            assert.throws(function(){
              // redefine
              BeautifulProperties.Hookable.define(objectData,'key',{
                value:2
              });
            });
          });
          it("get",function(){
            assert.throws(function(){
              // redefine
              BeautifulProperties.Hookable.define(objectAccessor,'key',{
                get:function(){
                  return 2;
                }
              });
            });
          });
          it("set",function(){
            assert.throws(function(){
              // redefine
              BeautifulProperties.Hookable.define(objectAccessor,'key',{
                set:function(){
                  1 + 2;
                }
              });
            });
          });
        });
      });
    });
  });
});