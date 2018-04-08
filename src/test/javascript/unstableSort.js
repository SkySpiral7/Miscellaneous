'use strict';
TestSuite.unstableSort=function(isFirst)
{
   TestRunner.clearResults(isFirst);

   var testResults=[];

   try {
   var input = ['cat', 'human', 'dog'];
   function byStringLength(a,b) {
      if(a.length > b.length) return 1;
      if(a.length < b.length) return -1;
      return 0;
   }
   unstableSort(input, byStringLength);

   var expected = ['dog', 'cat', 'human'];
   testResults.push({Expected: expected, Actual: input, Description: 'Does sort but unstable'});
   } catch(e){testResults.push({Error: e, Description: 'Does sort but unstable'});}

   try {
   var input = ['cat', 'human', 'dog'];
   function noOpCompare(a,b) {
      return 0;
   }
   unstableSort(input, noOpCompare);

   var expected = ['human', 'dog', 'cat'];
   testResults.push({Expected: expected, Actual: input, Description: 'Unstable with no op'});
   } catch(e){testResults.push({Error: e, Description: 'Unstable with no op'});}

   return TestRunner.displayResults('TestSuite.unstableSort', testResults, isFirst);
};
