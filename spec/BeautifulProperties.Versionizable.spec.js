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
      expect(BeautifulProperties.Versionizable.getPreviousValue(object,'key')).toBe(1);
    });
    it("add Versionizable to the Hookable property.",function(){
      BeautifulProperties.Hookable.define(object,'key');
      BeautifulProperties.Versionizable.define(object,'key');
      object.key = 1;
      object.key = 2;
      expect(BeautifulProperties.Versionizable.getPreviousValue(object,'key')).toBe(1);
    });
    it("define a Versionizable property to the object,it have a Hookable property.",function(){
      BeautifulProperties.Hookable.define(object,'key2');
      BeautifulProperties.Versionizable.define(object,'key');
      object.key = 1;
      object.key = 2;
      expect(BeautifulProperties.Versionizable.getPreviousValue(object,'key')).toBe(1);
      object.key2 = 1;
      object.key2 = 2;
      expect(BeautifulProperties.Versionizable.getPreviousValue(object,'key2')).toBe(undefined);
    });
    it("define a Versionizable property to the prototype.",function(){
      BeautifulProperties.Versionizable.define(proto,'key');
      object.key = 1;
      object.key = 2;
      expect(BeautifulProperties.Versionizable.getPreviousValue(object,'key')).toBe(1);
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
      expect(BeautifulProperties.Versionizable.getPreviousValue(object,'key')).toBe(1);
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
      expect(BeautifulProperties.Versionizable.getVersion(object,'key',0)).toHaveProperties('value','isNull','timestamp')
      expect(BeautifulProperties.Versionizable.getVersion(object,'key',0).value).toBe(2);
      expect(BeautifulProperties.Versionizable.getVersion(object,'key',0).isNull).toBe(false);
      expect(BeautifulProperties.Versionizable.getVersion(object,'key',1).value).toBe(1);
      expect(BeautifulProperties.Versionizable.getVersion(object,'key',1).isNull).toBe(false);
      expect(BeautifulProperties.Versionizable.getVersion(object,'key',2).isNull).toBe(true);
    });
  });
  describe("getHistoryLength",function(){
    var object;
    beforeEach(function(){
      object = Object.create(null);
    });
    it("initial length is 0.",function(){
      BeautifulProperties.Versionizable.define(object,'key');
      expect(BeautifulProperties.Versionizable.getHistoryLength(object,'key')).toBe(0);
    });
    it("length increase when the property value change.",function(){
      BeautifulProperties.Versionizable.define(object,'key');
      object.key = 1;
      expect(BeautifulProperties.Versionizable.getHistoryLength(object,'key')).toBe(1);
      object.key = 2;
      expect(BeautifulProperties.Versionizable.getHistoryLength(object,'key')).toBe(2);
    });
    it("length stop increasing to options.length.",function(){
      BeautifulProperties.Versionizable.define(object,'key',{
        length:3
      });
      object.key = 1;
      object.key = 2;
      object.key = 3;
      object.key = 4;
      expect(BeautifulProperties.Versionizable.getHistoryLength(object,'key')).toBe(3);
    });
  });
  describe("Equals",function(){
    var object;
    beforeEach(function(){
      object = Object.create(null);
    });
    it("equals callback",function(){
      var equals = jasmine.createSpy('equals');
      BeautifulProperties.Equals.set(object,'key',function(val,previousVal){
        equals(this,val,previousVal);
        return false;
      });
      BeautifulProperties.Versionizable.define(object,'key');
      object.key = 1;
      expect(equals).toHaveBeenCalledWith(object,1,undefined);
    });
    it("A new vesion isn't added to history when it assign 'key' property and equals return true.",function(){
      BeautifulProperties.Equals.set(object,'key',function(val,previousVal){
        return true;
      });
      BeautifulProperties.Versionizable.define(object,'key');
      object.key = 1;
      expect(BeautifulProperties.Versionizable.getHistoryLength(object,'key')).toBe(0);
    });
    it("The new vesion is added to history when it assign 'key' property and equals return false.",function(){
      BeautifulProperties.Equals.set(object,'key',function(val,previousVal){
        return false;
      });
      BeautifulProperties.Versionizable.define(object,'key');
      object.key = 1;
      expect(BeautifulProperties.Versionizable.getHistoryLength(object,'key')).toBe(1);
    });
  });
});