// rufflib-expect/src/methods/section.js


/* --------------------------------- Method --------------------------------- */

// Public method which starts a new section in the current test suite.
export default function section(
    sectionTitle = 'Untitled Section'
) {
    this.log.push({
        kind: 'SectionTitle',
        sectionIndex: this.sections.push({ failTally: 0, sectionTitle }) - 1,
        sectionTitle,
    });
}


/* ---------------------------------- Tests --------------------------------- */

// Tests Expect.section().
export function test(et, Expect) {

    et().section('section()');
    const expect = new Expect();
    et(`typeof expect.section`,
        typeof expect.section).is('function');
    et(`typeof expect.section('FooBar Section')`,
        typeof expect.section('FooBar Section')).is('undefined');
    et(`expect.render(undefined, '', true)`,
        expect.render(undefined, '', true)).passes(/FooBar Section/);

}
