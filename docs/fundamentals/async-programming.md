# Asynchronous Programming: Callbacks, Promises, and Events

### Why understanding asynchronous programming matters

---

## Problem Statement

### The Blocking Problem

Traditional **synchronous** programming executes code line by line, waiting for each operation to complete before moving to the next. This creates problems:

- **Blocking Operations**: Long-running tasks freeze the entire application
- **Poor Resource Utilization**: CPU sits idle waiting for I/O operations
- **Unresponsive Applications**: User interfaces freeze during processing
- **Inefficient**: Can't handle multiple operations concurrently

### Real-World Scenarios

Without asynchronous programming:

- **Web Servers**: Can only handle one request at a time
- **File Operations**: Application freezes while reading/writing files
- **Network Requests**: Must wait for responses before continuing
- **User Interfaces**: Freeze during data loading
- **System Events**: Require constant polling (wasteful)

### The Need for Asynchrony

Modern applications need to:

- Handle multiple operations simultaneously
- Remain responsive during long-running tasks
- Efficiently manage I/O operations (disk, network)
- Respond to events as they occur
- Maximize resource utilization

---

## Solution: Asynchronous Programming

### What is Asynchronous Programming?

**Asynchronous programming** allows code to start an operation and continue executing other code while waiting for that operation to complete. When the operation finishes, a callback or promise handles the result.

### Synchronous vs Asynchronous

**Synchronous (Blocking)**:

```javascript
// Each line waits for previous to complete
const data1 = readFile('file1.txt'); // Waits here
const data2 = readFile('file2.txt'); // Waits here
const data3 = readFile('file3.txt'); // Waits here
// Total time: time1 + time2 + time3
```

**Asynchronous (Non-Blocking)**:

```javascript
// Operations start immediately, don't wait
readFile('file1.txt', callback1); // Starts, continues
readFile('file2.txt', callback2); // Starts, continues
readFile('file3.txt', callback3); // Starts, continues
// Total time: max(time1, time2, time3)
```

---

## Callbacks

### What is a Callback?

A **callback** is a function passed as an argument to another function, to be executed later when an operation completes.

### Callback Pattern

```javascript
// Function that accepts a callback
function doSomething(callback) {
  // Do some work...
  const result = 'done';
  // Call the callback when done
  callback(result);
}

// Usage: Pass function as callback
doSomething((result) => {
  console.log('Result:', result);
});
```

### Error-First Callbacks

Node.js uses the **error-first callback pattern**: callbacks receive error as first parameter.

```javascript
function readFile(path, callback) {
  // Try to read file
  if (error) {
    callback(error, null); // Error first
  } else {
    callback(null, data); // Error is null if success
  }
}

// Usage
readFile('file.txt', (err, data) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  console.log('Data:', data);
});
```

### Why Error-First?

**Consistency**: All Node.js callbacks follow this pattern
**Convention**: Easy to recognize and use
**Error Handling**: Forces explicit error checking

### Callback Hell

**Problem**: Nested callbacks become hard to read

```javascript
// Callback hell - hard to read
readFile('file1.txt', (err1, data1) => {
  if (err1) return handleError(err1);
  readFile('file2.txt', (err2, data2) => {
    if (err2) return handleError(err2);
    readFile('file3.txt', (err3, data3) => {
      if (err3) return handleError(err3);
      // Process all data
    });
  });
});
```

**Solution**: Use Promises or async/await (see below)

---

## Promises

### What is a Promise?

A **Promise** represents a value that will be available in the future (or an error if it fails). It's an object that represents the eventual completion (or failure) of an asynchronous operation.

### Promise States

A Promise has three states:

1. **Pending**: Operation in progress
2. **Fulfilled**: Operation completed successfully
3. **Rejected**: Operation failed

```
Pending → Fulfilled (with value)
       ↘ Rejected (with error)
```

### Creating Promises

```javascript
const promise = new Promise((resolve, reject) => {
  // Do async work
  if (success) {
    resolve(value); // Promise fulfilled
  } else {
    reject(error); // Promise rejected
  }
});
```

### Using Promises

**With `.then()` and `.catch()`**:

```javascript
promise
  .then((value) => {
    // Handle success
    console.log('Success:', value);
  })
  .catch((error) => {
    // Handle error
    console.error('Error:', error);
  });
```

**With `async/await`**:

```javascript
async function example() {
  try {
    const value = await promise;
    console.log('Success:', value);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### Promise Advantages

- **Composable**: Easy to chain operations
- **Error Handling**: Single `.catch()` for all errors
- **Readable**: Linear code flow
- **No Callback Hell**: Flatten nested callbacks

### Promise Chaining

```javascript
readFile('file1.txt')
  .then((data1) => {
    return readFile('file2.txt');
  })
  .then((data2) => {
    return readFile('file3.txt');
  })
  .then((data3) => {
    // All files read
  })
  .catch((error) => {
    // Handle any error
  });
