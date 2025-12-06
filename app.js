/*
 * JavaScript (JS) runs on a single thread by default, which means it can only execute one task at a time. To keep the user experience smooth and responsive, JS uses an event-driven model. Instead of continuously checking if a user is interacting with the page (which would be inefficient), JS sets up event listeners that wait for specific user actions, like clicks or key presses.
 * When a user interacts with the page, the corresponding event listener detects this and triggers a callback function to handle the event. This way, JS efficiently delegates tasks based on user interactions without wasting system resources on constant polling.
 * This event-driven approach allows JS to handle asynchronous operations effectively, making the single-threaded environment feel responsive and dynamic to users.
 * In Node.js, which runs JavaScript outside the browser, there is no DOM or user clicks, but a similar event-driven pattern is implemented using the EventEmitter class. EventEmitter allows objects to emit named events and other objects to listen and respond to those events. Listeners are registered using the on method, and events are triggered using the emit method. This mechanism enables asynchronous, non-blocking behavior in server-side JavaScript.
 * Under the hood, JavaScript's single-threaded nature is managed by the event loop, which continuously checks the call stack and the task queue. When the call stack is empty, the event loop dequeues the next task from the queue and pushes it onto the stack for execution. This process allows JavaScript to handle asynchronous callbacks, timers, and I/O operations without blocking the main thread.
 * This model ensures that JavaScript remains efficient and responsive despite its single-threaded execution, by delegating long-running or waiting tasks to the environment (browser or Node.js runtime) and resuming execution when those tasks complete.
 *
 */
import EventEmitter from 'node:events';

const eventEmitter = new EventEmitter();

eventEmitter.on('foo', () => {
  console.log('Foo event occurred');
});

eventEmitter.emit('foo');
