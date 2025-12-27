/**
 * Enterprise-Level Buffer Processing Example
 *
 * This example demonstrates production-ready patterns for processing large data streams
 * using buffers. It includes:
 * - High-performance buffer processing pipeline
 * - Error handling and recovery
 * - Memory-efficient streaming
 * - Performance monitoring
 * - Resource cleanup and memory management
 * - Input validation and security
 * - Real-world scenario: Processing binary data chunks
 *
 * Use Case: Processing large binary files or network data streams efficiently
 */

import { Buffer } from 'node:buffer';
import { performance } from 'node:perf_hooks';

/**
 * Production-grade buffer processor with enterprise-level features
 */
class ProductionBufferProcessor {
  constructor(options = {}) {
    // Configuration with safe defaults
    this.chunkSize = options.chunkSize || 64 * 1024; // 64 KB default
    this.maxBufferSize = options.maxBufferSize || 100 * 1024 * 1024; // 100 MB max
    this.enableMetrics = options.enableMetrics !== false; // Default true

    // Internal state
    this.processedBytes = 0;
    this.processedChunks = 0;
    this.errors = [];
    this.startTime = null;

    // Performance metrics
    this.metrics = {
      totalProcessingTime: 0,
      averageChunkTime: 0,
      peakMemoryUsage: 0,
      errorCount: 0,
    };

    // Validate configuration
    this._validateConfiguration();
  }

  /**
   * Validate configuration to prevent security issues and errors
   */
  _validateConfiguration() {
    if (this.chunkSize <= 0 || this.chunkSize > this.maxBufferSize) {
      throw new Error(
        `Invalid chunkSize: ${this.chunkSize}. Must be between 1 and ${this.maxBufferSize}`,
      );
    }

    if (this.maxBufferSize > Buffer.constants.MAX_LENGTH) {
      throw new Error(`maxBufferSize exceeds maximum: ${Buffer.constants.MAX_LENGTH}`);
    }
  }

  /**
   * Process a single buffer chunk with error handling
   *
   * @param {Buffer} chunk - Buffer chunk to process
   * @param {number} chunkIndex - Index of the chunk in the stream
   * @returns {Object} Processing result with metadata
   */
  processChunk(chunk, chunkIndex = 0) {
    // Input validation
    if (!Buffer.isBuffer(chunk)) {
      const error = new Error(`Invalid input: expected Buffer, got ${typeof chunk}`);
      this._handleError(error, chunkIndex);
      return { success: false, error: error.message };
    }

    // Security: Check buffer size to prevent DoS attacks
    if (chunk.length > this.maxBufferSize) {
      const error = new Error(`Chunk size ${chunk.length} exceeds maximum ${this.maxBufferSize}`);
      this._handleError(error, chunkIndex);
      return { success: false, error: error.message };
    }

    const chunkStartTime = performance.now();

    try {
      // Process the chunk (example: calculate checksum, transform data, etc.)
      const result = this._processBufferData(chunk);

      // Update metrics
      const chunkProcessingTime = performance.now() - chunkStartTime;
      this._updateMetrics(chunk.length, chunkProcessingTime);

      this.processedBytes += chunk.length;
      this.processedChunks++;

      return {
        success: true,
        chunkIndex,
        bytesProcessed: chunk.length,
        result,
        processingTime: chunkProcessingTime,
      };
    } catch (error) {
      this._handleError(error, chunkIndex);
      return {
        success: false,
        chunkIndex,
        error: error.message,
      };
    }
  }

  /**
   * Process buffer data (example implementation)
   * In real scenarios, this would do actual processing (parsing, transformation, etc.)
   *
   * @param {Buffer} chunk - Buffer to process
   * @returns {Object} Processing result
   */
  _processBufferData(chunk) {
    // Example: Calculate simple checksum
    let checksum = 0;
    for (let i = 0; i < chunk.length; i++) {
      checksum = (checksum + chunk[i]) % 256;
    }

    // Example: Count non-zero bytes
    let nonZeroCount = 0;
    for (let i = 0; i < chunk.length; i++) {
      if (chunk[i] !== 0) {
        nonZeroCount++;
      }
    }

    // Example: Extract metadata
    const metadata = {
      length: chunk.length,
      firstByte: chunk[0],
      lastByte: chunk[chunk.length - 1],
      checksum,
      nonZeroBytes: nonZeroCount,
    };

    return metadata;
  }

