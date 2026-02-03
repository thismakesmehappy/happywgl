/**
 * IndexBuffer - Vertex index data buffer (ELEMENT_ARRAY_BUFFER)
 *
 * Specialized buffer for storing vertex indices used with indexed drawing.
 * Does not support componentSize - indices are always single values.
 *
 * @class IndexBuffer
 */

import { GLContext } from '../../core/GLContext';
import { Buffer, BufferTarget, BufferUsage } from './Buffer.js';

/**
 * IndexBuffer - Specialized buffer for vertex indices (ELEMENT_ARRAY_BUFFER)
 *
 * Used with indexed drawing commands (drawElements, drawElementsInstanced, etc.)
 * to specify which vertices to render and in what order.
 *
 * Unlike VertexBuffer, IndexBuffer does not have componentSize because
 * indices are always single scalar values (not multi-component attributes).
 *
 * @example
 * // Create an index buffer for a triangle
 * const ibo = Buffer.createIndexBuffer(ctx)
 *   .setData(new Uint16Array([0, 1, 2]));
 *
 * @example
 * // Use with indexed drawing
 * ibo.bind();
 * ctx.gl.drawElements(ctx.gl.TRIANGLES, 3, ctx.gl.UNSIGNED_SHORT, 0);
 */
export class IndexBuffer extends Buffer {
  /**
   * Creates a new IndexBuffer for vertex index data
   *
   * @param context - The GLContext this buffer belongs to
   * @param usage - Buffer usage hint (default: STATIC_DRAW)
   *
   * @example
   * const ibo = new IndexBuffer(ctx);
   * ibo.setData(new Uint16Array([0, 1, 2]));
   */
  constructor(context: GLContext, usage: BufferUsage = BufferUsage.STATIC_DRAW) {
    // Initialize parent with ELEMENT_ARRAY_BUFFER target
    super(context, BufferTarget.ELEMENT_ARRAY_BUFFER, usage);
  }
}
