/*
 * JavaScript (JS) runs on a single thread by default, which means it can only execute one task at a time.
 * To keep the user experience smooth and responsive, JS uses an event-driven model.
 * Instead of continuously checking if a user is interacting with the page (which would be inefficient), JS sets up event listeners that wait for specific user actions, like clicks or key presses.
 * When a user interacts with the page, the corresponding event listener detects this and triggers a callback function to handle the event.
 * This way, JS efficiently delegates tasks based on user interactions without wasting system resources on constant polling.
 * This event-driven approach allows JS to handle asynchronous operations effectively, making the single-threaded environment feel responsive and dynamic to users.
 * In Node.js, which runs JavaScript outside the browser, there is no DOM or user clicks, but a similar event-driven pattern is implemented using the EventEmitter class.
 * EventEmitter allows objects to emit named events and other objects to listen and respond to those events. Listeners are registered using the on method, and events are triggered using the emit method.
 * This mechanism enables asynchronous, non-blocking behavior in server-side JavaScript.
 * Under the hood, JavaScript's single-threaded nature is managed by the event loop, which continuously checks the call stack and the task queue.
 * When the call stack is empty, the event loop dequeues the next task from the queue and pushes it onto the stack for execution.
 * This process allows JavaScript to handle asynchronous callbacks, timers, and I/O operations without blocking the main thread.
 * This model ensures that JavaScript remains efficient and responsive despite its single-threaded execution, by delegating long-running or waiting tasks to the environment (browser or Node.js runtime) and resuming execution when those tasks complete.
 *
 * See [Asynchronous Programming](../docs/fundamentals/async-programming.md) for details on callbacks, promises, event loop, and async patterns.
 *
 */

import EventEmitter from 'node:events';

// ============================================
// Basic EventEmitter Usage
// ============================================

const eventEmitter = new EventEmitter();

eventEmitter.on('foo', () => {
  console.log('Foo event occurred');
});

eventEmitter.emit('foo');

// ============================================
// Multiple Listeners for Same Event
// ============================================

console.log('\n=== Multiple Listeners ===');
const multiEmitter = new EventEmitter();

// Register multiple listeners for the same event
multiEmitter.on('data', (chunk) => {
  console.log('Listener 1 received:', chunk);
});

multiEmitter.on('data', (chunk) => {
  console.log('Listener 2 received:', chunk);
});

multiEmitter.on('data', (chunk) => {
  console.log('Listener 3 received:', chunk);
});

// All listeners are called when event is emitted
multiEmitter.emit('data', 'Hello World');

// ============================================
// once() vs on() - One-Time Listeners
// ============================================

console.log('\n=== once() vs on() ===');
const onceEmitter = new EventEmitter();

// on() - listener persists until removed
let onCount = 0;
onceEmitter.on('persistent', () => {
  onCount++;
  console.log(`on() listener called ${onCount} time(s)`);
});

// once() - listener is automatically removed after first call
let onceCount = 0;
onceEmitter.once('one-time', () => {
  onceCount++;
  console.log(`once() listener called ${onceCount} time(s)`);
});

// Emit multiple times
onceEmitter.emit('persistent'); // Called
onceEmitter.emit('one-time'); // Called
onceEmitter.emit('persistent'); // Called again
onceEmitter.emit('one-time'); // NOT called (listener was removed)

// ============================================
// Event Parameters (Passing Data)
// ============================================

console.log('\n=== Event Parameters ===');
const paramEmitter = new EventEmitter();

paramEmitter.on('user-action', (userId, action, timestamp) => {
  console.log(`User ${userId} performed ${action} at ${timestamp}`);
});

paramEmitter.emit('user-action', 12345, 'login', new Date().toISOString());
paramEmitter.emit('user-action', 67890, 'logout', new Date().toISOString());

// ============================================
// Removing Listeners
// ============================================

console.log('\n=== Removing Listeners ===');
const removeEmitter = new EventEmitter();

const listener1 = (data) => console.log('Listener 1:', data);
const listener2 = (data) => console.log('Listener 2:', data);

removeEmitter.on('remove-test', listener1);
removeEmitter.on('remove-test', listener2);

removeEmitter.emit('remove-test', 'Before removal');

// Remove specific listener
removeEmitter.removeListener('remove-test', listener1);
console.log('Removed listener1');

