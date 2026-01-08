# Binary Data: Bits, Bytes, and Number Systems

### Why understanding binary data matters

---

## Problem Statement

### The Digital World is Binary

Computers operate on a fundamental principle: everything is represented using just two states - **on** or **off**, **1** or **0**. This binary system is the foundation of all digital computing.

### Why This Matters

Without understanding binary data:

- You can't understand how computers store and process information
- Working with binary file formats (images, executables) becomes mysterious
- Network protocols and data transmission remain opaque
- Memory management and data structures don't make sense
- You can't effectively work with Node.js Buffers

### Real-World Need

When working with Node.js:

- **Buffers** work directly with binary data
- **File operations** handle binary files (images, videos, executables)
- **Network protocols** transmit binary data
- **Cryptographic operations** manipulate binary data
- **Performance optimization** requires understanding data representation

---

## Solution: Understanding Binary Data

### What is Binary?

**Binary** means "two states" - everything in computing is represented using just two digits: **0** and **1**. These are called **bits** (binary digits).

### Why Binary?

Computers use binary because:

1. **Physical Implementation**: Electronic circuits can easily represent two states (voltage high/low, current on/off)
2. **Reliability**: Two states are less error-prone than multiple states
3. **Simplicity**: Binary logic is mathematically simple and well-understood
4. **Universality**: All digital systems use binary as the foundation

---

## Bits and Bytes

### What is a Bit?

A **bit** (binary digit) is the smallest unit of data in computing. It can have only two values:

- **0** (off, false, low voltage)
- **1** (on, true, high voltage)

### What is a Byte?

A **byte** is a group of 8 bits. It's the fundamental unit for representing data in most computer systems.

```
1 byte = 8 bits
```

### Why 8 Bits?

8 bits became standard because:

- **Historical**: Early computers used 8-bit architectures
- **Practical**: 8 bits can represent 256 different values (2^8 = 256)
- **Convenient**: Enough to represent ASCII characters, small numbers, and common data types
- **Standard**: Universal standard across all modern systems

### Byte Values

A single byte can represent values from **0** to **255** (256 total values):

```
Binary:  00000000 = 0 (decimal)
Binary:  00000001 = 1 (decimal)
Binary:  00000010 = 2 (decimal)
Binary:  00000011 = 3 (decimal)
...
Binary:  11111111 = 255 (decimal)
```

---

## Number Systems

### Decimal (Base 10)

**Decimal** is the number system we use in everyday life. It uses 10 digits: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9.

**How it works**: Each position represents a power of 10.

```
Example: 1234 (decimal)
= 1 × 10³ + 2 × 10² + 3 × 10¹ + 4 × 10⁰
= 1 × 1000 + 2 × 100 + 3 × 10 + 4 × 1
= 1000 + 200 + 30 + 4
= 1234
```

### Binary (Base 2)

**Binary** uses only 2 digits: 0 and 1.

**How it works**: Each position represents a power of 2.

```
Example: 1011 (binary)
= 1 × 2³ + 0 × 2² + 1 × 2¹ + 1 × 2⁰
= 1 × 8 + 0 × 4 + 1 × 2 + 1 × 1
= 8 + 0 + 2 + 1
= 11 (decimal)
```

### Binary Position Values

```
Position:  7  6  5  4  3  2  1  0
Power:     2⁷ 2⁶ 2⁵ 2⁴ 2³ 2² 2¹ 2⁰
Value:    128 64 32 16  8  4  2  1

Example: 1  0  1  1  0  1  0  1
        128+0+32+16+0+4+0+1 = 181 (decimal)
```

### Hexadecimal (Base 16)

**Hexadecimal** uses 16 digits: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, A, B, C, D, E, F.

**Why hexadecimal?**

- **Compact**: One hex digit represents 4 bits (a "nibble")
- **Readable**: Easier to read than long binary strings
- **Common**: Widely used in programming, memory addresses, colors

**How it works**: Each position represents a power of 16.

```
Example: 2A3 (hexadecimal)
= 2 × 16² + A × 16¹ + 3 × 16⁰
= 2 × 256 + 10 × 16 + 3 × 1
= 512 + 160 + 3
= 675 (decimal)
```

### Hexadecimal Digits

```
Decimal:  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15
Hex:      0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F
Binary: 0000 0001 0010 0011 0100 0101 0110 0111 1000 1001 1010 1011 1100 1101 1110 1111
```

### Why Hexadecimal is Useful

**One hex digit = 4 bits = one nibble**

```
Binary:  1011 0101
Hex:     B    5
Decimal: 181
```

This makes it easy to convert between binary and hex:

- Each hex digit directly maps to 4 binary bits
- Much shorter than binary representation
- Commonly used in memory dumps, colors (RGB), file formats

