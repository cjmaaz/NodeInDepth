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

// CONSTANTS
const CREATE_FILE = 'create a file';

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
  // The number of bytes in the buffer (how many bytes we want to read).
  const length = buff.byteLength;
  // console.log(`Size of file: ${size} and byteLength of buffer: ${length}`); // Size of file: 6 and byteLength of buffer: 6

  // offset: The location in the buffer where data will start being written (0 = start of buffer)
  const offset = 0;
  // position: The location in the file where reading will start (0 = start of file)
  const position = 0;

  // We always want to read the whole content (from the beginning all the way to the end).
  // Alternative method: Using read() without parameters reads from current file position
  // (see commented code above at lines 26-31). This method with explicit parameters
  // gives us full control over buffer offset and file position.
  // We can directly look into buff variable as the read content will be saved to the passed parameter buffer

  await commandFileHandler.read(buff, offset, length, position);

  // console.log(buff); // <Buffer 68 65 6c 6c 6f 0a> // "hello" with new line
  // Trim whitespace and newlines from the command text
  const commandText = buff.toString('utf-8').trim();

  // Create a file command: "create a file <path>"
  // Example: "create a file ./test.txt"
  if (commandText.includes(CREATE_FILE)) {
    // Extract file path after "create a file " (note the space after "file")
    const filePath = commandText.substring(CREATE_FILE.length + 1).trim();
    await createFile(filePath);
  }
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

async function createFile(path) {
  try {
    // Check if the file already exists by attempting to open it for reading
    const existingFileHandle = await fs.open(path, 'r');
    existingFileHandle.close();
    // File already exists
    console.log(`The file path ${path} already exists.`);
  } catch (error) {
    // File doesn't exist, so we create it
    const newFile = await fs.open(path, 'w');
    console.log('A new file created successfully.');
    newFile.close();
  }
}
