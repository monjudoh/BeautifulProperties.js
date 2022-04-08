if (typeof require === 'function') {
  // in node
  global.assert = require('power-assert');
  global.sinon = require('sinon');
}
