import { Matrix } from '../../../src/math/matrices/Matrix.js';

export function createMatrixPair(
  columns: number,
  rows: number): [new (...args: number[]) => Matrix, new (...args: number[]) => Matrix] {
  class MatrixA extends Matrix {
    get columns(): number { return columns; }
    get rows(): number { return rows; }

    constructor(...elements: number[]) {
      if (elements.length === 0) {
        elements = new Array(columns * rows).fill(0);
      }
      super(...elements);
      this._validateSize();
      // Set up Proxy-based indexing
      return this._setupProxy();
    }

    multiplyMatrices(a: Matrix, b: Matrix): this {
      return super.multiplyMatrices(a, b) as this;
    }
  }

  class MatrixB extends Matrix {
    get columns(): number { return rows; } // Swapped
    get rows(): number { return columns; } // Swapped

    constructor(...elements: number[]) {
      if (elements.length === 0) {
        elements = new Array(rows * columns).fill(0);
      }
      super(...elements);
      this._validateSize();
      // Set up Proxy-based indexing
      return this._setupProxy();
    }

    multiplyMatrices(a: Matrix, b: Matrix): this {
      return super.multiplyMatrices(a, b) as this;
    }
  }

  // Set up transpose relationship
  if (columns === rows) {
    // Square: transpose is itself
    MatrixA.TransposeType = MatrixA;
  } else {
    // Non-square: each is transpose of the other
    MatrixA.TransposeType = MatrixB;
    MatrixB.TransposeType = MatrixA;
  }

  return [MatrixA, MatrixB];
}
