/*
 * File Descriptors: When your operating system opens a file, it assigns that open file a unique number called a file descriptor.
 * Think of it like a ticket number at a deli counter.
 * Instead of carrying around the entire file, your program just holds onto this small number that references the open file.
 * This file descriptor is what the operating system uses to know which file you're talking about when you want to read, write, or perform other operations.
 */

import fs from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const commandTextFile = resolve(__dirname, './command.txt');

const watcher = fs.watch(commandTextFile);

for await (const event of watcher) {
  console.log(event);
  if (event.eventType === 'change') {
    console.log('File Updated');
  }
}
