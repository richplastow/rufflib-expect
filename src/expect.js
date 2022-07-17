// rufflib-expect/src/expect.js

// Assembles the `Expect` class.


/* --------------------------------- Import --------------------------------- */

const VERSION = '1.0.1';

import generateCss from './methods/generate-css.js';
import render from './methods/render.js';
import that from './methods/that.js';


/* ---------------------------------- Class --------------------------------- */

// A RuffLIB library for unit testing rough and sketchy JavaScript apps.
//
// Typical usage:
//
//     import Expect from 'rufflib-expect';
//
//     const expect = new Expect('Mathsy Test Suite');
//     expect.that().section('Check that factorialise() works');
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

        // No tests have run, so no failures and no passes.
        // So technically, the test suite status is currently ‘pass’.
        this.failTally = 0;
        this.passTally = 0;
        this.status = 'pass';
    }
}

Expect.VERSION = VERSION;
Expect.generateCss = generateCss;
Expect.prototype.render = render;


/* ---------------------------------- Tests --------------------------------- */

// Runs basic Expect tests on itself.
export function test(that, Expect) {
    that().section('Expect basics');
    that(`typeof Expect // in JavaScript, a class is type 'function'`,
          typeof Expect).toBe('function');
    that(`Expect.VERSION`,
          Expect.VERSION).toBe(VERSION);
    that(`typeof new Expect()`,
          typeof new Expect()).toBe('object');
    that(`new Expect()`,
          new Expect()).toHave({
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
          factorialise(5)).toBe(120);

    const mathsy = new Expect('Mathsy Test Suite');
    that(`mathsy.that('factorialise(5)', factorialise(5)).toBe(120)`,
          mathsy.that('factorialise(5)', factorialise(5)).toBe(120)).toBe(true);
    that(`mathsy`, mathsy).toHave({ failTally: 0, passTally: 1, status: 'pass' });
    that(`mathsy.that('factorialise(3)', factorialise(3)).toBe(77)`,
          mathsy.that('factorialise(3)', factorialise(3)).toBe(77)).toBe(false);
    that(`mathsy`, mathsy).toHave({ failTally: 1, passTally: 1, status: 'fail' });
    that(`mathsy.render()`,
          mathsy.render()).toMatch(/Mathsy Test Suite\n={17}\nFailed 1 of 2\n/);
    that(`mathsy.render()`,
          mathsy.render()).toMatch(/Untitled Section:\n-{17}\n/);
    that(`mathsy.render()`,
          mathsy.render()).toMatch(/Failed factorialise\(3\):\s+expected: 77\s+actually: 6/);


    that().section('reset()');
    that(`typeof mathsy.reset`,
          typeof mathsy.reset).toBe('function');
    that(`mathsy.reset()`,
          mathsy.reset()).toBe(undefined);
    that(`mathsy`, mathsy).toHave({ failTally: 0, passTally: 0, status: 'pass' });
    that(`mathsy.render()`,
          mathsy.render()).toMatch(/^-{79}\nMathsy Test Suite\n={17}\nPassed 0 tests\n-{79}\n$/);

}
