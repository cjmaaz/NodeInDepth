import fsp from 'node:fs/promises';
import fs from 'node:fs';

import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logTextFile = resolve(__dirname, './log.txt');

const dataPromise = await fsp.readFile(logTextFile);

fs.readFile(logTextFile, (err, data) => {
  console.log(data.toString('utf-8'));
});

console.log(dataPromise.toString('utf-8'));
