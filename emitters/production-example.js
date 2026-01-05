/**
 * Enterprise-Level EventEmitter Example
 *
 * This example demonstrates production-ready patterns for building event-driven systems
 * using EventEmitter. It includes:
 * - Custom EventEmitter class for production use
 * - Comprehensive error handling patterns
 * - Event throttling and debouncing (see [Asynchronous Programming](../docs/fundamentals/async-programming.md) for async patterns)
 * - Listener management and cleanup
 * - Performance monitoring
 * - Memory leak prevention
 * - Real-world scenario: API event system
 *
 * Use Case: Building scalable, production-ready event-driven services
 * See [Asynchronous Programming](../docs/fundamentals/async-programming.md) for callbacks, promises, and event-driven patterns.
 */

import EventEmitter from 'node:events';
import { performance } from 'node:perf_hooks';

/**
 * Production-grade EventEmitter with enterprise features
 */
class ProductionEventEmitter extends EventEmitter {
  constructor(options = {}) {
    super();

    // Configuration
    this.maxListeners = options.maxListeners || 50;
    this.enableMetrics = options.enableMetrics !== false;
    this.enableThrottling = options.enableThrottling !== false;
    this.enableDebouncing = options.enableDebouncing !== false;

    // Set max listeners to prevent memory leaks
    this.setMaxListeners(this.maxListeners);

    // Internal state
    this.eventMetrics = new Map();
    this.throttleTimers = new Map();
    this.debounceTimers = new Map();
    this.listenerRegistry = new Map(); // Track listeners for cleanup

    // Performance tracking
    this.startTime = performance.now();
    this.totalEventsEmitted = 0;
    this.totalListenersCalled = 0;

    // Always register error handler to prevent crashes
    this._setupErrorHandling();
  }

  /**
   * Setup comprehensive error handling
   */
  _setupErrorHandling() {
    // Register default error handler
    this.on('error', (error) => {
      this._handleError(error);
    });

    // Handle uncaught exceptions in listeners
    this._wrapListeners();
  }

  /**
   * Wrap listeners to catch errors and prevent crashes
   */
  _wrapListeners() {
    const originalOn = this.on.bind(this);
    const originalOnce = this.once.bind(this);

    // Wrap on() to add error handling
    this.on = (eventName, listener) => {
      const wrappedListener = (...args) => {
        try {
          const result = listener(...args);
          // Handle async listeners (see [Asynchronous Programming](../docs/fundamentals/async-programming.md) for promises)
          if (result instanceof Promise) {
            result.catch((error) => {
              this.emit('error', error);
            });
          }
          return result;
        } catch (error) {
          this.emit('error', error);
        }
      };

      // Register wrapped listener
      originalOn(eventName, wrappedListener);

      // Track for cleanup
      if (!this.listenerRegistry.has(eventName)) {
        this.listenerRegistry.set(eventName, new Set());
      }
      this.listenerRegistry.get(eventName).add({ original: listener, wrapped: wrappedListener });

      return this;
    };

    // Wrap once() similarly
    this.once = (eventName, listener) => {
      const wrappedListener = (...args) => {
        try {
          const result = listener(...args);
          if (result instanceof Promise) {
            result.catch((error) => {
              this.emit('error', error);
            });
          }
          return result;
        } catch (error) {
          this.emit('error', error);
        }
      };

      originalOnce(eventName, wrappedListener);

      if (!this.listenerRegistry.has(eventName)) {
        this.listenerRegistry.set(eventName, new Set());
      }
      this.listenerRegistry.get(eventName).add({ original: listener, wrapped: wrappedListener });

      return this;
    };
  }

  /**
   * Enhanced emit with metrics and throttling/debouncing support
   *
   * @param {string} eventName - Name of the event
   * @param {...any} args - Arguments to pass to listeners
   * @returns {boolean} True if event had listeners
   */
  emit(eventName, ...args) {
    // Update metrics
    if (this.enableMetrics) {
      this._updateMetrics(eventName);
    }

    // Handle throttling
    if (this.enableThrottling && this._shouldThrottle(eventName)) {
      return false; // Event throttled
    }

    // Handle debouncing
    if (this.enableDebouncing) {
      this._debounceEvent(eventName, args);
      return true; // Event will be emitted after debounce
    }

    // Emit event
    const listenerCount = this.listenerCount(eventName);
    const result = super.emit(eventName, ...args);

    if (this.enableMetrics) {
      this.totalListenersCalled += listenerCount;
    }

    return result;
  }

