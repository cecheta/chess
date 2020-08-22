import '../css/styles.css';
import Pawn from './models/Pawn';
import Rook from './models/Rook';
import Knight from './models/Knight';
import Bishop from './models/Bishop';
import Queen from './models/Queen';
import King from './models/King';
import Square from './models/Square';
import * as utils from './utils';
import * as boardView from './views/boardView';

const state = {
  pieces: [],
  squares: [],
  currentPiece: null,
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
    square.addEventListener('click', handleClick);
  });
}

function handleClick(e) {
  const squareElement = e.target.closest('.square');
  const square = utils.getSquare(squareElement.id, state.squares);

  if (squareElement.querySelector('.possible')) {
    const oldSquare = state.currentPiece.getSquare(state.squares);
    movePiece(oldSquare, square);
  } else if (square.piece && square.piece.player === state.player) {
    const id = squareElement.id;

    if (!square.piece.movesVisible) {
      removePossible();
      let possibleSquares = square.piece.possibleMoves(id, state);
      possibleSquares = possibleSquares.filter((el) => utils.checkSquare(state, square.piece, el));
      boardView.renderPossible(possibleSquares);
      square.piece.movesVisible = true;
      state.currentPiece = square.piece;
    } else {
      removePossible();
    }
  }

}

function handleDragStart(e) {
  const squareElement = e.target.closest('.square');
  const square = utils.getSquare(squareElement.id, state.squares);

  if (square.piece.player === state.player) {
    e.dataTransfer.setData('text', e.target.parentElement.id);
    removePossible();
    const id = squareElement.id;
    let possibleSquares = square.piece.possibleMoves(id, state);
    possibleSquares = possibleSquares.filter((el) => utils.checkSquare(state, square.piece, el));
    boardView.renderPossible(possibleSquares);
  } else {
    e.preventDefault();
  }
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  return false;
}

function handleDrop(e) {
  const squareElement = e.target.closest('.square');

  if (squareElement.querySelector('.possible')) {
    const oldSquare = utils.getSquare(e.dataTransfer.getData('text'), state.squares);
    const newSquare = utils.getSquare(e.currentTarget.id, state.squares);

    movePiece(oldSquare, newSquare);
  }
}

function removePossible() {
  boardView.removePossible();
  state.pieces.forEach((piece) => {
    piece.movesVisible = false;
  });
  state.currentPiece = null;
}

function movePiece(oldSquare, newSquare) {
  if (oldSquare !== newSquare) {
    const squareElement = document.querySelector(`#${newSquare.id}`);

    if (newSquare.piece) {
      boardView.removePiece(squareElement);
      const pieceIndex = state.pieces.indexOf(newSquare.piece);
      state.pieces.splice(pieceIndex, 1);
    }

    newSquare.piece = oldSquare.piece;
    oldSquare.piece = null;
    newSquare.piece.hasMoved = true;
    boardView.movePiece(oldSquare.id, squareElement);
    state.player = 3 - state.player;
    removePossible();
  }
}

init();

// For testing
window.state = state;
