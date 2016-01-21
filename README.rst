BeautifulProperties.js - Extension of ECMAScript5 property.
===========================================================

Links
=====

- `Repository <https://github.com/monjudoh/BeautifulProperties.js>`_
- `Reference <http://monjudoh.github.io/BeautifulProperties.js/docs/index.html>`_

Features
========

LazyInitializable
--------------------------

BeautifulProperties.LazyInitializable.define can define a property, it's initialized at first access.

.. code-block:: javascript

  var proto = {};
  BeautifulProperties.LazyInitializable.define(proto,'boundFunction',function(){
    return (function () {
      console.log(this);
    }).bind(this);
  });
  var object1 = Object.create(proto);
  object1.a = 1;
  var boundFunction1 = object1.boundFunction;
  boundFunction1();// {a:1,boundFunction:fn}
  var object2 = Object.create(proto);
  object2.a = 2;
  var boundFunction2 = object2.boundFunction;
  boundFunction2();// {a:2boundFunction:fn}

Hookable
----------------------

BeautifulProperties.Hookable.define supports hooks for setting/getting property,replace or modify value.

hooks

.. code-block:: javascript

  var object = {};
  BeautifulProperties.Hookable.define(object,'key');
  BeautifulProperties.Hookable.addHooks(object,'key',{
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
  BeautifulProperties.Hookable.define(object,'key');
  BeautifulProperties.Hookable.addHook(object,'key','afterGet',function(val){
    return val * 2;
  });

  object.key = 1;
  object.key;//2

modify setting value

.. code-block:: javascript

  var object = {};
  BeautifulProperties.Hookable.define(object,'key');
  BeautifulProperties.Hookable.addHook(object,'key','beforeSet',function(val,previousVal){
    return val * 2;
  });
  object.key = 1;
  object.key;//2

Events
------

.. code-block:: javascript

  var object = {};
  BeautifulProperties.Events.on(object,'eventType',function(ev){
    console.log('event handler is called.');
  });
  BeautifulProperties.Events.trigger(object,'eventType');

event bubbling.

A event bubble up to the prototype of the object.

.. code-block:: javascript

  var proto = {};
  var object = Object.create(proto);
  BeautifulProperties.Events.on(proto,'eventType',function(ev){
    console.log('event handler is called.');
  });
  BeautifulProperties.Events.trigger(object,'eventType');

controlling event bubbling.

.. code-block:: javascript

  var ancestor = {};
  var object = {};
  BeautifulProperties.Events.Ancestor.setRetriever(object,function(){
    return ancestor;
  });
  BeautifulProperties.Events.on(ancestor,'eventType',function(ev){
    console.log('event handler is called.');
  });
  BeautifulProperties.Events.trigger(object,'eventType');

Observable
------------------------

BeautifulProperties.Observable.define supports key/value observation.

.. code-block:: javascript

  var object = {};
  BeautifulProperties.Observable.define(object,'key');
  object.key=1;
  BeautifulProperties.Events.on(object,'change:key',function(ev,val,previousVal){
    console.log(val,previousVal);// val:2,previousVal:1
  });
  object.key=2;


Installation and usage
======================

In browsers:
------------

.. code-block:: html

  <script src="BeautifulProperties.js"></script>

In an AMD loader like RequireJS:
--------------------------------

.. code-block:: javascript

  require(['BeautifulProperties'], function(BeautifulProperties) {
  });

Changelog
=========

0.2.0
-----

- changed
  - It trigger `init:{key}` event when Observable property is initialized.
- removed
  - BeautifulProperties.Hookable.addHooks method
  - BeautifulProperties.Internal namespace
  - `context` property of BeautifulProperties.Events~BindingOptions

0.1.12
------

- added
  - Multiple binding is supported in BeautifulProperties.Events.
- changed
  - `context` property of BeautifulProperties.Events~BindingOptions is renamed to `thisObject`.
- deprecated
  - `context` property of BeautifulProperties.Events~BindingOptions

0.1.11
------

- fixes
  - event.previousTarget,event.currentTarget in BeautifulProperties.Events.Ancestor~ancestorRetriever.

0.1.10
------

- added
  - BeautifulProperties.Events.Event#previousTarget property
- changed
  - BeautifulProperties.Events.Ancestor~ancestorRetriever callback
    - has 2 params.
    - If the ancestorRetriever returns undefined,Ancestor.retrieve method returns the prototype of the target object.

0.1.9
-----

- Export as global,AMD,CJS.
- Many refacotoring.
- deprecated
  - BeautifulProperties.Hookable.addHooks method
  - BeautifulProperties.Internal namespace is deprecated.
- removed
  - BeautifulProperties.getRaw method (deprecated since 0.1.6)
  - BeautifulProperties.setRaw method (deprecated since 0.1.6)


Author
======

monjudoh https://github.com/monjudoh

Contributors
============

- aodag (Atsushi Odagiri) https://github.com/aodag
  - He named this library.
- jbking (Yusuke Muraoka) https://github.com/jbking
  - He provides ideas for this library.