```

### Promise Composition

**`Promise.all()`**: Wait for all promises

```javascript
Promise.all([readFile('file1.txt'), readFile('file2.txt'), readFile('file3.txt')]).then(
  ([data1, data2, data3]) => {
    // All files read concurrently
  },
);
```

**`Promise.race()`**: First to complete wins

```javascript
Promise.race([fetchFromServer1(), fetchFromServer2()]).then((data) => {
  // First response wins
});
```

---

## Async/Await

### What is Async/Await?

**`async/await`** is syntactic sugar over Promises that makes asynchronous code look like synchronous code.

### Async Functions

An `async` function always returns a Promise:

```javascript
async function getData() {
  return 'data';
  // Equivalent to: return Promise.resolve('data');
}
```

### Await Keyword

`await` pauses execution until Promise resolves:

```javascript
async function example() {
  const data = await readFile('file.txt');
  // Code here runs after file is read
  console.log(data);
}
```

### Error Handling with Async/Await

```javascript
async function example() {
  try {
    const data1 = await readFile('file1.txt');
    const data2 = await readFile('file2.txt');
    // Process data
  } catch (error) {
    // Handle any error from any await
    console.error('Error:', error);
  }
}
```

### Async/Await Advantages

- **Readable**: Looks like synchronous code
- **Error Handling**: Standard try/catch
- **Debugging**: Easier to debug
- **Modern**: Recommended for new code

---

## Event-Driven Programming

### What is Event-Driven Programming?

**Event-driven programming** is a paradigm where program flow is determined by events (user actions, sensor outputs, messages, etc.) rather than sequential execution.

### Event-Driven Model

```
Program → Register Listeners → Wait for Events → Handle Events → Repeat
```

### Key Concepts

1. **Event**: Something that happens (click, file change, data arrival)
2. **Listener**: Function that responds to events
3. **Emitter**: Object that generates events
4. **Event Loop**: Mechanism that processes events

### Event-Driven Example

```javascript
// Register listener for 'click' event
button.on('click', () => {
  console.log('Button clicked!');
});

// When click happens, listener is called
// Program doesn't block waiting for click
```

---

## Observer Pattern

### What is the Observer Pattern?

The **Observer pattern** defines a one-to-many dependency between objects. When one object changes state, all dependent objects are notified.

### Components

- **Subject**: Object being observed (emits events)
- **Observer**: Object that watches subject (listens to events)
- **Notification**: Message sent when state changes

### Observer Pattern Example

```javascript
// Subject (EventEmitter)
class Subject {
  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  notify(data) {
    this.observers.forEach((observer) => observer(data));
  }
}

// Observer (Listener)
const observer = (data) => {
  console.log('Received:', data);
};

// Usage
const subject = new Subject();
subject.subscribe(observer);
subject.notify('Hello'); // Observer receives notification
```

---

## Pub/Sub Pattern

### What is Pub/Sub?

**Publish/Subscribe (Pub/Sub)** is a messaging pattern where:

- **Publishers** send messages without knowing recipients
- **Subscribers** listen for messages without knowing senders
- **Decoupling**: Publishers and subscribers don't know about each other

### Pub/Sub Components

- **Publisher**: Emits events/messages
- **Subscriber**: Listens for events/messages
- **Event Channel**: Medium for communication
- **Event Name**: Identifier for event type

### Pub/Sub Example

```javascript
// Publisher
eventEmitter.emit('user-login', { userId: 123 });

// Subscriber 1
eventEmitter.on('user-login', (data) => {
  console.log('User logged in:', data.userId);
});

// Subscriber 2
eventEmitter.on('user-login', (data) => {
  updateUserStatus(data.userId);
});

// Publisher doesn't know about subscribers
// Subscribers don't know about publisher
```

---

## Event Loop

### What is the Event Loop?

The **event loop** is the mechanism that allows JavaScript to handle asynchronous operations despite being single-threaded.

### How Event Loop Works

```
┌─────────────────────────┐
│   Call Stack            │  ← Currently executing code
└─────────────────────────┘
           ↓
┌─────────────────────────┐
│   Web APIs / Node APIs  │  ← Async operations (timers, I/O)
└─────────────────────────┘
           ↓
┌─────────────────────────┐
│   Callback Queue        │  ← Completed async operations
└─────────────────────────┘
           ↓
┌─────────────────────────┐
│   Event Loop            │  ← Moves callbacks to stack
└─────────────────────────┘
```

### Event Loop Process

1. **Execute**: Run code in call stack
2. **Check**: Is call stack empty?
3. **Dequeue**: Move callback from queue to stack
4. **Execute**: Run callback
5. **Repeat**: Go back to step 2

### Event Loop Example

```javascript
console.log('1');