  /**
   * Process multiple chunks efficiently with memory management
   *
   * @param {Buffer[]} chunks - Array of buffer chunks
   * @returns {Object} Batch processing results
   */
  processBatch(chunks) {
    if (!Array.isArray(chunks)) {
      throw new Error('chunks must be an array');
    }

    this.startTime = performance.now();
    const results = [];

    // Process each chunk
    for (let i = 0; i < chunks.length; i++) {
      const result = this.processChunk(chunks[i], i);
      results.push(result);

      // Memory management: Clear processed chunk reference to help GC
      // (chunks array still holds reference, but we're done with it)
    }

    // Calculate final metrics
    this._finalizeMetrics();

    return {
      totalChunks: chunks.length,
      successfulChunks: results.filter((r) => r.success).length,
      failedChunks: results.filter((r) => !r.success).length,
      totalBytesProcessed: this.processedBytes,
      metrics: this.getMetrics(),
      results,
    };
  }

  /**
   * Stream processing: Process chunks as they arrive (simulated)
   * In real scenarios, this would integrate with Node.js streams
   *
   * @param {AsyncIterable<Buffer>} stream - Async iterable of buffers
   * @returns {Promise<Object>} Processing results
   */
  async processStream(stream) {
    this.startTime = performance.now();
    const results = [];
    let chunkIndex = 0;

    try {
      for await (const chunk of stream) {
        const result = this.processChunk(chunk, chunkIndex++);
        results.push(result);

        // Memory management: Allow GC between chunks
        if (chunkIndex % 100 === 0) {
          // Force garbage collection hint (if available)
          if (global.gc) {
            global.gc();
          }
        }
      }

      this._finalizeMetrics();
      return {
        totalChunks: chunkIndex,
        successfulChunks: results.filter((r) => r.success).length,
        failedChunks: results.filter((r) => !r.success).length,
        totalBytesProcessed: this.processedBytes,
        metrics: this.getMetrics(),
        results,
      };
    } catch (error) {
      this._handleError(error, chunkIndex);
      throw error;
    }
  }

  /**
   * Handle errors with proper logging and recovery
   *
   * @param {Error} error - Error to handle
   * @param {number} chunkIndex - Index of chunk that caused error
   */
  _handleError(error, chunkIndex) {
    this.errors.push({
      error: error.message,
      chunkIndex,
      timestamp: Date.now(),
    });

    this.metrics.errorCount++;

    // In production, this would log to monitoring service
    console.error(`[BufferProcessor] Error processing chunk ${chunkIndex}:`, error.message);

    // Recovery: Continue processing (don't crash)
    // In some scenarios, you might want to throw or stop processing
  }

  /**
   * Update performance metrics
   *
   * @param {number} bytesProcessed - Bytes processed in this chunk
   * @param {number} processingTime - Time taken to process chunk
   */
  _updateMetrics(bytesProcessed, processingTime) {
    if (!this.enableMetrics) return;

    // Update average chunk processing time
    const totalTime = this.metrics.averageChunkTime * this.processedChunks + processingTime;
    this.metrics.averageChunkTime = totalTime / (this.processedChunks + 1);

    // Track peak memory usage
    const currentMemory = process.memoryUsage().heapUsed;
    if (currentMemory > this.metrics.peakMemoryUsage) {
      this.metrics.peakMemoryUsage = currentMemory;
    }
  }

  /**
   * Finalize metrics after processing completes
   */
  _finalizeMetrics() {
    if (!this.startTime) return;

    this.metrics.totalProcessingTime = performance.now() - this.startTime;
  }

