'use strict';
/*
Terms:
'suite': an object that contains any number of tests and suites
'test': a function (generally defined under the TestSuite object) that creates assertions
'assertion': an object with Expected/Actual (or Error), if it has an Outcome then it has already been determined if it passes

This test runner currently doesn't support asynchronous test execution
If you have a DOM element textarea#testResults that will have the results put in it
   if you don't have that DOM then the json results will be returned instead
*/

//TODO: allow asynchronous: Promise.all (if exists). betweenEach redundantly called. see branch
const TestRunner = {};
(function(){
/**This is a private global because the value doesn't change.*/
const _hasDom = (typeof window === 'object' && undefined !== window.document);

/**Given the DOM's id this function sets the value property equal to valueToSet then calls onchange.
No validation is done so if the id is not found it will throw an error.
It will also throw if there is no onchange defined (instead just set .value directly).*/
TestRunner.changeValue=function(elementId, valueToSet)
{
   var element = document.getElementById(elementId);
   element.value = valueToSet;
   element.onchange();
};
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
      testState.config = _sanitizeConfig(testState.config);
      testState.config.beforeFirst();
   }
};
/**if(testState.runningSingleTest) This function clears out then writes the test results to #testResults and scrolls to it.
It will call testState.config.afterLast (if it is defined) which can be used to teardown mocks.
@param {string} name the display name of the test
@param {array} assertions an array of assertions created by the test
@param {object} testState testState.config.hidePassed defaults to false
@returns {object} if(!testState.runningSingleTest) return object that can be used by TestRunner.processResults
   which is used by TestRunner.testAll.
   else return a json object of test results*/
