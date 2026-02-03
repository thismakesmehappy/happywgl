import { Vector } from './Vector.js';

/**
 * Vector4 - A 4D vector class
 * 
 * Extends Vector to provide 4D-specific functionality.
 * 
 * Vectors in 4D graphics represent:
 * - Points in 3D space with homogeneous coordinates (position vectors) - use x, y, z, w
 * - Directions (normalized vectors) - use x, y, z, w
 * - Colors (RGBA values) - use r, g, b, a 
 * - Texture coordinates - use s, t, p, q
 * 
 * This class provides operations for vector math including:
 * - Basic arithmetic (add, subtract, multiply, divide) - inherited from Vector
 * - Dot product (scalar result) - inherited from Vector
 * - Length/magnitude calculations - inherited from Vector
 * - Normalization (unit vectors) - inherited from Vector
 * 
 * Note: Cross product is not implemented for Vector4 as it's not well-defined in 4D space.
 * 
 * Component Access:
 * Like GLSL, you can access components by different names:
 * - Position: x, y, z, w
 * - Color: r, g, b, a
 * - Texture: s, t, p, q
 * 
 * All names refer to the same underlying data:
 * v.x === v.r === v.s (first component)
 * v.y === v.g === v.t (second component)
 * v.z === v.b === v.p (third component)
 * v.w === v.a === v.q (fourth component)
 * 
 * Method Patterns:
 * - Instance methods (e.g., v1.add(v2)): Mutate the calling vector
 * - Static methods (e.g., Vector4.add(v1, v2)): Return a new vector, don't mutate inputs
 * 
 * This matches common patterns:
 * - Use instance methods when you want to modify in place (performance, chaining)
 * - Use static methods when you want immutability (functional style, like GLSL)
 */
export class Vector4 extends Vector {
  /**
   * Creates a new Vector4
   * 
   * @param x - X component (default: 0)
   * @param y - Y component (default: 0)
   * @param z - Z component (default: 0)
   * @param w - W component (default: 0)
   * 
   * @example
   * const v1 = new Vector4();           // (0, 0, 0, 0)
   * const v2 = new Vector4(1, 2, 3, 4);  // (1, 2, 3, 4)
   */
  constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0) {
    super(x, y, z, w);
  }

  // Position component accessors (x, y, z, w)
  get x(): number { return this._components[0]!; }
  set x(value: number) { this._components[0] = value; }
  
  get y(): number { return this._components[1]!; }
  set y(value: number) { this._components[1] = value; }
  
  get z(): number { return this._components[2]!; }
  set z(value: number) { this._components[2] = value; }

  get w(): number { return this._components[3]!; }
  set w(value: number) { this._components[3] = value; }

  // Color component accessors (r, g, b, a)
  get r(): number { return this._components[0]!; }
  set r(value: number) { this._components[0] = value; }
  
  get g(): number { return this._components[1]!; }
  set g(value: number) { this._components[1] = value; }
  
  get b(): number { return this._components[2]!; }
  set b(value: number) { this._components[2] = value; }

  get a(): number { return this._components[3]!; }
  set a(value: number) { this._components[3] = value; }

  // Texture component accessors (s, t, p, q)
  get s(): number { return this._components[0]!; }
  set s(value: number) { this._components[0] = value; }
  
  get t(): number { return this._components[1]!; }
  set t(value: number) { this._components[1] = value; }
  
  get p(): number { return this._components[2]!; }
  set p(value: number) { this._components[2] = value; }

  get q(): number { return this._components[3]!; }
  set q(value: number) { this._components[3] = value; }

}