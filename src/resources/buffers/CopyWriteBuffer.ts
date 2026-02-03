/**
 * CopyWriteBuffer - Buffer-to-buffer copy destination (COPY_WRITE_BUFFER)
 *
 * Specialized buffer for use as the destination in buffer-to-buffer copy operations.
 *
 * @class CopyWriteBuffer
 */

import { GLContext } from '../../core/GLContext';
import { Buffer, BufferTarget, BufferUsage } from './Buffer.js';

/**
 * CopyWriteBuffer - Buffer serving as destination for buffer-to-buffer copies (COPY_WRITE_BUFFER)
 *
 * Used as the destination buffer in copyBufferSubData() operations.
 * Allows efficient data transfer between buffers without GPU-to-CPU-to-GPU round trips.
 *
 * @example
 * // Create copy write buffer to receive copied data
 * const copyWrite = Buffer.createCopyWriteBuffer(ctx)
 *   .setData(new Float32Array(6));  // Pre-allocate space
 *
 * // Copy data into it using WebGL API
 * ctx.gl.bindBuffer(ctx.gl.COPY_READ_BUFFER, source.buffer);
 * ctx.gl.bindBuffer(ctx.gl.COPY_WRITE_BUFFER, copyWrite.buffer);
 * ctx.gl.copyBufferSubData(
 *   ctx.gl.COPY_READ_BUFFER,
 *   ctx.gl.COPY_WRITE_BUFFER,
 *   0, 0, 12  // Copy 12 bytes from source offset 0 to dest offset 0
 * );
 */
export class CopyWriteBuffer extends Buffer {
  /**
   * Creates a new CopyWriteBuffer for buffer copy operations
   *
   * @param context - The GLContext this buffer belongs to
   * @param usage - Buffer usage hint (default: STATIC_COPY)
   *
   * @example
   * const copyWrite = new CopyWriteBuffer(ctx);
   * copyWrite.setData(destinationData);
   */
  constructor(context: GLContext, usage: BufferUsage = BufferUsage.STATIC_COPY) {
    // Initialize parent with COPY_WRITE_BUFFER target
    super(context, BufferTarget.COPY_WRITE_BUFFER, usage);
  }
}