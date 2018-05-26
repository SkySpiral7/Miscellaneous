'use strict';
TestSuite.TestRunner={};
TestSuite.TestRunner.changeValue=function(testState={})
{
   TestRunner.clearResults(testState);

   var assertions = [], actual;
   var resultBox = document.getElementById('testResults');

   try{
   resultBox.value = '';
   actual = false;
   resultBox.onchange = function(){actual = true;};
   TestRunner.changeValue('testResults', 'new value');
   assertions.push({Expected: true, Actual: actual, Description: 'Happy path: called'});
   assertions.push({Expected: 'new value', Actual: resultBox.value, Description: 'Happy path: value'});
   } catch(e){assertions.push({Error: e, Description: 'Happy path'});}

   try{
   TestRunner.changeValue('Dana', 'only Zuul');  //assuming there is no Dana
   TestRunner.failedToThrow(assertions, 'Element doesn\'t exist');
   }
   catch(e)
   {
      assertions.push({Expected: true, Actual: true, Description: 'Element doesn\'t exist'});
      //ignore exact error because it is browser specific
   }

   try{
   resultBox.onchange = undefined;
   TestRunner.changeValue('testResults', 'new value');
   TestRunner.failedToThrow(assertions, 'No onchange');
   }
   catch(e)
   {
      assertions.push({Expected: true, Actual: true, Description: 'No onchange'});
      //ignore exact error because it is browser specific
   }

   resultBox.value = '';
   //delete resultBox.onchange;  //not possible so just leave it undefined

   return TestRunner.displayResults('meta: TestRunner.changeValue', assertions, testState);
};
TestSuite.TestRunner.clearResults=function(testState={})
{
   TestRunner.clearResults(testState);

   var assertions = [], actual;

   var resultBox = document.getElementById('testResults');

   try{
   resultBox.value = 'Test';
   TestRunner.clearResults({runningSingleTest: false});
   actual = resultBox.value;
   assertions.push({Expected: 'Test', Actual: actual, Description: 'No clear with false'});
   } catch(e){assertions.push({Error: e, Description: 'No clear with false'});}

   try{
   resultBox.value = 'Test';
   TestRunner.clearResults();
   actual = resultBox.value;
   assertions.push({Expected: '', Actual: actual, Description: 'Clear with no arg'});

   resultBox.value = 'Test';
   TestRunner.clearResults({});
   actual = resultBox.value;
   assertions.push({Expected: '', Actual: actual, Description: 'Clear with empty arg'});
   } catch(e){assertions.push({Error: e, Description: 'Clear with by default'});}

   try{
   resultBox.value = 'Test';
   TestRunner.clearResults({runningSingleTest: true});
   actual = resultBox.value;
   assertions.push({Expected: '', Actual: actual, Description: 'Cleared with true'});
   } catch(e){assertions.push({Error: e, Description: 'Cleared with true'});}

   try{
   TestRunner.clearResults({runningSingleTest: true, config: {}});
   assertions.push({Expected: true, Actual: true, Description: 'empty config doesn\'t throw'});
   } catch(e){assertions.push({Error: e, Description: 'empty config doesn\'t throw'});}

   try{
   var called = false;
   TestRunner.clearResults({runningSingleTest: true, config: {beforeFirst: function(){called = true;}}});
   assertions.push({Expected: true, Actual: called, Description: 'beforeFirst is called'});
   } catch(e){assertions.push({Error: e, Description: 'beforeFirst is called'});}

   resultBox.value = '';
   //these changes to resultBox will be overwritten by the actual results
   //although this specific test also clears out pre-existing text

   return TestRunner.displayResults('meta: TestRunner.clearResults', assertions, testState);
};
TestSuite.TestRunner.displayResults=function(testState={})
{
   TestRunner.clearResults(testState);

   var assertions = [], actual, input, expected, inputConfig;

   var resultBox = document.getElementById('testResults');

   try{
   resultBox.value = 'no change';
   input = [{Expected: true, Actual: true, Description: 'Test name'}];
   expected = {name: 'table name', assertions: [{Expected: true, Actual: true, Description: 'Test name'}]};
   actual = TestRunner.displayResults('table name', input, {runningSingleTest: false});
   assertions.push({Expected: expected, Actual: actual, Description: 'Not runningSingleTest: return'});
   assertions.push({Expected: 'no change', Actual: resultBox.value, Description: 'Not runningSingleTest: output'});
   } catch(e){assertions.push({Error: e, Description: 'Not runningSingleTest'});}

   try{
   location.hash = '';
   input = [{Expected: true, Actual: true, Description: 'Test name'}];
   TestRunner.displayResults('table name', input, {runningSingleTest: true});
   expected = '1/1: table name\n   Pass: Test name\n\nGrand total: 1/1\nTime taken: ?\n';
   actual = resultBox.value.replace(/Time taken:.+/, 'Time taken: ?');
   assertions.push({Expected: expected, Actual: actual, Description: 'runningSingleTest'});
   assertions.push({Expected: '#testResults', Actual: location.hash, Description: 'runningSingleTest scrolls to testResults'});
   //return value isn't asserted because it doesn't matter when runningSingleTest
   } catch(e){assertions.push({Error: e, Description: 'runningSingleTest'});}

   try{
   input = [{Expected: true, Actual: true, Description: 'Test name'}];
   TestRunner.displayResults('table name', input);
   expected = '1/1: table name\n   Pass: Test name\n\nGrand total: 1/1\nTime taken: ?\n';
   actual = resultBox.value.replace(/Time taken:.+/, 'Time taken: ?');
   assertions.push({Expected: expected, Actual: actual, Description: 'runningSingleTest with no arg'});

   input = [{Expected: true, Actual: true, Description: 'Test name'}];
   TestRunner.displayResults('table name', input, {});
   expected = '1/1: table name\n   Pass: Test name\n\nGrand total: 1/1\nTime taken: ?\n';
   actual = resultBox.value.replace(/Time taken:.+/, 'Time taken: ?');
   assertions.push({Expected: expected, Actual: actual, Description: 'runningSingleTest with empty arg'});
   } catch(e){assertions.push({Error: e, Description: 'runningSingleTest by default'});}

   try{
   input = [{Expected: true, Actual: true, Description: 'Test name'}];
   TestRunner.displayResults('table name', input, {runningSingleTest: true});
   expected = '1/1: table name\n   Pass: Test name\n\nGrand total: 1/1\nTime taken: ?\n';
   actual = resultBox.value.replace(/Time taken:.+/, 'Time taken: ?');
   assertions.push({Expected: expected, Actual: actual, Description: 'No testConfig defaults hidePassed to false'});

   input = [{Expected: 1, Actual: 2, Description: 'Test name'}];
   inputConfig = {defaultDelta: 5};
   TestRunner.displayResults('table name', input, {runningSingleTest: true, config: inputConfig});
   expected = '1/1: table name\n   Pass: Test name\n\nGrand total: 1/1\nTime taken: ?\n';
   actual = resultBox.value.replace(/Time taken:.+/, 'Time taken: ?');
   assertions.push({Expected: expected, Actual: actual, Description: 'No hidePassed to false'});
   assertions.push({Expected: {defaultDelta: 5}, Actual: inputConfig, Description: 'without mutating user config'});

   input = [{Expected: true, Actual: true, Description: 'Test name'}];
   TestRunner.displayResults('table name', input, {runningSingleTest: true, config: {hidePassed: true}});
   expected = 'Grand total: 1/1\nTime taken: ?\n';
   actual = resultBox.value.replace(/Time taken:.+/, 'Time taken: ?');
   assertions.push({Expected: expected, Actual: actual, Description: 'hidePassed can be true'});
   } catch(e){assertions.push({Error: e, Description: 'hidePassed'});}

   try{
   input = [{Expected: true, Actual: true, Description: 'Test name'}];
   var called = false;
   inputConfig = {afterLast: function(){called = true;}};
   TestRunner.displayResults('table name', input, {runningSingleTest: true, config: inputConfig});
   assertions.push({Expected: true, Actual: called, Description: 'Call afterLast'});
   } catch(e){assertions.push({Error: e, Description: 'Call afterLast'});}

   resultBox.value = '';

   return TestRunner.displayResults('meta: TestRunner.displayResults', assertions, testState);
};
TestSuite.TestRunner.findFirstFailurePath=function(testState={})
{
   TestRunner.clearResults(testState);

   var assertions = [], actual;

   try{
   actual = TestRunner.findFirstFailurePath({Error: new Error('Something evil')});
   assertions.push({Expected: '', Actual: actual, Description: 'Happy path: error'});
   } catch(e){assertions.push({Error: e, Description: 'Happy path: error'});}

   try{
   actual = TestRunner.findFirstFailurePath({Expected: true, Actual: true});
   assertions.push({Expected: undefined, Actual: actual, Description: 'Happy path: pass'});
   } catch(e){assertions.push({Error: e, Description: 'Happy path: pass'});}

   try{
   TestConfig.defaultDelta = 'pork';
   actual = TestRunner.findFirstFailurePath({Expected: 1.2, Actual: 1.4, Delta: 0.2}, 'pig');
   assertions.push({Expected: undefined, Actual: actual, Description: 'Use delta property first'});

   actual = TestRunner.findFirstFailurePath({Expected: 1, Actual: 2}, 5);
   assertions.push({Expected: undefined, Actual: actual, Description: 'Then use delta arg'});

   TestConfig.defaultDelta = 0;
   actual = TestRunner.findFirstFailurePath({Expected: 1, Actual: (1 + Number.EPSILON)});
   assertions.push({Expected: '', Actual: actual, Description: 'Then TestConfig.defaultDelta'});
   } catch(e){assertions.push({Error: e, Description: 'Delta order'});}
   TestConfig.defaultDelta = 0;

   try{
   TestRunner.findFirstFailurePath({Expected: 1, Actual: 1.5, Delta: 'ham'});
   TestRunner.failedToThrow(assertions, 'Using invalid delta property');
   }
   catch(e)
   {
      assertions.push({Expected: new Error('Test error: illegal delta: ham'), Actual: e, Description: 'Using invalid delta property'});
   }

   try{
   TestRunner.findFirstFailurePath({Expected: 1, Actual: 1.5}, 'pig');
   TestRunner.failedToThrow(assertions, 'Using invalid delta arg');
   }
   catch(e)
   {
      assertions.push({Expected: new Error('Test error: illegal delta: pig'), Actual: e, Description: 'Using invalid delta arg'});
   }

   try{
   TestConfig.defaultDelta = 'pork';
   TestRunner.findFirstFailurePath({Expected: 1, Actual: 1.5});
   TestRunner.failedToThrow(assertions, 'Using invalid TestConfig.defaultDelta');
   }
   catch(e)
   {
      assertions.push({Expected: new Error('Test error: illegal delta: pork'), Actual: e, Description: 'Using invalid TestConfig.defaultDelta'});
   }
   TestConfig.defaultDelta = 0;

   try{
   actual = TestRunner.findFirstFailurePath({Expected: [1,2], Actual: [1,2]});
   assertions.push({Expected: undefined, Actual: actual, Description: 'Least deep equal'});
   } catch(e){assertions.push({Error: e, Description: 'Least deep equal'});}

   try{
   actual = TestRunner.findFirstFailurePath({Expected: {a: 1}, Actual: {a: 2}});
   assertions.push({Expected: '"a"', Actual: actual, Description: 'Least deep not equal'});
   } catch(e){assertions.push({Error: e, Description: 'Least deep not equal'});}

   try{
   actual = TestRunner.findFirstFailurePath({Expected: [{a: {b: 'blue', c: 1}}], Actual: [{a: {b: 'blue', c: 2}}]});
   assertions.push({Expected: '"0"."a"."c"', Actual: actual, Description: 'Fail path'});
   } catch(e){assertions.push({Error: e, Description: 'Fail path'});}

   try{
   actual = TestRunner.findFirstFailurePath({Expected: [1.2, 2.5], Actual: [1.4, 2.55], Delta: 0.2});
   assertions.push({Expected: undefined, Actual: actual, Description: 'Delta is global'});
   } catch(e){assertions.push({Error: e, Description: 'Delta is global'});}

   try{
   actual = TestRunner.findFirstFailurePath({Expected: [{}, {a: 1}], Actual: [{}, {a: 1, b: 5}]});
   assertions.push({Expected: '"1"', Actual: actual, Description: 'Deep with unequal keys'});
   } catch(e){assertions.push({Error: e, Description: 'Deep with unequal keys'});}

   try{
   actual = TestRunner.findFirstFailurePath({Expected: {a: undefined}, Actual: {b: 1}});
   //Actual.b exists so that there are the same number of keys (thus edge case)
   assertions.push({Expected: '"a"', Actual: actual, Description: 'Edge case: undefined vs not exist'});
   } catch(e){assertions.push({Error: e, Description: 'Edge case: undefined vs not exist'});}

   try{
   actual = TestRunner.findFirstFailurePath({Expected: {a: 1, b: 2}, Actual: {b: 2, a: 1}});
   assertions.push({Expected: undefined, Actual: actual, Description: 'Ignore key order'});
   } catch(e){assertions.push({Error: e, Description: 'Ignore key order'});}

   return TestRunner.displayResults('meta: TestRunner.findFirstFailurePath', assertions, testState);
};
TestSuite.TestRunner.failedToThrow=function(testState={})
{
   TestRunner.clearResults(testState);

   var assertions = [], actual, expected;

   try{
   expected = [0, {Expected: 'throw', Actual: 'return', Description: 'Test'}];
   actual = [0];
   TestRunner.failedToThrow(actual, 'Test');
   assertions.push({Expected: expected, Actual: actual, Description: 'Happy path'});
   } catch(e){assertions.push({Error: e, Description: 'Happy path'});}

   return TestRunner.displayResults('meta: TestRunner.failedToThrow', assertions, testState);
};
TestSuite.TestRunner.formatTestTime=function(testState={})
{
   TestRunner.clearResults(testState);

   var assertions = [], actual, expected;

   try{
   expected = '0.100 seconds';
   actual = TestRunner.formatTestTime(20, 120);
   assertions.push({Expected: expected, Actual: actual, Description: 'milliseconds only'});
   } catch(e){assertions.push({Error: e, Description: 'milliseconds only'});}

   try{
   expected = '1 minutes and 3.123 seconds';
   actual = TestRunner.formatTestTime(0, 63123);
   assertions.push({Expected: expected, Actual: actual, Description: 'each'});
   } catch(e){assertions.push({Error: e, Description: 'each'});}

   try{
   expected = '61 minutes and 0.000 seconds';
   actual = TestRunner.formatTestTime(0, 3660000);
   assertions.push({Expected: expected, Actual: actual, Description: 'no hours'});
   } catch(e){assertions.push({Error: e, Description: 'no hours'});}

   return TestRunner.displayResults('meta: TestRunner.formatTestTime', assertions, testState);
};
TestSuite.TestRunner.generateResultTable=function(testState={})
{
   TestRunner.clearResults(testState);

   var assertions = [], actual, input, expected;

   try{
      input = {
         tests: [
            {
               passCount: 1,
               total: 1,
               name: 'Table name',
               assertions: [
                  {Expected: true, Actual: true, Description: 'Test name', Outcome: 'Pass'}
               ]
            }
         ],
         passCount: 1,
         total: 1
      };
   expected  = '1/1: Table name\n';
   expected += '   Pass: Test name\n';
   expected += '\n';
   expected += 'Grand total: 1/1\n';
   actual = TestRunner.generateResultTable(input);
   assertions.push({Expected: expected, Actual: actual, Description: 'Happy path: 1 pass'});
   } catch(e){assertions.push({Error: e, Description: 'Happy path: 1 pass'});}

   try{
      input = {
         tests: [
            {
               passCount: 0,
               total: 1,
               name: 'Table name',
               assertions: [
                  {Error: new TypeError('something bad happened'), Description: 'Test name', Outcome: 'Error'}
               ]
            }
         ],
         passCount: 0,
         total: 1
      };
      expected  = '0/1: Table name\n';
      expected += '   Fail: Test name\n';
      expected += '      Error: TypeError: something bad happened\n';
      expected += '\n';
      expected += 'Grand total: 0/1\n';
      actual = TestRunner.generateResultTable(input);
      assertions.push({Expected: expected, Actual: actual, Description: 'has Error'});
   } catch(e){assertions.push({Error: e, Description: 'has Error'});}

   try{
      input = {
         tests: [
            {
               passCount: 0,
               total: 2,
               name: 'Table name',
               assertions: [
                  {Expected: {a: 1}, Actual: {a: 2}, Description: 'Test name 3', Outcome: 'Fail', FailPath: '"a"'},
                  {Expected: /d/, Actual: /f/, Description: 'Test name 2', Outcome: 'Fail', FailPath: ''}
               ]
            }
         ],
         passCount: 0,
         total: 2
      };
      expected  = '0/2: Table name\n';
      expected += '   Fail: Test name 3\n';
      expected += '      Expected: [object Object]\n';
      expected += '      Actual: [object Object]\n';
      expected += '   Fail: Test name 2\n';
      expected += '      Expected: /d/\n';
      expected += '      Actual: /f/\n';
      expected += '\n';
      expected += 'Grand total: 0/2\n';
      actual = TestRunner.generateResultTable(input);
      assertions.push({Expected: expected, Actual: actual, Description: 'has failure'});
   } catch(e){assertions.push({Error: e, Description: 'has failure'});}

   try{
      input = {
         tests: [
            {
               passCount: 1,
               total: 2,
               name: 'table 1',
               assertions: [
                  {Expected: true, Actual: true, Description: 'Test name 1', Outcome: 'Pass'},
                  {Expected: /2/, Actual: /2.1/, Description: 'Test name 2', Outcome: 'Fail', FailPath: ''}
               ]
            },
            {
               passCount: 1,
               total: 2,
               name: 'table 2',
               assertions: [
                  {Expected: {a: 1}, Actual: {a: 2}, Description: 'Test name 3', Outcome: 'Fail', FailPath: '"a"'},
                  {Expected: false, Actual: false, Description: 'Test name 4', Outcome: 'Pass'}
               ]
            }
         ],
         passCount: 2,
         total: 4
      };
      expected  = '1/2: table 1\n';
      expected += '   Pass: Test name 1\n';
      expected += '   Fail: Test name 2\n';
      expected += '      Expected: /2/\n';
      expected += '      Actual: /2.1/\n';
      expected += '1/2: table 2\n';
      expected += '   Fail: Test name 3\n';
      expected += '      Expected: [object Object]\n';
      expected += '      Actual: [object Object]\n';
      expected += '   Pass: Test name 4\n';
      expected += '\n';
      expected += 'Grand total: 2/4\n';
      actual = TestRunner.generateResultTable(input);
      assertions.push({Expected: expected, Actual: actual, Description: 'loops: 2 tests of 2 assertions'});
   } catch(e){assertions.push({Error: e, Description: 'loops: 2 tests of 2 assertions'});}

   try{
      input = {
         tests: [],
         passCount: 16,
         total: 16
      };
      actual = TestRunner.generateResultTable(input);
      assertions.push({Expected: 'Grand total: 16/16\n', Actual: actual, Description: 'All tests hidden'});
   } catch(e){assertions.push({Error: e, Description: 'All tests hidden'});}

   try{
      input = {
         tests: [],
         passCount: 0,
         total: 0
      };
   actual = TestRunner.generateResultTable(input);
   assertions.push({Expected: 'Grand total: 0/0\n', Actual: actual, Description: 'No tests'});
   } catch(e){assertions.push({Error: e, Description: 'No tests'});}

   return TestRunner.displayResults('meta: TestRunner.generateResultTable', assertions, testState);
};
TestSuite.TestRunner.processAssertions=function(testState={})
{
   TestRunner.clearResults(testState);

   var assertions = [], actual, input, expected;

   try{
      TestRunner.processAssertions([], {defaultDelta: 1});
      TestRunner.failedToThrow(assertions, 'hidePassed is required');
   }
   catch(e)
   {
      assertions.push({Expected: new Error('Test error: illegal testConfig.hidePassed: undefined'), Actual: e,
         Description: 'hidePassed is required'});
   }

   try{
      input = [{name: 'Table name'}];
      input[0].assertions = [{Expected: true, Actual: true, Description: 'Test name'}];
      expected = {
         tests: [
            {
               passCount: 1,
               total: 1,
               name: 'Table name',
               assertions: [
                  {Expected: true, Actual: true, Description: 'Test name', Outcome: 'Pass'}
               ]
            }
         ],
         passCount: 1,
         total: 1
      };
      actual = TestRunner.processAssertions(input, {hidePassed: false});
      assertions.push({Expected: expected, Actual: actual, Description: 'Happy path: !hidePassed && assertions.length === passCount'});
   } catch(e){assertions.push({Error: e, Description: 'Happy path: !hidePassed && assertions.length === passCount'});}

   try{
      input = [{name: 'Table name'}];
      input[0].assertions = [{Expected: true, Actual: true, Description: 'Test name'}];
      expected = {
         tests: [],
         passCount: 1,
         total: 1
      };
      actual = TestRunner.processAssertions(input, {hidePassed: true});
      assertions.push({Expected: expected, Actual: actual, Description: 'hidePassed && assertions.length === passCount'});
   } catch(e){assertions.push({Error: e, Description: 'hidePassed && assertions.length === passCount'});}

   try{
      input = [{name: 'Table name',
         assertions: [{Error: new TypeError('something bad happened'), Description: 'Test name'}]
      }];
      expected = {
         tests: [
            {
               passCount: 0,
               total: 1,
               name: 'Table name',
               assertions: [
                  {Error: new TypeError('something bad happened'), Description: 'Test name', Outcome: 'Error'}
               ]
            }
         ],
         passCount: 0,
         total: 1
      };
      actual = TestRunner.processAssertions(input, {hidePassed: false});
      assertions.push({Expected: expected, Actual: actual, Description: 'has Error'});
   } catch(e){assertions.push({Error: e, Description: 'has Error'});}

   try{
      input = [{name: 'Table name',
         assertions: [
            {Expected: {a: 1}, Actual: {a: 2}, Description: 'Test name 3'},
            {Expected: /d/, Actual: /f/, Description: 'Test name 2'}
         ]}];
      expected = {
         tests: [
            {
               passCount: 0,
               total: 2,
               name: 'Table name',
               assertions: [
                  {Expected: {a: 1}, Actual: {a: 2}, Description: 'Test name 3', Outcome: 'Fail', FailPath: '"a"'},
                  {Expected: /d/, Actual: /f/, Description: 'Test name 2', Outcome: 'Fail', FailPath: ''}
               ]
            }
         ],
         passCount: 0,
         total: 2
      };
      actual = TestRunner.processAssertions(input, {hidePassed: true});
      assertions.push({Expected: expected, Actual: actual, Description: 'has failure'});
   } catch(e){assertions.push({Error: e, Description: 'has failure'});}

   try{
      input = [{name: 'Table name',
         assertions: [
            {Expected: true, Actual: true, Description: 'Test name 1'},
            {Expected: /d/, Actual: /f/, Description: 'Test name 2'}
         ]}];
      expected = {
         tests: [
            {
               passCount: 1,
               total: 2,
               name: 'Table name',
               assertions: [
                  {Expected: true, Actual: true, Description: 'Test name 1', Outcome: 'Pass'},
                  {Expected: /d/, Actual: /f/, Description: 'Test name 2', Outcome: 'Fail', FailPath: ''}
               ]
            }
         ],
         passCount: 1,
         total: 2
      };
      actual = TestRunner.processAssertions(input, {hidePassed: false});
      assertions.push({Expected: expected, Actual: actual, Description: '!hidePassed && assertions.length !== passCount'});
   } catch(e){assertions.push({Error: e, Description: '!hidePassed && assertions.length !== passCount'});}

   try{
      input = [{name: 'Table name',
         assertions: [
            {Expected: true, Actual: true, Description: 'Test name 1'},
            {Expected: /d/, Actual: /f/, Description: 'Test name 2'}
         ]}];
      expected = {
         tests: [
            {
               passCount: 1,
               total: 2,
               name: 'Table name',
               assertions: [
                  {Expected: /d/, Actual: /f/, Description: 'Test name 2', Outcome: 'Fail', FailPath: ''}
               ]
            }
         ],
         passCount: 1,
         total: 2
      };
      actual = TestRunner.processAssertions(input, {hidePassed: true});
      assertions.push({Expected: expected, Actual: actual, Description: 'hidePassed && assertions.length !== passCount'});
   } catch(e){assertions.push({Error: e, Description: 'hidePassed && assertions.length !== passCount'});}

   try{
      input = [
         {
            name: 'table 1',
            assertions: [
               {Expected: true, Actual: true, Description: 'Test name 1'},
               {Expected: /2/, Actual: /2.1/, Description: 'Test name 2'}
            ]
         },
         {
            name: 'table 2',
            assertions: [
               {Expected: {a: 1}, Actual: {a: 2}, Description: 'Test name 3'},
               {Expected: false, Actual: false, Description: 'Test name 4'}
            ]
         }
      ];
      expected = {
         tests: [
            {
               passCount: 1,
               total: 2,
               name: 'table 1',
               assertions: [
                  {Expected: true, Actual: true, Description: 'Test name 1', Outcome: 'Pass'},
                  {Expected: /2/, Actual: /2.1/, Description: 'Test name 2', Outcome: 'Fail', FailPath: ''}
               ]
            },
            {
               passCount: 1,
               total: 2,
               name: 'table 2',
               assertions: [
                  {Expected: {a: 1}, Actual: {a: 2}, Description: 'Test name 3', Outcome: 'Fail', FailPath: '"a"'},
                  {Expected: false, Actual: false, Description: 'Test name 4', Outcome: 'Pass'}
               ]
            }
         ],
         passCount: 2,
         total: 4
      };
      actual = TestRunner.processAssertions(input, {hidePassed: false});
      assertions.push({Expected: expected, Actual: actual, Description: 'loops: 2 tests of 2 assertions'});
   } catch(e){assertions.push({Error: e, Description: 'loops: 2 tests of 2 assertions'});}

   try{
      expected = {
         tests: [],
         passCount: 0,
         total: 0
      };
      actual = TestRunner.processAssertions([], {hidePassed: false});
      assertions.push({Expected: expected, Actual: actual, Description: 'No tests'});
   } catch(e){assertions.push({Error: e, Description: 'No tests'});}

   return TestRunner.displayResults('meta: TestRunner.processAssertions', assertions, testState);
};
TestSuite.TestRunner.isPrimitive=function(testState={})
{
   TestRunner.clearResults(testState);

   var assertions = [], actual;

   try{
   actual = TestRunner.isPrimitive(true);
   assertions.push({Expected: true, Actual: actual, Description: 'boolean'});
   } catch(e){assertions.push({Error: e, Description: 'boolean'});}

   try{
   actual = TestRunner.isPrimitive(5);
   assertions.push({Expected: true, Actual: actual, Description: 'number'});
   } catch(e){assertions.push({Error: e, Description: 'number'});}

   try{
   actual = TestRunner.isPrimitive('test');
   assertions.push({Expected: true, Actual: actual, Description: 'string'});
   } catch(e){assertions.push({Error: e, Description: 'string'});}

   try{
   actual = TestRunner.isPrimitive(new Date(0));
   assertions.push({Expected: false, Actual: actual, Description: 'Date'});
   } catch(e){assertions.push({Error: e, Description: 'Date'});}

   try{
   actual = TestRunner.isPrimitive(Math.floor);
   assertions.push({Expected: true, Actual: actual, Description: 'function'});
   } catch(e){assertions.push({Error: e, Description: 'function'});}

   try{
   actual = TestRunner.isPrimitive(Symbol());
   assertions.push({Expected: true, Actual: actual, Description: 'symbol'});
   } catch(e){assertions.push({Error: e, Description: 'symbol'});}

   try{
   actual = TestRunner.isPrimitive();
   assertions.push({Expected: true, Actual: actual, Description: 'undefined'});
   } catch(e){assertions.push({Error: e, Description: 'undefined'});}

   try{
   actual = TestRunner.isPrimitive(null);
   assertions.push({Expected: true, Actual: actual, Description: 'null'});
   } catch(e){assertions.push({Error: e, Description: 'null'});}

   try{
   actual = TestRunner.isPrimitive(/a/);
   assertions.push({Expected: false, Actual: actual, Description: 'RegExp'});
   } catch(e){assertions.push({Error: e, Description: 'RegExp'});}

   return TestRunner.displayResults('meta: TestRunner.isPrimitive', assertions, testState);
};
TestSuite.TestRunner.testAll=function(testState={})
{
   TestRunner.clearResults(testState);

   var assertions = [], actual, testSuite, expected, beforeFirstCount = 0, betweenCount = 0, afterLastCount = 0, inputConfig = {};

   var resultBox = document.getElementById('testResults');
   var trackingConfig = {
      beforeFirst: function(){++beforeFirstCount;}, betweenEach: function(){++betweenCount;}, afterLast: function(){++afterLastCount;},
      defaultDelta: 0, hidePassed: true
   };
   var passTest = function(){return {name: 'Pass table', assertions:[
      {Expected: true, Actual: true, Description: 'Desc 1'},
      {Expected: true, Actual: true, Description: 'Desc 2'}
   ]}};
   var failTest = function(){return {name: 'Fail table', assertions: [{Expected: true, Actual: false, Description: 'Desc'}]}};
   var errorTest = function(){throw new Error('I\'m sorry guys but I just can\'t.');};

   try{
   location.hash = '';
   resultBox.value = 'Override me';
   testSuite = {testTable1: passTest, testTable2: passTest, testTable3: passTest};
   expected = 'Grand total: 6/6\nTime taken: ?\n';

   TestRunner.testAll(testSuite, trackingConfig);
   actual = resultBox.value.replace(/Time taken:.+/, 'Time taken: ?');
   assertions.push({Expected: expected, Actual: actual, Description: 'Happy path: output'});
   assertions.push({Expected: 1, Actual: beforeFirstCount, Description: 'Happy path: beforeFirstCount'});
   assertions.push({Expected: 2, Actual: betweenCount, Description: 'Happy path: betweenCount'});
   assertions.push({Expected: 1, Actual: afterLastCount, Description: 'Happy path: afterLastCount'});
   assertions.push({Expected: '#testResults', Actual: location.hash, Description: 'Happy path: scrolls to testResults'});
   } catch(e){assertions.push({Error: e, Description: 'Happy path'});}

   try{
   var orderString = '';
   var passTable = {
      name: 'Pass table', assertions: [
         {Expected: true, Actual: true, Description: 'Desc'}
      ]
   };
   testSuite = {
      testTable1: function () {
         orderString += '1';
         return passTable;
      },
      testTable2: function () {
         orderString += '2';
         return passTable;
      },
      testTable3: function () {
         orderString += '3';
         return passTable;
      }
   };
   inputConfig = {
      beforeFirst: function(){orderString += 'F';}, betweenEach: function(){orderString += 'E';}, afterLast: function(){orderString += 'L';}
   };

   TestRunner.testAll(testSuite, inputConfig);
   assertions.push({Expected: 'F1E2E3L', Actual: orderString, Description: 'verify order'});
   } catch(e){assertions.push({Error: e, Description: 'verify order'});}

   try{
   testSuite = {testTable1: passTest, testTable2: passTest};
   TestRunner.testAll(testSuite, {});
   assertions.push({Expected: true, Actual: true, Description: 'betweenEach default does nothing'});
   } catch(e){assertions.push({Error: e, Description: 'betweenEach default does nothing'});}

   try{
   testSuite = {testTable: passTest};
   inputConfig = {};
   expected = 'Grand total: 2/2\nTime taken: ?\n';
   TestRunner.testAll(testSuite, inputConfig);
   actual = resultBox.value.replace(/Time taken:.+/, 'Time taken: ?');
   assertions.push({Expected: expected, Actual: actual, Description: 'hidePassed defaults to true'});
   assertions.push({Expected: {}, Actual: inputConfig, Description: 'without mutating user config'});
   } catch(e){assertions.push({Error: e, Description: 'hidePassed'});}

   try{
   Object.prototype.pollution = function(){};
   testSuite = {testTable: passTest};
   expected = 'Grand total: 2/2\nTime taken: ?\n';

   TestRunner.testAll(testSuite, trackingConfig);
   actual = resultBox.value.replace(/Time taken:.+/, 'Time taken: ?');
   assertions.push({Expected: expected, Actual: actual, Description: 'Checks hasOwnProperty'});
   } catch(e){assertions.push({Error: e, Description: 'Checks hasOwnProperty'});}
   delete Object.prototype.polution;

   try{
   testSuite = {notATest: 0, stillNot: null};
   expected = 'Grand total: 0/0\nTime taken: ?\n';

   TestRunner.testAll(testSuite, trackingConfig);
   actual = resultBox.value.replace(/Time taken:.+/, 'Time taken: ?');
   assertions.push({Expected: expected, Actual: actual, Description: 'Ignore non-tests'});
   } catch(e){assertions.push({Error: e, Description: 'Ignore non-tests'});}

   try{
   betweenCount = 0;
   testSuite = {testTable1: errorTest, testTable2: failTest};
   expected = '0/1: Fail table\n   Fail: Desc\n      Expected: true\n      Actual: false\n';
   expected += '0/1: TestRunner.testAll\n   Fail: testTable1\n      Error: Error: I\'m sorry guys but I just can\'t.\n';
   expected += '\nGrand total: 0/2\nTime taken: ?\n';

   TestRunner.testAll(testSuite, trackingConfig);
   actual = resultBox.value.replace(/Time taken:.+/, 'Time taken: ?');
   assertions.push({Expected: expected, Actual: actual, Description: 'Failure: output'});
   assertions.push({Expected: 1, Actual: betweenCount, Description: 'Failure: betweenCount'});
   } catch(e){assertions.push({Error: e, Description: 'Failure'});}

   try{
   testSuite = {someObject: {testTable1: passTest}, testTable2: passTest};
   expected = 'Grand total: 4/4\nTime taken: ?\n';

   TestRunner.testAll(testSuite, trackingConfig);
   actual = resultBox.value.replace(/Time taken:.+/, 'Time taken: ?');
   assertions.push({Expected: expected, Actual: actual, Description: 'Nesting'});
   } catch(e){assertions.push({Error: e, Description: 'Nesting'});}

   try{
   betweenCount = 0;
   testSuite = {testTable: passTest};

   TestRunner.testAll(testSuite, trackingConfig);
   assertions.push({Expected: 0, Actual: betweenCount, Description: 'No between'});
   } catch(e){assertions.push({Error: e, Description: 'No between'});}

   try{
   testSuite = {testTable: function(){return {name: 'Off table', assertions:[
      {Expected: 1, Actual: 5, Description: '4 Off'}
   ]}}};
   expected = 'Grand total: 1/1\nTime taken: ?\n';

   TestRunner.testAll(testSuite, {defaultDelta: 100});
   actual = resultBox.value.replace(/Time taken:.+/, 'Time taken: ?');
   assertions.push({Expected: expected, Actual: actual, Description: 'IT: defaultDelta is passed all the way down'});
   } catch(e){assertions.push({Error: e, Description: 'IT: defaultDelta is passed all the way down'});}

   try{
   testSuite = {testTable: function(){return {name: 'Pass table', assertions:[
      {Expected: true, Actual: true, Description: 'Seems logical'}
   ]}}};
   expected = '1/1: Pass table\n   Pass: Seems logical\n\nGrand total: 1/1\nTime taken: ?\n';

   TestRunner.testAll(testSuite, {hidePassed: false});
   actual = resultBox.value.replace(/Time taken:.+/, 'Time taken: ?');
   assertions.push({Expected: expected, Actual: actual, Description: 'IT: hidePassed is passed all the way down'});

   testSuite = {testTable1: errorTest, testTable2: function(){return {name: 'Pass table', assertions:[
      {Expected: true, Actual: true, Description: 'Seems logical'}
   ]}}};
   expected = '1/1: Pass table\n   Pass: Seems logical\n';
   expected += '0/1: TestRunner.testAll\n   Fail: testTable1\n      Error: Error: I\'m sorry guys but I just can\'t.\n';
   expected += '\nGrand total: 1/2\nTime taken: ?\n';
   TestRunner.testAll(testSuite, {hidePassed: false});
   actual = resultBox.value.replace(/Time taken:.+/, 'Time taken: ?');
   assertions.push({Expected: expected, Actual: actual, Description: 'IT: hidePassed is used for throwing tests too'});
   } catch(e){assertions.push({Error: e, Description: 'IT: hidePassed is passed all the way down'});}

   resultBox.value = '';

   return TestRunner.displayResults('meta: TestRunner.testAll', assertions, testState);
};
TestSuite.TestRunner.useValueOf=function(testState={})
{
   TestRunner.clearResults(testState);

   var assertions = [], actual, input;

   try{
   input = new Boolean(false);
   assertions.push({Expected: 'object', Actual: typeof(input), Description: 'Is object: Boolean'});
   actual = TestRunner.useValueOf(input);
   assertions.push({Expected: true, Actual: actual, Description: 'useValueOf: Boolean'});
   } catch(e){assertions.push({Error: e, Description: 'useValueOf: Boolean'});}

   try{
   input = new Number(5);
   assertions.push({Expected: 'object', Actual: typeof(input), Description: 'Is object: Number'});
   actual = TestRunner.useValueOf(input);
   assertions.push({Expected: true, Actual: actual, Description: 'useValueOf: Number'});
   } catch(e){assertions.push({Error: e, Description: 'useValueOf: Number'});}

   try{
   input = new String('test');
   assertions.push({Expected: 'object', Actual: typeof(input), Description: 'Is object: String'});
   actual = TestRunner.useValueOf(input);
   assertions.push({Expected: true, Actual: actual, Description: 'useValueOf: String'});
   } catch(e){assertions.push({Error: e, Description: 'useValueOf: String'});}

   try{
   input = new Date(1465695450227);
   assertions.push({Expected: 'object', Actual: typeof(input), Description: 'Is object: Date'});
   actual = TestRunner.useValueOf(input);
   assertions.push({Expected: true, Actual: actual, Description: 'useValueOf: Date'});
   } catch(e){assertions.push({Error: e, Description: 'useValueOf: Date'});}

   try{
   actual = TestRunner.useValueOf(Math.floor);
   assertions.push({Expected: false, Actual: actual, Description: 'useValueOf: function'});
   } catch(e){assertions.push({Error: e, Description: 'useValueOf: function'});}

   try{
   actual = TestRunner.useValueOf(/a/);
   assertions.push({Expected: false, Actual: actual, Description: 'useValueOf: RegExp'});
   } catch(e){assertions.push({Error: e, Description: 'useValueOf: RegExp'});}

   return TestRunner.displayResults('meta: TestRunner.useValueOf', assertions, testState);
};
TestSuite.TestRunner._shallowEquality=function(testState={})
{
   TestRunner.clearResults(testState);

   var assertions = [], actual, input;

   try{
   actual = TestRunner._shallowEquality(1, '1', 0);
   assertions.push({Expected: false, Actual: actual, Description: 'Different types'});
   } catch(e){assertions.push({Error: e, Description: 'Different types'});}

   try{
   actual = TestRunner._shallowEquality(null, null, 0);
   assertions.push({Expected: true, Actual: actual, Description: 'Expected null, Actual null'});
   } catch(e){assertions.push({Error: e, Description: 'Expected null, Actual null'});}

   try{
   actual = TestRunner._shallowEquality(null, new Date(), 0);
   assertions.push({Expected: false, Actual: actual, Description: 'Expected null, Actual not'});
   } catch(e){assertions.push({Error: e, Description: 'Expected null, Actual not'});}

   try{
   actual = TestRunner._shallowEquality(new Date(), null, 0);
   assertions.push({Expected: false, Actual: actual, Description: 'Expected not, Actual null'});
   } catch(e){assertions.push({Error: e, Description: 'Expected not, Actual null'});}

   try{
   actual = TestRunner._shallowEquality(new Date(), new Number(0), 0);
   assertions.push({Expected: false, Actual: actual, Description: 'Different object types'});
   } catch(e){assertions.push({Error: e, Description: 'Different object types'});}

   try{
   actual = TestRunner._shallowEquality(new Number(0), new Number(0), 0);
   assertions.push({Expected: true, Actual: actual, Description: 'Boxed and equal'});
   } catch(e){assertions.push({Error: e, Description: 'Boxed and equal'});}

   try{
   actual = TestRunner._shallowEquality(true, true, 0);
   assertions.push({Expected: true, Actual: actual, Description: 'Happy path: pass'});
   } catch(e){assertions.push({Error: e, Description: 'Happy path: pass'});}

   try{
   input = Symbol();
   actual = TestRunner._shallowEquality(input, input, 0);
   assertions.push({Expected: true, Actual: actual, Description: 'Same symbol'});
   } catch(e){assertions.push({Error: e, Description: 'Same symbol'});}

   try{
   actual = TestRunner._shallowEquality(undefined, undefined, 0);
   assertions.push({Expected: true, Actual: actual, Description: 'Edge case: undefined'});
   } catch(e){assertions.push({Error: e, Description: 'Edge case: undefined'});}

   try{
   actual = TestRunner._shallowEquality(true, false, 0);
   assertions.push({Expected: false, Actual: actual, Description: 'Unequal primitives'});
   } catch(e){assertions.push({Error: e, Description: 'Unequal primitives'});}

   try{
   actual = TestRunner._shallowEquality(NaN, NaN, 0);
   assertions.push({Expected: true, Actual: actual, Description: 'NaN === NaN'});
   } catch(e){assertions.push({Error: e, Description: 'NaN === NaN'});}

   try{
   actual = TestRunner._shallowEquality(1.2, 1.4, 0.2);
   assertions.push({Expected: true, Actual: actual, Description: 'Using custom delta'});
   } catch(e){assertions.push({Error: e, Description: 'Using custom delta'});}

   try{
   actual = TestRunner._shallowEquality(new Date(1466625615000), new Date(1466625615156), 1000);
   assertions.push({Expected: true, Actual: actual, Description: 'Date with delta'});
   } catch(e){assertions.push({Error: e, Description: 'Date with delta'});}

   try{
   input = {};
   input.Expected = {hairColor: 'green', isCached: false, equals: function(other){return other.hairColor === this.hairColor;}};
   input.Actual = {hairColor: 'green', isCached: true, equals: function(other){return other.hairColor === this.hairColor;}};
   actual = TestRunner._shallowEquality(input.Expected, input.Actual, 0);
   assertions.push({Expected: true, Actual: actual, Description: 'Custom equals function: true'});
   } catch(e){assertions.push({Error: e, Description: 'Custom equals function: true'});}

   try{
   input = {};
   input.Expected = {hairColor: 'green', isCached: false, equals: function(other){return other.hairColor === this.hairColor;}};
   input.Actual = {hairColor: 'blue', isCached: true, equals: function(other){return other.hairColor === this.hairColor;}};
   actual = TestRunner._shallowEquality(input.Expected, input.Actual, 0);
   assertions.push({Expected: false, Actual: actual, Description: 'Custom equals function: false'});
   } catch(e){assertions.push({Error: e, Description: 'Custom equals function: false'});}

   try{
   input = new Error();
   input.message = 2;
   TestRunner._shallowEquality(input, new Error(), 0);
   TestRunner.failedToThrow(assertions, 'Failed assertion for Error.message');
   }
   catch(e)
   {
      assertions.push({Expected: new Error('Assertion Error: expected.message is 2'), Actual: e,
         Description: 'Failed assertion for Error.message'});
   }

   try{
   input = new Error();
   input.description = 2;
   TestRunner._shallowEquality(input, new Error(), 0);
   TestRunner.failedToThrow(assertions, 'Failed assertion for Error.description');
   }
   catch(e)
   {
      assertions.push({Expected: new Error('Assertion Error: expected.description is 2'), Actual: e,
         Description: 'Failed assertion for Error.description'});
   }

   try{
   input = new Error('equal');
   input.ignoreMe = 5;
   actual = TestRunner._shallowEquality(input, new Error('equal'), 0);
   assertions.push({Expected: true, Actual: actual, Description: 'Error is equal'});
   } catch(e){assertions.push({Error: e, Description: 'Error is equal'});}

   try{
   actual = TestRunner._shallowEquality(new Error('is'), new Error('different'), 0);
   assertions.push({Expected: false, Actual: actual, Description: 'Error is not equal'});
   } catch(e){assertions.push({Error: e, Description: 'Error is not equal'});}

   try{
   input = {};
   input.Expected = new Error();
   //test message despite browser
   input.Expected.message = 'is';
   input.Actual = new Error();
   input.Actual.message = 'different';
   actual = TestRunner._shallowEquality(input.Expected, input.Actual, 0);
   assertions.push({Expected: false, Actual: actual, Description: 'Error message'});
   } catch(e){assertions.push({Error: e, Description: 'Error message'});}

   try{
   input = {};
   input.Expected = new Error();
   //message is already equal (either undefined or '')
   input.Expected.description = 'is';
   input.Actual = new Error();
   input.Actual.description = 'different';
   actual = TestRunner._shallowEquality(input.Expected, input.Actual, 0);
   assertions.push({Expected: false, Actual: actual, Description: 'Error description'});
   } catch(e){assertions.push({Error: e, Description: 'Error description'});}

   try{
   actual = TestRunner._shallowEquality(/a/, /b/, 0);
   assertions.push({Expected: false, Actual: actual, Description: 'RegExp'});
   } catch(e){assertions.push({Error: e, Description: 'RegExp'});}

   return TestRunner.displayResults('meta: TestRunner._shallowEquality', assertions, testState);
};
