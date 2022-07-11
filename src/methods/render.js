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
const HTML_HEADING = '<h2>';
const HTML_GNIDAEH = '</h2>';
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
export default function render(
    format='Plain', // how output should be formatted, `Ansi|Html|Json|Plain|Raw`
    sectionMustContain='', // only show sections which contain this string
    verbose=false, // if true, show passing sections and tests
) {
    const { log, failTally, passTally, sections, suiteTitle } = this;
    const renderer = ({
        Ansi: _renderAnsi,
        Html: _renderHtml,
        Json: _renderJson,
        Plain: _renderPlain,
        Raw: _renderRaw,
    })[format];
    if (! renderer) throw Error(
        `Expect.render(): unexpected format, try 'Ansi|Html|Json|Plain|Raw'`);
    return renderer(log, failTally, passTally, sections, suiteTitle,
        sectionMustContain.toLowerCase(), verbose);
}


/* ----------------------------- Private Helpers ---------------------------- */

// Renders test results for ANSI text output, eg to a Terminal.
function _renderAnsi(log, failTally, passTally, sections, suiteTitle, smcLc, verbose) {
    const summary = _renderSummaryAnsi(failTally, passTally, suiteTitle);
    return summary
        + log.map(item => {
            const sectionTitle = item.sectionTitle
                ? item.sectionTitle
                : sections[item.sectionIndex].sectionTitle
            ;
            if (sectionTitle.toLowerCase().includes(smcLc)) {
                switch (item.kind) {
                    case 'Error':
                        return `${ANSI_FAIL}Failed${ANSI_LIAF} ${item.testTitle}:\n`
                            + `  ${ANSI_DIM}actually is an error:${ANSI_MID}\n`
                            + `  ${item.actually.error}\n`;
                    case 'Failed':
                        return `${ANSI_FAIL}Failed${ANSI_LIAF} ${item.testTitle}:\n`
                            + `  ${ANSI_DIM}expected:${ANSI_MID} ${item.expected}\n`
                            + `  ${ANSI_DIM}actually:${ANSI_MID} ${item.actually}\n`;
                    case 'Passed':
                        return verbose
                            ? `${ANSI_PASS}Passed${ANSI_SSAP} ${item.testTitle}\n`
                            : '';
                    case 'SectionTitle':
                        return verbose || item.failTally
                            ? `\n${ANSI_BOLD}${item.sectionTitle}:${ANSI_DLOB}\n`
                                + '-'.repeat(item.sectionTitle.length+1) + '\n'
                            : '';
                    default: throw Error(`Expect.render(): unexpected item.kind`);
                }
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
function _renderHtml(log, failTally, passTally, sections, suiteTitle, smcLc, verbose) {
    const summary = _renderSummaryHtml(failTally, passTally, suiteTitle);
    return summary
        + log.map(item => {
            const sectionTitle = item.sectionTitle
                ? item.sectionTitle
                : sections[item.sectionIndex].sectionTitle
            ;
            if (sectionTitle.toLowerCase().includes(smcLc)) {
                switch (item.kind) {
                    case 'Error':
                        return `${HTML_FAIL}Failed${HTML_LIAF} ${item.testTitle}:\n`
                            + `  ${HTML_DIM}actually is an error:${HTML_MID}\n`
                            + `  ${item.actually.error}`;
                    case 'Failed':
                        return `${HTML_FAIL}Failed${HTML_LIAF} ${item.testTitle}:\n`
                            + `  ${HTML_DIM}expected:${HTML_MID} ${item.expected}\n`
                            + `  ${HTML_DIM}actually:${HTML_MID} ${item.actually}\n`;
                    case 'Passed':
                        return verbose
                            ? `${HTML_PASS}Passed${HTML_SSAP} ${item.testTitle}\n`
                            : '';
                    case 'SectionTitle':
                        return verbose || item.failTally
                            ? `\n${HTML_BOLD}${item.sectionTitle}:${HTML_DLOB}\n`
                            : '';
                    default: throw Error(`Expect.render(): unexpected item.kind`);
                }
            }
        })
        .join('')
        + (verbose ? '\n\n' + summary : '')
    ;
}

// Renders the test results summary for HTML output, eg to a web browser.
function _renderSummaryHtml(failTally, passTally, suiteTitle) {
    return '<hr>'
        + `${HTML_HEADING}${suiteTitle}${HTML_GNIDAEH}\n`
        + (failTally
            ? `${HTML_FAIL}Failed${HTML_LIAF} ${failTally} of ${failTally + passTally}`
            : `${HTML_PASS}Passed${HTML_SSAP} ${passTally} test${passTally === 1 ? '' : 's'}`
        )
        + '\n<hr>\n'
    ;
}

// Renders test results for plain text output, eg to a '.txt' file.
function _renderPlain(log, failTally, passTally, sections, suiteTitle, smcLc, verbose) {
    const summary = _renderSummaryPlain(failTally, passTally, suiteTitle);
    return summary
        + log.map(item => {
            const sectionTitle = item.sectionTitle
                ? item.sectionTitle
                : sections[item.sectionIndex].sectionTitle
            ;
            if (sectionTitle.toLowerCase().includes(smcLc)) {
                switch (item.kind) {
                    case 'Error':
                        return `Failed ${item.testTitle}:\n`
                            + `  actually is an error:\n`
                            + `  ${item.actually.error}\n`;
                    case 'Failed':
                        return `Failed ${item.testTitle}:\n`
                            + `  expected: ${item.expected}\n`
                            + `  actually: ${item.actually}\n`;
                    case 'Passed':
                        return verbose
                            ? `Passed ${item.testTitle}\n`
                            : '';
                    case 'SectionTitle':
                        return verbose || sections[item.sectionIndex].failTally
                            ? `\n${item.sectionTitle}:\n`
                                + '-'.repeat(item.sectionTitle.length+1) + '\n'
                            : '';
                    default: throw Error(`Expect.render(): unexpected item.kind`);
                }
            }
        })
        .join('')
        + (verbose ? '\n\n' + summary : '')
    ;
}

// Renders the test results summary for ANSI text output, eg to a Terminal.
function _renderSummaryPlain(failTally, passTally, suiteTitle) {
    return '-'.repeat(79)
        + '\n'
        + `${suiteTitle}\n`
        + '='.repeat(suiteTitle.length)
        + '\n'
        + (failTally
            ? `Failed ${failTally} of ${failTally + passTally}`
            : `Passed ${passTally} test${passTally === 1 ? '' : 's'}`
        )
        + '\n'
        + '-'.repeat(79)
        + '\n'
    ;
}

// @TODO
function _renderJson(log) { }
function _renderRaw(log) { }


/* ---------------------------------- Tests --------------------------------- */

// Tests Expect.render().
export function test(expect, Expect) {
    expect().section('render()');

    // @TODO
}
