import pawnLight from '../../img/pieces/pawn_light.svg';
import rookLight from '../../img/pieces/rook_light.svg';
import knightLight from '../../img/pieces/knight_light.svg';
import bishopLight from '../../img/pieces/bishop_light.svg';
import queenLight from '../../img/pieces/queen_light.svg';
import kingLight from '../../img/pieces/king_light.svg';
import pawnDark from '../../img/pieces/pawn_dark.svg';
import rookDark from '../../img/pieces/rook_dark.svg';
import knightDark from '../../img/pieces/knight_dark.svg';
import bishopDark from '../../img/pieces/bishop_dark.svg';
import queenDark from '../../img/pieces/queen_dark.svg';
import kingDark from '../../img/pieces/king_dark.svg';

export function renderPossible(squaresArr) {
  const markup = '<div class="possible"></div>';
  squaresArr.forEach((square) => {
    document.querySelector(`#${square}`).insertAdjacentHTML('beforeend', markup);
  });
}

export function renderPiece(piece, square) {
  const newPiece = new Image();
  if (square.piece.player === 1) {
    switch (piece) {
      case 'queen':
        newPiece.src = queenLight;
        break;
      case 'bishop':
        newPiece.src = bishopLight;
        break;
      case 'knight':
        newPiece.src = knightLight;
        break;
      case 'rook':
        newPiece.src = rookLight;
        break;
    }
  } else if (square.piece.player === 2) {
    switch (piece) {
      case 'queen':
        newPiece.src = queenDark;
        break;
      case 'bishop':
        newPiece.src = bishopDark;
        break;
      case 'knight':
        newPiece.src = knightDark;
        break;
      case 'rook':
        newPiece.src = rookDark;
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
    addToCaptured(newSquare.piece.player, newSquare.piece.constructor.name);
  }
}

function addToCaptured(player, type) {
  const container = document.querySelector(`div[data-player="${player}"]`);
  const image = new Image();
  if (player === 1) {
    switch (type) {
      case 'Pawn':
        image.src = pawnLight;
        break;
      case 'Rook':
        image.src = rookLight;
        break;
      case 'Knight':
        image.src = knightLight;
        break;
      case 'Bishop':
        image.src = bishopLight;
        break;
      case 'Queen':
        image.src = queenLight;
        break;
      case 'King':
        image.src = kingLight;
        break;
    }
  } else if (player === 2) {
    switch (type) {
      case 'Pawn':
        image.src = pawnDark;
        break;
      case 'Rook':
        image.src = rookDark;
        break;
      case 'Knight':
        image.src = knightDark;
        break;
      case 'Bishop':
        image.src = bishopDark;
        break;
      case 'Queen':
        image.src = queenDark;
        break;
      case 'King':
        image.src = kingDark;
        break;
    }
  }
  image.setAttribute('draggable', 'false');
  image.className = 'captured';
  container.appendChild(image);
}

export function renderPromotionChoice(pawn, square) {
  const squareElement = document.querySelector(`#${square.id}`);
  const title = document.querySelector('.board');
  title.insertAdjacentHTML('beforeend', '<div class="promotion"></div>');
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
    image.className = 'promotion-piece';
    selectionBox.appendChild(image);
  });

  const squareColumn = squareElement.id.charAt(0);
  let factor = squareColumn.charCodeAt(0) - 64;
  if (factor === 8) factor = 6;
  selectionBox.style.left = `${3.4 + 9.775 * factor}vh`;

  if (pawn.player === 1) {
    selectionBox.setAttribute('data-player', '1');
  } else {
    selectionBox.setAttribute('data-player', '2');
  }

  return images;
}

export function removePromotionChoice() {
  const box = document.querySelector('.promotion');
  box.parentElement.removeChild(box);
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

export function renderWinBox(player) {
  const markup = `
    <div class="card">
      <h2>Game Over</h2>
      <p>Checkmate: ${player === 1 ? 'White' : 'Black'} Wins</p>
      <button class="play-again">Play Again?</button>
      <i class="fas fa-times"></i>
    </div>
  `;
  document.querySelector('.board').insertAdjacentHTML('beforeend', markup);
}

export function renderDrawBox() {
  const markup = `
    <div class="card">
      <h2>Game Over</h2>
      <p>Stalemate</p>
      <button class="play-again">Play Again?</button>
      <i class="fas fa-times"></i>
    </div>
  `;
  document.querySelector('.board').insertAdjacentHTML('beforeend', markup);
}

export function resetPieces() {
  Array.from(document.querySelectorAll('.piece,.captured')).forEach((image) => {
    image.parentElement.removeChild(image);
  });
  const pieces = [rookDark, knightDark, bishopDark, queenDark, kingDark, bishopDark, knightDark, rookDark, pawnDark, pawnDark, pawnDark, pawnDark, pawnDark, pawnDark, pawnDark, pawnDark, pawnLight, pawnLight, pawnLight, pawnLight, pawnLight, pawnLight, pawnLight, pawnLight, rookLight, knightLight, bishopLight, queenLight, kingLight, bishopLight, knightLight, rookLight];
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

export function hideCard() {
  const card = document.querySelector('.card');
  card.parentElement.removeChild(card);
  document.querySelector('.play-again-side').textContent = 'Play Again?';
}

export function changePlayer() {
  const indicator = document.querySelector('.indicator');
  if (indicator.getAttribute('data-player') === '1') {
    indicator.setAttribute('data-player', '2');
  } else {
    indicator.setAttribute('data-player', '1');
  }
}
