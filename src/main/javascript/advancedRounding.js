if(undefined === Math.trunc){Math.trunc = function(x){return x - (x % 1);}}  //~~x fails for 1.7976931348623157e+308

/**Simply allows using logarithmic functions with bases other than Math.E.
It is type strict. num is the number to perform the logarithm on and base is the logarithm base.
EG: Math.logBaseX(100, 10) returns 2 because Math.pow(10, 2) returns 100.
Note that this function has below average precision: Math.logBaseX(0.1, 10) returns -0.9999999999999998*/
Math.logBaseX = function(num, base)
{
    if(typeof(num) !== 'number' || typeof(base) !== 'number') return NaN;  //type strict
    if(base === 0 || base === 1 || !Number.isFinite(base)) return NaN;  //log is impossible for these bases
       //these must be handled directly because otherwise it would return 0, Infinity, 0 (for +Infinity) or NaN (for -Infinity and NaN)
    return (Math.log(num) / Math.log(base));  //will return NaN if either parameter is NaN
    //will also return NaN if either parameter is negative.
    //will return +/-Infinity if num is +/-Infinity
};

//TODO: test Half_Mode and delta
/**Half_Mode exists for short-hand. Passing it into RoundingMode as half will create a half function that uses
the same divisible/magnitude (and delta) except rounding up or down.
Eg:
new RoundingMode({divisible: 2, half: Half_Mode.Up}) === new RoundingMode({divisible: 2, half: new RoundingMode({divisible: 2, away: 0})})
*/
var Half_Mode = {Up: {}, Down: {}};

