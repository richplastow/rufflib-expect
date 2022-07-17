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

  /**
   * Unit tests for rufflib-expect 1.0.1
   * A RuffLIB library for unit testing rough and sketchy JavaScript apps.
   * https://richplastow.com/rufflib-expect
   * @license MIT
   */
  // rufflib-expect/src/methods/generate-css.js
  var RX_SELECTOR = /^[.#]?[a-z][-_0-9a-z]*$/i;
  /* ---------------------------------- Tests --------------------------------- */
  // Tests Expect.generateCss().

  function test$3(expect, Expect) {
    expect().section('generateCss()'); // Basics.

    expect("typeof Expect.generateCss", _typeof(Expect.generateCss)).toBe('function');
    expect("typeof Expect.generateCss('a', 'b')", _typeof(Expect.generateCss('a', 'b'))).toBe('string');
    expect("Expect.generateCss('a', 'b').split('\\n').length", Expect.generateCss('a', 'b').split('\n').length).toBe(18); // Incorrect arguments should throw exceptions.

    var exc;
    var OK = 'Did not encounter an exception';

    try {
      Expect.generateCss();
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    expect("Expect.generateCss()", exc).toBe("Error: Expect.generateCss(): the mandatory containerSelector argument is falsey");

    try {
      Expect.generateCss([]);
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    expect("Expect.generateCss([])", exc).toBe("Error: Expect.generateCss(): containerSelector is type 'object' not 'string'");

    try {
      Expect.generateCss('a b');
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    expect("Expect.generateCss('a b')", exc).toBe("Error: Expect.generateCss(): containerSelector fails ".concat(RX_SELECTOR));

    try {
      Expect.generateCss('abc');
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    expect("Expect.generateCss('abc')", exc).toBe("Error: Expect.generateCss(): the mandatory innerSelector argument is falsey");

    try {
      Expect.generateCss('.a', []);
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    expect("Expect.generateCss('.a', [])", exc).toBe("Error: Expect.generateCss(): innerSelector is type 'object' not 'string'");

    try {
      Expect.generateCss('#abc', 'abc*/');
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    expect("Expect.generateCss('#abc', 'abc*/')", exc).toBe("Error: Expect.generateCss(): innerSelector fails ".concat(RX_SELECTOR)); // Typical usage.

    expect("Expect.generateCss('container', 'inner') // first line", Expect.generateCss('container', 'inner')).toMatch(/^\/\* Expect\.generateCss\('container', 'inner'\) \*\/\n/);
    expect("Expect.generateCss('#c-s', '.i_s') // a middle line", Expect.generateCss('#c-s', '.i_s')).toMatch(/\n#c-s\.fail .i_s{background:#411;color:#fce}\n/);
    expect("Expect.generateCss('#c-s', '.i_s') // last line", Expect.generateCss('#c-s', '.i_s')).toMatch(/\n.i_s s{color:#9c8293;text-decoration:none}$/);
  } // rufflib-expect/src/methods/expect.js

  /* ---------------------------------- Tests --------------------------------- */
  // Tests Expect.expect().
  // Apologies if this seems a bit mind-bendingly self-referential — look at the
  // unit tests in other RuffLIBs, to make things clearer. @TODO provide link


  function test$2(expect, Expect) {
    expect().section('expect() Basics');
    var basics = new Expect();
    expect("typeof basics.expect", _typeof(basics.expect)).toBe('function');
    expect("typeof basics.expect()", _typeof(basics.expect())).toBe('object');
    expect().section('expect().section()');
    var fooBarSection = new Expect();
    expect("typeof fooBarSection.expect().section", _typeof(fooBarSection.expect().section)).toBe('function');
    expect("fooBarSection.expect().section('FooBar Section')", fooBarSection.expect().section('FooBar Section')).toBe(undefined);
    expect("fooBarSection.render(undefined, '', true)", fooBarSection.render(undefined, '', true)).toMatch(/FooBar Section/);
    expect().section('expect().toBe()');
    var toBe = new Expect();
    expect("typeof toBe.expect().toBe", _typeof(toBe.expect().toBe)).toBe('function');
    expect("toBe.expect('A', 1).toBe(1)", toBe.expect('A', 1).toBe(1)).toBe(true);
    expect("toBe", toBe).toHave({
      failTally: 0,
      passTally: 1,
      status: 'pass'
    });
    expect("toBe.expect('B', true).toBe(1) // note that true == 1, but true !== 1", toBe.expect('B', true).toBe(1)).toBe(false);
    expect("toBe", toBe).toHave({
      failTally: 1,
      passTally: 1,
      status: 'fail'
    });
    var obj = {
      ok: 123
    };
    expect("toBe.expect('C', obj).toBe(obj)", toBe.expect('C', obj).toBe(obj)).toBe(true);
    expect("toBe", toBe).toHave({
      failTally: 1,
      passTally: 2,
      status: 'fail'
    });
    expect("toBe.expect('D', obj).toBe({ ok:123 })", toBe.expect('D', obj).toBe({
      ok: 123
    })).toBe(false);
    expect("toBe", toBe).toHave({
      failTally: 2,
      passTally: 2,
      status: 'fail'
    });
    expect("toBe.render('Raw')", toBe.render('Raw')).toJson([{
      kind: 'SectionTitle',
      sectionIndex: 0,
      sectionTitle: 'Untitled Section'
    }, {
      kind: 'Passed',
      sectionIndex: 0,
      testTitle: 'A'
    }, {
      actually: true,
      expected: 1,
      kind: 'Failed',
      sectionIndex: 0,
      testTitle: 'B'
    }, {
      kind: 'Passed',
      sectionIndex: 0,
      testTitle: 'C'
    }, {
      actually: {
        ok: 123
      },
      expected: {
        ok: 123
      },
      kind: 'Failed',
      sectionIndex: 0,
      testTitle: 'D'
    }]);
    expect().section('expect().toError()');
    var toError = new Expect();
    expect("typeof toError.expect().toError", _typeof(toError.expect().toError)).toBe('function');
    expect("toError.expect('A', { error:'Expected Error' }).toError('Expected Error')", toError.expect('A', {
      error: 'Expected Error'
    }).toError('Expected Error')).toBe(true);
    expect("toError.expect('B', { error:'' }).toError('')", toError.expect('B', {
      error: ''
    }).toError('')).toBe(true);
    expect("toError.expect('C', { error:123 }).toError(123)", toError.expect('C', {
      error: 123
    }).toError(123)).toBe(true);
    expect("toError.expect('D', { error:'Expected Error' }).toError({ error:'Nope!' })", toError.expect('D', {
      error: 'Expected Error'
    }).toError({
      error: 'Nope!'
    })).toBe(false);
    expect("toError.expect('E', { error:'Expected Error' }).toError(123)", toError.expect('E', {
      error: 'Expected Error'
    }).toError(123)).toBe(false);
    expect("toError.expect('F', null).toError('no error on a null') // null is (sorta) an object", toError.expect('F', null).toError('no error on a null')).toBe(false);
    expect("toError.expect('G').toError()", toError.expect('G').toError()).toBe(false);
    expect("toError", toError).toHave({
      failTally: 4,
      passTally: 3,
      status: 'fail'
    });
    expect("toError.render('Raw')", toError.render('Raw')).toJson([{
      kind: 'SectionTitle',
      sectionIndex: 0,
      sectionTitle: 'Untitled Section'
    }, {
      kind: 'Passed',
      sectionIndex: 0,
      testTitle: 'A'
    }, {
      kind: 'Passed',
      sectionIndex: 0,
      testTitle: 'B'
    }, {
      kind: 'Passed',
      sectionIndex: 0,
      testTitle: 'C'
    }, {
      actually: 'Expected Error',
      expected: {
        error: 'Nope!'
      },
      kind: 'Failed',
      sectionIndex: 0,
      testTitle: 'D'
    }, {
      actually: 'Expected Error',
      expected: 123,
      kind: 'Failed',
      sectionIndex: 0,
      testTitle: 'E'
    }, {
      actually: null,
      expected: 'no error on a null',
      kind: 'Failed',
      sectionIndex: 0,
      testTitle: 'F'
    }, {
      kind: 'Failed',
      sectionIndex: 0,
      testTitle: 'G'
    }]);
    expect().section('expect().toHave()');
    var toHave = new Expect();
    expect("typeof toHave.expect().toHave", _typeof(toHave.expect().toHave)).toBe('function');
    expect("toHave.expect('A', { a:1, b:null, c:[1,2,3] }).toHave({ a:1, b:null, c:[1,2,3] })", toHave.expect('A', {
      a: 1,
      b: null,
      c: [1, 2, 3]
    }).toHave({
      a: 1,
      b: null,
      c: [1, 2, 3]
    })).toBe(true);
    expect("toHave.expect('B', { a:1, b:null, c:[1,2,3] }).toHave({ c:[1,2,3] }) // ok this way...", toHave.expect('B', {
      a: 1,
      b: null,
      c: [1, 2, 3]
    }).toHave({
      c: [1, 2, 3]
    })).toBe(true);
    expect("toHave.expect('C', { c:[1,2,3] }).toHave({ a:1, b:null, c:[1,2,3] }) // ...but not this way", toHave.expect('C', {
      c: [1, 2, 3]
    }).toHave({
      a: 1,
      b: null,
      c: [1, 2, 3]
    })).toBe(false);
    expect("toHave.expect('D', { a:1, b:null, c:[1,2,3] }).toHave({}) // empty expected object", toHave.expect('D', {
      a: 1,
      b: null,
      c: [1, 2, 3]
    }).toHave({})).toBe(true);
    expect("toHave.expect('E', { a:1, b:null, c:[1,2,3] }).toHave(123) // expected is not an object", toHave.expect('E', {
      a: 1,
      b: null,
      c: [1, 2, 3]
    }).toHave(123)).toBe(true);
    expect("toHave.expect('F', 123).toHave({ a:1 }) // actually is not an object", toHave.expect('F', 123).toHave({
      a: 1
    })).toBe(false);
    expect("toHave.expect('G', { a:1, error:'Oh no!' }).toHave({ a:1 }) // matching a:1 is ignored", toHave.expect('G', {
      a: 1,
      error: 'Oh no!'
    }).toHave({
      a: 1
    })).toBe(false);
    expect("toHave.expect().section('Values differ')", toHave.expect().section('Values differ')).toBe();
    expect("toHave.expect('H', { a:2, b:null, c:[1,2,3] }).toHave({ a:1 }) // a is different", toHave.expect('H', {
      a: 2,
      b: null,
      c: [1, 2, 3]
    }).toHave({
      a: 1
    })).toBe(false);
    expect("toHave.expect('I', { a:1, b:undefined, c:[1,2,3] }).toHave({ a:1, b:null }) // undefined !== null", toHave.expect('I', {
      a: 1,
      b: undefined,
      c: [1, 2, 3]
    }).toHave({
      a: 1,
      b: null
    })).toBe(false);
    expect("toHave.expect('J', { a:1, b:null, c:[1,2,3] }).toHave({ c:[2,3,1] }) // c array-content is different", toHave.expect('J', {
      a: 1,
      b: null,
      c: [1, 2, 3]
    }).toHave({
      c: [2, 3, 1]
    })).toBe(false);
    expect("toHave", toHave).toHave({
      failTally: 6,
      passTally: 4,
      status: 'fail'
    });
    expect("toHave.render('Raw')", toHave.render('Raw')).toJson([{
      kind: 'SectionTitle',
      sectionIndex: 0,
      sectionTitle: 'Untitled Section'
    }, {
      kind: 'Passed',
      sectionIndex: 0,
      testTitle: 'A'
    }, {
      kind: 'Passed',
      sectionIndex: 0,
      testTitle: 'B'
    }, {
      expected: '1',
      kind: 'Failed',
      sectionIndex: 0,
      testTitle: 'C.a'
    }, {
      kind: 'Passed',
      sectionIndex: 0,
      testTitle: 'D'
    }, {
      kind: 'Passed',
      sectionIndex: 0,
      testTitle: 'E'
    }, {
      expected: '1',
      kind: 'Failed',
      sectionIndex: 0,
      testTitle: 'F.a'
    }, {
      actually: 'Oh no!',
      expected: '{"a":1}',
      kind: 'Error',
      sectionIndex: 0,
      testTitle: 'G'
    }, {
      kind: 'SectionTitle',
      sectionIndex: 1,
      sectionTitle: 'Values differ'
    }, {
      actually: '2',
      expected: '1',
      kind: 'Failed',
      sectionIndex: 1,
      testTitle: 'H.a'
    }, {
      expected: 'null',
      kind: 'Failed',
      sectionIndex: 1,
      testTitle: 'I.b'
    }, {
      actually: '[1,2,3]',
      expected: '[2,3,1]',
      kind: 'Failed',
      sectionIndex: 1,
      testTitle: 'J.c'
    }]);
    expect().section('expect().toJson()');
    var toJson = new Expect();
    expect("typeof toJson.expect().toJson", _typeof(toJson.expect().toJson)).toBe('function');
    expect("toHave.expect().section('Values the same')", toHave.expect().section('Values the same')).toBe();
    expect("toJson.expect('A', { a:1, b:2 }).toJson({ a:1, b:2 })", toJson.expect('A', {
      a: 1,
      b: 2
    }).toJson({
      a: 1,
      b: 2
    })).toBe(true);
    expect("toJson.expect('B', { a:1, b:2 }).toJson({ b:2, a:1 }) // order matters", toJson.expect('B', {
      a: 1,
      b: 2
    }).toJson({
      b: 2,
      a: 1
    })).toBe(false);
    expect("toJson.expect('C', 'some text').toJson('some text')", toJson.expect('C', 'some text').toJson('some text')).toBe(true);
    expect("toJson.expect('D').toJson()", toJson.expect('D').toJson()).toBe(true);
    expect("toJson.expect('E', ['str', [1,2,3], true, null]).toJson(['str', [1,2,3], true, null])", toJson.expect('E', ['str', [1, 2, 3], true, null]).toJson(['str', [1, 2, 3], true, null])).toBe(true);
    expect("toHave.expect().section('Values differ')", toHave.expect().section('Values differ')).toBe();
    expect("toJson.expect('F', ['str', [1,2,3], true, null]).toJson(['nope', [1,2,3], true, null])", toJson.expect('F', ['str', [1, 2, 3], true, null]).toJson(['nope', [1, 2, 3], true, null])).toBe(false);
    expect("toJson.expect('G', ['str', [1,2,3], true, null]).toJson(['str', [2,3,1], true, null])", toJson.expect('G', ['str', [1, 2, 3], true, null]).toJson(['str', [2, 3, 1], true, null])).toBe(false);
    expect("toJson.expect('H', ['str', [1,2,3], true, null]).toJson(['str', [1,2,3], false, null])", toJson.expect('H', ['str', [1, 2, 3], true, null]).toJson(['str', [1, 2, 3], false, null])).toBe(false);
    expect("toJson.expect('I', ['str', [1,2,3], true, null]).toJson(['str', [1,2,3], false])", toJson.expect('I', ['str', [1, 2, 3], true, null]).toJson(['str', [1, 2, 3], false])).toBe(false);
    expect("toJson", toJson).toHave({
      failTally: 5,
      passTally: 4,
      status: 'fail'
    });
    expect("toJson.render('Raw')", toJson.render('Raw')).toJson([{
      kind: 'SectionTitle',
      sectionIndex: 0,
      sectionTitle: 'Untitled Section'
    }, {
      kind: 'Passed',
      sectionIndex: 0,
      testTitle: 'A'
    }, {
      actually: '{"a":1,"b":2}',
      expected: '{"b":2,"a":1}',
      kind: 'Failed',
      sectionIndex: 0,
      testTitle: 'B'
    }, {
      kind: 'Passed',
      sectionIndex: 0,
      testTitle: 'C'
    }, {
      kind: 'Passed',
      sectionIndex: 0,
      testTitle: 'D'
    }, {
      kind: 'Passed',
      sectionIndex: 0,
      testTitle: 'E'
    }, {
      actually: '["str",[1,2,3],true,null]',
      expected: '["nope",[1,2,3],true,null]',
      kind: 'Failed',
      sectionIndex: 0,
      testTitle: 'F'
    }, {
      actually: '["str",[1,2,3],true,null]',
      expected: '["str",[2,3,1],true,null]',
      kind: 'Failed',
      sectionIndex: 0,
      testTitle: 'G'
    }, {
      actually: '["str",[1,2,3],true,null]',
      expected: '["str",[1,2,3],false,null]',
      kind: 'Failed',
      sectionIndex: 0,
      testTitle: 'H'
    }, {
      actually: '["str",[1,2,3],true,null]',
      expected: '["str",[1,2,3],false]',
      kind: 'Failed',
      sectionIndex: 0,
      testTitle: 'I'
    }]);
    expect().section('expect().toMatch()');
    var toMatch = new Expect();
    expect("typeof toMatch.expect().toMatch", _typeof(toMatch.expect().toMatch)).toBe('function');
    expect("toMatch.expect('A', 'abc').toMatch(/^abc$/)", toMatch.expect('A', 'abc').toMatch(/^abc$/)).toBe(true);
    expect("toMatch.expect('B', 'abc').toMatch(/^xyz$/)", toMatch.expect('B', 'abc').toMatch(/^xyz$/)).toBe(false);
    expect("toMatch.expect('C', 'abc').toMatch({ test:s=>s=='abc' })", toMatch.expect('C', 'abc').toMatch({
      test: function test(s) {
        return s == 'abc';
      }
    })).toBe(true);
    expect("toMatch.expect('D', 'abc').toMatch({ test:s=>s=='xyz' })", toMatch.expect('D', 'abc').toMatch({
      test: function test(s) {
        return s == 'xyz';
      }
    })).toBe(false);
    expect("toMatch.expect('E').toMatch(/^abc$/)", toMatch.expect('E').toMatch(/^abc$/)).toBe(false);
    expect("toMatch.expect('F', 'abc').toMatch()", toMatch.expect('F', 'abc').toMatch()).toBe(false);
    expect("toMatch", toMatch).toHave({
      failTally: 4,
      passTally: 2,
      status: 'fail'
    });
    expect("toMatch.render('Raw')", toMatch.render('Raw')).toJson([{
      kind: 'SectionTitle',
      sectionIndex: 0,
      sectionTitle: 'Untitled Section'
    }, {
      kind: 'Passed',
      sectionIndex: 0,
      testTitle: 'A'
    }, {
      actually: 'abc',
      expected: {},
      kind: 'Failed',
      sectionIndex: 0,
      testTitle: 'B'
    }, {
      kind: 'Passed',
      sectionIndex: 0,
      testTitle: 'C'
    }, {
      actually: 'abc',
      expected: {},
      kind: 'Failed',
      sectionIndex: 0,
      testTitle: 'D'
    }, {
      expected: {},
      kind: 'Failed',
      sectionIndex: 0,
      testTitle: 'E'
    }, {
      actually: 'abc',
      kind: 'Failed',
      sectionIndex: 0,
      testTitle: 'F'
    }]);
  } // rufflib-expect/src/methods/render.js

  /* ---------------------------------- Tests --------------------------------- */
  // Tests expect.render().


  function test$1(expect, Expect) {
    var testSuite = new Expect('My Great Test Suite');
    expect().section('render() basics and exceptions'); // Basics.

    expect("typeof testSuite.render", _typeof(testSuite.render)).toBe('function');
    expect("typeof testSuite.render('Ansi')", _typeof(testSuite.render('Ansi'))).toBe('string');
    expect("typeof testSuite.render('Html')", _typeof(testSuite.render('Html'))).toBe('string');
    expect("typeof testSuite.render('Json')", _typeof(testSuite.render('Json'))).toBe('string');
    expect("typeof testSuite.render('Plain')", _typeof(testSuite.render('Plain'))).toBe('string');
    expect("typeof testSuite.render('Raw')", _typeof(testSuite.render('Raw'))).toBe('object');
    expect("Array.isArray(testSuite.render('Raw'))", Array.isArray(testSuite.render('Raw'))).toBe(true); // Incorrect arguments should throw exceptions.

    var exc;
    var OK = 'Did not encounter an exception';

    try {
      testSuite.render(123);
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    expect("testSuite.render(123)", exc).toBe("Error: expect.render(): unexpected format, try 'Ansi|Html|Json|Plain|Raw'");
    expect().section('render() with no tests'); // Before any tests have been specified.

    expect("testSuite.render('Ansi')", testSuite.render('Ansi')).toMatch(/^-{79}\n\u001b\[1mMy Great Test Suite\u001b\[0m\n={19}\n\u001b\[32m√ Passed\u001b\[0m 0 tests\n-{79}\n$/);
    expect("testSuite.render('Html')", testSuite.render('Html')).toBe('<hr><h2>My Great Test Suite</h2>\n<i>√ Passed</i> 0 tests\n<hr>\n');
    expect("testSuite.render('Json')", testSuite.render('Json')).toBe(['{', '  "fail_tally": 0,', '  "pass_tally": 0,', '  "status": "pass",', '  "suite_title": "My Great Test Suite",', '  "log": [', '', '  ]', '}'].join('\n'));
    expect("testSuite.render('Plain')", testSuite.render('Plain')).toMatch(/^-{79}\nMy Great Test Suite\n={19}\nPassed 0 tests\n-{79}\n$/);
    expect("testSuite.render('Raw')", testSuite.render('Raw')).toJson([]);
    expect().section('render() with tests'); // One passing test, in a defaultly-named section.

    expect("testSuite.expect('A', 1).toBe(1) // same test as in 'expect().toBe()'", testSuite.expect('A', 1).toBe(1)).toBe(true);
    expect("testSuite.render('Ansi')", testSuite.render('Ansi')).toMatch(/^-{79}\n\u001b\[1mMy Great Test Suite\u001b\[0m\n={19}\n\u001b\[32m√ Passed\u001b\[0m 1 test\n-{79}\n$/);
    expect("testSuite.render('Ansi', '', true)", testSuite.render('Ansi', '', true)).toMatch(/-{79}\n\n\u001b\[1mUntitled Section:\u001b\[0m\n-{17}\n\u001b\[32m√ Passed\u001b\[0m A\n\n\n-{79}\n/);
    expect("testSuite.render('Html')", testSuite.render('Html')).toBe('<hr><h2>My Great Test Suite</h2>\n<i>√ Passed</i> 1 test\n<hr>\n');
    expect("testSuite.render('Html', '', true)", testSuite.render('Html', '', true)).toBe('<hr><h2>My Great Test Suite</h2>\n<i>√ Passed</i> 1 test\n<hr>\n' + '\n<b>Untitled Section:</b>\n<i>√ Passed</i> A\n\n\n' + '<hr><h2>My Great Test Suite</h2>\n<i>√ Passed</i> 1 test\n<hr>\n');
    expect("testSuite.render('Json')", testSuite.render('Json')).toBe(['{', '  "fail_tally": 0,', '  "pass_tally": 1,', '  "status": "pass",', '  "suite_title": "My Great Test Suite",', '  "log": [', '', '  ]', '}'].join('\n'));
    expect("testSuite.render('Json', '', true)", testSuite.render('Json', '', true)).toBe(['{', '  "fail_tally": 0,', '  "pass_tally": 1,', '  "status": "pass",', '  "suite_title": "My Great Test Suite",', '  "log": [', '    { "kind": "SectionTitle", "section_title": "Untitled Section" },', '    { "kind": "Passed", "test_title": "A" }', '  ]', '}'].join('\n'));
    expect("testSuite.render('Plain')", testSuite.render('Plain')).toMatch(/^-{79}\nMy Great Test Suite\n={19}\nPassed 1 test\n-{79}\n$/);
    expect("testSuite.render('Plain', '', true)", testSuite.render('Plain', '', true)).toMatch(/-{79}\n\nUntitled Section:\n-{17}\nPassed A\n\n\n-{79}\n/);
    var rawResultOneTest = [{
      kind: 'SectionTitle',
      sectionIndex: 0,
      sectionTitle: 'Untitled Section'
    }, {
      kind: 'Passed',
      sectionIndex: 0,
      testTitle: 'A'
    }];
    expect("testSuite.render('Raw')", testSuite.render('Raw')).toJson(rawResultOneTest);
    expect("testSuite.render('Raw', '', true)", testSuite.render('Raw', '', true)).toJson(rawResultOneTest); // Add three failing tests and a passing test, in a custom-named section.

    expect("testSuite.expect().section('Second Section')", testSuite.expect().section('Second Section')).toBe(undefined);
    expect("testSuite.expect('B', 1).toBe(0)", testSuite.expect('B', 1).toBe(0)).toBe(false);
    expect("testSuite.expect('C', 1).toBe(1)", testSuite.expect('C', 1).toBe(1)).toBe(true);
    expect("testSuite.expect('D', {error:'Actual Error'}).toError('Expected Error')", testSuite.expect('D', {
      error: 'Actual Error'
    }).toError('Expected Error')).toBe(false);
    expect("testSuite.expect('E', {error:'Unexpectedly Error'}).toHave({a:1})", testSuite.expect('E', {
      error: 'Unexpectedly Error'
    }).toHave({
      a: 1
    })).toBe(false);
    expect("testSuite.render('Ansi')", testSuite.render('Ansi')).toMatch(new RegExp([/^-{79}\n\u001b\[1mMy Great Test Suite\u001b\[0m\n={19}\n/, /\u001b\[31mX Failed\u001b\[0m 3 of 5\n-{79}\n\n/, /\u001b\[1mSecond Section:\u001b\[0m\n-{15}\n/, /\u001b\[31mX Failed\u001b\[0m B:\n/, /  \u001b\[2mexpected:\u001b\[0m 0\n/, /  \u001b\[2mactually:\u001b\[0m 1\n/, /\u001b\[31mX Failed\u001b\[0m D:\n/, /  \u001b\[2mexpected:\u001b\[0m Expected Error\n/, /  \u001b\[2mactually:\u001b\[0m Actual Error\n/, /\u001b\[31mX Failed\u001b\[0m E:\n/, /  \u001b\[2mactually is an error:\u001b\[0m\n/, /  Unexpectedly Error\n$/].map(function (r) {
      return r.source;
    }).join('')));
    expect("testSuite.render('Ansi', 'untitled', true)", testSuite.render('Ansi', 'untitled', true)).toMatch(new RegExp([/^-{79}\n\u001b\[1mMy Great Test Suite\u001b\[0m\n={19}\n/, /\u001b\[31mX Failed\u001b\[0m 3 of 5\n-{79}\n\n/, /\u001b\[1mUntitled Section:\u001b\[0m\n-{17}\n/, /\u001b\[32m√ Passed\u001b\[0m A\n\n\n-{79}\n/, /\u001b\[1mMy Great Test Suite\u001b\[0m\n={19}\n/, /\u001b\[31mX Failed\u001b\[0m 3 of 5\n-{79}\n$/].map(function (r) {
      return r.source;
    }).join('')));
    expect("testSuite.render('Ansi', 'second', true)", testSuite.render('Ansi', 'second', true)).toMatch(new RegExp([/^-{79}\n\u001b\[1mMy Great Test Suite\u001b\[0m\n={19}\n/, /\u001b\[31mX Failed\u001b\[0m 3 of 5\n-{79}\n\n/, /\u001b\[1mSecond Section:\u001b\[0m\n-{15}\n/, /\u001b\[31mX Failed\u001b\[0m B:\n/, /  \u001b\[2mexpected:\u001b\[0m 0\n/, /  \u001b\[2mactually:\u001b\[0m 1\n/, /\u001b\[32m√ Passed\u001b\[0m C\n/, /\u001b\[31mX Failed\u001b\[0m D:\n/, /  \u001b\[2mexpected:\u001b\[0m Expected Error\n/, /  \u001b\[2mactually:\u001b\[0m Actual Error\n/, /\u001b\[31mX Failed\u001b\[0m E:\n/, /  \u001b\[2mactually is an error:\u001b\[0m\n/, /  Unexpectedly Error\n\n\n/, /-{79}\n\u001b\[1mMy Great Test Suite\u001b\[0m\n={19}\n/, /\u001b\[31mX Failed\u001b\[0m 3 of 5\n-{79}/].map(function (r) {
      return r.source;
    }).join('')));
    expect("testSuite.render('Ansi', '', true)", testSuite.render('Ansi', '', true)).toMatch(new RegExp([/^-{79}\n\u001b\[1mMy Great Test Suite\u001b\[0m\n={19}\n/, /\u001b\[31mX Failed\u001b\[0m 3 of 5\n-{79}\n\n/, /\u001b\[1mUntitled Section:\u001b\[0m\n-{17}\n/, /\u001b\[32m√ Passed\u001b\[0m A\n\n/, /\u001b\[1mSecond Section:\u001b\[0m\n-{15}\n/, /\u001b\[31mX Failed\u001b\[0m B:\n/, /  \u001b\[2mexpected:\u001b\[0m 0\n/, /  \u001b\[2mactually:\u001b\[0m 1\n/, /\u001b\[32m√ Passed\u001b\[0m C\n/, /\u001b\[31mX Failed\u001b\[0m D:\n/, /  \u001b\[2mexpected:\u001b\[0m Expected Error\n/, /  \u001b\[2mactually:\u001b\[0m Actual Error\n/, /\u001b\[31mX Failed\u001b\[0m E:\n/, /  \u001b\[2mactually is an error:\u001b\[0m\n/, /  Unexpectedly Error\n\n\n/, /-{79}\n\u001b\[1mMy Great Test Suite\u001b\[0m\n={19}\n/, /\u001b\[31mX Failed\u001b\[0m 3 of 5\n-{79}/].map(function (r) {
      return r.source;
    }).join('')));
    expect("testSuite.render('Html')", testSuite.render('Html')).toBe('<hr><h2>My Great Test Suite</h2>\n<u>X Failed</u> 3 of 5\n<hr>\n\n' + '<b>Second Section:</b>\n' + '<u>X Failed</u> B:\n  <s>expected:</s> 0\n  <s>actually:</s> 1\n' + '<u>X Failed</u> D:\n  <s>expected:</s> Expected Error\n  <s>actually:</s> Actual Error\n' + '<u>X Failed</u> E:\n  <s>actually is an error:</s>\n  Unexpectedly Error\n');
    expect("testSuite.render('Html', 'untitled', true)", testSuite.render('Html', 'untitled', true)).toBe('<hr><h2>My Great Test Suite</h2>\n<u>X Failed</u> 3 of 5\n<hr>\n\n' + '<b>Untitled Section:</b>\n<i>√ Passed</i> A\n\n\n' + '<hr><h2>My Great Test Suite</h2>\n<u>X Failed</u> 3 of 5\n<hr>\n');
    expect("testSuite.render('Html', 'second', true)", testSuite.render('Html', 'second', true)).toBe('<hr><h2>My Great Test Suite</h2>\n<u>X Failed</u> 3 of 5\n<hr>\n\n' + '<b>Second Section:</b>\n<u>X Failed</u> B:\n' + '  <s>expected:</s> 0\n  <s>actually:</s> 1\n' + '<i>√ Passed</i> C\n' + '<u>X Failed</u> D:\n  <s>expected:</s> Expected Error\n  <s>actually:</s> Actual Error\n' + '<u>X Failed</u> E:\n  <s>actually is an error:</s>\n  Unexpectedly Error\n\n\n' + '<hr><h2>My Great Test Suite</h2>\n<u>X Failed</u> 3 of 5\n<hr>\n');
    expect("testSuite.render('Html', '', true)", testSuite.render('Html', '', true)).toBe('<hr><h2>My Great Test Suite</h2>\n<u>X Failed</u> 3 of 5\n<hr>\n\n' + '<b>Untitled Section:</b>\n<i>√ Passed</i> A\n\n' + '<b>Second Section:</b>\n<u>X Failed</u> B:\n' + '  <s>expected:</s> 0\n  <s>actually:</s> 1\n' + '<i>√ Passed</i> C\n' + '<u>X Failed</u> D:\n  <s>expected:</s> Expected Error\n  <s>actually:</s> Actual Error\n' + '<u>X Failed</u> E:\n  <s>actually is an error:</s>\n  Unexpectedly Error\n\n\n' + '<hr><h2>My Great Test Suite</h2>\n<u>X Failed</u> 3 of 5\n<hr>\n');
    expect("testSuite.render('Json')", testSuite.render('Json')).toBe(['{', '  "fail_tally": 3,', '  "pass_tally": 2,', '  "status": "fail",', '  "suite_title": "My Great Test Suite",', '  "log": [', '    { "kind": "SectionTitle", "section_title": "Second Section" },', '    { "kind": "Failed", "test_title": "B",', '      "expected": 0,', '      "actually": 1 },', '    { "kind": "Failed", "test_title": "D",', '      "expected": "Expected Error",', '      "actually": "Actual Error" },', '    { "kind": "Error", "test_title": "E",', '      "error": "Unexpectedly Error" }', '  ]', '}'].join('\n'));
    expect("testSuite.render('Json', 'untitled', true)", testSuite.render('Json', 'untitled', true)).toBe(['{', '  "fail_tally": 3,', '  "pass_tally": 2,', '  "status": "fail",', '  "suite_title": "My Great Test Suite",', '  "log": [', '    { "kind": "SectionTitle", "section_title": "Untitled Section" },', '    { "kind": "Passed", "test_title": "A" }', '  ]', '}'].join('\n'));
    expect("testSuite.render('Json', 'second', true)", testSuite.render('Json', 'second', true)).toBe(['{', '  "fail_tally": 3,', '  "pass_tally": 2,', '  "status": "fail",', '  "suite_title": "My Great Test Suite",', '  "log": [', '    { "kind": "SectionTitle", "section_title": "Second Section" },', '    { "kind": "Failed", "test_title": "B",', '      "expected": 0,', '      "actually": 1 },', '    { "kind": "Passed", "test_title": "C" },', '    { "kind": "Failed", "test_title": "D",', '      "expected": "Expected Error",', '      "actually": "Actual Error" },', '    { "kind": "Error", "test_title": "E",', '      "error": "Unexpectedly Error" }', '  ]', '}'].join('\n'));
    expect("testSuite.render('Json', '', true)", testSuite.render('Json', '', true)).toBe(['{', '  "fail_tally": 3,', '  "pass_tally": 2,', '  "status": "fail",', '  "suite_title": "My Great Test Suite",', '  "log": [', '    { "kind": "SectionTitle", "section_title": "Untitled Section" },', '    { "kind": "Passed", "test_title": "A" },', '    { "kind": "SectionTitle", "section_title": "Second Section" },', '    { "kind": "Failed", "test_title": "B",', '      "expected": 0,', '      "actually": 1 },', '    { "kind": "Passed", "test_title": "C" },', '    { "kind": "Failed", "test_title": "D",', '      "expected": "Expected Error",', '      "actually": "Actual Error" },', '    { "kind": "Error", "test_title": "E",', '      "error": "Unexpectedly Error" }', '  ]', '}'].join('\n'));
    expect("testSuite.render('Plain')", testSuite.render('Plain')).toMatch(new RegExp([/^-{79}\nMy Great Test Suite\n={19}\n/, /Failed 3 of 5\n-{79}\n\n/, /Second Section:\n-{15}\n/, /Failed B:\n/, /  expected: 0\n/, /  actually: 1\n/, /Failed D:\n/, /  expected: Expected Error\n/, /  actually: Actual Error\n/, /Failed E:\n/, /  actually is an error:\n/, /  Unexpectedly Error/].map(function (r) {
      return r.source;
    }).join('')));
    expect("testSuite.render('Plain', 'untitled', true)", testSuite.render('Plain', 'untitled', true)).toMatch(new RegExp([/^-{79}\nMy Great Test Suite\n={19}\n/, /Failed 3 of 5\n-{79}\n\n/, /Untitled Section:\n-{17}\n/, /Passed A\n\n\n-{79}\n/, /My Great Test Suite\n={19}\n/, /Failed 3 of 5\n-{79}\n$/].map(function (r) {
      return r.source;
    }).join('')));
    expect("testSuite.render('Plain', 'second', true)", testSuite.render('Plain', 'second', true)).toMatch(new RegExp([/^-{79}\nMy Great Test Suite\n={19}\n/, /Failed 3 of 5\n-{79}\n\n/, /Second Section:\n-{15}\n/, /Failed B:\n/, /  expected: 0\n/, /  actually: 1\n/, /Passed C\n/, /Failed D:\n/, /  expected: Expected Error\n/, /  actually: Actual Error\n/, /Failed E:\n/, /  actually is an error:\n/, /  Unexpectedly Error\n\n\n/, /-{79}\nMy Great Test Suite\n={19}\n/, /Failed 3 of 5\n-{79}/].map(function (r) {
      return r.source;
    }).join('')));
    expect("testSuite.render('Plain', '', true)", testSuite.render('Plain', '', true)).toMatch(new RegExp([/^-{79}\nMy Great Test Suite\n={19}\n/, /Failed 3 of 5\n-{79}\n\n/, /Untitled Section:\n-{17}\n/, /Passed A\n\n/, /Second Section:\n-{15}\n/, /Failed B:\n/, /  expected: 0\n/, /  actually: 1\n/, /Passed C\n/, /Failed D:\n/, /  expected: Expected Error\n/, /  actually: Actual Error\n/, /Failed E:\n/, /  actually is an error:\n/, /  Unexpectedly Error\n\n\n/, /-{79}\nMy Great Test Suite\n={19}\n/, /Failed 3 of 5\n-{79}/].map(function (r) {
      return r.source;
    }).join('')));
    var rawResultFourTests = [{
      kind: 'SectionTitle',
      sectionIndex: 0,
      sectionTitle: 'Untitled Section'
    }, {
      kind: 'Passed',
      sectionIndex: 0,
      testTitle: 'A'
    }, {
      kind: 'SectionTitle',
      sectionIndex: 1,
      sectionTitle: 'Second Section'
    }, {
      actually: 1,
      expected: 0,
      kind: 'Failed',
      sectionIndex: 1,
      testTitle: 'B'
    }, {
      kind: 'Passed',
      sectionIndex: 1,
      testTitle: 'C'
    }, {
      actually: 'Actual Error',
      expected: 'Expected Error',
      kind: 'Failed',
      sectionIndex: 1,
      testTitle: 'D'
    }, {
      actually: 'Unexpectedly Error',
      expected: '{"a":1}',
      kind: 'Error',
      sectionIndex: 1,
      testTitle: 'E'
    }];
    expect("testSuite.render('Raw')", testSuite.render('Raw')).toJson(rawResultFourTests);
    expect("testSuite.render('Raw', 'untitled', true)", testSuite.render('Raw', 'untitled', true)).toJson(rawResultFourTests);
    expect("testSuite.render('Raw', 'second', true)", testSuite.render('Raw', 'second', true)).toJson(rawResultFourTests);
    expect("testSuite.render('Raw', '', true)", testSuite.render('Raw', '', true)).toJson(rawResultFourTests);
  } // rufflib-expect/src/expect.js
  // Assembles the `Expect` class.

  /* --------------------------------- Import --------------------------------- */


  var VERSION = '1.0.1';
  /* ---------------------------------- Tests --------------------------------- */
  // Runs basic Expect tests on itself.

  function test(expect, Expect) {
    expect().section('Expect basics');
    expect("typeof Expect // in JavaScript, a class is type 'function'", _typeof(Expect)).toBe('function');
    expect("Expect.VERSION", Expect.VERSION).toBe(VERSION);
    expect("typeof new Expect()", _typeof(new Expect())).toBe('object');
    expect("new Expect()", new Expect()).toHave({
      failTally: 0,
      passTally: 0,
      status: 'pass'
    });
    expect().section('Typical usage');

    function factorialise(n) {
      if (n === 0 || n === 1) return 1;

      for (var i = n - 1; i > 0; i--) {
        n *= i;
      }

      return n;
    }

    expect("factorialise(5) // 5! = 5 * 4 * 3 * 2 * 1", factorialise(5)).toBe(120);
    var mathsy = new Expect('Mathsy Test Suite');
    expect("mathsy.expect('factorialise(5)', factorialise(5)).toBe(120)", mathsy.expect('factorialise(5)', factorialise(5)).toBe(120)).toBe(true);
    expect("mathsy", mathsy).toHave({
      failTally: 0,
      passTally: 1,
      status: 'pass'
    });
    expect("mathsy.expect('factorialise(3)', factorialise(3)).toBe(77)", mathsy.expect('factorialise(3)', factorialise(3)).toBe(77)).toBe(false);
    expect("mathsy", mathsy).toHave({
      failTally: 1,
      passTally: 1,
      status: 'fail'
    });
    expect("mathsy.render()", mathsy.render()).toMatch(/Mathsy Test Suite\n={17}\nFailed 1 of 2\n/);
    expect("mathsy.render()", mathsy.render()).toMatch(/Untitled Section:\n-{17}\n/);
    expect("mathsy.render()", mathsy.render()).toMatch(/Failed factorialise\(3\):\s+expected: 77\s+actually: 6/);
    expect().section('reset()');
    expect("typeof mathsy.reset", _typeof(mathsy.reset)).toBe('function');
    expect("mathsy.reset()", mathsy.reset()).toBe(undefined);
    expect("mathsy", mathsy).toHave({
      failTally: 0,
      passTally: 0,
      status: 'pass'
    });
    expect("mathsy.render()", mathsy.render()).toMatch(/^-{79}\nMathsy Test Suite\n={17}\nPassed 0 tests\n-{79}\n$/);
  } // rufflib-expect/src/entry-point-for-tests.js
  // Run each test. You can comment-out some during development, to help focus on
  // individual tests. But make sure all tests are uncommented before committing.


  function expectTest(expect, Expect) {
    test(expect, Expect);
    test$2(expect, Expect);
    test$3(expect, Expect);
    test$1(expect, Expect);
  }

  return expectTest;

}));
