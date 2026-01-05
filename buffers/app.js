import { Buffer } from 'node:buffer';

// Buffer is a static method

// Memory allocation (see [Memory](../docs/fundamentals/memory.md) for details on heap allocation and memory pools)
const memoryContainer = Buffer.alloc(4); // 4 Bytes

// Writing hex values (see [Binary Data](../docs/fundamentals/binary-data.md) for hex explanation)
memoryContainer[0] = 0xff; // Directly writing to index
memoryContainer[1] = 0x32; // 0x32 -> 2 digits of hex value, 1 for each nibble (times 2) and 2 for a byte.
memoryContainer[2] = -32;
memoryContainer[3] = 10;
// memoryContainer[4] = 12; // This won't add anything to the buffer memoryContainer as only 4 bytes are allocated.

/*
 * How do we know that indexes on memoryContainer variable?
 * We have allocated 4 bytes using .alloc() method on the memoryContainer.
 */

console.log(typeof memoryContainer);
console.log(memoryContainer instanceof Buffer);
console.log(memoryContainer);
console.log(memoryContainer[0]);

console.log('Writing with writeInt8 method');
memoryContainer.writeInt8(-32, 2);
console.log(memoryContainer);
// Converting the entire buffer into hex value (see [Binary Data](../docs/fundamentals/binary-data.md) for hex encoding)
console.log(memoryContainer.toString('hex'));

// Buffer.toString() supports multiple encodings (see [Binary Data](../docs/fundamentals/binary-data.md) for character encoding details):
// 'hex' - Hexadecimal encoding (0-9, a-f), each byte represented as 2 hex digits
// 'utf-8' - UTF-8 Unicode encoding (default), interprets bytes as UTF-8 characters
// 'utf16le' - UTF-16 Little Endian encoding, 2 bytes per character
// 'latin1' - ISO-8859-1 encoding, single byte per character (0-255)
// 'ascii' - ASCII encoding, 7-bit characters (0-127)
// 'base64' - Base64 encoding, converts binary to ASCII string
// 'base64url' - URL-safe Base64 encoding

// Example: Different encodings of the same buffer
const exampleBuffer = Buffer.from([72, 101, 108, 108, 111]); // "Hello" in ASCII
console.log('hex:', exampleBuffer.toString('hex')); // "48656c6c6f"
console.log('utf-8:', exampleBuffer.toString('utf-8')); // "Hello"
console.log('base64:', exampleBuffer.toString('base64')); // "SGVsbG8="
console.log('ascii:', exampleBuffer.toString('ascii')); // "Hello"
console.log('latin1:', exampleBuffer.toString('latin1')); // "Hello"

/*
 * When we access the element directly by providing the index, we get the response in decimal (base 10).
 * Note: this .toString() on memoryContainer is different than to string on memoryContainer[0].
 *
 * Why is it different?
 *
 * 1. buffer.toString(encoding):
 *    - Operates on the ENTIRE buffer
 *    - Interprets the buffer's bytes according to the specified encoding (hex, utf-8, base64, etc.)
 *    - Returns a STRING representation of the entire buffer's content
 *    - Example: Buffer.from([72, 101]).toString('hex') returns "4865" (all bytes as hex)
 *
 * 2. buffer[index].toString():
 *    - Operates on a SINGLE byte (number) at the specified index
 *    - buffer[index] returns a NUMBER (0-255) representing the byte value
 *    - .toString() on a number converts it to a decimal string representation
 *    - Example: Buffer.from([72, 101])[0].toString() returns "72" (just the number as string)
 *
 * The key difference:
 * - buffer.toString() = encoding conversion of entire buffer → string
 * - buffer[index].toString() = number to string conversion of single byte → string
 *
 * See [Binary Data](../docs/fundamentals/binary-data.md) for details on number systems (decimal, hex, binary).
 *
 */

memoryContainer[3] = 0x0;
if (memoryContainer[3] === 0) {
  console.log(
    'The value at index 3 should be decimal number 0, even though we populated the value in hex format.',
  );
  console.log(
    `typeof the index 3: ${typeof memoryContainer[3]} and value is: ${memoryContainer[3]}`,
  );
}

// Challenge: Converting between number systems
// Binary: 0100 1000 0110 1001 0010 0001
// See [Binary Data](../docs/fundamentals/binary-data.md) for number system conversions

const challengeBuffer = Buffer.alloc(3);

// Hex: 0x48 0x69 0x21
// Dec: 72   105   33
challengeBuffer.writeInt8(72, 0);
challengeBuffer.writeInt8(105, 1);
challengeBuffer.writeInt8(33, 2);

console.log(challengeBuffer.toString('utf-8'));

console.log('With Buffer.from methods');
const buff = Buffer.from([0x48, 0x69, 0x21]);
console.log(buff.toString('utf-8'));
const buffAnother = Buffer.from('486921', 'hex');
console.log(buffAnother.toString('utf-8'));

// ============================================
// Additional Buffer Methods and Operations
// ============================================

console.log('\n=== Writing Multi-byte Integers ===');
// Writing 16-bit and 32-bit integers
const multiByteBuffer = Buffer.alloc(8);

// Big Endian (BE): Most significant byte first (network byte order)
// Little Endian (LE): Least significant byte first (x86/x64 byte order)
// See [Binary Data](../docs/fundamentals/binary-data.md) for endianness explanation
multiByteBuffer.writeInt16BE(0x1234, 0); // Writes 0x12, 0x34
multiByteBuffer.writeInt32BE(0x12345678, 2); // Writes 0x12, 0x34, 0x56, 0x78

