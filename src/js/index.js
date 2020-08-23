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
  playing: false,
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

  document.body.addEventListener('mousedown', preventDrag);

  state.playing = true;
}

function handleClick(e) {
  const squareElement = e.target.closest('.square');
  const square = utils.getSquare(squareElement.id, state.squares);

  if (squareElement.querySelector('.possible')) {
    const oldSquare = state.currentPiece.getSquare(state.squares);
    movePiece(oldSquare, square);
  } else if (square.piece && square.piece.player === state.player) {
    if (!square.piece.movesVisible) {
      removePossible();
      let possibleSquares = square.piece.getPossibleMoves(state, state.player);
      possibleSquares = possibleSquares.filter((el) => utils.checkSquare(state, square.piece, el, state.player));
      boardView.renderPossible(possibleSquares);
      square.piece.movesVisible = true;
      state.currentPiece = square.piece;
    } else {
      removePossible();
    }
  }
}

function handleDragStart(e) {
  // If piece has no moves, should not be draggable
  const squareElement = e.target.closest('.square');
  const square = utils.getSquare(squareElement.id, state.squares);

  if (square.piece.player === state.player) {
    e.dataTransfer.setData('text', e.target.parentElement.id);
    removePossible();
    let possibleSquares = square.piece.getPossibleMoves(state, state.player);
    possibleSquares = possibleSquares.filter((el) => utils.checkSquare(state, square.piece, el, state.player));
    boardView.renderPossible(possibleSquares);
    square.piece.movesVisible = true;
    state.currentPiece = square.piece;
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

function preventDrag(e) {
  if (e.preventDefault && e.target.tagName.toLowerCase() !== 'img') {
    e.preventDefault();
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

    if (newSquare.piece) {
      boardView.removePiece(newSquare);
      const pieceIndex = state.pieces.indexOf(newSquare.piece);
      state.pieces.splice(pieceIndex, 1);
    }

    newSquare.piece = oldSquare.piece;
    oldSquare.piece = null;
    newSquare.piece.hasMoved = true;
    boardView.movePiece(oldSquare.id, newSquare.id);

    if (newSquare.piece.constructor.name === 'King' && newSquare.piece.castlingSquares.find((square) => square[0] === newSquare.id)) {
      const rook = newSquare.piece.castlingSquares.find((square) => square[0] === newSquare.id)[1];
      const rookSquareId = rook.getSquare(state.squares).id;
      let square;
      if (rookSquareId.charAt(0) === 'A') {
        square = utils.getSquare('D' + rookSquareId.charAt(1), state.squares);
      } else if  (rookSquareId.charAt(0) === 'H') {
        square = utils.getSquare('F' + rookSquareId.charAt(1), state.squares);
      }
      const oldSquare = utils.getSquare(rookSquareId, state.squares);
      square.piece = rook;
      oldSquare.piece = null;
      rook.hasMoved = true;
      boardView.movePiece(rookSquareId, square.id);
    }

    state.pieces.filter((piece) => piece.constructor.name === 'King').forEach((king) => king.checked = false);
    const attackedSquares = utils.getAllAttackedSquares(state, state.player);
    for (let square of attackedSquares) {
      const piece = utils.getSquare(square, state.squares).piece;
      if (piece && piece.constructor.name === 'King' && piece.player !== state.player) {
        if (utils.getAllPossibleMoves(state, 3 - state.player).length === 0) {
          alert('Checkmate!');
          state.playing = false;
        } else {
          console.log('Check!');
          const king = state.pieces.find((piece) => piece.constructor.name === 'King' && piece.player === 3 - state.player);
          king.checked = true;
        }
        break;
      }
    }

    if (state.playing){
      state.player = 3 - state.player;
      if (utils.getAllPossibleMoves(state, state.player).length === 0) {
        alert('Stalemate');
        state.playing = false;
      }
    }
    removePossible();
  }
}

init();

// For testing
window.state = state;
