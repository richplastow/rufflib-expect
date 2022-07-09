// rufflib-expect/src/methods/expect.js


/* --------------------------------- Method --------------------------------- */

// Public method which returns several sub-methods.
export default function expect(
    testTitle, // the title of this test (omitted if `section()` is called)
    actually,  // the value to test (omitted if `section()` is called)
) {
    const log = this.log;
    const fail = () => this.status = 'fail';
    return {

        // Logs a section-title.
        // Values passed in to `testTitle` and `actually` are ignored.
        section(sectionTitle='Untitled Section') {
            log.push({
                kind: 'SectionTitle',
                sectionTitle,
            });
        },

        // Tests that `actually` and `expected` are strictly equal.
        toBe(expected) {
            if (actually === expected) {
                log.push({
                    kind: 'Passed',
                    testTitle,
                });
            } else {
                fail();
                log.push({
                    expected,
                    actually,
                    kind: 'Failed',
                    testTitle,
                });
            }
        },
    }
}


/* ---------------------------------- Tests --------------------------------- */

// Tests Expect.expect().
// Apologies if this seems a bit mind-bendingly self-referential — look at
// a RuffLIB Validate method test, to understand what’s going on here.
export function test(expect, Expect) {
    expect().section('expect()');
}
