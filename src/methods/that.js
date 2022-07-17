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
        toBe(expected) {
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
        toError(expected) {
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
        toHave(expected) {
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
        toJson(expected) {
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
        toMatch(expected) {
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
