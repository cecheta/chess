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
    currentSquare: null,
    player: 1,
    playing: true,
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

  boardView.resetPieces();
  boardView.removePossible();

  const squares = Array.from(document.querySelectorAll('.square'));
  squares.forEach((square) => {
    square.addEventListener('dragstart', handleDragStart);
    square.addEventListener('drop', handleDrop);
    square.addEventListener('dragover', handleDragOver);
    square.addEventListener('click', handleClick);
  });

  const images = Array.from(document.querySelectorAll('.piece'));
  images.forEach((image) => {
    image.addEventListener('touchmove', handleTouchMove);
    image.addEventListener('touchend', handleTouchEnd);
  });

  document.addEventListener('dragend', handleDragEnd);
  document.addEventListener('mousedown', preventDrag);
  document.querySelector('.container').addEventListener('click', playAgain);
  document.querySelector('.container').addEventListener('click', removeCard);

  if (document.querySelector('.card')) {
    const card = document.querySelector('.card');
    card.parentElement.removeChild(card);
  }
  const indicator = document.querySelector('.indicator');
  indicator.setAttribute('data-player', '1');
}

function handleClick(e) {
  if (state.playing) {
    const squareElement = e.currentTarget;
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
      squareElement.querySelector('img').classList.add('dragged');
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
  const squareElement = e.currentTarget;

  if (squareElement.querySelector('.possible')) {
    const oldSquare = utils.getSquare(e.dataTransfer.getData('text'), state.squares);
    const newSquare = utils.getSquare(e.currentTarget.id, state.squares);

    movePiece(oldSquare, newSquare);
    checkForCheckmate();
    removePossible();
  }
}

function handleDragEnd() {
  if (document.querySelector('.dragged')) {
    document.querySelector('.dragged').classList.remove('dragged');
  }
}

function handleTouchMove(e) {
  const squareElement = e.target.closest('.square');
  const square = utils.getSquare(squareElement.id, state.squares);

  if (square.piece.player === state.player && state.playing) {
    removePossible();
    let possibleSquares = square.piece.getPossibleMoves(state, state.player);
    possibleSquares = possibleSquares.filter((el) => utils.checkSquare(state, square.piece, el, state.player));
    if (possibleSquares.length !== 0) {
      state.currentPiece = square.piece;
      boardView.renderPossible(possibleSquares);
      square.piece.movesVisible = true;
      state.currentPiece = square.piece;

      const coordX = event.touches[0].clientX;
      const coordY = event.touches[0].clientY;
      const draggableItemRect = e.target.getBoundingClientRect();
      e.target.classList.add('active');
      e.target.style.transform = `translateX(${coordX - draggableItemRect.width / 2}px) translateY(${coordY - draggableItemRect.height / 2}px)`;
      if (document.elementFromPoint(coordX, coordY)) {
        state.currentSquare = document.elementFromPoint(coordX, coordY).closest('.square');
      } else {
        state.currentSquare = null;
      }
      if (e.target.classList.contains('check')) {
        e.target.classList.remove('check');
      }
    }
  }
}

function handleTouchEnd(e) {
  const squareElement = state.currentSquare;

  if (squareElement && squareElement.querySelector('.possible')) {
    const oldSquare = utils.getSquare(e.composedPath()[1].id, state.squares);
    const newSquare = utils.getSquare(squareElement.id, state.squares);

    movePiece(oldSquare, newSquare);
    checkForCheckmate();
    removePossible();
  }

  if (e.target.parentElement.classList.contains('check')) {
    e.target.classList.add('check');
  }
  e.target.classList.remove('active');
  e.target.removeAttribute('style');

  state.currentSquare = null;
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
    boardView.changePlayer();
    if (utils.getAllPossibleMoves(state, state.player).length === 0) {
      boardView.renderDrawBox();
      state.playing = false;
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

function playAgain(e) {
  if (e.target.className.startsWith('play-again')) init();
}

function removeCard(e) {
  if (e.target.className === 'fas fa-times') boardView.hideCard();
}

init();

window.state = state;
