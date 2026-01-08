# Docs Index

This folder contains the **canonical learning path** and deeper write-ups that support the concept folders.

If you ever feel “I’m not sure what to read next”, start here.

---

## Versions (required)

This repo assumes:

- **Node.js**: 24.12.0 (see `.nvmrc`)
- **npm**: 11.7.0 (see `package.json` `engines` + `.npmrc` `engine-strict=true`)

Why it matters: Node core APIs (especially streams and fs/promises) can change subtly across versions.

---

## Recommended reading order

| Stage | Read                                          | Why                                                         |
| ----: | --------------------------------------------- | ----------------------------------------------------------- |
|     1 | [Getting Started](getting-started.md)         | Setup + how to navigate this repo                           |
|     2 | [Configuration Files](configuration-files.md) | Pin Node/npm versions and enforce them                      |
|     3 | [Fundamentals](fundamentals/)                 | CPU-level mental models: bytes, memory, async, I/O          |
|     4 | Concept folders (repo root)                   | Apply fundamentals to Node core concepts                    |
|     5 | Deep dives (this folder)                      | Production-level nuance and “what breaks in the real world” |

---

## Fundamentals (precursors)

Fundamentals are the **prerequisites** you should master before concepts:

- [Fundamentals Overview](fundamentals/)
- [Binary Data](fundamentals/binary-data.md)
- [Memory](fundamentals/memory.md)
- [Asynchronous Programming](fundamentals/async-programming.md)
- [File Systems](fundamentals/file-systems.md)
- [Streams](fundamentals/streams.md)

Each fundamentals doc includes a **`## Used In`** section linking back to concept folders that rely on it.

## When you want the external “canonical” definitions, prefer:\n+\n+- Node.js docs for Node APIs (e.g., [Stream API](https://nodejs.org/api/stream.html), [File system](https://nodejs.org/api/fs.html))\n+- MDN for JavaScript language/runtime concepts (e.g., [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), [Event loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop))\n+- Wikipedia for broad CS terms (e.g., [Endianness](https://en.wikipedia.org/wiki/Endianness))\n+- Specs/RFCs for protocols/standards (e.g., [Streams Standard](https://streams.spec.whatwg.org/))\n+- High-quality engine/runtime blogs for internals (e.g., [V8 blog](https://v8.dev/blog))\n+

## Deep dives (docs/)

These are longer, “zoomed in” explanations that are not tied to a single concept folder’s examples.

- [Streams (Deep Dive)](streams.md): lifecycle, backpressure, performance, production failure modes

As this repo grows, additional deep dives (HTTP, processes, workers, crypto, etc.) can live alongside this.

---

## Concept folders (repo root)

Concept folders contain the **hands-on** part: executable examples plus concept-level explanations.

- [Buffers](../buffers/)
- [EventEmitter](../emitters/)
- [File System](../file-system/)
- [Streams](../streams/)

---

## Link conventions (keep navigation stable)

- From `docs/*` → fundamentals use `fundamentals/...`
- From concept folders → fundamentals use `../docs/fundamentals/...`
- Prefer linking to **the canonical doc** instead of duplicating explanation
