export default class Square {
  constructor(id, piece) {
    this.id = id;
    this.piece = piece;
  }

  getPiece() {
    return this.piece;
  }
}