  /**
   * Get current metrics
   *
   * @returns {Object} Current metrics snapshot
   */
  getMetrics() {
    return {
      ...this.metrics,
      processedBytes: this.processedBytes,
      processedChunks: this.processedChunks,
      errorCount: this.errors.length,
      throughput: this.processedBytes / (this.metrics.totalProcessingTime / 1000), // bytes/sec
    };
  }

  /**
   * Reset processor state (useful for reuse)
   */
  reset() {
    this.processedBytes = 0;
    this.processedChunks = 0;
    this.errors = [];
    this.startTime = null;
    this.metrics = {
      totalProcessingTime: 0,
      averageChunkTime: 0,
      peakMemoryUsage: 0,
      errorCount: 0,
    };
  }

  /**
   * Cleanup resources
   */
  cleanup() {
    // Clear references to help GC
    this.errors = [];
    this.reset();
  }
}

// ============================================
// Example Usage
// ============================================

async function main() {
  console.log('=== Enterprise Buffer Processor Example ===\n');

  // Create processor with configuration
  const processor = new ProductionBufferProcessor({
    chunkSize: 64 * 1024, // 64 KB
    maxBufferSize: 10 * 1024 * 1024, // 10 MB max
    enableMetrics: true,
  });

  // Example 1: Process single chunk
  console.log('1. Processing single chunk:');
  const singleChunk = Buffer.alloc(1024, 0x42);
  const singleResult = processor.processChunk(singleChunk, 0);
  console.log('Result:', singleResult);
  console.log('');

  // Example 2: Process batch of chunks
  console.log('2. Processing batch of chunks:');
  const chunks = [
    Buffer.alloc(1024, 0x01),
    Buffer.alloc(2048, 0x02),
    Buffer.alloc(512, 0x03),
    Buffer.from('Hello, World!', 'utf-8'),
  ];

  const batchResult = processor.processBatch(chunks);
  console.log('Batch Results:');
  console.log(`  Total chunks: ${batchResult.totalChunks}`);
  console.log(`  Successful: ${batchResult.successfulChunks}`);
  console.log(`  Failed: ${batchResult.failedChunks}`);
  console.log(`  Total bytes: ${batchResult.totalBytesProcessed}`);
  console.log('');

  // Example 3: Get metrics
  console.log('3. Performance Metrics:');
  const metrics = processor.getMetrics();
  console.log(`  Total processing time: ${metrics.totalProcessingTime.toFixed(2)}ms`);
  console.log(`  Average chunk time: ${metrics.averageChunkTime.toFixed(2)}ms`);
  console.log(`  Throughput: ${(metrics.throughput / 1024).toFixed(2)} KB/s`);
  console.log(`  Peak memory: ${(metrics.peakMemoryUsage / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Error count: ${metrics.errorCount}`);
  console.log('');

  // Example 4: Error handling
  console.log('4. Error Handling:');
  processor.reset();

  // Valid chunk
  processor.processChunk(Buffer.alloc(100), 0);

  // Invalid input (not a buffer)
  processor.processChunk('not a buffer', 1);

  // Oversized chunk (exceeds max)
  const oversized = Buffer.alloc(processor.maxBufferSize + 1);
  processor.processChunk(oversized, 2);

  console.log(`  Errors encountered: ${processor.errors.length}`);
  processor.errors.forEach((err, i) => {
    console.log(`    Error ${i + 1}: ${err.error} (chunk ${err.chunkIndex})`);
  });
  console.log('');

  // Example 5: Stream processing simulation
  console.log('5. Stream Processing Simulation:');
  processor.reset();

  // Simulate async stream
  async function* generateChunks() {
    for (let i = 0; i < 5; i++) {
      yield Buffer.alloc(1024, i);
      // Simulate async delay
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  }

  const streamResult = await processor.processStream(generateChunks());
  console.log(`  Stream processed: ${streamResult.totalChunks} chunks`);
  console.log(`  Total bytes: ${streamResult.totalBytesProcessed}`);
  console.log('');

  // Cleanup
  processor.cleanup();
  console.log('Processing complete. Resources cleaned up.');
}

// Run example if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export default ProductionBufferProcessor;
