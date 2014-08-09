package src;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.net.URI;
import java.util.Locale;

/**
 * I have no idea if this class is thread safe and which parts would be.
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
    public String contentsAsString() {
    	return substring(0, length());
    }

    /**
     * Returns true if the file's contents are empty.
     * Will throw OperationNotSupportedException if the file does not exist or is a directory.
     * @see String#isEmpty()
     */
    public boolean isEmpty() {
        return false;
    }

    /**
     * Returns the character of the file's contents that is located at the index specified.
     * @throws IndexOutOfBoundsException
     * @see String#charAt(int)
     */
    public char charAt(long index) {
        return '\0';
    }

    /**
     * Populates a character array with a section of the file's contents.
     * @throws IndexOutOfBoundsException
     * @see String#getChars(int, int, char[], int)
     */
    public void getChars(long srcBegin, long srcEnd, char dst[], int dstBegin) {
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
    	return false;
    }

    /**
     * Returns true if both files have the same contents.
     * @see String#contentEquals(CharSequence)
     */
    public boolean contentEquals(File otherFile) {
        return false;
    }

    /**
     * Returns true if the file's contents matches the String ignoring case.
     * @see String#equalsIgnoreCase(String)
     */
    public boolean contentEqualsIgnoreCase(String anotherString) {
        return false;
    }

    /**
     * Compares the file's contents to the String.
     * @see String#compareTo(String)
     */
    public int compareContents(String anotherString) {
        return 0;
    }

    /**
     * Compares the file's contents to the String ignoring case.
     * @see String#compareToIgnoreCase(String)
     */
    public int compareContentsIgnoreCase(String anotherString) {
        return 0;
    }

    /**
     * Returns true if the file's contents, after the offset, starts with the String.
     * @see String#startsWith(String, int)
     */
    public boolean startsWith(String prefix, long toffset) {
        return false;
    }

    /**
     * Returns true if the file's contents starts with the String.
     * @see String#startsWith(String)
     */
    public boolean startsWith(String prefix) {
        return startsWith(prefix, 0);
    }

    /**
     * Returns true if the file's contents ends with the String.
     * @see String#endsWith(String)
     */
    public boolean endsWith(String suffix) {
        return false;
    }

    /**
     * This method searches the file's contents for the first matching character
     * and returns the index.
     * @see String#indexOf(int)
     */
    public long indexOf(char ch) {
        return indexOf(ch, 0);
    }

    /**
     * This method searches the file's contents, starting at fromIndex, for the first matching character
     * and returns the index.
     * @see String#indexOf(int, int)
     */
    public long indexOf(char ch, long fromIndex) {
        return -1;
    }

    /**
     * This method searches the file's contents for the last matching character
     * and returns the index.
     * @see String#lastIndexOf(int)
     */
    public long lastIndexOf(char ch) {
        return 0;
    }

    /**
     * This method searches the file's contents, starting at fromIndex, for the last matching character
     * and returns the index.
     * @see String#lastIndexOf(int, int)
     */
    public long lastIndexOf(char ch, long fromIndex) {
    	return -1;
    }

    /**
     * This method searches the file's contents for the first matching substring
     * and returns the index.
     * @see String#indexOf(String)
     */
    public long indexOf(String str) {
        return indexOf(str, 0);
    }

    /**
     * This method searches the file's contents, starting at fromIndex, for the first matching substring
     * and returns the index.
     * @see String#indexOf(String, int)
     */
    public long indexOf(String str, long fromIndex) {
        return 0;
    }

    /**
     * This method searches the file's contents for the last matching substring
     * and returns the index.
     * @see String#lastIndexOf(String)
     */
    public long lastIndexOf(String str) {
        return 0;
    }

    /**
     * This method searches the file's contents, starting at fromIndex, for the last matching character
     * and returns the index.
     * @see String#lastIndexOf(String, int)
     */
    public long lastIndexOf(String str, long fromIndex) {
        return 0;
    }

    /**
     * Returns a substring of the file's contents starting at beginIndex until the end of the file.
     * @throws IndexOutOfBoundsException if: beginIndex is negative, beginIndex is larger than the length of this file's contents
     * or if the range can't fit into a String. 
     * @see String#substring(int)
     */
    public String substring(long beginIndex) {
        return null;
    }

    /**
     * Returns a substring of the file's contents starting at beginIndex until the endIndex.
     * @throws IndexOutOfBoundsException if:
     * <ul>
     * <li>beginIndex is negative</li>
     * <li>beginIndex is larger than the length of this file's contents</li>
     * <li>beginIndex is larger than endIndex</li>
     * <li>endIndex is negative</li>
     * <li>endIndex is larger than the length of this file's contents</li>
     * <li>the range can't fit into a String</li>
     * </ul>
     * @see String#substring(int, int)
     */
    public String substring(long beginIndex, long endIndex) {
        return null;
    }

    /**
     * Appends the string to the file's contents.
     * @throws IOException if the file can't be written to.
     * @see String#concat(String)
     */
    public void concat(String newContents) throws IOException {
    	if(!this.exists()) this.createNewFile();
        BufferedWriter out = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(this, true)));
        out.write(newContents);
        out.close();
    }

    /**
     * Returns true if the file's contents contains the character sequence.
     * @see String#contains(CharSequence)
     */
    public boolean contains(CharSequence s) {
        return indexOf(s.toString()) > -1;
    }

    /**
     * This method replaces the first character in the file's contents that matches target with the replacement.
     * @see String#replace(char, char)
     */
    public void replaceFirst(char target, char replacement) {
    }

    /**
     * This method replaces the all characters in the file's contents that matches target with the replacement.
     * @see String#replace(char, char)
     */
    public void replaceAll(char target, char replacement) {
    }

    /**
     * This method replaces the the first string in the file's contents that matches target with the replacement.
     * Regex replacement is not supported because +* and {} could match across larger sections than can be loaded into a string.
     * @see String#replaceFirst(String, String)
     */
    public void replaceFirst(CharSequence target, CharSequence replacement) {
    }

    /**
     * This method replaces the all strings in the file's contents that matches target with the replacement.
     * Regex replacement is not supported because +* and {} could match across larger sections than can be loaded into a string.
     * @see String#replaceAll(String, String)
     */
    public void replaceAll(CharSequence target, CharSequence replacement) {
    }

    /**
     * This method splits based on the literal string. If limit is < 1 then Integer.MAX_VALUE-8 is used.
     * Regex is not supported because +* and {} could match across larger sections than can be loaded into a string.
     * @see String#split(String, int)
     */
    public String[] split(String separator, int limit) {
        return null;
    }

    /**
     * This method splits based on the literal string. There is an imposed limit of Integer.MAX_VALUE-8.
     * Regex is not supported because +* and {} could match across larger sections than can be loaded into a string.
     * @see String#split(String)
     */
    public String[] split(String separator) {
        return split(separator, 0);
    }

    /**
     * Changes the file contents to be all lower case according to the locale.
     * @see String#toLowerCase(Locale)
     */
    public void toLowerCase(Locale locale) {
    }

    /**
     * Changes the file contents to be all lower case according to the default locale.
     * @see String#toLowerCase()
     */
    public void toLowerCase() {
        toLowerCase(Locale.getDefault());
    }

    /**
     * Changes the file contents to be all upper case according to the locale.
     * @see String#toUpperCase(Locale)
     */
    public void toUpperCase(Locale locale) {
    }

    /**
     * Changes the file contents to be all upper case according to the default locale.
     * @see String#toUpperCase()
     */
    public void toUpperCase() {
        toUpperCase(Locale.getDefault());
    }

    /**
     * Removes all whitespace (including end lines) at the beginning and end of the file contents.
     * @see String#trim()
     */
    public void trimFileContents() {
    }

    /**
     * Removes all whitespace (except end lines) at the beginning and end of each line of the file contents.
     * @see String#trim()
     */
    public void trimEachLine() {
    }

    /**
     * Removes all whitespace (except end lines) at the end of each line of the file contents.
     * @see String#trim()
     */
    public void trimLinesTrailing() {
    }

    /**
     * If there are multiple blank lines in a row in the file contents, all but the first are removed.
     * @see String#trim()
     */
    public void removeRedundantBlankLines() {
    }

    /**
     * Removes all lines that are empty from the file contents.
     * @see String#trim()
     */
    public void removeAllBlankLines() {
    }
}
