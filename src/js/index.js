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
};

function init() {
  state.pieces.push(new Rook('A8', 1));
  state.pieces.push(new Knight('B8', 1));
  state.pieces.push(new Bishop('C8', 1));
  state.pieces.push(new Queen('D8', 1));
  state.pieces.push(new King('E8', 1));
  state.pieces.push(new Bishop('F8', 1));
  state.pieces.push(new Knight('G8', 1));
  state.pieces.push(new Rook('H8', 1));
  state.pieces.push(new Pawn('A7', 1));
  state.pieces.push(new Pawn('B7', 1));
  state.pieces.push(new Pawn('C7', 1));
  state.pieces.push(new Pawn('D7', 1));
  state.pieces.push(new Pawn('E7', 1));
  state.pieces.push(new Pawn('F7', 1));
  state.pieces.push(new Pawn('G7', 1));
  state.pieces.push(new Pawn('H7', 1));

  state.pieces.push(new Rook('A1', 2));
  state.pieces.push(new Knight('B1', 2));
  state.pieces.push(new Bishop('C1', 2));
  state.pieces.push(new Queen('D1', 2));
  state.pieces.push(new King('E1', 2));
  state.pieces.push(new Bishop('F1', 2));
  state.pieces.push(new Knight('G1', 2));
  state.pieces.push(new Rook('H1', 2));
  state.pieces.push(new Pawn('A2', 2));
  state.pieces.push(new Pawn('B2', 2));
  state.pieces.push(new Pawn('C2', 2));
  state.pieces.push(new Pawn('D2', 2));
  state.pieces.push(new Pawn('E2', 2));
  state.pieces.push(new Pawn('F2', 2));
  state.pieces.push(new Pawn('G2', 2));
  state.pieces.push(new Pawn('H2', 2));

  state.pieces.forEach((piece) => {
    state.squares.push(new Square(piece.square, piece));
  });

  for (let i = 65; i <= 72; i++) {
    for (let j = 3; j <= 6; j++) {
      const id = String.fromCharCode(i) + j;
      state.squares.push(new Square(id, null));
    }
  }

  const pieces = Array.from(document.querySelectorAll('.piece'));
  const squares = Array.from(document.querySelectorAll('.square'));
  const width = document.querySelector('.square').getBoundingClientRect().width
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
  const possibleSquares = square.piece.possibleMoves(id);
  boardView.renderPossible(possibleSquares);
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
  const piece = document.querySelector(`#${id}`).firstElementChild;
  e.currentTarget.appendChild(piece);
}

function getSquare(square) {
  return state.squares.find((el) => el.id === square);
}

init();
