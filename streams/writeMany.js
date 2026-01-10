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
//   // and can observe high RAM usage. (TODO: Add more these)
//   // (i.e., what happens when a producer ignores backpressure).
//   stream.write(buff);
// }

// 'drain' fires after the internal buffer empties enough that it's safe to resume writing.
// NOTE: Because this script doesn't pause on write(false), this handler is mostly educational here.
// stream.on('drain', () => console.log('We are now safe to write more!'));

// console.timeEnd('writeMany');
// console.log('How much in queue is filled, ready to be written: ', stream.writableLength);

// TODO: to add more info about below code.
fileHandler.close();
stream.on('close', () => {
  console.log('Stream was closed');
});

let i = 0;

function writeMany() {
  while (i < 1000000) {
    const buff = Buffer.from(` ${i} `, 'utf-8');
    i++;
    if (!stream.write(buff)) break; // If stream.write returns false, stop the loop.
    if (i === 1000000) stream.end(buff); // This is our last write, stream.end signals that no more data will be written to this Writable.
  }
}

// Resume our loop once our stream's internal buffer is emptied.
stream.on('drain', () => {
  // console.log('Draining!'); // We calculate the estimated file size, mentioned in below comment.
  writeMany();
});

/*
 * The high water mark: (stream.writableHighWaterMark) => 65536 Bytes (or 64 KiB) in v24.12.
 * The drained even fired 120 times (meaning the drain was cleared 120 times)
 * 65536 * 120 = 7864320 Bytes
 * The test file that was created was of 78,88,898.
 * Which is few bytes off considering the last write will have something. (TODO: The reason could be wrong and need to verify once)
 */

stream.on('finish', () => {
  console.timeEnd('writeMany');
});

writeMany();
