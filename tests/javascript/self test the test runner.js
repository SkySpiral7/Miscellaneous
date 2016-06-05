Tester.TesterUtility={};
Tester.TesterUtility.testPassed=function(isFirst)
{
   TesterUtility.clearResults(isFirst);

   var testResults = [], actual, input;

   try{
   actual = TesterUtility.testPassed({Error: 'Something evil'});
   testResults.push({Expected: false, Actual: actual, Description: 'Happy path: error'});
   } catch(e){testResults.push({Error: e, Description: 'Happy path: error'});}

   try{
   actual = TesterUtility.testPassed({Expected: 1, Actual: '1'});
   testResults.push({Expected: false, Actual: actual, Description: 'Different types'});
   } catch(e){testResults.push({Error: e, Description: 'Different types'});}

   try{
   actual = TesterUtility.testPassed({Expected: null, Actual: null});
   testResults.push({Expected: true, Actual: actual, Description: 'Expected null, Actual null'});
   } catch(e){testResults.push({Error: e, Description: 'Expected null, Actual null'});}

   try{
   actual = TesterUtility.testPassed({Expected: null, Actual: new Date()});
   testResults.push({Expected: false, Actual: actual, Description: 'Expected null, Actual not'});
   } catch(e){testResults.push({Error: e, Description: 'Expected null, Actual not'});}

   try{
   actual = TesterUtility.testPassed({Expected: new Date(), Actual: null});
   testResults.push({Expected: false, Actual: actual, Description: 'Expected not, Actual null'});
   } catch(e){testResults.push({Error: e, Description: 'Expected not, Actual null'});}

   try{
   actual = TesterUtility.testPassed({Expected: new Date(), Actual: new Number(0)});
   testResults.push({Expected: false, Actual: actual, Description: 'Different object types'});
   } catch(e){testResults.push({Error: e, Description: 'Different object types'});}

   try{
   actual = TesterUtility.testPassed({Expected: new Number(0), Actual: new Number(0)});
   testResults.push({Expected: true, Actual: actual, Description: 'Boxed and equal'});
   } catch(e){testResults.push({Error: e, Description: 'Boxed and equal'});}

   try{
   actual = TesterUtility.testPassed({Expected: true, Actual: true});
   testResults.push({Expected: true, Actual: actual, Description: 'Happy path: pass'});
   } catch(e){testResults.push({Error: e, Description: 'Happy path: pass'});}

   try{
   var input = Symbol();
   actual = TesterUtility.testPassed({Expected: input, Actual: input});
   testResults.push({Expected: true, Actual: actual, Description: 'Same symbol'});
   } catch(e){testResults.push({Error: e, Description: 'Same symbol'});}

   try{
   actual = TesterUtility.testPassed({Expected: undefined, Actual: undefined});
   testResults.push({Expected: true, Actual: actual, Description: 'Edge case: undefined'});
   } catch(e){testResults.push({Error: e, Description: 'Edge case: undefined'});}

   try{
   actual = TesterUtility.testPassed({Expected: true, Actual: false});
   testResults.push({Expected: false, Actual: actual, Description: 'Unequal primitives'});
   } catch(e){testResults.push({Error: e, Description: 'Unequal primitives'});}

   try{
   actual = TesterUtility.testPassed({Expected: NaN, Actual: NaN});
   testResults.push({Expected: true, Actual: actual, Description: 'NaN === NaN'});
   } catch(e){testResults.push({Error: e, Description: 'NaN === NaN'});}

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
   input = {};
   input.Expected = {hairColor: 'green', isCached: false, equals: function(other){return other.hairColor === this.hairColor;}};
   input.Actual = {hairColor: 'green', isCached: true, equals: function(other){return other.hairColor === this.hairColor;}};
   actual = TesterUtility.testPassed(input);
   testResults.push({Expected: true, Actual: actual, Description: 'Custom equals function: true'});
   } catch(e){testResults.push({Error: e, Description: 'Custom equals function: true'});}

   try{
   input = {};
   input.Expected = {hairColor: 'green', isCached: false, equals: function(other){return other.hairColor === this.hairColor;}};
   input.Actual = {hairColor: 'blue', isCached: true, equals: function(other){return other.hairColor === this.hairColor;}};
   actual = TesterUtility.testPassed(input);
   testResults.push({Expected: false, Actual: actual, Description: 'Custom equals function: false'});
   } catch(e){testResults.push({Error: e, Description: 'Custom equals function: false'});}

   TesterUtility.displayResults('meta: TesterUtility.testPassed', testResults, isFirst);
};
