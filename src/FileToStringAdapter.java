package src;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.RandomAccessFile;
import java.net.URI;
import java.util.Locale;
import java.util.Scanner;

/**
 * <p>This class is a wrapper around File. It extends File and has a method for many of the String methods. The String based methods
 * perform the action over the file contents (even files larger than Integer.MAX_VALUE). These methods include getting a substring
 * of the file contents and modifying the file contents.</p>
 * 
 * <p>Methods that operate on file contents are not possible for folders or files that do not exist.
 * If you want a nonexistent file to have empty contents use {@link File#createNewFile()} which does
 * nothing if the file already exists.</p>
 * 
 * <p>I have no idea if this class is thread safe and which parts would be.</p>
 */
public class FileToStringAdapter extends File {
    private static final long serialVersionUID = 6167875537836192550L;

    /**
     * @see File#File(String)
     */
    public FileToStringAdapter(String pathname){super(pathname);}
    /**
     * @see File#File(URI)
     */
    public FileToStringAdapter(URI uri){super(uri);}
    /**
     * @see File#File(File, String)
     */
    public FileToStringAdapter(File parent, String child){super(parent, child);}
    /**
     * @see File#File(String, String)
     */
    public FileToStringAdapter(String parent, String child){super(parent, child);}
    /**
     * This constructor converts from a file.
     * @see File#File(File, String)
     */
    public FileToStringAdapter(File fileToConvert)
    {
    	super(fileToConvert.getParentFile(), fileToConvert.getName());
	}

    /**
     * Simply calls:<br />
     * <code>substring(0, length());</code><br />
     * @throws IndexOutOfBoundsException
     * @see #substring(long, long)
     */
    public String contentsAsString(){return substring(0, length());}

    /**
     * Returns true if the file's contents are empty.
     * @throws IllegalStateException if the file does not exist or is a directory.
     * @see String#isEmpty()
     * @see File#length()
     */
    public boolean isEmpty() {
    	requireFileContents();
    	return (length() == 0);
    }

    /**
     * Called by all methods that require file contents to exist.
     * @throws IllegalStateException if the file does not exist or is a directory.
     */
    private void requireFileContents()
    {
        if(!exists()) throw new IllegalStateException("Operation is not supported for files that do exist because they not have contents.");
        if(isDirectory()) throw new IllegalStateException("Operation is not supported for folders because they do not have contents.");
    }

    /**
     * This method is exactly like #charAt(long) except this method uses RandomAccessFile for instant access regardless of file
     * size. The only catch is that it doesn't recognize character encoding and therefore only works on ascii plain text files.
     * Therefore the index is the byte index instead of the character index and the character returned is assumed to be 1 byte in size.
     * 
     * @throws IllegalStateException if the file does not exist or is a directory.
     * @throws IndexOutOfBoundsException if the index argument is negative or not less than the length of this file.
     * @see String#charAt(int)
     */
    public char charAtRandom(long index) {
    	requireFileContents();
    	if(index < 0 || index >= length())
    		throw new IndexOutOfBoundsException("File content length is " + length() + " but index was: " + index);
    	
        //TODO: convert other closables to this
    	try (RandomAccessFile seekableFile = new RandomAccessFile(this, "r")) {
			seekableFile.seek(index);
			return (char) seekableFile.readByte();
		}
    	catch(FileNotFoundException e){}  //not possible
    	catch(IOException e){}  //not negative. not sure if possible otherwise
    	return '\0';
    }

    /**
     * Returns the character of the file's contents that is located at the index specified.
     * index is zero indexed. index is the character index not the byte index.
     * @throws IllegalStateException if the file does not exist or is a directory.
     * @throws IndexOutOfBoundsException if the index argument is negative or not less than the length of this file.
     * @see String#charAt(int)
     */
    public char charAt(long index) {
    	requireFileContents();
    	if(index < 0 || index >= length())
    		throw new IndexOutOfBoundsException("File content length is " + length() + " (in bytes) but index was: " + index);

    	Scanner thisFileScanner;
    	long currentIndex = 0;
        try {
        	thisFileScanner = new Scanner(this);
        	thisFileScanner.useDelimiter("");  //why isn't this setDelimiter?
           while (thisFileScanner.hasNext())  //always true
           {
        	   if (currentIndex == index)
        	   {
        		   char returnValue = thisFileScanner.next().charAt(0);  //always a string length of 1
        		   //scanner y u no have nextChar?
        		   thisFileScanner.close();
        		   return returnValue;
    		   }
        	   thisFileScanner.next(); currentIndex++;
           }
           thisFileScanner.close();
        } catch (FileNotFoundException e){}  //not possible

        throw new IndexOutOfBoundsException("File content length is " + currentIndex + " (in characters) but index was: " + index);
    }

