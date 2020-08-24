import Piece from './Piece';
import * as utils from '../utils';

export default class Pawn extends Piece {
  constructor(player) {
    super(player);
  }

  getAttackedSquares(allSquares) {
    const currentSquare = this.getSquare(allSquares).id;
    const currentLetter = currentSquare.charAt(0);
    const currentDigit = parseInt(currentSquare.charAt(1));

    const attackedSquares = [];
    if (this.player === 1) {
      attackedSquares.push(`${String.fromCharCode(currentLetter.charCodeAt(0) + 1)}${currentDigit + 1}`);
      attackedSquares.push(`${String.fromCharCode(currentLetter.charCodeAt(0) - 1)}${currentDigit + 1}`);
    } else {
      attackedSquares.push(`${String.fromCharCode(currentLetter.charCodeAt(0) + 1)}${currentDigit - 1}`);
      attackedSquares.push(`${String.fromCharCode(currentLetter.charCodeAt(0) - 1)}${currentDigit - 1}`);
    }
    return attackedSquares.filter((id) => !!utils.getSquare(id, allSquares));
  }

  getPossibleMoves(state, player) {
    let possibleMoves = super.getPossibleMoves(state, player);
    possibleMoves = possibleMoves.filter((id) => {
      const square = state.squares.find((el) => el.id === id);
      return (square.piece && square.piece.player !== player);
    });

    const currentSquare = this.getSquare(state.squares).id;
    const currentLetter = currentSquare.charAt(0);
    const currentDigit = parseInt(currentSquare.charAt(1));
    const verticalSquares = [];

    if (player === 1) {
      verticalSquares.push(`${currentLetter}${currentDigit + 1}`);
      verticalSquares.push(`${currentLetter}${currentDigit + 2}`);
    } else {
      verticalSquares.push(`${currentLetter}${currentDigit - 1}`);
      verticalSquares.push(`${currentLetter}${currentDigit - 2}`);
    }

    const firstSquare = state.squares.find((el) => el.id === verticalSquares[0]);
    if (firstSquare && !firstSquare.piece) {
      possibleMoves.push(verticalSquares[0]);

      const secondSquare = state.squares.find((el) => el.id === verticalSquares[1]);
      if (secondSquare && !secondSquare.piece && !this.hasMoved) {
        possibleMoves.push(verticalSquares[1]);
      }
    }

    return possibleMoves;
  }
}
