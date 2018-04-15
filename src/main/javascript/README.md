File descriptions
=================
#advancedRounding.js
The function RoundingMode creates and returns a function that is used to round numbers in any way desired.
Some examples: RoundingMode({away: Infinity, divisible: 1})(-1.5) returns -2 and RoundingMode({magnitude: 10, towards: 0})(99.9) returns 10.

**Inputs**: RoundingMode takes an object with: away, towards, divisible, magnitude, half, and precision.
See RoundingMode's jsdoc for details (the block comment above where RoundingMode is defined).

**Outputs**: A function which takes a number and returns a number (which is rounded).


#generatePassword.html
Generates a random text that makes a good password. It uses javascript only (is purely off-line, no AJAX) so nothing nefarious is going on here.

I created this because I was unsatisfied with the options that other password generators had (or rather lacked).
Also some of them had form submission and page reload which is unacceptable because for all I knew was
being logged by the sever. Also making this was fun.

**Inputs**: a table with columns of Require, Allow, Exclude and rows of Upper Case, Lower Case, Numbers, Symbols,
Space. Specific Exclusions, option to allow repeating characters or leading/ trailing space. and length.

**Outputs**: random text of the specified length meeting the requirements indicated


#oldJson.js
A single function that parses JSON no matter how old the javascript engine is.
It will validate to ensure that eval does not run injected code.

Obviously JSON.parse should be used instead whenever possible.
But the reason I made this was in response to these 2 webpages:
[Blog addressing common security hole](http://blog.mindedsecurity.com/2011/08/ye-olde-crockford-json-regexp-is.html)
and [Standard removed the code in response](http://www.rfc-editor.org/errata_search.php?rfc=4627).

But this hole was very easy to fix!
I am annoyed that they simply said "don't use" instead of fixing it (which is easy to do).
Seriously look at the code, it's 8 short lines. Yet it solves the holes.

The 2 webpages above should be updated to solve the problem not just show it. Same goes for these 2 pages:
[A stackoverflow question](http://stackoverflow.com/questions/6041741/fastest-way-to-check-if-a-string-is-json-in-php/6041857#6041857)
and [Wikipedia](http://en.wikipedia.org/wiki/JSON#JavaScript_eval.28.29).
But I know there are [more out there](https://www.google.com/search?q=%22Eaeflnr-u%22).

I have tested this code against the known problems and a few others.

**Inputs**: string that might be JSON

**Outputs**: a JSON object or undefined


#testRunner.js
A javascript program that asserts correctness. It is lightweight but useful. I maintain it because I like how light weight it is
and because it accepts a delta for comparing floating point numbers (and dates) which I don't think Jasmine or Q-Unit does.

**Inputs**: a test suite that contains functions that return an array of test assertions.

**Outputs**: a text output of the results put into a textarea


#testRunnerExample.html
A simple wrapper for testing javascript.

**Inputs**: a textarea for eval and a link to run all tests

**Outputs**: result of eval and a test result section
