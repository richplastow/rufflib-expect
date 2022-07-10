// rufflib-expect/src/methods/expect.js


/* --------------------------------- Method --------------------------------- */

// Public method which returns several sub-methods.
export default function expect(
    testTitle, // the title of this test (omitted if `section()` is called)
    actually,  // the value to test (omitted if `section()` is called)
) {
    const log = this.log;
    const sections = this.sections;
    const addSection = () => {
        return sections.push({ failTally: 0 }) - 1; // return its index
    }
    const fail = () => {
        sections[sections.length-1].failTally++;
        this.failTally++;
        this.status = 'fail';
    }
    const pass = () => {
        this.passTally++;
    }
    return {

        // Logs a section-title.
        // Values passed in to `testTitle` and `actually` are ignored.
        section(sectionTitle='Untitled Section') {
            log.push({
                kind: 'SectionTitle',
                sectionIndex: addSection(),
                sectionTitle,
            });
        },

        // Tests that `actually` and `expected` are strictly equal.
        toBe(expected) {
            if (! sections.length) this.section(); // there must be a section
            if (actually === expected) {
                pass();
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