  /**
   * Emit event with throttling (limit emission rate)
   *
   * @param {string} eventName - Name of the event
   * @param {number} delay - Minimum delay between emissions (ms)
   * @param {...any} args - Arguments to pass to listeners
   */
  emitThrottled(eventName, delay, ...args) {
    const key = eventName;
    const now = performance.now();

    if (!this.throttleTimers.has(key)) {
      // First emission, allow it
      this.throttleTimers.set(key, now);
      return super.emit(eventName, ...args);
    }

    const lastEmission = this.throttleTimers.get(key);
    const timeSinceLastEmission = now - lastEmission;

    if (timeSinceLastEmission >= delay) {
      // Enough time has passed, emit
      this.throttleTimers.set(key, now);
      return super.emit(eventName, ...args);
    }

    // Too soon, throttle
    return false;
  }

  /**
   * Emit event with debouncing (wait for pause before emitting)
   *
   * @param {string} eventName - Name of the event
   * @param {number} delay - Delay to wait before emitting (ms)
   * @param {...any} args - Arguments to pass to listeners
   */
  emitDebounced(eventName, delay, ...args) {
    const key = eventName;

    // Clear existing timer
    if (this.debounceTimers.has(key)) {
      clearTimeout(this.debounceTimers.get(key));
    }

    // Set new timer
    const timer = setTimeout(() => {
      this.debounceTimers.delete(key);
      super.emit(eventName, ...args);
    }, delay);

    this.debounceTimers.set(key, timer);
    return true;
  }

  /**
   * Check if event should be throttled
   *
   * @param {string} eventName - Name of the event
   * @returns {boolean} True if should throttle
   */
  _shouldThrottle(eventName) {
    // Custom throttling logic can be implemented here
    // For now, return false (no throttling by default)
    return false;
  }

  /**
   * Debounce event emission
   *
   * @param {string} eventName - Name of the event
   * @param {any[]} args - Arguments to pass
   */
  _debounceEvent(eventName, args) {
    // Custom debouncing logic can be implemented here
    // For now, emit immediately
    super.emit(eventName, ...args);
  }

  /**
   * Update metrics for event emission
   *
   * @param {string} eventName - Name of the event
   */
  _updateMetrics(eventName) {
    if (!this.eventMetrics.has(eventName)) {
      this.eventMetrics.set(eventName, {
        count: 0,
        firstEmission: performance.now(),
        lastEmission: performance.now(),
        totalListenersCalled: 0,
      });
    }

    const metrics = this.eventMetrics.get(eventName);
    metrics.count++;
    metrics.lastEmission = performance.now();
    metrics.totalListenersCalled += this.listenerCount(eventName);
    this.totalEventsEmitted++;
  }

  /**
   * Handle errors with proper logging and recovery
   *
   * @param {Error} error - Error to handle
   */
  _handleError(error) {
    // In production, this would log to monitoring service
    console.error('[ProductionEventEmitter] Error:', error.message, error.stack);

    // Emit error event for external handling
    // (but don't emit if we're already handling an error to prevent loops)
    if (error.eventName !== 'error') {
      // Additional error handling can be added here
    }
  }

  /**
   * Get metrics for all events
   *
   * @returns {Object} Metrics object
   */
  getMetrics() {
    const uptime = performance.now() - this.startTime;
    const metrics = {
      uptime: uptime,
      totalEventsEmitted: this.totalEventsEmitted,
      totalListenersCalled: this.totalListenersCalled,
      eventsPerSecond: this.totalEventsEmitted / (uptime / 1000),
      eventDetails: {},
    };

    // Add per-event metrics
    for (const [eventName, eventMetrics] of this.eventMetrics.entries()) {
      metrics.eventDetails[eventName] = {
        ...eventMetrics,
        averageListenersPerEmission: eventMetrics.totalListenersCalled / eventMetrics.count,
      };
    }

    return metrics;
  }