---

## Number System Conversions

### Decimal to Binary

**Method**: Repeated division by 2

```
Example: Convert 13 (decimal) to binary

13 ÷ 2 = 6 remainder 1  ← least significant bit
 6 ÷ 2 = 3 remainder 0
 3 ÷ 2 = 1 remainder 1
 1 ÷ 2 = 0 remainder 1  ← most significant bit

Read remainders from bottom to top: 1101

13 (decimal) = 1101 (binary)
```

### Binary to Decimal

**Method**: Sum powers of 2

```
Example: Convert 1101 (binary) to decimal

1 × 2³ + 1 × 2² + 0 × 2¹ + 1 × 2⁰
= 1 × 8 + 1 × 4 + 0 × 2 + 1 × 1
= 8 + 4 + 0 + 1
= 13 (decimal)
```

### Decimal to Hexadecimal

**Method**: Repeated division by 16

```
Example: Convert 255 (decimal) to hex

255 ÷ 16 = 15 remainder 15 (F)
 15 ÷ 16 = 0 remainder 15 (F)

Read from bottom to top: FF

255 (decimal) = FF (hex)
```

### Hexadecimal to Decimal

**Method**: Sum powers of 16

```
Example: Convert 2A3 (hex) to decimal

2 × 16² + A × 16¹ + 3 × 16⁰
= 2 × 256 + 10 × 16 + 3 × 1
= 512 + 160 + 3
= 675 (decimal)
```

### Binary to Hexadecimal

**Method**: Group bits into nibbles (4 bits), convert each

```
Example: Convert 10110101 (binary) to hex

Group:  1011  0101
Hex:    B     5

10110101 (binary) = B5 (hex)
```

### Hexadecimal to Binary

**Method**: Convert each hex digit to 4 bits

```
Example: Convert B5 (hex) to binary

B = 1011
5 = 0101

B5 (hex) = 10110101 (binary)
```

---

## Byte Representation (0-255)

### Why 0-255?

A byte has 8 bits, so it can represent 2⁸ = 256 different values, ranging from 0 to 255.

### Common Byte Values

```
Decimal  Binary      Hex    Use Case
------   ------      ---    --------
0        00000000    0x00   Null, empty
1        00000001    0x01   Start of text
10       00001010    0x0A   Line feed (LF)
13       00001101    0x0D   Carriage return (CR)
32       00100000    0x20   Space character
48       00110000    0x30   Character '0'
65       01000001    0x41   Character 'A'
97       01100001    0x61   Character 'a'
255      11111111    0xFF   Maximum byte value
```

### Signed vs Unsigned Bytes

