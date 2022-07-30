/**
 * Unit tests for rufflib-expect 3.0.4
 * A RuffLIB library for unit testing rough and sketchy JavaScript apps.
 * https://richplastow.com/rufflib-expect
 * @license MIT
 */


// rufflib-expect/src/methods/generate-css.js


const RX_SELECTOR = /^[.#]?[a-z][-_0-9a-z]*$/i;


/* ---------------------------------- Tests --------------------------------- */

// Tests Expect.generateCss().
function test$4(that, Expect) {
    that().section('generateCss()');

    // Basics.
    that(`typeof Expect.generateCss`,
          typeof Expect.generateCss).is('function');
    that(`typeof Expect.generateCss('a', 'b')`,
          typeof Expect.generateCss('a', 'b')).is('string');
    that(`Expect.generateCss('a', 'b').split('\\n').length`,
          Expect.generateCss('a', 'b').split('\n').length).is(18);

    // Incorrect arguments should throw exceptions.
    let exc;
    const OK = 'Did not encounter an exception';
    try { Expect.generateCss(); exc = OK; } catch (e) { exc = `${e}`; }
    that(`Expect.generateCss()`, exc)
        .is(`Error: Expect.generateCss(): the mandatory containerSelector argument is falsey`);
    try { Expect.generateCss([]); exc = OK; } catch (e) { exc = `${e}`; }
    that(`Expect.generateCss([])`, exc)
        .is(`Error: Expect.generateCss(): containerSelector is type 'object' not 'string'`);
    try { Expect.generateCss('a b'); exc = OK; } catch (e) { exc = `${e}`; }
    that(`Expect.generateCss('a b')`, exc)
        .is(`Error: Expect.generateCss(): containerSelector fails ${RX_SELECTOR}`);
    try { Expect.generateCss('abc'); exc = OK; } catch (e) { exc = `${e}`; }
    that(`Expect.generateCss('abc')`, exc)
        .is(`Error: Expect.generateCss(): the mandatory innerSelector argument is falsey`);
    try { Expect.generateCss('.a', []); exc = OK; } catch (e) { exc = `${e}`; }
    that(`Expect.generateCss('.a', [])`, exc)
        .is(`Error: Expect.generateCss(): innerSelector is type 'object' not 'string'`);
    try { Expect.generateCss('#abc', 'abc*/'); exc = OK; } catch (e) { exc = `${e}`; }
    that(`Expect.generateCss('#abc', 'abc*/')`, exc)
        .is(`Error: Expect.generateCss(): innerSelector fails ${RX_SELECTOR}`);

    // Typical usage.
    that(`Expect.generateCss('container', 'inner') // first line`,
          Expect.generateCss('container', 'inner')).passes(
          /^\/\* Expect\.generateCss\('container', 'inner'\) \*\/\n/);
    that(`Expect.generateCss('#c-s', '.i_s') // a middle line`,
          Expect.generateCss('#c-s', '.i_s')).passes(
          /\n#c-s\.fail .i_s{background:#411;color:#fce}\n/);
    that(`Expect.generateCss('#c-s', '.i_s') // last line`,
          Expect.generateCss('#c-s', '.i_s')).passes(
          /\n.i_s s{color:#9c8293;text-decoration:none}$/);
}

// rufflib-expect/src/methods/render.js


/* ---------------------------------- Tests --------------------------------- */

// Tests expect.render().
function test$3(that, Expect) {
    const expect = new Expect('My Great Test Suite');

    // Basics.
    that().section('render() basics and exceptions');
    that(`typeof expect.render`,
          typeof expect.render).is('function');
    that(`typeof expect.render('Ansi')`,
          typeof expect.render('Ansi')).is('string');
    that(`typeof expect.render('Html')`,
          typeof expect.render('Html')).is('string');
    that(`typeof expect.render('Json')`,
          typeof expect.render('Json')).is('string');
    that(`typeof expect.render('Plain')`,
          typeof expect.render('Plain')).is('string');
    that(`typeof expect.render('Raw')`,
          typeof expect.render('Raw')).is('object');
    that(`Array.isArray(expect.render('Raw'))`,
          Array.isArray(expect.render('Raw'))).is(true);

    // Incorrect arguments should throw exceptions.
    let exc;
    const OK = 'Did not encounter an exception';
    try {   expect.render(123); exc = OK; } catch (e) { exc = `${e}`; }
    that(`expect.render(123)`, exc)
        .is(`Error: expect.render(): unexpected format, try 'Ansi|Html|Json|Plain|Raw'`);

    // Before any tests have been specified.
    that().section('render() with no tests');
    that(`expect.render('Ansi')`,
          expect.render('Ansi')).passes(
          /^-{79}\n\u001b\[1mMy Great Test Suite\u001b\[0m\n={19}\n\u001b\[32m√ Passed\u001b\[0m 0 tests\n-{79}\n$/);
    that(`expect.render('Html')`,
          expect.render('Html')).is(
          '<hr><h2>My Great Test Suite</h2>\n<i>√ Passed</i> 0 tests\n<hr>\n');
    that(`expect.render('Json')`,
          expect.render('Json')).is([
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
    that(`expect.render('Plain')`,
          expect.render('Plain')).passes(
          /^-{79}\nMy Great Test Suite\n={19}\nPassed 0 tests\n-{79}\n$/);
    that(`expect.render('Raw')`,
          expect.render('Raw')).stringifiesTo([]);

    // One passing test, in a defaultly-named section.
    that().section('render() with tests');
    that(`expect.that('A', 1).is(1) // same test as in 'that().is()'`,
          expect.that('A', 1).is(1)).is(true);
    that(`expect.render('Ansi')`,
          expect.render('Ansi')).passes(
          /^-{79}\n\u001b\[1mMy Great Test Suite\u001b\[0m\n={19}\n\u001b\[32m√ Passed\u001b\[0m 1 test\n-{79}\n$/);
    that(`expect.render('Ansi', '', true)`,
          expect.render('Ansi', '', true)).passes(
          /-{79}\n\n\u001b\[1mUntitled Section:\u001b\[0m\n-{17}\n\u001b\[32m√ Passed\u001b\[0m A\n\n\n-{79}\n/);
    that(`expect.render('Html')`,
          expect.render('Html')).is(
          '<hr><h2>My Great Test Suite</h2>\n<i>√ Passed</i> 1 test\n<hr>\n');
    that(`expect.render('Html', '', true)`,
          expect.render('Html', '', true)).is(
          '<hr><h2>My Great Test Suite</h2>\n<i>√ Passed</i> 1 test\n<hr>\n' +
          '\n<b>Untitled Section:</b>\n<i>√ Passed</i> A\n\n\n' +
          '<hr><h2>My Great Test Suite</h2>\n<i>√ Passed</i> 1 test\n<hr>\n');
    that(`expect.render('Json')`,
          expect.render('Json')).is([
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
    that(`expect.render('Json', '', true)`,
          expect.render('Json', '', true)).is([
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
    that(`expect.render('Plain')`,
          expect.render('Plain')).passes(
              /^-{79}\nMy Great Test Suite\n={19}\nPassed 1 test\n-{79}\n$/);
    that(`expect.render('Plain', '', true)`,
          expect.render('Plain', '', true)).passes(
              /-{79}\n\nUntitled Section:\n-{17}\nPassed A\n\n\n-{79}\n/);
    const rawResultOneTest = [
        {
          kind: 'SectionTitle',
          sectionIndex: 0,
          sectionTitle: 'Untitled Section'
        },
        { kind: 'Passed', sectionIndex: 0, testTitle: 'A' }
    ];
    that(`expect.render('Raw')`,
          expect.render('Raw')).stringifiesTo(rawResultOneTest);
    that(`expect.render('Raw', '', true)`,
          expect.render('Raw', '', true)).stringifiesTo(rawResultOneTest);

    // Add three failing tests and a passing test, in a custom-named section.
    that(`expect.section('Second Section')`,
          expect.section('Second Section')).is(undefined);
    that(`expect.that('B', 1).is(0)`,
          expect.that('B', 1).is(0)).is(false);
    that(`expect.that('C', 1).is(1)`,
          expect.that('C', 1).is(1)).is(true);
    that(`expect.that('D', {error:'Actual Error'}).hasError('Expected Error')`,
          expect.that('D', {error:'Actual Error'}).hasError('Expected Error')).is(false);
    that(`expect.that('E', {error:'Unexpectedly Error'}).has({a:1})`,
          expect.that('E', {error:'Unexpectedly Error'}).has({a:1})).is(false);

    that(`expect.render('Ansi')`,
          expect.render('Ansi')).passes(new RegExp([
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
    that(`expect.render('Ansi', 'untitled', true)`,
          expect.render('Ansi', 'untitled', true)).passes(new RegExp([
              /^-{79}\n\u001b\[1mMy Great Test Suite\u001b\[0m\n={19}\n/,
              /\u001b\[31mX Failed\u001b\[0m 3 of 5\n-{79}\n\n/,
              /\u001b\[1mUntitled Section:\u001b\[0m\n-{17}\n/,
              /\u001b\[32m√ Passed\u001b\[0m A\n\n\n-{79}\n/,
              /\u001b\[1mMy Great Test Suite\u001b\[0m\n={19}\n/,
              /\u001b\[31mX Failed\u001b\[0m 3 of 5\n-{79}\n$/,
          ].map(r=>r.source).join('')));
    that(`expect.render('Ansi', 'second', true)`,
          expect.render('Ansi', 'second', true)).passes(new RegExp([
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
    that(`expect.render('Ansi', '', true)`,
          expect.render('Ansi', '', true)).passes(new RegExp([
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
    that(`expect.render('Html')`,
          expect.render('Html')).is(
              '<hr><h2>My Great Test Suite</h2>\n<u>X Failed</u> 3 of 5\n<hr>\n\n'
            + '<b>Second Section:</b>\n'
            + '<u>X Failed</u> B:\n  <s>expected:</s> 0\n  <s>actually:</s> 1\n'
            + '<u>X Failed</u> D:\n  <s>expected:</s> Expected Error\n  <s>actually:</s> Actual Error\n'
            + '<u>X Failed</u> E:\n  <s>actually is an error:</s>\n  Unexpectedly Error\n'
          );
    that(`expect.render('Html', 'untitled', true)`,
          expect.render('Html', 'untitled', true)).is(
              '<hr><h2>My Great Test Suite</h2>\n<u>X Failed</u> 3 of 5\n<hr>\n\n'
            + '<b>Untitled Section:</b>\n<i>√ Passed</i> A\n\n\n'
            + '<hr><h2>My Great Test Suite</h2>\n<u>X Failed</u> 3 of 5\n<hr>\n');
    that(`expect.render('Html', 'second', true)`,
          expect.render('Html', 'second', true)).is(
              '<hr><h2>My Great Test Suite</h2>\n<u>X Failed</u> 3 of 5\n<hr>\n\n'
            + '<b>Second Section:</b>\n<u>X Failed</u> B:\n'
            + '  <s>expected:</s> 0\n  <s>actually:</s> 1\n'
            + '<i>√ Passed</i> C\n'
            + '<u>X Failed</u> D:\n  <s>expected:</s> Expected Error\n  <s>actually:</s> Actual Error\n'
            + '<u>X Failed</u> E:\n  <s>actually is an error:</s>\n  Unexpectedly Error\n\n\n'
            + '<hr><h2>My Great Test Suite</h2>\n<u>X Failed</u> 3 of 5\n<hr>\n');
    that(`expect.render('Html', '', true)`,
          expect.render('Html', '', true)).is(
              '<hr><h2>My Great Test Suite</h2>\n<u>X Failed</u> 3 of 5\n<hr>\n\n'
            + '<b>Untitled Section:</b>\n<i>√ Passed</i> A\n\n'
            + '<b>Second Section:</b>\n<u>X Failed</u> B:\n'
            + '  <s>expected:</s> 0\n  <s>actually:</s> 1\n'
            + '<i>√ Passed</i> C\n'
            + '<u>X Failed</u> D:\n  <s>expected:</s> Expected Error\n  <s>actually:</s> Actual Error\n'
            + '<u>X Failed</u> E:\n  <s>actually is an error:</s>\n  Unexpectedly Error\n\n\n'
            + '<hr><h2>My Great Test Suite</h2>\n<u>X Failed</u> 3 of 5\n<hr>\n');
    that(`expect.render('Json')`,
          expect.render('Json')).is([
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
    that(`expect.render('Json', 'untitled', true)`,
          expect.render('Json', 'untitled', true)).is([
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
    that(`expect.render('Json', 'second', true)`,
          expect.render('Json', 'second', true)).is([
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
    that(`expect.render('Json', '', true)`,
          expect.render('Json', '', true)).is([
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
    that(`expect.render('Plain')`,
          expect.render('Plain')).passes(new RegExp([
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
    that(`expect.render('Plain', 'untitled', true)`,
          expect.render('Plain', 'untitled', true)).passes(new RegExp([
              /^-{79}\nMy Great Test Suite\n={19}\n/,
              /Failed 3 of 5\n-{79}\n\n/,
              /Untitled Section:\n-{17}\n/,
              /Passed A\n\n\n-{79}\n/,
              /My Great Test Suite\n={19}\n/,
              /Failed 3 of 5\n-{79}\n$/,
          ].map(r=>r.source).join('')));
    that(`expect.render('Plain', 'second', true)`,
          expect.render('Plain', 'second', true)).passes(new RegExp([
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
    that(`expect.render('Plain', '', true)`,
          expect.render('Plain', '', true)).passes(new RegExp([
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
    that(`expect.render('Raw')`,
          expect.render('Raw')).stringifiesTo(rawResultFourTests);
    that(`expect.render('Raw', 'untitled', true)`,
          expect.render('Raw', 'untitled', true)).stringifiesTo(rawResultFourTests);
    that(`expect.render('Raw', 'second', true)`,
          expect.render('Raw', 'second', true)).stringifiesTo(rawResultFourTests);
    that(`expect.render('Raw', '', true)`,
          expect.render('Raw', '', true)).stringifiesTo(rawResultFourTests);

}

// rufflib-expect/src/methods/expect.js


/* ---------------------------------- Tests --------------------------------- */

// Tests Expect.that().
// Apologies if this seems a bit mind-bendingly self-referential — look at the
// unit tests in other RuffLIBs, to make things clearer. @TODO provide link
function test$2(that, Expect) {

    that().section('that() Basics');
    const basics = new Expect();
    that(`typeof basics.that`,
          typeof basics.that).is('function');
    that(`typeof basics.that()`,
          typeof basics.that()).is('object');

    that().section('that().section()');
    const fooBarSection = new Expect();
    that(`typeof fooBarSection.that().section`,
          typeof fooBarSection.that().section).is('function');
    that(`fooBarSection.that().section('FooBar Section')`,
          fooBarSection.that().section('FooBar Section')).is(undefined);
    that(`fooBarSection.render(undefined, '', true)`,
          fooBarSection.render(undefined, '', true)).passes(/FooBar Section/);

    that().section('that().is()');
    const is = new Expect();
    that(`typeof is.that().is`,
          typeof is.that().is).is('function');
    that(`is.that('A', 1).is(1)`,
          is.that('A', 1).is(1)).is(true);
    that(`is`, is).has({ failTally: 0, passTally: 1, status: 'pass' });
    that(`is.that('B', true).is(1) // note that true == 1, but true !== 1`,
          is.that('B', true).is(1)).is(false);
    that(`is`, is).has({ failTally: 1, passTally: 1, status: 'fail' });
    const obj = { ok:123 };
    that(`is.that('C', obj).is(obj)`,
          is.that('C', obj).is(obj)).is(true);
    that(`is`, is).has({ failTally: 1, passTally: 2, status: 'fail' });
    that(`is.that('D', obj).is({ ok:123 })`,
          is.that('D', obj).is({ ok:123 })).is(false);
    that(`is`, is).has({ failTally: 2, passTally: 2, status: 'fail' });
    that(`is.render('Raw')`,
          is.render('Raw')).stringifiesTo([
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

    that().section('that().hasError()');
    const hasError = new Expect();
    that(`typeof hasError.that().hasError`,
          typeof hasError.that().hasError).is('function');
    that(`hasError.that('A', { error:'Expected Error' }).hasError('Expected Error')`,
          hasError.that('A', { error:'Expected Error' }).hasError('Expected Error')).is(true);
    that(`hasError.that('B', { error:'' }).hasError('')`,
          hasError.that('B', { error:'' }).hasError('')).is(true);
    that(`hasError.that('C', { error:123 }).hasError(123)`,
          hasError.that('C', { error:123 }).hasError(123)).is(true);
    that(`hasError.that('D', { error:'Expected Error' }).hasError({ error:'Nope!' })`,
          hasError.that('D', { error:'Expected Error' }).hasError({ error:'Nope!' })).is(false);
    that(`hasError.that('E', { error:'Expected Error' }).hasError(123)`,
          hasError.that('E', { error:'Expected Error' }).hasError(123)).is(false);
    that(`hasError.that('F', null).hasError('no error on a null') // null is (sorta) an object`,
          hasError.that('F', null).hasError('no error on a null')).is(false);
    that(`hasError.that('G').hasError()`,
          hasError.that('G').hasError()).is(false);
    that(`hasError`, hasError).has({ failTally: 4, passTally: 3, status: 'fail' });
    that(`hasError.render('Raw')`,
          hasError.render('Raw')).stringifiesTo([
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

    that().section('that().has()');
    const has = new Expect();
    that(`typeof has.that().has`,
          typeof has.that().has).is('function');
    that(`has.that('A', { a:1, b:null, c:[1,2,3] }).has({ a:1, b:null, c:[1,2,3] })`,
          has.that('A', { a:1, b:null, c:[1,2,3] }).has({ a:1, b:null, c:[1,2,3] })).is(true);
    that(`has.that('B', { a:1, b:null, c:[1,2,3] }).has({ c:[1,2,3] }) // ok this way...`,
          has.that('B', { a:1, b:null, c:[1,2,3] }).has({ c:[1,2,3] })).is(true);
    that(`has.that('C', { c:[1,2,3] }).has({ a:1, b:null, c:[1,2,3] }) // ...but not this way`,
          has.that('C', { c:[1,2,3] }).has({ a:1, b:null, c:[1,2,3] })).is(false);
    that(`has.that('D', { a:1, b:null, c:[1,2,3] }).has({}) // empty expected object`,
          has.that('D', { a:1, b:null, c:[1,2,3] }).has({})).is(true);
    that(`has.that('E', { a:1, b:null, c:[1,2,3] }).has(123) // expected is not an object`,
          has.that('E', { a:1, b:null, c:[1,2,3] }).has(123)).is(true);
    that(`has.that('F', 123).has({ a:1 }) // actually is not an object`,
          has.that('F', 123).has({ a:1 })).is(false);
    that(`has.that('G', { a:1, error:'Oh no!' }).has({ a:1 }) // matching a:1 is ignored`,
          has.that('G', { a:1, error:'Oh no!' }).has({ a:1 })).is(false);
    that(`has.that().section('Values differ')`,
          has.that().section('Values differ')).is();
    that(`has.that('H', { a:2, b:null, c:[1,2,3] }).has({ a:1 }) // a is different`,
          has.that('H', { a:2, b:null, c:[1,2,3] }).has({ a:1 })).is(false);
    that(`has.that('I', { a:1, b:undefined, c:[1,2,3] }).has({ a:1, b:null }) // undefined !== null`,
          has.that('I', { a:1, b:undefined, c:[1,2,3] }).has({ a:1, b:null })).is(false);
    that(`has.that('J', { a:1, b:null, c:[1,2,3] }).has({ c:[2,3,1] }) // c array-content is different`,
          has.that('J', { a:1, b:null, c:[1,2,3] }).has({ c:[2,3,1] })).is(false);
    that(`has`, has).has({ failTally: 6, passTally: 4, status: 'fail' });
    that(`has.render('Raw')`,
          has.render('Raw')).stringifiesTo([
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

    that().section('that().stringifiesTo()');
    const stringifiesTo = new Expect();
    that(`typeof stringifiesTo.that().stringifiesTo`,
          typeof stringifiesTo.that().stringifiesTo).is('function');
    that(`stringifiesTo.section('Values the same')`,
          stringifiesTo.section('Values the same')).is();
    that(`stringifiesTo.that('A', { a:1, b:2 }).stringifiesTo({ a:1, b:2 })`,
          stringifiesTo.that('A', { a:1, b:2 }).stringifiesTo({ a:1, b:2 })).is(true);
    that(`stringifiesTo.that('B', { a:1, b:2 }).stringifiesTo({ b:2, a:1 }) // order matters`,
          stringifiesTo.that('B', { a:1, b:2 }).stringifiesTo({ b:2, a:1 })).is(false);
    that(`stringifiesTo.that('C', 'some text').stringifiesTo('some text')`,
          stringifiesTo.that('C', 'some text').stringifiesTo('some text')).is(true);
    that(`stringifiesTo.that('D').stringifiesTo()`,
          stringifiesTo.that('D').stringifiesTo()).is(true);
    that(`stringifiesTo.that('E', ['str', [1,2,3], true, null]).stringifiesTo(['str', [1,2,3], true, null])`,
          stringifiesTo.that('E', ['str', [1,2,3], true, null]).stringifiesTo(['str', [1,2,3], true, null])).is(true);
    that(`stringifiesTo.section('Values differ')`,
          stringifiesTo.section('Values differ')).is();
    that(`stringifiesTo.that('F', ['str', [1,2,3], true, null]).stringifiesTo(['nope', [1,2,3], true, null])`,
          stringifiesTo.that('F', ['str', [1,2,3], true, null]).stringifiesTo(['nope', [1,2,3], true, null])).is(false);
    that(`stringifiesTo.that('G', ['str', [1,2,3], true, null]).stringifiesTo(['str', [2,3,1], true, null])`,
          stringifiesTo.that('G', ['str', [1,2,3], true, null]).stringifiesTo(['str', [2,3,1], true, null])).is(false);
    that(`stringifiesTo.that('H', ['str', [1,2,3], true, null]).stringifiesTo(['str', [1,2,3], false, null])`,
          stringifiesTo.that('H', ['str', [1,2,3], true, null]).stringifiesTo(['str', [1,2,3], false, null])).is(false);
    that(`stringifiesTo.that('I', ['str', [1,2,3], true, null]).stringifiesTo(['str', [1,2,3], false])`,
          stringifiesTo.that('I', ['str', [1,2,3], true, null]).stringifiesTo(['str', [1,2,3], false])).is(false);
    that(`stringifiesTo`, stringifiesTo).has({ failTally: 5, passTally: 4, status: 'fail' });
    that(`stringifiesTo.render('Raw')`,
          stringifiesTo.render('Raw')).stringifiesTo([
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
                kind: 'SectionTitle',
                sectionIndex: 1,
                sectionTitle: 'Values differ'
              },
              {
                actually: '["str",[1,2,3],true,null]',
                expected: '["nope",[1,2,3],true,null]',
                kind: 'Failed',
                sectionIndex: 1,
                testTitle: 'F'
              },
              {
                actually: '["str",[1,2,3],true,null]',
                expected: '["str",[2,3,1],true,null]',
                kind: 'Failed',
                sectionIndex: 1,
                testTitle: 'G'
              },
              {
                actually: '["str",[1,2,3],true,null]',
                expected: '["str",[1,2,3],false,null]',
                kind: 'Failed',
                sectionIndex: 1,
                testTitle: 'H'
              },
              {
                actually: '["str",[1,2,3],true,null]',
                expected: '["str",[1,2,3],false]',
                kind: 'Failed',
                sectionIndex: 1,
                testTitle: 'I'
              }
          ]);

    that().section('that().passes()');
    const passes = new Expect();
    that(`typeof passes.that().passes`,
          typeof passes.that().passes).is('function');
    that(`passes.that('A', 'abc').passes(/^abc$/)`,
          passes.that('A', 'abc').passes(/^abc$/)).is(true);
    that(`passes.that('B', 'abc').passes(/^xyz$/)`,
          passes.that('B', 'abc').passes(/^xyz$/)).is(false);
    that(`passes.that('C', 'abc').passes({ test:s=>s=='abc' })`,
          passes.that('C', 'abc').passes({ test:s=>s=='abc' })).is(true);
    that(`passes.that('D', 'abc').passes({ test:s=>s=='xyz' })`,
          passes.that('D', 'abc').passes({ test:s=>s=='xyz' })).is(false);
    that(`passes.that('E').passes(/^abc$/)`,
          passes.that('E').passes(/^abc$/)).is(false);
    that(`passes.that('F', 'abc').passes()`,
          passes.that('F', 'abc').passes()).is(false);
    that(`passes`, passes).has({ failTally: 4, passTally: 2, status: 'fail' });
    that(`passes.render('Raw')`,
          passes.render('Raw')).stringifiesTo([
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

// rufflib-expect/src/methods/section.js


/* ---------------------------------- Tests --------------------------------- */

// Tests Expect.section().
function test$1(et, Expect) {

    et().section('section()');
    const expect = new Expect();
    et(`typeof expect.section`,
        typeof expect.section).is('function');
    et(`typeof expect.section('FooBar Section')`,
        typeof expect.section('FooBar Section')).is('undefined');
    et(`expect.render(undefined, '', true)`,
        expect.render(undefined, '', true)).passes(/FooBar Section/);

}

// rufflib-expect/src/expect.js

// Assembles the `Expect` class.


/* --------------------------------- Import --------------------------------- */

const NAME = 'Expect';
const VERSION = '3.0.4';


/* ---------------------------------- Tests --------------------------------- */

// Runs basic Expect tests on itself.
function test(that, Expect) {
    that().section('Expect basics');
    that(`typeof Expect // in JavaScript, a class is type 'function'`,
          typeof Expect).is('function');
    that(`Expect.name // minification should not squash '${NAME}'`,
          Expect.name).is(NAME);
    that(`Expect.VERSION // make sure we are testing ${VERSION}`,
          Expect.VERSION).is(VERSION);
    that(`typeof new Expect()`,
          typeof new Expect()).is('object');
    that(`new Expect()`,
          new Expect()).has({
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
          factorialise(5)).is(120);

    const expect = new Expect('Mathsy Test Suite');
    that(`expect.that('factorialise(5)', factorialise(5)).is(120)`,
          expect.that('factorialise(5)', factorialise(5)).is(120)).is(true);
    that(`expect`, expect).has({ failTally: 0, passTally: 1, status: 'pass' });
    that(`expect.that('factorialise(3)', factorialise(3)).is(77)`,
          expect.that('factorialise(3)', factorialise(3)).is(77)).is(false);
    that(`expect`, expect).has({ failTally: 1, passTally: 1, status: 'fail' });
    that(`expect.render()`,
          expect.render()).passes(/Mathsy Test Suite\n={17}\nFailed 1 of 2\n/);
    that(`expect.render()`,
          expect.render()).passes(/Untitled Section:\n-{17}\n/);
    that(`expect.render()`,
          expect.render()).passes(/Failed factorialise\(3\):\s+expected: 77\s+actually: 6/);


    that().section('reset()');
    that(`typeof expect.reset`,
          typeof expect.reset).is('function');
    that(`expect.reset()`,
          expect.reset()).is(undefined);
    that(`expect`, expect).has({ failTally: 0, passTally: 0, status: 'pass' });
    that(`expect.render()`,
          expect.render()).passes(/^-{79}\nMathsy Test Suite\n={17}\nPassed 0 tests\n-{79}\n$/);

}

// rufflib-expect/src/main-test.js

// Run each test. You can comment-out some during development, to help focus on
// individual tests. But make sure all tests are uncommented before committing.
function expectTest(that, Expect) {

    test(that, Expect);
    test$4(that, Expect);
    test$3(that, Expect);
    test$1(that, Expect);
    test$2(that, Expect);

}

export { expectTest as default };