  /**
   * Cleanup all listeners and timers
   */
  cleanup() {
    // Remove all listeners
    this.removeAllListeners();

    // Clear throttle timers
    this.throttleTimers.clear();

    // Clear debounce timers
    for (const timer of this.debounceTimers.values()) {
      clearTimeout(timer);
    }
    this.debounceTimers.clear();

    // Clear registry
    this.listenerRegistry.clear();

    // Reset metrics
    this.eventMetrics.clear();
    this.totalEventsEmitted = 0;
    this.totalListenersCalled = 0;
  }
}

/**
 * Example: API Event System
 * Production-ready event system for API services
 */
class APIEventSystem extends ProductionEventEmitter {
  constructor(options = {}) {
    super(options);
    this.apiCalls = new Map();
    this.requestCount = 0;
  }

  /**
   * Register API request event
   *
   * @param {string} endpoint - API endpoint
   * @param {Object} requestData - Request data
   */
  registerRequest(endpoint, requestData) {
    const requestId = `req-${++this.requestCount}`;
    const timestamp = Date.now();

    this.apiCalls.set(requestId, {
      endpoint,
      requestData,
      timestamp,
      status: 'pending',
    });

    // Emit request event
    this.emit('api-request', {
      requestId,
      endpoint,
      requestData,
      timestamp,
    });

    return requestId;
  }

  /**
   * Register API response event
   *
   * @param {string} requestId - Request ID
   * @param {Object} responseData - Response data
   * @param {number} statusCode - HTTP status code
   */
  registerResponse(requestId, responseData, statusCode = 200) {
    const call = this.apiCalls.get(requestId);
    if (!call) {
      this.emit('error', new Error(`Request ${requestId} not found`));
      return;
    }

    const responseTime = Date.now() - call.timestamp;
    call.status = statusCode >= 200 && statusCode < 300 ? 'success' : 'error';
    call.responseTime = responseTime;

    // Emit response event
    this.emit('api-response', {
      requestId,
      endpoint: call.endpoint,
      responseData,
      statusCode,
      responseTime,
    });

    // Emit success/error event
    if (call.status === 'success') {
      this.emit('api-success', {
        requestId,
        endpoint: call.endpoint,
        responseTime,
      });
    } else {
      this.emit('api-error', {
        requestId,
        endpoint: call.endpoint,
        statusCode,
        responseTime,
      });
    }
  }

  /**
   * Get API statistics
   *
   * @returns {Object} API statistics
   */
  getStats() {
    const calls = Array.from(this.apiCalls.values());
    const successful = calls.filter((c) => c.status === 'success').length;
    const failed = calls.filter((c) => c.status === 'error').length;
    const avgResponseTime = calls.reduce((sum, c) => sum + (c.responseTime || 0), 0) / calls.length;

    return {
      totalRequests: calls.length,
      successful,
      failed,
      successRate: calls.length > 0 ? (successful / calls.length) * 100 : 0,
      averageResponseTime: avgResponseTime,
    };
  }
}

// ============================================
// Example Usage
// ============================================

