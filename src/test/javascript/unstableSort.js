'use strict';
TestSuite.unstableSort=function(testState={})
{
   TestRunner.clearResults(testState);

   var testResults=[], input, expected;

   try {
   input = ['cat', 'human', 'dog'];
   function byStringLength(a,b) {
      if(a.length > b.length) return 1;
      if(a.length < b.length) return -1;
      return 0;
   }
   unstableSort(input, byStringLength);

   expected = ['dog', 'cat', 'human'];
   testResults.push({Expected: expected, Actual: input, Description: 'Does sort but unstable'});
   } catch(e){testResults.push({Error: e, Description: 'Does sort but unstable'});}

   try {
   input = ['cat', 'human', 'dog'];
   function noOpCompare(a,b) {
      return 0;
   }
   unstableSort(input, noOpCompare);

   expected = ['human', 'dog', 'cat'];
   testResults.push({Expected: expected, Actual: input, Description: 'Unstable with no op'});
   } catch(e){testResults.push({Error: e, Description: 'Unstable with no op'});}

   return TestRunner.displayResults('TestSuite.unstableSort', testResults, testState);
};
