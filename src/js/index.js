import '../css/styles.css';
import Pawn from './models/Pawn';
import Rook from './models/Rook';
import Knight from './models/Knight';
import Bishop from './models/Bishop';
import Queen from './models/Queen';
import King from './models/King';
import Square from './models/Square';
import * as boardView from './views/boardView';

const state = {
  pieces: [],
  squares: [],
  player: 1,
};

function init() {
  const newPieces = [];
  [1, 2].forEach((player) => {
    newPieces.push(new Rook(player));
    newPieces.push(new Knight(player));
    newPieces.push(new Bishop(player));
    newPieces.push(new Queen(player));
    newPieces.push(new King(player));
    newPieces.push(new Bishop(player));
    newPieces.push(new Knight(player));
    newPieces.push(new Rook(player));
    newPieces.push(new Pawn(player));
    newPieces.push(new Pawn(player));
    newPieces.push(new Pawn(player));
    newPieces.push(new Pawn(player));
    newPieces.push(new Pawn(player));
    newPieces.push(new Pawn(player));
    newPieces.push(new Pawn(player));
    newPieces.push(new Pawn(player));
  });

  const iterator = newPieces[Symbol.iterator]();

  for (let i = 65; i <= 72; i++) {
    const id = String.fromCharCode(i) + '1';
    const piece = iterator.next().value;
    state.pieces.push(piece);
    state.squares.push(new Square(id, piece));
  }

  for (let i = 65; i <= 72; i++) {
    const id = String.fromCharCode(i) + '2';
    const piece = iterator.next().value;
    state.pieces.push(piece);
    state.squares.push(new Square(id, piece));
  }

  for (let j = 3; j <= 6; j++) {
    for (let i = 65; i <= 72; i++) {
      const id = String.fromCharCode(i) + j;
      state.squares.push(new Square(id, null));
    }
  }

  for (let i = 65; i <= 72; i++) {
    const id = String.fromCharCode(i) + '8';
    const piece = iterator.next().value;
    state.pieces.push(piece);
    state.squares.push(new Square(id, piece));
  }

  for (let i = 65; i <= 72; i++) {
    const id = String.fromCharCode(i) + '7';
    const piece = iterator.next().value;
    state.pieces.push(piece);
    state.squares.push(new Square(id, piece));
  }

  const pieces = Array.from(document.querySelectorAll('.piece'));
  const squares = Array.from(document.querySelectorAll('.square'));
  const width = document.querySelector('.square').getBoundingClientRect().width;
  pieces.forEach((piece) => {
    piece.style.width = `${width}px`;
  });

  pieces.forEach((piece) => {
    piece.addEventListener('dragstart', handleDragStart);
  });

  squares.forEach((square) => {
    square.addEventListener('drop', handleDrop);
    square.addEventListener('dragover', handleDragOver);
    square.addEventListener('click', renderPossibleSquares);
  });
}

function renderPossibleSquares(e) {
  const id = e.currentTarget.id;
  const square = getSquare(id);
  if (!square.piece.movesVisible) {
    const possibleSquares = square.piece.possibleMoves(id);
    boardView.renderPossible(possibleSquares);
  } else {
    boardView.removePossible();
  }
  square.piece.movesVisible = !square.piece.movesVisible;
}

function handleDragStart(e) {
  e.dataTransfer.setData('text', e.target.parentElement.id);
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  return false;
}

function handleDrop(e) {
  const id = e.dataTransfer.getData('text');
  const squareElement = e.currentTarget;
  const oldSquare = getSquare(id);
  const newSquare = getSquare(e.currentTarget.id);

  if (oldSquare !== newSquare) {
    if (newSquare.piece) {
      boardView.removePiece(squareElement);
      const pieceIndex = state.pieces.indexOf(newSquare.piece);
      state.pieces.splice(pieceIndex, 1);
    }

    newSquare.piece = oldSquare.piece;
    oldSquare.piece = null;
    newSquare.piece.hasMoved = true;
    boardView.movePiece(id, squareElement);
  }
}

function getSquare(square) {
  return state.squares.find((el) => el.id === square);
}

init();

window.state = state;
