import * as utils from '../utils';

export default class Piece {
  constructor(player) {
    this.player = player;
    this.hasMoved = false;
    this.movesVisible = false;
  }

  getSquare(allSquares) {
    return allSquares.find((el) => el.piece === this);
  }

  getPossibleMoves(state) {
    const attackedSquares = this.getAttackedSquares(state.squares);
    const possibleMoves = attackedSquares.filter((el) => {
      const square = utils.getSquare(el, state.squares);
      return (!square.piece || square.piece.player !== state.player);
    });
    return possibleMoves;
  }
}
