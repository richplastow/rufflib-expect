// rufflib-expect/docs/run-nodejs-tests.js

/* ----------------------------- Imports and Env ---------------------------- */

import Expect from './dist/rufflib-expect.es.js';
import expectTest from './dist/rufflib-expect-test.es.js';

// `npm test --full` means we should show full test results.
const showFullResults = !! process.env.npm_config_full;

// `npm test --section=foo` means we should only run sections containing "foo".
const sectionMustContain = process.env.npm_config_section || '';


/* --------------------------------- Tests ---------------------------------- */

// Run the test suite.
const testSuite = new Expect('Expect Test Suite (dist, NodeJS)');
expectTest(testSuite.expect, Expect);

// Display the results.
console.log(testSuite.render('Ansi', sectionMustContain, showFullResults));

// Display handy hints.
console.log(`Hint: use '--src' to run tests in src/`);
console.log(`Hint: ${showFullResults ? 'omit' : 'use'} '--full' to ${
    showFullResults ? 'hide' : 'show'} full test results`);
console.log(`Hint: ${sectionMustContain ? 'omit' : 'use'} '--section=${
    sectionMustContain || 'foo'}' to ${
    sectionMustContain
        ? `stop filtering section titles using "${sectionMustContain}"`
        : 'show only sections with titles containing "foo"'}`
);

// Set the exit code to `0` if the test suite passed, which signifies that this
// script terminated without error. Otherwise set the exit code to `1`, which
// could be used to halt a CI/CD pipeline.
process.exit(testSuite.status === 'pass' ? 0 : 1);
