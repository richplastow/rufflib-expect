(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (global.rufflib = global.rufflib || {}, global.rufflib.expect = global.rufflib.expect || {}, global.rufflib.expect.test = factory()));
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  // rufflib-expect/src/expect.js

  /* ---------------------------------- Tests --------------------------------- */
  // Runs basic Expect tests on itself.
  function test(expect, Expect) {
    expect().section('Expect basics');
    expect("typeof Expect // in JavaScript, a class is type 'function'", _typeof(Expect)).toBe('function');
    expect("typeof new Expect()", _typeof(new Expect())).toBe('object'); // expect(`new Expect()`,
    //         new Expect()).toHave({
    //             log: [],
    //             suiteTitle: 'Untitled Test Suite',
    //         });
    // expect(`new Expect('Mathsy Test Suite')`,
    //         new Expect('Mathsy Test Suite')).toHave({
    //             log '[],
    //             suiteTitle: 'Mathsy Test Suite',
    //         });

    expect().section('Typical usage');
    expect("factorialise(5) // 5! = 5 * 4 * 3 * 2 * 1", factorialise(5)).toBe(120);

    function factorialise(n) {
      if (n === 0 || n === 1) return 1;

      for (var i = n - 1; i > 0; i--) {
        n *= i;
      }

      return n;
    }
  } // rufflib-expect/src/entry-point-for-tests.js
  // Run each test. You can comment-out some during development, to help focus on
  // individual tests. But make sure all tests are uncommented before committing.


  function expectTest(expect, Expect) {
    test(expect, Expect);
  }

  return expectTest;

}));