setTimeout(() => {
  console.log('2');
}, 0);

Promise.resolve().then(() => {
  console.log('3');
});

console.log('4');

// Output: 1, 4, 3, 2
// Why? Event loop processes microtasks (Promises) before macrotasks (setTimeout)
```

### Event Loop Deep Dive

#### Call Stack

The **call stack** is where JavaScript executes code. It's a LIFO (Last In, First Out) structure.

**How it works**:

- Functions are pushed onto the stack when called
- Functions are popped when they return
- Only one function executes at a time (single-threaded)

**Example**:

```javascript
function a() {
  b();
}

function b() {
  c();
}

function c() {
  console.log('Hello');
}

a();

// Call stack:
// [a] → [a, b] → [a, b, c] → [a, b] → [a] → []
```

#### Task Queue (Macrotask Queue)

The **task queue** (also called macrotask queue) holds callbacks from:

- `setTimeout()` / `setInterval()`
- I/O operations
- UI rendering (browser)
- Network requests

**Processing**:

- Processed after call stack is empty
- One task at a time
- Other tasks wait

#### Microtask Queue

The **microtask queue** holds callbacks from:

- `Promise.then()` / `Promise.catch()`
- `queueMicrotask()`
- `MutationObserver` (browser)

**Processing**:

- Processed after each macrotask
- All microtasks are processed before next macrotask
- Higher priority than macrotasks

#### Event Loop Execution Order

1. **Execute** code in call stack
2. **Check** if call stack is empty
3. **Process** all microtasks (until queue is empty)
4. **Process** one macrotask
5. **Repeat** from step 3

**Visual Flow**:

```
Call Stack Empty?
  ↓ Yes
Process ALL Microtasks
  ↓
Process ONE Macrotask
  ↓
Repeat
```

#### Detailed Example

```javascript
console.log('1'); // Synchronous - executes immediately

setTimeout(() => {
  console.log('2'); // Macrotask
}, 0);

Promise.resolve().then(() => {
  console.log('3'); // Microtask
});

Promise.resolve().then(() => {
  console.log('4'); // Microtask
});

setTimeout(() => {
  console.log('5'); // Macrotask
}, 0);

console.log('6'); // Synchronous - executes immediately

// Output: 1, 6, 3, 4, 2, 5
// Explanation:
// 1. Synchronous: 1, 6
// 2. Call stack empty → Process microtasks: 3, 4
// 3. Process macrotask: 2
// 4. Process macrotask: 5
```

#### Why Microtasks Before Macrotasks?

**Design Decision**: Ensures promise callbacks execute as soon as possible, maintaining predictable async behavior.

**Benefits**:

- Promises resolve immediately when possible
- Consistent behavior across environments
- Better performance for promise chains

#### Blocking the Event Loop

**Problem**: Synchronous operations block the event loop

```javascript
// BAD: Blocks event loop
function heavyComputation() {
  let sum = 0;
  for (let i = 0; i < 1000000000; i++) {
    sum += i;
  }
  return sum;
}

heavyComputation(); // Blocks everything!
```

**Solution**: Break into chunks or use Web Workers

```javascript
// GOOD: Non-blocking
async function heavyComputation() {
  let sum = 0;
  for (let i = 0; i < 1000000000; i++) {
    sum += i;
    // Yield to event loop every 1000 iterations
    if (i % 1000 === 0) {
      await new Promise((resolve) => setImmediate(resolve));
    }
  }
  return sum;
}
```

#### Event Loop in Node.js vs Browser

**Similarities**:

- Same basic mechanism
- Call stack + queues
- Microtasks before macrotasks

**Differences**:

- **Node.js**: Additional phases (timers, I/O, check, close)
- **Browser**: Rendering phase, requestAnimationFrame
- **Node.js**: `process.nextTick()` (higher priority than microtasks)
- **Browser**: `requestIdleCallback()` for low-priority work

#### Node.js Event Loop Phases

Node.js has multiple phases:

1. **Timers**: Execute `setTimeout()` and `setInterval()` callbacks
2. **Pending Callbacks**: Execute I/O callbacks deferred to next loop
3. **Idle, Prepare**: Internal use
4. **Poll**: Fetch new I/O events, execute I/O callbacks
5. **Check**: Execute `setImmediate()` callbacks
6. **Close Callbacks**: Execute close callbacks (e.g., `socket.on('close')`)

**Between each phase**: Process microtasks (promises, `process.nextTick()`)

#### Best Practices

1. **Avoid Blocking Operations**: Keep synchronous code fast
2. **Use Promises**: Prefer promises over callbacks for better error handling
3. **Understand Priority**: Microtasks execute before macrotasks
4. **Monitor Performance**: Use `performance.now()` to measure execution time
5. **Break Up Work**: Use `setImmediate()` or `process.nextTick()` to yield

---

## How This Relates to EventEmitter

---

## How This Relates to EventEmitter

### EventEmitter Uses Callbacks

EventEmitter uses callbacks (listeners) to handle events:

```javascript
emitter.on('event', (data) => {
  // Callback function
  console.log(data);
});
```

### EventEmitter is Pub/Sub

EventEmitter implements Pub/Sub pattern:

- **Publish**: `emit()` sends events
- **Subscribe**: `on()` registers listeners
- **Decoupling**: Emitters don't know about listeners

### EventEmitter and Event Loop

EventEmitter integrates with event loop:

- `emit()` calls listeners synchronously
- Async operations in listeners use event loop
- Non-blocking event handling

---

## Common Patterns

### Pattern 1: Callback Pattern

```javascript
function asyncOperation(callback) {
  // Do async work
  setTimeout(() => {
    callback(null, 'result');
  }, 1000);
}

