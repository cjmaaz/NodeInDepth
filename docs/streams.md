# Streams (Deep Dive)

### The problem that streams solve

---

## Prerequisites

Before reading this deep dive, it's recommended to understand:

- **[Streams (Fundamentals)](fundamentals/streams.md)**: Vocabulary and the flow-control mental model
- **[Asynchronous Programming](fundamentals/async-programming.md)**: Event loop, scheduling, callbacks vs promises
- **[File Systems](fundamentals/file-systems.md)**: File descriptors, kernel buffering, I/O cost model
- **[Memory](fundamentals/memory.md)**: Buffering, GC pressure, failure modes
- **[Binary Data](fundamentals/binary-data.md)**: Bytes vs text, encodings, boundary issues

---

## Problem Statement

Even when you “use streams”, production systems still get into trouble when they misunderstand what streams actually guarantee:

- treating **chunk boundaries** as message boundaries → parsers break under load
- ignoring **backpressure** → memory grows quietly until latency spikes and OOMs
- handling events manually without a disciplined teardown strategy → resource leaks and partial writes

This document focuses on the mechanics that matter in real systems:

- how Node streams map onto OS I/O boundaries (conceptually)
- how buffering and `highWaterMark` drive backpressure
- the lifecycle/event model and failure propagation
- performance and security tradeoffs

---

## Conceptual model: user space + kernel space

### Two buffers you must mentally separate

When you stream file or network I/O, there are usually _at least_ two buffering layers:

1. **User-space buffers**: Node stream internal queues (JS-visible)
2. **Kernel buffers**: OS page cache, socket buffers, filesystem caches (not directly JS-visible)

Backpressure in Node primarily manages **user-space buffering**. You cannot “turn off” kernel buffering, and you cannot fully control it from JS, but you _can_ control whether your process accumulates unbounded queued data.

---

## Stream types (what each one is for)

### Readable

- Represents a source of chunks.
- Often backed by: file descriptor reads, socket reads, or generated data.

### Writable

- Represents a sink for chunks.
- Often backed by: file descriptor writes, socket writes, or in-memory aggregation.

### Duplex

- Readable + Writable in the same object (two directions).
- Common examples: TCP sockets (read from remote, write to remote).

### Transform

- A duplex stream where output depends on input.
- Typical uses: compression, encryption, parsing, framing, filtering.

### objectMode

- When `objectMode: true`, a “chunk” is a JS object.
- Backpressure still exists, but watermarks are measured in **number of objects**, not bytes.
- It’s easy to accidentally queue huge objects; treat objectMode streams as a memory risk (see [Memory](fundamentals/memory.md)).

---

## Backpressure in practice

### `highWaterMark`: threshold, not a hard cap

The most common misconception:

> `highWaterMark` is not a strict maximum buffer size. It’s the point where the stream begins applying backpressure signals.

For the canonical Node.js behavior, see [Stream API](https://nodejs.org/api/stream.html) and specifically [Writable `.write()`](https://nodejs.org/api/stream.html#writablewritechunk-encoding-callback) / [`writableHighWaterMark`](https://nodejs.org/api/stream.html#writablewritablehighwatermark) (Node.js docs). For the conceptual model used in the web platform, compare with the [Streams Standard](https://streams.spec.whatwg.org/) (WHATWG).

What it _does_:

- Influences when `.write()` starts returning `false` on writables.
- Influences when a readable considers its internal queue “full enough”.

What it _does not_ do:

- Guarantee that buffering will never exceed it.
- Guarantee stable memory usage if you ignore return values / events.

### Writable side: `.write()` return value is a contract

For writables:

- `true` means “keep writing”
- `false` means “stop writing; wait for `'drain'` before continuing”

Ignoring `false` is how you build a memory leak that looks like “the app is fine… until it suddenly isn’t.”

### Readable side: chunk boundaries are arbitrary

Readable streams do not promise:

- “one chunk per line”
- “one chunk per JSON object”
- “one chunk per message”

Chunk boundaries are a transport detail. Your parser must reassemble logical messages (see [Binary Data](fundamentals/binary-data.md)).

---

## Lifecycle and error model (what to listen for)

### Typical events (byte streams)

- **Readable**: `'data'`, `'end'`, `'error'`, `'close'`
- **Writable**: `'drain'`, `'finish'`, `'error'`, `'close'`

### `end` vs `finish`

- **`end`**: readable has no more data (source finished)
- **`finish`**: writable has flushed all buffered data to the underlying resource

### `close`

`close` usually indicates the underlying resource was closed (fd closed, socket closed). It can happen with or without errors depending on the situation.

### Prefer `pipeline()` for correctness

In production, prefer `pipeline()` (from `node:stream/promises` or callback form) because it:

- wires backpressure through the chain
- propagates errors properly
- ensures teardown happens across the entire pipeline

Manual `pipe()` chains are fine for learning, but production correctness improves dramatically with `pipeline()`.

---

## Performance considerations (what changes the cost model)

### Chunk size is throughput vs latency

- Larger chunks: fewer syscalls / fewer JS invocations → often higher throughput
- Smaller chunks: lower per-chunk latency but more overhead

The “right” size is workload-dependent. Benchmark with realistic data.

### Copying vs zero-copy

Copying data between buffers increases CPU and memory bandwidth usage.

- Using Buffers efficiently matters (see [Buffers](../buffers/) and [Memory](fundamentals/memory.md)).
- Many transforms inherently copy (e.g., decompression) — design around it rather than hoping it disappears.

### Strings and encodings

Text decoding (`utf-8`) has CPU cost and can introduce boundary issues if you assume chunks align to characters.

If correctness matters, parse at the byte level and decode after framing (see [Binary Data](fundamentals/binary-data.md)).

---

## Security and robustness notes

### Backpressure is part of your DoS defense

If your service accepts input and writes to a slower sink:

- not honoring backpressure means attackers can force your process to buffer arbitrarily large amounts of data.

Always build with the assumption that inputs can be adversarial.

### Bounded buffering strategies

Common production strategies:

- hard upper limits on buffered bytes/objects
- timeouts and abort signals
- circuit breakers when downstream is slow

---

## Where this connects in your repo

- **Concept landing page**: **[Streams](../streams/)** (high-level intuition, seed references)
- **Fundamentals precursor**: **[Streams (Fundamentals)](fundamentals/streams.md)**
- **Buffers**: **[Buffers](../buffers/)** (the usual chunk payload)
- **EventEmitter**: **[EventEmitter](../emitters/)** (streams are event APIs)
- **File System**: **[File System](../file-system/)** (file-backed streams)