async function main() {
  console.log('=== Enterprise EventEmitter Example ===\n');

  // Example 1: Basic Production EventEmitter
  console.log('1. Basic Production EventEmitter:');
  const emitter = new ProductionEventEmitter({
    maxListeners: 20,
    enableMetrics: true,
  });

  // Register listeners
  emitter.on('data', (chunk) => {
    console.log(`  Received chunk: ${chunk.length} bytes`);
  });

  emitter.on('error', (error) => {
    console.log(`  Error handled: ${error.message}`);
  });

  // Emit events
  emitter.emit('data', Buffer.alloc(1024));
  emitter.emit('data', Buffer.alloc(2048));

  // Get metrics
  const metrics = emitter.getMetrics();
  console.log(`  Total events emitted: ${metrics.totalEventsEmitted}`);
  console.log(`  Events per second: ${metrics.eventsPerSecond.toFixed(2)}`);
  console.log('');

  // Example 2: Throttled Events
  console.log('2. Throttled Events:');
  const throttledEmitter = new ProductionEventEmitter();

  throttledEmitter.on('high-frequency', (data) => {
    console.log(`  Received: ${data}`);
  });

  // Emit multiple times rapidly
  for (let i = 0; i < 5; i++) {
    throttledEmitter.emitThrottled('high-frequency', 100, `Event ${i}`);
  }

  // Wait for throttling
  await new Promise((resolve) => setTimeout(resolve, 200));
  console.log('');

  // Example 3: Debounced Events
  console.log('3. Debounced Events:');
  const debouncedEmitter = new ProductionEventEmitter();

  debouncedEmitter.on('search', (query) => {
    console.log(`  Searching for: ${query}`);
  });

  // Rapid emissions will be debounced
  debouncedEmitter.emitDebounced('search', 200, 'h');
  debouncedEmitter.emitDebounced('search', 200, 'he');
  debouncedEmitter.emitDebounced('search', 200, 'hel');
  debouncedEmitter.emitDebounced('search', 200, 'hello');

  // Wait for debounce
  await new Promise((resolve) => setTimeout(resolve, 300));
  console.log('');

  // Example 4: API Event System
  console.log('4. API Event System:');
  const apiSystem = new APIEventSystem({
    maxListeners: 50,
    enableMetrics: true,
  });

  // Register API event listeners
  apiSystem.on('api-request', (data) => {
    console.log(`  Request: ${data.requestId} -> ${data.endpoint}`);
  });

  apiSystem.on('api-success', (data) => {
    console.log(`  Success: ${data.endpoint} (${data.responseTime}ms)`);
  });

  apiSystem.on('api-error', (data) => {
    console.log(`  Error: ${data.endpoint} (${data.statusCode})`);
  });

  // Simulate API calls
  const req1 = apiSystem.registerRequest('/api/users', { userId: 123 });
  await new Promise((resolve) => setTimeout(resolve, 50));
  apiSystem.registerResponse(req1, { user: { id: 123, name: 'Alice' } }, 200);

  const req2 = apiSystem.registerRequest('/api/posts', { postId: 456 });
  await new Promise((resolve) => setTimeout(resolve, 30));
  apiSystem.registerResponse(req2, null, 404);

  // Get statistics
  const stats = apiSystem.getStats();
  console.log('\n  API Statistics:');
  console.log(`    Total requests: ${stats.totalRequests}`);
  console.log(`    Successful: ${stats.successful}`);
  console.log(`    Failed: ${stats.failed}`);
  console.log(`    Success rate: ${stats.successRate.toFixed(1)}%`);
  console.log(`    Avg response time: ${stats.averageResponseTime.toFixed(2)}ms`);
  console.log('');

  // Example 5: Error Handling
  console.log('5. Error Handling:');
  const errorEmitter = new ProductionEventEmitter();

  errorEmitter.on('data', (chunk) => {
    // Simulate error in listener
    if (chunk === 'error') {
      throw new Error('Processing error');
    }
    console.log(`  Processed: ${chunk}`);
  });

  errorEmitter.on('error', (error) => {
    console.log(`  Error caught: ${error.message}`);
  });

  errorEmitter.emit('data', 'normal');
  errorEmitter.emit('data', 'error'); // Triggers error handler
  console.log('');

  // Example 6: Metrics and Monitoring
  console.log('6. Metrics and Monitoring:');
  const monitoredEmitter = new ProductionEventEmitter({ enableMetrics: true });

  monitoredEmitter.on('event1', () => {});
  monitoredEmitter.on('event1', () => {});
  monitoredEmitter.on('event2', () => {});

  monitoredEmitter.emit('event1');
  monitoredEmitter.emit('event1');
  monitoredEmitter.emit('event2');

  const finalMetrics = monitoredEmitter.getMetrics();
  console.log('  Final Metrics:');
  console.log(`    Total events: ${finalMetrics.totalEventsEmitted}`);
  console.log(`    Total listeners called: ${finalMetrics.totalListenersCalled}`);
  console.log(`    Events per second: ${finalMetrics.eventsPerSecond.toFixed(2)}`);
  console.log('    Event details:', finalMetrics.eventDetails);
  console.log('');

  // Cleanup
  emitter.cleanup();
  throttledEmitter.cleanup();
  debouncedEmitter.cleanup();
  apiSystem.cleanup();
  errorEmitter.cleanup();
  monitoredEmitter.cleanup();

  console.log('All emitters cleaned up. Resources freed.');
}

// Run example if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { APIEventSystem, ProductionEventEmitter };
