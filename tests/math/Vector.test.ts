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
import { Vector2 } from '../../src/math/Vector2.js';
import { Vector3 } from '../../src/math/Vector3.js';
import { Vector4 } from '../../src/math/Vector4.js';
import { EPSILON } from '../helpers/const.js';

describe('Vector (Base Class)', () => {
  describe('Size Validation', () => {
    it('should throw error when adding vectors of different sizes', () => {
      const v2 = new Vector2(1, 2);
      const v3 = new Vector3(1, 2, 3);
      
      expect(() => v2.add(v3 as any)).toThrow('Vectors must have the same size');
    });

    it('should throw error when copying vectors of different sizes', () => {
      const v2 = new Vector2(1, 2);
      const v4 = new Vector4(1, 2, 3, 4);
      
      expect(() => v2.copy(v4 as any)).toThrow('Vectors must have the same size');
    });

    it('should throw error when calculating dot product of different sizes', () => {
      const v2 = new Vector2(1, 2);
      const v3 = new Vector3(1, 2, 3);
      
      expect(() => v2.dot(v3 as any)).toThrow('Vectors must have the same size');
    });

    it('should allow operations between vectors of same size', () => {
      const v2a = new Vector2(1, 2);
      const v2b = new Vector2(3, 4);
      
      v2a.add(v2b);
      expect(v2a.x).toBe(4);
      expect(v2a.y).toBe(6);
    });
  });

  describe('Static Methods - Cross-Type Compatibility', () => {
    it('should work with Vector2 instances', () => {
      const v1 = new Vector2(1, 2);
      const v2 = new Vector2(3, 4);
      const result = Vector.add(v1, v2);
      
      expect(result).toBeInstanceOf(Vector2);
      expect(result.x).toBe(4);
      expect(result.y).toBe(6);
    });

    it('should work with Vector3 instances', () => {
      const v1 = new Vector3(1, 2, 3);
      const v2 = new Vector3(4, 5, 6);
      const result = Vector.add(v1, v2);
      
      expect(result).toBeInstanceOf(Vector3);
      expect(result.x).toBe(5);
      expect(result.y).toBe(7);
      expect(result.z).toBe(9);
    });

    it('should work with Vector4 instances', () => {
      const v1 = new Vector4(1, 2, 3, 4);
      const v2 = new Vector4(5, 6, 7, 8);
      const result = Vector.add(v1, v2);
      
      expect(result).toBeInstanceOf(Vector4);
      expect(result.x).toBe(6);
      expect(result.y).toBe(8);
      expect(result.z).toBe(10);
      expect(result.w).toBe(12);
    });

    it('should preserve type in static multiplyScalar', () => {
      const v2 = new Vector2(1, 2);
      const result = Vector.multiplyScalar(v2, 2);
      
      expect(result).toBeInstanceOf(Vector2);
      expect(result.x).toBe(2);
      expect(result.y).toBe(4);
    });

    it('should preserve type in static normalize', () => {
      const v3 = new Vector3(3, 4, 0);
      const result = Vector.normalize(v3);
      
      expect(result).toBeInstanceOf(Vector3);
      expect(result.length()).toBeCloseTo(1, EPSILON);
    });

    it('should preserve type in static subtract', () => {
      const v2 = new Vector2(5, 7);
      const v2b = new Vector2(4, 5);
      const result = Vector.subtract(v2, v2b);
      
      expect(result).toBeInstanceOf(Vector2);
      expect(result.x).toBe(1);
      expect(result.y).toBe(2);
    });

    it('should preserve type in static divideScalar', () => {
      const v4 = new Vector4(4, 6, 8, 10);
      const result = Vector.divideScalar(v4, 2);
      
      expect(result).toBeInstanceOf(Vector4);
      expect(result.x).toBe(2);
      expect(result.y).toBe(3);
      expect(result.z).toBe(4);
      expect(result.w).toBe(5);
    });

    it('should preserve type when using inherited static methods via subclass', () => {
      const v2a = new Vector2(1, 2);
      const v2b = new Vector2(3, 4);
      // Static methods are inherited, so Vector2.add() should work
      // But we'll use Vector.add() to be explicit and ensure it works
      const result = Vector.add(v2a, v2b);
      
      expect(result).toBeInstanceOf(Vector2);
      expect(result.x).toBe(4);
      expect(result.y).toBe(6);
    });

    it('should preserve type when using Vector static methods with Vector3', () => {
      const v3a = new Vector3(1, 2, 3);
      const v3b = new Vector3(4, 5, 6);
      const result = Vector.subtract(v3a, v3b);
      
      expect(result).toBeInstanceOf(Vector3);
      expect(result.x).toBe(-3);
      expect(result.y).toBe(-3);
      expect(result.z).toBe(-3);
    });
  });

  describe('Inherited Methods - Clone', () => {
    it('should clone Vector2 preserving type', () => {
      const v1 = new Vector2(1, 2);
      const v2 = v1.clone();
      
      expect(v2).toBeInstanceOf(Vector2);
      expect(v2.x).toBe(1);
      expect(v2.y).toBe(2);
      expect(v2).not.toBe(v1);
    });

    it('should clone Vector3 preserving type', () => {
      const v1 = new Vector3(1, 2, 3);
      const v2 = v1.clone();
      
      expect(v2).toBeInstanceOf(Vector3);
      expect(v2.x).toBe(1);
      expect(v2.y).toBe(2);
      expect(v2.z).toBe(3);
    });

    it('should clone Vector4 preserving type', () => {
      const v1 = new Vector4(1, 2, 3, 4);
      const v2 = v1.clone();
      
      expect(v2).toBeInstanceOf(Vector4);
      expect(v2.x).toBe(1);
      expect(v2.y).toBe(2);
      expect(v2.z).toBe(3);
      expect(v2.w).toBe(4);
    });
  });

  describe('Inherited Methods - Copy', () => {
    it('should copy Vector2 preserving type', () => {
      const v1 = new Vector2(1, 2);
      const v2 = new Vector2(10, 20);
      const result = v2.copy(v1);
      
      expect(result).toBeInstanceOf(Vector2);
      expect(result).toBe(v2); // Should return same instance
      expect(v2.x).toBe(1);
      expect(v2.y).toBe(2);
      expect(v1.x).toBe(1); // Original unchanged
      expect(v1.y).toBe(2);
    });

    it('should copy Vector3 preserving type', () => {
      const v1 = new Vector3(1, 2, 3);
      const v2 = new Vector3(10, 20, 30);
      const result = v2.copy(v1);
      
      expect(result).toBeInstanceOf(Vector3);
      expect(result).toBe(v2);
      expect(v2.x).toBe(1);
      expect(v2.y).toBe(2);
      expect(v2.z).toBe(3);
    });

    it('should copy Vector4 preserving type', () => {
      const v1 = new Vector4(1, 2, 3, 4);
      const v2 = new Vector4(10, 20, 30, 40);
      const result = v2.copy(v1);
      
      expect(result).toBeInstanceOf(Vector4);
      expect(result).toBe(v2);
      expect(v2.x).toBe(1);
      expect(v2.y).toBe(2);
      expect(v2.z).toBe(3);
      expect(v2.w).toBe(4);
    });
  });

  describe('Inherited Methods - Equals', () => {
    it('should return false for vectors of different sizes', () => {
      const v2 = new Vector2(1, 2);
      const v3 = new Vector3(1, 2, 0);
      
      expect(v2.equals(v3 as any)).toBe(false);
    });

    it('should return true for equal Vector2 instances', () => {
      const v1 = new Vector2(1, 2);
      const v2 = new Vector2(1, 2);
      
      expect(v1.equals(v2)).toBe(true);
    });

    it('should return true for equal Vector3 instances', () => {
      const v1 = new Vector3(1, 2, 3);
      const v2 = new Vector3(1, 2, 3);
      
      expect(v1.equals(v2)).toBe(true);
    });

    it('should return false for equalsEpsilon with different sizes', () => {
      const v2 = new Vector2(1, 2);
      const v3 = new Vector3(1, 2, 0);
      
      expect(v2.equalsEpsilon(v3 as any, 0.1)).toBe(false);
    });

    it('should work correctly with equalsEpsilon for Vector4', () => {
      const v1 = new Vector4(1.0, 2.0, 3.0, 4.0);
      const v2 = new Vector4(1.000001, 2.000001, 3.000001, 4.000001);
      
      expect(v1.equalsEpsilon(v2, 0.00001)).toBe(true);
      expect(v1.equalsEpsilon(v2, 0.0000001)).toBe(false);
    });
  });

  describe('Inherited Methods - Length Operations', () => {
    it('should calculate length correctly for Vector2', () => {
      const v = new Vector2(3, 4);
      expect(v.length()).toBe(5);
      expect(v.lengthSquared()).toBe(25);
    });

    it('should calculate length correctly for Vector3', () => {
      const v = new Vector3(2, 3, 6);
      expect(v.length()).toBe(7);
      expect(v.lengthSquared()).toBe(49);
    });

    it('should calculate length correctly for Vector4', () => {
      const v = new Vector4(3, 4, 0, 0);
      expect(v.length()).toBeCloseTo(5, EPSILON);
      expect(v.lengthSquared()).toBe(25);
    });
  });

  describe('Inherited Methods - Normalization', () => {
    it('should normalize Vector2 correctly', () => {
      const v = new Vector2(3, 4);
      v.normalize();
      
      expect(v.length()).toBeCloseTo(1, EPSILON);
      expect(v.x).toBeCloseTo(0.6, EPSILON);
      expect(v.y).toBeCloseTo(0.8, EPSILON);
    });

    it('should normalize Vector3 correctly', () => {
      const v = new Vector3(2, 0, 0);
      v.normalize();
      
      expect(v.length()).toBeCloseTo(1, EPSILON);
      expect(v.x).toBe(1);
      expect(v.y).toBe(0);
      expect(v.z).toBe(0);
    });

    it('should handle zero vector gracefully', () => {
      const v2 = new Vector2(0, 0);
      v2.normalize();
      expect(v2.length()).toBe(0);
      
      const v3 = new Vector3(0, 0, 0);
      v3.normalize();
      expect(v3.length()).toBe(0);
    });
  });

});
