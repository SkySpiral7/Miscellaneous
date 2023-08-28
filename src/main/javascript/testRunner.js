'use strict';
/*
This javascript program is used to run javascript tests. It is lightweight but useful and fast.
I maintain it because I like how lightweight it is and because it accepts a delta for deeply comparing floating point
numbers (and dates) whereas Jasmine only does surface level comparisons using decimal place precision (more details below).
QUnit doesn't seem to support "close enough" matches for numbers.
*/
/*
Terms:
'suite': an object that contains any number of tests and suites
'test': a function (generally defined under the TestSuite object) that creates assertions
'assertion': an object with Expected/Actual (or Error) etc, if it has an Outcome then it has already been determined if it passes
*/
/*
For examples see the bottom of this file and testRunnerExample.html.
For more information see the javascript doc comments within this file.

To run a specific test simply call the test as a normal function (no args).
To run all tests simply call TestRunner.testAll() note that it returns a promise.
If you have a DOM element textarea#testResults that will have the results put in it and update location.hash to #testResults.
Test functions and testAll will also return the test results as json (it also has a toString defined).

This test runner supports asynchronous test execution.
Simply make any number of your test functions async to take advantage.
Tests that are not async will be executed sequentially (in no particular order) therefore tests that use the DOM
will not interfere with each other.

This test runner supports NodeJs.

This test runner has no polyfil or prototypes defined and requires Promise to exist.

The way Expected and Actual are compared by default should cover most cases but if you need custom equality simply
define a function named equals on Expected which takes in Actual and synchronously returns true or false.
Note that the comparisons are type strict since using the wrong type can lead to bugs.
However if equals exists it will be called before any other checks therefore
if {Expected: {equals: function(other){return other % 2 === 0;}}, Actual: actual} fails it will show what Actual was
rather than just {Expected: true, Actual: (actual%2===0)} which only shows false.
*/
/*
Comparing delta to Jasmine:
delta is safer than what Jasmine did: https://github.com/jasmine/jasmine/blob/master/src/core/matchers/toBeCloseTo.js
   var pow = Math.pow(10, precision + 1);
   var delta = Math.abs(expected - actual);
   var maxDelta = Math.pow(10, -precision) / 2;
   return (Math.round(delta * pow) / pow <= maxDelta)
although I can't prove that Jasmine is wrong.
Either way my delta works for deep matches not just top level asserts like Jasmine does.
My runner can do {Expected: {a: 1.01}, Actual: {a: 2}, Delta: 1} and pass.
But Jasmine's toBeCloseTo only takes in numbers making large object/array comparisons impractical.
*/

