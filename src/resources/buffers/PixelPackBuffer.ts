/**
 * PixelPackBuffer - GPU-to-CPU pixel data readback buffer (PIXEL_PACK_BUFFER)
 *
 * Specialized buffer for reading pixel data from GPU memory back to CPU memory.
 *
 * @class PixelPackBuffer
 */

import { GLContext } from '../../core/GLContext';
import { Buffer, BufferTarget, BufferUsage } from './Buffer.js';

/**
 * PixelPackBuffer - Buffer for GPU-to-CPU pixel data transfer (PIXEL_PACK_BUFFER)
 *
 * Used as the destination for pixel data readback operations. When bound,
 * readPixels() and similar operations write pixel data to this buffer
 * instead of directly to CPU memory. This is more efficient for large
 * amounts of pixel data or when performing asynchronous reads.
 *
 * @example
 * // Create pixel pack buffer to receive readback data
 * const pixels = Buffer.createPixelPackBuffer(ctx)
 *   .setData(new Uint8Array(800 * 600 * 4));  // RGBA data for 800x600 image
 *
 * // Read pixels from GPU into buffer (requires WebGL 2.0)
 * pixels.bind();
 * ctx.gl.readPixels(
 *   0, 0, 800, 600,
 *   ctx.gl.RGBA,
 *   ctx.gl.UNSIGNED_BYTE,
 *   0  // Offset into buffer
 * );
 */
export class PixelPackBuffer extends Buffer {
  /**
   * Creates a new PixelPackBuffer for pixel readback operations
   *
   * @param context - The GLContext this buffer belongs to
   * @param usage - Buffer usage hint (default: STATIC_READ)
   *
   * @example
   * const pixelBuffer = new PixelPackBuffer(ctx);
   * pixelBuffer.setData(pixelData);
   */
  constructor(context: GLContext, usage: BufferUsage = BufferUsage.STATIC_READ) {
    // Initialize parent with PIXEL_PACK_BUFFER target
    super(context, BufferTarget.PIXEL_PACK_BUFFER, usage);
  }
}