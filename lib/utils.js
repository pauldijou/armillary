const params = Symbol();

function clean(list) {
  for (let i = 0, l = list.length; i < l; ++i) {
    delete list[i][params];
  }
}

function path(end) {
  const result = [];
  let cursor = end;
  while (cursor) {
    result.push(cursor);
    cursor = cursor[params].parent;
  }
  return result.reverse();
}

function result(success, lastNode, cleaners) {
  const res = {
    success: success,
    cost: lastNode && lastNode[params].cost || 0,
    path: lastNode && path(lastNode) || []
  };
  clean(cleaners || []);
  return res;
}

export default {
  params: params,
  clean: clean,
  path: path,
  result: result
}
