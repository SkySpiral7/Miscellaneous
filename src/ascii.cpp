#include <iostream>
using namespace std;
int main()
{
   for (unsigned char ascii=0; ascii < 255; ascii++)
   {
       if(ascii < 16) cout << "0";  //pad hex
       cout << uppercase << hex << short(ascii) << " " << dec;  //print # in uppercase hex
       if(ascii==7){cout << "007 ||" << endl; continue;}  //to avoid the bell
       if(ascii < 100) cout << "0";  //pad decimal
       if(ascii < 10) cout << "0";  //and again
       cout << short(ascii) << " |" << ascii << "|" << endl;  //pipe bars to show tab and space
   }
    cout << "FF 255 |" << char(255) << "|" << endl;  //loop does not cover it

cout << endl << endl;
system("pause");
return 0;
}
//0: null, 7: bell, 8: cancel (backspace. notice it deletes the previous pipe bar), 255: "blank" what is that?
//9: tab, 10: carriage return or new line, 13: line feed (home), 32: space
//notice that when 10 is printed (it seems) it can stand alone as both carriage return and line feed
