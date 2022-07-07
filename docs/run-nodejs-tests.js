// rufflib-expect/src/run-nodejs-tests.js

/* -------------------------------- Imports --------------------------------- */

import Expect from './dist/rufflib-expect.es.js';
import expectTest from './dist/rufflib-expect-test.es.js';


/* --------------------------------- Tests ---------------------------------- */

const testSuite = new Expect('Expect Test Suite (NodeJS)');
const expect = testSuite.expect;
expectTest(expect, Expect);
console.log(testSuite.render('Ansi'));
