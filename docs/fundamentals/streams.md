# Streams (Fundamentals)

### The problem that streams solve

---

## Prerequisites

Before studying Streams fundamentals, it helps to understand:

- **[Asynchronous Programming](async-programming.md)**: Event-driven design, scheduling, and why I/O is naturally async in Node.js
- **[File Systems](file-systems.md)**: File descriptors, kernel buffers, and I/O boundaries
- **[Memory](memory.md)**: Buffering as memory usage, GC pressure, and failure modes
- **[Binary Data](binary-data.md)**: Chunks as bytes, encodings, and why “chunk boundary ≠ message boundary”

---

## Problem Statement

Streams exist because real systems have uneven speeds:

- **Fast producers**: disk reads, network bursts, your own application generating output
- **Slow consumers**: CPU-heavy parsing, encryption, compression, slow disks, slow clients

If you connect these systems without flow control, you typically get one of these outcomes:

1. **Buffer everything**: memory grows until the process slows down or crashes (see [Memory](memory.md)).
2. **Block waiting for I/O**: throughput drops and concurrency suffers (see [Asynchronous Programming](async-programming.md)).
3. **Drop data**: the consumer can’t keep up, causing loss (in protocols, logging, telemetry, etc.).

You want a third option:

> Move data incrementally and safely, so the producer naturally slows down when the consumer is saturated.

---

## Solution Explanation

### Streams as flow control

At a fundamentals level, a stream is:

- a **producer** that yields chunks (Readable),
- a **consumer** that accepts chunks (Writable),
- and a **feedback signal** (backpressure) that coordinates speed differences.

The core is not “reading” or “writing” — it’s **coordinating**.

### Chunk

A **chunk** is a unit of transfer.

- In byte streams, chunks are usually **Buffer** objects (see [Binary Data](binary-data.md)).
- In **objectMode** streams, chunks are **JavaScript objects**.

**Important**: chunk boundaries are not semantic boundaries. A chunk is “whatever arrived / whatever we decided to buffer”, not “a complete message”.

### Buffering

Streams buffer because the world is not perfectly synchronized.

Buffering is useful, but it’s also risk:

- buffered bytes occupy memory (see [Memory](memory.md))
- excessive buffering increases latency (“queueing delay”)
- unbounded buffering becomes a denial-of-service vector

### Backpressure (the key concept)

**Backpressure** is the mechanism that propagates “slow down” upstream when buffering crosses a threshold.

In Node.js, that threshold is commonly configured via **`highWaterMark`**.

At a high level:

- if the consumer is slow → buffer grows
- when buffer grows beyond `highWaterMark` → “apply backpressure”
- producer pauses or slows down until the consumer drains the buffer

This is how streams stay stable under load: they trade a little buffering for predictable memory usage.

---

## Core Vocabulary (minimal)

- **Readable**: produces chunks
- **Writable**: consumes chunks
- **Duplex**: readable + writable (two directions)
- **Transform**: duplex where output is derived from input
- **Flowing mode**: readable emits `'data'` events (push model)
- **Paused mode**: readable is pulled via `.read()` / piping
- **`highWaterMark`**: a buffering threshold used to trigger backpressure signals
- **Backpressure**: upstream slowing mechanism to prevent buffer explosion

---

## Historical Context (why this abstraction exists)

Unix popularized the idea of chaining programs using **pipes**:

```
producer | transformer | consumer
```

Pipes work because the OS provides buffering plus a natural blocking/flow-control boundary.

Node streams bring a similar idea to JavaScript, but in a non-blocking/event-driven runtime (see [Asynchronous Programming](async-programming.md)):

- you can connect sources and sinks
- you can transform data incrementally
- you can apply backpressure without blocking the whole process

---

## Used In

This fundamental concept is used in:

- **[Streams](../../streams/)**: The core concept folder (practical intuition, backpressure, watermarks)

---

## Related Concepts

- **[Asynchronous Programming](async-programming.md)**: Event loop and non-blocking I/O patterns
- **[File Systems](file-systems.md)**: File descriptors, I/O, and kernel buffering
- **[Binary Data](binary-data.md)**: Bytes, encodings, chunk boundary issues
- **[Memory](memory.md)**: Buffering, GC pressure, memory safety
- **[Buffers](../../buffers/)**: The typical chunk payload for byte streams
- **[EventEmitter](../../emitters/)**: Streams are event-based APIs
