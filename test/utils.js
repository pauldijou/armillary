function isStart(cell) {
  return cell === 's';
}

function isEnd(cell) {
  return cell === 'e';
}

function getCost(cell) {
  const parsed = parseInt(cell, 10);
  if (cell === '#') {
    return false;
  } else if (Number.isFinite(parsed)) {
    return parsed;
  }
  return 1;
}

// Parse a maze, which is an array of strings
// Return an object:
// - start
// - end
// - nodes[{x, y, cost}]
export function parseMaze(maze) {
  let start, end;
  const nodes = [];

  maze.forEach((row, y) => {
    row.split('').forEach((cell, x) => {
      const node = { x, y, cost: getCost(cell) };
      nodes.push(node);
      if (isStart(cell)) { start = node; }
      if (isEnd(cell)) { end = node; }
    });
  });

  return { start, end, nodes };
}

function findNode(x, y, nodes) {
  return nodes.reduce((result, node) => {
    return result || (node.x === x && node.y === y && node);
  }, false);
}

export const mazeNeighbors = (nodes) => (node) => {
  return [
    findNode(node.x - 1, node.y + 0, nodes),
    findNode(node.x + 1, node.y + 0, nodes),
    findNode(node.x + 0, node.y - 1, nodes),
    findNode(node.x + 0, node.y + 1, nodes),
  ].filter(x => x);
};

// Allow diagonals
export const mazeNeighborsAlt = (nodes) => (node) => {
  return [
    findNode(node.x - 1, node.y - 1, nodes),
    findNode(node.x - 1, node.y + 0, nodes),
    findNode(node.x - 1, node.y + 1, nodes),
    findNode(node.x + 0, node.y - 1, nodes),

    findNode(node.x + 0, node.y + 1, nodes),
    findNode(node.x + 1, node.y - 1, nodes),
    findNode(node.x + 1, node.y + 0, nodes),
    findNode(node.x + 1, node.y + 1, nodes),
  ].filter(x => x);
};
