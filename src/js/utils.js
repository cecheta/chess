export function getSquare(id, allSquares) {
  return allSquares.find((el) => el.id === id);
}