#Folders
The "javascript dice" folder has javascript programs that are dice related. All of the files are in some way related to
the file "tabletop dice.html" which acts as a parent to them all. Note that the files are all self-contained html files not javascript libraries.

The "javascript other" folder has javascript programs that are not related to dice.
The html files are self-contained programs (except "shell js tester.html") and the js files are libraries.

The programs that are in this folder but not a subfolder are not javascript files. They will be described below.


#File descriptions
##ascii.cpp
This is my favorite C++ program (that I've made). It simply prints out all 256 characters.

All the characters on a standard American keyboard have universally accepted character codes (9, 10, 13, 32-126 all in base 10).

But some of the symbols (such as an infinity sign) are not defined in the initial ASCII standard (which stopped at 127).

Another thing that brings up issues is that the encoding used in html standard is not the same as the
one for DOS which might not be the same as Windows, Linux, Unix, or any given file.

Additionally the ASCII standard is not always followed: for example when I ran it on DOS many of the
lower numbered symbols had a printable symbol despite being unprintable (or whitespace) in the ASCII standard.

Therefore this program is the definitive way to discover all 256 characters that your C++ environment
uses by default. (I could not find an online reference that had the same symbols that I saw when running this.)

**Inputs**: None

**Outputs**: 0-255 characters including the decimal and hex numbers in a nicely aligned list
