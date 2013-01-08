describe("BeautifulProperties.Observable", function() {
  describe(".define", function() {
    var object,changeKey;
    beforeEach(function(){
      object = Object.create(null);
      changeKey = jasmine.createSpy('changeKey');
    });
    it("'change:key' event is triggered when it assign 'key' property and the value is changed.",function(){
      BeautifulProperties.Observable.define(object,'key',{});
      BeautifulProperties.Events.provideMethods(object);
      object.key = 0;
      object.on('change:key',changeKey);
      object.key = 1;
      expect(changeKey).toHaveBeenCalledWith(jasmine.any(BeautifulProperties.Events.Event),1,0);
    });
    describe("descriptor",function(){
      describe("equals",function(){
        it("equals callback",function(){
          var equals = jasmine.createSpy('equals');
          BeautifulProperties.Observable.define(object,'key',{},{
            equals:function(val,previousVal){
              equals(this,val,previousVal);
              return false;
            }
          });
          object.key = 1;
          expect(equals).toHaveBeenCalledWith(object,1,undefined);
        });
        it("'change:key' event isn't triggered when it assign 'key' property and equals return true.",function(){
          BeautifulProperties.Observable.define(object,'key',{},{
            equals:function(val,previousVal){
              return true;
            }
          });
          BeautifulProperties.Events.provideMethods(object);
          object.key = 0;
          object.on('change:key',changeKey);
          object.key = 1;
          expect(changeKey).not.toHaveBeenCalled();
        });
        it("'change:key' event is triggered when it assign 'key' property and equals return false.",function(){
          BeautifulProperties.Observable.define(object,'key',{},{
            equals:function(val,previousVal){
              return false;
            }
          });
          BeautifulProperties.Events.provideMethods(object);
          object.key = 0;
          object.on('change:key',changeKey);
          object.key = 0;
          expect(changeKey).toHaveBeenCalledWith(jasmine.any(BeautifulProperties.Events.Event),0,0);
        });
      });
      describe('get',function(){
        it("'change:key' event is triggered when it call refreshProperty('key') and the value is changed.",function(){
          var val;
          BeautifulProperties.Observable.define(object,'key',{},{
            get:function(){
              return val;
            }
          });
          BeautifulProperties.Events.provideMethods(object);
          BeautifulProperties.Hookable.Get.provideMethods(object);
          val = 0;
          object.refreshProperty('key');
          object.on('change:key',changeKey);
          val = 1;
          object.refreshProperty('key');
          expect(changeKey).toHaveBeenCalledWith(jasmine.any(BeautifulProperties.Events.Event),1,0);
        });
      });
    });
  });
});