/**RoundingMode creates and returns a function that takes a number and rounds it.
The number is rounded according to the rules passed into RoundingMode initially.
The options should be in a json object passed into RoundingMode. And the options are:
away and towards: these are the basic 2 options. The only valid values are Infinity and 0.
    They represent how to round numbers that are not already rounded. These 2 options are exclusive.
    For example towards: 0 means that numbers should always be truncated to the nearest valid number.
divisible: Given any number this option indicates to round to the nearest number that is divisible by this option's value.
    For example divisible: 2 says to round to even numbers. divisible: 0.5 says to round to halves.
    divisible and magnitude are exclusive
magnitude: Given any number this option indicates to round to the nearest number that is a power of this option's value.
    For example magnitude: 10 might round to 100 or 0.1. magnitude: 2 might round to 2, 0.25, 32, or 1024.
    divisible and magnitude are exclusive
half: this is a function that will be called if the number is exactly half way between 2 valid destinations.
    half is passed that number. half can also be set to a Half_Mode in which case it will be converted into a function.
delta: this is an advanced option: under most conditions do not specify this value.
    this number will be passed to closeEnoughToWhole and withinDelta.
    this is done to ensure the mathematical correctness of Math.logBaseX (and division) which otherwise has below average precision.
    only specify this option if either you have made Math.logBaseX more precise or if you know that the default delta is not appropriate for your environment.

The returned function takes 1 parameter which is the number to be rounded (type strict).
And will return that number rounded according to the RoundingMode rules used to create the function or NaN.

Visual of all 5 rounding directions:
| -Infinity --> 0 --> Infinity | Ceiling. towards: Infinity (same as away: -Infinity)
| -Infinity <-- 0 <-- Infinity | Floor. away: Infinity (same as towards: -Infinity)
| -Infinity --> 0 <-- Infinity | Down. towards: 0
| -Infinity <-- 0 --> Infinity | Up. away: 0
| (x-1) <-- x (half) --> (x+1) | provide any function for half (including Assert_Away_From_Half)

Random notes:
delta defaults to Number.EPSILON * 2, everything else defaults to undefined.
if half is not undefined (including Assert_Away_From_Half) then it will round away from the half way point
new RoundingMode(options) === RoundingMode(options)

Quirks:
given RoundingMode(options)(x) if the options uses magnitude and x < 0. then the valid magnitudes are negative.
    for example: RoundingMode({magnitude: 10, towards: 0})(-10.5) returns -10
if RoundingMode(options)(0) and magnitude is used, 0 is returned because Math.pow(x, Infinity) === 0
    more generally RoundingMode(options)(0) always returns 0 ignoring all options. even if away: 0 is specified.

There are also predefined static rounding functions which are:
Ceiling, Floor, Up, Down, Half_Even, Half_Ceiling, Half_Floor, Half_Up, Half_Down
There's also:
RoundingMode.Truncate = RoundingMode.Down; RoundingMode.Half_Truncate = RoundingMode.Half_Down;
RoundingMode.Assert_Away_From_Half = function(x){throw new Error('Rounding occurred when the number ' + x + ' was passed in.');};
Example usage: RoundingMode.Floor(-1.5) returns -2
See definitions at the bottom for more details.

having towards, away, and half all be undefined can be used to assert that a number is already rounded.
for example: RoundingMode({divisible: 10})(20) returns 20 but RoundingMode({divisible: 10})(7) throws.
Therefore the divisible/ magnitude pair is the only required parameter.
The predefined rounding modes will never throw (except Assert_Away_From_Half although that's just a function not a rounding mode).

RoundingMode.Assert_Away_From_Half is used when rounding away from half is desired but it isn't possible for exactly half to occur
For example:
RoundingMode.Half_Even = RoundingMode({divisible: 1, half: RoundingMode({divisible: 2, half: RoundingMode.Assert_Away_From_Half})});
it is not possible to be half way between whole numbers and also half way between even numbers
therefore it rounds to the nearest whole followed by the nearest even

The predefined RoundingModes are common rounding schemes to use. The names (and the name of this function) are based on java.math.RoundingMode.
Note that Math.floor == RoundingMode.Floor; Math.ceil == RoundingMode.Ceiling; Math.round == RoundingMode.Half_Ceiling
    According to the Java API of RoundingMode, Half_Up is the scheme normally taught in school however this is not the same rounding that Math.round uses.
    Half_Up does make more sense because it rounds to edges ensuring that ranges always contain the intended number.

More info copied from java.math.RoundingMode api:
Half_Even: Note that this is the rounding mode that statistically minimizes cumulative error when applied repeatedly over
    a sequence of calculations. It is sometimes known as "Banker's rounding," and is chiefly used in the USA. This
    rounding mode is analogous to the rounding policy used for float and double arithmetic in Java.
*/
//Note that in the comments of this document the term destination may be used to refer to the value of towards/ away
function RoundingMode(options)
{
    if(!(options instanceof Object)) options = {};
    var towards = options.towards;
    var away = options.away;
    var divisible = options.divisible;
    var magnitude = options.magnitude;
    var half = options.half;
    var delta = options.delta;
    /**You may also give customFunction instead of divisible or magnitude. customFunction must take a number and return boolean.
    customFunction(x) returns true if x is an acceptable number to round to.
    Correction: since it is not feasible to count floating point numbers the user would instead need to provide 2 functions:
    findNextUp(x) and findNextDown(x) which return numbers that are away: x (this is used by all rounding schemes).
    Since this functionality would require effort it is not programmed at all because I can't think of a reason anyone would use it.*/

   {  //defaulting block. used for grouping. there is no block scope in js
    //these are silent changes. invalid values are treated as though they don't exist
    if(typeof(towards) !== 'number' || Number.isNaN(towards)) towards = undefined;
    if(typeof(away) !== 'number' || Number.isNaN(away)) away = undefined;
    if(typeof(divisible) !== 'number' || !Number.isFinite(divisible)) divisible = undefined;
    if(typeof(magnitude) !== 'number' || !Number.isFinite(magnitude)) magnitude = undefined;
    if(typeof(delta) !== 'number' || !Number.isFinite(delta)) delta = Number.EPSILON * 2;
    if(typeof(half) !== 'function' && half != Half_Mode.Up && half != Half_Mode.Down) half = undefined;
    else if(Half_Mode.Up === half) half = new RoundingMode({away: 0, divisible: divisible, magnitude: magnitude, delta: delta});
    else if(Half_Mode.Down === half) half = new RoundingMode({towards: 0, divisible: divisible, magnitude: magnitude, delta: delta});
   }  //all values are now valid types

    var usesDivisible = (divisible !== undefined);  //short hands for readability
    var usesMagnitude = (magnitude !== undefined);
    var destination = towards;
    if(destination === undefined) destination = away;  //if both are defined it will throw

   {  //conversion block
    if(towards === -Infinity && away === undefined){towards = undefined; destination = away = Infinity;}  //translate these
    else if(away === -Infinity && towards === undefined){away = undefined; destination = towards = Infinity;}  //not explicitly in the doc because it is easier to think in terms of +Infinity
       //check that the other is undefined because if both are defined I want to throw instead
    if(usesMagnitude && magnitude > 0 && magnitude < 1) magnitude = 1/magnitude;  //same result but I need 1 < magnitude for the formulas
       //don't change the number if it is negative so that I can tell the user the invalid number
   }  //the state is now consistent
   {  //validation block
    if(!usesDivisible && !usesMagnitude) throw new Error('Impossible to round because divisible is undefined and magnitude is undefined.');
    if(usesDivisible && usesMagnitude) throw new Error('Invalid state: divisible and magnitude cannot both be defined (divisible: ' + divisible + ', magnitude: ' + magnitude + ').');
    if(divisible <= 0) throw new Error('Impossible to round because divisible is 0 or negative. In this case ' + divisible);
    if(magnitude <= 0 || magnitude === 1) throw new Error('Impossible to round because magnitude is 1, 0, or negative. In this case ' + magnitude);
    if(half !== undefined && destination !== undefined) throw new Error('Invalid state: half can\'t be defined when towards or away is defined (' + JSON.stringify({towards: towards, away: away}) + ').');
    if(towards !== undefined && away !== undefined) throw new Error('Invalid state: towards and away cannot both be defined (towards: ' + towards + ', away: ' + away + ').');
    //if(destination === undefined && half === undefined) this state is valid.
       //it is used to assert that a number is already rounded. since if it isn't rounded an error is thrown
    //if(destination === undefined && half === RoundingMode.Assert_Away_From_Half) this state is valid.
       //it is used to round away from half and assert that it will not be half (such as Half_Even)

   if (destination !== undefined && destination !== 0 && destination !== Infinity)
   {
       var errorMessage = 'The value of ';
       if(away !== undefined) errorMessage+='away';
       else errorMessage+='towards';
       errorMessage+=' must be 0, Infinity, or a ';

       if(usesDivisible && (destination % divisible) !== 0) errorMessage += 'number divisible by ' + divisible;
       else if(usesMagnitude && !closeEnoughToWhole(Math.logBaseX(Math.abs(destination), magnitude), delta))
          errorMessage += 'power of ' + magnitude;
       else errorMessage = undefined;

       if(errorMessage !== undefined) throw new Error(errorMessage + ' but was ' + destination + ' instead.');
   }
   }  //the state is now valid (as far as I can tell)

   /**This function has no documentation instead see the doc of RoundingMode which created this function.*/
   return function(target)
   {
       if(typeof(target) !== 'number' || Number.isNaN(target)) return NaN;
       if(Math.abs(target) === Infinity) return target;  //done. for the same reason as 0 below
       if(target === 0) return target;  //0 is already rounded because it is divisible by all numbers also I can't %0
          //I see the irony that away: 0 may return 0 but it is mathematically correct to do so
          //if usesMagnitude then it is not possible to round away from 0 when target is 0
          //because when trying to find the smallest number that is greater it will try to count to -Infinity
       if(usesDivisible && (target % divisible) === 0) return target;  //already rounded
       if(usesMagnitude && target === 1) return target;  //1 is already rounded because anything to the power of 0 is 1 (magnitude can't be 0)
       if(usesMagnitude && closeEnoughToWhole(Math.logBaseX(Math.abs(target), magnitude), delta)) return target;  //already rounded
       if(destination === undefined && half === undefined) throw new Error('Assertion failed: The number ' + target + ' is not rounded.');
       var above = findNextUp(target);
       if(above === target) return target;  //already rounded. this is checked again in case of precision error. I don't know if this is possible
       var below = findNextDown(above);
       var halfWayPoint = (((above - below)/2) + below);  //(above - below) is distance, /2 for half way, and +below for it to be in range
          //below+(divisible/2) only works because the distance is always equal to divisible. this isn't true for magnitude

      if (destination === undefined)  //half is defined at this point
      {
          //round away from half if possible
          if(withinDelta(target, halfWayPoint, delta)) return half(target);  //if not possible then call half
          //hopefully half is either RoundingMode.Assert_Away_From_Half (assertion failed) or a function made from RoundingMode
          //need to start with seeing if it is close enough to half so that the other checks can use normal greater/less than

          if(target > halfWayPoint) return above;
          //if(target < halfWayPoint)
          return below;
      }
       if(towards === Infinity) return above;
       if(away === Infinity) return below;
       //must be handled directly for short hand and because I can't subtract them

       var aboveDistance = Math.abs(destination - above);
       var belowDistance = Math.abs(destination - below);
       /*
       if(aboveDistance === belowDistance) this isn't possible at this point but it isn't obvious why so I'll explain:
          1) findNextUp starts at target and counts to Infinity until it reaches a valid result (if target is rounded then above === target)
          2) findNextDown returns the next valid result that is closer to -Infinity than above (and thus -Infinity < below < target <= above < Infinity)
          3) target is not already rounded (and thus below !== target and above !== target therefore -Infinity < below < target < above < Infinity)
          4) destination is defined and half is not (so don't round away from half)
          5) destination is a valid number to round to
          6) there are only 2 ways for above and below to have the same distance: if(below < destination < above) or if(above === below)
          #3 proves that above !== below
          and below < destination < above is not possible because one of them will stop when destination is reached and therefore:
          if(destination < target){destination <= below < above} if(destination > target){below < above <= destination} (recall #3 proves that destination !== target)
          since both paths of #6 have been disproven: it isn't true.
       */
      if (away !== undefined)
      {
          if(aboveDistance > belowDistance) return above;
          return below;
      }
      //towards is defined
       if(aboveDistance < belowDistance) return above;
       return below;

      /**Starting at target this counts towards +Infinity until the next valid result is found (which might be target).
      Since it is not feasible (or necessary) to count floating point numbers instead it counts numbers
      which are known to be rounded until the nearest is found. The result is 0 < target <= result < Infinity.
      Or if target is negative: -Infinity < target <= result < 0.*/
      function findNextUp(target)
      {
          var result = 0;
         if (usesDivisible)
         {
             while(result > target){result-=divisible;}  //count down until I am below (or equal)
             while(result < target){result+=divisible;}  //count up to reach the lowest number that is above (or equal)
             //must count up then down to account for both positive and negative
             return result;
             //I can't use Math.ceil(target / divisible); because it fails when divisible is not a whole number
         }

         //usesMagnitude
          result = 1;
          var absTarget = Math.abs(target);
          while(result > absTarget){result/=magnitude;}  //result is counting towards 0 until 0 < result <= absTarget
             //target !== 0 because that's the first thing we checked in the calling function
          while(result < absTarget){result*=magnitude;}  //result is counting towards Infinity until 0 < absTarget <= result < Infinity
          //must count up then down to account for both 0 < Math.abs(target) < 1 and 1 < Math.abs(target)
          if(target > 0) return result;  //0 < target <= result < Infinity
          return -(result/magnitude);  //need to go down 1 because flipping the sign gives:
             //-Infinity < result <= target < 0 (entire thing backwards)
             //example: {magnitude: 10, target: -200} finds result: 10^3 which is 0 < 200 <= 1000 < Infinity
             //but when flipped is: -Infinity < -1000 <= -200 < 0. therefore need /=magnitude to make it be -Infinity < -200 < -10 <= 0 (above is never 0 for magnitude)
          //I can't use Math.ceil(Math.logBaseX(Math.abs(target), magnitude)); because it fails when 0 < Math.abs(target) < 1
      };

      /**This function returns the next valid result that is closer to -Infinity than above (below is never equal to above).
      thus making -Infinity < below < target <= above < Infinity.*/
      function findNextDown(above)
      {
          //if(target === above) return target;  //this isn't possible because it checks to see if target is already rounded before calling findNextUp
          if(usesDivisible) return (above - divisible);
         //usesMagnitude
          if(above > 0) return (above / magnitude);  //if positive return a number closer to 0
          return (above * magnitude);  //if negative return a number closer to -Infinity
      };
   };
   /**@returns true if num is within a delta of a whole number.*/
   function closeEnoughToWhole(num, delta)
   {
      var absNum = Math.abs(num);
      var lowerBound = Math.trunc(absNum);
      var upperBound = lowerBound + 1;
      return (withinDelta(absNum, lowerBound, delta) || withinDelta(absNum, upperBound, delta));
   }
   /**@returns true if the distance between first and second is a maximum of delta*/
   function withinDelta(first, second, delta)
   {
      return Math.abs(first - second) <= delta;
   }
};
RoundingMode.Assert_Away_From_Half = function(x){throw new Error('Assertion failed: The number ' + x + ' is exactly half way.');};
RoundingMode.Ceiling = RoundingMode({towards: Infinity, divisible: 1});
RoundingMode.Floor = RoundingMode({away: Infinity, divisible: 1});
RoundingMode.Up = RoundingMode({away: 0, divisible: 1});
RoundingMode.Down = RoundingMode({towards: 0, divisible: 1});
RoundingMode.Truncate = RoundingMode.Down;  //aka

RoundingMode.Half_Even = RoundingMode({divisible: 1, half: RoundingMode({divisible: 2, half: RoundingMode.Assert_Away_From_Half})});
RoundingMode.Half_Ceiling = RoundingMode({divisible: 1, half: RoundingMode.Ceiling});
RoundingMode.Half_Floor = RoundingMode({divisible: 1, half: RoundingMode.Floor});
RoundingMode.Half_Up = RoundingMode({divisible: 1, half: RoundingMode.Up});
RoundingMode.Half_Down = RoundingMode({divisible: 1, half: RoundingMode.Down});
RoundingMode.Half_Truncate = RoundingMode.Half_Down;  //aka

/*Fermi Estimation is not a formula (estimations don't have formulas):
it's the idea of rounding wildly to estimate a problem (doesn't need to be base 10).
if it had a formula it would be a type of rounding but it is only an estimation strategy
and therefore doesn't belong here. The formula from https://what-if.xkcd.com/84/
is used for 2 joke images but isn't actually used for the numbers in the problem.*/
