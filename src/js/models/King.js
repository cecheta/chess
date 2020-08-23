import Piece from './Piece';
import * as utils from '../utils';

export default class King extends Piece {
  constructor(square, player) {
    super(square, player);
  }

  getAttackedSquares(allSquares) {
    const currentSquare = this.getSquare(allSquares).id;
    const currentLetter = currentSquare.charAt(0);
    const currentDigit = parseInt(currentSquare.charAt(1));

    const attackedSquares = [];
    attackedSquares.push(`${currentLetter}${currentDigit + 1}`);
    attackedSquares.push(`${String.fromCharCode(currentLetter.charCodeAt(0) + 1)}${currentDigit + 1}`);
    attackedSquares.push(`${String.fromCharCode(currentLetter.charCodeAt(0) + 1)}${currentDigit}`);
    attackedSquares.push(`${String.fromCharCode(currentLetter.charCodeAt(0) + 1)}${currentDigit - 1}`);
    attackedSquares.push(`${currentLetter}${currentDigit - 1}`);
    attackedSquares.push(`${String.fromCharCode(currentLetter.charCodeAt(0) - 1)}${currentDigit - 1}`);
    attackedSquares.push(`${String.fromCharCode(currentLetter.charCodeAt(0) - 1)}${currentDigit}`);
    attackedSquares.push(`${String.fromCharCode(currentLetter.charCodeAt(0) - 1)}${currentDigit + 1}`);

    return attackedSquares.filter((id) => !!utils.getSquare(id, allSquares));
  }

  getPossibleMoves(state, player) {
    return super.getPossibleMoves(state, player);
  }
}
