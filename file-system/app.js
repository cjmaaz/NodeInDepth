/**
 * File System Basics: Reading Files
 *
 * This example demonstrates reading files using Node.js file system module.
 * Shows the difference between reading files as raw buffers vs decoded strings.
 */

import fs from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logTextFile = resolve(__dirname, './log.txt');

// Read file without encoding - returns Buffer (binary data)
let data = fs.readFileSync(logTextFile);
console.log(data); // Buffer

// Read file with UTF-8 encoding - returns decoded string
data = fs.readFileSync(logTextFile, 'utf-8');
console.log(data); // Decoded Buffer to UTF-8 string