    /**
     * This method was created to address the dichotomy between file length (number of bytes) and number
     * of characters the file contains. Note that the entire file must be read in order for this to be possible.
     * 
     * @throws IllegalStateException if the file does not exist or is a directory.
     * @return the number of characters that the file contains
     */
    public long countCharacters() {
    	requireFileContents();

    	Scanner thisFileScanner;
    	long currentIndex = 0;
        try {
        	thisFileScanner = new Scanner(this);
        	thisFileScanner.useDelimiter("");  //why isn't this setDelimiter?
 		   //scanner y u no have nextChar?
           while(thisFileScanner.hasNext()){currentIndex++; thisFileScanner.next();}
           thisFileScanner.close();
        } catch (FileNotFoundException e){}  //not possible
        return currentIndex;
    }

    /**
     * Populates a character array with a section of the file's contents.
     * srcBegin and dstBegin are inclusive and srcEnd is exclusive.
     * Each are zero indexed.
     * @throws IndexOutOfBoundsException
     * @see String#getChars(int, int, char[], int)
     */
    public void getChars(long srcBegin, long srcEnd, char dst[], int dstBegin) {
    	requireFileContents();
    	if(srcBegin < 0 || srcBegin > srcEnd)
    		throw new IndexOutOfBoundsException("srcBegin is invalid: " + srcBegin + ". srcEnd was: " + srcEnd);
    	if(srcEnd > length())
    		throw new IndexOutOfBoundsException("srcEnd is invalid: " + srcEnd + ". File content length is " + length());
    	if(dstBegin+(srcEnd-srcBegin) > dst.length)
    		throw new IndexOutOfBoundsException("srcBegin: " + srcBegin + "; srcEnd: " + srcEnd + "; dstBegin: " + dstBegin + "; Can't fit into an array of length: " + dst.length);
    	if(srcBegin == srcEnd) return;  //done

    	long currentSource = 0;
    	int currentDst = dstBegin;
    	Scanner thisFileScanner;
        try {
        	thisFileScanner = new Scanner(this);
        	thisFileScanner.useDelimiter("");  //why isn't this setDelimiter?
           while (thisFileScanner.hasNext())  //always true
           {
        	   if(currentSource == srcEnd) break;
        	   if (currentSource >= srcBegin)
        	   {
        		   dst[currentDst] = thisFileScanner.next().charAt(0);  //always a string length of 1
        		   //scanner y u no have nextChar?
        		   currentDst++;
    		   }
        	   else thisFileScanner.next();
        	   currentSource++;
           }
           thisFileScanner.close();
        } catch (FileNotFoundException e){}  //not possible
    }

    /**
     * Returns true if the files are equal. See contentEquals for comparing
     * file contents.
     * @see File#equals(Object)
     */
    public boolean equals(Object anObject) {
        return super.equals(anObject);
    }

    /**
	 * Returns the hashCode of the file.
	 * In order to get the hashCode of the contents use <code>contentsAsString().hashCode();</code>
	 * @see File#hashCode()
	 * @see String#hashCode()
	 * @see #contentsAsString()
	 */
	public int hashCode() {
	    return super.hashCode();
	}
	/**
	 * Returns the toString of the file.
	 * In order to get the file contents use <code>contentsAsString();</code>
	 * @see File#toString()
	 * @see #contentsAsString()
	 */
	public String toString() {
	    return super.toString();
	}

    /**
     * Returns true if the file's contents match the CharSequence.
     * @see String#contentEquals(CharSequence)
     */
    public boolean contentEquals(CharSequence cs) {
        //TODO: method stub
    	return false;
    }

    /**
     * Returns true if both files have the same contents.
     * @see String#contentEquals(CharSequence)
     */
    public boolean contentEquals(File otherFile) {
        //TODO: method stub
        return false;
    }

    /**
     * Returns true if the file's contents matches the String ignoring case.
     * @see String#equalsIgnoreCase(String)
     */
    public boolean contentEqualsIgnoreCase(String anotherString) {
        //TODO: method stub
        return false;
    }

    /**
     * Compares the file's contents to the String.
     * @see String#compareTo(String)
     */
    public int compareContents(String anotherString) {
        //TODO: method stub
        return 0;
    }

    /**
     * Compares the file's contents to the String ignoring case.
     * @see String#compareToIgnoreCase(String)
     */
    public int compareContentsIgnoreCase(String anotherString) {
        //TODO: method stub
        return 0;
    }

    /**
     * Returns true if the file's contents, after the offset, starts with the String.
     * @see String#startsWith(String, int)
     */
    public boolean startsWith(String prefix, long toffset) {
        //TODO: method stub
        return false;
    }

