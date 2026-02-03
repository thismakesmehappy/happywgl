/**
 * PixelUnpackBuffer - CPU-to-GPU pixel data upload buffer (PIXEL_UNPACK_BUFFER)
 *
 * Specialized buffer for uploading pixel data from CPU memory to GPU memory.
 *
 * @class PixelUnpackBuffer
 */

import { GLContext } from '../../core/GLContext';
import { Buffer, BufferTarget, BufferUsage } from './Buffer.js';

/**
 * PixelUnpackBuffer - Buffer for CPU-to-GPU pixel data transfer (PIXEL_UNPACK_BUFFER)
 *
 * Used as the source for pixel data upload operations. When bound,
 * texImage2D(), texSubImage2D(), and similar operations read pixel data
 * from this buffer instead of directly from CPU memory. This is more efficient
 * for large amounts of pixel data or when performing asynchronous uploads.
 *
 * @example
 * // Create pixel unpack buffer with texture data
 * const pixels = Buffer.createPixelUnpackBuffer(ctx)
 *   .setData(new Uint8Array([255, 0, 0, 255, 0, 255, 0, 255])); // 2x1 RGBA pixels
 *
 * // Upload to texture from buffer
 * pixels.bind();
 * ctx.gl.texImage2D(
 *   ctx.gl.TEXTURE_2D,
 *   0,
 *   ctx.gl.RGBA,
 *   2, 1,  // width, height
 *   0,
 *   ctx.gl.RGBA,
 *   ctx.gl.UNSIGNED_BYTE,
 *   0  // Offset into buffer
 * );
 */
export class PixelUnpackBuffer extends Buffer {
  /**
   * Creates a new PixelUnpackBuffer for pixel upload operations
   *
   * @param context - The GLContext this buffer belongs to
   * @param usage - Buffer usage hint (default: STATIC_DRAW)
   *
   * @example
   * const pixelBuffer = new PixelUnpackBuffer(ctx);
   * pixelBuffer.setData(pixelData);
   */
  constructor(context: GLContext, usage: BufferUsage = BufferUsage.STATIC_DRAW) {
    // Initialize parent with PIXEL_UNPACK_BUFFER target
    super(context, BufferTarget.PIXEL_UNPACK_BUFFER, usage);
  }
}