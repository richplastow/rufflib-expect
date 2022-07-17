// rufflib-expect/src/methods/expect.js


/* --------------------------------- Method --------------------------------- */

// Public method which returns several sub-methods.
export default function that(
    testTitle, // the title of this test (omitted if `section()` is called)
    actually,  // the value to test (omitted if `section()` is called)
) {
    const log = this.log;
    const sections = this.sections;
    const addSection = (sectionTitle) => {
        return sections.push({ failTally: 0, sectionTitle }) - 1; // return its index
    }
    const fail = () => {
        sections[sections.length-1].failTally++;
        this.failTally++;
        this.status = 'fail';
        return sections.length - 1;
    }
    const pass = () => {
        this.passTally++;
        return sections.length - 1;
    }
    return {

        // Logs a section-title.
        // Values passed in to `testTitle` and `actually` are ignored.
        section(sectionTitle='Untitled Section') {
            log.push({
                kind: 'SectionTitle',
                sectionIndex: addSection(sectionTitle),
                sectionTitle,
            });
        },

        // Tests that `actually` and `expected` are strictly equal.
        is(expected) {
            if (! sections.length) this.section(); // there must be a section
            if (actually === expected) {
                log.push({
                    kind: 'Passed',
                    sectionIndex: pass(),
                    testTitle,
                });
                return true;
            }
            log.push({
                actually,
                expected,
                kind: 'Failed',
                sectionIndex: fail(),
                testTitle,
            });
            return false;
        },

        // Tests that `actually` is an object with an expected `error` property.
        // @TODO allow `expected` to be a regexp, or other object with a `test()` method
        hasError(expected) {
            if (! sections.length) this.section(); // there must be a section
            if (actually && actually?.error === expected) {
                log.push({
                    kind: 'Passed',
                    sectionIndex: pass(),
                    testTitle,
                });
                return true;
            }
            log.push({
                actually: actually ? actually?.error : actually,
                expected,
                kind: 'Failed',
                sectionIndex: fail(),
                testTitle,
            });
            return false;
        },

        // Tests that `actually` contains all of the keys and values in `expected`.
        has(expected) {
            if (! sections.length) this.section(); // there must be a section
            if (actually.error) {
                log.push({
                    actually: actually.error,
                    expected: JSON.stringify(expected),
                    kind: 'Error',
                    sectionIndex: fail(),
                    testTitle,
                });
                return false;
            }
            for (let key in expected) {
                const aJson = JSON.stringify(actually[key]);
                const eJson = JSON.stringify(expected[key]);
                if (aJson !== eJson) {
                    log.push({
                        actually: aJson,
                        expected: eJson,
                        kind: 'Failed',
                        sectionIndex: fail(),
                        testTitle: `${testTitle}.${key}`,
                    });
                    return false;
                }
            }
            log.push({
                kind: 'Passed',
                sectionIndex: pass(),
                testTitle,
            });
            return true;
        },

        // Tests that `actually` and `expected` are identical when stringified to JSON.
        stringifiesTo(expected) {
            if (! sections.length) this.section(); // there must be a section
            const aJson = JSON.stringify(actually);
            const eJson = JSON.stringify(expected);
            if (aJson === eJson) {
                log.push({
                    kind: 'Passed',
                    sectionIndex: pass(),
                    testTitle,
                });
                return true;
            }
            log.push({
                actually: aJson,
                expected: eJson,
                kind: 'Failed',
                sectionIndex: fail(),
                testTitle,
            });
            return false;
        },

        // Tests that `actually` passes the test defined by `expected`.
        // Typically used for regular expression tests.
        passes(expected) {
            if (! sections.length) this.section(); // there must be a section
            if (expected && expected?.test(actually)) {
                log.push({
                    kind: 'Passed',
                    sectionIndex: pass(),
                    testTitle,
                });
                return true;
            }
            log.push({
                actually,
                expected,
                kind: 'Failed',
                sectionIndex: fail(),
                testTitle,
            });
            return false;
        },
    }
}


/* ---------------------------------- Tests --------------------------------- */

// Tests Expect.that().
// Apologies if this seems a bit mind-bendingly self-referential — look at the
// unit tests in other RuffLIBs, to make things clearer. @TODO provide link
export function test(that, Expect) {

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
