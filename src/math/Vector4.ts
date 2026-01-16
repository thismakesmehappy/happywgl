/**
 * Vector4 - A 4D vector class
 * 
 * Vectors in 4D graphics represent:
 * - Points in 3D space with homogeneous coordinates (position vectors) - use x, y, z, w
 * - Directions (normalized vectors) - use x, y, z, w
 * - Colors (RGBA values) - use r, g, b, a 
 * - Texture coordinates - use s, t, p, q
 * 
 * This class provides operations for vector math including:
 * - Basic arithmetic (add, subtract, multiply, divide)
 * - Dot product (scalar result)
 * - Length/magnitude calculations
 * - Normalization (unit vectors)
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
export class Vector4 {
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
   * Fourth component - W (position), A (color), or Q (texture)
   */
  private _w: number;

  /**
   * Creates a new Vector4
   * 
   * @param x - X component (default: 0)
   * @param y - Y component (default: 0)
   * @param z - Z component (default: 0)
   * 
   * @example
   * const v1 = new Vector4();           // (0, 0, 0, 0)
   * const v2 = new Vector4(1, 2, 3, 4);  // (1, 2, 3, 4)
   */
  constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0) {
    this._x = x;
    this._y = y;
    this._z = z;
    this._w = w;
  }

  // Position component accessors (x, y, z)
  get x(): number { return this._x; }
  set x(value: number) { this._x = value; }
  
  get y(): number { return this._y; }
  set y(value: number) { this._y = value; }
  
  get z(): number { return this._z; }
  set z(value: number) { this._z = value; }

  get w(): number { return this._w; }
  set w(value: number) { this._w = value; }

  // Color component accessors (r, g, b)
  get r(): number { return this._x; }
  set r(value: number) { this._x = value; }
  
  get g(): number { return this._y; }
  set g(value: number) { this._y = value; }
  
  get b(): number { return this._z; }
  set b(value: number) { this._z = value; }

  get a(): number { return this._w; }
  set a(value: number) { this._w = value; }

  // Texture component accessors (s, t, p)
  get s(): number { return this._x; }
  set s(value: number) { this._x = value; }
  
  get t(): number { return this._y; }
  set t(value: number) { this._y = value; }
  
  get p(): number { return this._z; }
  set p(value: number) { this._z = value; }

  get q(): number { return this._w; }
  set q(value: number) { this._w = value; }

  /**
   * Adds another vector to this vector (MUTATING)
   * Modifies this vector in place.
   * 
   * @param v - Vector to add
   * @returns This vector (for chaining)
   * 
   * @example
   * const v1 = new Vector4(1, 2, 3, 4);
   * const v2 = new Vector4(4, 5, 6, 7);
   * v1.add(v2);  // v1 is now (5, 7, 9, 11)
   */
  add(v: Vector4): this {
    this._x += v._x;
    this._y += v._y;
    this._z += v._z;
    this._w += v._w;
    return this;
  }

  /**
   * Static method: Adds two vectors and returns a new vector
   * Similar to GLSL: vec4 c = a + b;
   * 
   * @param a - First vector
   * @param b - Second vector
   * @returns New vector with the result
   * 
   * @example
   * const v1 = new Vector4(1, 2, 3, 4);
   * const v2 = new Vector4(4, 5, 6, 7);
   * const v3 = Vector4.add(v1, v2);  // Neither v1 nor v2 changed
   */
  static add(a: Vector4, b: Vector4): Vector4 {
    return new Vector4(
      a._x + b._x,
      a._y + b._y,
      a._z + b._z,
      a._w + b._w
    );
  }

  /**
   * Calculates the squared length (magnitude) of this vector
   * 
   * This is faster than length() because it avoids the square root operation.
   * Useful when you only need to compare lengths (e.g., distance checks).
   * 
   * Formula: x² + y² + z² + w²
   * 
   * @returns The squared length of the vector
   * 
   * @example
   * const v = new Vector4(3, 4, 0, 0);
   * v.lengthSquared();  // Returns 25 (not √(9 + 16 + 0 + 0))
   * 
   * // Compare distances without sqrt:
   * if (v1.lengthSquared() < v2.lengthSquared()) {
   *   // v1 is closer to origin
   * }
   */
  lengthSquared(): number {
    return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
  }

  /**
   * Calculates the length (magnitude) of this vector
   * 
   * The length is the distance from the origin (0, 0, 0, 0) to the point
   * represented by this vector.
   * 
   * Formula: √(x² + y² + z² + w²)
   * 
   * Note: If you only need to compare lengths, use lengthSquared() instead
   * for better performance (avoids square root).
   * 
   * @returns The length of the vector
   * 
   * @example
   * const v = new Vector4(3, 4, 0, 0);
   * v.length();  // Returns 5 (√(9 + 16 + 0 + 0))
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
   * const v1 = new Vector4(5, 7, 9, 11);
   * const v2 = new Vector4(4, 5, 6, 7);
   * v1.subtract(v2);  // v1 is now (1, 2, 3, 4)
   */
  subtract(v: Vector4): this {
    this._x -= v._x;
    this._y -= v._y;
    this._z -= v._z;
    this._w -= v._w;
    return this;
  }

  /**
   * Static method: Subtracts two vectors and returns a new vector
   * Similar to GLSL: vec4 c = a - b;
   * 
   * @param a - First vector (minuend)
   * @param b - Second vector (subtrahend)
   * @returns New vector with the result (a - b)
   * 
   * @example
   * const v1 = new Vector4(5, 7, 9, 11);
   * const v2 = new Vector4(4, 5, 6, 7);
   * const v3 = Vector4.subtract(v1, v2);  // v3 is (1, 2, 3, 4), v1 and v2 unchanged
   */
  static subtract(a: Vector4, b: Vector4): Vector4 {
    return new Vector4(
      a._x - b._x,
      a._y - b._y,
      a._z - b._z,
      a._w - b._w
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
   * const v = new Vector4(1, 2, 3, 4);
   * v.multiplyScalar(2);  // v is now (2, 4, 6, 8)
   */
  multiplyScalar(scalar: number): this {
    this._x *= scalar;
    this._y *= scalar;
    this._z *= scalar;
    this._w *= scalar;
    return this;
  }

  /**
   * Static method: Multiplies a vector by a scalar and returns a new vector
   * Similar to GLSL: vec4 b = a * scalar;
   * 
   * @param v - The vector to scale
   * @param scalar - The scalar value to multiply by
   * @returns New vector with the result
   * 
   * @example
   * const v1 = new Vector4(1, 2, 3, 4);
   * const v2 = Vector4.multiplyScalar(v1, 2);  // v2 is (2, 4, 6, 8), v1 unchanged
   */
  static multiplyScalar(v: Vector4, scalar: number): Vector4 {
    return new Vector4(
      v._x * scalar,
      v._y * scalar,
      v._z * scalar,
      v._w * scalar
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
   * const v = new Vector4(4, 6, 8, 10);
   * v.divideScalar(2);  // v is now (2, 3, 4, 5)
   */
  divideScalar(scalar: number): this {
    if (scalar === 0) {
      throw new Error('Cannot divide vector by zero');
    }
    return this.multiplyScalar(1 / scalar);
  }

  /**
   * Static method: Divides a vector by a scalar and returns a new vector
   * Similar to GLSL: vec4c b = a / scalar;
   * 
   * @param v - The vector to divide
   * @param scalar - The scalar value to divide by
   * @returns New vector with the result
   * @throws Error if scalar is zero
   * 
   * @example
   * const v1 = new Vector4(4, 6, 8, 10);
   * const v2 = Vector4.divideScalar(v1, 2);  // v2 is (2, 3, 4, 5), v1 unchanged
   */
  static divideScalar(v: Vector4, scalar: number): Vector4 {
    if (scalar === 0) {
      throw new Error('Cannot divide vector by zero');
    }
    return Vector4.multiplyScalar(v, 1 / scalar);
  }

  /**
   * Normalizes this vector to unit length (MUTATING)
   * Makes the vector have length = 1 while preserving its direction.
   * 
   * If the vector is the zero vector (0, 0, 0, 0), it remains unchanged
   * (cannot normalize a zero vector).
   * 
   * @returns This vector (for chaining)
   * 
   * @example
   * const v = new Vector4(3, 4, 0, 0);
   * v.normalize();  // v is now (0.6, 0.8, 0, 0), length = 1
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
   * Similar to GLSL: vec4 normalized = normalize(v);
   * 
   * @param v - The vector to normalize
   * @returns New normalized vector (length = 1)
   * 
   * @example
   * const v1 = new Vector4(3, 4, 0, 0);
   * const v2 = Vector4.normalize(v1);  // v2 is (0.6, 0.8, 0, 0), v1 unchanged
   */
  static normalize(v: Vector4): Vector4 {
    const len = v.length();
    if (len === 0) {
      // Cannot normalize zero vector - return zero vector
      return new Vector4(0, 0, 0, 0);
    }
    return Vector4.divideScalar(v, len);
  }

  /**
   * Creates a new Vector4 with the same values as this vector
   * Non-mutating - returns a new instance.
   * 
   * @returns A new Vector4 with the same values
   * 
   * @example
   * const v1 = new Vector4(1, 2, 3, 4);
   * const v2 = v1.clone();  // v2 is a new vector (1, 2, 3, 4), v1 unchanged
   */
  clone(): Vector4 {
    return new Vector4(this._x, this._y, this._z, this._w);
  }

  /**
   * Copies the values from another vector into this vector (MUTATING)
   * Modifies this vector to have the same values as the source vector.
   * 
   * @param v - The vector to copy from
   * @returns This vector (for chaining)
   * 
   * @example
   * const v1 = new Vector4(1, 2, 3, 4);
   * const v2 = new Vector4(10, 20, 30, 40);
   * v2.copy(v1);  // v2 is now (1, 2, 3, 4), v1 unchanged
   */
  copy(v: Vector4): this {
    this._x = v._x;
    this._y = v._y;
    this._z = v._z;
    this._w = v._w;
    return this;
  }

  /**
   * Checks if this vector equals another vector
   * Compares all four components for exact equality.
   * 
   * Note: Uses strict equality (===). For floating-point comparisons with
   * tolerance, use `equalsEpsilon()` instead.
   * 
   * @param v - The vector to compare with
   * @returns True if all components are equal, false otherwise
   * 
   * @example
   * const v1 = new Vector4(1, 2, 3, 4);
   * const v2 = new Vector4(1, 2, 3, 4);
   * v1.equals(v2);  // Returns true
   */
  equals(v: Vector4): boolean {
    return this._x === v._x && this._y === v._y && this._z === v._z && this._w === v._w;
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
   * const v1 = new Vector4(1.0, 2.0, 3.0, 4.0);
   * const v2 = new Vector4(1.000001, 2.000001, 3.000001, 4.000001);
   * v1.equalsEpsilon(v2, 0.00001);  // Returns true
   */
  equalsEpsilon(v: Vector4, epsilon: number = 0.00001): boolean {
    return Math.abs(this._x - v._x) <= epsilon 
        && Math.abs(this._y - v._y) <= epsilon 
        && Math.abs(this._z - v._z) <= epsilon
        && Math.abs(this._w - v._w) <= epsilon;
  }

  /**
   * Calculates the dot product with another vector
   * 
   * The dot product is a scalar value that represents:
   * - The cosine of the angle between two vectors (when normalized)
   * - How much one vector points in the direction of another
   * - Used extensively in lighting calculations
   * 
   * Formula: a · b = a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w
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
   * const v1 = new Vector4(1, 0, 0, 0);
   * const v2 = new Vector4(0, 1, 0, 0);
   * v1.dot(v2);  // Returns 0 (perpendicular)
   * 
   * @example
   * // In lighting: how much light hits a surface
   * const normal = new Vector4(0, 1, 0, 0).normalize();
   * const lightDir = new Vector4(0.707, 0.707, 0, 0).normalize();
   * const intensity = normal.dot(lightDir);  // cos(angle)
   */
  dot(v: Vector4): number {
    return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w;
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
   * const v1 = new Vector4(1, 2, 3, 4);
   * const v2 = new Vector4(4, 5, 6, 7);
   * Vector4.dot(v1, v2);  // Returns 32 (1*4 + 2*5 + 3*6 + 4*7)
   */
  static dot(a: Vector4, b: Vector4): number {
    return a._x * b._x + a._y * b._y + a._z * b._z + a._w * b._w;
  }

}