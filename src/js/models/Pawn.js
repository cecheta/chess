import Piece from './Piece';

export default class Pawn extends Piece {
  constructor(square, player) {
    super(square, player);
  }

  possibleMoves(square) {
    const possibleSquares = [];
    const letter = square.charAt(0);
    const digit = parseInt(square.charAt(1));

    if (digit <= 7) {
      possibleSquares.push(`${letter}${digit + 1}`);
    }

    if (!this.hasMoved && digit <= 6) {
      possibleSquares.push(`${letter}${digit + 2}`);
    }

    return possibleSquares;
  }
}
