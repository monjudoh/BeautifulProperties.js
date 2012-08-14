===========================================================
BeautifulProperties.js - Extension of ECMAScript5 property.
===========================================================

Features
========

hookable property
-----------------

Events
------

observable property
-------------------

.. code-block:: javascript

  var object = {};
  BeautifulProperties.defineObservableProperty(object,'key');
  object.key=1;
  BeautifulProperties.Events.on(object,'change:key',function(val,previousVal){
    console.log(val,previousVal);// val:2,previousVal:1
  });
  object.key=2;
