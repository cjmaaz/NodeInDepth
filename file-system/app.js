import fs from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logTextFile = resolve(__dirname, './log.txt');

let data = fs.readFileSync(logTextFile);
console.log(data); // Buffer

data = fs.readFileSync(logTextFile, 'utf-8');
console.log(data); // Decoded Buffer to UTF
