import * as capturedView from './capturedView';
import * as images from '../shared/images';

export function renderPossible(squaresArr) {
  const markup = '<div class="possible"></div>';
  squaresArr.forEach((square) => {
    document.querySelector(`#${square}`).insertAdjacentHTML('beforeend', markup);
  });
}

export function renderPromotedPiece(piece, square) {
  const newPiece = new Image();
  if (square.piece.player === 1) {
    switch (piece) {
      case 'queen':
        newPiece.src = images.queenLight;
        break;
      case 'bishop':
        newPiece.src = images.bishopLight;
        break;
      case 'knight':
        newPiece.src = images.knightLight;
        break;
      case 'rook':
        newPiece.src = images.rookLight;
        break;
    }
  } else if (square.piece.player === 2) {
    switch (piece) {
      case 'queen':
        newPiece.src = images.queenDark;
        break;
      case 'bishop':
        newPiece.src = images.bishopDark;
        break;
      case 'knight':
        newPiece.src = images.knightDark;
        break;
      case 'rook':
        newPiece.src = images.rookDark;
        break;
    }
  }

  newPiece.className = 'piece';
  newPiece.setAttribute('draggable', 'false');
  document.querySelector(`#${square.id}`).appendChild(newPiece);
}

export function removePossible() {
  const dots = Array.from(document.querySelectorAll('.possible'));
  dots.forEach((dot) => {
    dot.parentElement.removeChild(dot);
  });
}

export function movePiece(oldSquareId, newSquareId) {
  const square = document.querySelector(`#${newSquareId}`);
  const piece = document.querySelector(`#${oldSquareId} > img`);
  square.appendChild(piece);
}

export function removePiece(newSquare, captured) {
  const piece = document.querySelector(`#${newSquare.id} > img`);
  piece.parentElement.removeChild(piece);

  if (captured) {
    capturedView.addToCaptured(newSquare.piece.player, newSquare.piece.constructor.name);
    console.log(newSquare.piece.constructor.name);
  }
}

export function renderCheck(king, allSquares) {
  const kingSquare = king.getSquare(allSquares);
  const kingElement = document.querySelector(`#${kingSquare.id}`);
  const kingImage = kingElement.querySelector('img');

  kingElement.classList.add('check');
  kingImage.classList.add('check');
}

export function removeCheck() {
  const checkedElements = document.querySelectorAll('.check');
  Array.from(checkedElements).forEach((el) => el.classList.remove('check'));
}

export function resetPieces() {
  Array.from(document.querySelectorAll('.piece,.captured')).forEach((image) => {
    image.parentElement.removeChild(image);
  });
  const pieces = [images.rookDark, images.knightDark, images.bishopDark, images.queenDark, images.kingDark, images.bishopDark, images.knightDark, images.rookDark, images.pawnDark, images.pawnDark, images.pawnDark, images.pawnDark, images.pawnDark, images.pawnDark, images.pawnDark, images.pawnDark, images.pawnLight, images.pawnLight, images.pawnLight, images.pawnLight, images.pawnLight, images.pawnLight, images.pawnLight, images.pawnLight, images.rookLight, images.knightLight, images.bishopLight, images.queenLight, images.kingLight, images.bishopLight, images.knightLight, images.rookLight];
  const iterator = pieces[Symbol.iterator]();

  for (let i = 8; i >= 7; i--) {
    for (let j = 0; j <= 7; j++) {
      const square = document.querySelector(`#${String.fromCharCode(j + 65)}${i}`);
      const image = new Image();
      image.src = iterator.next().value;
      image.className = 'piece';
      image.setAttribute('draggable', 'false');
      square.appendChild(image);
    }
  }

  for (let i = 2; i >= 1; i--) {
    for (let j = 0; j <= 7; j++) {
      const square = document.querySelector(`#${String.fromCharCode(j + 65)}${i}`);
      const image = new Image();
      image.src = iterator.next().value;
      image.className = 'piece';
      image.setAttribute('draggable', 'false');
      square.appendChild(image);
    }
  }

  document.querySelector('.play-again-side').textContent = 'Reset';
}

export function changePlayer() {
  const indicators = Array.from(document.querySelectorAll('.indicator'));
  indicators.forEach((indicator) => {
    const player = Number(indicator.getAttribute('data-player'));
    indicator.setAttribute('data-player', `${3 - player}`);
  });
}
