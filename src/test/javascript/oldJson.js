'use strict';
TestSuite.parseJson=function(isFirst)
{
   TestRunner.clearResults(isFirst);

   var testResults = [], expected, actual, input;

   try{
   actual = parseJson('+{ "valueOf": self["location"],'+
      '"toString": []["join"],'+
      '0: "javascript:alert(1)",'+
      '"length": 1'+
      '}');
   //JSON.parse would throw with a specific error message
   testResults.push({Expected: undefined, Actual: actual, Description: 'Rejects known attack vector'});
   } catch(e){testResults.push({Error: e, Description: 'Rejects known attack vector'});}

   try{
   input = '  {"valueOf": "I am, | very {} []"}\n';
   actual = parseJson(input);
   expected = JSON.parse(input);
   testResults.push({Expected: expected, Actual: actual, Description: 'Allows strings and trims'});
   } catch(e){testResults.push({Error: e, Description: 'Allows strings and trims'});}

   try{
   input = '{"valueOf"   \n : "You say \\" and \\n but I say \\\\"  ,"key"\t:5}';
   actual = parseJson(input);
   expected = JSON.parse(input);
   testResults.push({Expected: expected, Actual: actual, Description: 'Allows string escapes and removes valid whitespace'});
   } catch(e){testResults.push({Error: e, Description: 'Allows string escapes and removes valid whitespace'});}

   try{
   actual = parseJson('{5: 5}');
   testResults.push({Expected: undefined, Actual: actual, Description: 'Object key must be string'});
   } catch(e){testResults.push({Error: e, Description: 'Object key must be string'});}

   try{
   input = '[{"valueOf": ["sort"]}]';
   actual = parseJson(input);
   expected = JSON.parse(input);
   testResults.push({Expected: expected, Actual: actual, Description: 'Allows string array and root array'});
   } catch(e){testResults.push({Error: e, Description: 'Allows string array and root array'});}

   try{
   actual = parseJson('{"valueOf": []["sort"]}');
   testResults.push({Expected: undefined, Actual: actual, Description: 'Rejects []["function name"]'});
   } catch(e){testResults.push({Error: e, Description: 'Rejects []["function name"]'});}

   try{
   actual = parseJson('{"valueOf": null["sort"]}');
   testResults.push({Expected: undefined, Actual: actual, Description: 'Rejects null["function name"]'});
   } catch(e){testResults.push({Error: e, Description: 'Rejects null["function name"]'});}

   try{
   actual = parseJson('["me"false]');
   testResults.push({Expected: undefined, Actual: actual, Description: 'Rejects string before word'});
   } catch(e){testResults.push({Error: e, Description: 'Rejects string before word'});}

   try{
   actual = parseJson('[false"me"]');
   testResults.push({Expected: undefined, Actual: actual, Description: 'Rejects string after word'});
   } catch(e){testResults.push({Error: e, Description: 'Rejects string after word'});}

   try{
   actual = parseJson('[,,,,]');
   testResults.push({Expected: undefined, Actual: actual, Description: 'Rejects multiple separators'});
   } catch(e){testResults.push({Error: e, Description: 'Rejects multiple separators'});}

   try{
   input = '{"valueOf": [true, false, null]}';
   actual = parseJson(input);
   expected = JSON.parse(input);
   testResults.push({Expected: expected, Actual: actual, Description: 'Allows true, false, and null'});
   } catch(e){testResults.push({Error: e, Description: 'Allows true, false, and null'});}

   try{
   actual = parseJson('{"valueOf": falsefalse}');
   testResults.push({Expected: undefined, Actual: actual, Description: 'Rejects variables (false must be whole word)'});
   } catch(e){testResults.push({Error: e, Description: 'Rejects variables (false must be whole word)'});}

   try{
   actual = parseJson('{"valueOf": false false}');
   testResults.push({Expected: undefined, Actual: actual, Description: 'Rejects invalid whitespace'});
   } catch(e){testResults.push({Error: e, Description: 'Rejects invalid whitespace'});}

   try{
   input = '0.25e1';
   actual = parseJson(input);
   expected = JSON.parse(input);
   testResults.push({Expected: expected, Actual: actual, Description: 'Allows numbers'});
   } catch(e){testResults.push({Error: e, Description: 'Allows numbers'});}

   try{
   actual = parseJson('{"valueOf": 0..e}');
   testResults.push({Expected: undefined, Actual: actual, Description: 'Rejects invalid number (e is a function)'});
   } catch(e){testResults.push({Error: e, Description: 'Rejects invalid number (e is a function)'});}

   try{
   actual = parseJson('+{}');
   testResults.push({Expected: undefined, Actual: actual, Description: 'Rejects stray characters'});
   } catch(e){testResults.push({Error: e, Description: 'Rejects stray characters'});}

   try{
   actual = parseJson('{"key":');
   testResults.push({Expected: undefined, Actual: actual, Description: 'Rejects invalid structure'});
   } catch(e){testResults.push({Error: e, Description: 'Rejects invalid structure'});}

   try{
   actual = parseJson('[null"val":,]');
   testResults.push({Expected: undefined, Actual: actual, Description: 'Rejects invalid structure'});
   } catch(e){testResults.push({Error: e, Description: 'Rejects invalid structure'});}

   return TestRunner.displayResults('oldJson: parseJson', testResults, isFirst);
};
