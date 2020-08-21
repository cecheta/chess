export default class Piece {
  constructor(player) {
    this.player = player;
    this.hasMoved = false;
    this.movesVisible = false;
  }

  getSquare(state) {
    return state.squares.find((el) => el.piece === this);
  }
}
