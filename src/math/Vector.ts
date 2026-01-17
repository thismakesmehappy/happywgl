/**
 * Vector - Abstract base class for N-dimensional vectors
 * 
 * This is the base class for Vector2, Vector3, and Vector4.
 * It provides common vector operations that work for any dimension.
 * 
 * Vectors in graphics represent:
 * - Points in space (position vectors)
 * - Directions (normalized vectors)
 * - Colors (RGB/RGBA values)
 * - Texture coordinates
 * 
 * This class provides operations for vector math including:
 * - Basic arithmetic (add, subtract, multiply, divide)
 * - Dot product (scalar result)
 * - Length/magnitude calculations
 * - Normalization (unit vectors)
 * 
 * Method Patterns:
 * - Instance methods (e.g., v1.add(v2)): Mutate the calling vector
 * - Static methods (e.g., Vector.add(v1, v2)): Return a new vector, don't mutate inputs
 * 
 * This matches common patterns:
 * - Use instance methods when you want to modify in place (performance, chaining)
 * - Use static methods when you want immutability (functional style, like GLSL)
 * 
 * Type Safety:
 * - All operations require vectors of the same size
 * - Attempting operations between different-sized vectors will throw an error
 * - This ensures type safety and prevents dimension mismatches
 */
export abstract class Vector {
  /**
   * Vector components stored as Float32Array for WebGL compatibility and performance
   * Protected so subclasses can access it
   * 
   * Float32Array provides:
   * - Direct compatibility with WebGL buffer uploads
   * - Better performance than regular arrays
   * - Memory efficiency (32-bit floats)
   * - Consistency with Matrix4 implementation
   */
  protected _components: Float32Array;

  /**
   * Creates a new Vector
   * 
   * @param components - The components of the vector (variadic)
   * 
   * @example
   * // In subclasses:
   * const v2 = new Vector2(1, 2);       // (1, 2)
   * const v3 = new Vector3(1, 2, 3);     // (1, 2, 3)
   * const v4 = new Vector4(1, 2, 3, 4); // (1, 2, 3, 4)
   */
  constructor(...components: number[]) {
    this._components = new Float32Array(components);
  }

  get size(): number {
    return this._components.length;
  }

  /**
   * Gets the components as a regular array
   * For compatibility with code that expects number[]
   */
  get components(): number[] {
    return Array.from(this._components);
  }

  /**
   * Gets the components as Float32Array
   * This is the format expected by WebGL buffer uploads
   * Similar to Matrix4.elements
   * 
   * @returns Float32Array of vector components
   * 
   * @example
   * const v = new Vector3(1, 2, 3);
   * gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 0, v.elements);
   */
  get elements(): Float32Array {
    return this._components;
  }

  get(index: number): number | undefined {
    this._validateIndex(index);
    if (index < 0 || index >= this._components.length) {
      throw new Error('Index out of bounds');
    }

    return this._components[index];
  }

  set(index: number, value: number): void {
    this._validateIndex(index);
    this._components[index] = value;
  }

  /**
   * Adds another vector to this vector (MUTATING)
   * Modifies this vector in place.
   * 
   * Requires vectors of the same size for type safety.
   * 
   * @param v - Vector to add (must be same size)
   * @returns This vector (for chaining)
   * @throws Error if vectors are different sizes
   * 
   * @example
   * const v1 = new Vector3(1, 2, 3);
   * const v2 = new Vector3(4, 5, 6);
   * v1.add(v2);  // v1 is now (5, 7, 9)
   */
  add(v: Vector): this {
    this._validateSameSize(this, v);

    for (let i = 0; i < this._components.length; i++) {
      this._components[i] = this._components[i]! + v._components[i]!;
    }
    return this;
  }

  /**
   * Static method: Adds two vectors and returns a new vector
   * Similar to GLSL: vec c = a + b;
   * 
   * Requires vectors of the same size. Returns a new vector of the same type.
   * 
   * @param a - First vector
   * @param b - Second vector (must be same type and size as a)
   * @returns New vector with the result (same type as a)
   * @throws Error if vectors are different sizes
   * 
   * @example
   * const v1 = new Vector3(1, 2, 3);
   * const v2 = new Vector3(4, 5, 6);
   * const v3 = Vector3.add(v1, v2);  // Returns Vector3, neither v1 nor v2 changed
   */
  static add<T extends Vector>(a: T, b: T): T {
    a._validateSameSize(a, b);

    const components = new Float32Array(a._components.length);
    for (let i = 0; i < a._components.length; i++) {
      components[i] = a._components[i]! + b._components[i]!;
    }

    // Return new instance of the same type as 'a'
    return new (a.constructor as new (...args: number[]) => T)(...components);
  }