removeEmitter.emit('remove-test', 'After removal'); // Only listener2 fires

// Remove all listeners for an event
removeEmitter.removeAllListeners('remove-test');
console.log('Removed all listeners');

removeEmitter.emit('remove-test', 'After removeAll'); // No listeners fire

// ============================================
// Listener Management Methods
// ============================================

console.log('\n=== Listener Management ===');
const manageEmitter = new EventEmitter();

manageEmitter.on('event1', () => {});
manageEmitter.on('event1', () => {});
manageEmitter.on('event2', () => {});
manageEmitter.once('event3', () => {});

// Get all event names
console.log('Event names:', manageEmitter.eventNames()); // ['event1', 'event2', 'event3']

// Get listener count for specific event
console.log('Listeners for event1:', manageEmitter.listenerCount('event1')); // 2

// Get all listeners for an event
const listeners = manageEmitter.listeners('event1');
console.log('Number of listeners:', listeners.length); // 2

// ============================================
// Error Handling Pattern
// ============================================

console.log('\n=== Error Handling ===');
const errorEmitter = new EventEmitter();

// IMPORTANT: If 'error' event is emitted and no listener is registered, Node.js will crash
// Always register an error handler!
errorEmitter.on('error', (error) => {
  console.error('Error caught:', error.message);
});

// Emit error event
errorEmitter.emit('error', new Error('Something went wrong'));

// Without error handler, this would crash:
// const unsafeEmitter = new EventEmitter();
// unsafeEmitter.emit('error', new Error('Unhandled error')); // CRASHES!

// ============================================
// Prepend Listeners (Priority)
// ============================================

console.log('\n=== Prepend Listeners ===');
const prependEmitter = new EventEmitter();

// Normal listeners (added to end)
prependEmitter.on('priority', () => console.log('Normal listener'));

// Prepend listeners (added to beginning, execute first)
prependEmitter.prependListener('priority', () => console.log('Prepend listener 1'));
prependEmitter.prependListener('priority', () => console.log('Prepend listener 2'));

// Prepend once listener
prependEmitter.prependOnceListener('priority', () => console.log('Prepend once listener'));

console.log('Emit priority event:');
prependEmitter.emit('priority');
// Output order: Prepend once listener, Prepend listener 2, Prepend listener 1, Normal listener

// ============================================
// Memory Leak Prevention: setMaxListeners()
// ============================================

console.log('\n=== Memory Leak Prevention ===');
const leakEmitter = new EventEmitter();

// Default max listeners is 10
// Adding more than 10 listeners triggers a warning (potential memory leak)
for (let i = 0; i < 11; i++) {
  leakEmitter.on('leak-test', () => {});
}

// Increase max listeners if you legitimately need more
leakEmitter.setMaxListeners(20);
console.log('Max listeners set to 20');

// Or set to 0 for unlimited (use with caution!)
// leakEmitter.setMaxListeners(0);

// ============================================
// Custom EventEmitter Class
// ============================================

console.log('\n=== Custom EventEmitter Class ===');

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
      this.emit('user-removed', { id, name, timestamp: Date.now() });
      return true;
    }
    return false;
  }

  getUserCount() {
    return this.users.size;
  }
}

const userService = new UserService();

// Listen to custom events
userService.on('user-added', (data) => {
  console.log(`User added: ${data.name} (ID: ${data.id})`);
});

userService.on('user-removed', (data) => {
  console.log(`User removed: ${data.name} (ID: ${data.id})`);
});

// Use the service
userService.addUser(1, 'Alice');
userService.addUser(2, 'Bob');
console.log('Total users:', userService.getUserCount());
userService.removeUser(1);
console.log('Total users after removal:', userService.getUserCount());

// ============================================
// Event Ordering and Synchronous Execution
// ============================================

console.log('\n=== Event Execution Order ===');
const orderEmitter = new EventEmitter();

console.log('Registering listeners...');
orderEmitter.on('ordered', () => console.log('Listener 1 (registered first)'));
orderEmitter.on('ordered', () => console.log('Listener 2 (registered second)'));
orderEmitter.on('ordered', () => console.log('Listener 3 (registered third)'));

console.log('Emitting event:');
orderEmitter.emit('ordered');
// Listeners execute in registration order, synchronously
// Output: Listener 1, Listener 2, Listener 3
