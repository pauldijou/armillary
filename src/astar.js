// import * as HayStack from './hayStack.js';
import Heap from 'heapster';
import { paramsKey, formatResult } from './utils';

// A Node is just a JavaScript Object
// Options:
// - start: Node
// - end: Node
// - neighbors: (Node)-> Array[Node]
// - heuristic: (fromNode, toNode)-> Number
// - weight: Number
// - distance: (fromNode, toNode, [data])-> Number || false
// - maxDistance: Number
// - timeout: Number
// - clean: Boolean
// - data: Object
export default function aStar(opts) {
  if (!opts.start) { throw new Error('You need to specify a starting node'); }
  if (!opts.end) { throw new Error('You need to specify an ending node'); }
  if (!opts.neighbors) { throw new Error('You need to specify a [neighbors] function'); }

  const start = opts.start;
  const end = opts.end;
  const neighbors = opts.neighbors;
  const heuristic = opts.heuristic || function () { return 0; };
  const weight = opts.weight || 1;
  const distance = opts.distance || function () { return 1; };
  const maxDistance = opts.maxDistance || Infinity;
  const timeout = opts.timeout || false;
  const nodes = new Heap(
    (a, b) => b[paramsKey].rank - a[paramsKey].rank,
    { indexed: true }
  );
  const cleaners = [];

  // Init lists
  start[paramsKey] = {
    distance: 0
  };

  nodes.push(start);

  if (opts.clean) { cleaners.push(start); }

  const startTime = new Date();
  let bestNode = start;

  // Let's start searching
  while(!nodes.isEmpty()) {
    // If timeout, we will return our best node
    if (opts.timeout && (new Date() - startTime > opts.timeout)) {
      return formatResult(false, 'timeout', bestNode, cleaners);
    }

    const currentNode = nodes.pop();
    currentNode[paramsKey].closed = true;

    // We did it \o/
    if (currentNode === end) {
      return formatResult(true, undefined, currentNode, cleaners);
    }

    const nexts = neighbors(currentNode);
    console.log('-----------------------------');
    console.log('current', currentNode.x, currentNode.y, currentNode[paramsKey].rank);

    for (let i = 0, l = nexts.length; i < l; ++i) {
      const neighbor = nexts[i];

      if (neighbor[paramsKey] && neighbor[paramsKey].closed) {
        // We are already done with this node, let's move to the next one
        continue;
      }

      // The distance to move from the current position to the next one
      const goDistance = distance(currentNode, neighbor, opts.data);

      if (!(typeof goDistance === 'number')) {
        // The neighbor is not reachable from the current node, let's skip it
        continue;
      }

      // The distance to move from the start to the next position
      const totalDistance = currentNode[paramsKey].distance + goDistance;

      if (neighbor[paramsKey] && totalDistance > neighbor[paramsKey].distance) {
        // We already find a shortest way so no need to go further
        continue;
      }

      if (totalDistance > maxDistance) {
        // It's too expensive to reach the neighbor node, at least using this way
        continue;
      }

      const isNew = !neighbor[paramsKey];
      if (isNew) {
        // Init once and for all the heuristic
        neighbor[paramsKey] = {
          heuristic: weight * heuristic(neighbor, end)
        };
      }

      neighbor[paramsKey].rank = totalDistance + neighbor[paramsKey].heuristic;
      neighbor[paramsKey].parent = currentNode;
      neighbor[paramsKey].distance = totalDistance;

      console.log(neighbor.x, neighbor.y, isNew, neighbor[paramsKey].distance, neighbor[paramsKey].rank);
      // For a heap, it's totally different to add a new element
      // compared to updating the rank of an existing one
      if (isNew) {
        nodes.push(neighbor);
        if (opts.clean) { cleaners.push(neighbor) };
      } else {
        nodes.update(neighbor);
      }
    }
  }

  // Looks like we search through all nodes and didn't find the end
  return formatResult(false, 'noPath', undefined, cleaners);
}
