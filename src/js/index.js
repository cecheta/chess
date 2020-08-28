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

let state;

function init() {
  state = {
    pieces: [],
    squares: [],
    currentPiece: null,
    player: 1,
    playing: false,
  };

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

  for (let i = 0; i <= 7; i++) {
    const id = String.fromCharCode(i + 65) + '1';
    const piece = iterator.next().value;
    state.pieces.push(piece);
    state.squares.push(new Square(id, piece));
  }

  for (let i = 0; i <= 7; i++) {
    const id = String.fromCharCode(i + 65) + '2';
    const piece = iterator.next().value;
    state.pieces.push(piece);
    state.squares.push(new Square(id, piece));
  }

  for (let j = 3; j <= 6; j++) {
    for (let i = 0; i <= 7; i++) {
      const id = String.fromCharCode(i + 65) + j;
      state.squares.push(new Square(id, null));
    }
  }

  for (let i = 0; i <= 7; i++) {
    const id = String.fromCharCode(i + 65) + '8';
    const piece = iterator.next().value;
    state.pieces.push(piece);
    state.squares.push(new Square(id, piece));
  }

  for (let i = 0; i <= 7; i++) {
    const id = String.fromCharCode(i + 65) + '7';
    const piece = iterator.next().value;
    state.pieces.push(piece);
    state.squares.push(new Square(id, piece));
  }

  const squares = Array.from(document.querySelectorAll('.square'));
  squares.forEach((square) => {
    square.addEventListener('dragstart', handleDragStart);
    square.addEventListener('drop', handleDrop);
    square.addEventListener('dragover', handleDragOver);
    square.addEventListener('click', handleClick);
  });

  document.addEventListener('mousedown', preventDrag);

  if (document.querySelector('.card')) {
    const card = document.querySelector('.card');
    card.parentElement.removeChild(card);
    boardView.resetPieces();
  }

  state.playing = true;
}

function handleClick(e) {
  if (state.playing) {
    const squareElement = e.target.closest('.square');
    const square = utils.getSquare(squareElement.id, state.squares);

    if (squareElement.querySelector('.possible')) {
      const oldSquare = state.currentPiece.getSquare(state.squares);
      movePiece(oldSquare, square);
      checkForCheckmate();
      removePossible();
    } else if (square.piece && square.piece.player === state.player) {
      if (!square.piece.movesVisible) {
        removePossible();
        let possibleSquares = square.piece.getPossibleMoves(state, state.player);
        possibleSquares = possibleSquares.filter((el) => utils.checkSquare(state, square.piece, el, state.player));
        if (possibleSquares.length !== 0) {
          boardView.renderPossible(possibleSquares);
          square.piece.movesVisible = true;
          state.currentPiece = square.piece;
        }
      } else {
        removePossible();
      }
    }
  }
}

function handleDragStart(e) {
  const squareElement = e.target.closest('.square');
  const square = utils.getSquare(squareElement.id, state.squares);

  if (square.piece.player === state.player && state.playing) {
    e.dataTransfer.setData('text', e.target.parentElement.id);
    removePossible();
    let possibleSquares = square.piece.getPossibleMoves(state, state.player);
    possibleSquares = possibleSquares.filter((el) => utils.checkSquare(state, square.piece, el, state.player));
    if (possibleSquares.length !== 0) {
      boardView.renderPossible(possibleSquares);
      square.piece.movesVisible = true;
      state.currentPiece = square.piece;
    } else {
      e.preventDefault();
    }
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
    checkForCheckmate();
    removePossible();
  }
}

function preventDrag(e) {
  if (e.preventDefault && e.target.tagName.toLowerCase() !== 'img') {
    e.preventDefault();
  }
}

