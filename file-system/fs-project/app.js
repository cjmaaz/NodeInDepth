/**
 * File Watcher Example: Using FileHandle for Efficient File Monitoring
 *
 * Demonstrates file watching with FileHandle for efficient repeated reads.
 * See README.md for comprehensive FileHandle theory and advantages.
 *
 * Related fundamentals:
 * - [File Systems](../docs/fundamentals/file-systems.md) - FileHandle, file descriptors, I/O operations
 * - [Asynchronous Programming](../docs/fundamentals/async-programming.md) - async/await patterns
 */

import fs from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const commandTextFile = resolve(__dirname, './command.txt');

// FileHandle: Opens file once, keeps it open for multiple reads (see [File Systems](../docs/fundamentals/file-systems.md) for file descriptors)
// Advantage: Reuses same handle instead of opening/closing each time
// See README.md for detailed FileHandle explanation
const commandFileHandler = await fs.open(commandTextFile, 'r');

commandFileHandler.on('change', async () => {
  // FileHandle.read() - Reads from current position
  // Returns: { bytesRead: number, buffer: Buffer }
  // const data = await commandFileHandler.read();

  // Convert buffer to string for display
  // console.log(data.buffer.toString('utf-8'));

  // Note: Keep handle open for multiple reads (don't close inside loop)
  // Close handle when done (outside the loop)

  const size = (await commandFileHandler.stat()).size;
  // Allocate our buffer with the size of our file.
  const buff = Buffer.alloc(size);
  // The location at which we want to start filling our buffer.
  const length = buff.byteLength;
  // How many bytes we want to read
  console.log(`Size of file: ${size} and byteLength of buffer: ${length}`);
  // The position that we want to start reading the file from
  const position = 0;
  const offset = 0;

  // We always want to read the whole content (from the beginning all the way to the end).
  // The other way is mentioned above, this method is for us to understand what other way read method works.
  const content = await commandFileHandler.read(buff, offset, length, position);
  console.log(content);
});

// ============================================
// File Watcher with FileHandle
// ============================================
const watcher = fs.watch(commandTextFile);

for await (const event of watcher) {
  if (event.eventType === 'change') {
    commandFileHandler.emit('change');
  }
}

// Cleanup: Close handle when done
// await commandFileHandler.close();
