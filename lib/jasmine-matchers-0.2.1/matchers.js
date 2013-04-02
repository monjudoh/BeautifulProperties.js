/*
Copyright (C) 2013, uxebu Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of this 
software and associated documentation files (the "Software"), to deal in the Software 
without restriction, including without limitation the rights to use, copy, modify, merge, 
publish, distribute, sublicense, and/or sell copies of the Software, and to permit 
persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies 
or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE 
FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR 
THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
beforeEach(function() {
  this.addMatchers({

    toBeArray: function() {
      return {}.toString.call(this.actual) === '[object Array]';
    },

    toBeCloseToOneOf: function(values, isCloseToFunction) {
      var actual = this.actual;
      var isCloseTo = values.some(function(oneValue) {
        return isCloseToFunction(actual, oneValue)
      });

      var not = this.isNot ? " NOT" : "";
      var isCloseString = stringifyFunctionName(isCloseToFunction);
      this.message = function() {
        return 'Expected ' + actual + not + ' to be `' + isCloseString + '` of one of ' + JSON.stringify(values) + '.';
      };
      return isCloseTo;
    },

    toBeInstanceOf: function(Constructor) {
      return this.actual instanceof Constructor;
    },

    toBeInRange: function(a, b) {
      return this.actual <= b && this.actual >= a;
    },

    toBeNan: function() { // needs to be spelled 'Nan' due to jasmine conventions
      var actual = this.actual;
      // NaN is the only value that is not strictly equal to itself
      return actual !== actual;
    },

    toBeNumber: function() {
      return typeof this.actual == 'number';
    },

    toBeOfType: function(type) {
      return typeof this.actual === type;
    },

    toBeOneOf: function(values) {
      return values.indexOf(this.actual) > -1;
    }

  });

  function stringifyFunctionName(func) {
    var name = func.name;
    if (!name) {
      name = func.toSource()
        .replace(/^function\s/, '') // remove leading 'function '
        .match(/^.[^(]]+/)[0]; // remove everything after the function name.
    }
    return fromCamelCaseToReadable(name);
  }

  function fromCamelCaseToReadable(camelCaseString) {
    var characters = camelCaseString.split('');
    return characters.map(addSpaceBeforeUpperCaseLetter).join('').toLowerCase();
  }

  function addSpaceBeforeUpperCaseLetter(character){
    if (character.toLowerCase() != character) {
      character = ' ' + character;
    }
    return character;
  }


});
beforeEach(function() {
  this.addMatchers({

    toContainOnce: function(value) {
      var actual = this.actual;
      var containsOnce = false;
      if (actual) {
        var firstFoundAt = actual.indexOf(value);
        containsOnce = firstFoundAt!=-1 && firstFoundAt == actual.lastIndexOf(value);
      }
      return containsOnce;
    }

  });
});
(function() {
  function testKeyList(keys, object, testFn) {
    for (var i = 0, len = keys.length; i < len; i += 1) {
      if (!testFn(object, keys[i])) {
        return false;
      }
    }
    return true;
  }

  function testKeyObject(referenceObject, object, testFn) {
    for (var key in referenceObject) {
      if (!testFn(object, key, referenceObject[key])) {
        return false;
      }
    }
    return true;
  }

  function hasProperty(object, key) {
    return key in object;
  }
  function hasOwnProperty(object, key) {
    return {}.hasOwnProperty.call(object, key);
  }
  function hasPropertyWithValue(object, key, value) {
    return object[key] === value;
  }
  function hasOwnPropertyWithValue(object, key, value) {
    return hasOwnProperty(object, key) && hasPropertyWithValue(object, key, value);
  }

  beforeEach(function() {
    this.addMatchers({

      toHaveBeenCalledXTimes: function(count) {
        var callCount = this.actual.callCount;
        var not = this.isNot ? "NOT " : "";
        this.message = function() {
          return 'Expected spy "' + this.actual.identity + '" ' + not + ' to have been called ' + count + ' times, but was ' + callCount + '.';
        };
        return callCount == count;
      },

      toHaveLength: function(length) {
        return this.actual.length === length;
      },

      toHaveOwnProperties: function(name0, name1, name2) {
        return testKeyList(arguments, this.actual, hasOwnProperty);
      },

      toHaveOwnPropertiesWithValues: function(obj) {
        return testKeyObject(obj, this.actual, hasOwnPropertyWithValue);
      },

      toHaveProperties: function(name0, name1, name2) {
        return testKeyList(arguments, this.actual, hasProperty);
      },

      toHavePropertiesWithValues: function(obj) {
        return testKeyObject(obj, this.actual, hasPropertyWithValue);
      },

      toExactlyHaveProperties: function(name0, name1, name2) {
        var actual = this.actual;
        var numArguments = arguments.length;
        for (var i = 0; i < numArguments; i += 1) {
          if (!hasOwnProperty(actual, arguments[i])) { return false; }
        }
        return Object.keys(actual).length === numArguments;
      }

    });
  });
}());
beforeEach(function() {
  this.addMatchers({

    //
    // start/endWith
    //

    toEndWith: function(value) {
      return endsWith(this.actual, value);
    },

    toEachEndWith: function(searchString) {
      var arrayOfStrings = this.actual;
      return arrayOfStrings.every(function(oneValue) {
        return endsWith(oneValue, searchString)
      });
    },

    toStartWithEither: function() {
      var args = [].slice.call(arguments);
      for (var i=0, l=args.length; i<l; i++) {
        if (startsWith(this.actual, args[i])) {
          return true;
        }
      }
      return false;
    },

    toSomeEndWith: function(searchString) {
      var arrayOfStrings = this.actual;
      return arrayOfStrings.some(function(oneValue) {
        return endsWith(oneValue, searchString)
      });
    },

    toStartWith: function(value) {
      return startsWith(this.actual, value);
    },

    toEachStartWith: function(searchString) {
      var arrayOfStrings = this.actual;
      return arrayOfStrings.every(function(oneValue) {
        return startsWith(oneValue, searchString)
      });
    },

    toSomeStartWith: function(searchString) {
      var arrayOfStrings = this.actual;
      return arrayOfStrings.some(function(oneValue) {
        return startsWith(oneValue, searchString)
      });
    }

  });

  function isArray(value) {
    return toString.call(value) == '[object Array]';
  }

  function endsWith(haystack, needle) {
    if (isArray(haystack)) {
      return arrayEndsWith(haystack, needle);
    } else {
      return stringEndsWith(haystack, needle);
    }
  }

  function startsWith(haystack, needle) {
    if (isArray(haystack)) {
      return arrayStartsWith(haystack, needle);
    } else {
      return stringStartsWith(haystack, needle);
    }
  }

  function stringEndsWith(haystack, needle) {
    return haystack.substr(-needle.length) == needle;
  }

  function stringStartsWith(haystack, needle) {
    return haystack.substr(0, needle.length) == needle;
  }

  function arrayEndsWith(haystack, needle) {
    if (isArray(needle)) {
      var offset = haystack.length - needle.length;
      return needle.every(function(val, idx) {
        return val == haystack[idx + offset];
      });
    }
    return haystack.indexOf(needle) == haystack.length-1;
  }

  function arrayStartsWith(haystack, needle) {
    if (isArray(needle)) {
      return needle.every(function(val, idx) {
        return val == haystack[idx];
      });
    }
    return haystack.indexOf(needle) == 0;
  }

});
beforeEach(function() {
  this.addMatchers({

    toThrowInstanceOf: function(klass) {
      try {
        this.actual();
      } catch (e) {
        return e instanceof klass;
      }
      return false;
    },

    toThrowStartsWith: function(text) {
      var doesStartWith = false;
      var errorMessage = '';
      try {
        this.actual();
      } catch (e) {
        errorMessage = e.message;
        doesStartWith = startsWith(errorMessage, text);
      }
      var not = this.isNot ? " NOT" : "";
      this.message = function() {
        return 'Expected thrown error message `' + errorMessage + '`' + not + ' to start with `' + text + '`.';
      };
      return doesStartWith;
    }

  });

  function startsWith(haystack, needle) {
    return haystack.substr(0, needle.length) == needle;
  }

});
