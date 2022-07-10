// rufflib-expect/src/expect.js

// Assembles the `Expect` class.


/* --------------------------------- Import --------------------------------- */

import generateCss from './methods/generate-css.js';
import expect from './methods/expect.js';
import render from './methods/render.js';


/* ---------------------------------- Class --------------------------------- */

// A RuffLIB library for unit testing rough and sketchy JavaScript apps.
//
// Typical usage:
//     const testSuite = new Expect('Mathsy Test Suite');
//     const expect = testSuite.expect;
//     expect.section('Check that factorialise() works as expected');
//
//     expect(`factorialise(5) // 5! = 5 * 4 * 3 * 2 * 1`,
//             factorialise(5)).toBe(120);
//     testSuite.render();
//
//     function factorialise(n) {
//         if (n === 0 || n === 1) return 1;
//         for (let i=n-1; i>0; i--) n *= i;
//         return n;
//     }
//     
export default class Expect {
    constructor(suiteTitle='Untitled Test Suite') {
        this.expect = expect.bind(this);
        this.log = [];
        this.sections = [];
        this.suiteTitle = suiteTitle;

        // No tests have run yet, so no failures and no passes.
        // So technically, the test suite status is currently ‘pass’.
        this.failTally = 0;
        this.passTally = 0;
        this.status = 'pass';
    }
}

Expect.generateCss = generateCss;
Expect.prototype.render = render;


/* ---------------------------------- Tests --------------------------------- */

// Runs basic Expect tests on itself.
export function test(expect, Expect) {
    // expect().section('Expect basics');
    expect(`typeof Expect // in JavaScript, a class is type 'function'`,
            typeof Expect).toBe('function');
    expect(`typeof new Expect()`,
            typeof new Expect()).toBe('object');
    // expect(`new Expect()`,
    //         new Expect()).toHave({
    //             log: [],
    //             suiteTitle: 'Untitled Test Suite',
    //         });
    // expect(`new Expect('Mathsy Test Suite')`,
    //         new Expect('Mathsy Test Suite')).toHave({
    //             log '[],
    //             suiteTitle: 'Mathsy Test Suite',
    //         });


    expect().section('Typical usage');
    expect(`factorialise(5) // 5! = 5 * 4 * 3 * 2 * 1`,
            factorialise(5)).toBe(120);

    function factorialise(n) {
        if (n === 0 || n === 1) return 1;
        for (let i=n-1; i>0; i--) n *= i;
        return n;
    }

}
