import Piece from './Piece';
import * as utils from '../utils';

export default class Bishop extends Piece {
  constructor(square, player) {
    super(square, player);
  }

  getAttackedSquares(allSquares) {
    const currentSquare = this.getSquare(allSquares).id;
    const currentLetter = currentSquare.charAt(0);
    const currentDigit = parseInt(currentSquare.charAt(1));

    return  [...utils.getAttackingSquaresUpRight(currentLetter, currentDigit, allSquares), ...utils.getAttackingSquaresDownRight(currentLetter, currentDigit, allSquares),...utils.getAttackingSquaresDownLeft(currentLetter, currentDigit, allSquares),...utils.getAttackingSquaresUpLeft(currentLetter, currentDigit, allSquares)];
  }
}
