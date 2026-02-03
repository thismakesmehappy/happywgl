/**
 * UniformBuffer - Shader uniform block data buffer (UNIFORM_BUFFER)
 *
 * Specialized buffer for storing shader uniform block objects.
 *
 * @class UniformBuffer
 */

import { GLContext } from '../../core/GLContext';
import { Buffer, BufferTarget, BufferUsage } from './Buffer.js';

/**
 * UniformBuffer - Buffer for shader uniform blocks (UNIFORM_BUFFER)
 *
 * Allows you to pass large amounts of data to shaders via uniform blocks.
 * Much more efficient than individual uniform calls, especially for data
 * that's shared between multiple objects or doesn't change frequently.
 *
 * Uniform blocks provide:
 * - Better performance than individual uniforms for large data sets
 * - Easy sharing of data between multiple shaders
 * - Automatic std140/std430 layout management by WebGL
 *
 * @example
 * // Create uniform buffer for shared material properties
 * const uniforms = Buffer.createUniformBuffer(ctx)
 *   .setData(new Float32Array([
 *     1.0, 0.0, 0.0, 1.0,  // color (rgba)
 *     0.5,                  // shininess
 *   ]));
 *
 * @example
 * // In shader:
 * // layout(std140) uniform MaterialProperties {
 * //   vec4 color;
 * //   float shininess;
 * // } material;
 */
export class UniformBuffer extends Buffer {
  /**
   * Creates a new UniformBuffer for shader uniform block data
   *
   * @param context - The GLContext this buffer belongs to
   * @param usage - Buffer usage hint (default: STATIC_DRAW)
   *
   * @example
   * const uniformBuffer = new UniformBuffer(ctx);
   * uniformBuffer.setData(uniformData);
   */
  constructor(context: GLContext, usage: BufferUsage = BufferUsage.STATIC_DRAW) {
    // Initialize parent with UNIFORM_BUFFER target
    super(context, BufferTarget.UNIFORM_BUFFER, usage);
  }
}