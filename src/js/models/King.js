import Piece from './Piece';
import * as utils from '../shared/utils';

export default class King extends Piece {
  constructor(square, player) {
    super(square, player);
    this.checked = false;
    this.castlingSquares = [];
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
    this.castlingSquares = [];
    const possibleMoves = super.getPossibleMoves(state, player);
    if (!this.checked && !this.hasMoved) {
      const currentSquare = this.getSquare(state.squares).id;
      const currentLetter = currentSquare.charAt(0);
      const currentDigit = parseInt(currentSquare.charAt(1));

      const longRook = utils.getSquare(`${String.fromCharCode(currentLetter.charCodeAt(0) - 4)}${currentDigit}`, state.squares).piece;
      const shortRook = utils.getSquare(`${String.fromCharCode(currentLetter.charCodeAt(0) + 3)}${currentDigit}`, state.squares).piece;

      if (longRook && !longRook.hasMoved && longRook.player === player) {
        const square1 = utils.getSquare(`${String.fromCharCode(currentLetter.charCodeAt(0) - 1)}${currentDigit}`, state.squares);
        const square2 = utils.getSquare(`${String.fromCharCode(currentLetter.charCodeAt(0) - 2)}${currentDigit}`, state.squares);
        const square3 = utils.getSquare(`${String.fromCharCode(currentLetter.charCodeAt(0) - 3)}${currentDigit}`, state.squares);
        if (!square1.piece && !square2.piece && !square3.piece) {
          const checkSquare1 = utils.checkSquare(state, this, square1.id, player);
          const checkSquare2 = utils.checkSquare(state, this, square2.id, player);
          const checkSquare3 = utils.checkSquare(state, this, square3.id, player);
          if (checkSquare1 && checkSquare2 && checkSquare3) {
            possibleMoves.push(square2.id);
            this.castlingSquares.push([square2.id, longRook]);
          }
        }
      }

      if (shortRook && !shortRook.hasMoved && shortRook.player === player) {
        const square1 = utils.getSquare(`${String.fromCharCode(currentLetter.charCodeAt(0) + 1)}${currentDigit}`, state.squares);
        const square2 = utils.getSquare(`${String.fromCharCode(currentLetter.charCodeAt(0) + 2)}${currentDigit}`, state.squares);
        if (!square1.piece && !square2.piece) {
          const checkSquare1 = utils.checkSquare(state, this, square1.id, player);
          const checkSquare2 = utils.checkSquare(state, this, square2.id, player);
          if (checkSquare1 && checkSquare2) {
            possibleMoves.push(square2.id);
            this.castlingSquares.push([square2.id, shortRook]);
          }
        }
      }
    }
    return possibleMoves;
  }
}
