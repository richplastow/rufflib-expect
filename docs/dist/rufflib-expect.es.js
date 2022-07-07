// rufflib-expect/src/methods/render.js


/* -------------------------------- Constants ------------------------------- */

const ANSI_BOLD = '\u001b[1m';
const ANSI_DLOB = '\u001b[0m';
const ANSI_DIM  = '\u001b[2m';
const ANSI_MID  = '\u001b[0m';
const ANSI_PASS = '\u001b[32m√ ';
const ANSI_SSAP = '\u001b[0m';
const ANSI_FAIL = '\u001b[31mX ';
const ANSI_LIAF = '\u001b[0m';


/* --------------------------------- Method --------------------------------- */

// Public method which transforms the log to a string, in various formats.
function render(
    format='Plain', // how the log should be returned, `Ansi|Html|Json|Plain|Raw`
) {
    switch (format) {
        case 'Ansi':
            return _renderAnsi(this.log);
        case 'Html':
            return _renderHtml(this.log);
        case 'Json':
            return _renderJson(this.log);
        case 'Plain':
            return _renderPlain(this.log);
        case 'Raw':
            return _renderRaw(this.log);
        default: throw Error(
            `Expect.render(): unexpected format, try 'Ansi|Html|Json|Plain|Raw'`);
    }
}


/* ----------------------------- Private Helpers ---------------------------- */

// Renders the log for ANSI text output, eg to a Terminal.
function _renderAnsi(log) {
    return log
        .map(item => {
            switch (item.kind) {
                case 'Failed':
                    return `${ANSI_FAIL}Failed${ANSI_LIAF} ${item.testTitle}:\n`
                         + `  ${ANSI_DIM}expected:${ANSI_MID} ${item.expected}\n`
                         + `  ${ANSI_DIM}actually:${ANSI_MID} ${item.actually}`;
                case 'Passed':
                    return `${ANSI_PASS}Passed${ANSI_SSAP} ${item.testTitle}`;
                case 'SectionTitle':
                    return `${ANSI_BOLD}${item.sectionTitle}:${ANSI_DLOB}`;
                default: throw Error(`Expect.render(): unexpected item.kind`);
            }
        })
        .join('\n')
    ;
}

// Renders the log for plain text output, eg to a '.txt' file.
function _renderPlain(log) {
    return log
        .map(item => {
            switch (item.kind) {
                case 'Failed':
                    return `Failed ${item.testTitle}:\n`
                         + `  expected: ${item.expected}\n`
                         + `  actually: ${item.actually}`;
                case 'Passed':
                    return `Passed ${item.testTitle}`;
                case 'SectionTitle':
                    return item.sectionTitle;
                default: throw Error(`Expect.render(): unexpected item.kind`);
            }
        })
        .join('\n')
    ;
}

// rufflib-expect/src/methods/expect.js


/* --------------------------------- Method --------------------------------- */

// Public method which returns several sub-methods.
function expect(
    testTitle, // the title of this test (omitted if `section()` is called)
    actually,  // the value to test (omitted if `section()` is called)
) {
    const log = this.log;
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
            if (actually === expected)
                log.push({
                    kind: 'Passed',
                    testTitle,
                });
            else
                log.push({
                    expected,
                    actually,
                    kind: 'Failed',
                    testTitle,
                    // text: [
                    //     testTitle,
                    //     `  expected: ${expected}`,
                    //     `  actually: ${actually}`
                    // ],
                });
        },
    }
}

// rufflib-expect/src/expect.js


/* ---------------------------------- Class --------------------------------- */

// A RuffLIB library for unit testing rough and sketchy JavaScript apps.
//
// Typical usage:
//     const testSuite = new Expect('Mathsy Test Suite');
//     const expect = testSuite.expect;
//     expect.section('Check that factorialise() works as expected');
//
//     expect(`factorialise(5) // 5! = 5 * 4 * 3 * 2 * 1`,
//             factorialise(5)).toBe(120);
//     testSuite.render();
//
//     function factorialise(n) {
//         if (n === 0 || n === 1) return 1;
//         for (let i=n-1; i>0; i--) n *= i;
//         return n;
//     }
//     
class Expect {
    constructor(suiteTitle='Untitled Test Suite') {
        this.expect = expect.bind(this);
        this.log = [];
        this.suiteTitle = suiteTitle;
    }
}

Expect.prototype.render = render;

// rufflib-expect/src/entry-point-main.js

export { Expect as default };
