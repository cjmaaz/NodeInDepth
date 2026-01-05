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
 * Right shift by 1, >>> 1 means floor of divided by 2 in base 10, i.e. Math.floor(Buffer.poolSize / 2)
 *
 * Why do we need to divide by 2 (right shift by 1)?
 *
 * This is a performance optimization strategy to prevent pool exhaustion:
 *
 * 1. Pool Management: Node.js maintains a shared memory pool (8 KiB default) for efficient buffer allocation.
 *    When you request a buffer smaller than half the pool size, Node.js allocates from this pool.
 *
 * 2. Half-Pool Rule: By using half the pool size (Buffer.poolSize >>> 1), we ensure:
 *    - There's always free space remaining in the pool for other allocations
 *    - The pool doesn't get completely exhausted, which would force Node.js to request new memory from the OS
 *    - Multiple small allocations can share the same pool efficiently
 *
 * 3. Performance Benefit: Keeping half the pool free means:
 *    - Faster subsequent allocations (no OS calls needed)
 *    - Reduced memory fragmentation
 *    - Better cache locality (pool stays in memory)
 *
 * 4. Why Right Shift: The >>> operator is used instead of division because:
 *    - It's faster (bitwise operation vs division)
 *    - It automatically floors the result (for positive numbers)
 *    - It's a common pattern in performance-critical code
 *
 * Example: If poolSize is 8192 bytes, using >>> 1 gives 4096 bytes.
 *          This ensures at least 4096 bytes remain free for other allocations.
 *
 * See [Memory](../docs/fundamentals/memory.md) for details on memory pools and allocation strategies.
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
 * A reusable scratchpad of raw memory that Node keeps nearby so it doesn't have to ask the OS every time.
 * See [Memory](../docs/fundamentals/memory.md) for memory pool explanation.
 */

// ============================================
// Comparing alloc() vs allocUnsafe()
// ============================================

console.log('\n=== Buffer.alloc() vs Buffer.allocUnsafe() ===\n');

// Buffer.alloc() - Safe, initialized to zero (see [Memory](../docs/fundamentals/memory.md) for memory safety)
console.log('1. Buffer.alloc() - Safe allocation:');
const safeBuffer = Buffer.alloc(10);
// Byte representation in hex (see [Binary Data](../docs/fundamentals/binary-data.md) for hex encoding)
console.log('   Safe buffer (initialized):', safeBuffer.toString('hex'));
console.log(
  '   All bytes are zero:',
  safeBuffer.every((byte) => byte === 0),
); // true

// Buffer.allocUnsafe() - Unsafe, may contain old data (see [Memory](../docs/fundamentals/memory.md) for unsafe allocation)
console.log('\n2. Buffer.allocUnsafe() - Unsafe allocation:');
const unsafeBuffer1 = Buffer.allocUnsafe(10);
console.log('   Unsafe buffer (may contain old data):', unsafeBuffer1.toString('hex'));
console.log('   May contain non-zero values:', !unsafeBuffer1.every((byte) => byte === 0));

// CRITICAL: Always fill unsafe buffers before use!
console.log('\n3. Proper usage of allocUnsafe():');
const unsafeBuffer2 = Buffer.allocUnsafe(10);
unsafeBuffer2.fill(0); // CRITICAL: Fill before use
console.log('   Unsafe buffer after fill:', unsafeBuffer2.toString('hex'));
console.log(
  '   Now safe to use:',
  unsafeBuffer2.every((byte) => byte === 0),
); // true

// ============================================
// When to Use Each Method
// ============================================

console.log('\n=== When to Use Each Allocation Method ===\n');

console.log('Use Buffer.alloc() when:');
console.log('  - Handling user input or sensitive data');
console.log('  - Safety is more important than performance');
console.log('  - You need guaranteed zero-initialized memory');
console.log('  - Working with cryptographic operations');

console.log('\nUse Buffer.allocUnsafe() when:');
console.log('  - Performance is critical');
console.log('  - You will immediately overwrite all data');
console.log('  - Processing temporary buffers in tight loops');
console.log('  - Memory allocation is a bottleneck');

// ============================================
// Performance Comparison Example
// ============================================

console.log('\n=== Performance Comparison ===\n');

// Note: This is a simplified example. Real performance differences
// depend on buffer size, system, and usage patterns.

const size = 10000;
const iterations = 1000;

// Safe allocation (slower but safer)
console.time('alloc()');
for (let i = 0; i < iterations; i++) {
  const buf = Buffer.alloc(size);
  buf.fill(0x42); // Simulate usage
}
console.timeEnd('alloc()');

// Unsafe allocation (faster but requires fill)
console.time('allocUnsafe() + fill()');
for (let i = 0; i < iterations; i++) {
  const buf = Buffer.allocUnsafe(size);
  buf.fill(0x42); // Must fill before use
}
console.timeEnd('allocUnsafe() + fill()');

// Unsafe allocation without fill (fastest but UNSAFE - don't do this!)
console.time('allocUnsafe() without fill (UNSAFE)');
for (let i = 0; i < iterations; i++) {
  const buf = Buffer.allocUnsafe(size);
  // NOT filling - UNSAFE! Only for demonstration
  // In production, you MUST fill unsafe buffers!
}
console.timeEnd('allocUnsafe() without fill (UNSAFE)');

console.log('\nNote: allocUnsafe() is faster, but you MUST fill it before use!');
console.log('      The performance gain comes from skipping initialization.');
console.log('      If you need to fill anyway, the gain may be minimal.');

// ============================================
// Memory Safety Best Practices
// ============================================

console.log('\n=== Memory Safety Best Practices ===\n');

console.log('1. Always fill unsafe buffers before use:');
const exampleUnsafe = Buffer.allocUnsafe(100);
exampleUnsafe.fill(0); // Required!
console.log('   ✓ Unsafe buffer filled before use');

console.log('\n2. Use alloc() for sensitive data:');
const sensitiveData = Buffer.alloc(1024); // Safe, zero-filled
console.log('   ✓ Sensitive data uses safe allocation');

console.log('\n3. Validate buffer size before allocation:');
const maxSafeSize = 10 * 1024 * 1024; // 10 MB
const requestedSize = 5 * 1024 * 1024; // 5 MB

if (requestedSize <= maxSafeSize) {
  const validatedBuffer = Buffer.alloc(requestedSize);
  console.log('   ✓ Buffer size validated before allocation');
} else {
  console.log('   ✗ Requested size exceeds safe limit');
}

console.log('\n4. Clean up large buffers when done:');
let largeBuffer = Buffer.alloc(100 * 1024 * 1024); // 100 MB
// ... use buffer ...
largeBuffer = null; // Help garbage collector (see [Memory](../docs/fundamentals/memory.md) for GC details)
console.log('   ✓ Large buffer reference cleared');
