/**The LoggerObject is sent messages which are appended to the log's string. The log has depth 0 and is enabled by default.
This is not redundant with console.log because:
This log can be read on command (as opposed to when the log statement executes)
This log can be cleared, disabled, and has a few other functions
This log can return the log as a string which allows javascript string operations etc
This converts everything to strings but console.log displays differently depending on the type
console.log has fold sections in some cases but this log is plain text
plain text allows control F but the console doesn't
console.log includes file name and line number of the execution which gets in the way if you are trying to copy the text over to use control F
console.log might have errors and warnings etc which are added on page load (you should fix them if possible) but this log is created empty
console.log has no horizontal scrolling
This log adds 3 spaces per depth, this organization might make it easier to read

Personally the formatting, control F, and horizontal scrolling are the only real reasons I still have this logger
*/
function LoggerObject(enabled)
{
    //based on web file: www.wired.com/wired/webmonkey/stuff/simpledebug.js
    //from web page: http://www.webmonkey.com/2010/02/javascript_debugging_for_beginners/
    //Simple Debug, written by Chris Klimas licensed under the GNU LGPL. http://www.gnu.org/licenses/lgpl.txt

    if(enabled === undefined) enabled=true;
    var depth=0;
    var log_string='';

    /**(Must be enabled) Set depth to 0 and clear the log's string.*/
    this.clear=function(){if(enabled){depth=0; log_string='';}};
    /**Enables the log*/
    this.on=function(){enabled=true;};
    /**Disables the log*/
    this.off=function(){enabled=false;};
    /**(Must be enabled) Decreases the depth of the log*/
    this.up=function(){if(enabled) depth--;};
    /**(Must be enabled) Increases the depth of the log*/
    this.down=function(){if(enabled) depth++;};
   /**The log enables, calls functionName.apply(thisObject, parameterArray);, returns to previous enabled state, then returns the function's return value*/
   this.forceLogFunction=function(functionName, thisObject, parameterArray)
   {
       var enabledOld=enabled;
       enabled=true;  //force on
       var returnValue=functionName.apply(thisObject, parameterArray);
       enabled=enabledOld;  //reset back
       return returnValue;
   };
   /**The log enables, logs the text, then returns to previous enabled state*/
   this.forceLogText=function(textToLog)
   {
       var enabledOld=enabled;
       enabled=true;  //force on
       this.log_same(textToLog);
       enabled=enabledOld;  //reset back
   };
   /**(Must be enabled) The log goes down, calls functionName.apply(thisObject, parameterArray);, goes up, then returns the function's return value.
   If the log is disabled down and up are not called but the rest functions normally.*/
   this.trace=function(functionName, thisObject, parameterArray)
   {
       this.down();
       var returnValue=functionName.apply(thisObject, parameterArray);
       this.up();
       return returnValue;
   };
   /**(Must be enabled) Logs the message prepended with 3 spaces per depth*/
   this.log_same=function(message)
   {
       if(!enabled) return;  //all logging functions come here
       var whiteSpace='';
       for(var i=0; i < depth; i++){whiteSpace+='   ';}
       log_string+=(whiteSpace+message);
   };
   /**(Must be enabled) Logs the message appended with an end line and prepends 3 spaces per depth*/
   this.log=function(message){this.log_same(message+'\n');};
   /**(Must be enabled) Logs the current stack trace and indents them as needed.*/
   this.logStack=function()
   {
       var currentStack = new Error().stack;
       currentStack = currentStack.split('\n');
       currentStack.remove(0);  //Error.toString()
       currentStack.remove(0);  //location of this function (logStack)
       this.log(currentStack[0].trim());  //log the calling function
       currentStack.remove(0);
       this.down();
       currentStack.forEach(function(value){Logger.log(value.trim());});
          //logs the rest with 1 more depth
       this.up();
   };
   /**(Must be enabled) clears the log then returns what the contents were*/
   this.dump_log=function()
   {
       if(!enabled) return;
       var message=log_string;
       this.clear();
       return message;
   };
    /**(Must be enabled) This returns the log contents as a string*/
    this.print=function(){if(enabled) return log_string;};
   /**(Must be enabled) Logs the properties an object possesses. But not inherited ones or ones with undefined value it also ignores functions*/
   this.log_all_properties=function(obj)
   {
       if(!enabled) return;
       if(typeof(obj) !== 'object'){this.log('Parameter is not an object'); return;}
       if(obj === null){this.log('Parameter is null'); return;}
       var message='Object possesses these properties: ';
       var valueArray=[];
      for (var i in obj)
      {
          if(obj[i] !== undefined && !(obj[i] instanceof Function) && obj.hasOwnProperty(i)) valueArray.push(i);
      }
       message+=valueArray.toString().replace(',', ', ');  //change "0,1,2" to "0, 1, 2"
       this.log(message);
   };
   /**(Must be enabled) Logs the properties and values an object possesses. But not inherited ones or ones with undefined value it also ignores functions
   The output for this can get very large. JSON notation is used for the string returned.*/
   this.log_all_property_values=function(obj)
   {
       if(!enabled) return;
       if(typeof(obj) !== 'object'){this.log('Parameter is not an object'); return;}
       if(obj === null){this.log('Parameter is null'); return;}
       var result={};
      for (var i in obj)
      {
          if(obj[i] !== undefined && !(obj[i] instanceof Function) && obj.hasOwnProperty(i)) result[i]=obj[i];
      }
       this.log(JSON.stringify(result));
   };
   /**(Must be enabled) Logs the function names an object possesses. But not inherited ones.*/
   this.log_all_functions=function(obj)
   {
       if(!enabled) return;
       if(typeof(obj) !== 'object'){this.log('Parameter is not an object'); return;}
       if(obj === null){this.log('Parameter is null'); return;}
       var message='Object possesses these functions: ';
       var valueArray=[];
      for (var i in obj)
      {
          if(obj[i] !== undefined && (obj[i] instanceof Function) && obj.hasOwnProperty(i)) valueArray.push(i);
      }
       message+=valueArray.toString().replace(',', ', ');  //change "0,1,2" to "0, 1, 2"
       this.log(message);
   };
}
const Logger = new LoggerObject(false);