function movePiece(oldSquare, newSquare) {
  if (oldSquare !== newSquare) {
    if (state.pieces.find((piece) => piece.checked === true)) {
      boardView.removeCheck();
    }

    if (oldSquare.piece.constructor.name === 'Pawn' && !newSquare.piece && oldSquare.id.charAt(0) !== newSquare.id.charAt(0)) {
      const enPassant = `${newSquare.id.charAt(0)}${oldSquare.id.charAt(1)}`;
      const enPassantSquare = utils.getSquare(enPassant, state.squares);
      boardView.removePiece(enPassantSquare, true);
      const pieceIndex = state.pieces.indexOf(enPassantSquare.piece);
      state.pieces.splice(pieceIndex, 1);
      enPassantSquare.piece = null;
    }

    if (newSquare.piece) {
      boardView.removePiece(newSquare, true);
      const pieceIndex = state.pieces.indexOf(newSquare.piece);
      state.pieces.splice(pieceIndex, 1);
    }

    newSquare.piece = oldSquare.piece;
    oldSquare.piece = null;
    state.squares.forEach((square) => {
      if (square.piece && square.piece.firstMove) {
        square.piece.firstMove = false;
      }
    });
    if (newSquare.piece.constructor.name === 'Pawn' && newSquare.piece.hasMoved === false) {
      newSquare.piece.firstMove = true;
    }
    newSquare.piece.hasMoved = true;
    boardView.movePiece(oldSquare.id, newSquare.id);

    if (newSquare.piece.constructor.name === 'King' && newSquare.piece.castlingSquares.find((square) => square[0] === newSquare.id)) {
      const rook = newSquare.piece.castlingSquares.find((square) => square[0] === newSquare.id)[1];
      const rookSquareId = rook.getSquare(state.squares).id;
      let square;
      if (rookSquareId.charAt(0) === 'A') {
        square = utils.getSquare('D' + rookSquareId.charAt(1), state.squares);
      } else if (rookSquareId.charAt(0) === 'H') {
        square = utils.getSquare('F' + rookSquareId.charAt(1), state.squares);
      }
      const oldSquare = utils.getSquare(rookSquareId, state.squares);
      square.piece = rook;
      oldSquare.piece = null;
      rook.hasMoved = true;
      boardView.movePiece(rookSquareId, square.id);
    }

    if (newSquare.piece.constructor.name === 'Pawn' && (newSquare.id.charAt(1) === '1' || newSquare.id.charAt(1) === '8')) {
      const pawn = newSquare.piece;
      const images = boardView.renderPromotionChoice(pawn, newSquare);
      images.forEach((image) => image.addEventListener('click', promotePiece));
      state.playing = false;
    }
  }
}

function checkForCheckmate() {
  state.pieces.filter((piece) => piece.constructor.name === 'King').forEach((king) => (king.checked = false));
  const attackedSquares = utils.getAllAttackedSquares(state, state.player);
  for (let square of attackedSquares) {
    const piece = utils.getSquare(square, state.squares).piece;
    if (piece && piece.constructor.name === 'King' && piece.player !== state.player) {
      if (utils.getAllPossibleMoves(state, 3 - state.player).length === 0) {
        boardView.renderWinBox(state.player);
        state.playing = false;
        document.querySelector('.play-again').addEventListener('click', init);
      } else {
        const king = state.pieces.find((piece) => piece.constructor.name === 'King' && piece.player === 3 - state.player);
        boardView.renderCheck(king, state.squares);
        king.checked = true;
      }
      break;
    }
  }

  if (state.playing) {
    state.player = 3 - state.player;
    if (utils.getAllPossibleMoves(state, state.player).length === 0) {
      boardView.renderDrawBox(state.player);
      state.playing = false;
      document.querySelector('.play-again').addEventListener('click', init);

    }
  }
}

function promotePiece(e) {
  let newPiece;
  let promotionChoice = e.target.dataset.piece;
  if (promotionChoice === 'bishop') {
    newPiece = new Bishop(state.player);
  } else if (promotionChoice === 'knight') {
    newPiece = new Knight(state.player);
  } else if (promotionChoice === 'rook') {
    newPiece = new Rook(state.player);
  } else {
    promotionChoice = 'queen';
    newPiece = new Queen(state.player);
  }
  const newSquare = state.squares.find((square) => square.piece && square.piece.constructor.name === 'Pawn' && (square.id.charAt(1) === '1' || square.id.charAt(1) === '8'));

  const pawn = newSquare.piece;
  newSquare.piece = newPiece;
  const pawnIndex = state.pieces.indexOf(pawn);
  state.pieces.splice(pawnIndex, 1);
  state.pieces.push(newPiece);
  boardView.removePiece(newSquare);
  boardView.renderPiece(promotionChoice, newSquare);
  boardView.removePromotionChoice();
  state.playing = true;
  checkForCheckmate();
}

function removePossible() {
  boardView.removePossible();
  state.pieces.forEach((piece) => {
    piece.movesVisible = false;
  });
  state.currentPiece = null;
}

init();

// For testing
window.state = state;