TestRunner.displayResults=function(name, assertions, testState)
{
   var input = {name: name, assertions: assertions};
   if(undefined === testState) testState = {runningSingleTest: true};
   if (false !== testState.runningSingleTest)
   {
      testState.config = _sanitizeConfig(testState.config, false);
      var output = TestRunner.processResults([input], testState);
      //afterLast should be run after processResults so that equals functions could be removed
      testState.config.afterLast();
      if (_hasDom)
      {
         var testResults = document.getElementById('testResults');
         if (null !== testResults)
         {
            testResults.value = output.toString();
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
/**Returns the path to the first (in no particular order) element in Expected that doesn't equal Actual (or return if there's an Error).
If Expected and Actual are both (non-null) objects and Expected.equals is a function then it will use the result of Expected.equals(Actual).
Functions must be the same object for equality in this case, if you want to compare the sources call toString.
hasOwnProperty is not used: all enumerable properties must match.
NaN is equal to NaN.

If Expected and Actual are both numbers (or Dates) then testResult.Delta can also be specified (it must be a number).
Delta is the maximum number that they are allowed to differ by to be considered equal (eg 1 and 2 are equal if delta is 1).
If Delta is not specified it will default to defaultDelta.
Delta also applies to Dates which is useful if you'd like to ignore seconds for example.
@returns {?string} the path to the non-matching element. empty string if the problem is on the root. undefined if the test passes*/
TestRunner.findFirstFailurePath=function(testResult, defaultDelta)
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
TestRunner.formatTestTime=function(millisecondsTaken)
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
/**This function creates a string table used to display the test results of a suite.
@param {object} resultJson the output of TestRunner.processResults
@returns {string} the a formatted string result*/
TestRunner.generateResultTable=function(resultJson)
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
               tableBody += indentation + indentation + 'Expected: ' + thisResult.Expected + '\n';
               tableBody += indentation + indentation + 'Actual: ' + thisResult.Actual + '\n';
               //failPath isn't useful when looking at the toString so don't include in tableBody
               //TODO: have: Path: a.b Exp: 4 Act: 2
            }
         }
      }
      output += tableBody;
   }
   if('' !== output) output += '\n';
   output += 'Grand total: ' + resultJson.passCount + '/' +  resultJson.total + '\n';
   output += 'Time taken: ' + TestRunner.formatTestTime(resultJson.duration) + '\n';
   return output;
};
/**This function creates a json table which are the processed outcome of suiteResults.
Pass and fail counts are counted and added to the grand total.
Note that the totals will not match array lengths when testConfig.hidePassed (and an assertion passes)
@param {object[]} suiteResults an array of testResults which contains an array of assertions
@param {object} testState with _startTime and config properties:
{boolean} hidePassed if false then the assertions within a table that pass won't display (returns only grand total if all pass)
{number} defaultDelta passed to TestRunner.findFirstFailurePath
@returns {object} the processed results. Will include Outcomes and counts. if(hidePassed) will not include assertions that pass.*/
TestRunner.processResults=function(suiteResults, testState)
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
         var failPath = TestRunner.findFirstFailurePath(thisAssertion, testConfig.defaultDelta);
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
   output.toString=function(){return TestRunner.generateResultTable(this);};
   return output;
};
/**@returns {boolean} true if the input should be compared via === when determining equality*/
TestRunner.isPrimitive=function(input)
{
   var inputType = typeof(input);
   return ('boolean' === inputType || 'number' === inputType || 'string' === inputType
      || 'function' === inputType || 'symbol' === inputType || undefined === input || null === input);
   //TestRunner._shallowEquality doesn't reach the undefined and null cases
};
/**Used to run every test in a suite. This function is assumed to run alone.
This function calls clears the results and calls TestRunner.generateResultTable.
The main loop enumerates over the testSuite object given and calls each function.
The loop is deep and all properties that are objects will also be enumerated over.
It will call testConfig.beforeFirst (if it is defined) before the first test. This can be used to setup mocks.
It will call testConfig.betweenEach (if it is defined) between each test. This can be used to reset state.
It will call testConfig.afterLast (if it is defined) after the last test. This can be used to teardown mocks.
If the called test function throws, TestRunner.testAll will catch it and display the list of errors when finished
(and will also send the stack to console.error).
The total time taken is displayed.
if(DOM exists) everything is written to #testResults then it scrolls to it
else returns string of test results
@param {object} testSuite an object that contains every test to be run. defaults to TestSuite
@param {object} testConfig an object (defaults to TestConfig) that contains:
   {function} betweenEach if defined it will be called between each test
   {number} defaultDelta passed to TestRunner.findFirstFailurePath
   {boolean} hidePassed defaults to true and is passed to TestRunner.generateResultTable
@returns {object} a json object of test results
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
   testState.config = _sanitizeConfig(testConfig, true);

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
                  //TODO: self-test if possible
                  //TODO: update dice, time, async, time
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
   //TODO: update doc
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

      var output = TestRunner.processResults(resolvedTests, testState);
      //afterLast should be run after processResults so that equals functions could be removed
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
      //TODO: self-test if possible (by an equals throw)
      //TODO: bug? equals isn't called if diff types and other cases
      var message = 'Test runner failed. Did an equals function throw?';
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
/**@returns {boolean} true if the input should be compared via .valueOf when determining equality*/
TestRunner.useValueOf=function(input)
{
   return (input instanceof Boolean || input instanceof Number || input instanceof String
      || input instanceof Date);
      //although RegExp has a valueOf it returns an object so it is pointless to call
      //typeof(new Function()) === 'function' and any subclass would need to have equals
};
function _sanitizeConfig(testConfig, hidePassed)
{
   if(undefined === testConfig) testConfig = TestConfig;
   if(undefined === testConfig.beforeFirst || undefined === testConfig.betweenEach
      || undefined === testConfig.afterLast || undefined === testConfig.defaultDelta
      || (undefined === testConfig.hidePassed && undefined !== hidePassed))
   {
      testConfig = {beforeFirst: testConfig.beforeFirst, betweenEach: testConfig.betweenEach, afterLast: testConfig.afterLast,
         defaultDelta: testConfig.defaultDelta, hidePassed: testConfig.hidePassed};
      var noOp = Function.prototype;
      if(undefined === testConfig.beforeFirst) testConfig.beforeFirst = noOp;
      if(undefined === testConfig.betweenEach) testConfig.betweenEach = noOp;
      if(undefined === testConfig.afterLast) testConfig.afterLast = noOp;
      if(undefined === testConfig.defaultDelta) testConfig.defaultDelta = 0;
      if(undefined === testConfig.hidePassed) testConfig.hidePassed = hidePassed;
   }
   return testConfig;
}
/**Used internally by TestRunner.findFirstFailurePath. Don't call this directly (delta isn't validated).
@returns {?boolean} true or false based on a shallow equality check or undefined if a deep equality is required.*/
TestRunner._shallowEquality=function(expected, actual, delta)
{
   if(typeof(expected) !== typeof(actual)) return false;  //testing is type strict

   if(null === expected) return (null === actual);  //typeof(null) === 'object' this is to avoid that mess
   if(null === actual) return false;
   if('object' === typeof(expected) && expected.constructor !== actual.constructor) return false;

   if (TestRunner.useValueOf(expected))
   {
      //unboxing is intentionally after the type check (in case of box and primitive)
      expected = expected.valueOf();
      actual = actual.valueOf();
   }

   //undefined has it's own type so it will return true here or false above
   if(expected === actual) return true;  //base case. if this is true no need to get more advanced

   if (TestRunner.isPrimitive(expected))  //Dates have already been converted to numbers so that they can also use delta
   {
      if(typeof(expected) !== 'number') return false;  //equality was denied at base case
      if(isNaN(expected) && isNaN(actual)) return true;
         //NaN is a jerk: NaN === NaN erroneously returns false (x === x is a tautology. the reason the standard returns false no longer applies)

      return Math.abs(expected - actual) <= delta;  //returns false if expected or actual is NaN
         //numbers are immutable. they are kept the same for the sake of display
   }

   if(expected instanceof Object && typeof(expected.equals) === 'function') return expected.equals(actual);

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
})();
Object.freeze(TestRunner);

/*
Comparing delta to Jasmine:
delta is safer than what Jasmine did: https://github.com/jasmine/jasmine/blob/master/src/core/matchers/toBeCloseTo.js
   var pow = Math.pow(10, precision + 1);
   var delta = Math.abs(expected - actual);
   var maxDelta = Math.pow(10, -precision) / 2;
   return (Math.round(delta * pow) / pow <= maxDelta)
although I can't prove that it's wrong.
Either way delta works for deep matches not just top level asserts like Jasmine does.
*/
/**beforeFirst and afterLast are called by TestRunner.testAll (see doc there) and by running a single test.
betweenEach is only called by TestRunner.testAll (see doc there).
defaultDelta: 0 requires an exact match. To handle imprecise decimals use TestConfig.defaultDelta = Number.EPSILON;
hidePassed: undefined means that it will hide them during TestRunner.testAll but not when running a single test.*/
var TestConfig = {beforeFirst: Function.prototype, betweenEach: Function.prototype, afterLast: Function.prototype, defaultDelta: 0, hidePassed: undefined};
var TestSuite = {};

/*example:
TestSuite.abilityList = {};
//TestConfig does not need to be changed from defaults
TestSuite.abilityList.calculateValues=function(testState={})
{
   TestRunner.clearResults(testState);
   var assertions=[];

   assertions.push({Expected: NaN, Actual: Math.factorial('Not a number'), Description: 'Math.factorial when passed NaN'});
   //A basic assertion that assumes no error will be thrown. Easy to do but not as useful.

   try{
      TestRunner.changeValue('input', 5);
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
