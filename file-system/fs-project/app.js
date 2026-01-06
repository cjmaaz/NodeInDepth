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

const watcher = fs.watch(commandTextFile);

// FileHandle: Opens file once, keeps it open for multiple reads (see [File Systems](../docs/fundamentals/file-systems.md) for file descriptors)
// Advantage: Reuses same handle instead of opening/closing each time
// See README.md for detailed FileHandle explanation
const fileHandler = await fs.open(commandTextFile, 'r');

// ============================================
// File Watcher with FileHandle
// ============================================

for await (const event of watcher) {
  console.log(event);
  if (event.eventType === 'change') {
    // FileHandle.read() - Reads from current position
    // Returns: { bytesRead: number, buffer: Buffer }
    // const data = await fileHandler.read();

    // Convert buffer to string for display
    // console.log(data.buffer.toString('utf-8'));

    // Note: Keep handle open for multiple reads (don't close inside loop)
    // Close handle when done (outside the loop)

    const size = (await fileHandler.stat()).size;
    const buff = Buffer.alloc(size);
    const length = buff.byteLength;
    console.log(`Size of file: ${size} and byteLength of buffer: ${length}`);
    const position = 0;
    const offset = 0;

    const content = await fileHandler.read(buff, offset, length, position);
    console.log(content);
  }
}

// Cleanup: Close handle when done
// await fileHandler.close();
