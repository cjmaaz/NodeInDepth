import fs from 'node:fs/promises';

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const testFile = resolve(__dirname, './test.txt');

console.time('writeMany');
const fileHandler = await fs.open(testFile, 'w');
const stream = fileHandler.createWriteStream();

console.log('HighWaterMark in Bytes: ', stream.writableHighWaterMark); // In v24.12 -> 64 KiB or 65536 Bytes
console.log('How much in queue is filled, ready to be written: ', stream.writableLength);

for (let i = 0; i < 100000; i++) {
  const buff = Buffer.from(` ${i} `, 'utf-8');
  stream.write(buff);
}
console.timeEnd('writeMany');
console.log('How much in queue is filled, ready to be written: ', stream.writableLength);
