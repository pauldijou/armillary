function path(end) {
  const result = [];
  let cursor = end;
  while (cursor) {
    result.unshift(cursor.node);
    cursor = cursor.parent;
  }
  return result;
}

export function formatResult(lastNode, fail) {
  return {
    success: fail === undefined,
    cause: fail,
    distance: (lastNode && lastNode.distance) || 0,
    path: path(lastNode)
  };
}
