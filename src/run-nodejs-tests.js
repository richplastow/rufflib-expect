// rufflib-expect/src/run-nodejs-tests.js

/* ----------------------------- Imports and Env ---------------------------- */

import Expect from './entry-point-main.js';
import expectTest from './entry-point-for-tests.js';

// `npm test --full` means we should show full test results.
const showFullResults = !! process.env.npm_config_full;


/* --------------------------------- Tests ---------------------------------- */

// Run the test suite.
const testSuite = new Expect('Expect Test Suite (src, NodeJS)');
expectTest(testSuite.expect, Expect);

// Display the results.
console.log(testSuite.render('Ansi', showFullResults));

// Display handy hints.
console.log(`Hint: omit '--src' to run tests in docs/`);
console.log(`Hint: ${showFullResults ? 'omit' : 'use'} '--full' to ${
    showFullResults ? 'hide' : 'show'} full test results`);

// Set the exit code to `0` if the test suite passed, which signifies that this
// script terminated without error. Otherwise set the exit code to `1`, which
// could be used to halt a CI/CD pipeline.
process.exit(testSuite.status === 'pass' ? 0 : 1);