    /**
     * Returns true if the file's contents starts with the String.
     * @see String#startsWith(String)
     */
    public boolean startsWith(String prefix){return startsWith(prefix, 0);}

    /**
     * Returns true if the file's contents ends with the String.
     * @see String#endsWith(String)
     */
    public boolean endsWith(String suffix) {
        //TODO: method stub
        return false;
    }

    /**
     * This method searches the file's contents for the first matching character
     * and returns the index.
     * @see String#indexOf(int)
     */
    public long indexOf(char ch){return indexOf(ch, 0);}

    /**
     * This method searches the file's contents, starting at fromIndex, for the first matching character
     * and returns the index.
     * @see String#indexOf(int, int)
     */
    public long indexOf(char ch, long fromIndex) {
        //TODO: method stub
        return -1;
    }

    /**
     * This method searches the file's contents for the last matching character
     * and returns the index.
     * @see String#lastIndexOf(int)
     */
    public long lastIndexOf(char ch){return lastIndexOf(ch, length()-1);}

    /**
     * This method searches the file's contents, starting at fromIndex, for the last matching character
     * and returns the index.
     * @see String#lastIndexOf(int, int)
     */
    public long lastIndexOf(char ch, long fromIndex) {
        //TODO: method stub
    	return -1;
    }

    /**
     * This method searches the file's contents for the first matching substring
     * and returns the index.
     * @see String#indexOf(String)
     */
    public long indexOf(String str){return indexOf(str, 0);}

    /**
     * This method searches the file's contents, starting at fromIndex, for the first matching substring
     * and returns the index.
     * @see String#indexOf(String, int)
     */
    public long indexOf(String str, long fromIndex) {
        //TODO: method stub
        return 0;
    }

    /**
     * This method searches the file's contents for the last matching substring
     * and returns the index.
     * @see String#lastIndexOf(String)
     */
    public long lastIndexOf(String str){return lastIndexOf(str, length()-1);}

    /**
     * This method searches the file's contents, starting at fromIndex, for the last matching character
     * and returns the index.
     * @see String#lastIndexOf(String, int)
     */
    public long lastIndexOf(String str, long fromIndex) {
        //TODO: method stub
        return 0;
    }

    /**
     * Returns a substring of the file's contents starting at beginIndex until the end of the file.
     * @throws IndexOutOfBoundsException if: beginIndex is negative, beginIndex is larger than the length of this file's contents
     * or if the range can't fit into a String. 
     * @see String#substring(int)
     */
    public String substring(long beginIndex){return substring(beginIndex, length());}

    //TODO: look into InputStream#read(char cbuf[], int off, int len). http://www.coderanch.com/t/385665/java/java/RandomAccessFile
    /**
     * Returns a substring of the file's contents starting at beginIndex (inclusive) until the endIndex (exclusive).
     * Each are zero indexed. Each are character index however endIndex is lenient: if characterCount < endIndex <= fileLength
     * then it is assumed that all characters were desired and endIndex is automatically set to characterCount. This allows
     * file.length() to be passed into for the endIndex.
     * 
     * @throws IndexOutOfBoundsException if:
     * <ul>
     * <li>beginIndex is negative</li>
     * <li>beginIndex is larger than endIndex</li>
     * <li>endIndex is larger than the length of this file's contents</li>
     * <li>the range can't fit into a String</li>
     * </ul>
     * @see String#substring(int, int)
     */
    public String substring(long beginIndex, long endIndex) {
    	requireFileContents();
    	if(beginIndex < 0 || beginIndex > endIndex)
    		throw new IndexOutOfBoundsException("beginIndex is invalid: " + beginIndex + ". endIndex was: " + endIndex);
    	if(endIndex > length())
    		throw new IndexOutOfBoundsException("endIndex is invalid: " + endIndex + ". File content length is " + length());
    	if((endIndex-beginIndex) > Integer.MAX_VALUE)
    		throw new IndexOutOfBoundsException("beginIndex: " + beginIndex + "; endIndex: " + endIndex + "; Range too large to fit into a string");
    	if(beginIndex == endIndex) return "";  //done

    	Scanner thisFileScanner;
        StringBuffer contentBuffer = new StringBuffer();
    	long currentIndex = 0;
        try {
        	thisFileScanner = new Scanner(this);
        	thisFileScanner.useDelimiter("");  //why isn't this setDelimiter?
 		   //scanner y u no have nextChar?
           while (thisFileScanner.hasNext())  //always true
           {
        	   if(currentIndex == endIndex) break;
        	   if(currentIndex >= beginIndex) contentBuffer.append(thisFileScanner.next());  //always a string length of 1
        	   else thisFileScanner.next();
        	   currentIndex++;
           }
           thisFileScanner.close();
        } catch (FileNotFoundException e){}  //not possible
        //no special catch is required for characterCount < endIndex <= fileLength: hasNext returns false and everything is fine
        return contentBuffer.toString();
    }

