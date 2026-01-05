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

// async/await pattern (see [Asynchronous Programming](../docs/fundamentals/async-programming.md) for async patterns)
for await (const event of watcher) {
  console.log(event);
  if (event.eventType === 'change') {
    console.log('File Updated');

    // FileHandle.read() - Reads from current position
    // Returns: { bytesRead: number, buffer: Buffer }
    const data = await fileHandler.read();

    // Convert buffer to string for display
    console.log(data.buffer.toString('utf-8'));

    // Note: Keep handle open for multiple reads (don't close inside loop)
    // Close handle when done (outside the loop)
  }
}

// Cleanup: Close handle when done
// await fileHandler.close();
