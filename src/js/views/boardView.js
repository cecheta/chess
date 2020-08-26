import queenLight from '../../img/pieces/queen_light.svg';
import bishopLight from '../../img/pieces/bishop_light.svg';
import knightLight from '../../img/pieces/knight_light.svg';
import rookLight from '../../img/pieces/rook_light.svg';
import queenDark from '../../img/pieces/queen_dark.svg';
import bishopDark from '../../img/pieces/bishop_dark.svg';
import knightDark from '../../img/pieces/knight_dark.svg';
import rookDark from '../../img/pieces/rook_dark.svg';

export function renderPossible(squaresArr) {
  const markup = '<div class="possible" draggable="false"></div>';
  squaresArr.forEach((square) => {
    document.querySelector(`#${square}`).insertAdjacentHTML('beforeend', markup);
  });
}

export function renderPiece(piece, square) {
  const newPiece = new Image();
  if (square.piece.player === 1) {
    if (piece === 'queen') {
      newPiece.src = queenLight;
    } else if (piece === 'bishop') {
      newPiece.src = bishopLight;
    } else if (piece === 'knight') {
      newPiece.src = knightLight;
    } else if (piece === 'rook') {
      newPiece.src = rookLight;
    }
  } else {
    if (piece === 'queen') {
      newPiece.src = queenDark;
    } else if (piece === 'bishop') {
      newPiece.src = bishopDark;
    } else if (piece === 'knight') {
      newPiece.src = knightDark;
    } else if (piece === 'rook') {
      newPiece.src = rookDark;
    }
  }

  document.querySelector(`#${square.id}`).appendChild(newPiece);
  resizePiece(newPiece);
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

export function removePiece(newSquare) {
  const piece = document.querySelector(`#${newSquare.id} > img`);
  piece.parentElement.removeChild(piece);
}

export function renderPromotionChoice(pawn, square) {
  const squareElement = document.querySelector(`#${square.id}`);
  const title = document.querySelector('.container');
  title.insertAdjacentHTML('beforeend', '<div class="promotion">');
  const selectionBox = document.querySelector('.promotion');

  const images = [new Image(), new Image(), new Image(), new Image()];

  images[0].src = pawn.player === 1 ? queenLight : queenDark;
  images[1].src = pawn.player === 1 ? bishopLight : bishopDark;
  images[2].src = pawn.player === 1 ? knightLight : knightDark;
  images[3].src = pawn.player === 1 ? rookLight : rookDark;

  const iterator = images[Symbol.iterator]();

  iterator.next().value.setAttribute('data-piece', 'queen');
  iterator.next().value.setAttribute('data-piece', 'bishop');
  iterator.next().value.setAttribute('data-piece', 'knight');
  iterator.next().value.setAttribute('data-piece', 'rook');

  images.forEach((image, index) => {
    image.setAttribute('draggable', 'false');
    image.setAttribute('data-order', index);
    selectionBox.appendChild(image);
    resizePiece(image);
  });

  const boxWidth = squareElement.getBoundingClientRect().width;
  const edgeWidth = document.querySelector('.edge-vertical').getBoundingClientRect().width;
  const squareColumn = squareElement.id.charAt(0);
  let factor = squareColumn.charCodeAt(0) - 64;
  if (factor === 8) factor = 6;
  selectionBox.style.left = `${edgeWidth + boxWidth * factor}px`;

  if (pawn.player === 1) {
    selectionBox.style.top = `${-squareElement.getBoundingClientRect().height * 8}px`;
  } else {
    selectionBox.style.bottom = `${boxWidth * 4 + parseInt(getComputedStyle(selectionBox).getPropertyValue('border-width').replace('px', '')) * 2}px`;
  }
  selectionBox.style.width = `${boxWidth}px`;

  return images;
}

export function removePromotionChoice() {
  const box = document.querySelector('.promotion');
  box.parentElement.removeChild(box);
}

export function resizePiece(piece) {
  const boxWidth = document.querySelector('.square').getBoundingClientRect().width;
  if (piece) {
    piece.style.width = `${boxWidth}px`;
  } else {
    const pieces = Array.from(document.querySelectorAll('.piece'));
    pieces.forEach((piece) => {
      piece.style.width = `${boxWidth}px`;
    });
  }
}

export function renderCheck(king, allSquares) {
  const kingSquare = king.getSquare(allSquares);
  const kingElement = document.querySelector(`#${kingSquare.id}`);
  const kingImage = kingElement.querySelector('img');

  const elementHeight = kingElement.getBoundingClientRect().height;
  kingElement.style.padding = `0 0 ${elementHeight - 2 * 4}px`;

  kingElement.classList.add('check');
  kingImage.classList.add('check');
}

export function removeCheck() {
  debugger;
  const checkedElements = document.querySelectorAll('.check');
  Array.from(checkedElements).forEach((el) => el.classList.remove('check'));
  document.querySelector('div.square[style]').removeAttribute('style');
}
