function parseJson(text)
{
   text += '';  //null safe toString (if symbol exists then use JSON.parse instead)
   var stripped = text.replace(/"(?:\\.|[^"\\])*"/g, '""');  //make all strings empty (for the next couple checks)
   stripped = stripped.replace(/\xA0/g, ' ');  //replace non-breaking space with a regular space
   stripped = stripped.replace(/^\uFEFF?\s+|\s+$/g, '');  //trim. also removes UTF-16 BOM
   stripped = stripped.replace(/\s*([,:{}[\]])\s*/g, '$1');  //remove whitespace only around places where it is allowed
   if((/\s/).test(stripped)) return;  //invalid whitespace
   if((/\{[^"}]/).test(stripped)) return;  //objects must be empty or start with a string
   if((/[^,:[]\[/).test(','+stripped)) return;  //arrays can only come after comma, colon, or open array (or as the whole input)
   if((/[\w.\]}]"/).test(stripped) || (/"[\w.[{]/).test(stripped)) return;  //invalid string location
   if((/[,:]{2,}/).test(stripped)) return;  //invalid separators
   stripped = stripped.replace(/""[,:]?/g, '');  //remove all strings elements

   stripped = stripped.replace(/\b(?:null|true|false)(?:,|\b)/g, '');  //remove all literal reserved words
   stripped = stripped.replace(/\b-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?(?:,|\b)/g, '');  //remove all numbers. hex and binary are not allowed in JSON
      //it can't have a leading +, there must be a digit before the decimal, if a decimal exists there must be a digit after it: http://www.json.org/

   while ((/\[\]/).test(stripped) || (/\{\}/).test(stripped))
   {
      stripped = stripped.replace(/\[\],?/g, '');
      stripped = stripped.replace(/\{\},?/g, '');
   }
   if('' !== stripped) return;  //if it still contains any characters then it is not valid
      //this line is important! Do not call eval because text could have injected code

   try{return eval('(' + text + ')');}  //note that an object might not be returned. "0" is valid JSON which will return a primitive
   catch(e){}  //if invalid structure return undefined
}
//TODO: this has become large enough that I should make a state machine and compare the size
