/**
 * Unit tests for rufflib-expect 1.0.1
 * A RuffLIB library for unit testing rough and sketchy JavaScript apps.
 * https://richplastow.com/rufflib-expect
 * @license MIT
 */


// rufflib-expect/src/methods/generate-css.js


const RX_SELECTOR = /^[.#]?[a-z][-_0-9a-z]*$/i;


/* ---------------------------------- Tests --------------------------------- */

// Tests Expect.generateCss().
function test$3(that, Expect) {
    that().section('generateCss()');

    // Basics.
    that(`typeof Expect.generateCss`,
          typeof Expect.generateCss).toBe('function');
    that(`typeof Expect.generateCss('a', 'b')`,
          typeof Expect.generateCss('a', 'b')).toBe('string');
    that(`Expect.generateCss('a', 'b').split('\\n').length`,
          Expect.generateCss('a', 'b').split('\n').length).toBe(18);

    // Incorrect arguments should throw exceptions.
    let exc;
    const OK = 'Did not encounter an exception';
    try { Expect.generateCss(); exc = OK; } catch (e) { exc = `${e}`; }
    that(`Expect.generateCss()`, exc)
        .toBe(`Error: Expect.generateCss(): the mandatory containerSelector argument is falsey`);
    try { Expect.generateCss([]); exc = OK; } catch (e) { exc = `${e}`; }
    that(`Expect.generateCss([])`, exc)
        .toBe(`Error: Expect.generateCss(): containerSelector is type 'object' not 'string'`);
    try { Expect.generateCss('a b'); exc = OK; } catch (e) { exc = `${e}`; }
    that(`Expect.generateCss('a b')`, exc)
        .toBe(`Error: Expect.generateCss(): containerSelector fails ${RX_SELECTOR}`);
    try { Expect.generateCss('abc'); exc = OK; } catch (e) { exc = `${e}`; }
    that(`Expect.generateCss('abc')`, exc)
        .toBe(`Error: Expect.generateCss(): the mandatory innerSelector argument is falsey`);
    try { Expect.generateCss('.a', []); exc = OK; } catch (e) { exc = `${e}`; }
    that(`Expect.generateCss('.a', [])`, exc)
        .toBe(`Error: Expect.generateCss(): innerSelector is type 'object' not 'string'`);
    try { Expect.generateCss('#abc', 'abc*/'); exc = OK; } catch (e) { exc = `${e}`; }
    that(`Expect.generateCss('#abc', 'abc*/')`, exc)
        .toBe(`Error: Expect.generateCss(): innerSelector fails ${RX_SELECTOR}`);

    // Typical usage.
    that(`Expect.generateCss('container', 'inner') // first line`,
          Expect.generateCss('container', 'inner')).toMatch(
          /^\/\* Expect\.generateCss\('container', 'inner'\) \*\/\n/);
    that(`Expect.generateCss('#c-s', '.i_s') // a middle line`,
          Expect.generateCss('#c-s', '.i_s')).toMatch(
          /\n#c-s\.fail .i_s{background:#411;color:#fce}\n/);
    that(`Expect.generateCss('#c-s', '.i_s') // last line`,
          Expect.generateCss('#c-s', '.i_s')).toMatch(
          /\n.i_s s{color:#9c8293;text-decoration:none}$/);
}

// rufflib-expect/src/methods/render.js


/* ---------------------------------- Tests --------------------------------- */

// Tests expect.render().
function test$2(that, Expect) {
    const testedExpect = new Expect('My Great Test Suite');

    // Basics.
    that().section('render() basics and exceptions');
    that(`typeof testedExpect.render`,
          typeof testedExpect.render).toBe('function');
    that(`typeof testedExpect.render('Ansi')`,
          typeof testedExpect.render('Ansi')).toBe('string');
    that(`typeof testedExpect.render('Html')`,
          typeof testedExpect.render('Html')).toBe('string');
    that(`typeof testedExpect.render('Json')`,
          typeof testedExpect.render('Json')).toBe('string');
    that(`typeof testedExpect.render('Plain')`,
          typeof testedExpect.render('Plain')).toBe('string');
    that(`typeof testedExpect.render('Raw')`,
          typeof testedExpect.render('Raw')).toBe('object');
    that(`Array.isArray(testedExpect.render('Raw'))`,
          Array.isArray(testedExpect.render('Raw'))).toBe(true);

    // Incorrect arguments should throw exceptions.
    let exc;
    const OK = 'Did not encounter an exception';
    try {   testedExpect.render(123); exc = OK; } catch (e) { exc = `${e}`; }
    that(`testedExpect.render(123)`, exc)
        .toBe(`Error: expect.render(): unexpected format, try 'Ansi|Html|Json|Plain|Raw'`);

    // Before any tests have been specified.
    that().section('render() with no tests');
    that(`testedExpect.render('Ansi')`,
          testedExpect.render('Ansi')).toMatch(
          /^-{79}\n\u001b\[1mMy Great Test Suite\u001b\[0m\n={19}\n\u001b\[32m√ Passed\u001b\[0m 0 tests\n-{79}\n$/);
    that(`testedExpect.render('Html')`,
          testedExpect.render('Html')).toBe(
          '<hr><h2>My Great Test Suite</h2>\n<i>√ Passed</i> 0 tests\n<hr>\n');
    that(`testedExpect.render('Json')`,
          testedExpect.render('Json')).toBe([
              '{',
              '  "fail_tally": 0,',
              '  "pass_tally": 0,',
              '  "status": "pass",',
              '  "suite_title": "My Great Test Suite",',
              '  "log": [',
              '',
              '  ]',
              '}',
          ].join('\n'));
    that(`testedExpect.render('Plain')`,
          testedExpect.render('Plain')).toMatch(
          /^-{79}\nMy Great Test Suite\n={19}\nPassed 0 tests\n-{79}\n$/);
    that(`testedExpect.render('Raw')`,
          testedExpect.render('Raw')).toJson([]);

    // One passing test, in a defaultly-named section.
    that().section('render() with tests');
    that(`testedExpect.that('A', 1).toBe(1) // same test as in 'that().toBe()'`,
          testedExpect.that('A', 1).toBe(1)).toBe(true);
    that(`testedExpect.render('Ansi')`,
          testedExpect.render('Ansi')).toMatch(
          /^-{79}\n\u001b\[1mMy Great Test Suite\u001b\[0m\n={19}\n\u001b\[32m√ Passed\u001b\[0m 1 test\n-{79}\n$/);
    that(`testedExpect.render('Ansi', '', true)`,
          testedExpect.render('Ansi', '', true)).toMatch(
          /-{79}\n\n\u001b\[1mUntitled Section:\u001b\[0m\n-{17}\n\u001b\[32m√ Passed\u001b\[0m A\n\n\n-{79}\n/);
    that(`testedExpect.render('Html')`,
          testedExpect.render('Html')).toBe(
          '<hr><h2>My Great Test Suite</h2>\n<i>√ Passed</i> 1 test\n<hr>\n');
    that(`testedExpect.render('Html', '', true)`,
          testedExpect.render('Html', '', true)).toBe(
          '<hr><h2>My Great Test Suite</h2>\n<i>√ Passed</i> 1 test\n<hr>\n' +
          '\n<b>Untitled Section:</b>\n<i>√ Passed</i> A\n\n\n' +
          '<hr><h2>My Great Test Suite</h2>\n<i>√ Passed</i> 1 test\n<hr>\n');
    that(`testedExpect.render('Json')`,
          testedExpect.render('Json')).toBe([
              '{',
              '  "fail_tally": 0,',
              '  "pass_tally": 1,',
              '  "status": "pass",',
              '  "suite_title": "My Great Test Suite",',
              '  "log": [',
              '',
              '  ]',
              '}',
          ].join('\n'));
    that(`testedExpect.render('Json', '', true)`,
          testedExpect.render('Json', '', true)).toBe([
              '{',
              '  "fail_tally": 0,',
              '  "pass_tally": 1,',
              '  "status": "pass",',
              '  "suite_title": "My Great Test Suite",',
              '  "log": [',
              '    { "kind": "SectionTitle", "section_title": "Untitled Section" },',
              '    { "kind": "Passed", "test_title": "A" }',
              '  ]',
              '}',
          ].join('\n'));
    that(`testedExpect.render('Plain')`,
          testedExpect.render('Plain')).toMatch(
              /^-{79}\nMy Great Test Suite\n={19}\nPassed 1 test\n-{79}\n$/);
    that(`testedExpect.render('Plain', '', true)`,
          testedExpect.render('Plain', '', true)).toMatch(
              /-{79}\n\nUntitled Section:\n-{17}\nPassed A\n\n\n-{79}\n/);
    const rawResultOneTest = [
        {
          kind: 'SectionTitle',
          sectionIndex: 0,
          sectionTitle: 'Untitled Section'
        },
        { kind: 'Passed', sectionIndex: 0, testTitle: 'A' }
    ];
    that(`testedExpect.render('Raw')`,
          testedExpect.render('Raw')).toJson(rawResultOneTest);
    that(`testedExpect.render('Raw', '', true)`,
          testedExpect.render('Raw', '', true)).toJson(rawResultOneTest);

    // Add three failing tests and a passing test, in a custom-named section.
    that(`testedExpect.that().section('Second Section')`,
          testedExpect.that().section('Second Section')).toBe(undefined);
    that(`testedExpect.that('B', 1).toBe(0)`,
          testedExpect.that('B', 1).toBe(0)).toBe(false);
    that(`testedExpect.that('C', 1).toBe(1)`,
          testedExpect.that('C', 1).toBe(1)).toBe(true);
    that(`testedExpect.that('D', {error:'Actual Error'}).toError('Expected Error')`,
          testedExpect.that('D', {error:'Actual Error'}).toError('Expected Error')).toBe(false);
    that(`testedExpect.that('E', {error:'Unexpectedly Error'}).toHave({a:1})`,
          testedExpect.that('E', {error:'Unexpectedly Error'}).toHave({a:1})).toBe(false);

    that(`testedExpect.render('Ansi')`,
          testedExpect.render('Ansi')).toMatch(new RegExp([
              /^-{79}\n\u001b\[1mMy Great Test Suite\u001b\[0m\n={19}\n/,
              /\u001b\[31mX Failed\u001b\[0m 3 of 5\n-{79}\n\n/,
              /\u001b\[1mSecond Section:\u001b\[0m\n-{15}\n/,
              /\u001b\[31mX Failed\u001b\[0m B:\n/,
              /  \u001b\[2mexpected:\u001b\[0m 0\n/,
              /  \u001b\[2mactually:\u001b\[0m 1\n/,
              /\u001b\[31mX Failed\u001b\[0m D:\n/,
              /  \u001b\[2mexpected:\u001b\[0m Expected Error\n/,
              /  \u001b\[2mactually:\u001b\[0m Actual Error\n/,
              /\u001b\[31mX Failed\u001b\[0m E:\n/,
              /  \u001b\[2mactually is an error:\u001b\[0m\n/,
              /  Unexpectedly Error\n$/,
          ].map(r=>r.source).join('')));
    that(`testedExpect.render('Ansi', 'untitled', true)`,
          testedExpect.render('Ansi', 'untitled', true)).toMatch(new RegExp([
              /^-{79}\n\u001b\[1mMy Great Test Suite\u001b\[0m\n={19}\n/,
              /\u001b\[31mX Failed\u001b\[0m 3 of 5\n-{79}\n\n/,
              /\u001b\[1mUntitled Section:\u001b\[0m\n-{17}\n/,
              /\u001b\[32m√ Passed\u001b\[0m A\n\n\n-{79}\n/,
              /\u001b\[1mMy Great Test Suite\u001b\[0m\n={19}\n/,
              /\u001b\[31mX Failed\u001b\[0m 3 of 5\n-{79}\n$/,
          ].map(r=>r.source).join('')));
    that(`testedExpect.render('Ansi', 'second', true)`,
          testedExpect.render('Ansi', 'second', true)).toMatch(new RegExp([
              /^-{79}\n\u001b\[1mMy Great Test Suite\u001b\[0m\n={19}\n/,
              /\u001b\[31mX Failed\u001b\[0m 3 of 5\n-{79}\n\n/,
              /\u001b\[1mSecond Section:\u001b\[0m\n-{15}\n/,
              /\u001b\[31mX Failed\u001b\[0m B:\n/,
              /  \u001b\[2mexpected:\u001b\[0m 0\n/,
              /  \u001b\[2mactually:\u001b\[0m 1\n/,
              /\u001b\[32m√ Passed\u001b\[0m C\n/,
              /\u001b\[31mX Failed\u001b\[0m D:\n/,
              /  \u001b\[2mexpected:\u001b\[0m Expected Error\n/,
              /  \u001b\[2mactually:\u001b\[0m Actual Error\n/,
              /\u001b\[31mX Failed\u001b\[0m E:\n/,
              /  \u001b\[2mactually is an error:\u001b\[0m\n/,
              /  Unexpectedly Error\n\n\n/,
              /-{79}\n\u001b\[1mMy Great Test Suite\u001b\[0m\n={19}\n/,
              /\u001b\[31mX Failed\u001b\[0m 3 of 5\n-{79}/,
          ].map(r=>r.source).join('')));
    that(`testedExpect.render('Ansi', '', true)`,
          testedExpect.render('Ansi', '', true)).toMatch(new RegExp([
              /^-{79}\n\u001b\[1mMy Great Test Suite\u001b\[0m\n={19}\n/,
              /\u001b\[31mX Failed\u001b\[0m 3 of 5\n-{79}\n\n/,
              /\u001b\[1mUntitled Section:\u001b\[0m\n-{17}\n/,
              /\u001b\[32m√ Passed\u001b\[0m A\n\n/,
              /\u001b\[1mSecond Section:\u001b\[0m\n-{15}\n/,
              /\u001b\[31mX Failed\u001b\[0m B:\n/,
              /  \u001b\[2mexpected:\u001b\[0m 0\n/,
              /  \u001b\[2mactually:\u001b\[0m 1\n/,
              /\u001b\[32m√ Passed\u001b\[0m C\n/,
              /\u001b\[31mX Failed\u001b\[0m D:\n/,
              /  \u001b\[2mexpected:\u001b\[0m Expected Error\n/,
              /  \u001b\[2mactually:\u001b\[0m Actual Error\n/,
              /\u001b\[31mX Failed\u001b\[0m E:\n/,
              /  \u001b\[2mactually is an error:\u001b\[0m\n/,
              /  Unexpectedly Error\n\n\n/,
              /-{79}\n\u001b\[1mMy Great Test Suite\u001b\[0m\n={19}\n/,
              /\u001b\[31mX Failed\u001b\[0m 3 of 5\n-{79}/,
          ].map(r=>r.source).join('')));
    that(`testedExpect.render('Html')`,
          testedExpect.render('Html')).toBe(
              '<hr><h2>My Great Test Suite</h2>\n<u>X Failed</u> 3 of 5\n<hr>\n\n'
            + '<b>Second Section:</b>\n'
            + '<u>X Failed</u> B:\n  <s>expected:</s> 0\n  <s>actually:</s> 1\n'
            + '<u>X Failed</u> D:\n  <s>expected:</s> Expected Error\n  <s>actually:</s> Actual Error\n'
            + '<u>X Failed</u> E:\n  <s>actually is an error:</s>\n  Unexpectedly Error\n'
          );
    that(`testedExpect.render('Html', 'untitled', true)`,
          testedExpect.render('Html', 'untitled', true)).toBe(
              '<hr><h2>My Great Test Suite</h2>\n<u>X Failed</u> 3 of 5\n<hr>\n\n'
            + '<b>Untitled Section:</b>\n<i>√ Passed</i> A\n\n\n'
            + '<hr><h2>My Great Test Suite</h2>\n<u>X Failed</u> 3 of 5\n<hr>\n');
    that(`testedExpect.render('Html', 'second', true)`,
          testedExpect.render('Html', 'second', true)).toBe(
              '<hr><h2>My Great Test Suite</h2>\n<u>X Failed</u> 3 of 5\n<hr>\n\n'
            + '<b>Second Section:</b>\n<u>X Failed</u> B:\n'
            + '  <s>expected:</s> 0\n  <s>actually:</s> 1\n'
            + '<i>√ Passed</i> C\n'
            + '<u>X Failed</u> D:\n  <s>expected:</s> Expected Error\n  <s>actually:</s> Actual Error\n'
            + '<u>X Failed</u> E:\n  <s>actually is an error:</s>\n  Unexpectedly Error\n\n\n'
            + '<hr><h2>My Great Test Suite</h2>\n<u>X Failed</u> 3 of 5\n<hr>\n');
    that(`testedExpect.render('Html', '', true)`,
          testedExpect.render('Html', '', true)).toBe(
              '<hr><h2>My Great Test Suite</h2>\n<u>X Failed</u> 3 of 5\n<hr>\n\n'
            + '<b>Untitled Section:</b>\n<i>√ Passed</i> A\n\n'
            + '<b>Second Section:</b>\n<u>X Failed</u> B:\n'
            + '  <s>expected:</s> 0\n  <s>actually:</s> 1\n'
            + '<i>√ Passed</i> C\n'
            + '<u>X Failed</u> D:\n  <s>expected:</s> Expected Error\n  <s>actually:</s> Actual Error\n'
            + '<u>X Failed</u> E:\n  <s>actually is an error:</s>\n  Unexpectedly Error\n\n\n'
            + '<hr><h2>My Great Test Suite</h2>\n<u>X Failed</u> 3 of 5\n<hr>\n');
    that(`testedExpect.render('Json')`,
          testedExpect.render('Json')).toBe([
              '{',
              '  "fail_tally": 3,',
              '  "pass_tally": 2,',
              '  "status": "fail",',
              '  "suite_title": "My Great Test Suite",',
              '  "log": [',
              '    { "kind": "SectionTitle", "section_title": "Second Section" },',
              '    { "kind": "Failed", "test_title": "B",',
              '      "expected": 0,',
              '      "actually": 1 },',
              '    { "kind": "Failed", "test_title": "D",',
              '      "expected": "Expected Error",',
              '      "actually": "Actual Error" },',
              '    { "kind": "Error", "test_title": "E",',
              '      "error": "Unexpectedly Error" }',
              '  ]',
              '}',
          ].join('\n'));
    that(`testedExpect.render('Json', 'untitled', true)`,
          testedExpect.render('Json', 'untitled', true)).toBe([
              '{',
              '  "fail_tally": 3,',
              '  "pass_tally": 2,',
              '  "status": "fail",',
              '  "suite_title": "My Great Test Suite",',
              '  "log": [',
              '    { "kind": "SectionTitle", "section_title": "Untitled Section" },',
              '    { "kind": "Passed", "test_title": "A" }',
              '  ]',
              '}',
          ].join('\n'));
    that(`testedExpect.render('Json', 'second', true)`,
          testedExpect.render('Json', 'second', true)).toBe([
              '{',
              '  "fail_tally": 3,',
              '  "pass_tally": 2,',
              '  "status": "fail",',
              '  "suite_title": "My Great Test Suite",',
              '  "log": [',
              '    { "kind": "SectionTitle", "section_title": "Second Section" },',
              '    { "kind": "Failed", "test_title": "B",',
              '      "expected": 0,',
              '      "actually": 1 },',
              '    { "kind": "Passed", "test_title": "C" },',
              '    { "kind": "Failed", "test_title": "D",',
              '      "expected": "Expected Error",',
              '      "actually": "Actual Error" },',
              '    { "kind": "Error", "test_title": "E",',
              '      "error": "Unexpectedly Error" }',
              '  ]',
              '}',
          ].join('\n'));
    that(`testedExpect.render('Json', '', true)`,
          testedExpect.render('Json', '', true)).toBe([
              '{',
              '  "fail_tally": 3,',
              '  "pass_tally": 2,',
              '  "status": "fail",',
              '  "suite_title": "My Great Test Suite",',
              '  "log": [',
              '    { "kind": "SectionTitle", "section_title": "Untitled Section" },',
              '    { "kind": "Passed", "test_title": "A" },',
              '    { "kind": "SectionTitle", "section_title": "Second Section" },',
              '    { "kind": "Failed", "test_title": "B",',
              '      "expected": 0,',
              '      "actually": 1 },',
              '    { "kind": "Passed", "test_title": "C" },',
              '    { "kind": "Failed", "test_title": "D",',
              '      "expected": "Expected Error",',
              '      "actually": "Actual Error" },',
              '    { "kind": "Error", "test_title": "E",',
              '      "error": "Unexpectedly Error" }',
              '  ]',
              '}',
          ].join('\n'));
    that(`testedExpect.render('Plain')`,
          testedExpect.render('Plain')).toMatch(new RegExp([
              /^-{79}\nMy Great Test Suite\n={19}\n/,
              /Failed 3 of 5\n-{79}\n\n/,
              /Second Section:\n-{15}\n/,
              /Failed B:\n/,
              /  expected: 0\n/,
              /  actually: 1\n/,
              /Failed D:\n/,
              /  expected: Expected Error\n/,
              /  actually: Actual Error\n/,
              /Failed E:\n/,
              /  actually is an error:\n/,
              /  Unexpectedly Error/,
          ].map(r=>r.source).join('')));
    that(`testedExpect.render('Plain', 'untitled', true)`,
          testedExpect.render('Plain', 'untitled', true)).toMatch(new RegExp([
              /^-{79}\nMy Great Test Suite\n={19}\n/,
              /Failed 3 of 5\n-{79}\n\n/,
              /Untitled Section:\n-{17}\n/,
              /Passed A\n\n\n-{79}\n/,
              /My Great Test Suite\n={19}\n/,
              /Failed 3 of 5\n-{79}\n$/,
          ].map(r=>r.source).join('')));
    that(`testedExpect.render('Plain', 'second', true)`,
          testedExpect.render('Plain', 'second', true)).toMatch(new RegExp([
              /^-{79}\nMy Great Test Suite\n={19}\n/,
              /Failed 3 of 5\n-{79}\n\n/,
              /Second Section:\n-{15}\n/,
              /Failed B:\n/,
              /  expected: 0\n/,
              /  actually: 1\n/,
              /Passed C\n/,
              /Failed D:\n/,
              /  expected: Expected Error\n/,
              /  actually: Actual Error\n/,
              /Failed E:\n/,
              /  actually is an error:\n/,
              /  Unexpectedly Error\n\n\n/,
              /-{79}\nMy Great Test Suite\n={19}\n/,
              /Failed 3 of 5\n-{79}/,
          ].map(r=>r.source).join('')));
    that(`testedExpect.render('Plain', '', true)`,
          testedExpect.render('Plain', '', true)).toMatch(new RegExp([
              /^-{79}\nMy Great Test Suite\n={19}\n/,
              /Failed 3 of 5\n-{79}\n\n/,
              /Untitled Section:\n-{17}\n/,
              /Passed A\n\n/,
              /Second Section:\n-{15}\n/,
              /Failed B:\n/,
              /  expected: 0\n/,
              /  actually: 1\n/,
              /Passed C\n/,
              /Failed D:\n/,
              /  expected: Expected Error\n/,
              /  actually: Actual Error\n/,
              /Failed E:\n/,
              /  actually is an error:\n/,
              /  Unexpectedly Error\n\n\n/,
              /-{79}\nMy Great Test Suite\n={19}\n/,
              /Failed 3 of 5\n-{79}/,
          ].map(r=>r.source).join('')));
    const rawResultFourTests = [
        {
          kind: 'SectionTitle',
          sectionIndex: 0,
          sectionTitle: 'Untitled Section'
        },
        { kind: 'Passed', sectionIndex: 0, testTitle: 'A' },
        {
          kind: 'SectionTitle',
          sectionIndex: 1,
          sectionTitle: 'Second Section'
        },
        {
          actually: 1,
          expected: 0,
          kind: 'Failed',
          sectionIndex: 1,
          testTitle: 'B'
        },
        { kind: 'Passed', sectionIndex: 1, testTitle: 'C' },
        {
          actually: 'Actual Error',
          expected: 'Expected Error',
          kind: 'Failed',
          sectionIndex: 1,
          testTitle: 'D'
        },
        {
          actually: 'Unexpectedly Error',
          expected: '{"a":1}',
          kind: 'Error',
          sectionIndex: 1,
          testTitle: 'E'
        }  
    ];
    that(`testedExpect.render('Raw')`,
          testedExpect.render('Raw')).toJson(rawResultFourTests);
    that(`testedExpect.render('Raw', 'untitled', true)`,
          testedExpect.render('Raw', 'untitled', true)).toJson(rawResultFourTests);
    that(`testedExpect.render('Raw', 'second', true)`,
          testedExpect.render('Raw', 'second', true)).toJson(rawResultFourTests);
    that(`testedExpect.render('Raw', '', true)`,
          testedExpect.render('Raw', '', true)).toJson(rawResultFourTests);

}

// rufflib-expect/src/methods/expect.js


/* ---------------------------------- Tests --------------------------------- */

// Tests Expect.that().
// Apologies if this seems a bit mind-bendingly self-referential — look at the
// unit tests in other RuffLIBs, to make things clearer. @TODO provide link
function test$1(that, Expect) {

    that().section('that() Basics');
    const basics = new Expect();
    that(`typeof basics.that`,
          typeof basics.that).toBe('function');
    that(`typeof basics.that()`,
          typeof basics.that()).toBe('object');

    that().section('that().section()');
    const fooBarSection = new Expect();
    that(`typeof fooBarSection.that().section`,
          typeof fooBarSection.that().section).toBe('function');
    that(`fooBarSection.that().section('FooBar Section')`,
          fooBarSection.that().section('FooBar Section')).toBe(undefined);
    that(`fooBarSection.render(undefined, '', true)`,
          fooBarSection.render(undefined, '', true)).toMatch(/FooBar Section/);

    that().section('that().toBe()');
    const toBe = new Expect();
    that(`typeof toBe.that().toBe`,
          typeof toBe.that().toBe).toBe('function');
    that(`toBe.that('A', 1).toBe(1)`,
          toBe.that('A', 1).toBe(1)).toBe(true);
    that(`toBe`, toBe).toHave({ failTally: 0, passTally: 1, status: 'pass' });
    that(`toBe.that('B', true).toBe(1) // note that true == 1, but true !== 1`,
          toBe.that('B', true).toBe(1)).toBe(false);
    that(`toBe`, toBe).toHave({ failTally: 1, passTally: 1, status: 'fail' });
    const obj = { ok:123 };
    that(`toBe.that('C', obj).toBe(obj)`,
          toBe.that('C', obj).toBe(obj)).toBe(true);
    that(`toBe`, toBe).toHave({ failTally: 1, passTally: 2, status: 'fail' });
    that(`toBe.that('D', obj).toBe({ ok:123 })`,
          toBe.that('D', obj).toBe({ ok:123 })).toBe(false);
    that(`toBe`, toBe).toHave({ failTally: 2, passTally: 2, status: 'fail' });
    that(`toBe.render('Raw')`,
          toBe.render('Raw')).toJson([
              {
                  kind: 'SectionTitle',
                  sectionIndex: 0,
                  sectionTitle: 'Untitled Section'
              },
              { kind: 'Passed', sectionIndex: 0, testTitle: 'A' },
              {
                  actually: true,
                  expected: 1,
                  kind: 'Failed',
                  sectionIndex: 0,
                  testTitle: 'B'
              },
              { kind: 'Passed', sectionIndex: 0, testTitle: 'C' },
              {
                  actually: { ok:123 },
                  expected: { ok:123 },
                  kind: 'Failed',
                  sectionIndex: 0,
                  testTitle: 'D'
              }
          ]);

    that().section('that().toError()');
    const toError = new Expect();
    that(`typeof toError.that().toError`,
          typeof toError.that().toError).toBe('function');
    that(`toError.that('A', { error:'Expected Error' }).toError('Expected Error')`,
          toError.that('A', { error:'Expected Error' }).toError('Expected Error')).toBe(true);
    that(`toError.that('B', { error:'' }).toError('')`,
          toError.that('B', { error:'' }).toError('')).toBe(true);
    that(`toError.that('C', { error:123 }).toError(123)`,
          toError.that('C', { error:123 }).toError(123)).toBe(true);
    that(`toError.that('D', { error:'Expected Error' }).toError({ error:'Nope!' })`,
          toError.that('D', { error:'Expected Error' }).toError({ error:'Nope!' })).toBe(false);
    that(`toError.that('E', { error:'Expected Error' }).toError(123)`,
          toError.that('E', { error:'Expected Error' }).toError(123)).toBe(false);
    that(`toError.that('F', null).toError('no error on a null') // null is (sorta) an object`,
          toError.that('F', null).toError('no error on a null')).toBe(false);
    that(`toError.that('G').toError()`,
          toError.that('G').toError()).toBe(false);
    that(`toError`, toError).toHave({ failTally: 4, passTally: 3, status: 'fail' });
    that(`toError.render('Raw')`,
          toError.render('Raw')).toJson([
              {
                  kind: 'SectionTitle',
                  sectionIndex: 0,
                  sectionTitle: 'Untitled Section'
              },
              { kind: 'Passed', sectionIndex: 0, testTitle: 'A' },
              { kind: 'Passed', sectionIndex: 0, testTitle: 'B' },
              { kind: 'Passed', sectionIndex: 0, testTitle: 'C' },
              {
                  actually: 'Expected Error',
                  expected: { error: 'Nope!' },
                  kind: 'Failed',
                  sectionIndex: 0,
                  testTitle: 'D'
              },
              {
                  actually: 'Expected Error',
                  expected: 123,
                  kind: 'Failed',
                  sectionIndex: 0,
                  testTitle: 'E'
              },
              {
                  actually: null,
                  expected: 'no error on a null',
                  kind: 'Failed',
                  sectionIndex: 0,
                  testTitle: 'F'
              },
              {
                  kind: 'Failed',
                  sectionIndex: 0,
                  testTitle: 'G'
              },
          ]);

    that().section('that().toHave()');
    const toHave = new Expect();
    that(`typeof toHave.that().toHave`,
          typeof toHave.that().toHave).toBe('function');
    that(`toHave.that('A', { a:1, b:null, c:[1,2,3] }).toHave({ a:1, b:null, c:[1,2,3] })`,
          toHave.that('A', { a:1, b:null, c:[1,2,3] }).toHave({ a:1, b:null, c:[1,2,3] })).toBe(true);
    that(`toHave.that('B', { a:1, b:null, c:[1,2,3] }).toHave({ c:[1,2,3] }) // ok this way...`,
          toHave.that('B', { a:1, b:null, c:[1,2,3] }).toHave({ c:[1,2,3] })).toBe(true);
    that(`toHave.that('C', { c:[1,2,3] }).toHave({ a:1, b:null, c:[1,2,3] }) // ...but not this way`,
          toHave.that('C', { c:[1,2,3] }).toHave({ a:1, b:null, c:[1,2,3] })).toBe(false);
    that(`toHave.that('D', { a:1, b:null, c:[1,2,3] }).toHave({}) // empty expected object`,
          toHave.that('D', { a:1, b:null, c:[1,2,3] }).toHave({})).toBe(true);
    that(`toHave.that('E', { a:1, b:null, c:[1,2,3] }).toHave(123) // expected is not an object`,
          toHave.that('E', { a:1, b:null, c:[1,2,3] }).toHave(123)).toBe(true);
    that(`toHave.that('F', 123).toHave({ a:1 }) // actually is not an object`,
          toHave.that('F', 123).toHave({ a:1 })).toBe(false);
    that(`toHave.that('G', { a:1, error:'Oh no!' }).toHave({ a:1 }) // matching a:1 is ignored`,
          toHave.that('G', { a:1, error:'Oh no!' }).toHave({ a:1 })).toBe(false);
    that(`toHave.that().section('Values differ')`,
          toHave.that().section('Values differ')).toBe();
    that(`toHave.that('H', { a:2, b:null, c:[1,2,3] }).toHave({ a:1 }) // a is different`,
          toHave.that('H', { a:2, b:null, c:[1,2,3] }).toHave({ a:1 })).toBe(false);
    that(`toHave.that('I', { a:1, b:undefined, c:[1,2,3] }).toHave({ a:1, b:null }) // undefined !== null`,
          toHave.that('I', { a:1, b:undefined, c:[1,2,3] }).toHave({ a:1, b:null })).toBe(false);
    that(`toHave.that('J', { a:1, b:null, c:[1,2,3] }).toHave({ c:[2,3,1] }) // c array-content is different`,
          toHave.that('J', { a:1, b:null, c:[1,2,3] }).toHave({ c:[2,3,1] })).toBe(false);
    that(`toHave`, toHave).toHave({ failTally: 6, passTally: 4, status: 'fail' });
    that(`toHave.render('Raw')`,
          toHave.render('Raw')).toJson([
              {
                kind: 'SectionTitle',
                sectionIndex: 0,
                sectionTitle: 'Untitled Section'
              },
              { kind: 'Passed', sectionIndex: 0, testTitle: 'A' },
              { kind: 'Passed', sectionIndex: 0, testTitle: 'B' },
              {
                expected: '1',
                kind: 'Failed',
                sectionIndex: 0,
                testTitle: 'C.a'
              },
              { kind: 'Passed', sectionIndex: 0, testTitle: 'D' },
              { kind: 'Passed', sectionIndex: 0, testTitle: 'E' },
              {
                expected: '1',
                kind: 'Failed',
                sectionIndex: 0,
                testTitle: 'F.a'
              },
              {
                actually: 'Oh no!',
                expected: '{"a":1}',
                kind: 'Error',
                sectionIndex: 0,
                testTitle: 'G'
              },
              {
                kind: 'SectionTitle',
                sectionIndex: 1,
                sectionTitle: 'Values differ'
              },
              {
                actually: '2',
                expected: '1',
                kind: 'Failed',
                sectionIndex: 1,
                testTitle: 'H.a'
              },
              {
                expected: 'null',
                kind: 'Failed',
                sectionIndex: 1,
                testTitle: 'I.b'
              },
              {
                actually: '[1,2,3]',
                expected: '[2,3,1]',
                kind: 'Failed',
                sectionIndex: 1,
                testTitle: 'J.c'
              }
          ]);

    that().section('that().toJson()');
    const toJson = new Expect();
    that(`typeof toJson.that().toJson`,
          typeof toJson.that().toJson).toBe('function');
    that(`toJson.that().section('Values the same')`,
          toJson.that().section('Values the same')).toBe();
    that(`toJson.that('A', { a:1, b:2 }).toJson({ a:1, b:2 })`,
          toJson.that('A', { a:1, b:2 }).toJson({ a:1, b:2 })).toBe(true);
    that(`toJson.that('B', { a:1, b:2 }).toJson({ b:2, a:1 }) // order matters`,
          toJson.that('B', { a:1, b:2 }).toJson({ b:2, a:1 })).toBe(false);
    that(`toJson.that('C', 'some text').toJson('some text')`,
          toJson.that('C', 'some text').toJson('some text')).toBe(true);
    that(`toJson.that('D').toJson()`,
          toJson.that('D').toJson()).toBe(true);
    that(`toJson.that('E', ['str', [1,2,3], true, null]).toJson(['str', [1,2,3], true, null])`,
          toJson.that('E', ['str', [1,2,3], true, null]).toJson(['str', [1,2,3], true, null])).toBe(true);
    that(`toHave.that().section('Values differ')`,
          toHave.that().section('Values differ')).toBe();
    that(`toJson.that('F', ['str', [1,2,3], true, null]).toJson(['nope', [1,2,3], true, null])`,
          toJson.that('F', ['str', [1,2,3], true, null]).toJson(['nope', [1,2,3], true, null])).toBe(false);
    that(`toJson.that('G', ['str', [1,2,3], true, null]).toJson(['str', [2,3,1], true, null])`,
          toJson.that('G', ['str', [1,2,3], true, null]).toJson(['str', [2,3,1], true, null])).toBe(false);
    that(`toJson.that('H', ['str', [1,2,3], true, null]).toJson(['str', [1,2,3], false, null])`,
          toJson.that('H', ['str', [1,2,3], true, null]).toJson(['str', [1,2,3], false, null])).toBe(false);
    that(`toJson.that('I', ['str', [1,2,3], true, null]).toJson(['str', [1,2,3], false])`,
          toJson.that('I', ['str', [1,2,3], true, null]).toJson(['str', [1,2,3], false])).toBe(false);
    that(`toJson`, toJson).toHave({ failTally: 5, passTally: 4, status: 'fail' });
    that(`toJson.render('Raw')`,
          toJson.render('Raw')).toJson([
              {
                kind: 'SectionTitle',
                sectionIndex: 0,
                sectionTitle: 'Values the same'
              },
              { kind: 'Passed', sectionIndex: 0, testTitle: 'A' },
              {
                actually: '{"a":1,"b":2}',
                expected: '{"b":2,"a":1}',
                kind: 'Failed',
                sectionIndex: 0,
                testTitle: 'B'
              },
              { kind: 'Passed', sectionIndex: 0, testTitle: 'C' },
              { kind: 'Passed', sectionIndex: 0, testTitle: 'D' },
              { kind: 'Passed', sectionIndex: 0, testTitle: 'E' },
              {
                actually: '["str",[1,2,3],true,null]',
                expected: '["nope",[1,2,3],true,null]',
                kind: 'Failed',
                sectionIndex: 0,
                testTitle: 'F'
              },
              {
                actually: '["str",[1,2,3],true,null]',
                expected: '["str",[2,3,1],true,null]',
                kind: 'Failed',
                sectionIndex: 0,
                testTitle: 'G'
              },
              {
                actually: '["str",[1,2,3],true,null]',
                expected: '["str",[1,2,3],false,null]',
                kind: 'Failed',
                sectionIndex: 0,
                testTitle: 'H'
              },
              {
                actually: '["str",[1,2,3],true,null]',
                expected: '["str",[1,2,3],false]',
                kind: 'Failed',
                sectionIndex: 0,
                testTitle: 'I'
              }
          ]);

    that().section('that().toMatch()');
    const toMatch = new Expect();
    that(`typeof toMatch.that().toMatch`,
          typeof toMatch.that().toMatch).toBe('function');
    that(`toMatch.that('A', 'abc').toMatch(/^abc$/)`,
          toMatch.that('A', 'abc').toMatch(/^abc$/)).toBe(true);
    that(`toMatch.that('B', 'abc').toMatch(/^xyz$/)`,
          toMatch.that('B', 'abc').toMatch(/^xyz$/)).toBe(false);
    that(`toMatch.that('C', 'abc').toMatch({ test:s=>s=='abc' })`,
          toMatch.that('C', 'abc').toMatch({ test:s=>s=='abc' })).toBe(true);
    that(`toMatch.that('D', 'abc').toMatch({ test:s=>s=='xyz' })`,
          toMatch.that('D', 'abc').toMatch({ test:s=>s=='xyz' })).toBe(false);
    that(`toMatch.that('E').toMatch(/^abc$/)`,
          toMatch.that('E').toMatch(/^abc$/)).toBe(false);
    that(`toMatch.that('F', 'abc').toMatch()`,
          toMatch.that('F', 'abc').toMatch()).toBe(false);
    that(`toMatch`, toMatch).toHave({ failTally: 4, passTally: 2, status: 'fail' });
    that(`toMatch.render('Raw')`,
          toMatch.render('Raw')).toJson([
              {
                  kind: 'SectionTitle',
                  sectionIndex: 0,
                  sectionTitle: 'Untitled Section'
              },
              { kind: 'Passed', sectionIndex: 0, testTitle: 'A' },
              {
                  actually: 'abc',
                  expected: {},
                  kind: 'Failed',
                  sectionIndex: 0,
                  testTitle: 'B'
              },
              { kind: 'Passed', sectionIndex: 0, testTitle: 'C' },
              {
                  actually: 'abc',
                  expected: {},
                  kind: 'Failed',
                  sectionIndex: 0,
                  testTitle: 'D'
              },
              {
                  expected: {},
                  kind: 'Failed',
                  sectionIndex: 0,
                  testTitle: 'E'
              },
              {
                  actually: 'abc',
                  kind: 'Failed',
                  sectionIndex: 0,
                  testTitle: 'F'
              }
          ]);
}

// rufflib-expect/src/expect.js

// Assembles the `Expect` class.


/* --------------------------------- Import --------------------------------- */

const VERSION = '1.0.1';


/* ---------------------------------- Tests --------------------------------- */

// Runs basic Expect tests on itself.
function test(that, Expect) {
    that().section('Expect basics');
    that(`typeof Expect // in JavaScript, a class is type 'function'`,
          typeof Expect).toBe('function');
    that(`Expect.VERSION`,
          Expect.VERSION).toBe(VERSION);
    that(`typeof new Expect()`,
          typeof new Expect()).toBe('object');
    that(`new Expect()`,
          new Expect()).toHave({
              failTally: 0,
              passTally: 0,
              status: 'pass',
          });


    that().section('Typical usage');

    function factorialise(n) {
        if (n === 0 || n === 1) return 1;
        for (let i=n-1; i>0; i--) n *= i;
        return n;
    }
    that(`factorialise(5) // 5! = 5 * 4 * 3 * 2 * 1`,
          factorialise(5)).toBe(120);

    const mathsy = new Expect('Mathsy Test Suite');
    that(`mathsy.that('factorialise(5)', factorialise(5)).toBe(120)`,
          mathsy.that('factorialise(5)', factorialise(5)).toBe(120)).toBe(true);
    that(`mathsy`, mathsy).toHave({ failTally: 0, passTally: 1, status: 'pass' });
    that(`mathsy.that('factorialise(3)', factorialise(3)).toBe(77)`,
          mathsy.that('factorialise(3)', factorialise(3)).toBe(77)).toBe(false);
    that(`mathsy`, mathsy).toHave({ failTally: 1, passTally: 1, status: 'fail' });
    that(`mathsy.render()`,
          mathsy.render()).toMatch(/Mathsy Test Suite\n={17}\nFailed 1 of 2\n/);
    that(`mathsy.render()`,
          mathsy.render()).toMatch(/Untitled Section:\n-{17}\n/);
    that(`mathsy.render()`,
          mathsy.render()).toMatch(/Failed factorialise\(3\):\s+expected: 77\s+actually: 6/);


    that().section('reset()');
    that(`typeof mathsy.reset`,
          typeof mathsy.reset).toBe('function');
    that(`mathsy.reset()`,
          mathsy.reset()).toBe(undefined);
    that(`mathsy`, mathsy).toHave({ failTally: 0, passTally: 0, status: 'pass' });
    that(`mathsy.render()`,
          mathsy.render()).toMatch(/^-{79}\nMathsy Test Suite\n={17}\nPassed 0 tests\n-{79}\n$/);

}

// rufflib-expect/src/entry-point-for-tests.js

// Run each test. You can comment-out some during development, to help focus on
// individual tests. But make sure all tests are uncommented before committing.
function expectTest(that, Expect) {

    test(that, Expect);
    test$1(that, Expect);
    test$3(that, Expect);
    test$2(that, Expect);

}

export { expectTest as default };
