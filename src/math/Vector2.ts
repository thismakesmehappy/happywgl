/**
 * Vector2 - A 2D vector class
 * 
 * Vectors in 2D graphics represent:
 * - Points in 2D space (position vectors) - use x, y
 * - Directions (normalized vectors) - use x, y
 * - Colors (RGB values) - use r, g
 * - Texture coordinates - use s, t
 * 
 * This class provides operations for vector math including:
 * - Basic arithmetic (add, subtract, multiply, divide)
 * - Dot product (scalar result)
 * - Cross product (scalar result)
 * - Length/magnitude calculations
 * - Normalization (unit vectors)
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
export class Vector2 {
  /**
   * First component - X (position), R (color), or S (texture)
   */
  private _x: number;

  /**
   * Second component - Y (position), G (color), or T (texture)
   */
  private _y: number;

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
    this._x = x;
    this._y = y;
  }

  // Position component accessors (x, y, z)
  get x(): number { return this._x; }
  set x(value: number) { this._x = value; }
  
  get y(): number { return this._y; }
  set y(value: number) { this._y = value; }

  // Color component accessors (r, g, b)
  get r(): number { return this._x; }
  set r(value: number) { this._x = value; }
  
  get g(): number { return this._y; }
  set g(value: number) { this._y = value; }

  // Texture component accessors (s, t, p)
  get s(): number { return this._x; }
  set s(value: number) { this._x = value; }
  
  get t(): number { return this._y; }
  set t(value: number) { this._y = value; }

  /**
   * Adds another vector to this vector (MUTATING)
   * Modifies this vector in place.
   * 
   * @param v - Vector to add
   * @returns This vector (for chaining)
   * 
   * @example
   * const v1 = new Vector2(1, 2);
   * const v2 = new Vector2(4, 5);
   * v1.add(v2);  // v1 is now (5, 7)
   */
  add(v: Vector2): this {
    this._x += v._x;
    this._y += v._y;
    return this;
  }

  /**
   * Static method: Adds two vectors and returns a new vector
   * Similar to GLSL: vec2 c = a + b;
   * 
   * @param a - First vector
   * @param b - Second vector
   * @returns New vector with the result
   * 
   * @example
   * const v1 = new Vector2(1, 2);
   * const v2 = new Vector2(4, 5);
   * const v3 = Vector2.add(v1, v2);  // Neither v1 nor v2 changed
   */
  static add(a: Vector2, b: Vector2): Vector2 {
    return new Vector2(
      a._x + b._x,
      a._y + b._y,
    );
  }

  /**
   * Calculates the squared length (magnitude) of this vector
   * 
   * This is faster than length() because it avoids the square root operation.
   * Useful when you only need to compare lengths (e.g., distance checks).
   * 
   * Formula: x² + y²
   * 
   * @returns The squared length of the vector
   * 
   * @example
   * const v = new Vector2(3, 4);
   * v.lengthSquared();  // Returns 25 (not 5)
   * 
   * // Compare distances without sqrt:
   * if (v1.lengthSquared() < v2.lengthSquared()) {
   *   // v1 is closer to origin
   * }
   */
  lengthSquared(): number {
    return this._x * this._x + this._y * this._y;
  }

  /**
   * Calculates the length (magnitude) of this vector
   * 
   * The length is the distance from the origin (0, 0) to the point
   * represented by this vector.
   * 
   * Formula: √(x² + y²)
   * 
   * Note: If you only need to compare lengths, use lengthSquared() instead
   * for better performance (avoids square root).
   * 
   * @returns The length of the vector
   * 
   * @example
   * const v = new Vector2(3, 4);
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
   * const v1 = new Vector2(5, 7);
   * const v2 = new Vector2(4, 5);
   * v1.subtract(v2);  // v1 is now (1, 2)
   */
  subtract(v: Vector2): this {
    this._x -= v._x;
    this._y -= v._y;
    return this;
  }

  /**
   * Static method: Subtracts two vectors and returns a new vector
   * Similar to GLSL: vec2 c = a - b;
   * 
   * @param a - First vector (minuend)
   * @param b - Second vector (subtrahend)
   * @returns New vector with the result (a - b)
   * 
   * @example
   * const v1 = new Vector2(5, 7);
   * const v2 = new Vector2(4, 5);
   * const v3 = Vector2.subtract(v1, v2);  // v3 is (1, 2), v1 and v2 unchanged
   */
  static subtract(a: Vector2, b: Vector2): Vector2 {
    return new Vector2(
      a._x - b._x,
      a._y - b._y,
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
   * const v = new Vector2(1, 2);
   * v.multiplyScalar(2);  // v is now (2, 4)
   */
  multiplyScalar(scalar: number): this {
    this._x *= scalar;
    this._y *= scalar;
    return this;
  }

  /**
   * Static method: Multiplies a vector by a scalar and returns a new vector
   * Similar to GLSL: vec2 b = a * scalar;
   * 
   * @param v - The vector to scale
   * @param scalar - The scalar value to multiply by
   * @returns New vector with the result
   * 
   * @example
   * const v1 = new Vector2(1, 2);
   * const v2 = Vector2.multiplyScalar(v1, 2);  // v2 is (2, 4), v1 unchanged
   */
  static multiplyScalar(v: Vector2, scalar: number): Vector2 {
    return new Vector2(
      v._x * scalar,
      v._y * scalar,
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
   * const v = new Vector2(4, 6);
   * v.divideScalar(2);  // v is now (2, 3)
   */
  divideScalar(scalar: number): this {
    if (scalar === 0) {
      throw new Error('Cannot divide vector by zero');
    }
    return this.multiplyScalar(1 / scalar);
  }

  /**
   * Static method: Divides a vector by a scalar and returns a new vector
   * Similar to GLSL: vec2 b = a / scalar;
   * 
   * @param v - The vector to divide
   * @param scalar - The scalar value to divide by
   * @returns New vector with the result
   * @throws Error if scalar is zero
   * 
   * @example
   * const v1 = new Vector2(4, 6);
   * const v2 = Vector2.divideScalar(v1, 2);  // v2 is (2, 3), v1 unchanged
   */
  static divideScalar(v: Vector2, scalar: number): Vector2 {
    if (scalar === 0) {
      throw new Error('Cannot divide vector by zero');
    }
    return Vector2.multiplyScalar(v, 1 / scalar);
  }

  /**
   * Normalizes this vector to unit length (MUTATING)
   * Makes the vector have length = 1 while preserving its direction.
   * 
   * If the vector is the zero vector (0, 0), it remains unchanged
   * (cannot normalize a zero vector).
   * 
   * @returns This vector (for chaining)
   * 
   * @example
   * const v = new Vector2(3, 4);
   * v.normalize();  // v is now (0.6, 0.8), length = 1
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
   * Similar to GLSL: vec2 normalized = normalize(v);
   * 
   * @param v - The vector to normalize
   * @returns New normalized vector (length = 1)
   * 
   * @example
   * const v1 = new Vector2(3, 4);
   * const v2 = Vector2.normalize(v1);  // v2 is (0.6, 0.8), v1 unchanged
   */
  static normalize(v: Vector2): Vector2 {
    const len = v.length();
    if (len === 0) {
      // Cannot normalize zero vector - return zero vector
      return new Vector2(0, 0);
    }
    return Vector2.divideScalar(v, len);
  }

  /**
   * Creates a new Vector2 with the same values as this vector
   * Non-mutating - returns a new instance.
   * 
   * @returns A new Vector2 with the same values
   * 
   * @example
   * const v1 = new Vector2(1, 2);
   * const v2 = v1.clone();  // v2 is a new vector (1, 2), v1 unchanged
   */
  clone(): Vector2 {
    return new Vector2(this._x, this._y);
  }

  /**
   * Copies the values from another vector into this vector (MUTATING)
   * Modifies this vector to have the same values as the source vector.
   * 
   * @param v - The vector to copy from
   * @returns This vector (for chaining)
   * 
   * @example
   * const v1 = new Vector2(1, 2);
   * const v2 = new Vector2(10, 20);
   * v2.copy(v1);  // v2 is now (1, 2), v1 unchanged
   */
  copy(v: Vector2): this {
    this._x = v._x;
    this._y = v._y;
    return this;
  }

  /**
   * Checks if this vector equals another vector
   * Compares both components for exact equality.
   * 
   * Note: Uses strict equality (===). For floating-point comparisons with
   * tolerance, use `equalsEpsilon()` instead.
   * 
   * @param v - The vector to compare with
   * @returns True if all components are equal, false otherwise
   * 
   * @example
   * const v1 = new Vector2(1, 2);
   * const v2 = new Vector2(1, 2);
   * v1.equals(v2);  // Returns true
   */
  equals(v: Vector2): boolean {
    return this._x === v._x && this._y === v._y;
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
   * const v1 = new Vector2(1.0, 2.0);
   * const v2 = new Vector2(1.000001, 2.000001);
   * v1.equalsEpsilon(v2, 0.00001);  // Returns true
   */
  equalsEpsilon(v: Vector2, epsilon: number = 0.00001): boolean {
    return Math.abs(this._x - v._x) <= epsilon 
        && Math.abs(this._y - v._y) <= epsilon;
  }

  /**
   * Calculates the dot product with another vector
   * 
   * The dot product is a scalar value that represents:
   * - The cosine of the angle between two vectors (when normalized)
   * - How much one vector points in the direction of another
   * - Used extensively in lighting calculations
   * 
   * Formula: a · b = a.x * b.x + a.y * b.y
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
   * const v1 = new Vector2(1, 0);
   * const v2 = new Vector2(0, 1);
   * v1.dot(v2);  // Returns 0 (perpendicular)
   * 
   * @example
   * // In lighting: how much light hits a surface
   * const normal = new Vector2(0, 1).normalize();
   * const lightDir = new Vector2(0.707, 0.707).normalize();
   * const intensity = normal.dot(lightDir);  // cos(angle)
   */
  dot(v: Vector2): number {
    return this._x * v._x + this._y * v._y;
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
   * const v1 = new Vector2(1, 2);
   * const v2 = new Vector2(4, 5);
   * Vector2.dot(v1, v2);  // Returns 32 (1*4 + 2*5)
   */
  static dot(a: Vector2, b: Vector2): number {
    return a._x * b._x + a._y * b._y;
  }

  /**
   * Static method: Calculates the cross product of two vectors
   * 
   * @param a - First vector
   * @param b - Second vector
   * @returns New scalar value containing the cross product result
   * 
   * @example
   * const v1 = new Vector2(1, 0);
   * const v2 = new Vector2(0, 1);
   * const v3 = Vector2.cross(v1, v2);  // v3 is 1, v1 and v2 unchanged
   */
  static cross(a: Vector2, b: Vector2): number {
    return a._x * b._y - a._y * b._x;
  }
}
