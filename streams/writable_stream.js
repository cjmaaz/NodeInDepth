/**
 * Writable stream examples (fs write stream)
 *
 * Goal: show backpressure correctly:
 * - `stream.write()` returns boolean
 * - when it returns false, wait for `'drain'` to resume writing
 *
 * References:
 * - Node docs: https://nodejs.org/api/stream.html#class-streamwritable
 * - `.write()`: https://nodejs.org/api/stream.html#writablewritechunk-encoding-callback
 * - `writableHighWaterMark`: https://nodejs.org/api/stream.html#writablewritablehighwatermark
 *
 * In-repo:
 * - `docs/fundamentals/streams.md` (mental model)
 * - `streams/writeMany.js` (bigger stress test)
 */

import fs from 'node:fs/promises';
import { Buffer } from 'node:buffer';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const outFile = join(tmpdir(), `nodeindepth-writable-${Date.now()}.txt`);

const fh = await fs.open(outFile, 'w');
const writable = fh.createWriteStream();

console.log('Output file:', outFile);
console.log('writableHighWaterMark (bytes):', writable.writableHighWaterMark);

let i = 0;
const totalWrites = 50_000;

function pump() {
  while (i < totalWrites) {
    const chunk = Buffer.from(`line=${i}\n`, 'utf-8');
    const isLast = i === totalWrites - 1;
    i++;

    if (isLast) {
      // end() writes the final chunk and signals completion.
      writable.end(chunk);
      return;
    }

    if (!writable.write(chunk)) {
      // Backpressure: stop producing and resume on 'drain'.
      return;
    }
  }
}

writable.on('drain', pump);
writable.on('error', (err) => console.error('Writable error:', err));
writable.on('finish', () => console.log('finish: all data flushed'));
writable.on('close', () => {
  // Best-effort: close the file handle after the stream is done with it.
  fh.close().catch(() => {});
});

pump();
