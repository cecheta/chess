export function getSquare(id, allSquares) {
  return allSquares.find((el) => el.id === id);
}

function getAttackingSquaresGeneric(currentLetter, currentDigit, letterSign, digitSign, allSquares) {
  const attackingSquares = [];
  let i = 1;
  let nextSquare = '';

  if (letterSign === 'plus') {
    nextSquare += `${String.fromCharCode(currentLetter.charCodeAt(0) + 1)}`;
  } else if (letterSign === 'minus') {
    nextSquare += `${String.fromCharCode(currentLetter.charCodeAt(0) - 1)}`;
  } else {
    nextSquare += `${String.fromCharCode(currentLetter.charCodeAt(0))}`;
  }

  if (digitSign === 'plus') {
    nextSquare += `${currentDigit + 1}`;
  } else if (digitSign === 'minus') {
    nextSquare += `${currentDigit - 1}`;
  } else {
    nextSquare += `${currentDigit}`;
  }

  while (getSquare(nextSquare, allSquares)) {
    attackingSquares.push(nextSquare);
    if (getSquare(nextSquare, allSquares).piece) {
      break;
    }
    i++;
    nextSquare = '';
    if (letterSign === 'plus') {
      nextSquare += `${String.fromCharCode(currentLetter.charCodeAt(0) + i)}`;
    } else if (letterSign === 'minus') {
      nextSquare += `${String.fromCharCode(currentLetter.charCodeAt(0) - i)}`;
    } else {
      nextSquare += `${String.fromCharCode(currentLetter.charCodeAt(0))}`;
    }

    if (digitSign === 'plus') {
      nextSquare += `${currentDigit + i}`;
    } else if (digitSign === 'minus') {
      nextSquare += `${currentDigit - i}`;
    } else {
      nextSquare += `${currentDigit}`;
    }
  }

  return attackingSquares;
}

export function getAttackingSquaresUpRight(currentLetter, currentDigit, allSquares) {
  return getAttackingSquaresGeneric(currentLetter, currentDigit, 'plus', 'plus', allSquares);
}

export function getAttackingSquaresDownRight(currentLetter, currentDigit, allSquares) {
  return getAttackingSquaresGeneric(currentLetter, currentDigit, 'plus', 'minus', allSquares);
}

export function getAttackingSquaresDownLeft(currentLetter, currentDigit, allSquares) {
  return getAttackingSquaresGeneric(currentLetter, currentDigit, 'minus', 'minus', allSquares);
}

export function getAttackingSquaresUpLeft(currentLetter, currentDigit, allSquares) {
  return getAttackingSquaresGeneric(currentLetter, currentDigit, 'minus', 'plus', allSquares);
}

export function getAttackingSquaresUp(currentLetter, currentDigit, allSquares) {
  return getAttackingSquaresGeneric(currentLetter, currentDigit, 'zero', 'plus', allSquares);
}

export function getAttackingSquaresRight(currentLetter, currentDigit, allSquares) {
  return getAttackingSquaresGeneric(currentLetter, currentDigit, 'plus', 'zero', allSquares);
}

export function getAttackingSquaresDown(currentLetter, currentDigit, allSquares) {
  return getAttackingSquaresGeneric(currentLetter, currentDigit, 'zero', 'minus', allSquares);
}

export function getAttackingSquaresLeft(currentLetter, currentDigit, allSquares) {
  return getAttackingSquaresGeneric(currentLetter, currentDigit, 'minus', 'zero', allSquares);
}

export function getAllAttackedSquares(state) {
  const opponentPieces = state.pieces.filter((piece) => piece.player !== state.player);
  const allAttackedSquares = [];
  opponentPieces.forEach((piece) => {
    allAttackedSquares.push(...piece.getAttackedSquares(state.squares));
  });
  return Array.from(new Set(allAttackedSquares));
}

export function checkSquare(state, piece, newSquareId) {
  const oldSquare = piece.getSquare(state.squares);
  const newSquare = getSquare(newSquareId, state.squares);

  let removedPiece;
  if (newSquare.piece) {
    const pieceIndex = state.pieces.indexOf(newSquare.piece);
    removedPiece = state.pieces.splice(pieceIndex, 1)[0];
  }

  let tempPiece = null;
  if (newSquare.piece) {
    tempPiece = newSquare.piece;
  }
  newSquare.piece = oldSquare.piece;
  oldSquare.piece = null;

  const attackedSquares = getAllAttackedSquares(state);
  const king = state.pieces.find((piece) => piece.player === state.player && piece.constructor.name === 'King');
  const kingId = king.getSquare(state.squares).id;
  let validMove = true;
  if (attackedSquares.find((square) => square === kingId)) {
    validMove = false;
  }

  if (removedPiece) {
    state.pieces.push(removedPiece);
  }
  oldSquare.piece = newSquare.piece;
  newSquare.piece = tempPiece;

  return validMove;
}
