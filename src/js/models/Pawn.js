import Piece from './Piece';
import * as utils from '../shared/utils';

export default class Pawn extends Piece {
  constructor(player) {
    super(player);
    this.firstMove = false;
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
      return square.piece && square.piece.player !== player;
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

    const firstSquare = utils.getSquare(verticalSquares[0], state.squares);
    if (firstSquare && !firstSquare.piece) {
      possibleMoves.push(verticalSquares[0]);

      const secondSquare = utils.getSquare(verticalSquares[1], state.squares);
      if (secondSquare && !secondSquare.piece && !this.hasMoved) {
        possibleMoves.push(verticalSquares[1]);
      }
    }

    if ((currentDigit === 5 && player === 1) || (currentDigit === 4 && player === 2)) {
      let enPassantSquares = [];
      enPassantSquares.push(`${String.fromCharCode(currentLetter.charCodeAt(0) + 1)}${currentDigit}`);
      enPassantSquares.push(`${String.fromCharCode(currentLetter.charCodeAt(0) - 1)}${currentDigit}`);
      enPassantSquares.forEach((id) => {
        const square = utils.getSquare(id, state.squares);
        if (square && square.piece && square.piece.firstMove) {
          possibleMoves.push(enPassant(player, id));
        }
      });
    }

    return possibleMoves;
  }
}

function enPassant(player, id) {
  if (player === 1) {
    return `${id.charAt(0)}${parseInt(id.charAt(1)) + 1}`;
  } else if (player === 2) {
    return `${id.charAt(0)}${parseInt(id.charAt(1)) - 1}`;
  }
}