// rufflib-expect/src/methods/expect.js


/* --------------------------------- Method --------------------------------- */

// Public method which returns several sub-methods.
export default function expect(
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

// Tests Expect.expect().
// Apologies if this seems a bit mind-bendingly self-referential — look at the
// unit tests in other RuffLIBs, to make things clearer. @TODO provide link
export function test(expect, Expect) {

    expect().section('expect() Basics');
    const basics = new Expect();
    expect(`typeof basics.expect`,
            typeof basics.expect).toBe('function');
    expect(`typeof basics.expect()`,
            typeof basics.expect()).toBe('object');

    expect().section('expect().section()');
    const fooBarSection = new Expect();
    expect(`typeof fooBarSection.expect().section`,
            typeof fooBarSection.expect().section).toBe('function');
    expect(`fooBarSection.expect().section('FooBar Section')`,
            fooBarSection.expect().section('FooBar Section')).toBe(undefined);
    expect(`fooBarSection.render(undefined, '', true)`,
            fooBarSection.render(undefined, '', true)).toMatch(/FooBar Section/);

    expect().section('expect().toBe()');
    const toBe = new Expect();
    expect(`typeof toBe.expect().toBe`,
            typeof toBe.expect().toBe).toBe('function');
    expect(`toBe.expect('A', 1).toBe(1)`,
            toBe.expect('A', 1).toBe(1)).toBe(true);
    expect(`toBe`, toBe).toHave({ failTally: 0, passTally: 1, status: 'pass' });
    expect(`toBe.expect('B', true).toBe(1) // note that true == 1, but true !== 1`,
            toBe.expect('B', true).toBe(1)).toBe(false);
    expect(`toBe`, toBe).toHave({ failTally: 1, passTally: 1, status: 'fail' });
    const obj = { ok:123 };
    expect(`toBe.expect('C', obj).toBe(obj)`,
            toBe.expect('C', obj).toBe(obj)).toBe(true);
    expect(`toBe`, toBe).toHave({ failTally: 1, passTally: 2, status: 'fail' });
    expect(`toBe.expect('D', obj).toBe({ ok:123 })`,
            toBe.expect('D', obj).toBe({ ok:123 })).toBe(false);
    expect(`toBe`, toBe).toHave({ failTally: 2, passTally: 2, status: 'fail' });
    expect(`toBe.render('Raw')`,
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

    expect().section('expect().toError()');
    const toError = new Expect();
    expect(`typeof toError.expect().toError`,
            typeof toError.expect().toError).toBe('function');
    expect(`toError.expect('A', { error:'Expected Error' }).toError('Expected Error')`,
            toError.expect('A', { error:'Expected Error' }).toError('Expected Error')).toBe(true);
    expect(`toError.expect('B', { error:'' }).toError('')`,
            toError.expect('B', { error:'' }).toError('')).toBe(true);
    expect(`toError.expect('C', { error:123 }).toError(123)`,
            toError.expect('C', { error:123 }).toError(123)).toBe(true);
    expect(`toError.expect('D', { error:'Expected Error' }).toError({ error:'Nope!' })`,
            toError.expect('D', { error:'Expected Error' }).toError({ error:'Nope!' })).toBe(false);
    expect(`toError.expect('E', { error:'Expected Error' }).toError(123)`,
            toError.expect('E', { error:'Expected Error' }).toError(123)).toBe(false);
    expect(`toError.expect('F', null).toError('no error on a null') // null is (sorta) an object`,
            toError.expect('F', null).toError('no error on a null')).toBe(false);
    expect(`toError.expect('G').toError()`,
            toError.expect('G').toError()).toBe(false);
    expect(`toError`, toError).toHave({ failTally: 4, passTally: 3, status: 'fail' });
    expect(`toError.render('Raw')`,
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

    expect().section('expect().toHave()');
    const toHave = new Expect();
    expect(`typeof toHave.expect().toHave`,
            typeof toHave.expect().toHave).toBe('function');
    expect(`toHave.expect('A', { a:1, b:null, c:[1,2,3] }).toHave({ a:1, b:null, c:[1,2,3] })`,
            toHave.expect('A', { a:1, b:null, c:[1,2,3] }).toHave({ a:1, b:null, c:[1,2,3] })).toBe(true);
    expect(`toHave.expect('B', { a:1, b:null, c:[1,2,3] }).toHave({ c:[1,2,3] }) // ok this way...`,
            toHave.expect('B', { a:1, b:null, c:[1,2,3] }).toHave({ c:[1,2,3] })).toBe(true);
    expect(`toHave.expect('C', { c:[1,2,3] }).toHave({ a:1, b:null, c:[1,2,3] }) // ...but not this way`,
            toHave.expect('C', { c:[1,2,3] }).toHave({ a:1, b:null, c:[1,2,3] })).toBe(false);
    expect(`toHave.expect('D', { a:1, b:null, c:[1,2,3] }).toHave({}) // empty expected object`,
            toHave.expect('D', { a:1, b:null, c:[1,2,3] }).toHave({})).toBe(true);
    expect(`toHave.expect('E', { a:1, b:null, c:[1,2,3] }).toHave(123) // expected is not an object`,
            toHave.expect('E', { a:1, b:null, c:[1,2,3] }).toHave(123)).toBe(true);
    expect(`toHave.expect('F', 123).toHave({ a:1 }) // actually is not an object`,
            toHave.expect('F', 123).toHave({ a:1 })).toBe(false);
    expect(`toHave.expect('G', { a:1, error:'Oh no!' }).toHave({ a:1 }) // matching a:1 is ignored`,
            toHave.expect('G', { a:1, error:'Oh no!' }).toHave({ a:1 })).toBe(false);
    expect(`toHave.expect().section('Values differ')`,
            toHave.expect().section('Values differ')).toBe();
    expect(`toHave.expect('H', { a:2, b:null, c:[1,2,3] }).toHave({ a:1 }) // a is different`,
            toHave.expect('H', { a:2, b:null, c:[1,2,3] }).toHave({ a:1 })).toBe(false);
    expect(`toHave.expect('I', { a:1, b:undefined, c:[1,2,3] }).toHave({ a:1, b:null }) // undefined !== null`,
            toHave.expect('I', { a:1, b:undefined, c:[1,2,3] }).toHave({ a:1, b:null })).toBe(false);
    expect(`toHave.expect('J', { a:1, b:null, c:[1,2,3] }).toHave({ c:[2,3,1] }) // c array-content is different`,
            toHave.expect('J', { a:1, b:null, c:[1,2,3] }).toHave({ c:[2,3,1] })).toBe(false);
    expect(`toHave`, toHave).toHave({ failTally: 6, passTally: 4, status: 'fail' });
    expect(`toHave.render('Raw')`,
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

    expect().section('expect().toJson()');
    const toJson = new Expect();
    expect(`typeof toJson.expect().toJson`,
            typeof toJson.expect().toJson).toBe('function');
    expect(`toHave.expect().section('Values the same')`,
            toHave.expect().section('Values the same')).toBe();
    expect(`toJson.expect('A', { a:1, b:2 }).toJson({ a:1, b:2 })`,
            toJson.expect('A', { a:1, b:2 }).toJson({ a:1, b:2 })).toBe(true);
    expect(`toJson.expect('B', { a:1, b:2 }).toJson({ b:2, a:1 }) // order matters`,
            toJson.expect('B', { a:1, b:2 }).toJson({ b:2, a:1 })).toBe(false);
    expect(`toJson.expect('C', 'some text').toJson('some text')`,
            toJson.expect('C', 'some text').toJson('some text')).toBe(true);
    expect(`toJson.expect('D').toJson()`,
            toJson.expect('D').toJson()).toBe(true);
    expect(`toJson.expect('E', ['str', [1,2,3], true, null]).toJson(['str', [1,2,3], true, null])`,
            toJson.expect('E', ['str', [1,2,3], true, null]).toJson(['str', [1,2,3], true, null])).toBe(true);
    expect(`toHave.expect().section('Values differ')`,
            toHave.expect().section('Values differ')).toBe();
    expect(`toJson.expect('F', ['str', [1,2,3], true, null]).toJson(['nope', [1,2,3], true, null])`,
            toJson.expect('F', ['str', [1,2,3], true, null]).toJson(['nope', [1,2,3], true, null])).toBe(false);
    expect(`toJson.expect('G', ['str', [1,2,3], true, null]).toJson(['str', [2,3,1], true, null])`,
            toJson.expect('G', ['str', [1,2,3], true, null]).toJson(['str', [2,3,1], true, null])).toBe(false);
    expect(`toJson.expect('H', ['str', [1,2,3], true, null]).toJson(['str', [1,2,3], false, null])`,
            toJson.expect('H', ['str', [1,2,3], true, null]).toJson(['str', [1,2,3], false, null])).toBe(false);
    expect(`toJson.expect('I', ['str', [1,2,3], true, null]).toJson(['str', [1,2,3], false])`,
            toJson.expect('I', ['str', [1,2,3], true, null]).toJson(['str', [1,2,3], false])).toBe(false);
    expect(`toJson`, toJson).toHave({ failTally: 5, passTally: 4, status: 'fail' });
    expect(`toJson.render('Raw')`,
            toJson.render('Raw')).toJson([
                {
                  kind: 'SectionTitle',
                  sectionIndex: 0,
                  sectionTitle: 'Untitled Section'
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

    expect().section('expect().toMatch()');
    const toMatch = new Expect();
    expect(`typeof toMatch.expect().toMatch`,
            typeof toMatch.expect().toMatch).toBe('function');
    expect(`toMatch.expect('A', 'abc').toMatch(/^abc$/)`,
            toMatch.expect('A', 'abc').toMatch(/^abc$/)).toBe(true);
    expect(`toMatch.expect('B', 'abc').toMatch(/^xyz$/)`,
            toMatch.expect('B', 'abc').toMatch(/^xyz$/)).toBe(false);
    expect(`toMatch.expect('C', 'abc').toMatch({ test:s=>s=='abc' })`,
            toMatch.expect('C', 'abc').toMatch({ test:s=>s=='abc' })).toBe(true);
    expect(`toMatch.expect('D', 'abc').toMatch({ test:s=>s=='xyz' })`,
            toMatch.expect('D', 'abc').toMatch({ test:s=>s=='xyz' })).toBe(false);
    expect(`toMatch.expect('E').toMatch(/^abc$/)`,
            toMatch.expect('E').toMatch(/^abc$/)).toBe(false);
    expect(`toMatch.expect('F', 'abc').toMatch()`,
            toMatch.expect('F', 'abc').toMatch()).toBe(false);
    expect(`toMatch`, toMatch).toHave({ failTally: 4, passTally: 2, status: 'fail' });
    expect(`toMatch.render('Raw')`,
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
