import { Vector } from './Vector.js';

/**
 * Vector2 - A 2D vector class
 * 
 * Extends Vector to provide 2D-specific functionality.
 * 
 * Vectors in 2D graphics represent:
 * - Points in 2D space (position vectors) - use x, y
 * - Directions (normalized vectors) - use x, y
 * - Colors (RGB values) - use r, g
 * - Texture coordinates - use s, t
 * 
 * This class provides operations for vector math including:
 * - Basic arithmetic (add, subtract, multiply, divide) - inherited from Vector
 * - Dot product (scalar result) - inherited from Vector
 * - Cross product (scalar result) - 2D-specific
 * - Length/magnitude calculations - inherited from Vector
 * - Normalization (unit vectors) - inherited from Vector
 * 
 * Component Access:
 * Like GLSL, you can access components by different names:
 * - Position: x, y
 * - Color: r, g
 * - Texture: s, t
 * 
 * All names refer to the same underlying data:
 * v.x === v.r === v.s (first component)
 * v.y === v.g === v.t (second component)
 * 
 * Method Patterns:
 * - Instance methods (e.g., v1.add(v2)): Mutate the calling vector
 * - Static methods (e.g., Vector2.add(v1, v2)): Return a new vector, don't mutate inputs
 * 
 * This matches common patterns:
 * - Use instance methods when you want to modify in place (performance, chaining)
 * - Use static methods when you want immutability (functional style, like GLSL)
 */
export class Vector2 extends Vector {
  /**
   * Creates a new Vector2
   * 
   * @param x - X component (default: 0)
   * @param y - Y component (default: 0)
   * 
   * @example
   * const v1 = new Vector2();           // (0, 0)
   * const v2 = new Vector2(1, 2);       // (1, 2)
   */
  constructor(x: number = 0, y: number = 0) {
    super(x, y);
  }

  // Position component accessors (x, y)
  get x(): number { return this._components[0]!; }
  set x(value: number) { this._components[0] = value; }
  
  get y(): number { return this._components[1]!; }
  set y(value: number) { this._components[1] = value; }

  // Color component accessors (r, g)
  get r(): number { return this._components[0]!; }
  set r(value: number) { this._components[0] = value; }
  
  get g(): number { return this._components[1]!; }
  set g(value: number) { this._components[1] = value; }

  // Texture component accessors (s, t)
  get s(): number { return this._components[0]!; }
  set s(value: number) { this._components[0] = value; }
  
  get t(): number { return this._components[1]!; }
  set t(value: number) { this._components[1] = value; }


  /**
   * Static method: Calculates the cross product of two vectors
   * 
   * In 2D, the cross product returns a scalar value representing the signed area
   * of the parallelogram formed by the two vectors.
   * 
   * @param a - First vector
   * @param b - Second vector
   * @returns Scalar value: a.x * b.y - a.y * b.x
   * 
   * @example
   * const v1 = new Vector2(1, 0);
   * const v2 = new Vector2(0, 1);
   * Vector2.cross(v1, v2);  // Returns 1
   */
  static cross(a: Vector2, b: Vector2): number {
    return a.x * b.y - a.y * b.x;
  }
}
