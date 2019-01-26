'use strict';
TestSuite.errors=async function(testState={})
{
    TestRunner.clearResults(testState);

    var testResults=[];
    try{
    RoundingMode();
    TestRunner.failedToThrow(testResults, 'No parameter given.');
    }
   catch(e)
   {
       testResults.push({Expected: new Error('Impossible to round because divisible is undefined and magnitude is undefined.'), Actual: e, Description: 'No parameter given.'});
   }

    try{
    RoundingMode({});
    TestRunner.failedToThrow(testResults, 'Given an empty object.');
    }
   catch(e)
   {
       testResults.push({Expected: new Error('Impossible to round because divisible is undefined and magnitude is undefined.'), Actual: e, Description: 'Given an empty object.'});
   }

    try{
    RoundingMode(12);
    TestRunner.failedToThrow(testResults, 'Given not an object.');
    }
   catch(e)
   {
       testResults.push({Expected: new Error('Impossible to round because divisible is undefined and magnitude is undefined.'), Actual: e, Description: 'Given not an object.'});
   }

    try{
    RoundingMode({towards: 0});
    TestRunner.failedToThrow(testResults, 'Divisible and magnitude were both undefined.');
    }
   catch(e)
   {
       testResults.push({Expected: new Error('Impossible to round because divisible is undefined and magnitude is undefined.'), Actual: e, Description: 'Divisible and magnitude were both undefined.'});
   }

    try{
    RoundingMode({towards: 0, divisible: false, magnitude: null});
    TestRunner.failedToThrow(testResults, 'divisible and magnitude were both invalid.');
    }
   catch(e)
   {
       testResults.push({Expected: new Error('Impossible to round because divisible is undefined and magnitude is undefined.'), Actual: e, Description: 'divisible and magnitude were both invalid.'});
   }

    try{
    RoundingMode({towards: 0, divisible: 2, magnitude: 2});
    TestRunner.failedToThrow(testResults, 'Divisible and magnitude were both 2.');
    }
   catch(e)
   {
       testResults.push({Expected: new Error('Invalid state: divisible and magnitude cannot both be defined (divisible: 2, magnitude: 2).'), Actual: e, Description: 'Divisible and magnitude were both 2.'});
   }

    try{
    RoundingMode({towards: 0, divisible: 0});
    TestRunner.failedToThrow(testResults, 'Divisible was 0.');
    }
   catch(e)
   {
       testResults.push({Expected: new Error('Impossible to round because divisible is 0 or negative. In this case 0'), Actual: e, Description: 'Divisible was 0.'});
   }

    try{
    RoundingMode({towards: 0, divisible: -1});
    TestRunner.failedToThrow(testResults, 'Divisible was -1.');
    }
   catch(e)
   {
       testResults.push({Expected: new Error('Impossible to round because divisible is 0 or negative. In this case -1'), Actual: e, Description: 'Divisible was -1.'});
   }

    try{
    RoundingMode({towards: 0, magnitude: 1});
    TestRunner.failedToThrow(testResults, 'Magnitude was 1.');
    }
   catch(e)
   {
       testResults.push({Expected: new Error('Impossible to round because magnitude is 1, 0, or negative. In this case 1'), Actual: e, Description: 'Magnitude was 1.'});
   }

    try{
    RoundingMode({towards: 0, magnitude: 0});
    TestRunner.failedToThrow(testResults, 'Magnitude was 0.');
    }
   catch(e)
   {
       testResults.push({Expected: new Error('Impossible to round because magnitude is 1, 0, or negative. In this case 0'), Actual: e, Description: 'Magnitude was 0.'});
   }

    try{
    RoundingMode({towards: 0, magnitude: -2});
    TestRunner.failedToThrow(testResults, 'Magnitude was -2.');
    }
   catch(e)
   {
       testResults.push({Expected: new Error('Impossible to round because magnitude is 1, 0, or negative. In this case -2'), Actual: e, Description: 'Magnitude was -2.'});
   }

    try{
    RoundingMode({divisible: 2, away: 0, half: RoundingMode.Assert_Away_From_Half});
    TestRunner.failedToThrow(testResults, 'away and half were both defined (half: Assert_Away_From_Half).');
    }
   catch(e)
   {
       testResults.push({Expected: new Error('Invalid state: half can\'t be defined when towards or away is defined (' + JSON.stringify({away: 0}) + ').'), Actual: e, Description: 'away and half were both defined (half: Assert_Away_From_Half).'});
   }

    try{
    RoundingMode({magnitude: 2, towards: 0, half: RoundingMode.Up});
    TestRunner.failedToThrow(testResults, 'towards and half were both defined (half: Up).');
    }
   catch(e)
   {
       testResults.push({Expected: new Error('Invalid state: half can\'t be defined when towards or away is defined (' + JSON.stringify({towards: 0}) + ').'), Actual: e, Description: 'towards and half were both defined (half: Up).'});
   }

    try{
    RoundingMode({towards: 0, away: 0, divisible: 2});
    TestRunner.failedToThrow(testResults, 'Towards and away were both 0.');
    }
   catch(e)
   {
       testResults.push({Expected: new Error('Invalid state: towards and away cannot both be defined (towards: 0, away: 0).'), Actual: e, Description: 'Towards and away were both 0.'});
   }

    try{
    RoundingMode({away: 5, divisible: 10});
    TestRunner.failedToThrow(testResults, 'away was 5 and divisible: 10 (no half).');
    }
   catch(e)
   {
       testResults.push({Expected: new Error('The value of away must be 0, Infinity, or a number divisible by 10 but was 5 instead.'), Actual: e, Description: 'away was 5 and divisible: 10 (no half).'});
   }

    try{
    RoundingMode({towards: 5, magnitude: 10});
    TestRunner.failedToThrow(testResults, 'towards was 5 and magnitude: 10 (no half)');
    }
   catch(e)
   {
       testResults.push({Expected: new Error('The value of towards must be 0, Infinity, or a power of 10 but was 5 instead.'), Actual: e, Description: 'towards was 5 and magnitude: 10 (no half)'});
   }

    return TestRunner.displayResults('RoundingMode errors', testResults, testState);
};
TestSuite.silentChanges=async function(testState={})
{
    TestRunner.clearResults(testState);

    var testResults=[], round;

    try{
    var mode = {towards: {}, away: [], divisible: 2, half: 5};
    testResults.push({Expected: 4, Actual: RoundingMode(mode)(4), Description: 'RoundingMode({towards: {}, away: [], divisible: 2, half: 5})(4)'});
    } catch(e){testResults.push({Error: e, Description: 'Invalid: a, t, half'});}

    try{
    round = RoundingMode({divisible: 10, towards: -Infinity});
    testResults.push({Expected: 10, Actual: round(15), Description: 'away: Infinity given 15'});
    testResults.push({Expected: 10, Actual: round(19.99), Description: 'away: Infinity given 19.99'});
    testResults.push({Expected: -20, Actual: round(-10.01), Description: 'away: Infinity given -10.01'});
    testResults.push({Expected: -20, Actual: round(-15), Description: 'away: Infinity given -15'});
    } catch(e){testResults.push({Error: e, Description: 'T: -Infinity'});}

    try{
    round = RoundingMode({divisible: 10, away: -Infinity});
    testResults.push({Expected: 20, Actual: round(10.01), Description: 'towards: Infinity given 10.01'});
    testResults.push({Expected: 20, Actual: round(15), Description: 'towards: Infinity given 15'});
    testResults.push({Expected: -10, Actual: round(-15), Description: 'towards: Infinity given -15'});
    testResults.push({Expected: -10, Actual: round(-19.99), Description: 'towards: Infinity given -19.99'});
    } catch(e){testResults.push({Error: e, Description: 'A: -Infinity'});}

    try{
    round = RoundingMode({magnitude: 0.5, towards: 0});
    testResults.push({Expected: 4, Actual: round(7.99), Description: 'magnitude: 0.5, towards: 0 given 7.99'});
    testResults.push({Expected: 4, Actual: round(6), Description: 'magnitude: 0.5, towards: 0 given 6'});
    testResults.push({Expected: -4, Actual: round(-7.99), Description: 'magnitude: 0.5, towards: 0 given -7.99'});
    testResults.push({Expected: -4, Actual: round(-6), Description: 'magnitude: 0.5, towards: 0 given -6'});
    } catch(e){testResults.push({Error: e, Description: '1/magnitude'});}

    return TestRunner.displayResults('RoundingMode silentChanges', testResults, testState);
};
TestSuite.miscellaneous=async function(testState={})
{
    TestRunner.clearResults(testState);

    var testResults=[], round;

    try{
    round = RoundingMode({divisible: 2});
    testResults.push({Expected: 4, Actual: round(4), Description: 'divisible: 2 given 4'});
    } catch(e){testResults.push({Error: e, Description: 'Assert even'});}

    try{
    round = new RoundingMode({divisible: 2});
    testResults.push({Expected: 4, Actual: round(4), Description: 'using new: divisible: 2 given 4'});
    } catch(e){testResults.push({Error: e, Description: 'using new: Assert even'});}

    try{
    RoundingMode({divisible: 10})(9);
    TestRunner.failedToThrow(testResults, 'divisible: 10 given 9.');
    }
   catch(e)
   {
       testResults.push({Expected: new Error('Assertion failed: The number 9 is not rounded.'), Actual: e, Description: 'divisible: 10 given 9.'});
   }

    try{
    RoundingMode({divisible: 10, half: RoundingMode.Assert_Away_From_Half})(5);
    TestRunner.failedToThrow(testResults, 'divisible: 10, half: Assert_Away_From_Half given 5.');
    }
   catch(e)
   {
       testResults.push({Expected: new Error('Assertion failed: The number 5 is exactly half way.'), Actual: e, Description: 'divisible: 10, half: Assert_Away_From_Half given 5.'});
   }

    return TestRunner.displayResults('RoundingMode miscellaneous', testResults, testState);
};
TestSuite.destinations=async function(testState={})
{
    TestRunner.clearResults(testState);

    var testResults=[], round;

    try{
    round = RoundingMode({divisible: 10, towards: 100});
    testResults.push({Expected: 20, Actual: round(10.01), Description: 'divisible: 10, towards: 100 given 10.01'});
    testResults.push({Expected: 20, Actual: round(15), Description: 'divisible: 10, towards: 100 given 15'});
    testResults.push({Expected: -20, Actual: round(-25), Description: 'divisible: 10, towards: 100 given -25'});
    testResults.push({Expected: -20, Actual: round(-29.99), Description: 'divisible: 10, towards: 100 given -29.99'});
    } catch(e){testResults.push({Error: e, Description: 'T: 100 easy'});}

    try{
    round = RoundingMode({divisible: 10, towards: -10});
    testResults.push({Expected: 10, Actual: round(15), Description: 'divisible: 10, towards: -10 given 15'});
    testResults.push({Expected: 10, Actual: round(19.99), Description: 'divisible: 10, towards: -10 given 19.99'});
    testResults.push({Expected: -10, Actual: round(-0.01), Description: 'divisible: 10, towards: -10 given -0.01'});
    testResults.push({Expected: -10, Actual: round(-5), Description: 'divisible: 10, towards: -10 given -5'});
    } catch(e){testResults.push({Error: e, Description: 'T: -10 easy'});}

    try{
    round = RoundingMode({divisible: 10, towards: -10});
    testResults.push({Expected: 20, Actual: round(25), Description: 'divisible: 10, towards: -10 given 25'});
    testResults.push({Expected: 20, Actual: round(29.99), Description: 'divisible: 10, towards: -10 given 29.99'});
    testResults.push({Expected: -20, Actual: round(-25), Description: 'divisible: 10, towards: -10 given -25'});
    testResults.push({Expected: -20, Actual: round(-29.99), Description: 'divisible: 10, towards: -10 given -29.99'});
    } catch(e){testResults.push({Error: e, Description: 'T: -10'});}

    try{
    round = RoundingMode({divisible: 10, away: 10});
    testResults.push({Expected: 20, Actual: round(10.01), Description: 'divisible: 10, away: 10 given 10.01'});
    testResults.push({Expected: 20, Actual: round(15), Description: 'divisible: 10, away: 10 given 15'});
    testResults.push({Expected: -20, Actual: round(-10.01), Description: 'divisible: 10, away: 10 given -10.01'});
    testResults.push({Expected: -20, Actual: round(-15), Description: 'divisible: 10, away: 10 given -15'});
    } catch(e){testResults.push({Error: e, Description: 'A: 10'});}

    return TestRunner.displayResults('RoundingMode destinations', testResults, testState);
};
//need divisible/magnitude towards/away Infinity in order to completely test findNextUp and findNextDown
TestSuite.divisibleToInfinity=async function(testState={})
{
    TestRunner.clearResults(testState);

    var testResults=[];
    var mode = {divisible: undefined, towards: Infinity, toString: function(x){return 'divisible: '+this.divisible+', towards: '+this.towards+' given '+x;}};
    mode.divisible = 10;  //user convenient number
    var round = RoundingMode(mode);
    testResults.push({Expected: 10, Actual: round(10), Description: mode.toString(10)});
    testResults.push({Expected: 20, Actual: round(20), Description: mode.toString(20)});
    testResults.push({Expected: 20, Actual: round(10.01), Description: mode.toString(10.01)});
    testResults.push({Expected: 20, Actual: round(15), Description: mode.toString(15)});
    testResults.push({Expected: 20, Actual: round(19.99), Description: mode.toString(19.99)});

    mode.divisible = 4.5;  //machine convenient number (perfectly expressible in base 2) and is not a whole number
    round = RoundingMode(mode);
    //(4.5 * x). 1: 4.5; half: 6.75; 2: 9; half: 11.25; 3: 13.5
    testResults.push({Expected: 4.5, Actual: round(4.5), Description: mode.toString(4.5)});
    testResults.push({Expected: 9, Actual: round(9), Description: mode.toString(9)});
    testResults.push({Expected: 9, Actual: round(4.501), Description: mode.toString(4.501)});
    testResults.push({Expected: 9, Actual: round(6.75), Description: mode.toString('6.75 (half)')});
    testResults.push({Expected: 9, Actual: round(8.99), Description: mode.toString(8.99)});

    testResults.push({Expected: 0, Actual: round(0), Description: mode.toString(0)});
    testResults.push({Expected: 4.5, Actual: round(1), Description: mode.toString(1)});
    testResults.push({Expected: Infinity, Actual: round(Infinity), Description: mode.toString(Infinity)});
    testResults.push({Expected: -Infinity, Actual: round(-Infinity), Description: mode.toString(-Infinity)});
    testResults.push({Expected: NaN, Actual: round(NaN), Description: mode.toString(NaN)});
    testResults.push({Expected: NaN, Actual: round(), Description: mode.toString('nothing')});

    testResults.push({Expected: -4.5, Actual: round(-4.5), Description: mode.toString(-4.5)});
    testResults.push({Expected: -9, Actual: round(-9), Description: mode.toString(-9)});
    testResults.push({Expected: -4.5, Actual: round(-4.501), Description: mode.toString(-4.501)});
    testResults.push({Expected: -4.5, Actual: round(-6.75), Description: mode.toString(-6.75)});  //half
    testResults.push({Expected: -4.5, Actual: round(-8.99), Description: mode.toString(-8.99)});

    return TestRunner.displayResults('RoundingMode divisibleToInfinity', testResults, testState);
};
TestSuite.magnitudeToInfinity=async function(testState={})
{
    TestRunner.clearResults(testState);

    var testResults=[];
    var round = RoundingMode({magnitude: 10, towards: Infinity});
    testResults.push({Expected: 10, Actual: round(10), Description: 'magnitude: 10, towards: Infinity given 10'});
    testResults.push({Expected: 100, Actual: round(100), Description: 'magnitude: 10, towards: Infinity given 100'});
    testResults.push({Expected: 100, Actual: round(20), Description: 'magnitude: 10, towards: Infinity given 20'});
    testResults.push({Expected: 100, Actual: round(55), Description: 'magnitude: 10, towards: Infinity given 55'});
    testResults.push({Expected: 100, Actual: round(80), Description: 'magnitude: 10, towards: Infinity given 80'});

    //0.1 has notoriously bad precision however rounding will take care of that
    testResults.push({Expected: 0.1, Actual: round(0.1), Description: 'magnitude: 10, towards: Infinity given 0.1'});
    testResults.push({Expected: 0.01, Actual: round(0.002), Description: 'magnitude: 10, towards: Infinity given 0.002'});
    testResults.push({Expected: 0.01, Actual: round(0.0055), Description: 'magnitude: 10, towards: Infinity given 0.0055'});
    testResults.push({Expected: 0.01, Actual: round(0.008), Description: 'magnitude: 10, towards: Infinity given 0.008'});

    round = RoundingMode({magnitude: 8.5, towards: Infinity});
    testResults.push({Expected: 8.5, Actual: round(8.5), Description: 'magnitude: 8.5, towards: Infinity given 8.5'});
    testResults.push({Expected: 72.25, Actual: round(72.25), Description: 'magnitude: 8.5, towards: Infinity given 72.25'});
    testResults.push({Expected: 72.25, Actual: round(20), Description: 'magnitude: 8.5, towards: Infinity given 20'});
    testResults.push({Expected: 72.25, Actual: round(40.375), Description: 'magnitude: 8.5, towards: Infinity given 40.375'});
    testResults.push({Expected: 72.25, Actual: round(60), Description: 'magnitude: 8.5, towards: Infinity given 60'});

    //-1: 0.11764705882352941; half: 0.06574394463667815; -2: 0.01384083044982699
    testResults.push({Expected: 0.11764705882352941, Actual: round(0.11764705882352941), Description: 'magnitude: 8.5, towards: Infinity given 0.11764705882352941'});
    testResults.push({Expected: 0.11764705882352941, Actual: round(0.015), Description: 'magnitude: 8.5, towards: Infinity given 0.015'});
    testResults.push({Expected: 0.11764705882352941, Actual: round(0.06574394463667815), Description: 'magnitude: 8.5, towards: Infinity given 0.0657439446366782 (half)'});
    testResults.push({Expected: 0.11764705882352941, Actual: round(0.08), Description: 'magnitude: 8.5, towards: Infinity given 0.08'});

    round = RoundingMode({magnitude: 10, towards: Infinity});
    testResults.push({Expected: 0, Actual: round(0), Description: 'magnitude: 10, towards: Infinity given 0'});
    testResults.push({Expected: 1, Actual: round(1), Description: 'magnitude: 10, towards: Infinity given 1'});
    testResults.push({Expected: Infinity, Actual: round(Infinity), Description: 'magnitude: 10, towards: Infinity given Infinity'});
    testResults.push({Expected: -Infinity, Actual: round(-Infinity), Description: 'magnitude: 10, towards: Infinity given -Infinity'});
    testResults.push({Expected: NaN, Actual: round(NaN), Description: 'magnitude: 10, towards: Infinity given NaN'});
    testResults.push({Expected: NaN, Actual: round(), Description: 'magnitude: 10, towards: Infinity given nothing'});

    testResults.push({Expected: -10, Actual: round(-10), Description: 'magnitude: 10, towards: Infinity given -10'});
    testResults.push({Expected: -1000, Actual: round(-1000), Description: 'magnitude: 10, towards: Infinity given -1000'});
    testResults.push({Expected: -100, Actual: round(-200), Description: 'magnitude: 10, towards: Infinity given -200'});
    testResults.push({Expected: -100, Actual: round(-550), Description: 'magnitude: 10, towards: Infinity given -550'});
    testResults.push({Expected: -100, Actual: round(-800), Description: 'magnitude: 10, towards: Infinity given -800'});

    round = RoundingMode({magnitude: 8.5, towards: Infinity});
    //-1: 0.11764705882352941; half: 0.06574394463667815; -2: 0.01384083044982699
    testResults.push({Expected: -0.11764705882352941, Actual: round(-0.11764705882352941), Description: 'magnitude: 8.5, towards: Infinity given -0.11764705882352941'});
    testResults.push({Expected: -0.01384083044982699, Actual: round(-0.015), Description: 'magnitude: 8.5, towards: Infinity given -0.015'});
    testResults.push({Expected: -0.01384083044982699, Actual: round(-0.06574394463667815), Description: 'magnitude: 8.5, towards: Infinity given -0.0657439446366782 (half)'});
    testResults.push({Expected: -0.01384083044982699, Actual: round(-0.08), Description: 'magnitude: 8.5, towards: Infinity given -0.08'});

    return TestRunner.displayResults('RoundingMode magnitudeToInfinity', testResults, testState);
};
TestSuite.divisibleAwayInfinity=async function(testState={})
{
    TestRunner.clearResults(testState);

    var testResults=[];
    var mode = {divisible: undefined, away: Infinity, toString: function(x){return 'divisible: '+this.divisible+', away: '+this.away+' given '+x;}};
    mode.divisible = 10;  //user convenient number
    var round = RoundingMode(mode);
    testResults.push({Expected: 10, Actual: round(10), Description: mode.toString(10)});
    testResults.push({Expected: 30, Actual: round(30), Description: mode.toString(30)});
    testResults.push({Expected: 20, Actual: round(20.01), Description: mode.toString(20.01)});
    testResults.push({Expected: 20, Actual: round(25), Description: mode.toString(25)});
    testResults.push({Expected: 20, Actual: round(29.99), Description: mode.toString(29.99)});

    mode.divisible = 4.5;  //machine convenient number (perfectly expressible in base 2) and is not a whole number
    round = RoundingMode(mode);
    //(4.5 * x). 1: 4.5; half: 6.75; 2: 9; half: 11.25; 3: 13.5
    testResults.push({Expected: 4.5, Actual: round(4.5), Description: mode.toString(4.5)});
    testResults.push({Expected: 13.5, Actual: round(13.5), Description: mode.toString(13.5)});
    testResults.push({Expected: 9, Actual: round(9.01), Description: mode.toString(9.01)});
    testResults.push({Expected: 9, Actual: round(11.25), Description: mode.toString('11.25 (half)')});
    testResults.push({Expected: 9, Actual: round(13.499), Description: mode.toString(13.499)});

    testResults.push({Expected: 0, Actual: round(0), Description: mode.toString(0)});
    testResults.push({Expected: 0, Actual: round(1), Description: mode.toString(1)});
    testResults.push({Expected: Infinity, Actual: round(Infinity), Description: mode.toString(Infinity)});
    testResults.push({Expected: -Infinity, Actual: round(-Infinity), Description: mode.toString(-Infinity)});
    testResults.push({Expected: NaN, Actual: round(NaN), Description: mode.toString(NaN)});
    testResults.push({Expected: NaN, Actual: round(), Description: mode.toString('nothing')});

    testResults.push({Expected: -4.5, Actual: round(-4.5), Description: mode.toString(-4.5)});
    testResults.push({Expected: -13.5, Actual: round(-13.5), Description: mode.toString(-13.5)});
    testResults.push({Expected: -9, Actual: round(-4.501), Description: mode.toString(-4.501)});
    testResults.push({Expected: -9, Actual: round(-6.75), Description: mode.toString(-6.75)});
    testResults.push({Expected: -9, Actual: round(-8.99), Description: mode.toString(-8.99)});

    return TestRunner.displayResults('RoundingMode divisibleAwayInfinity', testResults, testState);
};
TestSuite.magnitudeAwayInfinity=async function(testState={})
{
    TestRunner.clearResults(testState);

    var testResults=[];
    var mode = {magnitude: undefined, away: Infinity, toString: function(){return 'magnitude: '+this.magnitude+', away: '+this.away+' given ';}};
    mode.magnitude = 10;  //user convenient number
    var round = RoundingMode(mode);
    testResults.push({Expected: 10, Actual: round(10), Description: mode+'10'});
    testResults.push({Expected: 1000, Actual: round(1000), Description: mode+'1000'});
    testResults.push({Expected: 100, Actual: round(200), Description: mode+'200'});
    testResults.push({Expected: 100, Actual: round(550), Description: mode+'550'});
    testResults.push({Expected: 100, Actual: round(800), Description: mode+'800'});

    //0.1 has notoriously bad precision however rounding will take care of that
    testResults.push({Expected: 0.1, Actual: round(0.1), Description: mode+'0.1'});
    testResults.push({Expected: 0.01, Actual: round(0.02), Description: mode+'0.02'});
    testResults.push({Expected: 0.01, Actual: round(0.055), Description: mode+'0.055'});
    testResults.push({Expected: 0.01, Actual: round(0.08), Description: mode+'0.08'});

    mode.magnitude = 8.5;  //machine convenient number (perfectly expressible in base 2) and is not a whole number
    round = RoundingMode(mode);
    //Math.pow(8.5, x). 2: 72.25; half: 415.4375; 3: 614.125
    testResults.push({Expected: 8.5, Actual: round(8.5), Description: mode+'8.5'});
    testResults.push({Expected: 72.25, Actual: round(72.25), Description: mode+'72.25'});
    testResults.push({Expected: 72.25, Actual: round(100), Description: mode+'100'});
    testResults.push({Expected: 72.25, Actual: round(415.4375), Description: mode+'415.4375 (half)'});
    testResults.push({Expected: 72.25, Actual: round(600), Description: mode+'600'});

    //0: 1; half: 0.6764705882352942; -1: 0.11764705882352941; half: 0.06574394463667815; -2: 0.01384083044982699
    testResults.push({Expected: 0.11764705882352941, Actual: round(0.11764705882352941), Description: mode+'0.11764705882352941'});
    testResults.push({Expected: 0.11764705882352941, Actual: round(0.9), Description: mode+'0.9'});
    testResults.push({Expected: 0.11764705882352941, Actual: round(0.6764705882352942), Description: mode+'0.6764705882352942 (half)'});
    testResults.push({Expected: 0.11764705882352941, Actual: round(0.5), Description: mode+'0.5'});

    mode.magnitude = 10; round = RoundingMode(mode);
    testResults.push({Expected: 0, Actual: round(0), Description: mode+'0'});
    testResults.push({Expected: 1, Actual: round(1), Description: mode+'1'});
    testResults.push({Expected: Infinity, Actual: round(Infinity), Description: mode+'Infinity'});
    testResults.push({Expected: -Infinity, Actual: round(-Infinity), Description: mode+'-Infinity'});
    testResults.push({Expected: NaN, Actual: round(NaN), Description: mode+'NaN'});
    testResults.push({Expected: NaN, Actual: round(), Description: mode+'nothing'});

    testResults.push({Expected: -10, Actual: round(-10), Description: mode+'-10'});
    testResults.push({Expected: -1000, Actual: round(-1000), Description: mode+'-1000'});
    testResults.push({Expected: -100, Actual: round(-20), Description: mode+'-20'});
    testResults.push({Expected: -100, Actual: round(-55), Description: mode+'-55'});
    testResults.push({Expected: -100, Actual: round(-80), Description: mode+'-80'});

    mode.magnitude = 8.5; round = RoundingMode(mode);
    //-1: 0.11764705882352941; half: 0.06574394463667815; -2: 0.01384083044982699
    testResults.push({Expected: -0.11764705882352941, Actual: round(-0.11764705882352941), Description: mode+'-0.11764705882352941'});
    testResults.push({Expected: -0.11764705882352941, Actual: round(-0.015), Description: mode+'-0.015'});
    testResults.push({Expected: -0.11764705882352941, Actual: round(-0.06574394463667815), Description: mode+'-0.0657439446366782 (half)'});
    testResults.push({Expected: -0.11764705882352941, Actual: round(-0.08), Description: mode+'-0.08'});

    return TestRunner.displayResults('RoundingMode magnitudeAwayInfinity', testResults, testState);
};
TestSuite.provided=async function(testState={})
{
    TestRunner.clearResults(testState);

    var testResults=[];
    var input = [5.5, 2.5, 1.6, 1.1, 1, -1, -1.1, -1.6, -2.5, -5.5];
    var output = [
      [6, 3, 2, 2, 1, -1, -1, -1, -2, -5],
      [5, 2, 1, 1, 1, -1, -2, -2, -3, -6],
      [6, 3, 2, 2, 1, -1, -2, -2, -3, -6],
      [5, 2, 1, 1, 1, -1, -1, -1, -2, -5],
      [6, 3, 2, 1, 1, -1, -1, -2, -2, -5],
      [5, 2, 2, 1, 1, -1, -1, -2, -3, -6],
      [6, 3, 2, 1, 1, -1, -1, -2, -3, -6],
      [5, 2, 2, 1, 1, -1, -1, -2, -2, -5],
      [6, 2, 2, 1, 1, -1, -1, -2, -2, -6]];
    var modeArray = [RoundingMode.Ceiling, RoundingMode.Floor, RoundingMode.Up, RoundingMode.Down, RoundingMode.Half_Ceiling, RoundingMode.Half_Floor, RoundingMode.Half_Up, RoundingMode.Half_Down, RoundingMode.Half_Even];
    var nameArray = ['Ceiling', 'Floor', 'Up', 'Down', 'Half_Ceiling', 'Half_Floor', 'Half_Up', 'Half_Down', 'Half_Even'];

   for (var modeIndex=0; modeIndex < modeArray.length; modeIndex++)
   {
      for (var inputIndex=0; inputIndex < input.length; inputIndex++)
      {
          try{
          testResults.push({Expected: output[modeIndex][inputIndex], Actual: modeArray[modeIndex](input[inputIndex]), Description: nameArray[modeIndex]+' when given '+input[inputIndex]});
          } catch(e){testResults.push({Error: e, Description: nameArray[modeIndex]});}
      }
   }

    try{
    testResults.push({Expected: 2, Actual: RoundingMode.Truncate(2.6), Description: 'Truncate when given 2.6'});
    testResults.push({Expected: -2, Actual: RoundingMode.Truncate(-2.6), Description: 'Truncate when given -2.6'});

    testResults.push({Expected: 3, Actual: RoundingMode.Half_Truncate(2.6), Description: 'Half_Truncate when given 2.6'});
    testResults.push({Expected: -3, Actual: RoundingMode.Half_Truncate(-2.6), Description: 'Half_Truncate when given -2.6'});
    testResults.push({Expected: 2, Actual: RoundingMode.Half_Truncate(2.5), Description: 'Half_Truncate when given 2.5'});
    testResults.push({Expected: -2, Actual: RoundingMode.Half_Truncate(-2.5), Description: 'Half_Truncate when given -2.5'});
    } catch(e){testResults.push({Error: e, Description: 'Truncate'});}

    try{
    RoundingMode.Assert_Away_From_Half(0);
    TestRunner.failedToThrow(testResults, 'RoundingMode.Assert_Away_From_Half given 0.');
    }
   catch(e)
   {
       testResults.push({Expected: new Error('Assertion failed: The number 0 is exactly half way.'), Actual: e, Description: 'RoundingMode.Assert_Away_From_Half given 0.'});
   }

    return TestRunner.displayResults('RoundingMode provided', testResults, testState);
};
