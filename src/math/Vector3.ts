/**
 * Vector3 - A 3D vector class
 * 
 * Vectors in 3D graphics represent:
 * - Points in 3D space (position vectors) - use x, y, z
 * - Directions (normalized vectors) - use x, y, z
 * - Colors (RGB values) - use r, g, b
 * - Texture coordinates - use s, t, p
 * 
 * This class provides operations for vector math including:
 * - Basic arithmetic (add, subtract, multiply, divide)
 * - Dot product (scalar result)
 * - Cross product (vector result)
 * - Length/magnitude calculations
 * - Normalization (unit vectors)
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
export class Vector3 {
  /**
   * First component - X (position), R (color), or S (texture)
   */
  private _x: number;

  /**
   * Second component - Y (position), G (color), or T (texture)
   */
  private _y: number;

  /**
   * Third component - Z (position), B (color), or P (texture)
   */
  private _z: number;

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
    this._x = x;
    this._y = y;
    this._z = z;
  }

  // Position component accessors (x, y, z)
  get x(): number { return this._x; }
  set x(value: number) { this._x = value; }
  
  get y(): number { return this._y; }
  set y(value: number) { this._y = value; }
  
  get z(): number { return this._z; }
  set z(value: number) { this._z = value; }

  // Color component accessors (r, g, b)
  get r(): number { return this._x; }
  set r(value: number) { this._x = value; }
  
  get g(): number { return this._y; }
  set g(value: number) { this._y = value; }
  
  get b(): number { return this._z; }
  set b(value: number) { this._z = value; }

  // Texture component accessors (s, t, p)
  get s(): number { return this._x; }
  set s(value: number) { this._x = value; }
  
  get t(): number { return this._y; }
  set t(value: number) { this._y = value; }
  
  get p(): number { return this._z; }
  set p(value: number) { this._z = value; }

  /**
   * Adds another vector to this vector (MUTATING)
   * Modifies this vector in place.
   * 
   * @param v - Vector to add
   * @returns This vector (for chaining)
   * 
   * @example
   * const v1 = new Vector3(1, 2, 3);
   * const v2 = new Vector3(4, 5, 6);
   * v1.add(v2);  // v1 is now (5, 7, 9)
   */
  add(v: Vector3): this {
    this._x += v._x;
    this._y += v._y;
    this._z += v._z;
    return this;
  }

  /**
   * Static method: Adds two vectors and returns a new vector
   * Similar to GLSL: vec3 c = a + b;
   * 
   * @param a - First vector
   * @param b - Second vector
   * @returns New vector with the result
   * 
   * @example
   * const v1 = new Vector3(1, 2, 3);
   * const v2 = new Vector3(4, 5, 6);
   * const v3 = Vector3.add(v1, v2);  // Neither v1 nor v2 changed
   */
  static add(a: Vector3, b: Vector3): Vector3 {
    return new Vector3(
      a._x + b._x,
      a._y + b._y,
      a._z + b._z
    );
  }

  /**
   * Calculates the squared length (magnitude) of this vector
   * 
   * This is faster than length() because it avoids the square root operation.
   * Useful when you only need to compare lengths (e.g., distance checks).
   * 
   * Formula: x² + y² + z²
   * 
   * @returns The squared length of the vector
   * 
   * @example
   * const v = new Vector3(3, 4, 0);
   * v.lengthSquared();  // Returns 25 (not 5)
   * 
   * // Compare distances without sqrt:
   * if (v1.lengthSquared() < v2.lengthSquared()) {
   *   // v1 is closer to origin
   * }
   */
  lengthSquared(): number {
    return this._x * this._x + this._y * this._y + this._z * this._z;
  }

  /**
   * Calculates the length (magnitude) of this vector
   * 
   * The length is the distance from the origin (0, 0, 0) to the point
   * represented by this vector.
   * 
   * Formula: √(x² + y² + z²)
   * 
   * Note: If you only need to compare lengths, use lengthSquared() instead
   * for better performance (avoids square root).
   * 
   * @returns The length of the vector
   * 
   * @example
   * const v = new Vector3(3, 4, 0);
   * v.length();  // Returns 5 (√(9 + 16))
   */
  length(): number {
    return Math.sqrt(this.lengthSquared());
  }

  /**
   * Subtracts another vector from this vector (MUTATING)
   * Modifies this vector in place.
   * 
   * @param v - Vector to subtract
   * @returns This vector (for chaining)
   * 
   * @example
   * const v1 = new Vector3(5, 7, 9);
   * const v2 = new Vector3(4, 5, 6);
   * v1.subtract(v2);  // v1 is now (1, 2, 3)
   */
  subtract(v: Vector3): this {
    this._x -= v._x;
    this._y -= v._y;
    this._z -= v._z;
    return this;
  }

  /**
   * Static method: Subtracts two vectors and returns a new vector
   * Similar to GLSL: vec3 c = a - b;
   * 
   * @param a - First vector (minuend)
   * @param b - Second vector (subtrahend)
   * @returns New vector with the result (a - b)
   * 
   * @example
   * const v1 = new Vector3(5, 7, 9);
   * const v2 = new Vector3(4, 5, 6);
   * const v3 = Vector3.subtract(v1, v2);  // v3 is (1, 2, 3), v1 and v2 unchanged
   */
  static subtract(a: Vector3, b: Vector3): Vector3 {
    return new Vector3(
      a._x - b._x,
      a._y - b._y,
      a._z - b._z
    );
  }

  /**
   * Multiplies this vector by a scalar (MUTATING)
   * Scales the vector by the given factor.
   * 
   * @param scalar - The scalar value to multiply by
   * @returns This vector (for chaining)
   * 
   * @example
   * const v = new Vector3(1, 2, 3);
   * v.multiplyScalar(2);  // v is now (2, 4, 6)
   */
  multiplyScalar(scalar: number): this {
    this._x *= scalar;
    this._y *= scalar;
    this._z *= scalar;
    return this;
  }

  /**
   * Static method: Multiplies a vector by a scalar and returns a new vector
   * Similar to GLSL: vec3 b = a * scalar;
   * 
   * @param v - The vector to scale
   * @param scalar - The scalar value to multiply by
   * @returns New vector with the result
   * 
   * @example
   * const v1 = new Vector3(1, 2, 3);
   * const v2 = Vector3.multiplyScalar(v1, 2);  // v2 is (2, 4, 6), v1 unchanged
   */
  static multiplyScalar(v: Vector3, scalar: number): Vector3 {
    return new Vector3(
      v._x * scalar,
      v._y * scalar,
      v._z * scalar
    );
  }

  /**
   * Divides this vector by a scalar (MUTATING)
   * Scales the vector by the inverse of the given factor.
   * 
   * @param scalar - The scalar value to divide by
   * @returns This vector (for chaining)
   * @throws Error if scalar is zero
   * 
   * @example
   * const v = new Vector3(4, 6, 8);
   * v.divideScalar(2);  // v is now (2, 3, 4)
   */
  divideScalar(scalar: number): this {
    if (scalar === 0) {
      throw new Error('Cannot divide vector by zero');
    }
    return this.multiplyScalar(1 / scalar);
  }

  /**
   * Static method: Divides a vector by a scalar and returns a new vector
   * Similar to GLSL: vec3 b = a / scalar;
   * 
   * @param v - The vector to divide
   * @param scalar - The scalar value to divide by
   * @returns New vector with the result
   * @throws Error if scalar is zero
   * 
   * @example
   * const v1 = new Vector3(4, 6, 8);
   * const v2 = Vector3.divideScalar(v1, 2);  // v2 is (2, 3, 4), v1 unchanged
   */
  static divideScalar(v: Vector3, scalar: number): Vector3 {
    if (scalar === 0) {
      throw new Error('Cannot divide vector by zero');
    }
    return Vector3.multiplyScalar(v, 1 / scalar);
  }

  /**
   * Normalizes this vector to unit length (MUTATING)
   * Makes the vector have length = 1 while preserving its direction.
   * 
   * If the vector is the zero vector (0, 0, 0), it remains unchanged
   * (cannot normalize a zero vector).
   * 
   * @returns This vector (for chaining)
   * 
   * @example
   * const v = new Vector3(3, 4, 0);
   * v.normalize();  // v is now (0.6, 0.8, 0), length = 1
   */
  normalize(): this {
    const len = this.length();
    if (len === 0) {
      // Cannot normalize zero vector - leave it unchanged
      return this;
    }
    return this.divideScalar(len);
  }

  /**
   * Static method: Normalizes a vector to unit length and returns a new vector
   * Similar to GLSL: vec3 normalized = normalize(v);
   * 
   * @param v - The vector to normalize
   * @returns New normalized vector (length = 1)
   * 
   * @example
   * const v1 = new Vector3(3, 4, 0);
   * const v2 = Vector3.normalize(v1);  // v2 is (0.6, 0.8, 0), v1 unchanged
   */
  static normalize(v: Vector3): Vector3 {
    const len = v.length();
    if (len === 0) {
      // Cannot normalize zero vector - return zero vector
      return new Vector3(0, 0, 0);
    }
    return Vector3.divideScalar(v, len);
  }

  /**
   * Creates a new Vector3 with the same values as this vector
   * Non-mutating - returns a new instance.
   * 
   * @returns A new Vector3 with the same values
   * 
   * @example
   * const v1 = new Vector3(1, 2, 3);
   * const v2 = v1.clone();  // v2 is a new vector (1, 2, 3), v1 unchanged
   */
  clone(): Vector3 {
    return new Vector3(this._x, this._y, this._z);
  }

  /**
   * Copies the values from another vector into this vector (MUTATING)
   * Modifies this vector to have the same values as the source vector.
   * 
   * @param v - The vector to copy from
   * @returns This vector (for chaining)
   * 
   * @example
   * const v1 = new Vector3(1, 2, 3);
   * const v2 = new Vector3(10, 20, 30);
   * v2.copy(v1);  // v2 is now (1, 2, 3), v1 unchanged
   */
  copy(v: Vector3): this {
    this._x = v._x;
    this._y = v._y;
    this._z = v._z;
    return this;
  }

  /**
   * Checks if this vector equals another vector
   * Compares all three components for exact equality.
   * 
   * Note: Uses strict equality (===). For floating-point comparisons with
   * tolerance, you might want to implement an `equalsEpsilon()` method later.
   * 
   * @param v - The vector to compare with
   * @returns True if all components are equal, false otherwise
   * 
   * @example
   * const v1 = new Vector3(1, 2, 3);
   * const v2 = new Vector3(1, 2, 3);
   * v1.equals(v2);  // Returns true
   */
  equals(v: Vector3): boolean {
    return this._x === v._x && this._y === v._y && this._z === v._z;
  }

  /**
   * Checks if this vector equals another vector within a tolerance
   * Useful for floating-point comparisons where exact equality may fail.
   * 
   * @param v - The vector to compare with
   * @param epsilon - Tolerance value (default: 0.00001)
   * @returns True if all components are within epsilon, false otherwise
   * 
   * @example
   * const v1 = new Vector3(1.0, 2.0, 3.0);
   * const v2 = new Vector3(1.000001, 2.000001, 3.000001);
   * v1.equalsEpsilon(v2, 0.00001);  // Returns true
   */
  equalsEpsilon(v: Vector3, epsilon: number = 0.00001): boolean {
    return Math.abs(this._x - v._x) <= epsilon 
        && Math.abs(this._y - v._y) <= epsilon 
        && Math.abs(this._z - v._z) <= epsilon;
  }

  /**
   * Calculates the dot product with another vector
   * 
   * The dot product is a scalar value that represents:
   * - The cosine of the angle between two vectors (when normalized)
   * - How much one vector points in the direction of another
   * - Used extensively in lighting calculations
   * 
   * Formula: a · b = a.x * b.x + a.y * b.y + a.z * b.z
   * 
   * Properties:
   * - If vectors are perpendicular: dot = 0
   * - If vectors point same direction: dot > 0
   * - If vectors point opposite directions: dot < 0
   * - If both are normalized: dot = cos(angle)
   * 
   * @param v - The vector to calculate dot product with
   * @returns The dot product (scalar value)
   * 
   * @example
   * const v1 = new Vector3(1, 0, 0);
   * const v2 = new Vector3(0, 1, 0);
   * v1.dot(v2);  // Returns 0 (perpendicular)
   * 
   * @example
   * // In lighting: how much light hits a surface
   * const normal = new Vector3(0, 1, 0).normalize();
   * const lightDir = new Vector3(0.707, 0.707, 0).normalize();
   * const intensity = normal.dot(lightDir);  // cos(angle)
   */
  dot(v: Vector3): number {
    return this._x * v._x + this._y * v._y + this._z * v._z;
  }

  /**
   * Static method: Calculates the dot product of two vectors
   * Similar to GLSL: float d = dot(a, b);
   * 
   * @param a - First vector
   * @param b - Second vector
   * @returns The dot product (scalar value)
   * 
   * @example
   * const v1 = new Vector3(1, 2, 3);
   * const v2 = new Vector3(4, 5, 6);
   * Vector3.dot(v1, v2);  // Returns 32 (1*4 + 2*5 + 3*6)
   */
  static dot(a: Vector3, b: Vector3): number {
    return a._x * b._x + a._y * b._y + a._z * b._z;
  }

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
    const x = this._y * v._z - this._z * v._y;
    const y = this._z * v._x - this._x * v._z;
    const z = this._x * v._y - this._y * v._x;
    
    this._x = x;
    this._y = y;
    this._z = z;
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
      a._y * b._z - a._z * b._y,
      a._z * b._x - a._x * b._z,
      a._x * b._y - a._y * b._x
    );
  }
}
