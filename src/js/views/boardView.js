export function renderPossible(squaresArr) {
  const markup = '<div class="possible"></div>';
  squaresArr.forEach((square) => {
    document.querySelector(`#${square}`).insertAdjacentHTML('beforeend', markup);
  });
}

export function removePossible() {
  const dots = Array.from(document.querySelectorAll('.possible'));
  dots.forEach((dot) => {
    dot.parentElement.removeChild(dot);
  });
}

export function movePiece(id, square) {
  const piece = document.querySelector(`#${id}`).firstElementChild;
  square.appendChild(piece);
}

export function removePiece(square) {
  const piece = square.firstElementChild;
  square.removeChild(piece);
}
