// Unsafe Buffer
// NOTE: Do not execute with unsafeMaxBuffer uncommented, could crash the system if you do not have 4 GiB of memory available.

import { Buffer, constants } from 'node:buffer';

const unsafeBuffer = Buffer.allocUnsafe(10000);
const unsafeMaxBuffer = Buffer.allocUnsafe(constants.MAX_LENGTH);
// Max Size Supported:
// for 32-bit architecture: 1 GiB
// for 64-bit architecture: 4 GiB

console.log(unsafeBuffer.toString('utf-8'));
console.log(unsafeMaxBuffer.toString('utf-8'));

for (let i = 0; i < unsafeBuffer.length; i++) {
  console.log(unsafeBuffer[i].toString('2'));
}

/*
 * Node whenever it launches actually create a allocation of 8 KiB or 8192 Bytes.
 * When can be checked by method Buffer.poolSize and can be used to create unsafe allocation by doing a right shift by 1.
 * Right shift by 1, >>> 1 means float of divided by 2 in base 10, i.e. Math.floor(Buffer.poolSize / 2)
 * TODO: I am not sure why do we need to do divided by 2 or in other word right shift by 1.
 *
 */

// Buffer.poolSize defaults to 8 KiB or 8192 Bytes
const restrictedUnsafeAlloc = Buffer.alloc(Buffer.poolSize >>> 1);

for (let i = 0; i < restrictedUnsafeAlloc.length; i++) {
  console.log(restrictedUnsafeAlloc[i].toString('2'));
}

/*
 * poolSize? pool?
 * What is pooling?
 * A reusable scratchpad of raw memory that Node keeps nearby so it doesn’t have to ask the OS every time.
 */
