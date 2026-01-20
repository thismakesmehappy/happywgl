/**
 * Vector Test Suite
 * 
 * Tests for the abstract Vector base class.
 * Since Vector is abstract, we test its functionality through concrete subclasses
 * (Vector2, Vector3, Vector4). This ensures the base class methods work correctly
 * regardless of dimension.
 * 
 * Tests cover:
 * - Base class arithmetic operations (inherited by all vector types)
 * - Base class utility methods (clone, copy, equals)
 * - Size validation (ensuring operations require same-size vectors)
 * - Static methods that work with any vector type
 */

import { describe, it, expect } from 'vitest';
import { Vector } from '../../src/math/Vector.js';
import { EPSILON } from '../helpers/const.js';
import { Vector2 } from '../../src/math/Vector2.js';
import { Vector3 } from '../../src/math/Vector3.js';
import { Vector4 } from '../../src/math/Vector4.js';

class TestVector extends Vector {
  constructor(...components: number[]) {
    super(...components);
  }
}

describe('Vector (Base Class)', () => {
    describe('Constructor', () => {
        it('should create an empty vector', () => {
            const v = new TestVector();
            expect(v.size).toBe(0);
        });

        it('should create non-empty vector with given components', () => {
            const components = [1, 2, 3];
            const v = new TestVector(...components);
            expect(v.size).toBe(3);
            for (let i = 0; i < components.length; i++) {
                expect(v.get(i)).toBe(components[i]);
            }
        });

        it('should return components as array', () => {
            const components = [1, 2, 3];
            const v = new TestVector(...components);
            expect(v.components).toEqual(components);
        });

        it('should return elements as Float32Array', () => {
            const components = [1, 2, 3];
            const v = new TestVector(...components);
            expect(v.elements).toEqual(new Float32Array(components));
        });

        it('should throw error when accessing component out of bounds when index is greater than size', () => {
            const v = new TestVector(1, 2, 3);
            expect(() => v.get(5)).toThrow('Index out of bounds');
        });

        it('should throw error when accessing component out of bounds when index is negative', () => {
            const v = new TestVector(1, 2, 3);
            expect(() => v.get(-1)).toThrow('Index out of bounds');
        });

        it('should set component value', () => {
            const v = new TestVector(1, 2, 3);
            v.set(0, 4);
            expect(v.get(0)).toBe(4);
        });

});

  describe('Size Validation for arithmetic operations', () => {

    it('should throw error when copying vectors of different sizes', () => {
      const v2 = new TestVector(1, 2);
      const v4 = new TestVector(1, 2, 3, 4);
      
      expect(() => v2.copy(v4 as any)).toThrow('Vectors must have the same size');
    });

    
  });

  describe('Basic Arithmetic - Mutating', () => {
    it('should add vectors correctly', () => {
        const v1 = new TestVector(1, 2);
        const v2 = new TestVector(3, 4);
        const expected = new TestVector(4, 6);
        const result = v1.add(v2);
        expect(result.equals(expected)).toBe(true);
        expect(v1.equals(expected)).toBe(true);
      });
  
      it('should throw error when adding vectors of different sizes', () => {
          const v2 = new TestVector(1, 2);
          const v3 = new TestVector(1, 2, 3);
          
          expect(() => v2.add(v3 as any)).toThrow('Vectors must have the same size');
        });
  
      it('should subtract vectors correctly', () => {
          const v1 = new TestVector(1, 2);
          const v2 = new TestVector(3, 4);
          const expected = new TestVector(-2, -2);
          const result = v1.subtract(v2);
          expect(result.equals(expected)).toBe(true);
          expect(v1.equals(expected)).toBe(true);
        });
  
        it('should throw error when subtracting vectors of different sizes', () => {
          const v2 = new TestVector(1, 2);
          const v3 = new TestVector(1, 2, 3);
          
          expect(() => v2.subtract(v3 as any)).toThrow('Vectors must have the same size');
        });
  
        it('should multiply scalar correctly', () => {
          const v1 = new TestVector(1, 2);
          const expected = new TestVector(2, 4);
          const result = v1.multiplyScalar(2);
          expect(result.equals(expected)).toBe(true);
          expect(v1.equals(expected)).toBe(true);
        });
  
        it('should divide scalar correctly', () => {
          const v1 = new TestVector(2, 4);
          const expected = new TestVector(1, 2);
          const result = v1.divideScalar(2);
          expect(result.equals(expected)).toBe(true);
          expect(v1.equals(expected)).toBe(true);
        });
  
        it('should throw and error when dividing by zero', () => {
          const v1 = new TestVector(2, 4);
          
          expect(() => v1.divideScalar(0)).toThrow('Cannot divide vector by zero');
        });
  });

  describe('Length Operations', () => {
    it('should return the length of the vector correctly', () => {
        const v1 = new TestVector(3, 4);
        const expected = 5;
        const result = v1.length();
        expect(result).toBe(expected);
      });

      it('should return the length squared of the vector correctly', () => {
        const v1 = new TestVector(3, 4);
        const expected = 25;
        const result = v1.lengthSquared();
        expect(result).toBe(expected);
      });

      it('should return zero length for zero vector', () => {
        const v1 = new TestVector(0, 0);
        const expected = 0;
        const result = v1.length();
        expect(result).toBe(expected);
        expect(v1.lengthSquared()).toBe(0);
      });
  });

  describe('Normalization - Static', () => {

    it('should normalize the vector correctly', () => {
        const v1 = new TestVector(3, 4);
        const expected = new TestVector(0.6, 0.8);
        const result = v1.normalize();
        expect(v1.equalsEpsilon(expected, EPSILON)).toBe(true);
        expect(v1.length()).toBeCloseTo(1, EPSILON);
        expect(result.equalsEpsilon(expected, EPSILON)).toBe(true);
      });

      it('should normalize zero vector correctly', () => {
        const v1 = new TestVector(0, 0);
        const result = v1.normalize();
        expect(v1.equals(result)).toBe(true);
        expect(v1.length()).toBe(0);
      });

  });

  describe('Dot Product - Static', () => {
    it('should perfome dot product correctly', () => {
        const v1 = new TestVector(1, 2);
        const v2 = new TestVector(3, 4);
        const expected = 11;
        const result = v1.dot(v2);
        expect(result).toBe(expected);
      });

      it('should throw error when calculating dot product of different sizes', () => {
        const v2 = new TestVector(1, 2);
        const v3 = new TestVector(1, 2, 3);
        
        expect(() => v2.dot(v3)).toThrow('Vectors must have the same size');
      });

      it('should return zero for perpendicular vectors', () => {
        const v1 = new TestVector(1, 0);
        const v2 = new TestVector(0, 1);
        const expected = 0;
        const result = v1.dot(v2);
        expect(result).toBe(expected);
      });
  });

  describe('Utility Methods - Mutating', () => {

      it('should clone the vector correctly', () => {
        const v1 = new TestVector(1, 2);
        const result = v1.clone();
        expect(result.equals(v1)).toBe(true);
        expect(result.components).toEqual(v1.components);
      });

      it('should copy the vector correctly', () => {
        const v1 = new TestVector(1, 2);
        const v2 = new TestVector(0, 0);
        v2.copy(v1);
        expect(v2.equals(v1)).toBe(true);
        expect(v2.components).toEqual(v1.components);
      });

      it('should compare vectors for equality', () => {
        const v1 = new TestVector(1, 2);
        const v2 = new TestVector(1, 2);
        expect(v1.equals(v2)).toBe(true);
        expect(v1.components).toEqual(v2.components);
      });

      it('should return false for unequal vectors of same size', () => {
        const v1 = new TestVector(1, 2);
        const v2 = new TestVector(3, 4);
        expect(v1.equals(v2)).toBe(false);
      });

      it('should return false for unequal vectors of different sizes', () => {
        const v1 = new TestVector(1, 2, 4);
        const v2 = new TestVector(1, 2);
        expect(v1.equals(v2)).toBe(false);
      });

      it('should compare vectors for equality within a tolerance', () => {
        const v1 = new TestVector(1, 2);
        const v2 = new TestVector(1.000001, 2.000001);
        expect(v1.equalsEpsilon(v2, EPSILON)).toBe(true);
      });

      it('should return false for unequal vectors of different sizes within a tolerance', () => {
        const v1 = new TestVector(1, 2, 4);
        const v2 = new TestVector(1, 2);
        expect(v1.equalsEpsilon(v2, EPSILON)).toBe(false);
      });

      it('should return false for unequal vectors of same size within a tolerance', () => {
        const v1 = new TestVector(1, 2);
        const v2 = new TestVector(1.002, 2.002);
        expect(v1.equalsEpsilon(v2, EPSILON)).toBe(false);
      });
  });

  describe('Static Methods ', () => {
    it('should add two vectors correctly', () => {
       const elements1 = [1, 2];
       const elements2 = [3, 4];
      const v1 = new TestVector(...elements1);
      const v2 = new TestVector(...elements2);
      const expected = new TestVector(4, 6);
      const result = Vector.add(v1, v2);
      expect(result.equals(expected)).toBe(true);
      expect(v1.components).toEqual(elements1);
      expect(v2.components).toEqual(elements2);
    });

    it('should subtract two vectors correctly', () => {
      const elements1 = [1, 2];
      const elements2 = [3, 4];
      const v1 = new TestVector(...elements1);
      const v2 = new TestVector(...elements2);
      const expected = new TestVector(-2, -2);
      const result = Vector.subtract(v1, v2);
      expect(result.equals(expected)).toBe(true);
      expect(v1.components).toEqual(elements1);
      expect(v2.components).toEqual(elements2);
    });

    it('should multiply scalar correctly', () => {
      const elements = [1, 2];
      const v = new TestVector(...elements);
      const expected = new TestVector(2, 4);
      const result = Vector.multiplyScalar(v, 2);
      expect(result.equals(expected)).toBe(true);
      expect(v.components).toEqual(elements);
    });

    it('should divide scalar correctly', () => {
      const elements = [2, 4];
      const v = new TestVector(...elements);
      const expected = new TestVector(1, 2);
      const result = Vector.divideScalar(v, 2);
      expect(result.equals(expected)).toBe(true);
    });

    it('should throw error when dividing by zero', () => {
      const elements = [2, 4];
      const v = new TestVector(...elements);
      expect(() => Vector.divideScalar(v, 0)).toThrow('Cannot divide vector by zero');
    });

    it('should normalize the vector correctly', () => {
        const components1 = [3, 4];
        const v1 = new TestVector(3, 4);
        const expected = new TestVector(0.6, 0.8);
        const result = Vector.normalize(v1);
        expect(result.equalsEpsilon(expected, EPSILON)).toBe(true);
        expect(result.length()).toBeCloseTo(1, EPSILON);
        expect(v1.components).toEqual(components1);
      });

      it('should normalize zero vector correctly', () => {
        const v1 = new TestVector(0, 0);
        const result = TestVector.normalize(v1);
        const expected = new TestVector(0, 0);
        expect(result.equals(expected)).toBe(true);
        expect(result.length()).toBe(0);
      });

      it('should compare vectors for equality', () => {
        const v1 = new TestVector(1, 2);
        const v2 = new TestVector(1, 2);
        expect(TestVector.equals(v1, v2)).toBe(true);
      });

      it('should return false for unequal vectors of same size', () => {
        const v1 = new TestVector(1, 2);
        const v2 = new TestVector(3, 4);
        expect(TestVector.equals(v1, v2)).toBe(false);
      });

      it('should return false for unequal vectors of different sizes', () => {
        const v1 = new TestVector(1, 2, 4);
        const v2 = new TestVector(1, 2);
        expect(TestVector.equals(v1, v2)).toBe(false);
      });

      it('should compare vectors for equality within a tolerance', () => {
        const v1 = new TestVector(1, 2);
        const v2 = new TestVector(1.000001, 2.000001);
        expect(TestVector.equalsEpsilon(v1, v2, EPSILON)).toBe(true);
      });

      it('should return false for unequal vectors of different sizes within a tolerance', () => {
        const v1 = new TestVector(1, 2, 4);
        const v2 = new TestVector(1, 2);
        expect(TestVector.equalsEpsilon(v1, v2, EPSILON)).toBe(false);
      });

      it('should return false for unequal vectors of same size within a tolerance', () => {
        const v1 = new TestVector(1, 2);
        const v2 = new TestVector(1.002, 2.002);
        expect(TestVector.equalsEpsilon(v1, v2, EPSILON)).toBe(false);
      });

      it('should perfomr dot product correctly', () => {
        const v1 = new TestVector(1, 2);
        const v2 = new TestVector(3, 4);
        const expected = 11;
        const result = TestVector.dot(v1, v2);
        expect(result).toBe(expected);
      });

      it('should throw error when calculating dot product of different sizes', () => {
        const v2 = new TestVector(1, 2);
        const v3 = new TestVector(1, 2, 3);
        
        expect(() => TestVector.dot(v2, v3)).toThrow('Vectors must have the same size');
      });
  });

  describe('Cross-class compatibility', () => {
    it('should add two vectors correctly (Vector2)', () => {
      const v1 = new TestVector(1, 2);
      const v2 = new Vector2(3, 4);
      const expected = new TestVector(4, 6);
      const result = v1.add(v2);
      expect(result.equals(expected)).toBe(true);
    });

    it('should add two vectors correctly (Vector3)', () => {
        const v1 = new TestVector(1, 2, 3);
        const v2 = new Vector3(4, 5, 6);
        const expected = new TestVector(5, 7, 9);
        const result = v1.add(v2);
        expect(result.equals(expected)).toBe(true);
      });

    it('should add two vectors correctly (Vector4)', () => {
        const v1 = new TestVector(1, 2, 3, 4);
        const v2 = new Vector4(5, 6, 7, 8);
        const expected = new TestVector(6, 8, 10, 12);
        const result = v1.add(v2);
        expect(result.equals(expected)).toBe(true);
      });

      it('should subtract two vectors correctly (Vector2)', () => {
        const v1 = new TestVector(1, 2);
        const v2 = new Vector2(3, 4);
        const expected = new TestVector(-2, -2);
        const result = v1.subtract(v2);
        expect(result.equals(expected)).toBe(true);
      });
      
      it('should subtract two vectors correctly (Vector3)', () => {
        const v1 = new TestVector(1, 2, 3);
        const v2 = new Vector3(4, 5, 6);
        const expected = new TestVector(-3, -3, -3);
        const result = v1.subtract(v2);
        expect(result.equals(expected)).toBe(true);
      });
      
      
      it('should subtract two vectors correctly (Vector4)', () => {
        const v1 = new TestVector(1, 2, 3, 4);
        const v2 = new Vector4(5, 6, 7, 8);
        const expected = new TestVector(-4, -4, -4, -4);
        const result = v1.subtract(v2);
        expect(result.equals(expected)).toBe(true);
      });
      
      it('should fail to add vectors of different sizes (Vector and Vector3)', () => {
        const v1 = new TestVector(1, 2);
        const v2 = new Vector3(4, 5, 6);
        expect(() => v1.add(v2)).toThrow('Vectors must have the same size');
      });

      it('should fail to add vectors of different sizes (Vector2 and Vector3)', () => {
        const v1 = new Vector2(1, 2);
        const v2 = new Vector3(4, 5, 6);
        expect(() => v1.add(v2)).toThrow('Vectors must have the same size');
      });
  });

  describe('lerp()', () => {
    describe('Instance Method', () => {
      it('should interpolate to start vector when t = 0', () => {
        const v1 = new Vector3(0, 0, 0);
        const v2 = new Vector3(10, 20, 30);
        const original = v1.clone();
        v1.lerp(v2, 0);
        expect(v1.equals(original)).toBe(true);
      });

      it('should interpolate to end vector when t = 1', () => {
        const v1 = new Vector3(0, 0, 0);
        const v2 = new Vector3(10, 20, 30);
        v1.lerp(v2, 1);
        expect(v1.equals(v2)).toBe(true);
      });

      it('should interpolate halfway when t = 0.5', () => {
        const v1 = new Vector3(0, 0, 0);
        const v2 = new Vector3(10, 20, 30);
        v1.lerp(v2, 0.5);
        expect(v1.x).toBe(5);
        expect(v1.y).toBe(10);
        expect(v1.z).toBe(15);
      });

      it('should work with Vector2', () => {
        const v1 = new Vector2(0, 0);
        const v2 = new Vector2(10, 20);
        v1.lerp(v2, 0.5);
        expect(v1.x).toBe(5);
        expect(v1.y).toBe(10);
      });

      it('should work with Vector4', () => {
        const v1 = new Vector4(0, 0, 0, 0);
        const v2 = new Vector4(10, 20, 30, 40);
        v1.lerp(v2, 0.25);
        expect(v1.x).toBeCloseTo(2.5);
        expect(v1.y).toBeCloseTo(5);
        expect(v1.z).toBeCloseTo(7.5);
        expect(v1.w).toBeCloseTo(10);
      });

      it('should allow t outside [0, 1] range (extrapolation)', () => {
        const v1 = new Vector3(0, 0, 0);
        const v2 = new Vector3(10, 20, 30);
        v1.lerp(v2, 2);
        // When t = 2: result = (1-2)*v1 + 2*v2 = -v1 + 2*v2 = 2*v2 = (20, 40, 60)
        expect(v1.x).toBe(20);
        expect(v1.y).toBe(40);
        expect(v1.z).toBe(60);
      });

      it('should return this for chaining', () => {
        const v1 = new Vector3(0, 0, 0);
        const v2 = new Vector3(10, 20, 30);
        const result = v1.lerp(v2, 0.5);
        expect(result).toBe(v1);
      });

      it('should throw error for different-sized vectors', () => {
        const v1 = new Vector2(1, 2);
        const v2 = new Vector3(4, 5, 6);
        expect(() => v1.lerp(v2, 0.5)).toThrow('Vectors must have the same size');
      });
    });

    describe('Static Method', () => {
      it('should interpolate to start vector when t = 0', () => {
        const v1 = new Vector3(0, 0, 0);
        const v2 = new Vector3(10, 20, 30);
        const result = Vector.lerp(v1, v2, 0);
        expect(result.equals(v1)).toBe(true);
        expect(result).not.toBe(v1);
      });

      it('should interpolate to end vector when t = 1', () => {
        const v1 = new Vector3(0, 0, 0);
        const v2 = new Vector3(10, 20, 30);
        const result = Vector.lerp(v1, v2, 1);
        expect(result.equals(v2)).toBe(true);
        expect(result).not.toBe(v2);
      });

      it('should interpolate halfway when t = 0.5', () => {
        const v1 = new Vector3(0, 0, 0);
        const v2 = new Vector3(10, 20, 30);
        const result = Vector.lerp(v1, v2, 0.5);
        expect(result.x).toBe(5);
        expect(result.y).toBe(10);
        expect(result.z).toBe(15);
        expect(v1.x).toBe(0);
        expect(v2.x).toBe(10);
      });

      it('should preserve type (Vector2)', () => {
        const v1 = new Vector2(0, 0);
        const v2 = new Vector2(10, 20);
        const result = Vector.lerp(v1, v2, 0.5);
        expect(result).toBeInstanceOf(Vector2);
        expect(result.x).toBe(5);
        expect(result.y).toBe(10);
      });

      it('should preserve type (Vector3)', () => {
        const v1 = new Vector3(0, 0, 0);
        const v2 = new Vector3(10, 20, 30);
        const result = Vector.lerp(v1, v2, 0.5);
        expect(result).toBeInstanceOf(Vector3);
      });

      it('should preserve type (Vector4)', () => {
        const v1 = new Vector4(0, 0, 0, 0);
        const v2 = new Vector4(10, 20, 30, 40);
        const result = Vector.lerp(v1, v2, 0.25);
        expect(result).toBeInstanceOf(Vector4);
        expect(result.x).toBeCloseTo(2.5);
      });

      it('should allow t outside [0, 1] range', () => {
        const v1 = new Vector3(0, 0, 0);
        const v2 = new Vector3(10, 20, 30);
        const result = Vector.lerp(v1, v2, 2);
        // When t = 2: result = (1-2)*v1 + 2*v2 = -v1 + 2*v2 = 2*v2 = (20, 40, 60)
        expect(result.x).toBe(20);
        expect(result.y).toBe(40);
        expect(result.z).toBe(60);
      });

      it('should not mutate input vectors', () => {
        const v1 = new Vector3(0, 0, 0);
        const v2 = new Vector3(10, 20, 30);
        const original1 = v1.clone();
        const original2 = v2.clone();
        Vector.lerp(v1, v2, 0.5);
        expect(v1.equals(original1)).toBe(true);
        expect(v2.equals(original2)).toBe(true);
      });

      it('should throw error for different-sized vectors', () => {
        const v1 = new Vector2(1, 2);
        const v2 = new Vector3(4, 5, 6);
        expect(() => Vector.lerp(v1, v2, 0.5)).toThrow('Vectors must have the same size');
      });

      it('should handle negative t values', () => {
        const v1 = new Vector3(0, 0, 0);
        const v2 = new Vector3(10, 20, 30);
        const result = Vector.lerp(v1, v2, -1);
        // When t = -1: result = (1-(-1))*v1 + (-1)*v2 = 2*v1 - v2 = -v2 = (-10, -20, -30)
        expect(result.x).toBe(-10);
        expect(result.y).toBe(-20);
        expect(result.z).toBe(-30);
      });
    });
  });
});
