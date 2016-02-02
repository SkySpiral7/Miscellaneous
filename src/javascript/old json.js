function parseJson(text)
{
    text+='';  //null safe toString
    var stripped = text.replace(/"(?:\\.|[^"\\])*"/g, '');  //remove all strings
    stripped = stripped.replace(/\b(null|true|false)\b/g, '');  //remove all literal reserved words
    stripped = stripped.replace(/\b[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?\b/g, '');  //remove all numbers. hex and binary are not allowed in JSON
    stripped = stripped.replace(/[,:{}\[\]\s]+/g, '');  //remove all remaining valid JSON characters (valid quotes have already been removed)
    if(stripped !== '') return;  //if it still contains any characters then it is not valid
       //this line is important! Do not call eval because text could have injected code
    try{return eval('(' + text + ')');}  //note that an object might not be returned. "0" is valid JSON which will return a primitive
    catch(e){}  //if invalid structure return undefined
}