multiByteBuffer.writeInt16LE(0x1234, 0); // Writes 0x34, 0x12
multiByteBuffer.writeInt32LE(0x12345678, 2); // Writes 0x78, 0x56, 0x34, 0x12

console.log('Multi-byte buffer:', multiByteBuffer.toString('hex'));

console.log('\n=== Reading Multi-byte Integers ===');
const readBuffer = Buffer.from([0x12, 0x34, 0x56, 0x78]);

// Reading signed integers
console.log('readInt8(0):', readBuffer.readInt8(0)); // Reads single byte: 0x12 = 18
console.log('readInt16BE(0):', readBuffer.readInt16BE(0)); // Reads 2 bytes BE: 0x1234 = 4660
console.log('readInt16LE(0):', readBuffer.readInt16LE(0)); // Reads 2 bytes LE: 0x3412 = 13330
console.log('readInt32BE(0):', readBuffer.readInt32BE(0)); // Reads 4 bytes BE: 0x12345678 = 305419896
console.log('readInt32LE(0):', readBuffer.readInt32LE(0)); // Reads 4 bytes LE: 0x78563412 = 2018915346

// Reading unsigned integers (0 to 255 for 8-bit, 0 to 65535 for 16-bit, etc.)
console.log('readUInt8(0):', readBuffer.readUInt8(0)); // 18
console.log('readUInt16BE(0):', readBuffer.readUInt16BE(0)); // 4660
console.log('readUInt16LE(0):', readBuffer.readUInt16LE(0)); // 13330

console.log('\n=== Buffer Slicing ===');
// slice() creates a view (not a copy) - changes affect original
const originalBuffer = Buffer.from([1, 2, 3, 4, 5]);
const slicedBuffer = originalBuffer.slice(1, 4); // Bytes at indices 1, 2, 3
console.log('Original:', originalBuffer.toString('hex'));
console.log('Sliced:', slicedBuffer.toString('hex'));

// Modifying slice affects original (they share memory)
slicedBuffer[0] = 99;
console.log('After modifying slice, original:', originalBuffer.toString('hex')); // Original changed!

console.log('\n=== Buffer Copying ===');
// copy() creates an independent copy
const sourceBuffer = Buffer.from([10, 20, 30, 40, 50]);
const targetBuffer = Buffer.alloc(5);
sourceBuffer.copy(targetBuffer, 0, 1, 4); // Copy bytes 1-3 from source to target starting at index 0
console.log('Source:', sourceBuffer.toString('hex'));
console.log('Target (copied):', targetBuffer.toString('hex'));

// Modifying copy does NOT affect original
targetBuffer[0] = 99;
console.log('After modifying copy, source:', sourceBuffer.toString('hex')); // Source unchanged!

console.log('\n=== Buffer Filling ===');
// fill() fills buffer with a value
const fillBuffer = Buffer.alloc(5);
fillBuffer.fill(0x42); // Fill with 0x42 (66 decimal, 'B' in ASCII)
console.log('Filled buffer:', fillBuffer.toString('hex'));
console.log('As string:', fillBuffer.toString('utf-8')); // "BBBBB"

// Fill specific range
const rangeBuffer = Buffer.alloc(5);
rangeBuffer.fill(0x41, 1, 4); // Fill indices 1-3 with 0x41 ('A')
console.log('Range filled:', rangeBuffer.toString('utf-8')); // "\x00AAAA\x00"

console.log('\n=== Buffer Comparison ===');
// equals() compares buffer contents
const buffer1 = Buffer.from([1, 2, 3]);
const buffer2 = Buffer.from([1, 2, 3]);
const buffer3 = Buffer.from([1, 2, 4]);

console.log('buffer1.equals(buffer2):', buffer1.equals(buffer2)); // true
console.log('buffer1.equals(buffer3):', buffer1.equals(buffer3)); // false

// compare() returns -1, 0, or 1 (like string comparison)
console.log('buffer1.compare(buffer2):', buffer1.compare(buffer2)); // 0 (equal)
console.log('buffer1.compare(buffer3):', buffer1.compare(buffer3)); // -1 (buffer1 < buffer3)

console.log('\n=== Buffer Concatenation ===');
// Buffer.concat() combines multiple buffers
const buf1 = Buffer.from('Hello');
const buf2 = Buffer.from(' ');
const buf3 = Buffer.from('World');
const combined = Buffer.concat([buf1, buf2, buf3]);
console.log('Combined:', combined.toString('utf-8')); // "Hello World"

// Can specify total length (useful for pre-allocation)
const combinedWithLength = Buffer.concat([buf1, buf2, buf3], 11);
console.log('Combined with length:', combinedWithLength.toString('utf-8'));

console.log('\n=== Buffer Type Checking ===');
// Buffer.isBuffer() checks if value is a Buffer instance
const regularArray = [1, 2, 3];
const bufferInstance = Buffer.from([1, 2, 3]);

console.log('Buffer.isBuffer(regularArray):', Buffer.isBuffer(regularArray)); // false
console.log('Buffer.isBuffer(bufferInstance):', Buffer.isBuffer(bufferInstance)); // true
console.log('bufferInstance instanceof Buffer:', bufferInstance instanceof Buffer); // true
