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
  const res = {
    success: fail === undefined,
    cause: fail,
    distance: lastNode && lastNode.distance || 0,
    path: lastNode && path(lastNode) || []
  };
  return res;
}
