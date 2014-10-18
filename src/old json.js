function parseJson(text)
{
    var stripped = text.replace(/"(?:\\.|[^"\\])*"/g, '');  //remove all strings
    stripped = stripped.replace(/\b(null|true|false)\b/g, '');  //remove all literal reserved words
    stripped = stripped.replace(/\b[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?\b/g, '');  //remove all numbers
    stripped = stripped.replace(/[,:{}\[\]\s]+/g, '');  //remove all remaining valid JSON characters
    if(stripped !== '') return;  //if it still contains any characters then it is not valid
       //this line is important! Do not eval it as it could have injected code
    try{return eval('(' + text + ')');}
    catch(e){}  //if invalid return undefined
}
