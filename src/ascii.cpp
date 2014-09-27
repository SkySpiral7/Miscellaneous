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
//0: null, 7: bell, 8: cancel (backspace. it deletes the previous pipe bar), 255: "blank" what is that?
//9: tab, 10: \n line feed (new line), 13: \r carriage return (home), 32: space
//notice that when \n is printed to the command line (in Windows) it acts as \r\n would
