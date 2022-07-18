# RuffLIB Expect

__A RuffLIB library for unit testing rough and sketchy JavaScript apps.__

▶&nbsp; __Version:__ 2.0.1  
▶&nbsp; __Homepage:__ <https://richplastow.com/rufflib-expect>  
▶&nbsp; __NPM:__ <https://www.npmjs.com/package/rufflib-expect>  
▶&nbsp; __Repo:__ <https://github.com/richplastow/rufflib-expect>  
▶&nbsp; __Tests:__ <https://richplastow.com/rufflib-expect/run-browser-tests.html>  


### Typical usage:

```js
import Expect from 'rufflib-expect';

const expect = new Expect('Mathsy Test Suite');
expect.section('Check that factorialise() works');
expect.that(`factorialise(5) // 5! = 5 * 4 * 3 * 2 * 1`,
             factorialise(5)).is(120);

console.log(expect.render('Ansi'));

function factorialise(n) {
    if (n === 0 || n === 1) return 1;
    for (let i=n-1; i>0; i--) n *= i;
    return n;
}
```


## Dev, Test and Build

Run the test suite in ‘src/’, while working on this library:  
`npm test --src`  
`npm start --src --open --test`  

Build the minified and unminified bundles, using settings in rollup.config.js:  
`npm run build`

Run the test suite in ‘docs/’, after a build:  
`npm test`  
`npm start --open --test`  
