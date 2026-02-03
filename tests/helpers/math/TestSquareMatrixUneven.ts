import { SquareMatrix } from '../../../src/math/matrices/SquareMatrix.js';

// Create a test matrix class for testing generic implementations
export class TestSquareMatrixUneven extends SquareMatrix {
  constructor(
    private readonly _columns: number,
    private readonly _rows: number
  ) {
    const elements = new Array(_columns * _rows).fill(0);
    super(...elements);
    this._validateSize();
    return this._setupProxy();
  }

  get rows(): number {
    return this._rows;
  }

  get columns(): number {
    return this._columns;
  }
}
