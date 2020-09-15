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

export function hideCard() {
  const card = document.querySelector('.card');
  card.parentElement.removeChild(card);
  document.querySelector('.play-again-side').textContent = 'Play Again?';
}
