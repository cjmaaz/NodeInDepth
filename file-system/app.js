/**
 * File System: Asynchronous Operations - Callbacks vs Promises
 *
 * Practical examples demonstrating different file reading approaches.
 * See README.md for comprehensive theory and explanations.
 *
 * Related fundamentals:
 * - [File Systems](../docs/fundamentals/file-systems.md) - File descriptors, I/O operations
 * - [Asynchronous Programming](../docs/fundamentals/async-programming.md) - Callbacks, promises, async/await
 * - [Buffers](../buffers/) - Binary data handling for file operations
 */

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const logTextFile = resolve(__dirname, './log.txt');

// ============================================
// Method 1: Callback-Based (fs.readFile)
// ============================================

console.log('=== Callback-Based File Reading ===\n');

// Error-first callback pattern: (err, data) => {} (see [Asynchronous Programming](../docs/fundamentals/async-programming.md) for callbacks)
fs.readFile(logTextFile, 'utf-8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err.message);
    return;
  }
  console.log('Callback result:', data);
});

// Reading as Buffer (no encoding specified)
fs.readFile(logTextFile, (err, data) => {
  if (err) {
    console.error('Error:', err.message);
    return;
  }
  // data is a Buffer when no encoding specified (see [Buffers](../buffers/) for buffer operations)
  console.log('Callback buffer:', data.toString('utf-8'));
});

// ============================================
// Method 2: Promise-Based (fs.promises.readFile)
// ============================================

console.log('\n=== Promise-Based File Reading ===\n');

// Using async/await (recommended) (see [Asynchronous Programming](../docs/fundamentals/async-programming.md) for async/await)
async function readFileWithPromise() {
  try {
    const data = await fsp.readFile(logTextFile, 'utf-8');
    console.log('Promise result (async/await):', data);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

// Using .then()/.catch()
fsp
  .readFile(logTextFile, 'utf-8')
  .then((data) => {
    console.log('Promise result (.then):', data);
  })
  .catch((err) => {
    console.error('Error:', err.message);
  });

// Reading as Buffer
async function readFileAsBuffer() {
  try {
    const buffer = await fsp.readFile(logTextFile);
    // Buffer when no encoding specified
    console.log('Promise buffer:', buffer.toString('utf-8'));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

readFileWithPromise();
readFileAsBuffer();

// ============================================
// Method 3: Synchronous (fs.readFileSync)
// ============================================

// See fs-types.js for synchronous examples
// Note: Synchronous operations block the event loop (see [File Systems](../docs/fundamentals/file-systems.md) for blocking vs non-blocking I/O)

// ============================================
// Key Distinctions: Error Handling
// ============================================

console.log('\n=== Error Handling Comparison ===\n');

// Callback: Error-first pattern (see [Asynchronous Programming](../docs/fundamentals/async-programming.md))
fs.readFile('nonexistent.txt', 'utf-8', (err, data) => {
  if (err) {
    console.log('Callback error handling: Error-first pattern');
  }
});

// Promise: try/catch (see [Asynchronous Programming](../docs/fundamentals/async-programming.md) for promise error handling)
async function errorHandlingExample() {
  try {
    await fsp.readFile('nonexistent.txt', 'utf-8');
  } catch (err) {
    console.log('Promise error handling: try/catch');
  }
}

// ============================================
// Key Distinctions: Code Flow
// ============================================

// Callback: Nested callbacks (callback hell)
fs.readFile('file1.txt', 'utf-8', (err1, data1) => {
  if (err1) return console.error(err1);
  fs.readFile('file2.txt', 'utf-8', (err2, data2) => {
    if (err2) return console.error(err2);
    console.log('Callback: Nested structure');
  });
});

// Promise: Linear flow with async/await
async function linearFlowExample() {
  try {
    const data1 = await fsp.readFile('file1.txt', 'utf-8');
    const data2 = await fsp.readFile('file2.txt', 'utf-8');
    console.log('Promise: Linear flow with async/await');
  } catch (err) {
    console.error(err);
  }
}

// ============================================
// Key Distinctions: Composing Operations
// ============================================

// Promise: Easy composition with Promise.all() (see [Asynchronous Programming](../docs/fundamentals/async-programming.md) for promise composition)
async function composeOperations() {
  // Read multiple files concurrently
  const [data1, data2] = await Promise.all([
    fsp.readFile('file1.txt', 'utf-8'),
    fsp.readFile('file2.txt', 'utf-8'),
  ]);
  // Both files read concurrently - much faster!
}

// ============================================
// Practical Example: Reading File with All Methods
// ============================================

console.log('\n=== Practical Comparison ===\n');

// Callback approach
fs.readFile(logTextFile, 'utf-8', (err, data) => {
  if (err) {
    console.error('Callback error:', err.message);
    return;
  }
  console.log('1. Callback result:', data.substring(0, 50) + '...');
});

// Promise approach with async/await
(async () => {
  try {
    const data = await fsp.readFile(logTextFile, 'utf-8');
    console.log('2. Promise result:', data.substring(0, 50) + '...');
  } catch (err) {
    console.error('Promise error:', err.message);
  }
})();

// ============================================
// Method 4: FileHandle (fs.open + FileHandle.read)
// ============================================

console.log('\n=== FileHandle: Reusable File Handles ===\n');

// FileHandle keeps file open for multiple operations
// See README.md for detailed FileHandle explanation and advantages

// Example: Creating a FileHandle
// const fileHandler = await fsp.open('file.txt', 'r');
// 'r' = read mode, 'w' = write mode, 'a' = append mode

// Reading with FileHandle (reuses same handle)
// const data1 = await fileHandler.read();
// const data2 = await fileHandler.read(); // Continues from last position
// await fileHandler.close();

// ============================================
// Summary
// ============================================

/*
 * See README.md for comprehensive explanations and comparisons.
 *
 * Quick reference:
 * - fs.readFile(): Callback-based, traditional pattern
 * - fs.promises.readFile(): Promise-based (recommended for simple reads)
 * - fs.readFileSync(): Synchronous (use only for startup/config)
 * - FileHandle.read(): Reusable handle (recommended for repeated reads)
 */
