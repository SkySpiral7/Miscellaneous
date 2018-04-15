'use strict';
/**This function will sort input using compare but will do so in a way that is deterministic, predictable, and unstable.
This isn't designed to be fast. It is intended to be used in tests since some browsers use
an unstable algorithm for Array#sort. By using this function you can prove that your compare function either forces
stability or doesn't care.
@param {array} input the array to be sorted
@param {function} compare a comparison function that must return either 1, 0, or -1 for each combination of input
*/
function unstableSort(input, compare)
{
   //this is a bubble sort that has been modified to be unstable
   var swapped, temp;
   do {
      swapped = false;
      for (var i=0; i < input.length-1; i++) {
         var result = compare(input[i], input[i+1]);
         if (result === 1) {
            temp = input[i];
            input[i] = input[i+1];
            input[i+1] = temp;
            swapped = true;
         }
         else if (result === 0) {  //if equal then swap them anyway to make it unstable
            temp = input[i];
            input[i] = input[i+1];
            input[i+1] = temp;
            //if swapped=true then this loop will never end (if any 2 are equal)
         }
         //if -1 then it's already in the correct order
      }
   } while (swapped);
}
/**This function exists for the sake of comparison while testing. I don't have a use case for it.*/
function stableSort(input, compare)
{
   //this is a bubble sort
   var swapped;
   do {
      swapped = false;
      for (var i=0; i < input.length-1; i++) {
         var result = compare(input[i], input[i+1]);
         if (result === 1) {
            var temp = input[i];
            input[i] = input[i+1];
            input[i+1] = temp;
            swapped = true;
         }
         //if -1 then it's already in the correct order. if 0 then leave alone to be stable
      }
   } while (swapped);
}
