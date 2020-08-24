import Piece from './Piece';
import * as utils from '../utils';

export default class Queen extends Piece {
  constructor(player) {
    super(player);
  }

  getAttackedSquares(allSquares) {
    const currentSquare = this.getSquare(allSquares).id;
    const currentLetter = currentSquare.charAt(0);
    const currentDigit = parseInt(currentSquare.charAt(1));

    const attackedSquares = [];
    attackedSquares.push(...utils.getAttackingSquaresUp(currentLetter, currentDigit, allSquares));
    attackedSquares.push(...utils.getAttackingSquaresUpRight(currentLetter, currentDigit, allSquares));
    attackedSquares.push(...utils.getAttackingSquaresRight(currentLetter, currentDigit, allSquares));
    attackedSquares.push(...utils.getAttackingSquaresDownRight(currentLetter, currentDigit, allSquares));
    attackedSquares.push(...utils.getAttackingSquaresDown(currentLetter, currentDigit, allSquares));
    attackedSquares.push(...utils.getAttackingSquaresDownLeft(currentLetter, currentDigit, allSquares));
    attackedSquares.push(...utils.getAttackingSquaresLeft(currentLetter, currentDigit, allSquares));
    attackedSquares.push(...utils.getAttackingSquaresUpLeft(currentLetter, currentDigit, allSquares));

    return attackedSquares;
  }
}
