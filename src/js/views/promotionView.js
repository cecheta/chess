import * as images from '../shared/images';

export function renderPromotionChoice(pawn, square) {
  const squareElement = document.querySelector(`#${square.id}`);
  const title = document.querySelector('.board');
  title.insertAdjacentHTML('beforeend', '<div class="promotion"></div>');
  const selectionBox = document.querySelector('.promotion');

  const newImages = [new Image(), new Image(), new Image(), new Image()];

  newImages[0].src = pawn.player === 1 ? images.queenLight : images.queenDark;
  newImages[1].src = pawn.player === 1 ? images.bishopLight : images.bishopDark;
  newImages[2].src = pawn.player === 1 ? images.knightLight : images.knightDark;
  newImages[3].src = pawn.player === 1 ? images.rookLight : images.rookDark;

  const iterator = newImages[Symbol.iterator]();

  iterator.next().value.setAttribute('data-piece', 'queen');
  iterator.next().value.setAttribute('data-piece', 'bishop');
  iterator.next().value.setAttribute('data-piece', 'knight');
  iterator.next().value.setAttribute('data-piece', 'rook');

  newImages.forEach((image, index) => {
    image.setAttribute('draggable', 'false');
    image.setAttribute('data-order', index);
    image.className = 'promotion-piece';
    selectionBox.appendChild(image);
  });

  const squareColumn = squareElement.id.charAt(0);
  let factor = squareColumn.charCodeAt(0) - 64;
  if (factor === 8) factor = 6;

  const edge = document.querySelector('.square').getBoundingClientRect().left - document.querySelector('.board').getBoundingClientRect().left;
  const squareWidth = document.querySelector('.square').getBoundingClientRect().width;

  selectionBox.style.left = `${edge + squareWidth * factor}px`;

  if (pawn.player === 1) {
    selectionBox.setAttribute('data-player', '1');
  } else {
    selectionBox.setAttribute('data-player', '2');
  }

  return newImages;
}

export function removePromotionChoice() {
  const box = document.querySelector('.promotion');
  if (box) {
    box.parentElement.removeChild(box);
  }
}

export function resizePromotionChoice(allSquares) {
  const container = document.querySelector('.promotion');
  if (container) {
    const promotionSquare = allSquares.find((square) => square.piece && square.piece.constructor.name === 'Pawn' && (square.id.charAt(1) === '1' || square.id.charAt(1) === '8'));
    const squareColumn = promotionSquare.id.charAt(0);
    let factor = squareColumn.charCodeAt(0) - 64;
    if (factor === 8) factor = 6;
    const edge = document.querySelector('.square').getBoundingClientRect().left - document.querySelector('.board').getBoundingClientRect().left;
    const squareWidth = document.querySelector('.square').getBoundingClientRect().width;
    container.style.left = `${edge + squareWidth * factor}px`;
  }
}
