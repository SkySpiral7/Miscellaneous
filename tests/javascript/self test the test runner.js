Tester.TesterUtility={};
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

   TesterUtility.displayResults('meta: TesterUtility.testPassed', testResults, isFirst);
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

   TesterUtility.displayResults('meta: TesterUtility._shallowEquality', testResults, isFirst);
};
