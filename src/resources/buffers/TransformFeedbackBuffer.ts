/**
 * TransformFeedbackBuffer - Transform feedback output buffer (TRANSFORM_FEEDBACK_BUFFER)
 *
 * Specialized buffer for capturing transformed vertex data from the GPU.
 *
 * @class TransformFeedbackBuffer
 */

import { GLContext } from '../../core/GLContext';
import { Buffer, BufferTarget, BufferUsage } from './Buffer.js';

/**
 * TransformFeedbackBuffer - Buffer for transform feedback output (TRANSFORM_FEEDBACK_BUFFER)
 *
 * Captures the output of vertex shaders during transform feedback operations.
 * Allows you to use GPU vertex processing for off-screen computation,
 * particles, procedural geometry, and other GPGPU tasks.
 *
 * Transform feedback requires:
 * 1. A TransformFeedbackBuffer bound to capture output
 * 2. A shader with transform feedback varyings enabled
 * 3. A transform feedback object to manage the operation
 *
 * @example
 * // Create transform feedback buffer for particle simulation
 * const feedback = Buffer.createTransformFeedbackBuffer(ctx)
 *   .setData(new Float32Array(1000 * 4));  // 1000 particles with 4 components
 *
 * // Note: Using this buffer requires transform feedback setup (WebGL 2.0 feature)
 * // This is an advanced feature typically used in particle systems or GPGPU computing
 */
export class TransformFeedbackBuffer extends Buffer {
  /**
   * Creates a new TransformFeedbackBuffer for transform feedback operations
   *
   * @param context - The GLContext this buffer belongs to
   * @param usage - Buffer usage hint (default: STATIC_COPY)
   *
   * @example
   * const feedbackBuffer = new TransformFeedbackBuffer(ctx);
   * feedbackBuffer.setData(transformFeedbackData);
   */
  constructor(context: GLContext, usage: BufferUsage = BufferUsage.STATIC_COPY) {
    // Initialize parent with TRANSFORM_FEEDBACK_BUFFER target
    super(context, BufferTarget.TRANSFORM_FEEDBACK_BUFFER, usage);
  }
}