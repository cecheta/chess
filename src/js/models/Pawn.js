import Piece from './Piece';

export default class Pawn extends Piece {
  constructor(square, player) {
    super(square, player);

    this.hasMoved = false;
  }

  possibleMoves(square) {
    const possibleSquares = [];
    const letter = square.charAt(0);
    const digit = parseInt(square.charAt(1));
    possibleSquares.push(`${letter}${digit + 1}`);

    if (!this.hasMoved) {
      possibleSquares.push(`${letter}${digit + 2}`);
    }

    return possibleSquares;
  }
}
