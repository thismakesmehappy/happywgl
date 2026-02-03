/**
 * CopyReadBuffer - Buffer-to-buffer copy source (COPY_READ_BUFFER)
 *
 * Specialized buffer for use as the source in buffer-to-buffer copy operations.
 *
 * @class CopyReadBuffer
 */

import { GLContext } from '../../core/GLContext';
import { Buffer, BufferTarget, BufferUsage } from './Buffer.js';

/**
 * CopyReadBuffer - Buffer serving as source for buffer-to-buffer copies (COPY_READ_BUFFER)
 *
 * Used as the source buffer in copyBufferSubData() operations.
 * Allows efficient data transfer between buffers without GPU-to-CPU-to-GPU round trips.
 *
 * @example
 * // Create copy read buffer and copy from it
 * const copyRead = Buffer.createCopyReadBuffer(ctx)
 *   .setData(new Float32Array([1, 2, 3, 4, 5, 6]));
 *
 * // Copy data to another buffer using WebGL API
 * ctx.gl.bindBuffer(ctx.gl.COPY_READ_BUFFER, copyRead.buffer);
 * ctx.gl.bindBuffer(ctx.gl.COPY_WRITE_BUFFER, dest.buffer);
 * ctx.gl.copyBufferSubData(
 *   ctx.gl.COPY_READ_BUFFER,
 *   ctx.gl.COPY_WRITE_BUFFER,
 *   0, 0, 12  // Copy 12 bytes from offset 0 to offset 0
 * );
 */
export class CopyReadBuffer extends Buffer {
  /**
   * Creates a new CopyReadBuffer for buffer copy operations
   *
   * @param context - The GLContext this buffer belongs to
   * @param usage - Buffer usage hint (default: STATIC_COPY)
   *
   * @example
   * const copyRead = new CopyReadBuffer(ctx);
   * copyRead.setData(sourceData);
   */
  constructor(context: GLContext, usage: BufferUsage = BufferUsage.STATIC_COPY) {
    // Initialize parent with COPY_READ_BUFFER target
    super(context, BufferTarget.COPY_READ_BUFFER, usage);
  }
}