# EventEmitter : Explained

### The problem that EventEmitter solves

---

## Prerequisites

Before studying EventEmitter, it's recommended to understand:

- **[Asynchronous Programming](../docs/fundamentals/async-programming.md)**: Callbacks, promises, async/await, event loop, event-driven patterns

See [Fundamentals](../docs/fundamentals/) for the complete list.

## Problem Statement

### JavaScript's Single-Threaded Nature

JavaScript runs on a single thread by default, which means it can only execute one task at a time. This creates fundamental challenges:

1. **Blocking Operations**: Synchronous operations block the entire execution
2. **Inefficient Polling**: Continuously checking for events wastes CPU cycles
3. **Poor Responsiveness**: Long-running operations freeze the application
4. **Complex Coordination**: Managing multiple asynchronous operations is difficult

### The Need for Asynchronous, Event-Driven Programming

In traditional synchronous programming:

- Programs wait for operations to complete before proceeding
- CPU sits idle during I/O operations (disk, network)
- User interfaces freeze during processing
- Resources are wasted on constant polling

### Real-World Scenarios

Without event-driven architecture:

- **Web Servers**: Would block on each request, unable to handle concurrent connections
- **User Interfaces**: Would freeze during data loading or processing
- **File Operations**: Would halt execution while reading/writing files
- **Network Communication**: Would wait synchronously for responses
- **System Events**: Would require constant polling, wasting resources

### Decoupling Event Producers from Consumers

The core challenge is:

- **Producers**: Generate events at unpredictable times (user clicks, network data, file changes)
- **Consumers**: Need to respond to events without blocking other operations
- **Coordination**: Managing the relationship between producers and consumers efficiently

---

## Solution Explanation

### What is EventEmitter?

**EventEmitter** is Node.js's implementation of the Observer pattern (also known as Pub/Sub - Publish/Subscribe). It allows objects to emit named events and other objects (listeners) to listen and respond to those events.

