'use strict';
TestSuite.parseJson=function(testState={})
{
   TestRunner.clearResults(testState);

   var assertions = [], expected, actual, input;

   try{
   actual = parseJson('+{ "valueOf": self["location"],'+
      '"toString": []["join"],'+
      '0: "javascript:alert(1)",'+
      '"length": 1'+
      '}');
   //JSON.parse would throw with a specific error message
   assertions.push({Expected: undefined, Actual: actual, Description: 'Rejects known attack vector'});
   } catch(e){assertions.push({Error: e, Description: 'Rejects known attack vector'});}

   try{
   input = '  {"valueOf": "I am, | very {} []"}\n';
   actual = parseJson(input);
   expected = JSON.parse(input);
   assertions.push({Expected: expected, Actual: actual, Description: 'Allows strings and trims'});
   } catch(e){assertions.push({Error: e, Description: 'Allows strings and trims'});}

   try{
   input = '{"valueOf"   \n : "You say \\" and \\n but I say \\\\"  ,"key"\t:5}';
   actual = parseJson(input);
   expected = JSON.parse(input);
   assertions.push({Expected: expected, Actual: actual, Description: 'Allows string escapes and removes valid whitespace'});
   } catch(e){assertions.push({Error: e, Description: 'Allows string escapes and removes valid whitespace'});}

   try{
   actual = parseJson('{5: 5}');
   assertions.push({Expected: undefined, Actual: actual, Description: 'Object key must be string'});
   } catch(e){assertions.push({Error: e, Description: 'Object key must be string'});}

   try{
   input = '[{"valueOf": ["sort"]}]';
   actual = parseJson(input);
   expected = JSON.parse(input);
   assertions.push({Expected: expected, Actual: actual, Description: 'Allows string array and root array'});
   } catch(e){assertions.push({Error: e, Description: 'Allows string array and root array'});}

   try{
   actual = parseJson('{"valueOf": []["sort"]}');
   assertions.push({Expected: undefined, Actual: actual, Description: 'Rejects []["function name"]'});
   } catch(e){assertions.push({Error: e, Description: 'Rejects []["function name"]'});}

   try{
   actual = parseJson('{"valueOf": null["sort"]}');
   assertions.push({Expected: undefined, Actual: actual, Description: 'Rejects null["function name"]'});
   } catch(e){assertions.push({Error: e, Description: 'Rejects null["function name"]'});}

   try{
   actual = parseJson('["me"false]');
   assertions.push({Expected: undefined, Actual: actual, Description: 'Rejects string before word'});
   } catch(e){assertions.push({Error: e, Description: 'Rejects string before word'});}

   try{
   actual = parseJson('[false"me"]');
   assertions.push({Expected: undefined, Actual: actual, Description: 'Rejects string after word'});
   } catch(e){assertions.push({Error: e, Description: 'Rejects string after word'});}

   try{
   actual = parseJson('[,,,,]');
   assertions.push({Expected: undefined, Actual: actual, Description: 'Rejects multiple separators'});
   } catch(e){assertions.push({Error: e, Description: 'Rejects multiple separators'});}

   try{
   input = '{"valueOf": [true, false, null]}';
   actual = parseJson(input);
   expected = JSON.parse(input);
   assertions.push({Expected: expected, Actual: actual, Description: 'Allows true, false, and null'});
   } catch(e){assertions.push({Error: e, Description: 'Allows true, false, and null'});}

   try{
   actual = parseJson('{"valueOf": falsefalse}');
   assertions.push({Expected: undefined, Actual: actual, Description: 'Rejects variables (false must be whole word)'});
   } catch(e){assertions.push({Error: e, Description: 'Rejects variables (false must be whole word)'});}

   try{
   actual = parseJson('{"valueOf": false false}');
   assertions.push({Expected: undefined, Actual: actual, Description: 'Rejects invalid whitespace'});
   } catch(e){assertions.push({Error: e, Description: 'Rejects invalid whitespace'});}

   try{
   input = '0.25e1';
   actual = parseJson(input);
   expected = JSON.parse(input);
   assertions.push({Expected: expected, Actual: actual, Description: 'Allows numbers'});
   } catch(e){assertions.push({Error: e, Description: 'Allows numbers'});}

   try{
   actual = parseJson('{"valueOf": 0..e}');
   assertions.push({Expected: undefined, Actual: actual, Description: 'Rejects invalid number (e is a function)'});
   } catch(e){assertions.push({Error: e, Description: 'Rejects invalid number (e is a function)'});}

   try{
   actual = parseJson('+{}');
   assertions.push({Expected: undefined, Actual: actual, Description: 'Rejects stray characters'});
   } catch(e){assertions.push({Error: e, Description: 'Rejects stray characters'});}

   try{
   actual = parseJson('{"key":');
   assertions.push({Expected: undefined, Actual: actual, Description: 'Rejects invalid structure'});
   } catch(e){assertions.push({Error: e, Description: 'Rejects invalid structure'});}

   try{
   actual = parseJson('[null"val":,]');
   assertions.push({Expected: undefined, Actual: actual, Description: 'Rejects invalid structure'});
   } catch(e){assertions.push({Error: e, Description: 'Rejects invalid structure'});}

   return TestRunner.displayResults('oldJson: parseJson', assertions, testState);
};
