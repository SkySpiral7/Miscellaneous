Tester.TesterUtility={};
Tester.TesterUtility.changeValue=function(isFirst)
{
   TesterUtility.clearResults(isFirst);

   var testResults = [], actual, input;
   var resultBox = document.getElementById('test results');

   try{
   resultBox.value = '';
   actual = false;
   resultBox.onchange = function(){actual = true;};
   TesterUtility.changeValue('test results', 'new value');
   testResults.push({Expected: true, Actual: actual, Description: 'Happy path: called'});
   testResults.push({Expected: 'new value', Actual: resultBox.value, Description: 'Happy path: value'});
   } catch(e){testResults.push({Error: e, Description: 'Happy path'});}

   try{
   TesterUtility.changeValue('Dana', 'only Zuul');  //assuming there is no Dana
   TesterUtility.failedToThrow(testResults, 'Element doesn\'t exist');
   }
   catch(e)
   {
      testResults.push({Expected: true, Actual: true, Description: 'Element doesn\'t exist'});
      //ignore exact error because it is browser specific
   }

   try{
   resultBox.onchange = null;
   TesterUtility.changeValue('test results', 'new value');
   TesterUtility.failedToThrow(testResults, 'No onchange');
   }
   catch(e)
   {
      testResults.push({Expected: true, Actual: true, Description: 'No onchange'});
      //ignore exact error because it is browser specific
   }

   resultBox.value = '';
   //these changes to resultBox will be overwritten by the actual results
   //although this specific test also clears out pre-existing text

   return TesterUtility.displayResults('meta: TesterUtility.changeValue', testResults, isFirst);
};
Tester.TesterUtility.clearResults=function(isFirst)
{
   TesterUtility.clearResults(isFirst);

   var testResults = [], actual, input;

   var resultBox = document.getElementById('test results');
   //this test can only be run in a place where tests can be run...
   //yeah so it's not an assumption to require test results to exist

   try{
   resultBox.value = 'Test';
   TesterUtility.clearResults(false);
   actual = resultBox.value;
   testResults.push({Expected: 'Test', Actual: actual, Description: 'No clear with false'});
   } catch(e){testResults.push({Error: e, Description: 'No clear with false'});}

   try{
   resultBox.value = 'Test';
   TesterUtility.clearResults();
   actual = resultBox.value;
   testResults.push({Expected: '', Actual: actual, Description: 'Clear with no arg'});
   } catch(e){testResults.push({Error: e, Description: 'Clear with no arg'});}

   try{
   Tester.data.defaultPrecision = 5;
   TesterUtility.clearResults();
   TesterUtility.failedToThrow(testResults, 'Reject defaultPrecision');
   }
   catch(e)
   {
      testResults.push({Expected: new Error('Must update tests'), Actual: e, Description: 'Reject defaultPrecision'});
   }
   delete Tester.data.defaultPrecision;

   try{
   Tester.data.defaultPrecision = 15;
   TesterUtility.clearResults();
   //15 isn't rejected because that was the default value
   testResults.push({Expected: true, Actual: true, Description: 'Don\'t reject defaultPrecision: 15'});
   } catch(e){testResults.push({Error: e, Description: 'Don\'t reject defaultPrecision: 15'});}
   delete Tester.data.defaultPrecision;

   try{
   resultBox.value = 'Test';
   TesterUtility.clearResults(true);
   actual = resultBox.value;
   testResults.push({Expected: '', Actual: actual, Description: 'Cleared with true'});
   } catch(e){testResults.push({Error: e, Description: 'Cleared with true'});}

   resultBox.value = '';
   //these changes to resultBox will be overwritten by the actual results
   //although this specific test also clears out pre-existing text

   return TesterUtility.displayResults('meta: TesterUtility.clearResults', testResults, isFirst);
};
Tester.TesterUtility.formatTestTime=function(isFirst)
{
   TesterUtility.clearResults(isFirst);

   var testResults = [], actual, expected;

   try{
   expected  = '0 minutes, 0 seconds, and 100 milliseconds';
   actual = TesterUtility.formatTestTime(20, 120);
   testResults.push({Expected: expected, Actual: actual, Description: 'milliseconds only'});
   } catch(e){testResults.push({Error: e, Description: 'milliseconds only'});}

   try{
   expected  = '2 minutes, 3 seconds, and 123 milliseconds';
   actual = TesterUtility.formatTestTime(0, 123123);
   testResults.push({Expected: expected, Actual: actual, Description: 'each'});
   } catch(e){testResults.push({Error: e, Description: 'each'});}

   try{
   expected  = '61 minutes, 0 seconds, and 1 milliseconds';
   actual = TesterUtility.formatTestTime(0, 3660001);
   testResults.push({Expected: expected, Actual: actual, Description: 'no hours'});
   } catch(e){testResults.push({Error: e, Description: 'no hours'});}

   return TesterUtility.displayResults('meta: TesterUtility.formatTestTime', testResults, isFirst);
};
Tester.TesterUtility.generateResultTable=function(isFirst)
{
   TesterUtility.clearResults(isFirst);

   var testResults = [], actual, input, inputRow, expected;

   try{
   input = [{tableName: 'Table name'}];
   input[0].testResults = [{Expected: true, Actual: true, Description: 'Test name'}];
   expected  = '1/1: Table name\n';
   expected += '   Pass: Test name\n';
   expected += '\n';
   expected += 'Grand total: 1/1\n';
   actual = TesterUtility.generateResultTable(input, false);
   testResults.push({Expected: expected, Actual: actual, Description: 'Happy path: 1 pass no hide'});
   } catch(e){testResults.push({Error: e, Description: 'Happy path: 1 pass no hide'});}

   try{
   input = [{tableName: 'Table name'}];
   input[0].testResults = [{Expected: true, Actual: true, Description: 'Test name'}];
   actual = TesterUtility.generateResultTable(input, true);
   testResults.push({Expected: 'Grand total: 1/1\n', Actual: actual, Description: 'Hidden all pass'});
   } catch(e){testResults.push({Error: e, Description: 'Hidden all pass'});}

   try{
   input = [{tableName: 'Table name',
      testResults: [
         {Expected: true, Actual: true, Description: 'Test name 1'},
         {Expected: /d/, Actual: /f/, Description: 'Test name 2'}
   ]}];
   expected  = '1/2: Table name\n';
   expected += '   Fail: Test name 2\n';
   expected += '      Expected: /d/\n';
   expected += '      Actual: /f/\n';
   expected += '\n';
   expected += 'Grand total: 1/2\n';
   actual = TesterUtility.generateResultTable(input, true);
   testResults.push({Expected: expected, Actual: actual, Description: 'Hidden some pass'});
   } catch(e){testResults.push({Error: e, Description: 'Hidden some pass'});}

   try{
   input = [
      {
         tableName: 'Fancy table name',
         testResults: [
            {Expected: true, Actual: true, Description: 'Test name 1'},
            {Expected: /2/, Actual: /2.1/, Description: 'Test name 2'},
            {Expected: {a: 1}, Actual: {a: 2}, Description: 'Test name 3'},
            {Expected: false, Actual: false, Description: 'Test name 4'}
         ]
      },
      {
         tableName: 'Dull table name',
         testResults: [{Expected: true, Actual: true, Description: 'Lone test'}]
      }
   ];
   expected  = '2/4: Fancy table name\n';
   expected += '   Pass: Test name 1\n';
   expected += '   Fail: Test name 2\n';
   expected += '      Expected: /2/\n';
   expected += '      Actual: /2.1/\n';
   expected += '   Fail: Test name 3\n';
   expected += '      Expected: [object Object]\n';
   expected += '      Actual: [object Object]\n';
   expected += '   Pass: Test name 4\n';
   expected += '1/1: Dull table name\n';
   expected += '   Pass: Lone test\n';
   expected += '\n';
   expected += 'Grand total: 3/5\n';
   actual = TesterUtility.generateResultTable(input, false);
   testResults.push({Expected: expected, Actual: actual, Description: 'Complex'});
   } catch(e){testResults.push({Error: e, Description: 'Complex'});}

   try{
   input = [{tableName: 'Table name',
      testResults: [{Error: new TypeError('something bad happened'), Description: 'Test name'}]
   }];
   expected  = '0/1: Table name\n';
   expected += '   Fail: Test name\n';
   expected += '      Error: TypeError: something bad happened\n';
   expected += '\n';
   expected += 'Grand total: 0/1\n';
   actual = TesterUtility.generateResultTable(input, false);
   testResults.push({Expected: expected, Actual: actual, Description: 'Error'});
   } catch(e){testResults.push({Error: e, Description: 'Error'});}

   try{
   actual = TesterUtility.generateResultTable([], false);
   testResults.push({Expected: 'Grand total: 0/0\n', Actual: actual, Description: 'No tests'});
   } catch(e){testResults.push({Error: e, Description: 'No tests'});}

   return TesterUtility.displayResults('meta: TesterUtility.generateResultTable', testResults, isFirst);
};
Tester.TesterUtility.isPrimitive=function(isFirst)
{
   TesterUtility.clearResults(isFirst);

   var testResults = [], actual, input;

   try{
   actual = TesterUtility.isPrimitive(true);
   testResults.push({Expected: true, Actual: actual, Description: 'boolean'});
   } catch(e){testResults.push({Error: e, Description: 'boolean'});}

   try{
   actual = TesterUtility.isPrimitive(5);
   testResults.push({Expected: true, Actual: actual, Description: 'number'});
   } catch(e){testResults.push({Error: e, Description: 'number'});}

   try{
   actual = TesterUtility.isPrimitive('test');
   testResults.push({Expected: true, Actual: actual, Description: 'string'});
   } catch(e){testResults.push({Error: e, Description: 'string'});}

   try{
   actual = TesterUtility.isPrimitive(new Date(0));
   testResults.push({Expected: false, Actual: actual, Description: 'Date'});
   } catch(e){testResults.push({Error: e, Description: 'Date'});}

   try{
   actual = TesterUtility.isPrimitive(Math.floor);
   testResults.push({Expected: true, Actual: actual, Description: 'function'});
   } catch(e){testResults.push({Error: e, Description: 'function'});}

   try{
   actual = TesterUtility.isPrimitive(Symbol());
   testResults.push({Expected: true, Actual: actual, Description: 'symbol'});
   } catch(e){testResults.push({Error: e, Description: 'symbol'});}

   try{
   actual = TesterUtility.isPrimitive();
   testResults.push({Expected: true, Actual: actual, Description: 'undefined'});
   } catch(e){testResults.push({Error: e, Description: 'undefined'});}

   try{
   actual = TesterUtility.isPrimitive(null);
   testResults.push({Expected: true, Actual: actual, Description: 'null'});
   } catch(e){testResults.push({Error: e, Description: 'null'});}

   try{
   actual = TesterUtility.isPrimitive(/a/);
   testResults.push({Expected: false, Actual: actual, Description: 'RegExp'});
   } catch(e){testResults.push({Error: e, Description: 'RegExp'});}

   return TesterUtility.displayResults('meta: TesterUtility.isPrimitive', testResults, isFirst);
};
Tester.TesterUtility.testPassed=function(isFirst)
{
   TesterUtility.clearResults(isFirst);

   var testResults = [], actual, input;

   try{
   actual = TesterUtility.testPassed({Error: new Error('Something evil')});
   testResults.push({Expected: false, Actual: actual, Description: 'Happy path: error'});
   } catch(e){testResults.push({Error: e, Description: 'Happy path: error'});}

   try{
   actual = TesterUtility.testPassed({Expected: true, Actual: true});
   testResults.push({Expected: true, Actual: actual, Description: 'Happy path: pass'});
   } catch(e){testResults.push({Error: e, Description: 'Happy path: pass'});}

   try{
   actual = TesterUtility.testPassed({Expected: 1, Actual: (1 + Number.EPSILON)});
   testResults.push({Expected: false, Actual: actual, Description: 'Using default delta'});
   } catch(e){testResults.push({Error: e, Description: 'Using default delta'});}

   try{
   TesterUtility.testPassed({Expected: 1, Actual: 1.5, Delta: 'ham'});
   TesterUtility.failedToThrow(testResults, 'Using invalid delta');
   }
   catch(e)
   {
      testResults.push({Expected: new Error('Test error: illegal delta: ham'), Actual: e, Description: 'Using invalid delta'});
   }

   try{
   Tester.data.defaultDelta = 'pork';
   TesterUtility.testPassed({Expected: 1, Actual: 1.5});
   TesterUtility.failedToThrow(testResults, 'Using invalid default delta');
   }
   catch(e)
   {
      testResults.push({Expected: new Error('Test error: illegal delta: pork'), Actual: e, Description: 'Using invalid default delta'});
   }
   Tester.data.defaultDelta = 0;

   try{
   actual = TesterUtility.testPassed({Expected: 1.2, Actual: 1.4, Delta: 0.2});
   testResults.push({Expected: true, Actual: actual, Description: 'Using custom delta'});
   } catch(e){testResults.push({Error: e, Description: 'Using custom delta'});}

   try{
   actual = TesterUtility.testPassed({Expected: [1,2], Actual: [1,2]});
   testResults.push({Expected: true, Actual: actual, Description: 'Least deep equal'});
   } catch(e){testResults.push({Error: e, Description: 'Least deep equal'});}

   try{
   actual = TesterUtility.testPassed({Expected: {a: 1}, Actual: {a: 2}});
   testResults.push({Expected: false, Actual: actual, Description: 'Least deep not equal'});
   } catch(e){testResults.push({Error: e, Description: 'Least deep not equal'});}

   try{
   actual = TesterUtility.testPassed({Expected: [1.2, 2.5], Actual: [1.4, 2.55], Delta: 0.2});
   testResults.push({Expected: true, Actual: actual, Description: 'Delta is global'});
   } catch(e){testResults.push({Error: e, Description: 'Delta is global'});}

   try{
   actual = TesterUtility.testPassed({Expected: [{}, {a: 1}], Actual: [{}, {a: 1, b: 5}]});
   testResults.push({Expected: false, Actual: actual, Description: 'Deep with unequal keys'});
   } catch(e){testResults.push({Error: e, Description: 'Deep with unequal keys'});}

   try{
   actual = TesterUtility.testPassed({Expected: {a: undefined}, Actual: {b: 1}});
   //Actual.b exists so that there are the same number of keys (thus edge case)
   testResults.push({Expected: false, Actual: actual, Description: 'Edge case: undefined vs not exist'});
   } catch(e){testResults.push({Error: e, Description: 'Edge case: undefined vs not exist'});}

   return TesterUtility.displayResults('meta: TesterUtility.testPassed', testResults, isFirst);
};
Tester.TesterUtility.useValueOf=function(isFirst)
{
   TesterUtility.clearResults(isFirst);

   var testResults = [], actual, input;

   try{
   input = new Boolean(false);
   testResults.push({Expected: 'object', Actual: typeof(input), Description: 'Is object: Boolean'});
   actual = TesterUtility.useValueOf(input);
   testResults.push({Expected: true, Actual: actual, Description: 'useValueOf: Boolean'});
   } catch(e){testResults.push({Error: e, Description: 'useValueOf: Boolean'});}

   try{
   input = new Number(5);
   testResults.push({Expected: 'object', Actual: typeof(input), Description: 'Is object: Number'});
   actual = TesterUtility.useValueOf(input);
   testResults.push({Expected: true, Actual: actual, Description: 'useValueOf: Number'});
   } catch(e){testResults.push({Error: e, Description: 'useValueOf: Number'});}

   try{
   input = new String('test');
   testResults.push({Expected: 'object', Actual: typeof(input), Description: 'Is object: String'});
   actual = TesterUtility.useValueOf(input);
   testResults.push({Expected: true, Actual: actual, Description: 'useValueOf: String'});
   } catch(e){testResults.push({Error: e, Description: 'useValueOf: String'});}

   try{
   input = new Date(1465695450227);
   testResults.push({Expected: 'object', Actual: typeof(input), Description: 'Is object: Date'});
   actual = TesterUtility.useValueOf(input);
   testResults.push({Expected: true, Actual: actual, Description: 'useValueOf: Date'});
   } catch(e){testResults.push({Error: e, Description: 'useValueOf: Date'});}

   try{
   actual = TesterUtility.useValueOf(Math.floor);
   testResults.push({Expected: false, Actual: actual, Description: 'useValueOf: function'});
   } catch(e){testResults.push({Error: e, Description: 'useValueOf: function'});}

   try{
   actual = TesterUtility.useValueOf(/a/);
   testResults.push({Expected: false, Actual: actual, Description: 'useValueOf: RegExp'});
   } catch(e){testResults.push({Error: e, Description: 'useValueOf: RegExp'});}

   return TesterUtility.displayResults('meta: TesterUtility.useValueOf', testResults, isFirst);
};
Tester.TesterUtility._shallowEquality=function(isFirst)
{
   TesterUtility.clearResults(isFirst);

   var testResults = [], actual, input;

   try{
   actual = TesterUtility._shallowEquality(1, '1', 0);
   testResults.push({Expected: false, Actual: actual, Description: 'Different types'});
   } catch(e){testResults.push({Error: e, Description: 'Different types'});}

   try{
   actual = TesterUtility._shallowEquality(null, null, 0);
   testResults.push({Expected: true, Actual: actual, Description: 'Expected null, Actual null'});
   } catch(e){testResults.push({Error: e, Description: 'Expected null, Actual null'});}

   try{
   actual = TesterUtility._shallowEquality(null, new Date(), 0);
   testResults.push({Expected: false, Actual: actual, Description: 'Expected null, Actual not'});
   } catch(e){testResults.push({Error: e, Description: 'Expected null, Actual not'});}

   try{
   actual = TesterUtility._shallowEquality(new Date(), null, 0);
   testResults.push({Expected: false, Actual: actual, Description: 'Expected not, Actual null'});
   } catch(e){testResults.push({Error: e, Description: 'Expected not, Actual null'});}

   try{
   actual = TesterUtility._shallowEquality(new Date(), new Number(0), 0);
   testResults.push({Expected: false, Actual: actual, Description: 'Different object types'});
   } catch(e){testResults.push({Error: e, Description: 'Different object types'});}

   try{
   actual = TesterUtility._shallowEquality(new Number(0), new Number(0), 0);
   testResults.push({Expected: true, Actual: actual, Description: 'Boxed and equal'});
   } catch(e){testResults.push({Error: e, Description: 'Boxed and equal'});}

   try{
   actual = TesterUtility._shallowEquality(true, true, 0);
   testResults.push({Expected: true, Actual: actual, Description: 'Happy path: pass'});
   } catch(e){testResults.push({Error: e, Description: 'Happy path: pass'});}

   try{
   var input = Symbol();
   actual = TesterUtility._shallowEquality(input, input, 0);
   testResults.push({Expected: true, Actual: actual, Description: 'Same symbol'});
   } catch(e){testResults.push({Error: e, Description: 'Same symbol'});}

   try{
   actual = TesterUtility._shallowEquality(undefined, undefined, 0);
   testResults.push({Expected: true, Actual: actual, Description: 'Edge case: undefined'});
   } catch(e){testResults.push({Error: e, Description: 'Edge case: undefined'});}

   try{
   actual = TesterUtility._shallowEquality(true, false, 0);
   testResults.push({Expected: false, Actual: actual, Description: 'Unequal primitives'});
   } catch(e){testResults.push({Error: e, Description: 'Unequal primitives'});}

   try{
   actual = TesterUtility._shallowEquality(NaN, NaN, 0);
   testResults.push({Expected: true, Actual: actual, Description: 'NaN === NaN'});
   } catch(e){testResults.push({Error: e, Description: 'NaN === NaN'});}

   try{
   actual = TesterUtility._shallowEquality(1.2, 1.4, 0.2);
   testResults.push({Expected: true, Actual: actual, Description: 'Using custom delta'});
   } catch(e){testResults.push({Error: e, Description: 'Using custom delta'});}

   try{
   actual = TesterUtility._shallowEquality(new Date(1466625615000), new Date(1466625615156), 1000);
   testResults.push({Expected: true, Actual: actual, Description: 'Date with delta'});
   } catch(e){testResults.push({Error: e, Description: 'Date with delta'});}

   try{
   input = {};
   input.Expected = {hairColor: 'green', isCached: false, equals: function(other){return other.hairColor === this.hairColor;}};
   input.Actual = {hairColor: 'green', isCached: true, equals: function(other){return other.hairColor === this.hairColor;}};
   actual = TesterUtility._shallowEquality(input.Expected, input.Actual, 0);
   testResults.push({Expected: true, Actual: actual, Description: 'Custom equals function: true'});
   } catch(e){testResults.push({Error: e, Description: 'Custom equals function: true'});}

   try{
   input = {};
   input.Expected = {hairColor: 'green', isCached: false, equals: function(other){return other.hairColor === this.hairColor;}};
   input.Actual = {hairColor: 'blue', isCached: true, equals: function(other){return other.hairColor === this.hairColor;}};
   actual = TesterUtility._shallowEquality(input.Expected, input.Actual, 0);
   testResults.push({Expected: false, Actual: actual, Description: 'Custom equals function: false'});
   } catch(e){testResults.push({Error: e, Description: 'Custom equals function: false'});}

   try{
   input = new Error();
   input.message = 2;
   TesterUtility._shallowEquality(input, new Error(), 0);
   TesterUtility.failedToThrow(testResults, 'Failed assertion for Error.message');
   }
   catch(e)
   {
      testResults.push({Expected: new Error('Assertion Error: expected.message is 2'), Actual: e,
         Description: 'Failed assertion for Error.message'});
   }

   try{
   input = new Error();
   input.description = 2;
   TesterUtility._shallowEquality(input, new Error(), 0);
   TesterUtility.failedToThrow(testResults, 'Failed assertion for Error.description');
   }
   catch(e)
   {
      testResults.push({Expected: new Error('Assertion Error: expected.description is 2'), Actual: e,
         Description: 'Failed assertion for Error.description'});
   }

   try{
   input = new Error('equal');
   input.ignoreMe = 5;
   actual = TesterUtility._shallowEquality(input, new Error('equal'), 0);
   testResults.push({Expected: true, Actual: actual, Description: 'Error is equal'});
   } catch(e){testResults.push({Error: e, Description: 'Error is equal'});}

   try{
   actual = TesterUtility._shallowEquality(new Error('is'), new Error('different'), 0);
   testResults.push({Expected: false, Actual: actual, Description: 'Error is not equal'});
   } catch(e){testResults.push({Error: e, Description: 'Error is not equal'});}

   try{
   input = {};
   input.Expected = new Error();
   //test message despite browser
   input.Expected.message = 'is';
   input.Actual = new Error();
   input.Actual.message = 'different';
   actual = TesterUtility._shallowEquality(input.Expected, input.Actual, 0);
   testResults.push({Expected: false, Actual: actual, Description: 'Error message'});
   } catch(e){testResults.push({Error: e, Description: 'Error message'});}

   try{
   input = {};
   input.Expected = new Error();
   //message is already equal (either undefined or '')
   input.Expected.description = 'is';
   input.Actual = new Error();
   input.Actual.description = 'different';
   actual = TesterUtility._shallowEquality(input.Expected, input.Actual, 0);
   testResults.push({Expected: false, Actual: actual, Description: 'Error description'});
   } catch(e){testResults.push({Error: e, Description: 'Error description'});}

   try{
   actual = TesterUtility.testPassed({Expected: /a/, Actual: /b/});
   testResults.push({Expected: false, Actual: actual, Description: 'RegExp'});
   } catch(e){testResults.push({Error: e, Description: 'RegExp'});}

   return TesterUtility.displayResults('meta: TesterUtility._shallowEquality', testResults, isFirst);
};
