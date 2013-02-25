asFlow
======

Asynchronous flow control library for JavaScript and Nodejs.

These functions are based on <a href="http://book.mixu.net/ch7.html">Mixu's Node Book chapter 7. Control flow</a>. They sure can be optimized and this readme file needs to be more thorough. This repository contains asFlow.js for use on clients, a node module and files for testing. 

What I wanted with this library was to make easy to understand functions that control <b>three types of asynchronous flow</b> and <b>only these three</b>. Please feel free to make them faster and more reliable but <b>keep them as readable as possible</b>. My goal is for users new to these functions, to be able to use them without ever reading the Readme.md ...


USAGE:

<b>1. CREATE YOUR FUNCTIONS</b>
```javascript
var function0 = function(optionalArgs0, optionalArgs1 ... optionalArgsN, call) {
  
  // Your code...
  
  call.currentResults();      // Returns and array of collected results at the moment sortet as the list of functions
  call.parentResult();        // Returns the result passed by the function above current in the list of functions
  call.resultByFunction(i);   // Returns specific result from a function in the list of functions
  call.back(optionalResult);  // Is required to be executed when the function returns and will deliver the result to the
                              // list of results
};
```

<b>2. ADD THEM TO THE LIST</b>
```javascript
var functions = [
  function0,
  function1, [argument0, argument1 ... argumentN],  // Adding a optional list of arguments to function1
  function3,
  function4,
  function5, [argument0, argument1 ... argumentN]   // Adding a optional list of arguments to function5
];
```

<b>3. RUN THE LIST OF FUNCTIONS IN ONE OF THESE THREE FLOW FUNCTIONS</b>
```javascript
var optionalCallback = function(results) {
  // Fires when the flow has completed and gives you a list with the results sorted as you sorted the
  // the list of functions.
};
asFlow.serialExecute(functions, optionalCallback);
asFlow.parallelExecute(functions, optionalCallback);
asFlow.parallelExecute_withLimit(functions, 3, optionalCallback);
```
