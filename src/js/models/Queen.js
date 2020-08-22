import Piece from './Piece';
import * as utils from '../utils';

export default class Queen extends Piece {
  constructor(square, player) {
    super(square, player);
  }

  getAttackedSquares(allSquares) {
    const currentSquare = this.getSquare(allSquares).id;
    const currentLetter = currentSquare.charAt(0);
    const currentDigit = parseInt(currentSquare.charAt(1));

    return  [...utils.getAttackingSquaresUp(currentLetter, currentDigit, allSquares), ...utils.getAttackingSquaresUpRight(currentLetter, currentDigit, allSquares), ...utils.getAttackingSquaresRight(currentLetter, currentDigit, allSquares), ...utils.getAttackingSquaresDownRight(currentLetter, currentDigit, allSquares), ...utils.getAttackingSquaresDown(currentLetter, currentDigit, allSquares), ...utils.getAttackingSquaresDownLeft(currentLetter, currentDigit, allSquares), ...utils.getAttackingSquaresLeft(currentLetter, currentDigit, allSquares), ...utils.getAttackingSquaresUpLeft(currentLetter, currentDigit, allSquares)];
  }
}
