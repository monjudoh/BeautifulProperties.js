describe("BeautifulProperties.Observable", function() {
  describe(".define", function() {
    var proto,object,changeKey;
    beforeEach(function(){
      proto = Object.create(null);
      object = Object.create(proto);
      changeKey = jasmine.createSpy('changeKey');
    });
    it("'change:key' event is triggered when it assign 'key' property and the value is changed.",function(){
      BeautifulProperties.Observable.define(object,'key');
      BeautifulProperties.Events.provideMethods(object);
      object.key = 0;
      object.on('change:key',changeKey);
      object.key = 1;
      expect(changeKey).toHaveBeenCalledWith(jasmine.any(BeautifulProperties.Events.Event),1,0);
    });
    describe("descriptor",function(){
      describe('get',function(){
        it("'change:key' event is triggered when it call refreshProperty('key') and the value is changed.",function(){
          var val;
          BeautifulProperties.Observable.define(object,'key',null,{
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
      describe('bubble',function(){
        it("'change:key' event should bubbles.",function(){
          BeautifulProperties.Observable.define(object,'key',null,{bubble:true});
          BeautifulProperties.Events.provideMethods(proto);
          object.key = 0;
          proto.on('change:key',changeKey);
          object.key = 1;
          expect(changeKey).toHaveBeenCalledWith(jasmine.any(BeautifulProperties.Events.Event),1,0);
        });
      });
    });
    describe("Equals",function(){
      it("equals callback",function(){
        var equals = jasmine.createSpy('equals');
        BeautifulProperties.Equals.set(object,'key',function(val,previousVal){
          equals(this,val,previousVal);
          return false;
        });
        BeautifulProperties.Observable.define(object,'key');
        object.key = 1;
        expect(equals).toHaveBeenCalledWith(object,1,undefined);
      });
      it("'change:key' event isn't triggered when it assign 'key' property and equals return true.",function(){
        BeautifulProperties.Equals.set(object,'key',function(val,previousVal){
          return true;
        });
        BeautifulProperties.Observable.define(object,'key');
        BeautifulProperties.Events.provideMethods(object);
        object.key = 0;
        object.on('change:key',changeKey);
        object.key = 1;
        expect(changeKey).not.toHaveBeenCalled();
      });
      it("'change:key' event is triggered when it assign 'key' property and equals return false.",function(){
        BeautifulProperties.Equals.set(object,'key',function(val,previousVal){
          return false;
        });
        BeautifulProperties.Observable.define(object,'key');
        BeautifulProperties.Events.provideMethods(object);
        object.key = 0;
        object.on('change:key',changeKey);
        object.key = 0;
        expect(changeKey).toHaveBeenCalledWith(jasmine.any(BeautifulProperties.Events.Event),0,0);
      });
    });
  });
});