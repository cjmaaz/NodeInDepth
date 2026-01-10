import fs from 'node:fs/promises';
import { Buffer } from 'node:buffer';

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const testFile = resolve(__dirname, './test.txt');

console.time('writeMany');
const fileHandler = await fs.open(testFile, 'w');
// FileHandle.createWriteStream() creates a Writable stream backed by a file descriptor.
// The point of using a stream (vs one giant write) is flow control + bounded buffering (see
// [Streams Fundamentals](../docs/fundamentals/streams.md) and [Memory](../docs/fundamentals/memory.md)).
const stream = fileHandler.createWriteStream();

// writableHighWaterMark is a *backpressure threshold* (not a hard limit).
// When internal buffering grows beyond this threshold, .write() will start returning false
// to tell the producer to slow down (see [Streams](../docs/fundamentals/streams.md)).
console.log('HighWaterMark in Bytes: ', stream.writableHighWaterMark); // In v24.12 -> 64 KiB or 65536 Bytes

// writableLength is how many bytes are currently queued in user-space memory waiting to be flushed.
// This is *your process memory*, not the OS kernel page cache (see [Memory](../docs/fundamentals/memory.md)
// and [File Systems](../docs/fundamentals/file-systems.md) for the user/kernel boundary).
// console.log('How much in queue is filled, ready to be written: ', stream.writableLength);

// for (let i = 0; i < 100000; i++) {
//   // Each iteration produces a small Buffer chunk (see [Binary Data](../docs/fundamentals/binary-data.md)).
//   const buff = Buffer.from(` ${i} `, 'utf-8');

//   // IMPORTANT: In real code, you should check the boolean return value:
//   // - true  => keep writing
//   // - false => stop writing and wait for 'drain'
//   //
//   // This example intentionally does NOT stop on false, so you can observe writableLength growth
//   // and observe high RAM usage.
//   // (i.e., what happens when a producer ignores backpressure).
//   stream.write(buff);
// }

// 'drain' fires after the internal buffer empties enough that it's safe to resume writing.
// NOTE: Because this script doesn't pause on write(false), this handler is mostly educational here.
// stream.on('drain', () => console.log('We are now safe to write more!'));

// console.timeEnd('writeMany');
// console.log('How much in queue is filled, ready to be written: ', stream.writableLength);

// IMPORTANT: Don't close the FileHandle before the stream is finished.
// The stream still needs its underlying file descriptor to flush buffered chunks.
stream.on('close', () => {
  console.log('Stream was closed');
  // Best-effort close; depending on stream options, fd may already be closed.
  fileHandler.close().catch(() => {});
});

let i = 0;

const totalWrites = 1_000_000;

function writeMany() {
  while (i < totalWrites) {
    const buff = Buffer.from(` ${i} `, 'utf-8');
    const isLastWrite = i === totalWrites - 1;
    i++;

    // If this is the last chunk, end() will write it and signal completion.
    // Doing write() first and then end(buff) would double-write the last chunk.
    if (isLastWrite) {
      stream.end(buff);
      return;
    }

    // If stream.write returns false, stop the loop and wait for 'drain'.
    if (!stream.write(buff)) break;
  }
}

// Resume our loop once our stream's internal buffer is emptied.
stream.on('drain', () => {
  // console.log('Draining!');
  writeMany();
});

/*
 * The high water mark: (stream.writableHighWaterMark) => 65536 Bytes (or 64 KiB) in v24.12.
 * The drain event fired N times (meaning the internal buffer exceeded the backpressure threshold and
 * later drained enough to resume writing N times).
 *
 * NOTE: You can't reliably compute file size as (highWaterMark * drainCount) because:
 * - highWaterMark is a threshold, not “bytes flushed per drain”
 * - drain timing depends on write sizes and OS flush timing
 * - chunk sizes vary here because the number of digits in `i` changes over time
 */

stream.on('finish', () => {
  // 'finish' means: all data has been flushed to the underlying resource.
  console.timeEnd('writeMany');
});

stream.on('error', (err) => {
  console.error('Write stream error:', err);
});

writeMany();
