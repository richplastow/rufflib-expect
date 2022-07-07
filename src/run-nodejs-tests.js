// rufflib-expect/src/run-nodejs-tests.js

/* -------------------------------- Imports --------------------------------- */

import Expect from './entry-point-main.js';
import expectTest from './entry-point-for-tests.js';


/* --------------------------------- Tests ---------------------------------- */

const testSuite = new Expect('Expect Test Suite (NodeJS)');
const expect = testSuite.expect;
expectTest(expect, Expect);
console.log(testSuite.render('Ansi'));
