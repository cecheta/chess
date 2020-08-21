export function renderPossible(squaresArr) {
  const markup = '<div class="possible"></div>';
  squaresArr.forEach((square) => {
    document.querySelector(`#${square}`).insertAdjacentHTML('afterbegin', markup);
  })
}