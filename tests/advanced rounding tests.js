//TODO: make new github and pull it. move that .git to my git folder. put this project in git folder. push to github
Tester.errors=function(isFirst)
{
    TesterUtility.clearResults(isFirst);

    var testResults=[];
    var catchFailed = function(action, description){return {Expected: 'throw', Actual: 'return', Action: action, Description: description};};
    var actionTaken;
    try{
    actionTaken='Nothing';
    RoundingMode();
    testResults.push(catchFailed(actionTaken, 'Failed to throw when no parameter given.'));
    }
   catch(e)
   {
       testResults.push({Expected: new Error('Impossible to round because divisible is undefined and magnitude is undefined.'), Actual: e, Action: actionTaken, Description: 'No parameter given.'});
   }

    try{
    actionTaken='Empty';
    RoundingMode({});
    testResults.push(catchFailed(actionTaken, 'Failed to throw when given an empty object.'));
    }
   catch(e)
   {
       testResults.push({Expected: new Error('Impossible to round because divisible is undefined and magnitude is undefined.'), Actual: e, Action: actionTaken, Description: 'Given an empty object.'});
   }

    try{
    actionTaken='Invalid';
    RoundingMode(12);
    testResults.push(catchFailed(actionTaken, 'Failed to throw when given not an object.'));
    }
   catch(e)
   {
       testResults.push({Expected: new Error('Impossible to round because divisible is undefined and magnitude is undefined.'), Actual: e, Action: actionTaken, Description: 'Given not an object.'});
   }

    try{
    actionTaken='No divisible';
    RoundingMode({towards: 0});
    testResults.push(catchFailed(actionTaken, 'Failed to throw when divisible and magnitude were both undefined.'));
    }
   catch(e)
   {
       testResults.push({Expected: new Error('Impossible to round because divisible is undefined and magnitude is undefined.'), Actual: e, Action: actionTaken, Description: 'Divisible and magnitude were both undefined.'});
   }

    try{
    actionTaken='Invalid: div/ mag';
    RoundingMode({towards: 0, divisible: false, magnitude: null});
    testResults.push(catchFailed(actionTaken, 'Failed to throw when divisible and magnitude were both invalid.'));
    }
   catch(e)
   {
       testResults.push({Expected: new Error('Impossible to round because divisible is undefined and magnitude is undefined.'), Actual: e, Action: actionTaken, Description: 'divisible and magnitude were both invalid.'});
   }

    try{
    actionTaken='Set magnitude';
    RoundingMode({towards: 0, divisible: 2, magnitude: 2});
    testResults.push(catchFailed(actionTaken, 'Failed to throw when divisible and magnitude were both 2.'));
    }
   catch(e)
   {
       testResults.push({Expected: new Error('Invalid state: divisible and magnitude cannot both be defined (divisible: 2, magnitude: 2).'), Actual: e, Action: actionTaken, Description: 'Divisible and magnitude were both 2.'});
   }

    try{
    actionTaken='Set divisible 0';
    RoundingMode({towards: 0, divisible: 0});
    testResults.push(catchFailed(actionTaken, 'Failed to throw when divisible was 0.'));
    }
   catch(e)
   {
       testResults.push({Expected: new Error('Impossible to round because divisible is 0 or negative. In this case 0'), Actual: e, Action: actionTaken, Description: 'Divisible was 0.'});
   }

    try{
    actionTaken='Set divisible -1';
    RoundingMode({towards: 0, divisible: -1});
    testResults.push(catchFailed(actionTaken, 'Failed to throw when divisible was -1.'));
    }
   catch(e)
   {
       testResults.push({Expected: new Error('Impossible to round because divisible is 0 or negative. In this case -1'), Actual: e, Action: actionTaken, Description: 'Divisible was -1.'});
   }

    try{
    actionTaken='Set magnitude 1';
    RoundingMode({towards: 0, magnitude: 1});
    testResults.push(catchFailed(actionTaken, 'Failed to throw when magnitude was 1.'));
    }
   catch(e)
   {
       testResults.push({Expected: new Error('Impossible to round because magnitude is 1, 0, or negative. In this case 1'), Actual: e, Action: actionTaken, Description: 'Magnitude was 1.'});
   }

    try{
    actionTaken='Set magnitude 0';
    RoundingMode({towards: 0, magnitude: 0});
    testResults.push(catchFailed(actionTaken, 'Failed to throw when magnitude was 0.'));
    }
   catch(e)
   {
       testResults.push({Expected: new Error('Impossible to round because magnitude is 1, 0, or negative. In this case 0'), Actual: e, Action: actionTaken, Description: 'Magnitude was 0.'});
   }

    try{
    actionTaken='Set magnitude -2';
    RoundingMode({towards: 0, magnitude: -2});
    testResults.push(catchFailed(actionTaken, 'Failed to throw when magnitude was -2.'));
    }
   catch(e)
   {
       testResults.push({Expected: new Error('Impossible to round because magnitude is 1, 0, or negative. In this case -2'), Actual: e, Action: actionTaken, Description: 'Magnitude was -2.'});
   }

    try{
    actionTaken='Set a and half';
    RoundingMode({divisible: 2, away: 0, half: RoundingMode.Assert_Away_From_Half});
    testResults.push(catchFailed(actionTaken, 'Failed to throw when away and half were both defined (half: Assert_Away_From_Half).'));
    }
   catch(e)
   {
       testResults.push({Expected: new Error('Invalid state: half can\'t be defined when towards or away is defined (' + JSON.stringify({away: 0}) + ').'), Actual: e, Action: actionTaken, Description: 'away and half were both defined (half: Assert_Away_From_Half).'});
   }

    try{
    actionTaken='Set t and half';
    RoundingMode({magnitude: 2, towards: 0, half: RoundingMode.Up});
    testResults.push(catchFailed(actionTaken, 'Failed to throw when towards and half were both defined (half: Up).'));
    }
   catch(e)
   {
       testResults.push({Expected: new Error('Invalid state: half can\'t be defined when towards or away is defined (' + JSON.stringify({towards: 0}) + ').'), Actual: e, Action: actionTaken, Description: 'towards and half were both defined (half: Up).'});
   }

    try{
    actionTaken='Set away';
    RoundingMode({towards: 0, away: 0, divisible: 2});
    testResults.push(catchFailed(actionTaken, 'Failed to throw when towards and away were both 0.'));
    }
   catch(e)
   {
       testResults.push({Expected: new Error('Invalid state: towards and away cannot both be defined (towards: 0, away: 0).'), Actual: e, Action: actionTaken, Description: 'Towards and away were both 0.'});
   }

    try{
    actionTaken='Invalid #: a';
    RoundingMode({away: 5, divisible: 10});
    testResults.push(catchFailed(actionTaken, 'Failed to throw when away was 5 and divisible: 10 (no half).'));
    }
   catch(e)
   {
       testResults.push({Expected: new Error('The value of away must be 0, Infinity, or a number divisible by 10 but was 5 instead.'), Actual: e, Action: actionTaken, Description: 'away was 5 and divisible: 10 (no half).'});
   }

    try{
    actionTaken='Invalid #: t';
    RoundingMode({towards: 5, magnitude: 10});
    testResults.push(catchFailed(actionTaken, 'Failed to throw when towards was 5 and magnitude: 10 (no half).'));
    }
   catch(e)
   {
       testResults.push({Expected: new Error('The value of towards must be 0, Infinity, or a power of 10 but was 5 instead.'), Actual: e, Action: actionTaken, Description: 'towards was 5 and magnitude: 10 (no half)'});
   }

    TesterUtility.displayResults('Tester.errors', testResults, isFirst);
};
Tester.silentChanges=function(isFirst)
{
    TesterUtility.clearResults(isFirst);

    var testResults=[];
    var actionTaken, round;

    try{
    actionTaken='Invalid: a, t, half';
    var mode = {towards: {}, away: [], divisible: 2, half: 5};
    testResults.push({Expected: 4, Actual: RoundingMode(mode)(4), Action: actionTaken, Description: 'RoundingMode({towards: {}, away: [], divisible: 2, half: 5})(4)'});
    } catch(e){testResults.push({Error: e, Action: actionTaken});}

    try{
    actionTaken = 'T: -Infinity';
    round = RoundingMode({divisible: 10, towards: -Infinity});
    testResults.push({Expected: 10, Actual: round(15), Action: actionTaken, Description: 'away: Infinity given 15'});
    testResults.push({Expected: 10, Actual: round(19.99), Action: actionTaken, Description: 'away: Infinity given 19.99'});
    testResults.push({Expected: -20, Actual: round(-10.01), Action: actionTaken, Description: 'away: Infinity given -10.01'});
    testResults.push({Expected: -20, Actual: round(-15), Action: actionTaken, Description: 'away: Infinity given -15'});
    } catch(e){testResults.push({Error: e, Action: actionTaken});}

    try{
    actionTaken = 'A: -Infinity';
    round = RoundingMode({divisible: 10, away: -Infinity});
    testResults.push({Expected: 20, Actual: round(10.01), Action: actionTaken, Description: 'towards: Infinity given 10.01'});
    testResults.push({Expected: 20, Actual: round(15), Action: actionTaken, Description: 'towards: Infinity given 15'});
    testResults.push({Expected: -10, Actual: round(-15), Action: actionTaken, Description: 'towards: Infinity given -15'});
    testResults.push({Expected: -10, Actual: round(-19.99), Action: actionTaken, Description: 'towards: Infinity given -19.99'});
    } catch(e){testResults.push({Error: e, Action: actionTaken});}

    try{
    actionTaken = '1/magnitude';
    round = RoundingMode({magnitude: 0.5, towards: 0});
    testResults.push({Expected: 4, Actual: round(7.99), Action: actionTaken, Description: 'magnitude: 0.5, towards: 0 given 7.99'});
    testResults.push({Expected: 4, Actual: round(6), Action: actionTaken, Description: 'magnitude: 0.5, towards: 0 given 6'});
    testResults.push({Expected: -4, Actual: round(-7.99), Action: actionTaken, Description: 'magnitude: 0.5, towards: 0 given -7.99'});
    testResults.push({Expected: -4, Actual: round(-6), Action: actionTaken, Description: 'magnitude: 0.5, towards: 0 given -6'});
    } catch(e){testResults.push({Error: e, Action: actionTaken});}

    TesterUtility.displayResults('Tester.silentChanges', testResults, isFirst);
};
Tester.miscellaneous=function(isFirst)
{
    TesterUtility.clearResults(isFirst);

    var testResults=[];
    var actionTaken, round;

    try{
    actionTaken = 'Assert even';
    round = RoundingMode({divisible: 2});
    testResults.push({Expected: 4, Actual: round(4), Action: actionTaken, Description: 'divisible: 2 given 4'});
    } catch(e){testResults.push({Error: e, Action: actionTaken});}

    try{
    actionTaken='Assert x10';
    RoundingMode({divisible: 10})(9);
    testResults.push({Expected: 'throw', Actual: 'return', Action: actionTaken, Description: 'Failed to throw when divisible: 10 given 9'});
    }
   catch(e)
   {
       testResults.push({Expected: new Error('Assertion failed: The number 9 is not rounded.'), Actual: e, Action: actionTaken, Description: 'divisible: 10 given 9.'});
   }

    try{
    actionTaken='Assert not half';
    RoundingMode({divisible: 10, half: RoundingMode.Assert_Away_From_Half})(5);
    testResults.push({Expected: 'throw', Actual: 'return', Action: actionTaken, Description: 'Failed to throw when divisible: 10, half: Assert_Away_From_Half given 5'});
    }
   catch(e)
   {
       testResults.push({Expected: new Error('Assertion failed: The number 5 is exactly half way.'), Actual: e, Action: actionTaken, Description: 'divisible: 10, half: Assert_Away_From_Half given 5.'});
   }

    TesterUtility.displayResults('Tester.miscellaneous', testResults, isFirst);
};
Tester.destinations=function(isFirst)
{
    TesterUtility.clearResults(isFirst);

    var testResults=[];
    var actionTaken, round;

    try{
    actionTaken = 'T: 100 easy';
    round = RoundingMode({divisible: 10, towards: 100});
    testResults.push({Expected: 20, Actual: round(10.01), Action: actionTaken, Description: 'divisible: 10, towards: 100 given 10.01'});
    testResults.push({Expected: 20, Actual: round(15), Action: actionTaken, Description: 'divisible: 10, towards: 100 given 15'});
    testResults.push({Expected: -20, Actual: round(-25), Action: actionTaken, Description: 'divisible: 10, towards: 100 given -25'});
    testResults.push({Expected: -20, Actual: round(-29.99), Action: actionTaken, Description: 'divisible: 10, towards: 100 given -29.99'});
    } catch(e){testResults.push({Error: e, Action: actionTaken});}

    try{
    actionTaken = 'T: -10 easy';
    round = RoundingMode({divisible: 10, towards: -10});
    testResults.push({Expected: 10, Actual: round(15), Action: actionTaken, Description: 'divisible: 10, towards: -10 given 15'});
    testResults.push({Expected: 10, Actual: round(19.99), Action: actionTaken, Description: 'divisible: 10, towards: -10 given 19.99'});
    testResults.push({Expected: -10, Actual: round(-0.01), Action: actionTaken, Description: 'divisible: 10, towards: -10 given -0.01'});
    testResults.push({Expected: -10, Actual: round(-5), Action: actionTaken, Description: 'divisible: 10, towards: -10 given -5'});
    } catch(e){testResults.push({Error: e, Action: actionTaken});}

    try{
    actionTaken = 'T: -10';
    round = RoundingMode({divisible: 10, towards: -10});
    testResults.push({Expected: 20, Actual: round(25), Action: actionTaken, Description: 'divisible: 10, towards: -10 given 25'});
    testResults.push({Expected: 20, Actual: round(29.99), Action: actionTaken, Description: 'divisible: 10, towards: -10 given 29.99'});
    testResults.push({Expected: -20, Actual: round(-25), Action: actionTaken, Description: 'divisible: 10, towards: -10 given -25'});
    testResults.push({Expected: -20, Actual: round(-29.99), Action: actionTaken, Description: 'divisible: 10, towards: -10 given -29.99'});
    } catch(e){testResults.push({Error: e, Action: actionTaken});}

    try{
    actionTaken = 'A: 10';
    round = RoundingMode({divisible: 10, away: 10});
    testResults.push({Expected: 20, Actual: round(10.01), Action: actionTaken, Description: 'divisible: 10, away: 10 given 10.01'});
    testResults.push({Expected: 20, Actual: round(15), Action: actionTaken, Description: 'divisible: 10, away: 10 given 15'});
    testResults.push({Expected: -20, Actual: round(-10.01), Action: actionTaken, Description: 'divisible: 10, away: 10 given -10.01'});
    testResults.push({Expected: -20, Actual: round(-15), Action: actionTaken, Description: 'divisible: 10, away: 10 given -15'});
    } catch(e){testResults.push({Error: e, Action: actionTaken});}

    TesterUtility.displayResults('Tester.destinations', testResults, isFirst);
};
//need divisible/magnitude towards/away Infinity in order to completely test findNextUp and findNextDown
Tester.divisibleToInfinity=function(isFirst)
{
    TesterUtility.clearResults(isFirst);

    var testResults=[];
    var actionTaken='Positives';
    var mode = {divisible: undefined, towards: Infinity, toString: function(x){return 'divisible: '+this.divisible+', towards: '+this.towards+' given '+x;}};
    mode.divisible = 10;  //user convenient number
    var round = RoundingMode(mode);
    testResults.push({Expected: 10, Actual: round(10), Action: actionTaken, Description: mode.toString(10)});
    testResults.push({Expected: 20, Actual: round(20), Action: actionTaken, Description: mode.toString(20)});
    testResults.push({Expected: 20, Actual: round(10.01), Action: actionTaken, Description: mode.toString(10.01)});
    testResults.push({Expected: 20, Actual: round(15), Action: actionTaken, Description: mode.toString(15)});
    testResults.push({Expected: 20, Actual: round(19.99), Action: actionTaken, Description: mode.toString(19.99)});

    mode.divisible = 4.5;  //machine convenient number (perfectly expressible in base 2) and is not a whole number
    round = RoundingMode(mode);
    //(4.5 * x). 1: 4.5; half: 6.75; 2: 9; half: 11.25; 3: 13.5
    testResults.push({Expected: 4.5, Actual: round(4.5), Action: actionTaken, Description: mode.toString(4.5)});
    testResults.push({Expected: 9, Actual: round(9), Action: actionTaken, Description: mode.toString(9)});
    testResults.push({Expected: 9, Actual: round(4.501), Action: actionTaken, Description: mode.toString(4.501)});
    testResults.push({Expected: 9, Actual: round(6.75), Action: actionTaken, Description: mode.toString('6.75 (half)')});
    testResults.push({Expected: 9, Actual: round(8.99), Action: actionTaken, Description: mode.toString(8.99)});

    actionTaken='Special';
    testResults.push({Expected: 0, Actual: round(0), Action: actionTaken, Description: mode.toString(0)});
    testResults.push({Expected: 4.5, Actual: round(1), Action: actionTaken, Description: mode.toString(1)});
    testResults.push({Expected: Infinity, Actual: round(Infinity), Action: actionTaken, Description: mode.toString(Infinity)});
    testResults.push({Expected: -Infinity, Actual: round(-Infinity), Action: actionTaken, Description: mode.toString(-Infinity)});
    testResults.push({Expected: NaN, Actual: round(NaN), Action: actionTaken, Description: mode.toString(NaN)});
    testResults.push({Expected: NaN, Actual: round(), Action: actionTaken, Description: mode.toString('nothing')});

    actionTaken='Negatives';
    testResults.push({Expected: -4.5, Actual: round(-4.5), Action: actionTaken, Description: mode.toString(-4.5)});
    testResults.push({Expected: -9, Actual: round(-9), Action: actionTaken, Description: mode.toString(-9)});
    testResults.push({Expected: -4.5, Actual: round(-4.501), Action: actionTaken, Description: mode.toString(-4.501)});
    testResults.push({Expected: -4.5, Actual: round(-6.75), Action: actionTaken, Description: mode.toString(-6.75)});  //half
    testResults.push({Expected: -4.5, Actual: round(-8.99), Action: actionTaken, Description: mode.toString(-8.99)});

    TesterUtility.displayResults('Tester.divisibleToInfinity', testResults, isFirst);
};
Tester.magnitudeToInfinity=function(isFirst)
{
    TesterUtility.clearResults(isFirst);

    var testResults=[];
    var actionTaken='Positives';
    var round = RoundingMode({magnitude: 10, towards: Infinity});
    testResults.push({Expected: 10, Actual: round(10), Action: actionTaken, Description: 'magnitude: 10, towards: Infinity given 10'});
    testResults.push({Expected: 100, Actual: round(100), Action: actionTaken, Description: 'magnitude: 10, towards: Infinity given 100'});
    testResults.push({Expected: 100, Actual: round(20), Action: actionTaken, Description: 'magnitude: 10, towards: Infinity given 20'});
    testResults.push({Expected: 100, Actual: round(55), Action: actionTaken, Description: 'magnitude: 10, towards: Infinity given 55'});
    testResults.push({Expected: 100, Actual: round(80), Action: actionTaken, Description: 'magnitude: 10, towards: Infinity given 80'});

    //0.1 has notoriously bad precision however rounding will take care of that
    testResults.push({Expected: 0.1, Actual: round(0.1), Action: actionTaken, Description: 'magnitude: 10, towards: Infinity given 0.1'});
    testResults.push({Expected: 0.01, Actual: round(0.002), Action: actionTaken, Description: 'magnitude: 10, towards: Infinity given 0.002'});
    testResults.push({Expected: 0.01, Actual: round(0.0055), Action: actionTaken, Description: 'magnitude: 10, towards: Infinity given 0.0055'});
    testResults.push({Expected: 0.01, Actual: round(0.008), Action: actionTaken, Description: 'magnitude: 10, towards: Infinity given 0.008'});

    round = RoundingMode({magnitude: 8.5, towards: Infinity});
    testResults.push({Expected: 8.5, Actual: round(8.5), Action: actionTaken, Description: 'magnitude: 8.5, towards: Infinity given 8.5'});
    testResults.push({Expected: 72.25, Actual: round(72.25), Action: actionTaken, Description: 'magnitude: 8.5, towards: Infinity given 72.25'});
    testResults.push({Expected: 72.25, Actual: round(20), Action: actionTaken, Description: 'magnitude: 8.5, towards: Infinity given 20'});
    testResults.push({Expected: 72.25, Actual: round(40.375), Action: actionTaken, Description: 'magnitude: 8.5, towards: Infinity given 40.375'});
    testResults.push({Expected: 72.25, Actual: round(60), Action: actionTaken, Description: 'magnitude: 8.5, towards: Infinity given 60'});

    //-1: 0.11764705882352941; half: 0.06574394463667815; -2: 0.01384083044982699
    testResults.push({Expected: 0.11764705882352941, Actual: round(0.11764705882352941), Action: actionTaken, Description: 'magnitude: 8.5, towards: Infinity given 0.11764705882352941'});
    testResults.push({Expected: 0.11764705882352941, Actual: round(0.015), Action: actionTaken, Description: 'magnitude: 8.5, towards: Infinity given 0.015'});
    testResults.push({Expected: 0.11764705882352941, Actual: round(0.06574394463667815), Action: actionTaken, Description: 'magnitude: 8.5, towards: Infinity given 0.0657439446366782 (half)'});
    testResults.push({Expected: 0.11764705882352941, Actual: round(0.08), Action: actionTaken, Description: 'magnitude: 8.5, towards: Infinity given 0.08'});

    actionTaken='Special'; round = RoundingMode({magnitude: 10, towards: Infinity});
    testResults.push({Expected: 0, Actual: round(0), Action: actionTaken, Description: 'magnitude: 10, towards: Infinity given 0'});
    testResults.push({Expected: 1, Actual: round(1), Action: actionTaken, Description: 'magnitude: 10, towards: Infinity given 1'});
    testResults.push({Expected: Infinity, Actual: round(Infinity), Action: actionTaken, Description: 'magnitude: 10, towards: Infinity given Infinity'});
    testResults.push({Expected: -Infinity, Actual: round(-Infinity), Action: actionTaken, Description: 'magnitude: 10, towards: Infinity given -Infinity'});
    testResults.push({Expected: NaN, Actual: round(NaN), Action: actionTaken, Description: 'magnitude: 10, towards: Infinity given NaN'});
    testResults.push({Expected: NaN, Actual: round(), Action: actionTaken, Description: 'magnitude: 10, towards: Infinity given nothing'});

    actionTaken='Negatives';
    testResults.push({Expected: -10, Actual: round(-10), Action: actionTaken, Description: 'magnitude: 10, towards: Infinity given -10'});
    testResults.push({Expected: -1000, Actual: round(-1000), Action: actionTaken, Description: 'magnitude: 10, towards: Infinity given -1000'});
    testResults.push({Expected: -100, Actual: round(-200), Action: actionTaken, Description: 'magnitude: 10, towards: Infinity given -200'});
    testResults.push({Expected: -100, Actual: round(-550), Action: actionTaken, Description: 'magnitude: 10, towards: Infinity given -550'});
    testResults.push({Expected: -100, Actual: round(-800), Action: actionTaken, Description: 'magnitude: 10, towards: Infinity given -800'});

    round = RoundingMode({magnitude: 8.5, towards: Infinity});
    //-1: 0.11764705882352941; half: 0.06574394463667815; -2: 0.01384083044982699
    testResults.push({Expected: -0.11764705882352941, Actual: round(-0.11764705882352941), Action: actionTaken, Description: 'magnitude: 8.5, towards: Infinity given -0.11764705882352941'});
    testResults.push({Expected: -0.01384083044982699, Actual: round(-0.015), Action: actionTaken, Description: 'magnitude: 8.5, towards: Infinity given -0.015'});
    testResults.push({Expected: -0.01384083044982699, Actual: round(-0.06574394463667815), Action: actionTaken, Description: 'magnitude: 8.5, towards: Infinity given -0.0657439446366782 (half)'});
    testResults.push({Expected: -0.01384083044982699, Actual: round(-0.08), Action: actionTaken, Description: 'magnitude: 8.5, towards: Infinity given -0.08'});

    TesterUtility.displayResults('Tester.magnitudeToInfinity', testResults, isFirst);
};
Tester.divisibleAwayInfinity=function(isFirst)
{
    TesterUtility.clearResults(isFirst);

    var testResults=[];
    var actionTaken='Positives';
    var mode = {divisible: undefined, away: Infinity, toString: function(x){return 'divisible: '+this.divisible+', away: '+this.away+' given '+x;}};
    mode.divisible = 10;  //user convenient number
    var round = RoundingMode(mode);
    testResults.push({Expected: 10, Actual: round(10), Action: actionTaken, Description: mode.toString(10)});
    testResults.push({Expected: 30, Actual: round(30), Action: actionTaken, Description: mode.toString(30)});
    testResults.push({Expected: 20, Actual: round(20.01), Action: actionTaken, Description: mode.toString(20.01)});
    testResults.push({Expected: 20, Actual: round(25), Action: actionTaken, Description: mode.toString(25)});
    testResults.push({Expected: 20, Actual: round(29.99), Action: actionTaken, Description: mode.toString(29.99)});

    mode.divisible = 4.5;  //machine convenient number (perfectly expressible in base 2) and is not a whole number
    round = RoundingMode(mode);
    //(4.5 * x). 1: 4.5; half: 6.75; 2: 9; half: 11.25; 3: 13.5
    testResults.push({Expected: 4.5, Actual: round(4.5), Action: actionTaken, Description: mode.toString(4.5)});
    testResults.push({Expected: 13.5, Actual: round(13.5), Action: actionTaken, Description: mode.toString(13.5)});
    testResults.push({Expected: 9, Actual: round(9.01), Action: actionTaken, Description: mode.toString(9.01)});
    testResults.push({Expected: 9, Actual: round(11.25), Action: actionTaken, Description: mode.toString('11.25 (half)')});
    testResults.push({Expected: 9, Actual: round(13.499), Action: actionTaken, Description: mode.toString(13.499)});

    actionTaken='Special';
    testResults.push({Expected: 0, Actual: round(0), Action: actionTaken, Description: mode.toString(0)});
    testResults.push({Expected: 0, Actual: round(1), Action: actionTaken, Description: mode.toString(1)});
    testResults.push({Expected: Infinity, Actual: round(Infinity), Action: actionTaken, Description: mode.toString(Infinity)});
    testResults.push({Expected: -Infinity, Actual: round(-Infinity), Action: actionTaken, Description: mode.toString(-Infinity)});
    testResults.push({Expected: NaN, Actual: round(NaN), Action: actionTaken, Description: mode.toString(NaN)});
    testResults.push({Expected: NaN, Actual: round(), Action: actionTaken, Description: mode.toString('nothing')});

    actionTaken='Negatives';
    testResults.push({Expected: -4.5, Actual: round(-4.5), Action: actionTaken, Description: mode.toString(-4.5)});
    testResults.push({Expected: -13.5, Actual: round(-13.5), Action: actionTaken, Description: mode.toString(-13.5)});
    testResults.push({Expected: -9, Actual: round(-4.501), Action: actionTaken, Description: mode.toString(-4.501)});
    testResults.push({Expected: -9, Actual: round(-6.75), Action: actionTaken, Description: mode.toString(-6.75)});
    testResults.push({Expected: -9, Actual: round(-8.99), Action: actionTaken, Description: mode.toString(-8.99)});

    TesterUtility.displayResults('Tester.divisibleAwayInfinity', testResults, isFirst);
};
Tester.magnitudeAwayInfinity=function(isFirst)
{
    TesterUtility.clearResults(isFirst);

    var testResults=[];
    var actionTaken='Positives';
    var mode = {magnitude: undefined, away: Infinity, toString: function(){return 'magnitude: '+this.magnitude+', away: '+this.away+' given ';}};
    mode.magnitude = 10;  //user convenient number
    var round = RoundingMode(mode);
    testResults.push({Expected: 10, Actual: round(10), Action: actionTaken, Description: mode+'10'});
    testResults.push({Expected: 1000, Actual: round(1000), Action: actionTaken, Description: mode+'1000'});
    testResults.push({Expected: 100, Actual: round(200), Action: actionTaken, Description: mode+'200'});
    testResults.push({Expected: 100, Actual: round(550), Action: actionTaken, Description: mode+'550'});
    testResults.push({Expected: 100, Actual: round(800), Action: actionTaken, Description: mode+'800'});

    //0.1 has notoriously bad precision however rounding will take care of that
    testResults.push({Expected: 0.1, Actual: round(0.1), Action: actionTaken, Description: mode+'0.1'});
    testResults.push({Expected: 0.01, Actual: round(0.02), Action: actionTaken, Description: mode+'0.02'});
    testResults.push({Expected: 0.01, Actual: round(0.055), Action: actionTaken, Description: mode+'0.055'});
    testResults.push({Expected: 0.01, Actual: round(0.08), Action: actionTaken, Description: mode+'0.08'});

    mode.magnitude = 8.5;  //machine convenient number (perfectly expressible in base 2) and is not a whole number
    round = RoundingMode(mode);
    //Math.pow(8.5, x). 2: 72.25; half: 415.4375; 3: 614.125
    testResults.push({Expected: 8.5, Actual: round(8.5), Action: actionTaken, Description: mode+'8.5'});
    testResults.push({Expected: 72.25, Actual: round(72.25), Action: actionTaken, Description: mode+'72.25'});
    testResults.push({Expected: 72.25, Actual: round(100), Action: actionTaken, Description: mode+'100'});
    testResults.push({Expected: 72.25, Actual: round(415.4375), Action: actionTaken, Description: mode+'415.4375 (half)'});
    testResults.push({Expected: 72.25, Actual: round(600), Action: actionTaken, Description: mode+'600'});

    //0: 1; half: 0.6764705882352942; -1: 0.11764705882352941; half: 0.06574394463667815; -2: 0.01384083044982699
    testResults.push({Expected: 0.11764705882352941, Actual: round(0.11764705882352941), Action: actionTaken, Description: mode+'0.11764705882352941'});
    testResults.push({Expected: 0.11764705882352941, Actual: round(0.9), Action: actionTaken, Description: mode+'0.9'});
    testResults.push({Expected: 0.11764705882352941, Actual: round(0.6764705882352942), Action: actionTaken, Description: mode+'0.6764705882352942 (half)'});
    testResults.push({Expected: 0.11764705882352941, Actual: round(0.5), Action: actionTaken, Description: mode+'0.5'});

    actionTaken='Special'; mode.magnitude = 10; round = RoundingMode(mode);
    testResults.push({Expected: 0, Actual: round(0), Action: actionTaken, Description: mode+'0'});
    testResults.push({Expected: 1, Actual: round(1), Action: actionTaken, Description: mode+'1'});
    testResults.push({Expected: Infinity, Actual: round(Infinity), Action: actionTaken, Description: mode+'Infinity'});
    testResults.push({Expected: -Infinity, Actual: round(-Infinity), Action: actionTaken, Description: mode+'-Infinity'});
    testResults.push({Expected: NaN, Actual: round(NaN), Action: actionTaken, Description: mode+'NaN'});
    testResults.push({Expected: NaN, Actual: round(), Action: actionTaken, Description: mode+'nothing'});

    actionTaken='Negatives';
    testResults.push({Expected: -10, Actual: round(-10), Action: actionTaken, Description: mode+'-10'});
    testResults.push({Expected: -1000, Actual: round(-1000), Action: actionTaken, Description: mode+'-1000'});
    testResults.push({Expected: -100, Actual: round(-20), Action: actionTaken, Description: mode+'-20'});
    testResults.push({Expected: -100, Actual: round(-55), Action: actionTaken, Description: mode+'-55'});
    testResults.push({Expected: -100, Actual: round(-80), Action: actionTaken, Description: mode+'-80'});

    mode.magnitude = 8.5; round = RoundingMode(mode);
    //-1: 0.11764705882352941; half: 0.06574394463667815; -2: 0.01384083044982699
    testResults.push({Expected: -0.11764705882352941, Actual: round(-0.11764705882352941), Action: actionTaken, Description: mode+'-0.11764705882352941'});
    testResults.push({Expected: -0.11764705882352941, Actual: round(-0.015), Action: actionTaken, Description: mode+'-0.015'});
    testResults.push({Expected: -0.11764705882352941, Actual: round(-0.06574394463667815), Action: actionTaken, Description: mode+'-0.0657439446366782 (half)'});
    testResults.push({Expected: -0.11764705882352941, Actual: round(-0.08), Action: actionTaken, Description: mode+'-0.08'});

    TesterUtility.displayResults('Tester.magnitudeAwayInfinity', testResults, isFirst);
};
Tester.provided=function(isFirst)
{
    TesterUtility.clearResults(isFirst);

    var testResults=[];
    var actionTaken;
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
       actionTaken = nameArray[modeIndex];
      for (var inputIndex=0; inputIndex < input.length; inputIndex++)
      {
          try{
          testResults.push({Expected: output[modeIndex][inputIndex], Actual: modeArray[modeIndex](input[inputIndex]), Action: actionTaken, Description: actionTaken+' when given '+input[inputIndex]});
          } catch(e){testResults.push({Error: e, Action: actionTaken});}
      }
   }

    actionTaken='Truncate';
    try{
    testResults.push({Expected: 2, Actual: RoundingMode.Truncate(2.6), Action: actionTaken, Description: 'Truncate when given 2.6'});
    testResults.push({Expected: -2, Actual: RoundingMode.Truncate(-2.6), Action: actionTaken, Description: 'Truncate when given -2.6'});

    testResults.push({Expected: 3, Actual: RoundingMode.Half_Truncate(2.6), Action: actionTaken, Description: 'Half_Truncate when given 2.6'});
    testResults.push({Expected: -3, Actual: RoundingMode.Half_Truncate(-2.6), Action: actionTaken, Description: 'Half_Truncate when given -2.6'});
    testResults.push({Expected: 2, Actual: RoundingMode.Half_Truncate(2.5), Action: actionTaken, Description: 'Half_Truncate when given 2.5'});
    testResults.push({Expected: -2, Actual: RoundingMode.Half_Truncate(-2.5), Action: actionTaken, Description: 'Half_Truncate when given -2.5'});
    } catch(e){testResults.push({Error: e, Action: actionTaken});}

    try{
    actionTaken='Assert';
    RoundingMode.Assert_Away_From_Half(0);
    testResults.push({Expected: 'throw', Actual: 'return', Action: actionTaken, Description: 'Failed to throw when RoundingMode.Assert_Away_From_Half was given 0.'});
    }
   catch(e)
   {
       testResults.push({Expected: new Error('Assertion failed: The number 0 is exactly half way.'), Actual: e, Action: actionTaken, Description: 'RoundingMode.Assert_Away_From_Half given 0.'});
   }

    TesterUtility.displayResults('Tester.provided', testResults, isFirst);
};
