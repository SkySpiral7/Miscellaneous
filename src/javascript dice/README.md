File descriptions
=================
#battle tech dice.html
A simple web interface for rolling dice for the game BattleTech.

Surprisingly not based on "tabletop dice.html" (even though initially it was going to be).

**Inputs**: initiative (with and without Combat Paralysis), number needed to hit

**Outputs**: hit/miss, location #, # of critical hits, upper/lower critical hit list, critical hit area # list

Also has: the ability to reroll criticals. and general purpose 2d6, 1d6 and coin.


#L5R dice.html
A simple web interface for rolling dice for the game Legend of the Five Rings.

Based on an old version of "tabletop dice.html" which was then stripped out and given a specific interface.

**Inputs**: XkY, Emphasis

**Outputs**: list of each kept die sorted, list of each dropped die sorted, total of the dice kept, void points recovered


#L5R stats.html
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


#tabletop dice.html
A javascript dice rolling library. The html around it has full functional documentation (of the ones
that are finished) except for Draw.compareDiceBellCurve which works fine. The html also has a textarea
for eval. For example you can program: if(rollDice("2d6") === 12){}. Or create a Die or DicePool object etc.

This is also meant to be the one dice roller to rule them all. And you might've heard that claim before
but **seriously**, excluding performance and visuals of dice, I only know of **one** thing it's missing:
an arbitrary grouping of dice syntax such as (1d6)d4. Which I thought [Roll20](https://wiki.roll20.net/Dice_Reference)
had at one point... I was at one point working on this functionality in the function groupParser.

This file has it all: rolling dice, drawing dice distribution curves, dice and dicepool objects that
allow any kind of custom die, convenience functions for common things like DnDAttack, IronClawOpposedRoll,
and WarhammerAttackUnit (open file for documentation).

**Inputs**: (open file for documentation) a textarea for eval

**Outputs**: (open file for documentation) a textarea for output and a div for graphed results.


#warhammer dice.html
A simple web interface for drawing a distribution curve of the dice for the game Warhammer 40k. And
for rolling random values using the inputs to know the results of an attack.

Based on "tabletop dice.html". The user form has been greatly simplified and only supports Warhammer.
A few changes to the javascript were also needed to support the new interface.

**Inputs**: Number of Dice, Number of Wounds Possible, To Hit Value, To Wound Value, To Save Value, Reanimation or Feel No Pain, (and Custom Column)

**Outputs**: the results of a random roll using the numbers given, min, max, average, standard deviation, and a drawn distribution curve (using divs)