asyncOperation((err, result) => {
  if (err) return console.error(err);
  console.log(result);
});
```

### Pattern 2: Promise Pattern

```javascript
function asyncOperation() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('result');
    }, 1000);
  });
}

asyncOperation()
  .then((result) => console.log(result))
  .catch((err) => console.error(err));
```

### Pattern 3: Async/Await Pattern

```javascript
async function example() {
  try {
    const result = await asyncOperation();
    console.log(result);
  } catch (err) {
    console.error(err);
  }
}
```

### Pattern 4: Event-Driven Pattern

```javascript
const emitter = new EventEmitter();

emitter.on('data', (chunk) => {
  console.log('Received:', chunk);
});

emitter.emit('data', 'chunk1');
emitter.emit('data', 'chunk2');
```

---

## Common Pitfalls

### 1. Callback Hell

**Problem**: Deeply nested callbacks

**Solution**: Use Promises or async/await

### 2. Forgetting Error Handling

**Problem**: Not handling errors in callbacks

```javascript
// BAD: No error handling
readFile('file.txt', (err, data) => {
  console.log(data); // Crashes if error
});
```

**Solution**: Always check for errors

```javascript
// GOOD: Error handling
readFile('file.txt', (err, data) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  console.log(data);
});
```

### 3. Mixing Patterns

**Problem**: Mixing callbacks and Promises inconsistently

**Solution**: Choose one pattern and stick with it

### 4. Blocking the Event Loop

**Problem**: Synchronous operations block event loop

```javascript
// BAD: Blocks event loop
for (let i = 0; i < 1000000000; i++) {
  // Heavy computation
}
```

**Solution**: Use async operations or break into chunks

---

## Best Practices

### 1. Prefer Async/Await for New Code

```javascript
// Recommended
async function example() {
  const data = await readFile('file.txt');
  return data;
}
```

### 2. Always Handle Errors

```javascript
try {
  const data = await readFile('file.txt');
} catch (err) {
  // Handle error
}
```

### 3. Use Promise.all() for Concurrent Operations

```javascript
// Read files concurrently
const [data1, data2] = await Promise.all([readFile('file1.txt'), readFile('file2.txt')]);
```

### 4. Avoid Callback Hell

```javascript
// Use async/await instead of nested callbacks
const data1 = await readFile('file1.txt');
const data2 = await readFile('file2.txt');
```

---

## Summary

Asynchronous programming is fundamental to Node.js:

- **Callbacks**: Traditional async pattern (error-first)
- **Promises**: Modern async pattern (composable)
- **Async/Await**: Syntactic sugar over Promises (readable)
- **Event-Driven**: Program responds to events
- **Observer Pattern**: One-to-many dependency
- **Pub/Sub**: Decoupled messaging
- **Event Loop**: Enables async in single-threaded JavaScript

Master these patterns, and EventEmitter becomes intuitive!

---

## Next Steps

- Explore [EventEmitter](../emitters/) to see async patterns in action
- Practice with callbacks, Promises, and async/await
- Understand the event loop deeply
- Build event-driven applications

---

## Used In

This fundamental concept is used in:

- **[EventEmitter](../emitters/)**: Callbacks, async patterns, event loop integration, Pub/Sub pattern
- **[File System](../file-system/)**: Async file operations, callbacks, promises, async/await patterns
- **[Streams](../streams/)**: Event-driven I/O, backpressure, `drain`/`data`/`end` lifecycle, pipeline composition

## Related Concepts

- **[File Systems](file-systems.md)**: Async file operations
- **[EventEmitter](../emitters/)**: Practical application of async patterns
