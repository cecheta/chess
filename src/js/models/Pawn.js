import Piece from './Piece';
import * as utils from '../utils';

export default class Pawn extends Piece {
  constructor(square, player) {
    super(square, player);
  }

  getAttackedSquares(allSquares) {
    const currentSquare = this.getSquare(allSquares).id;
    const currentLetter = currentSquare.charAt(0);
    const currentDigit = parseInt(currentSquare.charAt(1));

    let attackedSquares;
    if (this.player === 1) {
      attackedSquares = [`${String.fromCharCode(currentLetter.charCodeAt(0) + 1)}${currentDigit + 1}`, `${String.fromCharCode(currentLetter.charCodeAt(0) - 1)}${currentDigit + 1}`];
    } else {
      attackedSquares = [`${String.fromCharCode(currentLetter.charCodeAt(0) + 1)}${currentDigit - 1}`, `${String.fromCharCode(currentLetter.charCodeAt(0) - 1)}${currentDigit - 1}`];
    }
    return attackedSquares.filter((id) => !!utils.getSquare(id, allSquares));
  }

  possibleMoves(square, state) {
    const currentLetter = square.charAt(0);
    const currentDigit = parseInt(square.charAt(1));
    const possibleSquares = [];
    let verticalSquares, diagonalSquares;

    if (state.player === 1) {
      verticalSquares = [`${currentLetter}${currentDigit + 1}`, `${currentLetter}${currentDigit + 2}`];
      diagonalSquares = [`${String.fromCharCode(currentLetter.charCodeAt(0) + 1)}${currentDigit + 1}`, `${String.fromCharCode(currentLetter.charCodeAt(0) - 1)}${currentDigit + 1}`];
    } else {
      verticalSquares = [`${currentLetter}${currentDigit - 1}`, `${currentLetter}${currentDigit - 2}`];
      diagonalSquares = [`${String.fromCharCode(currentLetter.charCodeAt(0) + 1)}${currentDigit - 1}`, `${String.fromCharCode(currentLetter.charCodeAt(0) - 1)}${currentDigit - 1}`];
    }

    const firstSquare = state.squares.find((el) => el.id === verticalSquares[0]);
    if (firstSquare && !firstSquare.piece) {
      possibleSquares.push(verticalSquares[0]);

      const secondSquare = state.squares.find((el) => el.id === verticalSquares[1]);
      if (secondSquare && !secondSquare.piece && !this.hasMoved) {
        possibleSquares.push(verticalSquares[1]);
      }
    }

    diagonalSquares.forEach((square) => {
      const diagonalSquare = state.squares.find((el) => el.id === square);
      if (diagonalSquare && diagonalSquare.piece && diagonalSquare.piece.player !== state.player) {
        possibleSquares.push(square);
      }
    });

    return possibleSquares;
  }
}
