===========================================================
BeautifulProperties.js - Extension of ECMAScript5 property.
===========================================================

Features
========

defineHookableProperty
----------------------

BeautifulProperties.defineHookableProperty supports hooks for setting/getting property,replace or modify value.

hooks

.. code-block:: javascript

  var object = {};
  BeautifulProperties.defineHookableProperty(object,'key',{
    beforeGet : function(val){
      console.log('beforeGet');
    },
    afterGet : function(val){
      console.log('afterGet',val);
      return val;
    },
    beforeSet : function(val,previousVal){
      console.log('beforeSet',val,previousVal);
      return val;
    },
    afterSet : function(val,previousVal){
      console.log('afterSet',val,previousVal);
    }
  });
  object.key = 1;
  object.key = 2;
  object.key;//1

modify getting value

.. code-block:: javascript

  var object = {};
  BeautifulProperties.defineHookableProperty(object,'key',{
    afterGet : function(val){
      return val * 2;
    }
  });
  object.key = 1;
  object.key;//2

modify setting value

.. code-block:: javascript

  var object = {};
  BeautifulProperties.defineHookableProperty(object,'key',{
    beforeSet : function(val,previousVal){
      return val * 2;
    }
  });
  object.key = 1;
  object.key;//2

Events
------

defineObservableProperty
------------------------

BeautifulProperties.defineObservableProperty supports key/value observation.

.. code-block:: javascript

  var object = {};
  BeautifulProperties.defineObservableProperty(object,'key');
  object.key=1;
  BeautifulProperties.Events.on(object,'change:key',function(val,previousVal){
    console.log(val,previousVal);// val:2,previousVal:1
  });
  object.key=2;
