import { describe, it, expect } from 'vitest';
import { Matrix4 } from '../../src/math/Matrix4.js';

describe('Matrix4', () => {
  describe('Constructor', () => {
    it('should create identity matrix by default', () => {
      const m = new Matrix4();
      expect(m.get(0, 0)).toBe(1);
      expect(m.get(1, 1)).toBe(1);
      expect(m.get(2, 2)).toBe(1);
      expect(m.get(3, 3)).toBe(1);
      expect(m.get(0, 1)).toBe(0);
    });

    it('should create matrix from row-major input', () => {
      const m = new Matrix4(
        1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, 16
      );
      // Check column-major storage
      expect(m.get(0, 0)).toBe(1);   // row 0, col 0
      expect(m.get(0, 1)).toBe(5);   // row 1, col 0
      expect(m.get(1, 0)).toBe(2);   // row 0, col 1
      expect(m.get(1, 1)).toBe(6);   // row 1, col 1
    });
  });

  describe('Element Access', () => {
    it('should access elements via get(column, row)', () => {
      const m = new Matrix4();
      expect(m.get(0, 0)).toBe(1);
      expect(m.get(3, 3)).toBe(1);
    });

    it('should set elements via set(column, row, value)', () => {
      const m = new Matrix4();
      m.set(0, 0, 5);
      expect(m.get(0, 0)).toBe(5);
    });

    it('should access elements via m[column][row]', () => {
      const m = new Matrix4();
      expect(m[0][0]).toBe(1);
      expect(m[1][1]).toBe(1);
      expect(m[3][3]).toBe(1);
    });

    it('should set elements via m[column][row] = value', () => {
      const m = new Matrix4();
      m[0][0] = 5;
      expect(m[0][0]).toBe(5);
      expect(m.get(0, 0)).toBe(5);
    });

    it('should access elements via elements array', () => {
      const m = new Matrix4();
      expect(m.elements[0]).toBe(1);   // column 0, row 0
      expect(m.elements[5]).toBe(1);     // column 1, row 1
      expect(m.elements[10]).toBe(1);    // column 2, row 2
      expect(m.elements[15]).toBe(1);    // column 3, row 3
    });

    it('should throw error for out-of-bounds indices', () => {
      const m = new Matrix4();
      expect(() => m.get(4, 0)).toThrow();
      expect(() => m.get(0, 4)).toThrow();
      expect(() => m.set(-1, 0, 1)).toThrow();
    });
  });
});
