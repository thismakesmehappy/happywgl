import { Matrix } from '../../../src/math/Matrix';


// Create a test matrix class for testing generic implementations
export class TestMatrixWithoutZeroElements extends Matrix {
  static readonly TransposeType = TestMatrixWithoutZeroElements;

  constructor(
    private readonly _columns: number,
    private readonly _rows: number,
    ...elements: number[]
  ) {
    super(...elements);
    this._validateSize();
  }

  get rows(): number {
    return this._rows;
  }

  get columns(): number {
    return this._columns;
  }

  multiplyMatrices(a: Matrix, b: Matrix): this {
    return super.multiplyMatrices(a, b) as this;
  }
}
