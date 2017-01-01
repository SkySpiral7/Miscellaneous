//Note that throughout this file the word 'suite' means an object that contains any number of test cases and suites
'use strict';

const TestRunner = {};
(function(){
var startTime, endTime;  //private state to avoid pollution and user tampering
/**Given the DOM's id this function sets the value property equal to valueToSet then calls onchange.
No validation is done so if the id is not found it will throw an error.
It will also throw if there is no onchange defined (instead just set .value directly).*/
TestRunner.changeValue=function(elementID, valueToSet)
{
   var element = document.getElementById(elementID);
   element.value = valueToSet;
   element.onchange();
};
/**Will do nothing if isFirst is false (strict). else this function will clear the testing area and start the timer.*/
TestRunner.clearResults=function(isFirst)
{
   if (false !== isFirst)
   {
      document.getElementById('testResults').value = '';
      startTime = Date.now();
   }
};
/**if(isFirst) This function clears out then writes the test results to the "testResults" text area and scrolls to it.
@param {object} testConfig hidePassed defaults to false. if(!isFirst) ignored else it is passed to TestRunner.generateResultTable
@returns {object} that can be used by TestRunner.generateResultTable which is used by TestRunner.testAll.*/
TestRunner.displayResults=function(tableName, testResults, isFirst, testConfig)
{
   if(false !== isFirst) isFirst = true;
   var input = {tableName: tableName, testResults: testResults};
   if (isFirst)
   {
      if(undefined === testConfig) testConfig = {hidePassed: false};
      else if(undefined === testConfig.hidePassed) testConfig = {defaultDelta: testConfig.defaultDelta, hidePassed: false};
         //new object to avoid mutating the user's config
      var output = TestRunner.generateResultTable([input], testConfig);  //TODO: add checkbox for hide pass
      endTime = Date.now();
      output += 'Time taken: ' + TestRunner.formatTestTime(startTime, endTime) + '\n';
      document.getElementById('testResults').value = output;
      location.hash = '#testResults';  //scroll to the results
   }
   return input;
};
/**Returns true if testResult.Expected === testResult.Actual, however this also returns true if both are equal to NaN.
If Expected and Actual are both (non-null) objects and Expected.equals is a function then it will return the result of Expected.equals(Actual).
Functions must be the same object for equality in this case, if you want to compare the sources call toString.

If Expected and Actual are both numbers then testResult.Delta can also be specified (it must be a number).
Delta is the maximum number that numbers are allowed to differ by to be considered equal (eg 1 and 2 are equal if delta is 1).
If Delta is not specified it will default to defaultDelta.
Delta also applies to Dates which is useful if you'd like to ignore seconds for example.
@returns {boolean}*/
TestRunner.doesTestPass=function(testResult, defaultDelta)
{
   if(undefined !== testResult.Error) return false;

   var delta = testResult.Delta;
   if(undefined === delta) delta = defaultDelta;
   if(undefined === delta) delta = TestConfig.defaultDelta;
   if('number' !== typeof(delta) || !isFinite(delta)) throw new Error('Test error: illegal delta: ' + delta);

   var remainingComparisons = [{Expected: testResult.Expected, Actual: testResult.Actual}];
   while (remainingComparisons.length > 0)
   {
      var thisComparison = remainingComparisons.pop();  //order doesn't matter
      var shallowResult = TestRunner._shallowEquality(thisComparison.Expected, thisComparison.Actual, delta);
      if(false === shallowResult) return false;
      if (undefined === shallowResult)
      {
         //in addition to being a fast path, checking the key count makes sure Actual doesn't have more keys
         if(Object.keys(thisComparison.Expected).length !== Object.keys(thisComparison.Actual).length) return false;
         for (var key in thisComparison.Expected)  //works for both objects and arrays
         {
             //if(!thisComparison.Expected.hasOwnProperty(key)) continue;  //intentionally not used: all enumerated properties must match
             if(!(key in thisComparison.Actual)) return false;  //prevents edge case (see test) of key existing undefined vs not existing
             remainingComparisons.push({Expected: thisComparison.Expected[key], Actual: thisComparison.Actual[key]});
         }
      }
      //else (shallowResult === true): ignore it
   }

   //all leaves have a shallow equality of true to reach this point
   return true;
};
/**This is a simple way to fail when a test was expected to throw but didn't.*/
TestRunner.failedToThrow=function(testsSoFar, description)
{
    testsSoFar.push({Expected: 'throw', Actual: 'return', Description: description});
};
/*
@param {number or Date} startTimeParam date in milliseconds
@param {number or Date} endTimeParam date in milliseconds
@returns {string} a string stating the number of seconds (to 3 decimal places) and the number of minutes if applicable
*/
TestRunner.formatTestTime=function(startTimeParam, endTimeParam)
{
   //I could use new Date(diff).getUTCMilliseconds etc but that wouldn't give me everything above minutes as minutes
   var milliseconds = (endTimeParam - startTimeParam);
   var seconds = (milliseconds / 1000);
   var minutes = Math.floor(seconds / 60);
   seconds -= (minutes * 60);
   //Chrome kills js after 30 seconds so minutes are likely not possible in a browser
   //tests shouldn't take minutes so the units stop at minutes

   if(0 === minutes) return '' + seconds.toFixed(3) +' seconds';
   return '' + minutes + ' minutes and ' + seconds.toFixed(3) +' seconds';
   //yes I know that it would display "1 minutes" etc. so change it if you care so much
};
/**This function creates the (text) table used to display the test results of a suite.
Pass and fail counts are counted and added to the grand total and displayed.
@param {object[][]} suiteResults each assertion for the test suite
@param {object} testConfig with properties:
   {boolean} hidePassed if false then the assertions within a table that pass won't display (returns only grand total if all pass)
   {number} defaultDelta passed to TestRunner.doesTestPass
@returns {string} the a formatted string result*/
TestRunner.generateResultTable=function(suiteResults, testConfig)
{
   var output = '', suitePassCount = 0, suiteTotalCount = 0;
   if(true !== testConfig.hidePassed && false !== testConfig.hidePassed)
      throw new Error('Test error: illegal testConfig.hidePassed: ' + testConfig.hidePassed);
   for (var tableIndex = 0; tableIndex < suiteResults.length; ++tableIndex)
   {
      var tablePassCount = 0, tableBody = '';
      var testResults = suiteResults[tableIndex].testResults;
      for (var testIndex = 0; testIndex < testResults.length; ++testIndex)
      {
         if (TestRunner.doesTestPass(testResults[testIndex], testConfig.defaultDelta))
         {
            ++tablePassCount;
            if(!testConfig.hidePassed) tableBody += '   Pass: ' + testResults[testIndex].Description + '\n';
         }
         else
         {
            tableBody += '   Fail: ' + testResults[testIndex].Description + '\n';
            if (undefined !== testResults[testIndex].Error)
            {
               console.log(testResults[testIndex].Description, testResults[testIndex].Error);
               tableBody += '      Error: ' + testResults[testIndex].Error + '\n';
            }
            else
            {
               console.log(testResults[testIndex].Description, 'expected:', testResults[testIndex].Expected,
                  'actual:', testResults[testIndex].Actual);
               tableBody += '      Expected: ' + testResults[testIndex].Expected + '\n' +
                  '      Actual: ' + testResults[testIndex].Actual + '\n';
            }
         }
      }
      if (!testConfig.hidePassed || testResults.length !== tablePassCount)
      {
         var tableHeader = '' + tablePassCount + '/' + testResults.length + ': ' + suiteResults[tableIndex].tableName + '\n';
         output += tableHeader + tableBody;
      }
      suitePassCount += tablePassCount;
      suiteTotalCount += testResults.length;
   }
   if('' !== output) output += '\n';
   output += 'Grand total: ' + suitePassCount + '/' +  suiteTotalCount + '\n';
   return output;
};
/**@returns true if the input should be compared via === when determining equality*/
TestRunner.isPrimitive=function(input)
{
   var inputType = typeof(input);
   return ('boolean' === inputType || 'number' === inputType || 'string' === inputType
      || 'function' === inputType || 'symbol' === inputType || undefined === input || null === input);
   //TestRunner.doesTestPass doesn't reach the undefined and null cases
};
/**Used to run every test in a suite. This function is assumed to run alone.
This function calls TestRunner.clearResults and TestRunner.generateResultTable.
The main loop enumerates over the testSuite object given and calls each function.
The loop is deep and all properties that are objects will also be enumerated over.
It will call testConfig.betweenEach (if it is defined) between each test.
If the called test function throws, TestRunner.testAll will catch it and display the list of errors when finished
(and will also send the stack to console.error).
The total time taken is displayed (everything is written to "testResults" text area) then it scrolls to testResults.
@param {object} an object that contains every test to be run. defaults to TestSuite
@param {object} an object (defaults to TestConfig) that contains:
   {function} betweenEach if defined it will be called between each test
   {number} defaultDelta passed to TestRunner.doesTestPass
   {boolean} hidePassed defaults to true and is passed to TestRunner.generateResultTable
*/
TestRunner.testAll=function(testSuite, testConfig)
{
   startTime = Date.now();

   //testSuite and testConfig defaults can't be self tested
   if(undefined === testSuite) testSuite = TestSuite;
   if(undefined === testConfig) testConfig = TestConfig;

   var betweenEach = testConfig.betweenEach;
   if(undefined === betweenEach) betweenEach = function(){};
   if(undefined === testConfig.hidePassed) testConfig = {defaultDelta: testConfig.defaultDelta, hidePassed: true};
      //new object to avoid mutating the user's config

   var suiteCollection = [testSuite], errorTests = [], resultingList = [];
   while (0 !== suiteCollection.length)
   {
      testSuite = suiteCollection.shift();
      for (var key in testSuite)
      {
         if(!testSuite.hasOwnProperty(key)) continue;  //"for in" loops are always risky and therefore require sanitizing
         else if('object' === typeof(testSuite[key]) && null !== testSuite[key]) suiteCollection.push(testSuite[key]);
            //null is a jerk: typeof erroneously returns 'object' (null isn't an object because it doesn't inherit Object.prototype)
         else if ('function' === typeof(testSuite[key]))
         {
            if(0 !== resultingList.length || 0 !== errorTests.length) betweenEach();
            try{resultingList.push(testSuite[key](false));}
            catch(e){console.error(e); errorTests.push({Error: e, Description: key});}
            //I could have breadcrumbs instead of key but these shouldn't happen and the stack trace is good enough
         }
      }
   }
   if(0 !== errorTests.length) resultingList.push(TestRunner.displayResults('TestRunner.testAll', errorTests, false));
      //testConfig is not needed because !isFirst
   var output = TestRunner.generateResultTable(resultingList, testConfig);

   endTime = Date.now();
   output += 'Time taken: ' + TestRunner.formatTestTime(startTime, endTime) + '\n';

   document.getElementById('testResults').value = output;
   location.hash = '#testResults';  //scroll to the results
   //return output;  //don't return because a javascript:TestRunner.testAll(); link would cause it to write over the whole page
};
/**@returns true if the input should be compared via .valueOf when determining equality*/
TestRunner.useValueOf=function(input)
{
   return (input instanceof Boolean || input instanceof Number || input instanceof String
      || input instanceof Date);
      //although RegExp has a valueOf it returns an object so it is pointless to call
      //typeof(new Function()) === 'function' and any subclass would need to have equals
};
/**Used internally by TestRunner.doesTestPass. Don't call this directly (delta isn't validated).
@returns true or false based on a shallow equality check or undefined if a deep equality is required.*/
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

   if (TestRunner.isPrimitive(expected))  //Date objects are considered primitive
   {
      if(typeof(expected) !== 'number') return false;  //equality was denied at base case
      //dates will be a number after unboxing so that they can also use delta
      if(isNaN(expected) && isNaN(actual)) return true;
         //NaN is a jerk: NaN === NaN erroneously returns false (x === x is a tautology. the reason the standard returns false no longer applies)

      return Math.abs(expected - actual) <= delta;
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

/**defaultDelta requires an exact match. To handle imprecise decimals use TestConfig.defaultDelta = Number.EPSILON;*/
var TestConfig = {betweenEach: function(){}, defaultDelta: 0, hidePassed: undefined};
var TestSuite = {};

/*example:
TestSuite.abilityList = {};
//TestConfig does not need to be changed from defaults
TestSuite.abilityList.calculateValues=function(isFirst)
{
   TestRunner.clearResults(isFirst);

   var testResults=[];
   try{
   TestRunner.changeValue('input', 5);
   testResults.push({Expected: 5, Actual: document.getElementById('output').value, Description: 'input is copied over on change'});
   } catch(e){testResults.push({Error: e, Description: 'input is copied over on change'});}  //not expecting an error to be thrown but it was. fail instead of crash

   try{
   testResults.push({Expected: NaN, Actual: Math.factorial('Not a number'), Description: 'Math.factorial when passed NaN'});
   } catch(e){testResults.push({Error: e, Description: 'Math.factorial when passed NaN'});}

   try{
   Validator.nonNull(null);
   TestRunner.failedToThrow(testResults, 'Validator.nonNull did not throw given null.');
   }
   catch(e)
   {
      testResults.push({Expected: new TypeError('Illegal argument: object can\'t be null.'), Actual: e,
         Description: 'Validator.nonNull threw the correct type and message.'});
   }

   //be sure to give the test a name here:
   return TestRunner.displayResults('TestSuite.abilityList.calculateValues', testResults, isFirst);
};
TestSuite.abilityList.unfinishedTest=function(isFirst)
{
   return {tableName: 'unmade', testResults: []};  //remove this when actual tests exist. ADD TESTS
};
*/