  /**
   * Calculates the squared length (magnitude) of this vector
   * 
   * This is faster than length() because it avoids the square root operation.
   * Useful when you only need to compare lengths (e.g., distance checks).
   * 
   * Formula: sum of all components squared
   * 
   * @returns The squared length of the vector
   * 
   * @example
   * const v = new Vector3(3, 4, 0);
   * v.lengthSquared();  // Returns 25 (not √(9 + 16 + 0))
   * 
   * // Compare distances without sqrt:
   * if (v1.lengthSquared() < v2.lengthSquared()) {
   *   // v1 is closer to origin
   * }
   */
  lengthSquared(): number {
    return this._components.reduce((sum, component) => sum + component * component, 0);
  }

  /**
   * Calculates the length (magnitude) of this vector
   * 
   * The length is the distance from the origin to the point
   * represented by this vector.
   * 
   * Formula: √(sum of all components squared)
   * 
   * Note: If you only need to compare lengths, use lengthSquared() instead
   * for better performance (avoids square root).
   * 
   * @returns The length of the vector
   * 
   * @example
   * const v = new Vector3(3, 4, 0);
   * v.length();  // Returns 5 (√(9 + 16 + 0))
   */
  length(): number {
    return Math.sqrt(this.lengthSquared());
  }

  /**
   * Subtracts another vector from this vector (MUTATING)
   * Modifies this vector in place.
   * 
   * Requires vectors of the same size for type safety.
   * 
   * @param v - Vector to subtract (must be same size)
   * @returns This vector (for chaining)
   * @throws Error if vectors are different sizes
   * 
   * @example
   * const v1 = new Vector3(5, 7, 9);
   * const v2 = new Vector3(4, 5, 6);
   * v1.subtract(v2);  // v1 is now (1, 2, 3)
   */
  subtract(v: Vector): this {
    this._validateSameSize(this, v);

    for (let i = 0; i < this._components.length; i++) {
      this._components[i] = this._components[i]! - v._components[i]!;
    }
    return this;
  }

  /**
   * Static method: Subtracts two vectors and returns a new vector
   * Similar to GLSL: vec c = a - b;
   * 
   * Requires vectors of the same size. Returns a new vector of the same type.
   * 
   * @param a - First vector (minuend)
   * @param b - Second vector (subtrahend, must be same type and size as a)
   * @returns New vector with the result (a - b, same type as a)
   * @throws Error if vectors are different sizes
   * 
   * @example
   * const v1 = new Vector3(5, 7, 9);
   * const v2 = new Vector3(4, 5, 6);
   * const v3 = Vector3.subtract(v1, v2);  // Returns Vector3, v3 is (1, 2, 3), v1 and v2 unchanged
   */
  static subtract<T extends Vector>(a: T, b: T): T {
    a._validateSameSize(a, b);

    const components = new Float32Array(a._components.length);
    for (let i = 0; i < a._components.length; i++) {
      components[i] = a._components[i]! - b._components[i]!;
    }

    // Return new instance of the same type as 'a'
    return new (a.constructor as new (...args: number[]) => T)(...components);
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
    for (let i = 0; i < this._components.length; i++) {
      this._components[i] = this._components[i]! * scalar;
    }
    return this;
  }

