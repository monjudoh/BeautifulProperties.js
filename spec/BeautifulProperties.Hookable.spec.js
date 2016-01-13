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
  describe("BeautifulProperties.Hookable", function() {
    describe(" hooks ",function() {
      var beforeGet,afterGet,beforeSet,afterSet,beforeInit,afterInit;
      beforeEach(function(){
        beforeGet = jasmine.createSpy('beforeGet');
        afterGet = jasmine.createSpy('afterGet');
        beforeSet = jasmine.createSpy('beforeSet');
        afterSet = jasmine.createSpy('afterSet');
        beforeInit = jasmine.createSpy('beforeInit');
        afterInit = jasmine.createSpy('afterInit');
      });
      describe("have been or don't to have been called",function(){
        var object;
        beforeEach(function(){
          object = Object.create(null);
          BeautifulProperties.Hookable.define(object,'initializedKey');
          object['initializedKey'];// init
          BeautifulProperties.Hookable.addHook(object,'initializedKey','beforeGet',beforeGet);
          BeautifulProperties.Hookable.addHook(object,'initializedKey','afterGet',afterGet);
          BeautifulProperties.Hookable.addHook(object,'initializedKey','beforeSet',beforeSet);
          BeautifulProperties.Hookable.addHook(object,'initializedKey','afterSet',afterSet);
          BeautifulProperties.Hookable.addHook(object,'initializedKey','beforeInit',beforeInit);
          BeautifulProperties.Hookable.addHook(object,'initializedKey','afterInit',afterInit);

          BeautifulProperties.Hookable.define(object,'notInitializedKey');
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
          it("beforeInit was not called",function(){
            expect(beforeInit).not.toHaveBeenCalled();
          });
          it("afterInit was not called",function(){
            expect(afterInit).not.toHaveBeenCalled();
          });
        });
        describe("get notInitializedKey",function(){
          beforeEach(function(){
            object['notInitializedKey'];
          });
          it("beforeGet was not called",function(){
            expect(beforeGet).not.toHaveBeenCalled();
          });
          it("afterGet was not called",function(){
            expect(afterGet).not.toHaveBeenCalled();
          });
          it("beforeSet was not called",function(){
            expect(beforeSet).not.toHaveBeenCalled();
          });
          it("afterSet was not called",function(){
            expect(afterSet).not.toHaveBeenCalled();
          });
          it("beforeInit was called",function(){
            expect(beforeInit).toHaveBeenCalled();
          });
          it("afterInit was called",function(){
            expect(afterInit).toHaveBeenCalled();
          });
        });
        describe("set initializedKey",function(){
          beforeEach(function(){
            object['initializedKey'] = 1;
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
          it("beforeInit was not called",function(){
            expect(beforeInit).not.toHaveBeenCalled();
          });
          it("afterInit was not called",function(){
            expect(afterInit).not.toHaveBeenCalled();
          });
        });
        describe("set notInitializedKey",function(){
          beforeEach(function(){
            object['notInitializedKey'] = 1;
          });
          it("beforeGet was not called",function(){
            expect(beforeGet).not.toHaveBeenCalled();
          });
          it("afterGet was not called",function(){
            expect(afterGet).not.toHaveBeenCalled();
          });
          it("beforeSet was not called",function(){
            expect(beforeSet).not.toHaveBeenCalled();
          });
          it("afterSet was not called",function(){
            expect(afterSet).not.toHaveBeenCalled();
          });
          it("beforeInit was called",function(){
            expect(beforeInit).toHaveBeenCalled();
          });
          it("afterInit was called",function(){
            expect(afterInit).toHaveBeenCalled();
          });
        });
        describe("getRaw",function(){
          beforeEach(function(){
            BeautifulProperties.Hookable.getRaw(object,'initializedKey');
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
          it("beforeInit was not called",function(){
            expect(beforeInit).not.toHaveBeenCalled();
          });
          it("afterInit was not called",function(){
            expect(afterInit).not.toHaveBeenCalled();
          });
        });
        describe("setRaw",function(){
          beforeEach(function(){
            BeautifulProperties.Hookable.setRaw(object,'initializedKey',1);
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
            expect(BeautifulProperties.Hookable.getRaw(object,'initializedKey')).toBe(1);
          });
          it("beforeInit was not called",function(){
            expect(beforeInit).not.toHaveBeenCalled();
          });
          it("afterInit was not called",function(){
            expect(afterInit).not.toHaveBeenCalled();
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
            BeautifulProperties.Hookable.addHooks(object,'key',hooks);
            object['key'];
          });
          it("beforeGet to have been called with no arguments",function(){
            expect(beforeGet).toHaveBeenCalledWith();
          });
          it("afterGet to have been called with originalValue",function(){
            expect(afterGet).toHaveBeenCalledWith(originalValue);
          });
        });
        describe("afterGet's return value isn't undefined",function(){
          beforeEach(function(){
            replacement = 2;
            BeautifulProperties.Hookable.define(object,'key');
            object['key'] = originalValue;
            BeautifulProperties.Hookable.addHooks(object,'key',hooks);
          });
          it("value should be replaced",function(){
            expect(object['key']).toBe(replacement);
          });
        });
        describe("afterGet's return value is undefined",function(){
          beforeEach(function(){
            replacement = undefined;
            BeautifulProperties.Hookable.define(object,'key');
            BeautifulProperties.Hookable.addHooks(object,'key',hooks);
            object['key'] = originalValue;
          });
          it("value should not be replaced",function(){
            expect(object['key']).toBe(originalValue);
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
            BeautifulProperties.Hookable.addHooks(object,'key',hooks);
            BeautifulProperties.Hookable.setRaw(object,'key',originalValue);
          });
          it("value should not be replaced to undefined",function(){
            expect(object['key']).not.toBeDefined();
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
            BeautifulProperties.Hookable.addHooks(object,'key',hooks);
            BeautifulProperties.Hookable.setRaw(object,'key',previousValue);
            object['key'] = originalValue;
          });
          it("beforeSet to have been called with no originalValue,previousValue",function(){
            expect(beforeSet).toHaveBeenCalledWith(originalValue,previousValue);
          });
          it("afterSet to have been called with replacement,previousValue",function(){
            expect(afterSet).toHaveBeenCalledWith(replacement,previousValue);
          });
        });
        describe("return value isn't undefined",function(){
          beforeEach(function(){
            replacement = 2;
            BeautifulProperties.Hookable.define(object,'key');
            object['key'] = undefined;
            BeautifulProperties.Hookable.addHooks(object,'key',hooks);
            BeautifulProperties.Hookable.setRaw(object,'key',previousValue);
            object['key'] = originalValue;
          });
          it("value should be replaced",function(){
            expect(BeautifulProperties.Hookable.getRaw(object,'key')).toBe(replacement);
          });
        });
        describe("return value is undefined",function(){
          beforeEach(function(){
            replacement = undefined;
            BeautifulProperties.Hookable.define(object,'key');
            BeautifulProperties.Hookable.addHooks(object,'key',hooks);
            BeautifulProperties.Hookable.setRaw(object,'key',previousValue);
            object['key'] = originalValue;
          });
          it("value should not be replaced",function(){
            expect(BeautifulProperties.Hookable.getRaw(object,'key')).toBe(originalValue);
          });
        });
        describe("return value is Hookable.Undefined",function(){
          beforeEach(function(){
            replacement = BeautifulProperties.Hookable.Undefined;
            BeautifulProperties.Hookable.define(object,'key');
            object['key'] = previousValue;
            BeautifulProperties.Hookable.addHooks(object,'key',hooks);
            object['key'] = originalValue;
          });
          it("value should not be replaced to undefined",function(){
            expect(BeautifulProperties.Hookable.getRaw(object,'key')).not.toBeDefined();
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
        expect(object).not.toHaveProperties('key');
        BeautifulProperties.Hookable.define(object,'key');
        expect(object).toHaveProperties('key');
      });
      // generic
      describe("enumerable",function(){
        it("false",function(){
          BeautifulProperties.Hookable.define(object,'key',{
            value:1,
            enumerable:false
          });
          expect(Object.getOwnPropertyDescriptor(object,'key')).toHaveOwnPropertiesWithValues({
            enumerable:false
          });
        });
        it("true",function(){
          BeautifulProperties.Hookable.define(object,'key',{
            value:1,
            enumerable:true
          });
          expect(Object.getOwnPropertyDescriptor(object,'key')).toHaveOwnPropertiesWithValues({
            enumerable:true
          });
        });
      });
      describe("configurable",function(){
        it("false",function(){
          BeautifulProperties.Hookable.define(object,'key',{
            value:1,
            configurable:false
          });
          expect(Object.getOwnPropertyDescriptor(object,'key')).toHaveOwnPropertiesWithValues({
            configurable:false
          });
        });
        it("true",function(){
          BeautifulProperties.Hookable.define(object,'key',{
            value:1,
            configurable:true
          });
          expect(Object.getOwnPropertyDescriptor(object,'key')).toHaveOwnPropertiesWithValues({
            configurable:true
          });
        });
      });
      // data
      describe("value",function(){
        it("could set initial value.",function(){
          BeautifulProperties.Hookable.define(object,'key',{
            value:1
          });
          expect(object['key']).toBe(1);
        });
        it("could set initial value.",function(){
          BeautifulProperties.Hookable.define(object,'key',{
            value:0
          });
          expect(object['key']).toBe(0);
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
            expect(object['key']).toBe(1);
          });
          it("could not overwrite value.",function(){
            object['key'] = 2;
            expect(object['key']).toBe(1);
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
            expect(object['key']).toBe(1);
          });
          it("could not overwrite value.",function(){
            object['key'] = 2;
            expect(object['key']).toBe(1);
          });
        });
      });
      // accessor
      describe("get",function(){
        var hooks,refresh;
        beforeEach(function(){
          hooks = Object.create(null);
          refresh = jasmine.createSpy('refresh');
        });
        describe("",function(){
          beforeEach(function(){
            BeautifulProperties.Hookable.define(object,'key',{
              get:function(){
                return 1;
              }
            });
            BeautifulProperties.Hookable.addHooks(object,'key',hooks);
          });
          it("object could get value.",function(){
            expect(object['key']).toBe(1);
          });
          it("sub object could get value.",function(){
            var subObject = Object.create(object);
            expect(subObject['key']).toBe(1);
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
            BeautifulProperties.Hookable.addHooks(object,'key',hooks);
          });
          it(" when refreshProperty is called.",function(){
            BeautifulProperties.Hookable.Get.refreshProperty(object,'key');
            expect(refresh).toHaveBeenCalledWith(1,undefined);
          });
          it(" when property is accessed.",function(){
            object['key'];
            expect(refresh).toHaveBeenCalledWith(1,undefined);
          });
        });
        it("Get.getSilently skip refresh hook.",function(){
          hooks.refresh = refresh;
          BeautifulProperties.Hookable.define(object,'key',{
            get:function(){
              return 1;
            }
          });
          BeautifulProperties.Hookable.addHooks(object,'key',hooks);
          expect(BeautifulProperties.Hookable.Get.getSilently(object,'key')).toBe(1);
          expect(refresh).not.toHaveBeenCalledWith(1,undefined);
        });
      });
      describe("set",function(){
        var hooks,set,refresh;
        beforeEach(function(){
          hooks = Object.create(null);
          set = jasmine.createSpy('set');
          refresh = jasmine.createSpy('refresh');
        });
        describe("write only",function(){
          beforeEach(function(){
            hooks.refresh = refresh;
            BeautifulProperties.Hookable.define(object,'key',{
              set:set
            });

            BeautifulProperties.Hookable.addHooks(object,'key',hooks);
          });
          it(" when property is accessed.",function(){
            object['key'] = 1;
            expect(set).toHaveBeenCalledWith(1);
          });
          it("refresh hook shouldn't be called when property is accessed.",function(){
            object['key'] = 1;
            expect(refresh).not.toHaveBeenCalledWith(1);
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
            BeautifulProperties.Hookable.addHooks(object,'key',hooks);
          });
          it("refresh hook should be called when property is accessed.",function(){
            object['key'] = 1;
            expect(refresh).toHaveBeenCalledWith(1,undefined);
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
              expect(Object.getOwnPropertyDescriptor(objectData,'key')).toHaveOwnPropertiesWithValues({
                enumerable:true
              });
              expect(Object.getOwnPropertyDescriptor(objectAccessor,'key')).toHaveOwnPropertiesWithValues({
                enumerable:true
              });
            });
            it("configurable",function(){
              expect(Object.getOwnPropertyDescriptor(objectData,'key')).toHaveOwnPropertiesWithValues({
                configurable:false
              });
              expect(Object.getOwnPropertyDescriptor(objectAccessor,'key')).toHaveOwnPropertiesWithValues({
                configurable:false
              });
              // configurable:false
              expect(function(){
                // redefine
                BeautifulProperties.Hookable.define(objectData,'key',{
                  enumerable:false
                });
              }).toThrow();
              expect(function(){
                // redefine
                BeautifulProperties.Hookable.define(objectAccessor,'key',{
                  set:function(){
                    1 + 2;
                  }
                });
              }).toThrow();
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
            set = jasmine.createSpy('set');
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
              expect(Object.getOwnPropertyDescriptor(objectData,'key')).toHaveOwnPropertiesWithValues({
                enumerable:true
              });
              expect(Object.getOwnPropertyDescriptor(objectAccessor,'key')).toHaveOwnPropertiesWithValues({
                enumerable:true
              });
            });
            it("configurable",function(){
              expect(Object.getOwnPropertyDescriptor(objectData,'key')).toHaveOwnPropertiesWithValues({
                configurable:false
              });
              expect(Object.getOwnPropertyDescriptor(objectAccessor,'key')).toHaveOwnPropertiesWithValues({
                configurable:false
              });
              // configurable:false
              expect(function(){
                // redefine
                BeautifulProperties.Hookable.define(objectData,'key',{
                  enumerable:false
                });
              }).toThrow();
              expect(function(){
                // redefine
                BeautifulProperties.Hookable.define(objectAccessor,'key',{
                  set:function(){
                    1 + 2;
                  }
                });
              }).toThrow();
            });
            // data
            it("value",function(){
              expect(objectData).toHaveOwnPropertiesWithValues({
                key:2
              });
            });
            it("writable",function(){
              objectData.key = 3;
              expect(objectData).toHaveOwnPropertiesWithValues({
                key:3
              });
            });
            // accessor
            it("get",function(){
              expect(objectAccessor).toHaveOwnPropertiesWithValues({
                key:4
              });
            });
            it("set",function(){
              objectAccessor.key = 3;
              expect(set).toHaveBeenCalledWith(3);
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
            set = jasmine.createSpy('set');
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
              expect(Object.getOwnPropertyDescriptor(objectData,'key')).toHaveOwnPropertiesWithValues({
                enumerable:true
              });
              expect(Object.getOwnPropertyDescriptor(objectAccessor,'key')).toHaveOwnPropertiesWithValues({
                enumerable:true
              });
            });
            it("configurable",function(){
              expect(Object.getOwnPropertyDescriptor(objectAccessor,'key')).toHaveOwnPropertiesWithValues({
                configurable:false
              });
              expect(Object.getOwnPropertyDescriptor(objectData,'key')).toHaveOwnPropertiesWithValues({
                configurable:false
              });
              // configurable:false
              expect(function(){
                // redefine
                BeautifulProperties.Hookable.define(objectAccessor,'key',{
                  enumerable:false
                });
              }).toThrow();
              expect(function(){
                // redefine
                BeautifulProperties.Hookable.define(objectData,'key',{
                  set:function(){
                    1 + 2;
                  }
                });
              }).toThrow();
            });
            // data
            it("value",function(){
              expect(objectAccessor).toHaveOwnPropertiesWithValues({
                key:2
              });
            });
            it("writable",function(){
              objectAccessor.key = 3;
              expect(objectAccessor).toHaveOwnPropertiesWithValues({
                key:3
              });
            });
            // accessor
            it("get",function(){
              expect(objectData).toHaveOwnPropertiesWithValues({
                key:4
              });
            });
            it("set",function(){
              objectData.key = 3;
              expect(set).toHaveBeenCalledWith(3);
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
            expect(objectData).toHavePropertiesWithValues({
              key:2
            });
            // redefine
            BeautifulProperties.Hookable.define(objectData,'key',{
              writable:false
            });
            objectData.key = 3;
            expect(objectData).toHavePropertiesWithValues({
              key:2
            });
          });
          it("can modify value",function(){
            // redefine
            BeautifulProperties.Hookable.define(objectData,'key',{
              value:2
            });
            expect(objectData).toHavePropertiesWithValues({
              key:2
            });
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
            expect(function(){
              // redefine
              BeautifulProperties.Hookable.define(objectData,'key',{
                configurable:true
              });
            }).toThrow();
            expect(function(){
              // redefine
              BeautifulProperties.Hookable.define(objectAccessor,'key',{
                configurable:true
              });
            }).toThrow();
          });
          it("writable",function(){
            expect(function(){
              // redefine
              BeautifulProperties.Hookable.define(objectData,'key',{
                writable:true
              });
            }).toThrow();
            expect(function(){
              // redefine
              BeautifulProperties.Hookable.define(objectAccessor,'key',{
                writable:true
              });
            }).toThrow();
          });
          it("enumerable",function(){
            expect(function(){
              // redefine
              BeautifulProperties.Hookable.define(objectData,'key',{
                enumerable:true
              });
            }).toThrow();
            expect(function(){
              // redefine
              BeautifulProperties.Hookable.define(objectAccessor,'key',{
                enumerable:true
              });
            }).toThrow();
          });
          it("value",function(){
            expect(function(){
              // redefine
              BeautifulProperties.Hookable.define(objectData,'key',{
                value:2
              });
            }).toThrow();
          });
          it("get",function(){
            expect(function(){
              // redefine
              BeautifulProperties.Hookable.define(objectAccessor,'key',{
                get:function(){
                  return 2;
                }
              });
            }).toThrow();
          });
          it("set",function(){
            expect(function(){
              // redefine
              BeautifulProperties.Hookable.define(objectAccessor,'key',{
                set:function(){
                  1 + 2;
                }
              });
            }).toThrow();
          });
        });
      });
    });
  });
});