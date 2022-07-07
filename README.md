# RuffLIB Expect

__A RuffLIB library for unit testing rough and sketchy JavaScript apps.__

▶&nbsp; __Version:__ 0.0.1  
▶&nbsp; __Repo:__ <https://github.com/richplastow/rufflib-expect>  
▶&nbsp; __Homepage:__ <https://richplastow.com/rufflib-expect>  
▶&nbsp; __Tests:__ <https://richplastow.com/rufflib-expect/run-browser-tests.html>  


## Dev, Test and Build

Run the test suite in ‘src/’, while working on this library:  
`node src/run-nodejs-tests.js # test src/ using NodeJS`
`static-server src & open http://localhost:9080/run-browser-tests.html && fg # test src/ using a browser`  

Build the minified and unminified bundles, using settings in rollup.config.js:  
`rollup -c`  
or  
`npm run build`

Run the test suite in ‘docs/’, after a build:  
`npm test # test docs/ using NodeJS`  
`static-server docs & open http://localhost:9080/run-browser-tests.html && fg # test docs/ using a browser`  
