File descriptions
=================
#Not dice related
##ascii.cpp
This is my favorite C++ program (that I've made). It simply prints out all 256 charaters.

All the characters on a standard American keyboard have universally accepted character codes (9, 10, 13, 32-126 all in base 10).

But some of the symbols (such as an infinity sign) are not defined in the initial ascii standard (which stopped at 127).

Another thing that brings up issues is that the encoding used in html standard is not the same as the
one for DOS which might not be the same as Windows, Linux, Unix, or any given file.

Additionally the ascii standard is not always followed: for example when I ran it on DOS many of the
lower numbered symbols had a printable symbol despite being unprintable (or whitespace) in the ascii standard.

Therefore this program is the definitive way to discover all 256 characters that your C++ environment
uses by default. (I could not find an online reference that had the same symbols that I saw when running this.)

**Inputs**: None

**Outputs**: 0-255 characters including the decimal and hex numbers in a nicely aligned list


##Catch Rate Calculator.html
A simple program to calculate your chances of catching a pokemon. Based on the Generation 4 formula according to bulbapedia.
Has many links to bulbapedia in order to look up numbers that are required input. Along with 3 random links for more pokemon calculations.

**Inputs**: current and max hp, catch rate, ball rate, pokemon status, number of balls attempted

**Outputs**: chance of success, chance of at least 1 success given a number of attempts, the ability to attempt it using random numbers

Also has: a HP guesser based on lv. The formula for which is based on my speculation based on a few of my pokemon


##FileGatherer.java
A simple program to find files deeply and return a List<File>.

**Inputs**:
1. rootFolder: where to start.
2. fileCriteria and folderCriteria which is a Pattern that is compared to the file name to determine if it should be in the resulting list.
3. subFolderCriteria a Pattern that is compared to the folder name to determine if it should be explored or not
4. maxFinds and maxDepth use -1 for no limit. maxDepth is the number of folders down to go from root
5. findFolders and findFiles booleans to determine if files and/or folders should be included in resulting list. these trump fileCriteria and folderCriteria

**Outputs**: List<File> that meets the criteria


##FileToStringAdapter.java
This class is a wrapper around File. It extends File and has a method for many of the String methods. The String based methods
perform the action over the file contents (even files larger than Integer.MAX_VALUE). These methods include getting a substring
of the file contents and modifying the file contents.

**Inputs**: Has the same constructors as File and many methods of String.

**Outputs**: The file content mutators return nothing. For all others see File and String docs.


##generate password.html
Generates a random text that makes a good password. It uses javascript only (is purely off-line, no AJAX) so nothing nefarious is going on here.

I created this because I was unsatisfied with the options that other password generators had (or rather lacked).
Also some of them had form submission and page reload which is unacceptable because for all I knew was
being logged by the sever. Also making this was fun.

**Inputs**: a table with columns of Require, Allow, Exclude and rows of Upper Case, Lower Case, Numbers, Symbols,
Space. Specific Exclusions, option to allow repeating characters or leading/ trailing space. and length.

**Outputs**: random text of the specified length meeting the requirements indicated


##shell js tester.html
A simple wrapper for testing javascript. Not exactly "untested" but it will remain in this branch.

**Inputs**: a textarea for eval and a link to run all tests

**Outputs**: result of eval and a test result section



#Dice related
##battle tech dice.html
A simple web interface for rolling dice for the game BattleTech.

Surprisingly not based on "tabletop dice.html" (even though initially it was going to be).

**Inputs**: initiative (with and without Combat Paralysis), number needed to hit

**Outputs**: hit/miss, location #, # of critical hits, upper/lower critical hit list, critical hit area # list

Also has: the ability to reroll criticals. and general purpose 2d6, 1d6 and coin.


##L5R dice.html
A simple web interface for rolling dice for the game Legend of the Five Rings.

Based on an old version of "tabletop dice.html" which was then stripped out and given a specific interface.

**Inputs**: XkY, Emphasis

**Outputs**: list of each kept die sorted, list of each dropped die sorted, total of the dice kept, void points recovered


##L5R stats.html
A simple web interface for drawing a distribution curve of the dice for the game Legend of the Five Rings.

Based on "tabletop dice.html" which was then heavily stripped out in hopes of improving performance
(only for this one type of dice curve), it tragically did not help.

If all dice are kept it performs wonders and is able to do 3,300k3,300 within a minute. But if even
1 die is dropped the performance is rather unfortunate and crashes when attempting 4k3 (on the other
hand 3k1 the next slowest takes only 3 seconds).

If all dice are kept a formula is used that is very fast but otherwise it must find every possible
combination. At my college I asked the two professors of Probability and Statistics (and the Computer
Science professor) and a month later they agreed that this problem would require far more knowledge and
skill then they had. In fact this problem might even be NP-Complete. If anyone is able to solve this
problem I would greatly appreciate it.

**Inputs**: XkY, Emphasis

**Outputs**: min, max (of the ones calculated), average, standard deviation, and a drawn distribution curve (using divs)


##tabletop dice.html
A javascript dice rolling library. The html around it has full functional documentation (of the ones
that are finished) except for Draw.compareDiceBellCurve which works fine. The html also has a textarea
for eval. For example you can program: if(rollDice("2d6") === 12){}. Or create a Die or DicePool object etc.

This is also ment to be the one dice roller to rule them all. And you might've heard that claim before
but **seriously**, excluding performance and visuals of dice, I only know of **one** thing it's missing:
an arbitrary grouping of dice syntax such as (1d6)d4. Which I thought [Roll20](https://wiki.roll20.net/Dice_Reference)
had at one point... I was at one point working on this functionality in the function groupParser.

This file has it all: rolling dice, drawing dice distribution curves, dice and dicepool objects that
allow any kind of custom die, convenience functions for common things like DnDAttack, IronClawOpposedRoll,
and WarhammerAttackUnit (open file for documentation).

**Inputs**: (open file for documentation) a textarea for eval

**Outputs**: (open file for documentation) a textarea for output and a div for graphed results.


##warhammer dice.html
A simple web interface for drawing a distribution curve of the dice for the game Warhammer 40k. And
for rolling random values using the inputs to know the results of an attack.

Copied from an older version of "tabletop dice.html". Later tabletop was updated and given another
200 lines or so. Only testing can confirm that warhammer is a subset of tabletop (or a file compare
but there were a lot of differences).

**Inputs**: Number of Dice, Number of Wounds Possible, To Hit Value, To Wound Value, To Save Value, Reanimation or Feel No Pain, (and Custom Column)

**Outputs**: the results of a random roll using the numbers given, min, max, average, standard deviation, and a drawn distribution curve (using divs)

Also see: the slightly outdated "warhammer Example Screen Shot.jpg"