    /**
     * Appends the string to the file's contents.
     * Creates the file if it doesn't currently exist.
     * @throws IllegalStateException if this file is a directory
     * @throws IOException if the file can't be written to.
     * @see String#concat(String)
     */
    public void concat(String newContents) throws IOException {
    	if(!this.exists()) this.createNewFile();
    	requireFileContents();
        BufferedWriter out = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(this, true)));
        out.write(newContents);
        out.close();
    }

    /**
     * The string becomes the file's new contents replacing the previous file contents.
     * Creates the file if it doesn't currently exist.
     * @throws IllegalStateException if this file is a directory
     * @throws IOException if the file can't be written to.
     */
    public void setFileContents(String newContents) throws IOException {
    	if(!this.exists()) this.createNewFile();
    	requireFileContents();
    	//TODO: if enough places add file creation to requireFileContents(true)
        BufferedWriter out = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(this)));
        out.write(newContents);
        out.close();
    }

    /**
     * Returns true if the file's contents contains the character sequence.
     * @see String#contains(CharSequence)
     */
    public boolean contains(CharSequence s){return indexOf(s.toString()) > -1;}

    /**
     * This method replaces the first character in the file's contents that matches target with the replacement.
     * @see String#replace(char, char)
     */
    public void replaceFirst(char target, char replacement) {
        //TODO: method stub
    }

    /**
     * This method replaces the all characters in the file's contents that matches target with the replacement.
     * @see String#replace(char, char)
     */
    public void replaceAll(char target, char replacement) {
        //TODO: method stub
    }

    /**
     * This method replaces the the first string in the file's contents that matches target with the replacement.
     * Regex replacement is not supported because +* and {} could match across larger sections than can be loaded into a string.
     * @see String#replaceFirst(String, String)
     */
    public void replaceFirst(CharSequence target, CharSequence replacement) {
        //TODO: method stub
    }

    /**
     * This method replaces the all strings in the file's contents that matches target with the replacement.
     * Regex replacement is not supported because +* and {} could match across larger sections than can be loaded into a string.
     * @see String#replaceAll(String, String)
     */
    public void replaceAll(CharSequence target, CharSequence replacement) {
        //TODO: method stub
    }

    /**
     * This method splits based on the literal string. If limit is < 1 then it is only limited by array size (which will
     * throw OutOfMemoryError if exceeded).
     * Regex is not supported because +* and {} could match across larger sections than can be loaded into a string.
     * @see String#split(String, int)
     */
    public String[] split(String separator, int limit) {
        //TODO: method stub
        return null;
    }

    /**
     * This method splits based on the literal string. Will throw OutOfMemoryError if exceeds max array size.
     * Regex is not supported because +* and {} could match across larger sections than can be loaded into a string.
     * @see String#split(String)
     */
    public String[] split(String separator){return split(separator, 0);}

    /**
     * Changes the file contents to be all lower case according to the locale.
     * @see String#toLowerCase(Locale)
     */
    public void toLowerCase(Locale locale) {
        //TODO: method stub
    }

    /**
     * Changes the file contents to be all lower case according to the default locale.
     * @see String#toLowerCase()
     */
    public void toLowerCase(){toLowerCase(Locale.getDefault());}

    /**
     * Changes the file contents to be all upper case according to the locale.
     * @see String#toUpperCase(Locale)
     */
    public void toUpperCase(Locale locale) {
        //TODO: method stub
    }

    /**
     * Changes the file contents to be all upper case according to the default locale.
     * @see String#toUpperCase()
     */
    public void toUpperCase(){toUpperCase(Locale.getDefault());}

    /**
     * Removes all whitespace (including end lines) at the beginning and end of the file contents.
     * @see String#trim()
     */
    public void trimFileContents() {
        //TODO: method stub
    }

    /**
     * Removes all whitespace (except end lines) at the beginning and end of each line of the file contents.
     * @see String#trim()
     */
    public void trimEachLine() {
        //TODO: method stub
    }

    /**
     * Removes all whitespace (except end lines) at the end of each line of the file contents.
     * @see String#trim()
     */
    public void trimLinesTrailing() {
        //TODO: method stub
    }

    /**
     * If there are multiple blank lines in a row in the file contents, all but the first are removed.
     * @see String#trim()
     */
    public void removeRedundantBlankLines() {
        //TODO: method stub
    }

    /**
     * Removes all lines that are empty from the file contents.
     * @see String#trim()
     */
    public void removeAllBlankLines() {
        //TODO: method stub
    }
}
