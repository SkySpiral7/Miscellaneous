File descriptions
=================
#Catch Rate Calculator.html
A simple program to calculate your chances of catching a pokemon. Based on the Generation 4 formula according to bulbapedia.
Has many links to bulbapedia in order to look up numbers that are required input. Along with 3 random links for more pokemon calculations.

**Inputs**: current and max hp, catch rate, ball rate, pokemon status, number of balls attempted

**Outputs**: chance of success, chance of at least 1 success given a number of attempts, the ability to attempt it using random numbers

Also has: an HP guesser based on lv. The formula for which is based on my speculation based on a few of my pokemon


#generate password.html
Generates a random text that makes a good password. It uses javascript only (is purely off-line, no AJAX) so nothing nefarious is going on here.

I created this because I was unsatisfied with the options that other password generators had (or rather lacked).
Also some of them had form submission and page reload which is unacceptable because for all I knew was
being logged by the sever. Also making this was fun.

**Inputs**: a table with columns of Require, Allow, Exclude and rows of Upper Case, Lower Case, Numbers, Symbols,
Space. Specific Exclusions, option to allow repeating characters or leading/ trailing space. and length.

**Outputs**: random text of the specified length meeting the requirements indicated


#old json.js
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

I have tested this code against the known problems and a few others but it is in the untested branch because I have
not made a unit test file for it.

**Inputs**: string that might be JSON

**Outputs**: a JSON object or undefined


#shell js tester.html
A simple wrapper for testing javascript. Not exactly "untested" but it will remain in this branch.

**Inputs**: a textarea for eval and a link to run all tests

**Outputs**: result of eval and a test result section
