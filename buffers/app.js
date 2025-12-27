import { Buffer } from 'node:buffer';

// Buffer is a static method

const memoryContainer = Buffer.alloc(4); // 4 Bytes

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
console.log(memoryContainer.toString('hex')); // Converting the entire buffer into hex value, other values supported 'utf-8' for Unicode. TODO: Populate other values for this.

/*
 * When we access the element directly by providing the index, we get the response in decimal (base 10).
 * Note: this .toString() on memoryContainer is different than to string on memoryContainer[0].
 * TODO: Why is it different?
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

// Challenge
// Binary: 0100 1000 0110 1001 0010 0001

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
