// rufflib-expect/src/run-nodejs-tests.js

/* -------------------------------- Imports --------------------------------- */

import Expect from './entry-point-main.js';
import expectTest from './entry-point-for-tests.js';


/* --------------------------------- Tests ---------------------------------- */

// Run the test suite.
const testSuite = new Expect('Expect Test Suite (src, NodeJS)');
const expect = testSuite.expect;
expectTest(expect, Expect);

// Display the results.
console.log(testSuite.render('Ansi'));

// Set the exit code to `0` if the test suite passed, which signifies that this
// script terminated without error. Otherwise set the exit code to `1`, which
// could be used to halt a CI/CD pipeline.
process.exit(testSuite.status === 'pass' ? 0 : 1);
