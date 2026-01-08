import fs from 'node:fs/promises';

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const testFile = resolve(__dirname, './test.txt');

console.time('writeMany');
const fileHandler = await fs.open(testFile, 'w');

const stream = fileHandler.createWriteStream();

for (let i = 0; i < 100000; i++) {
  const buff = Buffer.from(` ${i} `, 'utf-8');
  stream.write(buff);
}
console.timeEnd('writeMany');