var TestRunner = {};
(function(){
/**This is a private global because the value doesn't change.*/
var _hasDom = (typeof window === 'object' && undefined !== window.document);

/**Will do nothing if testState.runningSingleTest is false (strict). else this function will clear #testResults (if exists),
start the timer, and call testState.config.beforeFirst (if it is defined) which can be used to setup mocks.*/
TestRunner.clearResults=function(testState)
{
   if(undefined === testState) testState = {runningSingleTest: true};
   if (false !== testState.runningSingleTest)
   {
      testState._startTime = Date.now();
      if (_hasDom)
      {
         var testResults = document.getElementById('testResults');
         if(null !== testResults) testResults.value = '';
      }
      testState.config = TestRunner._defaultConfigValues(testState.config);
      testState.config.beforeFirst();
   }
};
/**if(testState.runningSingleTest) This function clears out then writes the test results to #testResults and scrolls to it.
After calling TestRunner._processResults it will call testState.config.afterLast (if it is defined) which can be used to teardown mocks
(including deleting equals functions).
@param {string} name the display name of the test
@param {array} assertions an array of assertions created by the test
@param {object} testState testState.config.hidePassed defaults to false
@returns {object} if(!testState.runningSingleTest) return object that can be used by TestRunner._processResults
   which is used by TestRunner.testAll.
   else return a json object of test results*/
TestRunner.displayResults=function(name, assertions, testState)
{
   var input = {name: name, assertions: assertions};
   if(undefined === testState) testState = {runningSingleTest: true};
   if (false !== testState.runningSingleTest)
   {
      testState.config = TestRunner._defaultConfigValues(testState.config, false);
      var output = TestRunner._processResults([input], testState);
      //afterLast should be run after TestRunner._processResults so that equals functions could be removed
      testState.config.afterLast();
      if (_hasDom)
      {
         var testResults = document.getElementById('testResults');
         if (null !== testResults)
         {
            testResults.value = output.toString();
            //TODO: this breaks single page applications. maybe only update if it is '#top', '', '#', '#testResults'
            location.hash = '#testResults';  //scroll to the results
         }
      }
      return output;  //output is an object (not a string) so a link to a test won't override the page
   }
   return input;
};
//I could have testState contain assertions and methods: assert, assertAll, failedToThrow, error.
//But that would make testState={} difficult (which every test has) I'd rather not testState=new TestState()
/**This is a simple way to fail when a test was expected to throw but didn't.*/
TestRunner.failedToThrow=function(testsSoFar, description)
{
   testsSoFar.push({Expected: 'throw', Actual: 'return', Description: description});
};
/**Used to run every test in a suite.
This function does the same thing as clearResults and calls TestRunner._generateResultTable.
The main loop enumerates over the testSuite object given and calls each function.
The loop is deep and all properties that are objects will also be enumerated over.
It will call testConfig.beforeFirst (if it is defined) before the first test. This can be used to setup mocks.
It will call testConfig.betweenEach (if it is defined) between each test. This can be used to reset state.
It will call testConfig.afterLast (if it is defined) after the last test and TestRunner._processResults.
This can be used to teardown mocks (including deleting equals functions).
If the called test function throws, TestRunner.testAll will catch it and display the list of errors when finished.
if(DOM exists) everything is written to #testResults then it updates location.hash to scroll to it.
@param {object} testSuite an object that contains every test to be run. defaults to TestSuite
@param {object} testConfig an object (defaults to TestConfig) that contains:
   {function} beforeFirst if defined it will be called before the first test
   {function} betweenEach if defined it will be called between each test
   {function} afterLast if defined it will be called after the last test and TestRunner._processResults
   {number} defaultDelta passed to TestRunner._findFirstFailurePath
   {boolean} hidePassed defaults to true and is passed to TestRunner._generateResultTable
@returns {object} a promise of a json object of test results (also has a toString)
*/
TestRunner.testAll=function(testSuite, testConfig)
{
   var testState = {_startTime: Date.now(), runningSingleTest: false}, testResults;
   if (_hasDom)
   {
      testResults = document.getElementById('testResults');
      if(null !== testResults) testResults.value = '';
   }

   //testSuite and testConfig defaults can't be self tested
   if(undefined === testSuite) testSuite = TestSuite;
   testState.config = TestRunner._defaultConfigValues(testConfig, true);

   //TestSuite is quoted so that it looks the same as the rest.
   //Always start with this because I don't any other name.
   var suiteCollection = [{breadcrumb: '"TestSuite"', object: testSuite}], unprocessedList = [], runBetweenEach = false;
   testState.config.beforeFirst();
   while (0 !== suiteCollection.length)
   {
      var thisHistory = suiteCollection.shift();
      testSuite = thisHistory.object;
      for (var key in testSuite)
      {
         if(!testSuite.hasOwnProperty(key)) continue;  //"for in" loops are always risky and therefore require sanitizing
         var thisPath = thisHistory.breadcrumb + '.' + JSON.stringify(key);
         if('object' === typeof(testSuite[key]) && null !== testSuite[key])
         {
            //null is a jerk: typeof erroneously returns 'object' (null isn't an object because it doesn't inherit Object.prototype)
            suiteCollection.push({breadcrumb: thisPath, object: testSuite[key]});
         }
         else if ('function' === typeof(testSuite[key]))
         {
            if(runBetweenEach) testState.config.betweenEach();
            else runBetweenEach = true;
            try
            {
               var testReturnValue = testSuite[key](testState);
               if (testReturnValue instanceof Promise)
               {
                  (function(copyOfThisPath){
                     unprocessedList.push(testReturnValue
                        .then(function(value){return {status: 'resolved', value: value}})
                        //logging will be done later for errors
                        .catch(function(errorCaught){return {status: 'rejected', value: {Error: errorCaught, Description: copyOfThisPath}}})
                     );
                  })(thisPath);
               }
               else unprocessedList.push({status: 'resolved', value: testReturnValue});
            }
            catch (errorCaught)
            {
               //when a non-async test throws
               //logging will be done later
               unprocessedList.push({status: 'rejected', value: {Error: errorCaught, Description: thisPath}});
            }
         }
      }
   }
   //javascript:TestRunner.testAll(); link won't override the page if it returns a promise
   return Promise.all(unprocessedList)
   .then(function(promiseResults)
   {
      var errorTests = [], resolvedTests = [];
      for (var i=0; i < promiseResults.length; ++i)
      {
         if('resolved' === promiseResults[i].status) resolvedTests.push(promiseResults[i].value);
         else errorTests.push(promiseResults[i].value);
      }
      if(0 !== errorTests.length) resolvedTests.push({name: 'TestRunner.testAll', assertions: errorTests});

      var output = TestRunner._processResults(resolvedTests, testState);
      //afterLast should be run after TestRunner._processResults so that equals functions could be removed
      testState.config.afterLast();

      if (_hasDom)
      {
         testResults = document.getElementById('testResults');
         if (null !== testResults)
         {
            testResults.value = output.toString();
            location.hash = '#testResults';  //scroll to the results
         }
      }
      return output;
   })
   .catch(function(problem)
   {
      //when runner throws (shouldn't) or equals throws
      var message = 'Test runner failed. Did an equals function throw?';
      //TODO: have a mock logger (3 places) for self-testing
      console.error(message, problem);
      if (_hasDom)
      {
         testResults = document.getElementById('testResults');
         if (null !== testResults)
         {
            testResults.value = message + '\n' + problem.toString();
            location.hash = '#testResults';  //scroll to the results
         }
      }
   });
};
/**@returns {object} a config with all values defined*/
TestRunner._defaultConfigValues=function(testConfig, hidePassedDefaultValue)
{
   if(undefined === testConfig) testConfig = TestConfig;
   if(undefined === testConfig.beforeFirst || undefined === testConfig.betweenEach
      || undefined === testConfig.afterLast || undefined === testConfig.defaultDelta
      || (undefined === testConfig.hidePassed && undefined !== hidePassedDefaultValue))
   {
      //copy testConfig object so that I don't modify the one passed in
      testConfig = {beforeFirst: testConfig.beforeFirst, betweenEach: testConfig.betweenEach, afterLast: testConfig.afterLast,
         defaultDelta: testConfig.defaultDelta, hidePassed: testConfig.hidePassed};
      var noOp = Function.prototype;
      if(undefined === testConfig.beforeFirst) testConfig.beforeFirst = noOp;
      if(undefined === testConfig.betweenEach) testConfig.betweenEach = noOp;
      if(undefined === testConfig.afterLast) testConfig.afterLast = noOp;
      if(undefined === testConfig.defaultDelta) testConfig.defaultDelta = 0;
      if(undefined === testConfig.hidePassed) testConfig.hidePassed = hidePassedDefaultValue;
   }
   return testConfig;
};
/**Returns the path to the first (in no particular order) element in Expected that doesn't equal Actual (or return if there's an Error).
If Expected.equals is a function then it will use the result of Expected.equals(Actual) without any other checks.
Functions must be the same object for equality in this case, if you want to compare the sources call toString.
hasOwnProperty is not used: all enumerable properties must match.
NaN is equal to NaN.

If Expected and Actual are both numbers (or Dates) then testResult.Delta can also be specified (it must be a number).
Delta is the maximum number that they are allowed to differ by to be considered equal (eg 1 and 2 are equal if delta is 1).
If Delta is not specified it will default to defaultDelta.
Delta also applies to Dates which is useful if you'd like to ignore seconds for example.
@returns {?string} the path to the non-matching element. empty string if the problem is on the root. undefined if the test passes*/
TestRunner._findFirstFailurePath=function(testResult, defaultDelta)
{
   if(undefined !== testResult.Error) return '';

   var delta = testResult.Delta;
   if(undefined === delta) delta = defaultDelta;
   if(undefined === delta) delta = TestConfig.defaultDelta;
   if('number' !== typeof(delta) || !isFinite(delta)) throw new Error('Test error: illegal delta: ' + delta);

   var remainingComparisons = [{Expected: testResult.Expected, Actual: testResult.Actual, Path: ''}];
   while (remainingComparisons.length > 0)
   {
      var thisComparison = remainingComparisons.pop();  //order doesn't matter
      var shallowResult = TestRunner._shallowEquality(thisComparison.Expected, thisComparison.Actual, delta);
      if(false === shallowResult) return thisComparison.Path;
      if (undefined === shallowResult)
      {
         //in addition to being a fast path, checking the key count makes sure Actual doesn't have more keys
         if(Object.keys(thisComparison.Expected).length !== Object.keys(thisComparison.Actual).length) return thisComparison.Path;
         for (var key in thisComparison.Expected)  //works for both objects and arrays
         {
             var newPath = thisComparison.Path + '.' + JSON.stringify(key);
             if('.' === newPath[0]) newPath = newPath.substring(1);  //only possible if thisComparison.Path is empty. remove the leading .

             //if(!thisComparison.Expected.hasOwnProperty(key)) continue;  //intentionally not used: all enumerable properties must match
             if(!(key in thisComparison.Actual)) return newPath;  //prevents edge case (see test) of key existing undefined vs not existing
             remainingComparisons.push({Expected: thisComparison.Expected[key], Actual: thisComparison.Actual[key], Path: newPath});
         }
      }
      //else (shallowResult === true): ignore it
   }

   //all leaves have a shallow equality of true to reach this point
   return undefined;
};
/**
@param {number} millisecondsTaken time taken in milliseconds
@returns {string} a string stating the number of seconds (to 3 decimal places) and the number of minutes if applicable
*/
TestRunner._formatTestTime=function(millisecondsTaken)
{
   //I could use new Date(diff).getUTCMilliseconds etc but that wouldn't give me everything above minutes as minutes
   var seconds = (millisecondsTaken / 1000);
   var minutes = Math.floor(seconds / 60);
   seconds -= (minutes * 60);
   //Chrome kills js after 30 seconds so minutes are likely not possible in a browser
   //tests shouldn't take minutes so the units stop at minutes

   if(0 === minutes) return '' + seconds.toFixed(3) +' seconds';
   return '' + minutes + ' minutes and ' + seconds.toFixed(3) +' seconds';
   //yes I know that it would display "1 minutes" etc. so change it if you care so much
};
/**@returns {string} to display the value given*/
TestRunner._formatValueToString=function(input)
{
   //typeof is to catch Infinity/NaN, instanceof is if they are boxed
   if ('number' === typeof(input) || input instanceof Number) return input.toString();

   //these would be 'undefined' if sent to JSON
   if ('symbol' === typeof(input)
      || input instanceof RegExp || input instanceof Function) return input.toString();

   //the ''+ is so that undefined turns into a string
   return '' + JSON.stringify(input);
};
/**This function creates a string table used to display the test results of a suite.
@param {object} resultJson the output of TestRunner._processResults
@returns {string} the a formatted string result*/
TestRunner._generateResultTable=function(resultJson)
{
   var indentation = '   ';  //3 spaces
   var output = '';
   for (var tableIndex = 0; tableIndex < resultJson.tests.length; ++tableIndex)
   {
      var tableBody = '';
      var thisTable = resultJson.tests[tableIndex];
      output += '' + thisTable.passCount + '/' + thisTable.total + ': ' + thisTable.name + '\n';
      for (var testIndex = 0; testIndex < thisTable.assertions.length; ++testIndex)
      {
         var thisResult = thisTable.assertions[testIndex];
         if ('Pass' === thisResult.Outcome)  //thisResult wouldn't exist if config hidePassed
         {
            tableBody += indentation + 'Pass: ' + thisResult.Description + '\n';
         }
         else
         {
            tableBody += indentation + 'Fail: ' + thisResult.Description + '\n';
            if ('Error' === thisResult.Outcome)
            {
               console.log(thisResult.Description, thisResult.Error);  //failPath is always '' so don't log it
               tableBody += indentation + indentation + 'Error: ' + thisResult.Error + '\n';
            }
            else
            {
               console.log(thisResult.Description, 'expected:', thisResult.Expected,
                  'actual:', thisResult.Actual, 'location:', thisResult.FailPath);
               tableBody += indentation + indentation + 'Expected: ' + TestRunner._formatValueToString(thisResult.Expected) + '\n';
               tableBody += indentation + indentation + '  Actual: ' + TestRunner._formatValueToString(thisResult.Actual) + '\n';
               //failPath isn't useful when looking at the toString so don't include in tableBody
               //TODO: have: Path: a.b Exp: 4 Act: 2
            }
         }
      }
      output += tableBody;
   }
   if('' !== output) output += '\n';
   output += 'Grand total: ' + resultJson.passCount + '/' +  resultJson.total + '\n';
   output += 'Time taken: ' + TestRunner._formatTestTime(resultJson.duration) + '\n';
   return output;
};
/**@returns {boolean} true if the input should be compared via === when determining equality*/
TestRunner._isPrimitive=function(input)
{
   var inputType = typeof(input);
   return ('boolean' === inputType || 'number' === inputType || 'string' === inputType
      || 'function' === inputType || 'symbol' === inputType || undefined === input || null === input);
   //TestRunner._shallowEquality doesn't reach the undefined and null cases
};
/**This function creates a json table (with a toString) which are the processed outcome of suiteResults.
Pass and fail counts are counted and added to the grand total.
Note that the totals will not match array lengths when testConfig.hidePassed (and an assertion passes)
@param {object[]} suiteResults an array of assertions which contains an array of assertions
@param {object} testState with _startTime and config properties:
{boolean} hidePassed if false then the assertions within a table that pass won't display (returns only grand total if all pass)
{number} defaultDelta passed to TestRunner._findFirstFailurePath
@returns {object} the processed results. Will include Outcomes and counts. if(hidePassed) will not include assertions that pass.*/
TestRunner._processResults=function(suiteResults, testState)
{
   var testConfig = testState.config;
   var output = {tests: [], passCount: 0, total: 0};
   if(true !== testConfig.hidePassed && false !== testConfig.hidePassed)
      throw new Error('Test error: illegal testConfig.hidePassed: ' + testConfig.hidePassed);
   for (var testIndex = 0; testIndex < suiteResults.length; ++testIndex)
   {
      var passCount = 0, outputAssertions = [];
      var thisTest = suiteResults[testIndex];
      for (var assertionIndex = 0; assertionIndex < thisTest.assertions.length; ++assertionIndex)
      {
         var thisAssertion = thisTest.assertions[assertionIndex];
         var failPath = TestRunner._findFirstFailurePath(thisAssertion, testConfig.defaultDelta);
         if (undefined === failPath)
         {
            ++passCount;
            if (!testConfig.hidePassed)
            {
               thisAssertion.Outcome = 'Pass';
               outputAssertions.push(thisAssertion);
            }
         }
         else if (undefined !== thisAssertion.Error)
         {
            thisAssertion.Outcome = 'Error';
            //failPath is always '' so don't bother including it
            outputAssertions.push(thisAssertion);
         }
         else
         {
            thisAssertion.Outcome = 'Fail';
            thisAssertion.FailPath = failPath;
            outputAssertions.push(thisAssertion);
         }
      }
      if (!testConfig.hidePassed || thisTest.assertions.length !== passCount)
      {
         output.tests.push({
            passCount: passCount,
            total: thisTest.assertions.length,
            name: thisTest.name,
            assertions: outputAssertions
         });
      }
      output.passCount += passCount;
      output.total += thisTest.assertions.length;
   }
   testState._endTime = Date.now();
   output.startTime = testState._startTime;
   output.endTime = testState._endTime;
   output.duration = (testState._endTime - testState._startTime);
   output.toString=function(){return TestRunner._generateResultTable(this);};
   return output;
};
/**Used internally by TestRunner._findFirstFailurePath. Don't call this directly (delta isn't validated).
@returns {?boolean} true or false based on a shallow equality check or undefined if a deep equality is required.*/
TestRunner._shallowEquality=function(expected, actual, delta)
{
   //equals is checked first so that clients can change any equality including expected matching a different type
   //null instanceof Object is false
   if(expected instanceof Object && typeof(expected.equals) === 'function') return expected.equals(actual);

   //TODO: what about Object.is()? https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness
   //TODO: add a looseEquality flag:
   /*
   if(looseEqualityMatch && expected == actual) return true;
   if(!looseEqualityMatch && typeof(expected) !== typeof(actual)) return false;  //testing is type strict
   */
   if(typeof(expected) !== typeof(actual)) return false;  //testing is type strict

   if(null === expected) return (null === actual);  //typeof(null) === 'object' this is to avoid that mess
   if(null === actual) return false;
   if('object' === typeof(expected) && expected.constructor !== actual.constructor) return false;

   if (TestRunner._useValueOf(expected))
   {
      //unboxing is intentionally after the type check (in case of box vs primitive)
      expected = expected.valueOf();
      actual = actual.valueOf();
   }

   //undefined has it's own type so it will return true here or false above
   if(expected === actual) return true;  //base case. if this is true no need to get more advanced

   if (TestRunner._isPrimitive(expected))  //Dates have already been converted to numbers so that they can also use delta
   {
      if(typeof(expected) !== 'number') return false;  //equality was denied at base case
      if(isNaN(expected) && isNaN(actual)) return true;
         //NaN is a jerk: NaN === NaN erroneously returns false (x === x is a tautology. the reason the standard returns false no longer applies)

      return Math.abs(expected - actual) <= delta;  //returns false if expected or actual is NaN
         //numbers are immutable. they are kept the same for the sake of display
   }

   if (expected instanceof Error)
   {
      //constructor has already been compared
      //the assertions are for simplicity since you should never do them anyway
      if(typeof(expected.message) !== 'string' && typeof(expected.message) !== 'undefined')
         throw new Error('Assertion Error: expected.message is ' + expected.message);
      if(typeof(expected.description) !== 'string' && typeof(expected.description) !== 'undefined')
         throw new Error('Assertion Error: expected.description is ' + expected.description);

      if(expected.message !== actual.message) return false;  //defined in Error
      if(expected.description !== actual.description) return false;  //for IE. same as message
      //ignore these: stack, fileName, lineNumber, columnNumber
      return true;
   }

   if (expected instanceof RegExp)
   {
      //constructor has already been compared. and already null-safe
      return (expected.toString() === actual.toString());
      //toSting accounts for both source and flags
      //ignore: lastIndex
   }

   return undefined;  //it comes here for arrays and all custom objects
};
/**@returns {boolean} true if the input should be compared via .valueOf when determining equality*/
TestRunner._useValueOf=function(input)
{
   return (input instanceof Boolean || input instanceof Number || input instanceof String
      || input instanceof Date);
   //although RegExp has a valueOf it returns an object so it is pointless to call
   //typeof(new Function()) === 'function' and any subclass would need to have equals
};
})();

