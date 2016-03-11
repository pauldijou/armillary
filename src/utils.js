export const paramsKey = Symbol();

function clean(list) {
  for (let i = 0, l = list.length; i < l; ++i) {
    delete list[i][paramsKey];
  }
}

function path(end) {
  const result = [];
  let cursor = end;
  while (cursor) {
    result.push(cursor);
    cursor = cursor[paramsKey].parent;
  }
  return result.reverse();
}

export function formatResult(success, cause, lastNode, cleaners) {
  const res = {
    success,
    cause,
    distance: lastNode && lastNode[paramsKey].distance || 0,
    path: lastNode && path(lastNode) || []
  };
  clean(cleaners || []);
  return res;
}
