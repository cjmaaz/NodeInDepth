/**
 * File System: Synchronous Operations
 *
 * Demonstrates synchronous file operations using fs.readFileSync().
 * Shows the difference between reading files as raw buffers vs decoded strings.
 *
 * Note: Synchronous operations block the event loop. Use with caution in production.
 * See [File Systems](../docs/fundamentals/file-systems.md) for blocking vs non-blocking I/O.
 * See README.md for detailed explanations and when to use synchronous operations.
 */

import fs from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logTextFile = resolve(__dirname, './log.txt');

// ============================================
// Synchronous File Reading
// ============================================

// Read file without encoding - returns Buffer (binary data) (see [Buffers](../buffers/) for buffer operations)
let data = fs.readFileSync(logTextFile);
console.log('Buffer (binary data):', data);
console.log('Type:', typeof data); // object
console.log('Is Buffer?', Buffer.isBuffer(data)); // true

// Read file with UTF-8 encoding - returns decoded string
// When encoding is specified, fs.readFileSync() automatically converts buffer to string
data = fs.readFileSync(logTextFile, 'utf-8');
console.log('\nString (decoded):', data);
console.log('Type:', typeof data); // string

// ============================================
// Buffer vs String Encoding
// ============================================

// Reading as Buffer gives you raw binary data (see [Binary Data](../docs/fundamentals/binary-data.md) for hex encoding)
const bufferData = fs.readFileSync(logTextFile);
console.log('\n=== Buffer Operations ===');
console.log('Buffer length (bytes):', bufferData.length);
console.log('Buffer as hex:', bufferData.toString('hex'));
console.log('Buffer as base64:', bufferData.toString('base64'));

// Reading as string gives you decoded text
const stringData = fs.readFileSync(logTextFile, 'utf-8');
console.log('\n=== String Operations ===');
console.log('String length (characters):', stringData.length);
console.log('String content:', stringData);

// ============================================
// Example: Reading Config at Startup
// ============================================

// Synchronous operations are acceptable for startup/config files
try {
  const config = fs.readFileSync(resolve(__dirname, './config.json'), 'utf-8');
  const parsedConfig = JSON.parse(config);
  console.log('\nConfig loaded:', parsedConfig);
} catch (error) {
  console.error('Error reading config:', error.message);
}

// See README.md for when to use synchronous operations and best practices
