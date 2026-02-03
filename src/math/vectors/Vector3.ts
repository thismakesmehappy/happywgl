import { Vector } from './Vector.js';

/**
 * Vector3 - A 3D vector class
 * 
 * Extends Vector to provide 3D-specific functionality.
 * 
 * Vectors in 3D graphics represent:
 * - Points in 3D space (position vectors) - use x, y, z
 * - Directions (normalized vectors) - use x, y, z
 * - Colors (RGB values) - use r, g, b
 * - Texture coordinates - use s, t, p
 * 
 * This class provides operations for vector math including:
 * - Basic arithmetic (add, subtract, multiply, divide) - inherited from Vector
 * - Dot product (scalar result) - inherited from Vector
 * - Cross product (vector result) - 3D-specific
 * - Length/magnitude calculations - inherited from Vector
 * - Normalization (unit vectors) - inherited from Vector
 * 
 * Component Access:
 * Like GLSL, you can access components by different names:
 * - Position: x, y, z
 * - Color: r, g, b
 * - Texture: s, t, p
 * 
 * All names refer to the same underlying data:
 * v.x === v.r === v.s (first component)
 * v.y === v.g === v.t (second component)
 * v.z === v.b === v.p (third component)
 * 
 * Method Patterns:
 * - Instance methods (e.g., v1.add(v2)): Mutate the calling vector
 * - Static methods (e.g., Vector3.add(v1, v2)): Return a new vector, don't mutate inputs
 * 
 * This matches common patterns:
 * - Use instance methods when you want to modify in place (performance, chaining)
 * - Use static methods when you want immutability (functional style, like GLSL)
 */
export class Vector3 extends Vector {
  /**
   * Creates a new Vector3
   * 
   * @param x - X component (default: 0)
   * @param y - Y component (default: 0)
   * @param z - Z component (default: 0)
   * 
   * @example
   * const v1 = new Vector3();           // (0, 0, 0)
   * const v2 = new Vector3(1, 2, 3);  // (1, 2, 3)
   */
  constructor(x: number = 0, y: number = 0, z: number = 0) {
    super(x, y, z);
  }

  // Position component accessors (x, y, z)
  get x(): number { return this._components[0]!; }
  set x(value: number) { this._components[0] = value; }
  
  get y(): number { return this._components[1]!; }
  set y(value: number) { this._components[1] = value; }
  
  get z(): number { return this._components[2]!; }
  set z(value: number) { this._components[2] = value; }

  // Color component accessors (r, g, b)
  get r(): number { return this._components[0]!; }
  set r(value: number) { this._components[0] = value; }
  
  get g(): number { return this._components[1]!; }
  set g(value: number) { this._components[1] = value; }
  
  get b(): number { return this._components[2]!; }
  set b(value: number) { this._components[2] = value; }

  // Texture component accessors (s, t, p)
  get s(): number { return this._components[0]!; }
  set s(value: number) { this._components[0] = value; }
  
  get t(): number { return this._components[1]!; }
  set t(value: number) { this._components[1] = value; }
  
  get p(): number { return this._components[2]!; }
  set p(value: number) { this._components[2] = value; }


  /**
   * Calculates the cross product with another vector (MUTATING)
   * 
   * The cross product returns a vector that is perpendicular to both input vectors.
   * The result's magnitude equals the area of the parallelogram formed by the two vectors.
   * 
   * Formula:
   * a × b = (a.y * b.z - a.z * b.y,
   *          a.z * b.x - a.x * b.z,
   *          a.x * b.y - a.y * b.x)
   * 
   * Properties:
   * - Result is perpendicular to both input vectors
   * - Direction follows right-hand rule
   * - Used to calculate surface normals, tangents, etc.
   * - a × b = -(b × a) (anti-commutative)
   * 
   * @param v - The vector to calculate cross product with
   * @returns This vector (for chaining) - now contains the cross product result
   * 
   * @example
   * // Calculate a normal vector from two edge vectors
   * const edge1 = new Vector3(1, 0, 0);
   * const edge2 = new Vector3(0, 1, 0);
   * const normal = edge1.clone().cross(edge2);  // (0, 0, 1) - points up
   */
  cross(v: Vector3): this {
    const x = this.y * v.z - this.z * v.y;
    const y = this.z * v.x - this.x * v.z;
    const z = this.x * v.y - this.y * v.x;
    
    this._components[0] = x;
    this._components[1] = y;
    this._components[2] = z;
    return this;
  }

  /**
   * Static method: Calculates the cross product of two vectors
   * Similar to GLSL: vec3 c = cross(a, b);
   * 
   * @param a - First vector
   * @param b - Second vector
   * @returns New vector containing the cross product result
   * 
   * @example
   * const v1 = new Vector3(1, 0, 0);
   * const v2 = new Vector3(0, 1, 0);
   * const v3 = Vector3.cross(v1, v2);  // v3 is (0, 0, 1), v1 and v2 unchanged
   */
  static cross(a: Vector3, b: Vector3): Vector3 {
    return new Vector3(
      a.y * b.z - a.z * b.y,
      a.z * b.x - a.x * b.z,
      a.x * b.y - a.y * b.x
    );
  }
}
