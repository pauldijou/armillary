import * as HayStack from './hayStack.js';

const params = Symbol();

// A Node is just a JavaScript Object
// Options:
// - start: Node
// - end: Node
// - neighbors: (Node)-> Array[Node]
// - heuristic: (fromNode, toNode)-> Number
// - weight: Number
// - cost: (fromNode, toNode, [data])-> Number || false
// - maxCost: Number
// - timeout: Number
// - clean: Boolean
// - data: Object
export default function aStar(opts) {
  const start = opts.start || throw new Error('You need to specify a starting node');
  const end = opts.end || throw new Error('You need to specify an ending node');
  const neighbors = opts.neighbors || throw new Error('You need to specify a [neighbors] function');
  const heuristic =  = opts.heuristic || function () { return 1; };
  const weight = opts.weight || 1;
  const cost = opts.cost || function () { return 1; };
  const maxCost = opts.maxCost || Infinity;
  const timeout = opts.timeout;
  const nodes = new HayStack( (a, b) => a[params].rank - b[params].rank } );
  const cleaners = [];

  // Init lists
  start[params] = {
    cost: 0
  };

  nodes.add(start);

  if (opts.clean) { cleaners.push(start); }

  // If timeout, we will return our best node
  const startTime = new Date();
  let bestNode = start;

  // Let's start searching
  while(!nodes.isEmpty()) {
    if (opts.timeout && (new Date() - startTime > opts.timeout)) {
      return utils.result(false, bestNode, cleaners);
    }

    const currentNode = nodes.shift();
    currentNode[params].closed = true;

    // We did it \o/
    if (currentNode === end) {
      return utils.result(true, currentNode, cleaners);
    }

    const nexts = neighbors(currentNode);
    for (let i = 0, l = nexts.length; i < l; ++i) {
      const neighbor = nexts[i];

      if (neighbor[params] && neighbor[params].closed) {
        // We are already done with this node, let's move to the next one
        continue;
      }

      // The cost to move from the current position to the next one
      const goCost = cost(currentNode, neighbor, opts.data);

      if (isNaN(goCost)) {
        // The neighbor is not reachable from the current node, let's skip it
        continue;
      }

      // The cost to move from the start to the next position
      const totalCost = currentNode[params].cost + goCost;

      if (neighbor[params] && totalCost > neighbor[params].cost) {
        // We already find a shortest way so no need to go further
        continue;
      }

      if (totalCost > maxCost) {
        // It's too expensive to reach the neighbor node, at least using this way
        continue;
      }

      const isNew = !neighbor[params];
      if (isNew) {
        // Init once and for all the heuristic
        neighbor[params] = {
          heuristic: weight * heuristic(neighbor, end)
        };
      }

      const rank = totalCost + neighbor[params].heuristic;
      neighbor[params].parent = currentNode;
      neighbor[params].cost = totalCost;

      // For a HayStack, it's totally different to add a new element
      // compared to updating the rank of an existing one
      if (isNew) {
        neighbor[params].rank = rank;
        nodes.add(neighbor);
        if (opts.clean) { cleaners.push(neighbor) };
      } else {
        nodes.update(neighbor, (item) => item[params].rank = rank);
      }
    }
  }

  // Looks like we search through all nodes and didn't find the end
  return utils.result(false, undefined, cleaners);
}
