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
            } else {
                log.push({
                    expected,
                    actually,
                    kind: 'Failed',
                    sectionIndex: fail(),
                    testTitle,
                });
            }
        },

        // Tests that `actually` contains all of the keys and values in `expected`.
        toHave(expected) {
            if (! sections.length) this.section(); // there must be a section
            if (actually.error) {
                return log.push({
                    expected,
                    actually,
                    kind: 'Error',
                    sectionIndex: fail(),
                    testTitle,
                });
            }
            for (let key in expected) {
                const aJson = JSON.stringify(actually[key]);
                const eJson = JSON.stringify(expected[key]);
                if (aJson !== eJson) {
                    return log.push({
                        expected: eJson,
                        actually: aJson,
                        kind: 'Failed',
                        sectionIndex: fail(),
                        testTitle: `${testTitle}.${key}`,
                    });
                }
            }
            log.push({
                kind: 'Passed',
                sectionIndex: pass(),
                testTitle,
            });
        },

        // Tests that `actually` is an object with an expected `error` property.
        toError(expected) {
            if (! sections.length) this.section(); // there must be a section
            if (actually?.error === expected) {
                log.push({
                    kind: 'Passed',
                    sectionIndex: pass(),
                    testTitle,
                });
            } else {
                log.push({
                    expected,
                    actually,
                    kind: 'Failed',
                    sectionIndex: fail(),
                    testTitle,
                });
            }
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
            } else {
                log.push({
                    expected,
                    actually,
                    kind: 'Failed',
                    sectionIndex: fail(),
                    testTitle,
                });
            }
        },

        // Tests that `actually` passes the test defined by `expected`.
        // Typically used for regular expression tests.
        toMatch(expected) {
            if (! sections.length) this.section(); // there must be a section
            if (expected.test(actually)) {
                log.push({
                    kind: 'Passed',
                    sectionIndex: pass(),
                    testTitle,
                });
            } else {
                log.push({
                    expected,
                    actually,
                    kind: 'Failed',
                    sectionIndex: fail(),
                    testTitle,
                });
            }
        },
    }
}


/* ---------------------------------- Tests --------------------------------- */

// Tests Expect.expect().
// Apologies if this seems a bit mind-bendingly self-referential — look at
// a RuffLIB Validate method test, to understand what’s going on here. @TODO provide link
export function test(expect, Expect) {
    const testSuite = new Expect('Mathsy Test Suite');

    expect().section('expect() Basics');
    expect(`typeof testSuite.expect`,
            typeof testSuite.expect).toBe('function');
    expect(`typeof testSuite.expect()`,
            typeof testSuite.expect()).toBe('object');

    expect().section('expect().section()');
    expect(`typeof testSuite.expect().section`,
            typeof testSuite.expect().section).toBe('function');
    expect(`testSuite.expect().section('FooBar Section')`,
            testSuite.expect().section('FooBar Section')).toBe(undefined);
    expect(`testSuite.render(undefined, '', true)`,
            testSuite.render(undefined, '', true)).toMatch(/FooBar Section/);

    expect().section('expect().toBe()');
    expect(`typeof testSuite.expect().toBe`,
            typeof testSuite.expect().toBe).toBe('function');
    expect(`testSuite.expect('A', 1).toBe(1)`,
            testSuite.expect('A', 1).toBe(1)).toBe(undefined);
    expect(`testSuite`, testSuite).toHave({ failTally: 0, passTally: 1, status: 'pass' });
    expect(`testSuite.expect('B', true).toBe(1)`,
            testSuite.expect('B', true).toBe(1)).toBe(undefined);
    expect(`testSuite`, testSuite).toHave({ failTally: 1, passTally: 1, status: 'fail' });
    const obj = { ok:123 };
    expect(`testSuite.expect('C', obj).toBe(obj)`,
            testSuite.expect('C', obj).toBe(obj)).toBe(undefined);
    expect(`testSuite`, testSuite).toHave({ failTally: 1, passTally: 2, status: 'fail' });
    expect(`testSuite.expect('D', obj).toBe({ ok:123 })`,
            testSuite.expect('D', obj).toBe({ ok:123 })).toBe(undefined);
    expect(`testSuite`, testSuite).toHave({ failTally: 2, passTally: 2, status: 'fail' });

    // @TODO remaining methods

}
