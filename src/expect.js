// rufflib-expect/src/expect.js

// Assembles the `Expect` class.


/* --------------------------------- Import --------------------------------- */

const NAME = 'Expect';
const VERSION = '3.0.2';

import generateCss from './methods/generate-css.js';
import render from './methods/render.js';
import that from './methods/that.js';
import section from './methods/section.js';


/* ---------------------------------- Class --------------------------------- */

// A RuffLIB library for unit testing rough and sketchy JavaScript apps.
//
// Typical usage:
//
//     import Expect from 'rufflib-expect';
//
//     const expect = new Expect('Mathsy Test Suite');
//     expect.section('Check that factorialise() works');
//     expect.that(`factorialise(5) // 5! = 5 * 4 * 3 * 2 * 1`,
//                  factorialise(5)).is(120);
//
//     console.log(expect.render('Ansi'));
//
//     function factorialise(n) {
//         if (n === 0 || n === 1) return 1;
//         for (let i=n-1; i>0; i--) n *= i;
//         return n;
//     }
//
export default class Expect {
    static name = NAME; // make sure minification doesn’t squash the `name` property
    static VERSION = VERSION;

    constructor(suiteTitle='Untitled Test Suite') {
        this.that = that.bind(this);
        this.suiteTitle = suiteTitle;
        this.reset();
    }

    // Initialises all properties apart from `suiteTitle`.
    // Called by `constructor()`, and can also make unit testing Expect simpler.
    reset() {
        this.log = [];
        this.sections = [];

        // No tests have run, so no tests failed and no tests passed.
        // Technically, the test suite status is currently ‘pass’.
        this.failTally = 0;
        this.passTally = 0;
        this.status = 'pass';
    }
}

Expect.VERSION = VERSION;
Expect.generateCss = generateCss;
Expect.prototype.render = render;
Expect.prototype.section = section;


/* ---------------------------------- Tests --------------------------------- */

// Runs basic Expect tests on itself.
export function test(that, Expect) {
    that().section('Expect basics');
    that(`typeof Expect // in JavaScript, a class is type 'function'`,
          typeof Expect).is('function');
    that(`Expect.name // minification should not squash '${NAME}'`,
          Expect.name).is(NAME);
    that(`Expect.VERSION // make sure we are testing ${VERSION}`,
          Expect.VERSION).is(VERSION);
    that(`typeof new Expect()`,
          typeof new Expect()).is('object');
    that(`new Expect()`,
          new Expect()).has({
              failTally: 0,
              passTally: 0,
              status: 'pass',
          });


    that().section('Typical usage');

    function factorialise(n) {
        if (n === 0 || n === 1) return 1;
        for (let i=n-1; i>0; i--) n *= i;
        return n;
    }
    that(`factorialise(5) // 5! = 5 * 4 * 3 * 2 * 1`,
          factorialise(5)).is(120);

    const expect = new Expect('Mathsy Test Suite');
    that(`expect.that('factorialise(5)', factorialise(5)).is(120)`,
          expect.that('factorialise(5)', factorialise(5)).is(120)).is(true);
    that(`expect`, expect).has({ failTally: 0, passTally: 1, status: 'pass' });
    that(`expect.that('factorialise(3)', factorialise(3)).is(77)`,
          expect.that('factorialise(3)', factorialise(3)).is(77)).is(false);
    that(`expect`, expect).has({ failTally: 1, passTally: 1, status: 'fail' });
    that(`expect.render()`,
          expect.render()).passes(/Mathsy Test Suite\n={17}\nFailed 1 of 2\n/);
    that(`expect.render()`,
          expect.render()).passes(/Untitled Section:\n-{17}\n/);
    that(`expect.render()`,
          expect.render()).passes(/Failed factorialise\(3\):\s+expected: 77\s+actually: 6/);


    that().section('reset()');
    that(`typeof expect.reset`,
          typeof expect.reset).is('function');
    that(`expect.reset()`,
          expect.reset()).is(undefined);
    that(`expect`, expect).has({ failTally: 0, passTally: 0, status: 'pass' });
    that(`expect.render()`,
          expect.render()).passes(/^-{79}\nMathsy Test Suite\n={17}\nPassed 0 tests\n-{79}\n$/);

}
