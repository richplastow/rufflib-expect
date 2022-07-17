// rufflib-expect/src/methods/render.js


/* -------------------------------- Constants ------------------------------- */

const ERROR_PREFIX = 'expect.render(): ';

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
        `${ERROR_PREFIX}unexpected format, try 'Ansi|Html|Json|Plain|Raw'`);
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
                            + `  ${item.actually}\n`;
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
                    default: throw Error(`${ERROR_PREFIX}unexpected item.kind`);
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
                            + `  ${item.actually}\n`;
                    case 'Failed':
                        return `${HTML_FAIL}Failed${HTML_LIAF} ${item.testTitle}:\n`
                            + `  ${HTML_DIM}expected:${HTML_MID} ${item.expected}\n`
                            + `  ${HTML_DIM}actually:${HTML_MID} ${item.actually}\n`;
                    case 'Passed':
                        return verbose
                            ? `${HTML_PASS}Passed${HTML_SSAP} ${item.testTitle}\n`
                            : '';
                    case 'SectionTitle':
                        return verbose || sections[item.sectionIndex].failTally
                            ? `\n${HTML_BOLD}${item.sectionTitle}:${HTML_DLOB}\n`
                            : '';
                    default: throw Error(`${ERROR_PREFIX}unexpected item.kind`);
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

