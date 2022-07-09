// rufflib-expect/docs/run-nodejs-tests.js

/* -------------------------------- Imports --------------------------------- */

import Expect from './dist/rufflib-expect.es.js';
import expectTest from './dist/rufflib-expect-test.es.js';


/* --------------------------------- Tests ---------------------------------- */

// Run the test suite.
const testSuite = new Expect('Expect Test Suite (dist, NodeJS)');
const expect = testSuite.expect;
expectTest(expect, Expect);

// Display the results.
console.log(testSuite.render('Ansi'));

// Set the exit code to `0` if the test suite passed, which signifies that this
// script terminated without error. Otherwise set the exit code to `1`, which
// could be used to halt a CI/CD pipeline.
process.exit(testSuite.status === 'pass' ? 0 : 1);