  /**
   * Static method: Multiplies a vector by a scalar and returns a new vector
   * Similar to GLSL: vec b = a * scalar;
   * 
   * @param v - The vector to scale
   * @param scalar - The scalar value to multiply by
   * @returns New vector with the result (same type as v)
   * 
   * @example
   * const v1 = new Vector3(1, 2, 3);
   * const v2 = Vector3.multiplyScalar(v1, 2);  // Returns Vector3, v2 is (2, 4, 6), v1 unchanged
   */
  static multiplyScalar<T extends Vector>(v: T, scalar: number): T {
    const components = new Float32Array(v._components.length);
    for (let i = 0; i < v._components.length; i++) {
      components[i] = v._components[i]! * scalar;
    }
    // Return new instance of the same type as 'v'
    return new (v.constructor as new (...args: number[]) => T)(...components);
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
   * Similar to GLSL: vec b = a / scalar;
   * 
   * @param v - The vector to divide
   * @param scalar - The scalar value to divide by
   * @returns New vector with the result (same type as v)
   * @throws Error if scalar is zero
   * 
   * @example
   * const v1 = new Vector3(4, 6, 8);
   * const v2 = Vector3.divideScalar(v1, 2);  // Returns Vector3, v2 is (2, 3, 4), v1 unchanged
   */
  static divideScalar<T extends Vector>(v: T, scalar: number): T {
    if (scalar === 0) {
      throw new Error('Cannot divide vector by zero');
    }
    return Vector.multiplyScalar(v, 1 / scalar);
  }

  /**
   * Normalizes this vector to unit length (MUTATING)
   * Makes the vector have length = 1 while preserving its direction.
   * 
   * If the vector is the zero vector, it remains unchanged
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
   * Similar to GLSL: vec normalized = normalize(v);
   * 
   * @param v - The vector to normalize
   * @returns New normalized vector (length = 1, same type as v)
   *          If v is zero vector, returns zero vector of same type
   * 
   * @example
   * const v1 = new Vector3(3, 4, 0);
   * const v2 = Vector3.normalize(v1);  // Returns Vector3, v2 is (0.6, 0.8, 0), v1 unchanged
   */
  static normalize<T extends Vector>(v: T): T {
    const len = v.length();
    if (len === 0) {
      // Cannot normalize zero vector - return zero vector of same type
      const zeroComponents = new Float32Array(v.size);
      return new (v.constructor as new (...args: number[]) => T)(...zeroComponents);
    }
    return Vector.divideScalar(v, len);
  }

  /**
   * Creates a new vector with the same values as this vector
   * Non-mutating - returns a new instance of the same type.
   * 
   * @returns A new vector with the same values (same type as this)
   * 
   * @example
   * const v1 = new Vector3(1, 2, 3);
   * const v2 = v1.clone();  // v2 is a new Vector3(1, 2, 3), v1 unchanged
   */
  clone(): this {
    return new (this.constructor as new (...args: number[]) => this)(...this._components);
  }

  /**
   * Copies the values from another vector into this vector (MUTATING)
   * Modifies this vector to have the same values as the source vector.
   * 
   * Requires vectors of the same size.
   * 
   * @param v - The vector to copy from (must be same size as this)
   * @returns This vector (for chaining)
   * @throws Error if vectors are different sizes
   * 
   * @example
   * const v1 = new Vector4(1, 2, 3, 4);
   * const v2 = new Vector4(10, 20, 30, 40);
   * v2.copy(v1);  // v2 is now (1, 2, 3, 4), v1 unchanged
   */
  copy(v: Vector): this {
    this._validateSameSize(this, v);
    this._components.set(v._components);
    return this;
  }

  /**
   * Checks if this vector equals another vector
   * Compares all components for exact equality.
   * 
   * Requires vectors of the same size.
   * 
   * Note: Uses strict equality (===). For floating-point comparisons with
   * tolerance, use `equalsEpsilon()` instead.
   * 
   * @param v - The vector to compare with (must be same size)
   * @returns True if all components are equal, false otherwise
   * 
   * @example
   * const v1 = new Vector3(1, 2, 3);
   * const v2 = new Vector3(1, 2, 3);
   * v1.equals(v2);  // Returns true
   */
  equals(v: Vector): boolean {
    if (!this._areSameSize(this, v)) {
      return false;
    }
    return this._components.every((component, index) => component === v._components[index]);
  }

  /**
   * Checks if this vector equals another vector within a tolerance
   * Useful for floating-point comparisons where exact equality may fail.
   * 
   * Requires vectors of the same size.
   * 
   * @param v - The vector to compare with (must be same size)
   * @param epsilon - Tolerance value (default: 0.00001)
   * @returns True if all components are within epsilon, false otherwise
   * 
   * @example
   * const v1 = new Vector3(1.0, 2.0, 3.0);
   * const v2 = new Vector3(1.000001, 2.000001, 3.000001);
   * v1.equalsEpsilon(v2, 0.00001);  // Returns true
   */
  equalsEpsilon(v: Vector, epsilon: number = 0.00001): boolean {
    if (!this._areSameSize(this, v)) {
      return false;
    }
    return this._components.every((component, index) => Math.abs(component - v._components[index]!) <= epsilon);
  }

  /**
   * Static method: Checks if two vectors are equal
   * Similar to GLSL comparison patterns.
   * 
   * Requires vectors of the same size.
   * 
   * @param a - First vector
   * @param b - Second vector (must be same type and size as a)
   * @returns True if all components are equal, false otherwise
   * 
   * @example
   * const v1 = new Vector3(1, 2, 3);
   * const v2 = new Vector3(1, 2, 3);
   * Vector3.equals(v1, v2);  // Returns true
   */
  static equals<T extends Vector>(a: T, b: T): boolean {
    if (!a._areSameSize(a, b)) {
      return false;
    }
    return a._components.every((component, index) => component === b._components[index]);
  }

  /**
   * Static method: Checks if two vectors are equal within a tolerance
   * Useful for floating-point comparisons where exact equality may fail.
   * 
   * Requires vectors of the same size.
   * 
   * @param a - First vector
   * @param b - Second vector (must be same type and size as a)
   * @param epsilon - Tolerance value (default: 0.00001)
   * @returns True if all components are within epsilon, false otherwise
   * 
   * @example
   * const v1 = new Vector3(1.0, 2.0, 3.0);
   * const v2 = new Vector3(1.000001, 2.000001, 3.000001);
   * Vector3.equalsEpsilon(v1, v2, 0.00001);  // Returns true
   */
  static equalsEpsilon<T extends Vector>(a: T, b: T, epsilon: number = 0.00001): boolean {
    if (!a._areSameSize(a, b)) {
      return false;
    }
    return a._components.every((component, index) => Math.abs(component - b._components[index]!) <= epsilon);
  }

  /**
   * Calculates the dot product with another vector
   * 
   * The dot product is a scalar value that represents:
   * - The cosine of the angle between two vectors (when normalized)
   * - How much one vector points in the direction of another
   * - Used extensively in lighting calculations
   * 
   * Formula: a · b = sum of (a[i] * b[i]) for all components
   * 
   * Properties:
   * - If vectors are perpendicular: dot = 0
   * - If vectors point same direction: dot > 0
   * - If vectors point opposite directions: dot < 0
   * - If both are normalized: dot = cos(angle)
   * 
   * Requires vectors of the same size.
   * 
   * @param v - The vector to calculate dot product with (must be same size)
   * @returns The dot product (scalar value)
   * @throws Error if vectors are different sizes
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
  dot(v: Vector): number {
    this._validateSameSize(this, v);
    return this._components.reduce((sum, component, index) => sum + component * v._components[index]!, 0);
  }

  /**
   * Static method: Calculates the dot product of two vectors
   * Similar to GLSL: float d = dot(a, b);
   * 
   * Requires vectors of the same size.
   * 
   * @param a - First vector
   * @param b - Second vector (must be same type and size as a)
   * @returns The dot product (scalar value)
   * @throws Error if vectors are different sizes
   * 
   * @example
   * const v1 = new Vector3(1, 2, 3);
   * const v2 = new Vector3(4, 5, 6);
   * Vector3.dot(v1, v2);  // Returns 32 (1*4 + 2*5 + 3*6)
   */
  static dot<T extends Vector>(a: T, b: T): number {
    a._validateSameSize(a, b);
    return a._components.reduce((sum, component, index) => sum + component * b._components[index]!, 0);
  }

  private _isWithinBounds(index: number): boolean {
    if (index < 0 || index >= this._components.length) {
      return false;
    }
    return true;
  }

  private _validateIndex(index: number): void {
    if (!this._isWithinBounds(index)) {
      throw new Error(`Index out of bounds for ${this.constructor.name} of size ${this._components.length}`);
    }
  }

  /**
   * Checks if two vectors have the same size
   * Used internally for type safety validation
   */
  protected _areSameSize(a: Vector, b: Vector): boolean {
    return a.size === b.size;
  }

  /**
   * Validates that two vectors have the same size
   * Throws an error if they don't match
   */
  protected _validateSameSize(a: Vector, b: Vector): void {
    if (!this._areSameSize(a, b)) {
      throw new Error(
        `Vectors must have the same size: ${a.constructor.name} (size ${a.size}) and ${b.constructor.name} (size ${b.size})`
      );
    }
  }
}