For the canonical API reference, see [EventEmitter](https://nodejs.org/api/events.html) (Node.js docs). For background on the Observer pattern, see [Observer pattern](https://en.wikipedia.org/wiki/Observer_pattern) (Wikipedia).

### How Event-Driven Architecture Works

1. **Event Registration**: Listeners register interest in specific events using `on()` or `once()`
2. **Event Emission**: Producers emit events using `emit()` when something happens
3. **Event Handling**: Registered listeners are called synchronously in registration order
4. **Asynchronous Execution**: Events enable non-blocking, asynchronous behavior

### Event Loop Integration

EventEmitter integrates with Node.js's event loop (see [Asynchronous Programming](../docs/fundamentals/async-programming.md) for event loop details):

- **Synchronous Emission**: `emit()` calls listeners synchronously (immediately)
- **Asynchronous Patterns**: Events enable callback-based async patterns
- **Non-Blocking**: Event handlers don't block the main thread
- **Queue Management**: Event loop manages the execution order

### Pub/Sub Pattern Implementation

EventEmitter implements the Publish/Subscribe pattern (see [Asynchronous Programming](../docs/fundamentals/async-programming.md) for Pub/Sub details):

- **Publisher**: Object that emits events (`emit()`)
- **Subscriber**: Object that listens to events (`on()`, `once()`)
- **Decoupling**: Publishers don't need to know about subscribers
- **Flexibility**: Multiple subscribers can listen to the same event

---

## EventEmitter Basics

### Creating an EventEmitter Instance

```javascript
import EventEmitter from 'node:events';

// Create new instance
const emitter = new EventEmitter();

// Many Node.js classes extend EventEmitter
// Examples: Stream, Server, Process
```

### Registering Listeners

#### on(eventName, listener)

Registers a listener that persists until removed:

```javascript
emitter.on('data', (chunk) => {
  console.log('Received:', chunk);
});

// Listener remains active for all emissions
emitter.emit('data', 'chunk1'); // Called
emitter.emit('data', 'chunk2'); // Called again
```

#### once(eventName, listener)

Registers a listener that is called only once, then automatically removed:

```javascript
emitter.once('connection', () => {
  console.log('Connection established');
});

emitter.emit('connection'); // Called
emitter.emit('connection'); // NOT called (listener removed)
```

### Emitting Events

#### emit(eventName[, ...args])

Emits an event, calling all registered listeners synchronously:

```javascript
// Emit without arguments
emitter.emit('start');

// Emit with arguments
emitter.emit('data', 'chunk1', 'chunk2');
emitter.emit('user-action', userId, action, timestamp);

// Listeners receive arguments
emitter.on('data', (chunk1, chunk2) => {
  console.log(chunk1, chunk2);
});
```

### Listener Execution Order

Listeners execute **synchronously** in registration order:

```javascript
emitter.on('event', () => console.log('First'));
emitter.on('event', () => console.log('Second'));
emitter.on('event', () => console.log('Third'));

emitter.emit('event');
// Output: First, Second, Third (in order)
```

---

## Event Methods

### Listener Registration

- **`on(eventName, listener)`**: Register persistent listener
- **`once(eventName, listener)`**: Register one-time listener
- **`prependListener(eventName, listener)`**: Add listener to beginning
- **`prependOnceListener(eventName, listener)`**: Add one-time listener to beginning

### Listener Removal

- **`removeListener(eventName, listener)`**: Remove specific listener
- **`removeAllListeners([eventName])`**: Remove all listeners (or all for event)

### Listener Management

- **`listeners(eventName)`**: Get array of listeners for event
- **`listenerCount(eventName)`**: Get count of listeners for event
- **`eventNames()`**: Get array of all event names with listeners

### Configuration

- **`setMaxListeners(n)`**: Set maximum number of listeners (default: 10)
- **`getMaxListeners()`**: Get current maximum listeners limit

---

## Error Handling

### The Error Event Pattern

**CRITICAL**: If an 'error' event is emitted and no listener is registered, Node.js will **crash** the process!

```javascript
// ALWAYS register error handler
emitter.on('error', (error) => {
  console.error('Error occurred:', error.message);
  // Handle error appropriately
});

// Without handler, this crashes:
// const unsafeEmitter = new EventEmitter();
// unsafeEmitter.emit('error', new Error('Unhandled')); // CRASHES!
```

### Best Practices

1. **Always register error handlers**:

   ```javascript
   emitter.on('error', (error) => {
     // Log, notify, or handle error
   });
   ```

2. **Use try-catch in listeners**:

   ```javascript
   emitter.on('data', (chunk) => {
     try {
       processChunk(chunk);
     } catch (error) {
       emitter.emit('error', error);
     }
   });
   ```

3. **Propagate errors appropriately**:
   ```javascript
   emitter.on('error', (error) => {
     // Don't swallow errors silently
     // Log, notify monitoring, or re-throw if needed
   });
   ```

---

## Memory Management

### Preventing Memory Leaks

#### The Max Listeners Warning

By default, EventEmitter warns when more than 10 listeners are added to a single event:

```javascript
const emitter = new EventEmitter();

// Adding 11 listeners triggers warning
for (let i = 0; i < 11; i++) {
  emitter.on('event', () => {});
}
// Warning: Possible EventEmitter memory leak detected
```

#### Setting Max Listeners

```javascript
// Increase limit if legitimate
emitter.setMaxListeners(20);

// Or disable limit (use with caution!)
emitter.setMaxListeners(0);
```

### Listener Cleanup

**Always remove listeners** when done to prevent memory leaks:

```javascript
const emitter = new EventEmitter();

const listener = () => console.log('Event');

emitter.on('event', listener);

// ... use emitter ...

// Clean up when done
emitter.removeListener('event', listener);
// Or remove all
emitter.removeAllListeners('event');
```

### Common Memory Leak Scenarios

1. **Forgotten Listeners**: Adding listeners without removing them
2. **Circular References**: Listeners holding references to emitter
3. **Closures**: Listeners capturing large variables
4. **Long-Lived Emitters**: Emitters that never get cleaned up

---

## Custom EventEmitter Classes

### Extending EventEmitter

Create custom classes that emit events:

```javascript
import EventEmitter from 'node:events';

class UserService extends EventEmitter {
  constructor() {
    super();
    this.users = new Map();
  }

  addUser(id, name) {
    this.users.set(id, name);
    // Emit custom event
    this.emit('user-added', { id, name, timestamp: Date.now() });
  }

  removeUser(id) {
    const name = this.users.get(id);
    if (name) {
      this.users.delete(id);
      this.emit('user-removed', { id, name });
      return true;
    }
    return false;
  }
}

// Use the service
const userService = new UserService();

userService.on('user-added', (data) => {
  console.log(`User added: ${data.name}`);
});

userService.addUser(1, 'Alice');
```

### Real-World Example: File Watcher

```javascript
import EventEmitter from 'node:events';
import { watch } from 'node:fs';

class FileWatcher extends EventEmitter {
  constructor(filePath) {
    super();
    this.filePath = filePath;
    this.watcher = null;
  }

  start() {
    this.watcher = watch(this.filePath, (eventType, filename) => {
      if (eventType === 'change') {
        this.emit('change', filename);
      } else if (eventType === 'rename') {
        this.emit('rename', filename);
      }
    });

    this.emit('watching', this.filePath);
  }

  stop() {
    if (this.watcher) {
      this.watcher.close();
      this.emit('stopped');
    }
  }
}
```

---

## Real-World Applications

### HTTP Servers

Node.js HTTP servers extend EventEmitter:

```javascript
import { createServer } from 'node:http';

const server = createServer();

// Server extends EventEmitter
server.on('request', (req, res) => {
  // Handle HTTP request
});

server.on('error', (error) => {
  // Handle server errors
});

server.listen(3000);
```

### Streams

Streams extend EventEmitter for data flow:

```javascript
import { createReadStream } from 'node:fs';

const stream = createReadStream('file.txt');

stream.on('data', (chunk) => {
  // Process data chunk
});

stream.on('end', () => {
  // Stream finished
});

stream.on('error', (error) => {
  // Handle stream error
});
```

### Process Events

Process object emits system events:

```javascript
process.on('exit', (code) => {
  console.log(`Process exiting with code ${code}`);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully');
  process.exit(0);
});
```

### Custom APIs

Build event-driven APIs:

```javascript
class API extends EventEmitter {
  async fetchData(url) {
    try {
      const data = await fetch(url);
      this.emit('data', data);
      return data;
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }
}
```

### File Watchers

Monitor file system changes:

```javascript
import { watch } from 'node:fs';

const watcher = watch('file.txt', (eventType, filename) => {
  console.log(`File ${filename} ${eventType}`);
});

watcher.on('error', (error) => {
  console.error('Watcher error:', error);
});
```

---

## Performance Considerations

### Listener Management

1. **Limit Listener Count**: Keep listener count reasonable
2. **Remove Unused Listeners**: Clean up when done
3. **Use once() When Appropriate**: Prevents accumulation of listeners
4. **Monitor Memory**: Watch for memory leaks in production

### Event Frequency

1. **Throttle High-Frequency Events**: Limit emission rate
2. **Debounce Rapid Events**: Wait for pause before handling
3. **Batch Processing**: Group multiple events together
4. **Async Handlers**: Use async listeners for I/O operations

### Optimization Tips

```javascript
// Use once() for one-time events
emitter.once('init', initialize);

// Remove listeners when done
const listener = () => {};
emitter.on('event', listener);
// ... later ...
emitter.removeListener('event', listener);

// Batch events
let batch = [];
emitter.on('data', (chunk) => {
  batch.push(chunk);
  if (batch.length >= 100) {
    processBatch(batch);
    batch = [];
  }
});
```

---

## Common Pitfalls

### 1. Unhandled Error Events

**Problem**: Emitting 'error' without handler crashes process.

```javascript
// BAD: No error handler
const emitter = new EventEmitter();
emitter.emit('error', new Error('Oops')); // CRASHES!

// GOOD: Always register error handler
emitter.on('error', (error) => {
  console.error('Error:', error);
});
```

### 2. Memory Leaks from Forgotten Listeners

**Problem**: Adding listeners without removing them.

```javascript
// BAD: Listener never removed
function setup() {
  emitter.on('event', () => {
    // This listener persists forever
  });
}

// GOOD: Remove when done
function setup() {
  const listener = () => {};
  emitter.on('event', listener);

  // Clean up
  return () => emitter.removeListener('event', listener);
}
```

### 3. Listener Order Assumptions

**Problem**: Assuming listener execution order.

```javascript
// BAD: Assuming order
emitter.on('event', () => console.log('First'));
emitter.on('event', () => console.log('Second'));
// Order is guaranteed, but don't rely on it for logic

// GOOD: Use separate events or data flow
emitter.on('step1', () => {
  // Process step 1
  emitter.emit('step2');
});
```

### 4. Synchronous vs Asynchronous Confusion

**Problem**: Expecting async behavior from synchronous emission.

```javascript
// BAD: Expecting async
emitter.emit('event');
console.log('After emit'); // Runs immediately, listeners already executed

// GOOD: Understand synchronous execution
emitter.emit('event'); // Listeners execute synchronously
console.log('After emit'); // Runs after all listeners
```

### 5. Max Listeners Warning Ignored

**Problem**: Ignoring memory leak warnings.

```javascript
// BAD: Ignoring warning
emitter.setMaxListeners(0); // Disables protection

// GOOD: Investigate and fix
if (emitter.listenerCount('event') > 10) {
  // Review why so many listeners needed
  // Consider using single listener that delegates
}
```

---

## Best Practices

### Production Patterns

1. **Always Register Error Handlers**:

   ```javascript
   emitter.on('error', (error) => {
     logger.error('EventEmitter error', error);
     // Handle appropriately
   });
   ```

2. **Clean Up Listeners**:

   ```javascript
   class Service extends EventEmitter {
     cleanup() {
       this.removeAllListeners();
     }
   }
   ```

3. **Use Descriptive Event Names**:

   ```javascript
   // GOOD: Clear event names
   emitter.emit('user-logged-in', userId);
   emitter.emit('file-uploaded', fileInfo);

   // BAD: Vague names
   emitter.emit('event', data);
   emitter.emit('update', info);
   ```

4. **Document Event Contracts**:

   ```javascript
   /**
    * Emits 'data' event with chunk buffer
    * Emits 'end' event when stream completes
    * Emits 'error' event on failure
    */
   class DataStream extends EventEmitter {
     // ...
   }
   ```

5. **Handle Async Operations in Listeners**:
   ```javascript
   emitter.on('data', async (chunk) => {
     try {
       await processChunk(chunk);
     } catch (error) {
       emitter.emit('error', error);
     }
   });
   ```

### Security Considerations

1. **Validate Event Data**: Don't trust event arguments blindly
2. **Rate Limiting**: Prevent event flooding attacks
3. **Access Control**: Control who can emit events
4. **Input Sanitization**: Sanitize data in event handlers

---

## Code Examples

See [app.js](app.js) for comprehensive examples demonstrating:

- Basic EventEmitter usage
- Multiple listeners and event parameters
- once() vs on() differences
- Listener management (add, remove, count)
- Error handling patterns
- Custom EventEmitter classes
- Memory leak prevention

See [production-example.js](production-example.js) for enterprise-level patterns:

- Production-ready EventEmitter implementations
- Error handling and recovery
- Performance optimization
- Memory management
- Real-world use cases

---

## Cross-References

- **Streams**: Streams extend EventEmitter for data flow events
- **Process**: Process object emits system-level events
- **HTTP**: HTTP servers extend EventEmitter for request/response events
- **File System**: File watchers use EventEmitter for change events (see [File Systems](../docs/fundamentals/file-systems.md) for file operations)
- **Network**: Network sockets emit connection and data events

---

## Prerequisites (recap)

See [Prerequisites](#prerequisites) above.

## Learning Path

### Prerequisites

- Understanding of JavaScript functions and callbacks (see [Asynchronous Programming](../docs/fundamentals/async-programming.md))
- Basic knowledge of asynchronous programming (see [Asynchronous Programming](../docs/fundamentals/async-programming.md))
- Familiarity with object-oriented programming

### What This Enables

- Building event-driven applications
- Implementing pub/sub patterns
- Creating reactive systems
- Working with Node.js streams and servers
- Building custom APIs and services

### Recommended Next Steps

1. Study [Streams](../streams/) (when available) - streams extend EventEmitter
2. Explore [Process](../process/) events - system-level event handling
3. Learn [HTTP](../http/) servers - see EventEmitter in web servers
4. Practice with real-world scenarios - build event-driven applications

---

## Summary

EventEmitter is Node.js's implementation of the Observer pattern, enabling:

- **Asynchronous Programming**: Non-blocking, event-driven code
- **Decoupling**: Producers and consumers don't need direct references
- **Flexibility**: Multiple listeners can respond to same events
- **Integration**: Core to Node.js streams, servers, and many APIs

Understanding EventEmitter is essential for:

- Building responsive applications
- Working with Node.js core APIs
- Implementing custom event-driven systems
- Mastering asynchronous JavaScript patterns

Master EventEmitter, and you'll understand the foundation of Node.js's event-driven architecture.
