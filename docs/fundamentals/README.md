# Fundamentals: Foundational Concepts

This section covers the foundational concepts you need to understand before diving into specific Node.js topics. These fundamentals provide the building blocks for understanding how Node.js works under the hood.

## Why Fundamentals Matter

Node.js concepts build upon fundamental computing principles. Understanding these basics helps you:

- **Comprehend Deeply**: Understand not just "how" but "why" things work
- **Debug Effectively**: Recognize underlying issues when problems occur
- **Make Better Decisions**: Choose the right approach based on fundamental understanding
- **Learn Faster**: New concepts become easier when fundamentals are solid

## Available Fundamentals

### [Binary Data](binary-data.md)

**Prerequisites**: Basic math understanding

**Covers**:

- Bits and bytes explained
- Binary number system
- Hexadecimal representation
- Number system conversions
- Byte representation (0-255)
- Text vs binary data
- Endianness (Big Endian vs Little Endian)
- Character encoding details (UTF-8, ASCII, etc.)

**Needed For**:

- Understanding [Buffers](../buffers/)
- Working with binary file formats
- Network protocols
- Cryptographic operations

**Used By**:

- **[Buffers](../buffers/)**: Binary data handling, hex encoding, number systems
- **[File System](../file-system/)**: Binary file operations, encoding conversions

### [Memory](memory.md)

**Prerequisites**: Basic understanding of computers

**Covers**:

- What is memory?
- RAM vs storage
- Memory allocation
- Memory addresses
- Stack vs heap
- Garbage collection basics
- Memory pools
- Memory safety

**Needed For**:

- Understanding [Buffers](../buffers/)
- Performance optimization
- Memory management
- Debugging memory issues

**Used By**:

- **[Buffers](../buffers/)**: Memory allocation, heap storage, memory pools, garbage collection

### [Asynchronous Programming](async-programming.md)

**Prerequisites**: Basic JavaScript knowledge

**Covers**:

- Synchronous vs asynchronous
- Callbacks explained
- Promise basics
- Async/await patterns
- Event-driven programming
- Observer pattern
- Pub/Sub pattern
- Event loop (deep dive with phases, microtasks, macrotasks)

**Needed For**:

- Understanding [EventEmitter](../emitters/)
- Working with Node.js APIs
- Building responsive applications
- Understanding the event loop

**Used By**:

- **[EventEmitter](../emitters/)**: Callbacks, async patterns, event loop integration, Pub/Sub
- **[File System](../file-system/)**: Async file operations, callbacks, promises, async/await

### [File Systems](file-systems.md)

**Prerequisites**: Basic computer usage

**Covers**:

- What is a file system?
- File descriptors explained
- I/O operations (input/output)
- Blocking vs non-blocking I/O
- File permissions
- Path concepts
- Directory structure

**Needed For**:

- Understanding [File System](../file-system/) operations
- Working with files and directories
- Understanding I/O performance
- File-based applications

**Used By**:

- **[File System](../file-system/)**: File operations, file descriptors, I/O patterns, FileHandle

### [Streams](streams.md)

**Prerequisites**: Asynchronous Programming + File Systems (recommended)

**Covers**:

- Why streams exist (flow control for mismatched speeds)
- Chunks, buffering, and backpressure
- `highWaterMark` as a backpressure threshold
- Stream types: Readable, Writable, Duplex, Transform (conceptual)

**Needed For**:

- Understanding [Streams](../streams/)
- Building efficient file/network processing
- Avoiding “buffer everything” memory failures
- Building pipelines and transforms

**Used By**:

- **[Streams](../streams/)**: Backpressure, chunked processing, composable I/O

## Learning Path

### Recommended Order

1. **Start Here**: [Binary Data](binary-data.md) - Foundation for understanding data representation
2. **Then**: [Memory](memory.md) - Understanding how data is stored and managed
3. **Next**: [Asynchronous Programming](async-programming.md) - Core to Node.js architecture
4. **Finally**: [File Systems](file-systems.md) - Understanding I/O operations
5. **Then**: [Streams](streams.md) - Flow control, backpressure, and chunk-based processing

### Prerequisites by Topic

**Before studying Buffers**:

- ✅ [Binary Data](binary-data.md)
- ✅ [Memory](memory.md)

**Before studying EventEmitter**:

- ✅ [Asynchronous Programming](async-programming.md)

**Before studying File System**:

- ✅ [File Systems](file-systems.md)
- ✅ [Asynchronous Programming](async-programming.md) (for async file operations)

**Before studying Streams**:

- ✅ [Streams](streams.md)
- ✅ [Asynchronous Programming](async-programming.md) (event-driven flow control)
- ✅ [File Systems](file-systems.md) (streams are commonly I/O-backed)

## How to Use This Section

1. **Read Before Concepts**: Review relevant fundamentals before studying a concept folder
2. **Reference When Needed**: Come back to fundamentals when concepts are unclear
3. **Build Understanding**: Each fundamental builds on previous knowledge
4. **Practice**: Try examples and exercises in each document

## Cross-References

### Concept Folders That Use These Fundamentals

- **[Buffers](../buffers/)**: Uses Binary Data + Memory
- **[EventEmitter](../emitters/)**: Uses Asynchronous Programming
- **[File System](../file-system/)**: Uses File Systems + Asynchronous Programming
- **[Streams](../streams/)**: Uses Streams + Asynchronous Programming + File Systems (and often Buffers)

### Related Documentation

- [Getting Started](../getting-started.md) - Setup and prerequisites
- [Configuration Files](../configuration-files.md) - Project configuration

## Summary

These fundamentals provide the foundation for understanding Node.js deeply. Take time to understand each concept thoroughly - it will make learning Node.js concepts much easier and more meaningful.

---

**Next Steps**: Start with [Binary Data](binary-data.md) if you're planning to study Buffers, or [Asynchronous Programming](async-programming.md) if you're starting with EventEmitter.