// Renders the test results summary as a stringified JSON object, eg for logging.
function _renderJson(log, failTally, passTally, sections, suiteTitle, smcLc, verbose) {
    return '{\n'
        + `  "fail_tally": ${failTally},\n`
        + `  "pass_tally": ${passTally},\n`
        + `  "status": "${failTally ? 'fail' : 'pass'}",\n`
        + `  "suite_title": "${suiteTitle}",\n` // @TODO escape suiteTitle
        + `  "log": [\n`
        + log.map(item => {
            const sectionTitle = item.sectionTitle
                ? item.sectionTitle
                : sections[item.sectionIndex].sectionTitle
            ;
            if (sectionTitle.toLowerCase().includes(smcLc)) {
                switch (item.kind) {
                    case 'Error':
                        return `    { "kind": "Error", "test_title": "${item.testTitle}",\n`
                             + `      "error": ${JSON.stringify(item.actually)} },\n`
                    case 'Failed':
                        return `    { "kind": "Failed", "test_title": "${item.testTitle}",\n`
                             + `      "expected": ${JSON.stringify(item.expected)},\n`
                             + `      "actually": ${JSON.stringify(item.actually)} },\n`;
                    case 'Passed':
                        return verbose
                            ? `    { "kind": "Passed", "test_title": "${item.testTitle}" },\n`
                            : '';
                    case 'SectionTitle':
                        return verbose || sections[item.sectionIndex].failTally
                            ? `    { "kind": "SectionTitle", "section_title": "${item.sectionTitle}" },\n`
                            : '';
                    default: throw Error(`${ERROR_PREFIX}unexpected item.kind`);
                }
            }
        })
        .join('')
        .slice(0, -2) // remove the trailing comma
        + '\n  ]\n}'
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
                            + `  ${item.actually}\n`;
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
                    default: throw Error(`${ERROR_PREFIX}unexpected item.kind`);
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

// Returns the test suite’s `log` property as-is.
function _renderRaw(log) { return log }


/* ---------------------------------- Tests --------------------------------- */

// Tests expect.render().
export function test(expect, Expect) {
    const testSuite = new Expect('My Great Test Suite');


    expect().section('render() basics and exceptions');

    // Basics.
    expect(`typeof testSuite.render`,
            typeof testSuite.render).toBe('function');
    expect(`typeof testSuite.render('Ansi')`,
            typeof testSuite.render('Ansi')).toBe('string');
    expect(`typeof testSuite.render('Html')`,
            typeof testSuite.render('Html')).toBe('string');
    expect(`typeof testSuite.render('Json')`,
            typeof testSuite.render('Json')).toBe('string');
    expect(`typeof testSuite.render('Plain')`,
            typeof testSuite.render('Plain')).toBe('string');
    expect(`typeof testSuite.render('Raw')`,
            typeof testSuite.render('Raw')).toBe('object');
    expect(`Array.isArray(testSuite.render('Raw'))`,
            Array.isArray(testSuite.render('Raw'))).toBe(true);

    // Incorrect arguments should throw exceptions.
    let exc;
    const OK = 'Did not encounter an exception';
    try {   testSuite.render(123); exc = OK } catch (e) { exc = `${e}` }
    expect(`testSuite.render(123)`, exc)
        .toBe(`Error: expect.render(): unexpected format, try 'Ansi|Html|Json|Plain|Raw'`);


    expect().section('render() with no tests');

    // Before any tests have been specified.
    expect(`testSuite.render('Ansi')`,
            testSuite.render('Ansi')).toMatch(
            /^-{79}\n\u001b\[1mMy Great Test Suite\u001b\[0m\n={19}\n\u001b\[32m√ Passed\u001b\[0m 0 tests\n-{79}\n$/);
    expect(`testSuite.render('Html')`,
            testSuite.render('Html')).toBe(
            '<hr><h2>My Great Test Suite</h2>\n<i>√ Passed</i> 0 tests\n<hr>\n');
    expect(`testSuite.render('Json')`,
            testSuite.render('Json')).toBe([
                '{',
                '  "fail_tally": 0,',
                '  "pass_tally": 0,',
                '  "status": "pass",',
                '  "suite_title": "My Great Test Suite",',
                '  "log": [',
                '',
                '  ]',
                '}',
            ].join('\n'));
    expect(`testSuite.render('Plain')`,
            testSuite.render('Plain')).toMatch(
            /^-{79}\nMy Great Test Suite\n={19}\nPassed 0 tests\n-{79}\n$/);
    expect(`testSuite.render('Raw')`,
            testSuite.render('Raw')).toJson([]);


    expect().section('render() with tests');

    // One passing test, in a defaultly-named section.
    expect(`testSuite.expect('A', 1).toBe(1) // same test as in 'expect().toBe()'`,
            testSuite.expect('A', 1).toBe(1)).toBe(true);
    expect(`testSuite.render('Ansi')`,
            testSuite.render('Ansi')).toMatch(
            /^-{79}\n\u001b\[1mMy Great Test Suite\u001b\[0m\n={19}\n\u001b\[32m√ Passed\u001b\[0m 1 test\n-{79}\n$/);
    expect(`testSuite.render('Ansi', '', true)`,
            testSuite.render('Ansi', '', true)).toMatch(
            /-{79}\n\n\u001b\[1mUntitled Section:\u001b\[0m\n-{17}\n\u001b\[32m√ Passed\u001b\[0m A\n\n\n-{79}\n/);
    expect(`testSuite.render('Html')`,
            testSuite.render('Html')).toBe(
            '<hr><h2>My Great Test Suite</h2>\n<i>√ Passed</i> 1 test\n<hr>\n');
    expect(`testSuite.render('Html', '', true)`,
            testSuite.render('Html', '', true)).toBe(
            '<hr><h2>My Great Test Suite</h2>\n<i>√ Passed</i> 1 test\n<hr>\n' +
            '\n<b>Untitled Section:</b>\n<i>√ Passed</i> A\n\n\n' +
            '<hr><h2>My Great Test Suite</h2>\n<i>√ Passed</i> 1 test\n<hr>\n');
    expect(`testSuite.render('Json')`,
            testSuite.render('Json')).toBe([
                '{',
                '  "fail_tally": 0,',
                '  "pass_tally": 1,',
                '  "status": "pass",',
                '  "suite_title": "My Great Test Suite",',
                '  "log": [',
                '',
                '  ]',
                '}',
            ].join('\n'));
    expect(`testSuite.render('Json', '', true)`,
            testSuite.render('Json', '', true)).toBe([
                '{',
                '  "fail_tally": 0,',
                '  "pass_tally": 1,',
                '  "status": "pass",',
                '  "suite_title": "My Great Test Suite",',
                '  "log": [',
                '    { "kind": "SectionTitle", "section_title": "Untitled Section" },',
                '    { "kind": "Passed", "test_title": "A" }',
                '  ]',
                '}',
            ].join('\n'));
    expect(`testSuite.render('Plain')`,
            testSuite.render('Plain')).toMatch(
                /^-{79}\nMy Great Test Suite\n={19}\nPassed 1 test\n-{79}\n$/);
    expect(`testSuite.render('Plain', '', true)`,
            testSuite.render('Plain', '', true)).toMatch(
                /-{79}\n\nUntitled Section:\n-{17}\nPassed A\n\n\n-{79}\n/);
    const rawResultOneTest = [
        {
          kind: 'SectionTitle',
          sectionIndex: 0,
          sectionTitle: 'Untitled Section'
        },
        { kind: 'Passed', sectionIndex: 0, testTitle: 'A' }
    ];
    expect(`testSuite.render('Raw')`,
            testSuite.render('Raw')).toJson(rawResultOneTest);
    expect(`testSuite.render('Raw', '', true)`,
            testSuite.render('Raw', '', true)).toJson(rawResultOneTest);

    // Add three failing tests and a passing test, in a custom-named section.
    expect(`testSuite.expect().section('Second Section')`,
            testSuite.expect().section('Second Section')).toBe(undefined);
    expect(`testSuite.expect('B', 1).toBe(0)`,
            testSuite.expect('B', 1).toBe(0)).toBe(false);
    expect(`testSuite.expect('C', 1).toBe(1)`,
            testSuite.expect('C', 1).toBe(1)).toBe(true);
    expect(`testSuite.expect('D', {error:'Actual Error'}).toError('Expected Error')`,
            testSuite.expect('D', {error:'Actual Error'}).toError('Expected Error')).toBe(false);
    expect(`testSuite.expect('E', {error:'Unexpectedly Error'}).toHave({a:1})`,
            testSuite.expect('E', {error:'Unexpectedly Error'}).toHave({a:1})).toBe(false);

    expect(`testSuite.render('Ansi')`,
            testSuite.render('Ansi')).toMatch(new RegExp([
                /^-{79}\n\u001b\[1mMy Great Test Suite\u001b\[0m\n={19}\n/,
                /\u001b\[31mX Failed\u001b\[0m 3 of 5\n-{79}\n\n/,
                /\u001b\[1mSecond Section:\u001b\[0m\n-{15}\n/,
                /\u001b\[31mX Failed\u001b\[0m B:\n/,
                /  \u001b\[2mexpected:\u001b\[0m 0\n/,
                /  \u001b\[2mactually:\u001b\[0m 1\n/,
                /\u001b\[31mX Failed\u001b\[0m D:\n/,
                /  \u001b\[2mexpected:\u001b\[0m Expected Error\n/,
                /  \u001b\[2mactually:\u001b\[0m Actual Error\n/,
                /\u001b\[31mX Failed\u001b\[0m E:\n/,
                /  \u001b\[2mactually is an error:\u001b\[0m\n/,
                /  Unexpectedly Error\n$/,
            ].map(r=>r.source).join('')));
    expect(`testSuite.render('Ansi', 'untitled', true)`,
            testSuite.render('Ansi', 'untitled', true)).toMatch(new RegExp([
                /^-{79}\n\u001b\[1mMy Great Test Suite\u001b\[0m\n={19}\n/,
                /\u001b\[31mX Failed\u001b\[0m 3 of 5\n-{79}\n\n/,
                /\u001b\[1mUntitled Section:\u001b\[0m\n-{17}\n/,
                /\u001b\[32m√ Passed\u001b\[0m A\n\n\n-{79}\n/,
                /\u001b\[1mMy Great Test Suite\u001b\[0m\n={19}\n/,
                /\u001b\[31mX Failed\u001b\[0m 3 of 5\n-{79}\n$/,
            ].map(r=>r.source).join('')));
    expect(`testSuite.render('Ansi', 'second', true)`,
            testSuite.render('Ansi', 'second', true)).toMatch(new RegExp([
                /^-{79}\n\u001b\[1mMy Great Test Suite\u001b\[0m\n={19}\n/,
                /\u001b\[31mX Failed\u001b\[0m 3 of 5\n-{79}\n\n/,
                /\u001b\[1mSecond Section:\u001b\[0m\n-{15}\n/,
                /\u001b\[31mX Failed\u001b\[0m B:\n/,
                /  \u001b\[2mexpected:\u001b\[0m 0\n/,
                /  \u001b\[2mactually:\u001b\[0m 1\n/,
                /\u001b\[32m√ Passed\u001b\[0m C\n/,
                /\u001b\[31mX Failed\u001b\[0m D:\n/,
                /  \u001b\[2mexpected:\u001b\[0m Expected Error\n/,
                /  \u001b\[2mactually:\u001b\[0m Actual Error\n/,
                /\u001b\[31mX Failed\u001b\[0m E:\n/,
                /  \u001b\[2mactually is an error:\u001b\[0m\n/,
                /  Unexpectedly Error\n\n\n/,
                /-{79}\n\u001b\[1mMy Great Test Suite\u001b\[0m\n={19}\n/,
                /\u001b\[31mX Failed\u001b\[0m 3 of 5\n-{79}/,
            ].map(r=>r.source).join('')));
    expect(`testSuite.render('Ansi', '', true)`,
            testSuite.render('Ansi', '', true)).toMatch(new RegExp([
                /^-{79}\n\u001b\[1mMy Great Test Suite\u001b\[0m\n={19}\n/,
                /\u001b\[31mX Failed\u001b\[0m 3 of 5\n-{79}\n\n/,
                /\u001b\[1mUntitled Section:\u001b\[0m\n-{17}\n/,
                /\u001b\[32m√ Passed\u001b\[0m A\n\n/,
                /\u001b\[1mSecond Section:\u001b\[0m\n-{15}\n/,
                /\u001b\[31mX Failed\u001b\[0m B:\n/,
                /  \u001b\[2mexpected:\u001b\[0m 0\n/,
                /  \u001b\[2mactually:\u001b\[0m 1\n/,
                /\u001b\[32m√ Passed\u001b\[0m C\n/,
                /\u001b\[31mX Failed\u001b\[0m D:\n/,
                /  \u001b\[2mexpected:\u001b\[0m Expected Error\n/,
                /  \u001b\[2mactually:\u001b\[0m Actual Error\n/,
                /\u001b\[31mX Failed\u001b\[0m E:\n/,
                /  \u001b\[2mactually is an error:\u001b\[0m\n/,
                /  Unexpectedly Error\n\n\n/,
                /-{79}\n\u001b\[1mMy Great Test Suite\u001b\[0m\n={19}\n/,
                /\u001b\[31mX Failed\u001b\[0m 3 of 5\n-{79}/,
            ].map(r=>r.source).join('')));
    expect(`testSuite.render('Html')`,
            testSuite.render('Html')).toBe(
                '<hr><h2>My Great Test Suite</h2>\n<u>X Failed</u> 3 of 5\n<hr>\n\n'
              + '<b>Second Section:</b>\n'
              + '<u>X Failed</u> B:\n  <s>expected:</s> 0\n  <s>actually:</s> 1\n'
              + '<u>X Failed</u> D:\n  <s>expected:</s> Expected Error\n  <s>actually:</s> Actual Error\n'
              + '<u>X Failed</u> E:\n  <s>actually is an error:</s>\n  Unexpectedly Error\n'
            );
    expect(`testSuite.render('Html', 'untitled', true)`,
            testSuite.render('Html', 'untitled', true)).toBe(
                '<hr><h2>My Great Test Suite</h2>\n<u>X Failed</u> 3 of 5\n<hr>\n\n'
              + '<b>Untitled Section:</b>\n<i>√ Passed</i> A\n\n\n'
              + '<hr><h2>My Great Test Suite</h2>\n<u>X Failed</u> 3 of 5\n<hr>\n');
    expect(`testSuite.render('Html', 'second', true)`,
            testSuite.render('Html', 'second', true)).toBe(
                '<hr><h2>My Great Test Suite</h2>\n<u>X Failed</u> 3 of 5\n<hr>\n\n'
              + '<b>Second Section:</b>\n<u>X Failed</u> B:\n'
              + '  <s>expected:</s> 0\n  <s>actually:</s> 1\n'
              + '<i>√ Passed</i> C\n'
              + '<u>X Failed</u> D:\n  <s>expected:</s> Expected Error\n  <s>actually:</s> Actual Error\n'
              + '<u>X Failed</u> E:\n  <s>actually is an error:</s>\n  Unexpectedly Error\n\n\n'
              + '<hr><h2>My Great Test Suite</h2>\n<u>X Failed</u> 3 of 5\n<hr>\n');
    expect(`testSuite.render('Html', '', true)`,
            testSuite.render('Html', '', true)).toBe(
                '<hr><h2>My Great Test Suite</h2>\n<u>X Failed</u> 3 of 5\n<hr>\n\n'
              + '<b>Untitled Section:</b>\n<i>√ Passed</i> A\n\n'
              + '<b>Second Section:</b>\n<u>X Failed</u> B:\n'
              + '  <s>expected:</s> 0\n  <s>actually:</s> 1\n'
              + '<i>√ Passed</i> C\n'
              + '<u>X Failed</u> D:\n  <s>expected:</s> Expected Error\n  <s>actually:</s> Actual Error\n'
              + '<u>X Failed</u> E:\n  <s>actually is an error:</s>\n  Unexpectedly Error\n\n\n'
              + '<hr><h2>My Great Test Suite</h2>\n<u>X Failed</u> 3 of 5\n<hr>\n');
    expect(`testSuite.render('Json')`,
            testSuite.render('Json')).toBe([
                '{',
                '  "fail_tally": 3,',
                '  "pass_tally": 2,',
                '  "status": "fail",',
                '  "suite_title": "My Great Test Suite",',
                '  "log": [',
                '    { "kind": "SectionTitle", "section_title": "Second Section" },',
                '    { "kind": "Failed", "test_title": "B",',
                '      "expected": 0,',
                '      "actually": 1 },',
                '    { "kind": "Failed", "test_title": "D",',
                '      "expected": "Expected Error",',
                '      "actually": "Actual Error" },',
                '    { "kind": "Error", "test_title": "E",',
                '      "error": "Unexpectedly Error" }',
                '  ]',
                '}',
            ].join('\n'));
    expect(`testSuite.render('Json', 'untitled', true)`,
            testSuite.render('Json', 'untitled', true)).toBe([
                '{',
                '  "fail_tally": 3,',
                '  "pass_tally": 2,',
                '  "status": "fail",',
                '  "suite_title": "My Great Test Suite",',
                '  "log": [',
                '    { "kind": "SectionTitle", "section_title": "Untitled Section" },',
                '    { "kind": "Passed", "test_title": "A" }',
                '  ]',
                '}',
            ].join('\n'));
    expect(`testSuite.render('Json', 'second', true)`,
            testSuite.render('Json', 'second', true)).toBe([
                '{',
                '  "fail_tally": 3,',
                '  "pass_tally": 2,',
                '  "status": "fail",',
                '  "suite_title": "My Great Test Suite",',
                '  "log": [',
                '    { "kind": "SectionTitle", "section_title": "Second Section" },',
                '    { "kind": "Failed", "test_title": "B",',
                '      "expected": 0,',
                '      "actually": 1 },',
                '    { "kind": "Passed", "test_title": "C" },',
                '    { "kind": "Failed", "test_title": "D",',
                '      "expected": "Expected Error",',
                '      "actually": "Actual Error" },',
                '    { "kind": "Error", "test_title": "E",',
                '      "error": "Unexpectedly Error" }',
                '  ]',
                '}',
            ].join('\n'));
    expect(`testSuite.render('Json', '', true)`,
            testSuite.render('Json', '', true)).toBe([
                '{',
                '  "fail_tally": 3,',
                '  "pass_tally": 2,',
                '  "status": "fail",',
                '  "suite_title": "My Great Test Suite",',
                '  "log": [',
                '    { "kind": "SectionTitle", "section_title": "Untitled Section" },',
                '    { "kind": "Passed", "test_title": "A" },',
                '    { "kind": "SectionTitle", "section_title": "Second Section" },',
                '    { "kind": "Failed", "test_title": "B",',
                '      "expected": 0,',
                '      "actually": 1 },',
                '    { "kind": "Passed", "test_title": "C" },',
                '    { "kind": "Failed", "test_title": "D",',
                '      "expected": "Expected Error",',
                '      "actually": "Actual Error" },',
                '    { "kind": "Error", "test_title": "E",',
                '      "error": "Unexpectedly Error" }',
                '  ]',
                '}',
            ].join('\n'));
    expect(`testSuite.render('Plain')`,
            testSuite.render('Plain')).toMatch(new RegExp([
                /^-{79}\nMy Great Test Suite\n={19}\n/,
                /Failed 3 of 5\n-{79}\n\n/,
                /Second Section:\n-{15}\n/,
                /Failed B:\n/,
                /  expected: 0\n/,
                /  actually: 1\n/,
                /Failed D:\n/,
                /  expected: Expected Error\n/,
                /  actually: Actual Error\n/,
                /Failed E:\n/,
                /  actually is an error:\n/,
                /  Unexpectedly Error/,
            ].map(r=>r.source).join('')));
    expect(`testSuite.render('Plain', 'untitled', true)`,
            testSuite.render('Plain', 'untitled', true)).toMatch(new RegExp([
                /^-{79}\nMy Great Test Suite\n={19}\n/,
                /Failed 3 of 5\n-{79}\n\n/,
                /Untitled Section:\n-{17}\n/,
                /Passed A\n\n\n-{79}\n/,
                /My Great Test Suite\n={19}\n/,
                /Failed 3 of 5\n-{79}\n$/,
            ].map(r=>r.source).join('')));
    expect(`testSuite.render('Plain', 'second', true)`,
            testSuite.render('Plain', 'second', true)).toMatch(new RegExp([
                /^-{79}\nMy Great Test Suite\n={19}\n/,
                /Failed 3 of 5\n-{79}\n\n/,
                /Second Section:\n-{15}\n/,
                /Failed B:\n/,
                /  expected: 0\n/,
                /  actually: 1\n/,
                /Passed C\n/,
                /Failed D:\n/,
                /  expected: Expected Error\n/,
                /  actually: Actual Error\n/,
                /Failed E:\n/,
                /  actually is an error:\n/,
                /  Unexpectedly Error\n\n\n/,
                /-{79}\nMy Great Test Suite\n={19}\n/,
                /Failed 3 of 5\n-{79}/,
            ].map(r=>r.source).join('')));
    expect(`testSuite.render('Plain', '', true)`,
            testSuite.render('Plain', '', true)).toMatch(new RegExp([
                /^-{79}\nMy Great Test Suite\n={19}\n/,
                /Failed 3 of 5\n-{79}\n\n/,
                /Untitled Section:\n-{17}\n/,
                /Passed A\n\n/,
                /Second Section:\n-{15}\n/,
                /Failed B:\n/,
                /  expected: 0\n/,
                /  actually: 1\n/,
                /Passed C\n/,
                /Failed D:\n/,
                /  expected: Expected Error\n/,
                /  actually: Actual Error\n/,
                /Failed E:\n/,
                /  actually is an error:\n/,
                /  Unexpectedly Error\n\n\n/,
                /-{79}\nMy Great Test Suite\n={19}\n/,
                /Failed 3 of 5\n-{79}/,
            ].map(r=>r.source).join('')));
    const rawResultFourTests = [
        {
            kind: 'SectionTitle',
            sectionIndex: 0,
            sectionTitle: 'Untitled Section'
        },
        { kind: 'Passed', sectionIndex: 0, testTitle: 'A' },
        {
            kind: 'SectionTitle',
            sectionIndex: 1,
            sectionTitle: 'Second Section'
        },
        {
            actually: 1,
            expected: 0,
            kind: 'Failed',
            sectionIndex: 1,
            testTitle: 'B'
        },
        { kind: 'Passed', sectionIndex: 1, testTitle: 'C' },
        {
            actually: 'Actual Error',
            expected: 'Expected Error',
            kind: 'Failed',
            sectionIndex: 1,
            testTitle: 'D'
        },
        {
            actually: 'Unexpectedly Error',
            expected: '{"a":1}',
            kind: 'Error',
            sectionIndex: 1,
            testTitle: 'E'
        }  
    ];
    expect(`testSuite.render('Raw')`,
            testSuite.render('Raw')).toJson(rawResultFourTests);
    expect(`testSuite.render('Raw', 'untitled', true)`,
            testSuite.render('Raw', 'untitled', true)).toJson(rawResultFourTests);
    expect(`testSuite.render('Raw', 'second', true)`,
            testSuite.render('Raw', 'second', true)).toJson(rawResultFourTests);
    expect(`testSuite.render('Raw', '', true)`,
            testSuite.render('Raw', '', true)).toJson(rawResultFourTests);

}
