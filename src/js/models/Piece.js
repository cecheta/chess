export default class Piece {
  constructor(player) {
    this.player = player;
    this.hasMoved = false;
    this.movesVisible = false;
  }

  getSquare(allSquares) {
    return allSquares.find((el) => el.piece === this);
  }
}
