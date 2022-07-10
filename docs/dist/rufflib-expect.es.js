// rufflib-expect/src/methods/generate-css.js


const selectorRx = /^[.#]?[a-z][-_0-9a-z]*$/i;

/* --------------------------------- Method --------------------------------- */

// Public method which generates CSS for styling render('Html')’s output.
//
// Typical usage:
//     const $css = document.createElement('style');
//     $css.innerHTML = Expect.generateCss('pre', '#my-test-results-container');
//     document.head.appendChild($css);
//
function generateCss(
    containerSelector, // a CSS selector, eg '#wrap', '.test-results' or 'body'
    innerSelector, // a CSS selector like '#inner', '.box' or 'pre'
) {
    // Abbreviate the argument names - this just helps shorten the source code.
    const cs = containerSelector;
    const is = innerSelector;

    // Validate the selectors.
    if (! cs) throw Error(
        `Expect.generateCss(): the mandatory containerSelector argument is falsey`);
    if (typeof cs !== 'string') throw Error(
        `Expect.generateCss(): containerSelector is type '${typeof cs}' not 'string'`);
    if (! selectorRx.test(cs)) throw Error(
        `Expect.generateCss(): containerSelector fails ${selectorRx}`);
    if (! is) throw Error(
        `Expect.generateCss(): the mandatory innerSelector argument is falsey`);
    if (typeof is !== 'string') throw Error(
        `Expect.generateCss(): innerSelector is type '${typeof is}' not 'string'`);
    if (! selectorRx.test(is)) throw Error(
        `Expect.generateCss(): innerSelector fails ${selectorRx}`);

    // Initialise the output array.
    // Note that our validated selectors cannot include the substring '*/', here.
    const css = [`/* Expect.generateCss('${cs}', '${is}') */`];

    // The outer element is assumed to be styled already. generateCss() just
    // updates the colours when the tests complete.
    css.push(
        `${cs}.fail{background:#642c2c;color:#fce}`,
        `${cs}.pass{background:#2c642c;color:#cfe}`,
    );

    // generateCss() takes more control over styling the inner element...
    css.push(
        `${is}{padding:4px 8px;border-radius:4px;line-height:1.8}`,
        `${is}{font-family:Menlo,Consolas,Monaco,Lucida Console,Liberation Mono,`,
        `DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New,monospace,sans-serif}`,
        `${is}{text-align:left;white-space:pre}`,
        `${is}{background:#222;color:#eee}`, // before the tests complete
        `${cs}.fail ${is}{background:#411;color:#fce}`,
        `${cs}.pass ${is}{background:#141;color:#cfe}`,
    );

    // ...and the test result content.
    css.push(
        `${is} b{color:#eee}`,
        `${is} i{font-style:normal}`,
        `${cs}.pass i{color:#7fff7f}`,
        `${is} u{padding:2px 8px;color:#fff;background:#900;text-decoration:none}`,
        `${is} s{color:#9c8293;text-decoration:none}`,
    );

    return css.join('\n');
}

// rufflib-expect/src/methods/expect.js


/* --------------------------------- Method --------------------------------- */

// Public method which returns several sub-methods.
function expect(
    testTitle, // the title of this test (omitted if `section()` is called)
    actually,  // the value to test (omitted if `section()` is called)
) {
    const log = this.log;
    const sections = this.sections;
    const addSection = () => {
        return sections.push({ failTally: 0 }) - 1; // return its index
    };
    const fail = () => {
        sections[sections.length-1].failTally++;
        this.failTally++;
        this.status = 'fail';
    };
    const pass = () => {
        this.passTally++;
    };
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

// rufflib-expect/src/methods/render.js


/* -------------------------------- Constants ------------------------------- */

// Colours and styles for for ANSI text, eg for a Terminal.
const ANSI_BOLD = '\u001b[1m';
const ANSI_DLOB = '\u001b[0m';
const ANSI_DIM  = '\u001b[2m';
const ANSI_MID  = '\u001b[0m';
const ANSI_PASS = '\u001b[32m√ ';
const ANSI_SSAP = '\u001b[0m';
const ANSI_FAIL = '\u001b[31mX ';
const ANSI_LIAF = '\u001b[0m';

// HTML elements (tags), eg for a web browser.
const HTML_BOLD = '<b>';
const HTML_DLOB = '</b>';
const HTML_DIM  = '<s>';
const HTML_MID  = '</s>';
const HTML_PASS = '<i>√ ';
const HTML_SSAP = '</i>';
const HTML_FAIL = '<u>X ';
const HTML_LIAF = '</u>';


/* --------------------------------- Method --------------------------------- */

// Public method which transforms test results to a string, in various formats.
function render(
    format='Plain', // how output should be formatted, `Ansi|Html|Json|Plain|Raw`
    verbose=false, // whether to show all passing test results
) {
    const { log, failTally, passTally, sections, suiteTitle } = this;
    switch (format) {
        case 'Ansi':
            return _renderAnsi(log, failTally, passTally, sections, suiteTitle, verbose);
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

// Renders test results for ANSI text output, eg to a Terminal.
function _renderAnsi(log, failTally, passTally, sections, suiteTitle, verbose) {
    const summary = _renderSummaryAnsi(failTally, passTally, suiteTitle);
    return summary
        + log.map(item => {
            switch (item.kind) {
                case 'Failed':
                    return `${ANSI_FAIL}Failed${ANSI_LIAF} ${item.testTitle}:\n`
                         + `  ${ANSI_DIM}expected:${ANSI_MID} ${item.expected}\n`
                         + `  ${ANSI_DIM}actually:${ANSI_MID} ${item.actually}\n`;
                case 'Passed':
                    return verbose
                        ? `${ANSI_PASS}Passed${ANSI_SSAP} ${item.testTitle}\n`
                        : '';
                case 'SectionTitle':
                    return verbose || sections[item.sectionIndex].failTally
                        ? `\n${ANSI_BOLD}${item.sectionTitle}:${ANSI_DLOB}\n`
                            + '-'.repeat(item.sectionTitle.length+1) + '\n'
                        : '';
                default: throw Error(`Expect.render(): unexpected item.kind`);
            }
        })
        .join('')
        + (verbose ? '\n\n' + summary : '')
    ;
}

// Renders the test results summary for ANSI text output, eg to a Terminal.
function _renderSummaryAnsi(failTally, passTally, suiteTitle) {
    return '-'.repeat(79)
        + '\n'
        + `${ANSI_BOLD}${suiteTitle}${ANSI_DLOB}\n`
        + '='.repeat(suiteTitle.length)
        + '\n'
        + (failTally
            ? `${ANSI_FAIL}Failed${ANSI_LIAF} ${failTally} of ${failTally + passTally}`
            : `${ANSI_PASS}Passed${ANSI_SSAP} ${passTally} test${passTally === 1 ? '' : 's'}`
        )
        + '\n'
        + '-'.repeat(79)
        + '\n'
    ;
}

// Renders test results for HTML output, eg to a web browser.
function _renderHtml(log) {
    return log
        .map(item => {
            switch (item.kind) {
                case 'Failed':
                    return `${HTML_FAIL}Failed${HTML_LIAF} ${item.testTitle}:\n`
                         + `  ${HTML_DIM}expected:${HTML_MID} ${item.expected}\n`
                         + `  ${HTML_DIM}actually:${HTML_MID} ${item.actually}`;
                case 'Passed':
                    return `${HTML_PASS}Passed${HTML_SSAP} ${item.testTitle}`;
                case 'SectionTitle':
                    return `${HTML_BOLD}${item.sectionTitle}:${HTML_DLOB}`;
                default: throw Error(`Expect.render(): unexpected item.kind`);
            }
        })
        .join('\n')
    ;
}

// Renders test results for plain text output, eg to a '.txt' file.
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
        this.sections = [];
        this.suiteTitle = suiteTitle;

        // No tests have run yet, so no failures and no passes.
        // So technically, the test suite status is currently ‘pass’.
        this.failTally = 0;
        this.passTally = 0;
        this.status = 'pass';
    }
}

Expect.generateCss = generateCss;
Expect.prototype.render = render;

// rufflib-expect/src/entry-point-main.js

export { Expect as default };
