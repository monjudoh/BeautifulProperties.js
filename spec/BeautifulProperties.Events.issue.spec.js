describe("BeautifulProperties.Events issue", function() {
  describe("#1",function () {
    var proto,object,protoSpy,objectSpy;
    beforeEach(function(){
      proto = Object.create(null);
      object = Object.create(proto);
      protoSpy = jasmine.createSpy('protoSpy');
      objectSpy = jasmine.createSpy('objectSpy');
      BeautifulProperties.Events.provideMethods(proto);
    });
    describe("proto.on is called before call object.on",function(){
      beforeEach(function(){
        proto.on('test', function(){
          protoSpy();
        });
        object.on('test', function(){
          objectSpy();
        });
        BeautifulProperties.Events.trigger(object,{type:'test',bubbles:false});
      });
      it("expect(protoSpy).not.toHaveBeenCalled()",function(){
        expect(protoSpy).not.toHaveBeenCalled();
      });
      // this is red before fixes issue.
      it("expect(object).toHaveBeenCalled()",function(){
        expect(objectSpy).toHaveBeenCalled();
      });
    });
    describe("proto.on is called after call object.on",function(){
      beforeEach(function(){
        object.on('test', function(){
          objectSpy();
        });
        proto.on('test', function(){
          protoSpy();
        });
        BeautifulProperties.Events.trigger(object,{type:'test',bubbles:false});
      });
      it("expect(protoSpy).not.toHaveBeenCalled()",function(){
        expect(protoSpy).not.toHaveBeenCalled();
      });
      it("expect(object).toHaveBeenCalled()",function(){
        expect(objectSpy).toHaveBeenCalled();
      });
    });
  });
});