**Unsigned byte**: 0 to 255 (all positive)
**Signed byte**: -128 to 127 (using two's complement)

In Node.js Buffers, bytes are typically unsigned (0-255).

---

## Text vs Binary Data

### Text Data

**Text** is human-readable characters encoded using a character encoding scheme (like UTF-8, ASCII).

**Characteristics**:

- Human-readable
- Uses character encoding (UTF-8, ASCII, etc.)
- Can be displayed directly
- Examples: "Hello", "123", "你好"

**Example**:

```
Text: "Hello"
ASCII: 72 101 108 108 111
Hex:   48 65 6C 6C 6F
```

### Binary Data

**Binary data** is raw bytes that don't represent text.

**Characteristics**:

- Not human-readable
- Represents arbitrary data
- Examples: Images (PNG, JPEG), executables, compressed files, network packets

**Example**:

```
PNG file header (binary):
89 50 4E 47 0D 0A 1A 0A
(Not readable as text)
```

### Why the Distinction Matters

In Node.js:

- **Strings** are for text data (UTF-8 encoded)
- **Buffers** are for binary data (raw bytes)
- **Conversion** is needed between text and binary
- **Encoding** determines how text is represented as bytes

---

## Real-World Examples

### Example 1: ASCII Character Encoding

```
Character 'A':
- ASCII code: 65 (decimal)
- Binary: 01000001
- Hex: 0x41
- In memory: Single byte with value 65
```

### Example 2: RGB Color Values

```
Color: Red
- Red: 255 (0xFF)
- Green: 0 (0x00)
- Blue: 0 (0x00)
- Hex representation: #FF0000
- Binary: 11111111 00000000 00000000
```

### Example 3: File Formats

```
PNG file signature (first 8 bytes):
89 50 4E 47 0D 0A 1A 0A

JPEG file signature (first 2 bytes):
FF D8

These "magic numbers" identify file types
```

---

## How This Relates to Node.js Buffers

### Buffers Work with Bytes

Node.js Buffers are arrays of bytes (0-255 values):

```javascript
const buffer = Buffer.from([72, 101, 108, 108, 111]);
// Each number is a byte value (0-255)
// Represents: "Hello" in ASCII
```

### Buffer Indexing

```javascript
const buffer = Buffer.from([0x48, 0x65, 0x6c, 0x6c, 0x6f]);

buffer[0]; // 72 (decimal) = 0x48 (hex) = 01001000 (binary)
buffer[1]; // 101 (decimal) = 0x65 (hex) = 01100101 (binary)
```

### Buffer Encoding

```javascript
// Binary data
const buffer = Buffer.from([72, 101, 108, 108, 111]);

// Convert to text (UTF-8)
buffer.toString('utf-8'); // "Hello"

// Convert to hex string
buffer.toString('hex'); // "48656c6c6f"

// Convert to binary string
buffer.toString('binary'); // "Hello" (but as binary)
```

---

## Common Pitfalls

### 1. Confusing Number Systems

**Problem**: Mixing decimal, binary, and hex without understanding

**Solution**: Always be clear about which number system you're using

- Decimal: No prefix (72)
- Binary: Often prefixed with `0b` (0b01001000)
- Hex: Prefixed with `0x` (0x48)

### 2. Byte Overflow

**Problem**: Values greater than 255 don't fit in a byte

**Solution**: Understand byte boundaries

```javascript
// This wraps around (modulo 256)
const byte = 300; // Actually becomes 44 (300 % 256)
```

### 3. Text vs Binary Confusion

**Problem**: Treating binary data as text or vice versa

**Solution**: Understand encoding

```javascript
// Binary data (image, executable)
const binary = Buffer.from([0xFF, 0xD8, ...]);

// Text data (string)
const text = Buffer.from('Hello', 'utf-8');
```

---

## Best Practices

### 1. Use Appropriate Number System

- **Decimal**: For human-readable values
- **Hex**: For memory addresses, colors, file formats
- **Binary**: For bit manipulation, understanding internals

### 2. Understand Byte Boundaries

- Always remember: 1 byte = 8 bits = 0-255
- Multi-byte values need multiple bytes
- Endianness matters for multi-byte values (see Endianness section below)

### 3. Know Your Encodings

- **UTF-8**: Modern text encoding (variable length)
- **ASCII**: 7-bit encoding (0-127)
- **Binary**: Raw bytes, no encoding

---

## Endianness

### What is Endianness?

**Endianness** refers to the byte order used to store multi-byte values in memory. It determines which byte (most significant or least significant) is stored first.

### Why Endianness Matters

When storing values larger than a single byte (like 16-bit, 32-bit, or 64-bit integers), the bytes must be stored in a specific order. Different systems use different byte orders, which can cause problems when transferring data between systems.

### Big Endian (BE)

**Big Endian** stores the **most significant byte first** (at the lowest memory address).

**Characteristics**:

- Network byte order (standard for network protocols)
- Human-readable (matches how we write numbers)
- Used by: Motorola processors, some network protocols

**Example**: Storing 0x12345678 (32-bit value)

```
Memory Address:  0x1000  0x1001  0x1002  0x1003
Big Endian:     0x12    0x34    0x56    0x78
                 ↑ Most significant byte first
```

### Little Endian (LE)

**Little Endian** stores the **least significant byte first** (at the lowest memory address).

**Characteristics**:

- x86/x64 byte order (Intel/AMD processors)
- More common in modern systems
- Used by: Intel processors, Windows, most modern systems

**Example**: Storing 0x12345678 (32-bit value)

```
Memory Address:  0x1000  0x1001  0x1002  0x1003
Little Endian:  0x78    0x56    0x34    0x12
                ↑ Least significant byte first
```

### Visual Comparison

```
Value: 0x12345678 (32-bit integer)

Big Endian:    12 34 56 78  (most significant → least significant)
Little Endian: 78 56 34 12  (least significant → most significant)
```

### When Endianness Matters

**Network Communication**:

- Network protocols use Big Endian (network byte order)
- Must convert between host byte order and network byte order

**File Formats**:

- Binary file formats specify endianness
- Reading files from different systems requires correct endianness

**Data Exchange**:

- Transferring binary data between systems
- Inter-process communication
- Database storage

### Node.js Buffer Endianness

Node.js Buffers support both endianness:

```javascript
const buffer = Buffer.alloc(4);

// Big Endian (network byte order)
buffer.writeInt32BE(0x12345678, 0);
// Buffer: [0x12, 0x34, 0x56, 0x78]

// Little Endian (x86/x64 byte order)
buffer.writeInt32LE(0x12345678, 0);
// Buffer: [0x78, 0x56, 0x34, 0x12]
```

### Common Pitfalls

**Problem**: Assuming endianness matches your system

**Solution**: Always specify endianness explicitly:

```javascript
// BAD: Assumes system endianness
const value = buffer.readInt32(0);

// GOOD: Explicit endianness
const value = buffer.readInt32BE(0); // Network byte order
// or
const value = buffer.readInt32LE(0); // x86/x64 byte order
```

---

## Character Encoding Details

### What is Character Encoding?

**Character encoding** is a system that maps characters (letters, numbers, symbols) to numeric values (bytes) that computers can store and process.

### Why Multiple Encodings?

Different encodings serve different purposes:

- **ASCII**: Simple, English-only (7-bit)
- **UTF-8**: Universal, supports all languages (variable length)
- **Latin1**: Single-byte encoding (8-bit)
- **UTF-16**: Two-byte encoding (used in some systems)

### ASCII Encoding

**ASCII** (American Standard Code for Information Interchange) uses 7 bits (0-127) to represent 128 characters.

**Characteristics**:

- English letters (A-Z, a-z)
- Numbers (0-9)
- Basic punctuation and symbols
- Control characters (newline, tab, etc.)

**Limitations**:

- Only 128 characters
- No support for non-English characters
- No emoji or special symbols

**Example**:

```
'A' = 65 (decimal) = 0x41 (hex) = 01000001 (binary)
'0' = 48 (decimal) = 0x30 (hex) = 00110000 (binary)
```

### UTF-8 Encoding

**UTF-8** (Unicode Transformation Format - 8-bit) is a variable-length encoding that can represent any Unicode character.

**Characteristics**:

- Variable length: 1-4 bytes per character
- Backward compatible with ASCII (first 128 characters match ASCII)
- Supports all languages and emoji
- Most common encoding on the web

**How it works**:

- ASCII characters (0-127): 1 byte (same as ASCII)
- Extended characters: 2-4 bytes
- Efficient for English text (1 byte per character)
- Supports international characters

**Example**:

```
'A' = 1 byte: 0x41 (same as ASCII)
'€' = 3 bytes: 0xE2 0x82 0xAC
'你' = 3 bytes: 0xE4 0xBD 0xA0
```

### UTF-16 Encoding

**UTF-16** uses 2 bytes (16 bits) per character for most characters, 4 bytes for some.

**Characteristics**:

- Fixed 2 bytes for most characters
- Used in Windows systems
- Less efficient for ASCII text than UTF-8

### Latin1 Encoding

**Latin1** (ISO-8859-1) uses 1 byte per character (0-255).

**Characteristics**:

- Single byte per character
- Supports Western European languages
- Not suitable for international text

### Encoding in Node.js Buffers

```javascript
// Different encodings produce different byte sequences
const text = 'Hello';

Buffer.from(text, 'ascii'); // [72, 101, 108, 108, 111] (5 bytes)
Buffer.from(text, 'utf-8'); // [72, 101, 108, 108, 111] (5 bytes, same for ASCII)
Buffer.from(text, 'utf16le'); // [72, 0, 101, 0, 108, 0, 108, 0, 111, 0] (10 bytes)

// International characters
const international = '你好';
Buffer.from(international, 'utf-8'); // [228, 189, 160, 229, 165, 189] (6 bytes)
```

### Choosing the Right Encoding

- **UTF-8**: Default choice for modern applications (recommended)
- **ASCII**: Only if you're certain text is English-only
- **Latin1**: Legacy systems or specific requirements
- **Binary**: No encoding, raw bytes

---

## Summary

Understanding binary data is fundamental to working with Node.js:

- **Bits** are the smallest unit (0 or 1)
- **Bytes** are groups of 8 bits (0-255)
- **Number systems** (decimal, binary, hex) represent the same values differently
- **Text vs binary** determines how data is interpreted
- **Endianness** determines byte order for multi-byte values
- **Character encoding** maps characters to bytes
- **Buffers** work directly with binary data

Master these concepts, and working with Buffers becomes intuitive!

---

## Next Steps

- Study [Memory](memory.md) to understand how binary data is stored
- Explore [Buffers](../buffers/) to see binary data in action
- Practice conversions between number systems
- Experiment with Buffer operations in Node.js

---

## Used In

This fundamental concept is used in:

- **[Buffers](../buffers/)**: Binary data handling, hex encoding, number system conversions, endianness operations
- **[File System](../file-system/)**: Binary file operations, encoding conversions, hex representations
- **[Streams](../streams/)**: Chunk payloads (bytes vs text), encoding boundaries, framing vs chunking

## Related Concepts

- **[Memory](memory.md)**: How binary data is stored in memory
- **[File Systems](file-systems.md)**: Binary files and formats
- **[Buffers](../buffers/)**: Practical application of binary data concepts
