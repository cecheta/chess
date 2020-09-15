import * as images from '../shared/images';

export function addToCaptured(player, type) {
  const container = document.querySelector(`div[data-player="${player}"]`);
  const image = new Image();
  if (player === 1) {
    switch (type) {
      case 'Pawn':
        image.src = images.pawnLight;
        break;
      case 'Rook':
        image.src = images.rookLight;
        break;
      case 'Knight':
        image.src = images.knightLight;
        break;
      case 'Bishop':
        image.src = images.bishopLight;
        break;
      case 'Queen':
        image.src = images.queenLight;
        break;
      case 'King':
        image.src = images.kingLight;
        break;
    }
  } else if (player === 2) {
    switch (type) {
      case 'Pawn':
        image.src = images.pawnDark;
        break;
      case 'Rook':
        image.src = images.rookDark;
        break;
      case 'Knight':
        image.src = images.knightDark;
        break;
      case 'Bishop':
        image.src = images.bishopDark;
        break;
      case 'Queen':
        image.src = images.queenDark;
        break;
      case 'King':
        image.src = images.kingDark;
        break;
    }
  }
  image.setAttribute('draggable', 'false');
  image.className = 'captured';
  container.appendChild(image);
}