/**beforeFirst and afterLast are called by TestRunner.testAll (see doc there) and by running a single test.
betweenEach is only called by TestRunner.testAll (see doc there).
In order to get a beforeEach assign beforeFirst and betweenEach to the same function (or have them call the same function).
The same is possible for a afterEach.
TestRunner doesn't call functions named beforeEach and afterEach because the order compared to betweenEach would be confusing.
defaultDelta: 0 requires an exact match. To handle imprecise decimals use TestConfig.defaultDelta = Number.EPSILON;
hidePassed: undefined means that it will hide them during TestRunner.testAll but not when running a single test.*/
var TestConfig = {beforeFirst: Function.prototype, betweenEach: Function.prototype, afterLast: Function.prototype,
   defaultDelta: 0, hidePassed: undefined};
var TestSuite = {};

/*example:
TestSuite.abilityList = {};
//TestConfig does not need to be changed from defaults
TestSuite.abilityList.calculateValues=function(testState={})  //all tests must default testState in order to run alone and via testAll
//if your javascript doesn't allow defaulting testState then you'll have to pass in {} when calling the function directly
{
   TestRunner.clearResults(testState);  //all tests must start by calling clearResults in order to run alone
   var assertions=[];

   assertions.push({Expected: NaN, Actual: Math.factorial('Not a number'), Description: 'Math.factorial when passed NaN'});
   //A basic assertion that assumes no error will be thrown. Easy to do but not as useful.

   try{
      var element = document.getElementById('input');
      element.value = 5;
      element.onchange();
      assertions.push({Expected: 5, Actual: document.getElementById('output').value, Description: 'input is copied over on change'});
   } catch(e){assertions.push({Error: e, Description: 'input is copied over on change'});}
   //not expecting an error to be thrown but it was. fail instead of crashing

   try{
      Validator.nonNull(null);
      TestRunner.failedToThrow(assertions, 'Validator.nonNull did not throw given null.');
   }
   catch(actualError)
   {
      assertions.push({Expected: new TypeError('Illegal argument: object can\'t be null.'), Actual: actualError,
         Description: 'Validator.nonNull threw the correct type and message.'});
   }

   //be sure to give the test a name here:
   return TestRunner.displayResults('TestSuite.abilityList.calculateValues', assertions, testState);
   //all tests must end by returning displayResults in order to run alone and via testAll
};
TestSuite.abilityList.unfinishedTest=function(testState={})
{
   TestRunner.clearResults(testState);
   var assertions=[];

   //Tests that have 0 assertions do nothing.
   //This can be used to display the name to show there are no tests (if TestConfig.hidePassed=false)

   //be sure to copy the name here:
   return TestRunner.displayResults('TestSuite.abilityList.unfinishedTest', assertions, testState);
};
*/
