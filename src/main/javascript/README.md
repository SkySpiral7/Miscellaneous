File descriptions
=================

## advancedRounding.js
The function RoundingMode creates and returns a function that is used to round numbers in any way desired.
Some examples: RoundingMode({away: Infinity, divisible: 1})(-1.5) returns -2 and RoundingMode({magnitude: 10, towards: 0})(99.9) returns 10.

**Inputs**: RoundingMode takes an object with: away, towards, divisible, magnitude, half, and precision.
See RoundingMode's jsdoc for details (the block comment above where RoundingMode is defined).

**Outputs**: A function which takes a number and returns a number (which is rounded).


## generatePassword.html
Generates a random text that makes a good password. It uses javascript only (is purely off-line, no AJAX) so nothing nefarious is going on here.

I created this because I was unsatisfied with the options that other password generators had (or rather lacked).
Also some of them had form submission and page reload which is unacceptable because for all I knew was
being logged by the sever. Also making this was fun.

**Inputs**: a table with columns of Require, Allow, Exclude and rows of Upper Case, Lower Case, Numbers, Symbols,
Space. Specific Exclusions, option to allow repeating characters or leading/ trailing space. and length.

**Outputs**: random text of the specified length meeting the requirements indicated


## testRunner.js
A javascript program that asserts correctness. It is lightweight but useful. I maintain it because I like how light weight it is
and because it accepts a delta for comparing floating point numbers (and dates) which I don't think Jasmine or Q-Unit does.

**Inputs**: a test suite that contains functions that return an array of test assertions.

**Outputs**: a text output of the results put into a textarea


## testRunnerExample.html
A simple wrapper for testing javascript.

**Inputs**: a textarea for eval and a link to run all tests

**Outputs**: result of eval and a test result section
