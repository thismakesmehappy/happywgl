import { SquareMatrix } from '../../../src/math/SquareMatrix';
import { Matrix } from '../../../src/math/Matrix';

export function createSquareMatrix(
  dimension: number): new (...args: number[]) => SquareMatrix {
  class MatrixA extends SquareMatrix {
    get columns(): number { return dimension; }
    get rows(): number { return dimension; }

    constructor(...elements: number[]) {
      if (elements.length === 0) {
        elements = new Array(dimension * dimension).fill(0);
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

    // Square: transpose is itself
    MatrixA.TransposeType = MatrixA;


  return MatrixA;
}
