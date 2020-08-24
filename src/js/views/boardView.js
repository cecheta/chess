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

export function renderPromotionChoice(pawn, pawnId) {
  const square = document.querySelector(`#${pawnId}`);
  return prompt('Choose promotion piece');
}

export function resizePiece(piece) {
  const width = document.querySelector('.square').getBoundingClientRect().width;
  if (piece) {
    piece.style.width = `${width}px`;
  } else {
    const pieces = Array.from(document.querySelectorAll('.piece'));
    pieces.forEach((piece) => {
      piece.style.width = `${width}px`;
    });
  }
}
